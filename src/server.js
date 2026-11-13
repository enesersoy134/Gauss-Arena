const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const express = require('express');
const { Server } = require('socket.io');

const { calculateEffectiveMMR } = require('./engine/eloMomentum');
const { loadQuestionBank, selectMatchQuestions, getDifficultyDistribution } = require('./engine/questionBank');
const { MatchmakingQueue } = require('./engine/matchmakingQueue');
const { GameStore, WEEKLY_BRACKETS } = require('./engine/economyTournaments');
const { DuelSession } = require('./engine/duelSession');

function isAuthorizedSocketPlayer(socketToPlayerIdMap, socketId, playerId) {
  const bound = socketToPlayerIdMap.get(socketId);
  return !bound || bound === String(playerId);
}

function createAppServer(listenPort = null) {
  const app = express();
  app.use(express.json());

  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    app.use(express.static(distPath));
  }
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  const bankDir = path.join(__dirname, '..', 'question-bank');
  const questionBank = loadQuestionBank(bankDir);
  const store = new GameStore();
  const queue = new MatchmakingQueue();

  const activeDuels = new Map(); // matchId -> { session: DuelSession, advancing: boolean }
  const playerToMatchId = new Map(); // playerId -> matchId
  const socketToPlayerId = new Map(); // socket.id -> playerId

  function buildFullState() {
    const now = Date.now();
    const remaining = Array.from(queue.entries.values());
    const pairDiagnostics = [];
    for (let i = 0; i < remaining.length; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        const evalRes = queue.evaluatePair(remaining[i], remaining[j], now);
        pairDiagnostics.push({
          playerAId: remaining[i].playerId,
          playerAName: remaining[i].name,
          playerBId: remaining[j].playerId,
          playerBName: remaining[j].name,
          ...evalRes,
        });
      }
    }

    return {
      players: store.getPlayers(),
      weeklyBrackets: WEEKLY_BRACKETS,
      tournaments: store.getTournaments(),
      matchHistory: store.matchHistory,
      questionBankStats: questionBank.stats,
      queueSnapshot: remaining.map((e) => ({
        ...e,
        waitSeconds: Math.max(0, Math.round(((now - e.enqueuedAt) / 1000) * 10) / 10),
      })),
      pairDiagnostics,
      pairwiseMatchesLast24h: queue.pairwiseMatches,
    };
  }

  function broadcastState() {
    io.emit('state:update', buildFullState());
  }

  const INTERMISSION_MS = listenPort === 0 ? 2600 : 5000;

  function scheduleGhostAnswerIfNeeded(duel) {
    if (!duel.playerB.isGhost || duel.status !== 'IN_PROGRESS') return;
    const qIdx = duel.currentQuestionIndex;
    const q = duel.getCurrentQuestion();
    if (!q) return;

    // Simulate Ghost answering within 4-7 seconds with ~75% accuracy
    const delayMs = 3800 + Math.floor(Math.random() * 3000);
    setTimeout(() => {
      if (duel.status !== 'IN_PROGRESS' || duel.currentQuestionIndex !== qIdx) return;
      const isCorrectRoll = Math.random() < 0.72;
      let chosenIdx = q.correctOptionIndex;
      if (!isCorrectRoll) {
        const wrongOptions = [0, 1, 2, 3].filter((idx) => idx !== q.correctOptionIndex);
        chosenIdx = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      }

      if (q.interactiveQuestion && q.interactiveQuestion.type !== 'universal_choice') {
        handleAnswerSubmission(duel.matchId, duel.playerB.id, qIdx, {
          isCorrect: isCorrectRoll,
          accuracy: isCorrectRoll ? 1 : 0,
          selectedOptionIndex: chosenIdx,
        });
      } else {
        handleAnswerSubmission(duel.matchId, duel.playerB.id, qIdx, chosenIdx);
      }
    }, delayMs);
  }

  function startDuelFromMatch(matchInfo) {
    const matchId = `duel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const avgElo = (Number(matchInfo.playerA.elo) + Number(matchInfo.playerB.elo)) / 2;
    const questions = selectMatchQuestions(questionBank, {
      examType: matchInfo.examType,
      commonSubjects: matchInfo.commonSubjects,
      averageElo: avgElo,
      count: 5,
    });

    const duel = new DuelSession({
      matchId,
      playerA: matchInfo.playerA,
      playerB: matchInfo.playerB,
      questions,
      commonSubjects: matchInfo.commonSubjects,
      examType: matchInfo.examType,
      mode: matchInfo.mode,
      tournamentId: matchInfo.tournamentId,
      diagnostics: {
        ...matchInfo.diagnostics,
        averageElo: Math.round(avgElo),
        difficultyDistribution: getDifficultyDistribution(avgElo),
      },
      startedAt: Date.now(),
    });

    activeDuels.set(matchId, { session: duel, advancing: false });
    playerToMatchId.set(duel.playerA.id, matchId);
    if (!duel.playerB.isGhost) {
      playerToMatchId.set(duel.playerB.id, matchId);
    }

    const pubState = duel.getCurrentPublicState();
    io.emit('duel:started', pubState);
    scheduleGhostAnswerIfNeeded(duel);
    broadcastState();
  }

  function finalizeDuel(duel) {
    const summary = duel.finalSummary;
    store.recordMatchOutcome(summary);
    if (!duel.playerB.isGhost) {
      queue.recordRankedMatch(duel.playerA.id, duel.playerB.id, Date.now());
    }
    playerToMatchId.delete(duel.playerA.id);
    playerToMatchId.delete(duel.playerB.id);
    activeDuels.delete(duel.matchId);

    io.emit('duel:finished', summary);
    broadcastState();
  }

  function advanceDuelRound(duel, entry) {
    if (!entry || !entry.advancing) return;
    if (entry.intermissionTimer) {
      clearTimeout(entry.intermissionTimer);
      entry.intermissionTimer = null;
    }
    const next = duel.advanceToNextQuestion(Date.now());
    entry.advancing = false;
    if (next.finished) {
      finalizeDuel(duel);
    } else {
      io.emit('duel:question', duel.getCurrentPublicState());
      scheduleGhostAnswerIfNeeded(duel);
    }
  }

  function handleAnswerSubmission(matchId, playerId, questionIndex, answerInput) {
    const entry = activeDuels.get(matchId);
    if (!entry) return;
    const { session: duel } = entry;

    const res = duel.submitAnswer(playerId, questionIndex, answerInput, Date.now());
    if (!res.accepted) return;

    io.emit('duel:state', duel.getCurrentPublicState());

    if (res.bothAnswered && !entry.advancing) {
      entry.advancing = true;
      io.emit('duel:roundResult', {
        matchId: duel.matchId,
        roundResult: res.roundResult,
        publicState: duel.getCurrentPublicState(),
      });

      entry.intermissionTimer = setTimeout(() => {
        advanceDuelRound(duel, entry);
      }, INTERMISSION_MS);
    }
  }

  // Queue + Duel timer loop (runs every 500ms)
  const tickInterval = setInterval(() => {
    const now = Date.now();
    const tickRes = queue.tick(now);

    for (const m of tickRes.matches) {
      startDuelFromMatch(m);
    }
    for (const gm of tickRes.ghostMatches) {
      startDuelFromMatch(gm);
    }

    if (tickRes.queueSnapshot.length > 0) {
      io.emit('queue:tick', {
        queueSnapshot: tickRes.queueSnapshot,
        pairDiagnostics: tickRes.pairDiagnostics,
      });
    }

    // Check question timeouts in active duels
    for (const [matchId, entry] of activeDuels.entries()) {
      const { session: duel } = entry;
      if (duel.status !== 'IN_PROGRESS' || entry.advancing) continue;
      const q = duel.getCurrentQuestion();
      const durationMs = q ? q.durationMs || 60000 : 60000;
      if (now - duel.questionStartedAt >= durationMs) {
        entry.advancing = true;
        const timeoutRes = duel.forceQuestionTimeout(now);
        io.emit('duel:roundResult', {
          matchId,
          roundResult: timeoutRes.roundResult,
          publicState: duel.getCurrentPublicState(now),
        });
        entry.intermissionTimer = setTimeout(() => {
          advanceDuelRound(duel, entry);
        }, INTERMISSION_MS);
      }
    }
  }, 500);

  // REST API routes
  app.get('/api/state', (_req, res) => {
    res.json(buildFullState());
  });

  app.post('/api/economy/claim-weekly', (req, res) => {
    const { playerId } = req.body || {};
    const result = store.claimWeeklyReward(playerId);
    broadcastState();
    res.json(result);
  });

  app.post('/api/economy/convert-coins', (req, res) => {
    const { playerId, coins } = req.body || {};
    const result = store.convertCoinsToIslerPoints(playerId, coins);
    broadcastState();
    res.json(result);
  });

  app.post('/api/economy/simulate-15-matches', (req, res) => {
    const { playerId } = req.body || {};
    const player = store.simulateCompleteWeeklyMatches(playerId, 15);
    broadcastState();
    res.json({ ok: Boolean(player), player });
  });

  app.post('/api/tournaments/join', (req, res) => {
    const { tournamentId, playerId } = req.body || {};
    const tournament = store.joinTournament(tournamentId, playerId);
    broadcastState();
    res.json({ ok: Boolean(tournament), tournament });
  });

  app.post('/api/tournaments/distribute', (req, res) => {
    const { tournamentId } = req.body || {};
    const result = store.distributeTournamentRewards(tournamentId);
    broadcastState();
    res.json(result);
  });

  app.post('/api/demo/update-player', (req, res) => {
    const { playerId, elo, streak } = req.body || {};
    const p = store.getPlayer(playerId);
    if (!p) return res.status(404).json({ ok: false, reason: 'Oyuncu bulunamadı' });
    if (elo !== undefined) p.elo = Number(elo);
    if (streak !== undefined) p.streak = Number(streak);
    store.refreshPlayerComputed(p);
    broadcastState();
    res.json({ ok: true, player: p });
  });

  app.post('/api/demo/reset', (_req, res) => {
    store.reset();
    queue.entries.clear();
    queue.pairwiseMatches = [];
    activeDuels.clear();
    playerToMatchId.clear();
    broadcastState();
    res.json({ ok: true });
  });

  // SPA fallback for dist
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    socket.emit('state:update', buildFullState());

    socket.on('player:select', ({ playerId }) => {
      socketToPlayerId.set(socket.id, String(playerId));
      const activeMatchId = playerToMatchId.get(String(playerId));
      if (activeMatchId && activeDuels.has(activeMatchId)) {
        const duel = activeDuels.get(activeMatchId).session;
        socket.emit('duel:started', duel.getCurrentPublicState());
      }
    });

    socket.on('queue:join', ({ playerId, examType, subjects, mode, tournamentId }) => {
      if (!isAuthorizedSocketPlayer(socketToPlayerId, socket.id, playerId)) {
        socket.emit('queue:error', { message: 'Yetkisiz oyuncu oturumu.' });
        return;
      }
      if (!Array.isArray(subjects) || subjects.length === 0) {
        socket.emit('queue:error', { message: 'Kuyruğa girmek için en az bir ders seçmelisiniz.' });
        return;
      }
      const p = store.getPlayer(playerId);
      if (!p) {
        socket.emit('queue:error', { message: 'Geçersiz oyuncu seçimi.' });
        return;
      }
      if (playerToMatchId.has(p.id)) {
        socket.emit('queue:error', { message: 'Bu oyuncu zaten aktif bir düelloda.' });
        return;
      }
      if (mode === 'tournament' && tournamentId) {
        store.joinTournament(tournamentId, p.id);
      }
      queue.enqueue({
        playerId: p.id,
        name: p.name,
        elo: p.elo,
        streak: p.streak,
        examType: examType || 'TYT',
        subjects,
        mode: mode || 'ranked',
        tournamentId: mode === 'tournament' ? tournamentId : null,
        enqueuedAt: Date.now(),
      });
      broadcastState();
    });

    socket.on('queue:leave', ({ playerId }) => {
      if (!isAuthorizedSocketPlayer(socketToPlayerId, socket.id, playerId)) return;
      queue.dequeue(playerId);
      broadcastState();
    });

    socket.on('queue:fastForward', ({ bonusSeconds = 5 }) => {
      queue.advanceAllQueueTimes(bonusSeconds);
      broadcastState();
    });

    socket.on('duel:answer', (payload) => {
      const { matchId, playerId, questionIndex } = payload || {};
      if (!isAuthorizedSocketPlayer(socketToPlayerId, socket.id, playerId)) return;
      const answerInput = payload.answerResult !== undefined ? payload.answerResult : payload.selectedOptionIndex;
      handleAnswerSubmission(matchId, playerId, questionIndex, answerInput);
    });

    const handleRoundReady = ({ matchId, playerId }) => {
      if (!isAuthorizedSocketPlayer(socketToPlayerId, socket.id, playerId)) return;
      const entry = activeDuels.get(matchId);
      if (!entry || !entry.advancing) return;
      advanceDuelRound(entry.session, entry);
    };
    socket.on('duel:roundReady', handleRoundReady);
    socket.on('duel:RoundReady', handleRoundReady);

    socket.on('disconnect', () => {
      socketToPlayerId.delete(socket.id);
    });
  });

  const close = () =>
    new Promise((resolve) => {
      clearInterval(tickInterval);
      io.close(() => {
        httpServer.close(() => resolve());
      });
    });

  if (listenPort !== null) {
    return new Promise((resolve) => {
      httpServer.listen(listenPort, '127.0.0.1', () => {
        resolve({ app, httpServer, io, close });
      });
    });
  }

  return Promise.resolve({ app, httpServer, io, close });
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  createAppServer(PORT).then(({ httpServer }) => {
    const addr = httpServer.address();
    console.log(`İşler 1v1 Düello & Momentum Eşleştirme Sunucusu çalışıyor: http://localhost:${addr.port}`);
    console.log(`Pencere 1 (Oyuncu 1): http://localhost:${addr.port}/?window=1&player=p2`);
    console.log(`Pencere 2 (Oyuncu 2): http://localhost:${addr.port}/?window=2&player=p3`);
  });
}

module.exports = { createAppServer, isAuthorizedSocketPlayer };
