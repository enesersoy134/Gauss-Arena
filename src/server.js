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
const { RAW_INTERACTIVE_QUESTIONS, normalizeInteractiveQuestion } = require('./engine/interactiveQuestionPool');

function isAuthorizedSocketPlayer(socketToPlayerIdMap, socketId, playerId) {
  const bound = socketToPlayerIdMap.get(socketId);
  return !bound || bound === String(playerId);
}

function generateKahootPin(roomsMap) {
  let pin = '';
  do {
    pin = String(Math.floor(100000 + Math.random() * 900000));
  } while (roomsMap.has(pin));
  return pin;
}

function selectKahootQuestions(questionBank, { examType = 'KARMA', subjects = [], count = 7 } = {}) {
  const normSubjects = Array.isArray(subjects)
    ? subjects.map((s) => String(s).toLowerCase().trim()).filter(Boolean)
    : [];
  const normalizedExam = String(examType || 'KARMA').toUpperCase();

  const candidatePool = [];

  // 1. RAW_INTERACTIVE_QUESTIONS havuzundan filtreye uyanları al
  for (const rawQ of RAW_INTERACTIVE_QUESTIONS) {
    const qExam = String(rawQ.examType || 'TYT').toUpperCase();
    const qSubj = String(rawQ.subject || '').toLowerCase();

    const examMatches = normalizedExam === 'KARMA' || qExam === normalizedExam;
    const subjMatches = normSubjects.length === 0 || normSubjects.includes(qSubj);

    if (examMatches && subjMatches) {
      candidatePool.push(normalizeInteractiveQuestion(rawQ, qExam));
    }
  }

  // 2. Eğer yetersizse questionBank.allQuestions havuzundan ekle
  if (candidatePool.length < count && questionBank && Array.isArray(questionBank.allQuestions)) {
    for (const q of questionBank.allQuestions) {
      const qExam = String(q.examType || 'TYT').toUpperCase();
      const qSubj = String(q.subject || '').toLowerCase();
      const examMatches = normalizedExam === 'KARMA' || qExam === normalizedExam;
      const subjMatches = normSubjects.length === 0 || normSubjects.includes(qSubj);

      if (examMatches && subjMatches) {
        const id = q.id || q.externalId;
        if (!candidatePool.some((c) => (c.id || c.externalId) === id)) {
          candidatePool.push(q);
        }
      }
    }
  }

  // 3. Hala yetersizse filtreleri esneterek RAW_INTERACTIVE_QUESTIONS havuzundan tamamla
  if (candidatePool.length < count) {
    for (const rawQ of RAW_INTERACTIVE_QUESTIONS) {
      const norm = normalizeInteractiveQuestion(rawQ, rawQ.examType || 'TYT');
      const id = norm.id || norm.externalId;
      if (!candidatePool.some((c) => (c.id || c.externalId) === id)) {
        candidatePool.push(norm);
      }
      if (candidatePool.length >= count) break;
    }
  }

  // Karıştır
  const shuffled = [...candidatePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, count);

  return selected.map((q) => {
    const iq = q.interactiveQuestion || q;
    const timeLimitSec =
      iq.timeLimitSeconds ||
      q.timeLimitSeconds ||
      Math.round((q.durationMs || 25000) / 1000) ||
      25;
    return {
      ...q,
      ...iq,
      id: iq.id || q.externalId || q.id,
      type: iq.type || 'universal_choice',
      prompt: iq.prompt || q.text || '',
      topic: iq.topic || q.subTopic || '',
      subject: (iq.subject || q.subject || 'matematik').toLowerCase(),
      explanation: iq.explanation || q.explanation || '',
      payload: iq.payload || {
        variant: 'test',
        optionCount: (q.options || []).length,
        options: q.options || [],
        correctIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
        shuffleOptions: false,
      },
      timeLimitSeconds: timeLimitSec,
      durationMs: timeLimitSec * 1000,
      points: iq.points || q.points || 100,
      interactiveQuestion: iq,
    };
  });
}

function getPublicRoomState(room) {
  if (!room) return null;
  const currentQuestion = room.questions[room.currentQuestionIndex] || null;
  const leaderboard = Array.from(room.players.values()).sort((a, b) => b.score - a.score);

  return {
    pin: room.pin,
    status: room.status,
    examType: room.examType,
    subjects: room.subjects,
    currentQuestionIndex: room.currentQuestionIndex,
    totalQuestions: room.questions.length,
    questionStartedAt: room.questionStartedAt,
    durationMs: room.durationMs,
    currentQuestion,
    answeredCount: room.currentAnswers.size,
    totalPlayers: room.players.size,
    leaderboard,
  };
}

