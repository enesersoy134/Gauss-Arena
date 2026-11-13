const { calculateEffectiveMMR } = require('./eloMomentum');

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * Expanding window tolerances by queue wait time (in seconds):
 * 0 - 5s:   MMR_eff <= 50,  |S_A - S_B| <= 1, |R_A - R_B| <= 100
 * 5 - 15s:  MMR_eff <= 100, |S_A - S_B| <= 3, |R_A - R_B| <= 175
 * 15 - 30s: MMR_eff <= 175, no streak limit,  |R_A - R_B| <= 250 (Hard Cap)
 */
function getQueueWindowLimits(waitSeconds) {
  const sec = Math.max(0, Number(waitSeconds) || 0);
  if (sec <= 5) {
    return {
      maxMmrDiff: 50,
      maxStreakDiff: 1,
      maxRealEloDiff: 100,
      stageLabel: '0-5s (Dar Pencere)',
    };
  }
  if (sec <= 15) {
    return {
      maxMmrDiff: 100,
      maxStreakDiff: 3,
      maxRealEloDiff: 175,
      stageLabel: '5-15s (Orta Pencere)',
    };
  }
  return {
    maxMmrDiff: 175,
    maxStreakDiff: Infinity,
    maxRealEloDiff: 250,
    stageLabel: '15-30s (Geniş Pencere - Sert Sınır)',
  };
}

function makePairKey(idA, idB) {
  return [String(idA), String(idB)].sort().join('::');
}

class MatchmakingQueue {
  constructor(options = {}) {
    this.entries = new Map(); // playerId -> QueueEntry
    this.pairwiseMatches = []; // { pairKey, playerAId, playerBId, timestamp }
    this.enableGhost = options.enableGhost !== undefined ? options.enableGhost : true;
  }

  enqueue(ticket) {
    const now = ticket.enqueuedAt || Date.now();
    const subjects = Array.isArray(ticket.subjects)
      ? ticket.subjects.map((s) => String(s).toLowerCase())
      : ['matematik'];
    const effectiveMmr = calculateEffectiveMMR(ticket.elo, ticket.streak);

    const entry = {
      playerId: String(ticket.playerId),
      name: ticket.name || String(ticket.playerId),
      elo: Number(ticket.elo) || 1200,
      streak: Number(ticket.streak) || 0,
      effectiveMmr,
      examType: String(ticket.examType || 'TYT').toUpperCase(),
      subjects,
      mode: ticket.mode || 'ranked',
      tournamentId: ticket.tournamentId || null,
      enqueuedAt: now,
    };

    this.entries.set(entry.playerId, entry);
    return entry;
  }

  dequeue(playerId) {
    return this.entries.delete(String(playerId));
  }

  advanceQueueTime(playerId, bonusSeconds = 5) {
    const entry = this.entries.get(String(playerId));
    if (entry) {
      entry.enqueuedAt -= Number(bonusSeconds) * 1000;
    }
  }

  advanceAllQueueTimes(bonusSeconds = 5) {
    for (const entry of this.entries.values()) {
      entry.enqueuedAt -= Number(bonusSeconds) * 1000;
    }
  }

  recordRankedMatch(playerAId, playerBId, timestamp = Date.now()) {
    if (!playerAId || !playerBId) return;
    if (String(playerAId).startsWith('ghost-') || String(playerBId).startsWith('ghost-')) return;
    this.pairwiseMatches.push({
      pairKey: makePairKey(playerAId, playerBId),
      playerAId: String(playerAId),
      playerBId: String(playerBId),
      timestamp,
    });
  }

  getPairwiseMatchCountLast24h(playerAId, playerBId, now = Date.now()) {
    const key = makePairKey(playerAId, playerBId);
    const cutoff = now - TWENTY_FOUR_HOURS_MS;
    return this.pairwiseMatches.filter((m) => m.pairKey === key && m.timestamp >= cutoff).length;
  }

