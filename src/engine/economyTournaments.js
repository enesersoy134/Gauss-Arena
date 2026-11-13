const { calculateEffectiveMMR } = require('./eloMomentum');
const { getRecommendationsForTopic } = require('./resourceRecommendations');

const WEEKLY_BRACKETS = [
  { tierName: 'Bronz Lig', minElo: 0, maxElo: 1199.9, weeklyCoins: 100, badgeColor: '#cd7f32' },
  { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
  { tierName: 'Altın Lig', minElo: 1400, maxElo: 1599.9, weeklyCoins: 500, badgeColor: '#eab308' },
  { tierName: 'Platin Lig', minElo: 1600, maxElo: 1799.9, weeklyCoins: 850, badgeColor: '#06b6d4' },
  { tierName: 'Elmas Lig', minElo: 1800, maxElo: Infinity, weeklyCoins: 1250, badgeColor: '#a855f7' },
];

function getWeeklyBracket(elo) {
  const r = Number(elo) || 1200;
  for (const b of WEEKLY_BRACKETS) {
    if (r >= b.minElo && r <= b.maxElo) {
      return b;
    }
  }
  return WEEKLY_BRACKETS[1];
}

function createInitialPlayers() {
  const raw = [
    {
      id: 'p1',
      name: 'Ahmet Yılmaz (Standart)',
      roleTag: 'Dengeli Oyuncu',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmet&backgroundColor=f14e13',
      elo: 1250,
      streak: 0,
      coins: 320,
      islerPoints: 45,
      weeklyMatchesPlayed: 14,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p2',
      name: 'Zeynep Kaya (Smurf / +5 Seri)',
      roleTag: 'Yüksek Momentum (1200 ELO, S=+5)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zeynep&backgroundColor=b6e3f4',
      elo: 1200,
      streak: 5,
      coins: 450,
      islerPoints: 60,
      weeklyMatchesPlayed: 8,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p3',
      name: 'Mert Demir (Üst Orta Bant)',
      roleTag: 'Sağlam Rakip (1340 ELO, S=+1)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mert&backgroundColor=c0aede',
      elo: 1340,
      streak: 1,
      coins: 580,
      islerPoints: 80,
      weeklyMatchesPlayed: 15,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p4',
      name: 'Elif Şahin (Üst Lig / Anti-Farm)',
      roleTag: 'Yüksek ELO (1620 ELO, S=+3)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elif&backgroundColor=ffd5dc',
      elo: 1620,
      streak: 3,
      coins: 940,
      islerPoints: 130,
      weeklyMatchesPlayed: 18,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p5',
      name: 'Can Özkan (Win-Trade / Cooldown)',
      roleTag: 'Dengeli Rakip (1240 ELO, S=-1)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Can&backgroundColor=d1d4f9',
      elo: 1240,
      streak: -1,
      coins: 210,
      islerPoints: 20,
      weeklyMatchesPlayed: 12,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p6',
      name: 'Selin Arslan (Düşüş Serisi)',
      roleTag: 'Soğuk Seri (1310 ELO, S=-4)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Selin&backgroundColor=ffdfbf',
      elo: 1310,
      streak: -4,
      coins: 190,
      islerPoints: 25,
      weeklyMatchesPlayed: 6,
      weeklyRewardClaimed: false,
      coupons: [],
    },
  ];

  return raw.map((p) => ({
    ...p,
    revisionTopics: [],
    effectiveMmr: calculateEffectiveMMR(p.elo, p.streak),
    bracket: getWeeklyBracket(p.elo),
  }));
}

function createInitialTournaments() {
  return [
    {
      id: 'tour-tyt-1',
      title: 'Haftalık TYT Büyük Bilgi Turnuvası',
      examType: 'TYT',
      allowedSubjects: ['matematik', 'fizik', 'kimya', 'turkce'],
      status: 'ACTIVE',
      prizePoolDesc: '1.ye 1000 Coin + 100 İşler Puanı | 2.ye 600 Coin + 60 İşler Puanı | 3.ye 350 Coin + 35 İşler Puanı',
      rewardsDistributed: false,
      participants: [
        { playerId: 'p1', name: 'Ahmet Yılmaz (Standart)', points: 60, wins: 2, losses: 0, elo: 1250 },
        { playerId: 'p2', name: 'Zeynep Kaya (Smurf / +5 Seri)', points: 60, wins: 2, losses: 0, elo: 1200 },
        { playerId: 'p3', name: 'Mert Demir (Üst Orta Bant)', points: 35, wins: 1, losses: 1, elo: 1340 },
        { playerId: 'p5', name: 'Can Özkan (Win-Trade / Cooldown)', points: 10, wins: 0, losses: 2, elo: 1240 },
      ],
    },
    {
      id: 'tour-ayt-1',
      title: 'Haftalık AYT Sayısal & Edebiyat Kupası',
      examType: 'AYT',
      allowedSubjects: ['matematik', 'fizik', 'kimya', 'turkce'],
      status: 'ACTIVE',
      prizePoolDesc: '1.ye 1500 Coin + 150 İşler Puanı | 2.ye 900 Coin + 90 İşler Puanı | 3.ye 500 Coin + 50 İşler Puanı',
      rewardsDistributed: false,
      participants: [
        { playerId: 'p4', name: 'Elif Şahin (Üst Lig / Anti-Farm)', points: 90, wins: 3, losses: 0, elo: 1620 },
        { playerId: 'p3', name: 'Mert Demir (Üst Orta Bant)', points: 60, wins: 2, losses: 1, elo: 1340 },
        { playerId: 'p6', name: 'Selin Arslan (Düşüş Serisi)', points: 30, wins: 1, losses: 2, elo: 1310 },
      ],
    },
  ];
}

class GameStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.players = new Map();
    for (const p of createInitialPlayers()) {
      this.players.set(p.id, p);
    }
    this.tournaments = new Map();
    for (const t of createInitialTournaments()) {
      this.tournaments.set(t.id, t);
    }
    this.matchHistory = [];
  }

  refreshPlayerComputed(player) {
    if (!player) return null;
    player.elo = Math.round(Number(player.elo) || 1200);
    player.effectiveMmr = calculateEffectiveMMR(player.elo, player.streak);
    player.bracket = getWeeklyBracket(player.elo);
    return player;
  }

  getPlayers() {
    return Array.from(this.players.values()).map((p) => this.refreshPlayerComputed(p));
  }

  getPlayer(playerId) {
    const p = this.players.get(String(playerId));
    return this.refreshPlayerComputed(p);
  }

  simulateCompleteWeeklyMatches(playerId, targetMatches = 15) {
    const p = this.getPlayer(playerId);
    if (!p) return null;
    p.weeklyMatchesPlayed = Math.max(p.weeklyMatchesPlayed, Number(targetMatches) || 15);
    return p;
  }

  claimWeeklyReward(playerId) {
    const p = this.getPlayer(playerId);
    if (!p) {
      return { ok: false, reason: 'Oyuncu bulunamadı' };
    }
    if (p.weeklyMatchesPlayed < 15) {
      return {
        ok: false,
        reason: `Haftalık ELO Coin ödülü için bu hafta en az 15 maç tamamlamalısınız (Mevcut: ${p.weeklyMatchesPlayed}/15).`,
      };
    }
    if (p.weeklyRewardClaimed) {
      return {
        ok: false,
        reason: 'Bu haftanın ELO dilimi Coin ödülü zaten talep edildi.',
      };
    }

    const bracket = getWeeklyBracket(p.elo);
    p.coins += bracket.weeklyCoins;
    p.weeklyRewardClaimed = true;

    return {
      ok: true,
      tierName: bracket.tierName,
      coinsAwarded: bracket.weeklyCoins,
      newCoinBalance: p.coins,
    };
  }

  convertCoinsToIslerPoints(playerId, coinsToSpend) {
    const p = this.getPlayer(playerId);
    if (!p) {
      return { ok: false, reason: 'Oyuncu bulunamadı' };
    }
    const coins = Math.floor(Number(coinsToSpend) || 0);
    if (coins < 10 || coins % 10 !== 0) {
      return { ok: false, reason: 'En az 10 ve 10\'un katı Coin dönüştürülebilir (10 Coin = 1 İşler Sadakat Puanı).' };
    }
    if (p.coins < coins) {
      return { ok: false, reason: `Yetersiz Coin bakiyesi (Mevcut: ${p.coins} Coin).` };
    }

    const islerPointsAdded = Math.floor(coins / 10);
    p.coins -= coins;
    p.islerPoints += islerPointsAdded;

    const randSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const couponCode = `ISLER-${islerPointsAdded}TL-${randSuffix}`;
    p.coupons.unshift({
      code: couponCode,
      islerPointsUsed: islerPointsAdded,
      discountTl: islerPointsAdded,
      createdAt: new Date().toISOString(),
    });

    return {
      ok: true,
      coinsSpent: coins,
      islerPointsAdded,
      couponCode,
      newCoinBalance: p.coins,
      newIslerPoints: p.islerPoints,
    };
  }

  getTournaments() {
    const list = Array.from(this.tournaments.values());
    for (const t of list) {
      t.participants.sort((a, b) => b.points - a.points || b.wins - a.wins || b.elo - a.elo);
    }
    return list;
  }

  joinTournament(tournamentId, playerId) {
    const t = this.tournaments.get(String(tournamentId));
    const p = this.getPlayer(playerId);
    if (!t || !p) return null;

    const existing = t.participants.find((item) => item.playerId === p.id);
    if (!existing) {
      t.participants.push({
        playerId: p.id,
        name: p.name,
        points: 0,
        wins: 0,
        losses: 0,
        elo: p.elo,
      });
    }
    t.participants.sort((a, b) => b.points - a.points || b.wins - a.wins);
    return t;
  }

  distributeTournamentRewards(tournamentId) {
    const t = this.tournaments.get(String(tournamentId));
    if (!t) return { ok: false, reason: 'Turnuva bulunamadı' };

    t.participants.sort((a, b) => b.points - a.points || b.wins - a.wins || b.elo - a.elo);
    const prizeTable =
      t.examType === 'AYT'
        ? [
            { rank: 1, coins: 1500, islerPoints: 150 },
            { rank: 2, coins: 900, islerPoints: 90 },
            { rank: 3, coins: 500, islerPoints: 50 },
          ]
        : [
            { rank: 1, coins: 1000, islerPoints: 100 },
            { rank: 2, coins: 600, islerPoints: 60 },
            { rank: 3, coins: 350, islerPoints: 35 },
          ];

    const payouts = [];
    t.participants.slice(0, 3).forEach((entry, index) => {
      const prize = prizeTable[index];
      const player = this.getPlayer(entry.playerId);
      if (player && prize) {
        player.coins += prize.coins;
        player.islerPoints += prize.islerPoints;
        payouts.push({
          rank: prize.rank,
          playerId: player.id,
          name: player.name,
          points: entry.points,
          coinsAwarded: prize.coins,
          islerPointsAwarded: prize.islerPoints,
        });
      }
    });

    t.rewardsDistributed = true;
    return {
      ok: true,
      tournamentId: t.id,
      title: t.title,
      payouts,
    };
  }

  recordPlayerMistakes(player, roundHistory = [], isPlayerA = true, examType = 'TYT', completedAt = null) {
    if (!player || !Array.isArray(roundHistory)) return;
    player.revisionTopics = Array.isArray(player.revisionTopics) ? player.revisionTopics : [];
    const timestamp = completedAt || new Date().toISOString();

    for (const round of roundHistory) {
      const ans = isPlayerA ? round.answerA : round.answerB;
      if (!ans || ans.isCorrect) continue;

      const subject = String(round.subject || (round.interactiveQuestion && round.interactiveQuestion.subject) || 'genel').toLowerCase();
      const topic = String(
        round.subTopic ||
          (round.interactiveQuestion && round.interactiveQuestion.topic) ||
          subject
      ).trim();
      const questionText =
        round.text ||
        (round.interactiveQuestion && round.interactiveQuestion.prompt) ||
        round.externalId ||
        'Soru';
      const explanation =
        round.explanation ||
        (round.interactiveQuestion && round.interactiveQuestion.explanation) ||
        null;

      let topicEntry = player.revisionTopics.find(
        (item) => item.topic.toLowerCase() === topic.toLowerCase() && item.subject === subject
      );

      if (!topicEntry) {
        topicEntry = {
          topic,
          subject,
          examType: examType || 'TYT',
          mistakeCount: 0,
          lastMistakeAt: timestamp,
          wrongQuestions: [],
          recommendedResources: getRecommendationsForTopic(subject, topic, examType || 'TYT'),
        };
        player.revisionTopics.push(topicEntry);
      } else if (!Array.isArray(topicEntry.recommendedResources) || topicEntry.recommendedResources.length === 0) {
        topicEntry.recommendedResources = getRecommendationsForTopic(subject, topic, examType || 'TYT');
      }

      topicEntry.mistakeCount += 1;
      topicEntry.lastMistakeAt = timestamp;

      const existingQ = topicEntry.wrongQuestions.find((wq) => wq.externalId === round.externalId);
      if (existingQ) {
        existingQ.failedCount = (existingQ.failedCount || 1) + 1;
        existingQ.failedAt = timestamp;
      } else {
        topicEntry.wrongQuestions.unshift({
          externalId: round.externalId,
          text: questionText,
          explanation,
          difficulty: round.difficulty || 'MEDIUM',
          failedCount: 1,
          failedAt: timestamp,
        });
      }
    }

    player.revisionTopics.sort((a, b) => b.mistakeCount - a.mistakeCount);
  }

  markTopicReviewed(playerId, topic) {
    const p = this.getPlayer(playerId);
    if (!p) return { ok: false, reason: 'Oyuncu bulunamadı' };
    p.revisionTopics = Array.isArray(p.revisionTopics) ? p.revisionTopics : [];
    if (!topic) {
      p.revisionTopics = [];
      return { ok: true, revisionTopics: p.revisionTopics };
    }
    const normTopic = String(topic).trim().toLowerCase();
    p.revisionTopics = p.revisionTopics.filter((item) => item.topic.toLowerCase() !== normTopic);
    return { ok: true, revisionTopics: p.revisionTopics };
  }

  recordMatchOutcome(summary) {
    const pA = this.getPlayer(summary.playerA.id);
    const pB = !summary.playerB.isGhost ? this.getPlayer(summary.playerB.id) : null;

    if (pA) {
      pA.elo = summary.eloUpdate.newEloA;
      pA.streak = summary.eloUpdate.newStreakA;
      pA.weeklyMatchesPlayed += 1;
      pA.coins += summary.coinsAwardedA || 0;
      this.recordPlayerMistakes(pA, summary.roundHistory, true, summary.examType, summary.completedAt);
      this.refreshPlayerComputed(pA);
    }

    if (pB) {
      pB.elo = summary.eloUpdate.newEloB;
      pB.streak = summary.eloUpdate.newStreakB;
      pB.weeklyMatchesPlayed += 1;
      pB.coins += summary.coinsAwardedB || 0;
      this.recordPlayerMistakes(pB, summary.roundHistory, false, summary.examType, summary.completedAt);
      this.refreshPlayerComputed(pB);
    }

    if (summary.mode === 'tournament' && summary.tournamentId) {
      const t = this.tournaments.get(summary.tournamentId);
      if (t) {
        this.joinTournament(t.id, summary.playerA.id);
        if (!summary.playerB.isGhost) {
          this.joinTournament(t.id, summary.playerB.id);
        }
        const entryA = t.participants.find((x) => x.playerId === summary.playerA.id);
        const entryB = !summary.playerB.isGhost
          ? t.participants.find((x) => x.playerId === summary.playerB.id)
          : null;

        if (entryA) {
          entryA.elo = pA ? pA.elo : entryA.elo;
          if (summary.winnerId === summary.playerA.id) {
            entryA.points += 30;
            entryA.wins += 1;
          } else if (summary.winnerId === null) {
            entryA.points += 15;
          } else {
            entryA.points += 5;
            entryA.losses += 1;
          }
        }
        if (entryB) {
          entryB.elo = pB ? pB.elo : entryB.elo;
          if (summary.winnerId === summary.playerB.id) {
            entryB.points += 30;
            entryB.wins += 1;
          } else if (summary.winnerId === null) {
            entryB.points += 15;
          } else {
            entryB.points += 5;
            entryB.losses += 1;
          }
        }
      }
    }

    this.matchHistory.unshift(summary);
    if (this.matchHistory.length > 25) {
      this.matchHistory.pop();
    }
  }
}

module.exports = {
  WEEKLY_BRACKETS,
  getWeeklyBracket,
  GameStore,
};