function createAppServer(listenPort = null) {
  const app = express();
  app.use(express.json());

  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    app.use(express.static(distPath));
  }
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // SPA İstemci Yönlendirme Desteği (Client-side routing /admin vb.)
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  const bankDir = path.join(__dirname, '..', 'question-bank');
  const questionBank = loadQuestionBank(bankDir);
  const store = new GameStore();
  const queue = new MatchmakingQueue({ enableGhost: false });

  const activeDuels = new Map(); // matchId -> { session: DuelSession, advancing: boolean }
  const playerToMatchId = new Map(); // playerId -> matchId
  const socketToPlayerId = new Map(); // socket.id -> playerId
  const kahootRooms = new Map(); // pin -> room

  function finishKahootQuestion(room) {
    if (!room) return;
    if (room.questionTimer) {
      clearTimeout(room.questionTimer);
      room.questionTimer = null;
    }
    if (room.status !== 'QUESTION') return;

    for (const player of room.players.values()) {
      const ans = room.currentAnswers.get(player.id);
      if (ans) {
        player.score += ans.score;
        player.lastRoundPoints = ans.score;
        player.lastRoundCorrect = ans.isCorrect;
        if (ans.isCorrect) {
          player.streak += 1;
          player.correctCount += 1;
        } else if (ans.score > 0) {
          // Kısmi doğru: puan eklenir, seri korunur
        } else {
          player.streak = 0;
          player.wrongCount += 1;
        }
      } else {
        player.hasAnsweredCurrent = false;
        player.lastRoundCorrect = false;
        player.lastRoundPoints = 0;
        player.lastRoundTimeMs = room.durationMs;
        player.streak = 0;
        player.wrongCount += 1;
      }
    }

    room.status = 'INTERMISSION';
    io.to('kahoot:' + room.pin).emit('kahoot:roomState', getPublicRoomState(room));
  }

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
        waitSeconds: Math.max(0, Math.floor((now - e.enqueuedAt) / 1000)),
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
    entry.readyPlayers = new Set();
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
      entry.readyPlayers = new Set();
      if (duel.playerB.isGhost) {
        entry.readyPlayers.add(String(duel.playerB.id));
      }
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
        entry.readyPlayers = new Set();
        if (duel.playerB.isGhost) {
          entry.readyPlayers.add(String(duel.playerB.id));
        }
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

  app.post('/api/revision/clear-topic', (req, res) => {
    const { playerId, topic } = req.body || {};
    const result = store.markTopicReviewed(playerId, topic);
    broadcastState();
    res.json(result);
  });

  app.post('/api/revision/record-local', (req, res) => {
    const { playerId, roundHistory, examType } = req.body || {};
    const p = store.getPlayer(playerId);
    if (!p) return res.status(404).json({ ok: false, reason: 'Oyuncu bulunamadı' });
    store.recordPlayerMistakes(p, roundHistory, true, examType || 'TYT', new Date().toISOString());
    broadcastState();
    res.json({ ok: true, revisionTopics: p.revisionTopics });
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

      if (!entry.readyPlayers) {
        entry.readyPlayers = new Set();
        if (entry.session && entry.session.playerB.isGhost) {
          entry.readyPlayers.add(String(entry.session.playerB.id));
        }
      }

      entry.readyPlayers.add(String(playerId));
      io.emit('duel:readyUpdate', { matchId, readyPlayerIds: Array.from(entry.readyPlayers) });

      const playerAId = String(entry.session.playerA.id);
      const playerBId = String(entry.session.playerB.id);

      if (entry.readyPlayers.has(playerAId) && entry.readyPlayers.has(playerBId)) {
        advanceDuelRound(entry.session, entry);
      }
    };
    socket.on('duel:roundReady', handleRoundReady);
    socket.on('duel:RoundReady', handleRoundReady);

    // ==========================================
    // CANLI SINIF / KAHOOT YARIŞMA MOTORU
    // ==========================================

    socket.on('kahoot:createRoom', (payload, callback) => {
      const pin = generateKahootPin(kahootRooms);
      const examType = payload?.examType || 'KARMA';
      const subjects = Array.isArray(payload?.subjects) ? payload.subjects : [];
      const questionCount = Number(payload?.questionCount) || 7;

      const questions = selectKahootQuestions(questionBank, {
        examType,
        subjects,
        count: questionCount,
      });

      const firstQ = questions[0];
      const durationMs = (firstQ?.timeLimitSeconds || 25) * 1000;

      const room = {
        pin,
        hostSocketId: socket.id,
        status: 'LOBBY',
        examType,
        subjects,
        questions,
        currentQuestionIndex: 0,
        questionStartedAt: 0,
        durationMs,
        players: new Map(),
        currentAnswers: new Map(),
        questionTimer: null,
      };

      kahootRooms.set(pin, room);
      socket.join('kahoot:' + pin);

      const state = getPublicRoomState(room);
      socket.emit('kahoot:roomState', state);
      if (typeof callback === 'function') {
        callback({ ok: true, pin, roomState: state });
      }
    });

    socket.on('kahoot:joinRoom', (payload, callback) => {
      const pin = String(payload?.pin || '').trim();
      const room = kahootRooms.get(pin);

      if (!room) {
        const err = { message: 'Bu PIN koduna ait aktif bir yarışma bulunamadı!' };
        socket.emit('kahoot:error', err);
        if (typeof callback === 'function') callback({ ok: false, error: err.message });
        return;
      }

      const rawName = String(payload?.playerName || '').trim();
      if (!rawName) {
        const err = { message: 'Lütfen geçerli bir isim giriniz!' };
        socket.emit('kahoot:error', err);
        if (typeof callback === 'function') callback({ ok: false, error: err.message });
        return;
      }

      const playerId = payload?.playerId
        ? String(payload.playerId)
        : 'kp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const avatarUrl = payload?.avatarUrl || '';

      let player = room.players.get(playerId);
      if (player) {
        player.name = rawName;
        if (avatarUrl) player.avatarUrl = avatarUrl;
        player.socketId = socket.id;
      } else {
        player = {
          id: playerId,
          name: rawName,
          avatarUrl,
          socketId: socket.id,
          score: 0,
          streak: 0,
          correctCount: 0,
          wrongCount: 0,
          hasAnsweredCurrent: false,
          lastRoundPoints: 0,
          lastRoundCorrect: false,
          lastRoundTimeMs: 0,
        };
        room.players.set(playerId, player);
      }

      socket.join('kahoot:' + pin);
      const state = getPublicRoomState(room);

      socket.emit('kahoot:joined', { pin, playerId, roomState: state });
      io.to('kahoot:' + pin).emit('kahoot:roomState', state);

      if (typeof callback === 'function') {
        callback({ ok: true, pin, playerId, roomState: state });
      }
    });

    socket.on('kahoot:getRoom', (payload, callback) => {
      const pin = String(payload?.pin || '').trim();
      const room = kahootRooms.get(pin);
      if (!room) {
        const err = { message: 'Oda bulunamadı' };
        socket.emit('kahoot:error', err);
        if (typeof callback === 'function') callback({ ok: false, error: err.message });
        return;
      }
      socket.join('kahoot:' + pin);
      const state = getPublicRoomState(room);
      socket.emit('kahoot:roomState', state);
      if (typeof callback === 'function') callback({ ok: true, roomState: state });
    });

    socket.on('kahoot:startGame', ({ pin }) => {
      const room = kahootRooms.get(String(pin || '').trim());
      if (!room) return;
      if (room.questionTimer) {
        clearTimeout(room.questionTimer);
        room.questionTimer = null;
      }

      room.status = 'QUESTION';
      room.currentQuestionIndex = 0;
      room.currentAnswers.clear();
      const q = room.questions[0];
      room.durationMs = (q?.timeLimitSeconds || 25) * 1000;
      room.questionStartedAt = Date.now();
      for (const p of room.players.values()) {
        p.hasAnsweredCurrent = false;
      }
      room.questionTimer = setTimeout(() => {
        finishKahootQuestion(room);
      }, room.durationMs);
      io.to('kahoot:' + room.pin).emit('kahoot:roomState', getPublicRoomState(room));
    });

    socket.on('kahoot:submitAnswer', ({ pin, playerId, questionIndex, answerResult }) => {
      const room = kahootRooms.get(String(pin || '').trim());
      if (!room) return;
      if (room.status !== 'QUESTION') return;
      if (Number(questionIndex) !== room.currentQuestionIndex) return;

      const pId = String(playerId || '');
      const player = room.players.get(pId);
      if (!player) return;
      if (room.currentAnswers.has(pId)) return;

      const q = room.questions[room.currentQuestionIndex] || {};
      const qType = q.type || q.interactiveQuestion?.type;
      const isCorrect = Boolean(answerResult && answerResult.isCorrect);
      const allowsPartial = ['matrix_toggle', 'pair_matching', 'swipe_grouping'].includes(qType);
      const rawAccuracy = typeof answerResult?.accuracy === 'number' ? answerResult.accuracy : (isCorrect ? 1 : 0);
      const effectiveAccuracy = isCorrect
        ? 1
        : allowsPartial
        ? Math.max(0, Math.min(1, Number(rawAccuracy) || 0))
        : 0;
      const elapsedMs = Math.max(300, Date.now() - room.questionStartedAt);
      const remainingRatio = Math.max(0, Math.min(1, 1 - elapsedMs / room.durationMs));
      const basePoints = q.points || 100;

      let points = 0;
      if (effectiveAccuracy > 0) {
        const speedBonus = Math.round(basePoints * 0.5 * remainingRatio);
        const streakBonus = isCorrect ? Math.min(50, player.streak * 10) : 0;
        points = Math.round((basePoints + speedBonus + streakBonus) * effectiveAccuracy);
      } else {
        points = 0;
      }

      player.hasAnsweredCurrent = true;
      player.lastRoundCorrect = isCorrect;
      player.lastRoundPoints = points;
      player.lastRoundTimeMs = elapsedMs;

      room.currentAnswers.set(pId, {
        isCorrect,
        accuracy: effectiveAccuracy,
        score: points,
        timeMs: elapsedMs,
      });

      if (room.currentAnswers.size >= room.players.size && room.players.size > 0) {
        finishKahootQuestion(room);
      } else {
        io.to('kahoot:' + room.pin).emit('kahoot:roomState', getPublicRoomState(room));
      }
    });

    socket.on('kahoot:endQuestion', ({ pin }) => {
      const room = kahootRooms.get(String(pin || '').trim());
      if (!room || room.status !== 'QUESTION') return;
      finishKahootQuestion(room);
    });

    socket.on('kahoot:nextQuestion', ({ pin }) => {
      const room = kahootRooms.get(String(pin || '').trim());
      if (!room) return;
      if (room.questionTimer) {
        clearTimeout(room.questionTimer);
        room.questionTimer = null;
      }

      if (room.currentQuestionIndex + 1 < room.questions.length) {
        room.currentQuestionIndex++;
        room.status = 'QUESTION';
        room.currentAnswers.clear();
        const q = room.questions[room.currentQuestionIndex];
        room.durationMs = (q?.timeLimitSeconds || 25) * 1000;
        room.questionStartedAt = Date.now();
        for (const p of room.players.values()) {
          p.hasAnsweredCurrent = false;
        }
        room.questionTimer = setTimeout(() => {
          finishKahootQuestion(room);
        }, room.durationMs);
        io.to('kahoot:' + room.pin).emit('kahoot:roomState', getPublicRoomState(room));
      } else {
        room.status = 'FINISHED';
        io.to('kahoot:' + room.pin).emit('kahoot:roomState', getPublicRoomState(room));
      }
    });

    socket.on('disconnect', () => {
      socketToPlayerId.delete(socket.id);
    });
  });

  const close = () =>
    new Promise((resolve) => {
      clearInterval(tickInterval);
      for (const room of kahootRooms.values()) {
        if (room.questionTimer) {
          clearTimeout(room.questionTimer);
          room.questionTimer = null;
        }
      }
      for (const entry of activeDuels.values()) {
        if (entry.intermissionTimer) {
          clearTimeout(entry.intermissionTimer);
          entry.intermissionTimer = null;
        }
      }
      io.close(() => {
        httpServer.close(() => resolve());
      });
    });

  if (listenPort !== null) {
    const HOST = listenPort === 0 ? '127.0.0.1' : (process.env.HOST || '0.0.0.0');
    return new Promise((resolve) => {
      httpServer.listen(listenPort, HOST, () => {
        resolve({ app, httpServer, io, close, kahootRooms });
      });
    });
  }

  return Promise.resolve({ app, httpServer, io, close, kahootRooms });
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

module.exports = {
  createAppServer,
  isAuthorizedSocketPlayer,
  selectKahootQuestions,
  generateKahootPin,
  getPublicRoomState,
};