  evaluatePair(a, b, now = Date.now()) {
    if (a.mode !== b.mode || a. tournamentId !== b.tournamentId) {
      return { compatible: false, reason: 'Farklı oyun modu / turnuva' };
    }
    if (a.examType !== b.examType) {
      return { compatible: false, reason: `Sınav tipi uyuşmuyor (${a.examType} vs ${b.examType})` };
    }
    const commonSubjects = a.subjects.filter((s) => b.subjects.includes(s));
    if (commonSubjects.length === 0) {
      return { compatible: false, reason: 'Ortak seçili ders yok' };
    }

    const pairwiseCount = this.getPairwiseMatchCountLast24h(a.playerId, b.playerId, now);
    if (pairwiseCount >= 2) {
      return {
        compatible: false,
        reason: `24 saatlik ikili maç sınırı doldu (${pairwiseCount}/2 - Win-Trading Koruması)`,
        pairwiseCount,
      };
    }

    const waitA = Math.max(0, (now - a.enqueuedAt) / 1000);
    const waitB = Math.max(0, (now - b.enqueuedAt) / 1000);
    const effectiveWaitSec = Math.max(waitA, waitB);
    const limits = getQueueWindowLimits(effectiveWaitSec);

    const realEloDiff = Math.round(Math.abs(a.elo - b.elo) * 10) / 10;
    const mmrDiff = Math.round(Math.abs(a.effectiveMmr - b.effectiveMmr) * 100) / 100;
    const streakDiff = Math.abs(a.streak - b.streak);

    if (realEloDiff > 250) {
      return {
        compatible: false,
        reason: `Sert Gerçek ELO Sınırı Aşıldı (ΔR=${realEloDiff} > 250)`,
        realEloDiff,
        mmrDiff,
        streakDiff,
        limits,
        pairwiseCount,
      };
    }

    if (realEloDiff > limits.maxRealEloDiff) {
      return {
        compatible: false,
        reason: `Gerçek ELO farkı mevcut pencere sınırında değil (ΔR=${realEloDiff} > ${limits.maxRealEloDiff})`,
        realEloDiff,
        mmrDiff,
        streakDiff,
        limits,
        pairwiseCount,
      };
    }

    if (mmrDiff > limits.maxMmrDiff) {
      return {
        compatible: false,
        reason: `Efektif MMR farkı yüksek (ΔMMR=${mmrDiff} > ${limits.maxMmrDiff})`,
        realEloDiff,
        mmrDiff,
        streakDiff,
        limits,
        pairwiseCount,
      };
    }

    if (streakDiff > limits.maxStreakDiff) {
      return {
        compatible: false,
        reason: `Momentum (Seri) farkı pencereyi bekliyor (ΔS=${streakDiff} > ${limits.maxStreakDiff})`,
        realEloDiff,
        mmrDiff,
        streakDiff,
        limits,
        pairwiseCount,
      };
    }

    return {
      compatible: true,
      reason: `Eşleşmeye Uygun (${limits.stageLabel})`,
      commonSubjects,
      realEloDiff,
      mmrDiff,
      streakDiff,
      limits,
      pairwiseCount,
      effectiveWaitSec: Math.round(effectiveWaitSec * 10) / 10,
    };
  }

  tick(now = Date.now(), allowGhost = this.enableGhost) {
    const list = Array.from(this.entries.values()).sort((a, b) => a.enqueuedAt - b.enqueuedAt);
    const matchedIds = new Set();
    const matches = [];
    const ghostMatches = [];

    // 1. Evaluate all human pairs and pick best MMR match first
    const candidatePairs = [];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const evalResult = this.evaluatePair(a, b, now);
        if (evalResult.compatible) {
          candidatePairs.push({ a, b, evalResult });
        }
      }
    }

    candidatePairs.sort((x, y) => x.evalResult.mmrDiff - y.evalResult.mmrDiff);

    for (const pair of candidatePairs) {
      const { a, b, evalResult } = pair;
      if (matchedIds.has(a.playerId) || matchedIds.has(b.playerId)) continue;
      matchedIds.add(a.playerId);
      matchedIds.add(b.playerId);
      this.entries.delete(a.playerId);
      this.entries.delete(b.playerId);

      matches.push({
        playerA: a,
        playerB: b,
        commonSubjects: evalResult.commonSubjects,
        examType: a.examType,
        mode: a.mode,
        tournamentId: a.tournamentId,
        diagnostics: evalResult,
      });
    }

    // 2. Check > 30s Ghost fallback for remaining players (only if allowGhost is enabled)
    if (allowGhost) {
      for (const entry of list) {
        if (matchedIds.has(entry.playerId)) continue;
        const waitSec = (now - entry.enqueuedAt) / 1000;
        if (waitSec >= 30) {
          matchedIds.add(entry.playerId);
          this.entries.delete(entry.playerId);

        const ghostElo = Math.round(entry.elo + (Math.sign(entry.streak) * 15));
        const ghostPlayer = {
          playerId: `ghost-${entry.playerId}-${now}`,
          name: `Hayalet Rakip (Asenkron Kayıt ~${ghostElo} ELO)`,
          elo: ghostElo,
          streak: entry.streak,
          effectiveMmr: calculateEffectiveMMR(ghostElo, entry.streak),
          examType: entry.examType,
          subjects: entry.subjects,
          isGhost: true,
        };

        ghostMatches.push({
          playerA: entry,
          playerB: ghostPlayer,
          commonSubjects: entry.subjects,
          examType: entry.examType,
          mode: entry.mode,
          tournamentId: entry.tournamentId,
          diagnostics: {
            compatible: true,
            reason: '30sn Kuyruk Süresi Doldu -> Asenkron Ghost Rakip Atandı',
            realEloDiff: Math.abs(entry.elo - ghostElo),
            mmrDiff: Math.abs(entry.effectiveMmr - ghostPlayer.effectiveMmr),
            streakDiff: 0,
            effectiveWaitSec: Math.round(waitSec * 10) / 10,
          },
        });
      }
    }
  }

    // 3. Build rich inspector snapshot for remaining entries
    const remaining = Array.from(this.entries.values());
    const pairDiagnostics = [];
    for (let i = 0; i < remaining.length; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        const evalRes = this.evaluatePair(remaining[i], remaining[j], now);
        pairDiagnostics.push({
          playerAId: remaining[i].playerId,
          playerAName: remaining[i].name,
          playerBId: remaining[j].playerId,
          playerBName: remaining[j].name,
          ...evalRes,
        });
      }
    }

    const queueSnapshot = remaining.map((entry) => {
      const waitSec = Math.max(0, Math.round(((now - entry.enqueuedAt) / 1000) * 10) / 10);
      return {
        ...entry,
        waitSeconds: waitSec,
        windowLimits: getQueueWindowLimits(waitSec),
      };
    });

    return {
      matches,
      ghostMatches,
      queueSnapshot,
      pairDiagnostics,
    };
  }
}

module.exports = {
  MatchmakingQueue,
  getQueueWindowLimits,
};
