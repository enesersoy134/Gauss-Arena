const test = require('node:test');
const assert = require('node:assert/strict');
const { io: ioClient } = require('socket.io-client');
const {
  createAppServer,
  selectKahootQuestions,
  generateKahootPin,
  getPublicRoomState,
} = require('../src/server');
const { loadQuestionBank } = require('../src/engine/questionBank');
const path = require('node:path');

test('selectKahootQuestions selects rich interactive questions with time limits and points', () => {
  const bankDir = path.join(__dirname, '..', 'question-bank');
  const questionBank = loadQuestionBank(bankDir);

  const questions = selectKahootQuestions(questionBank, {
    examType: 'TYT',
    subjects: ['fizik'],
    count: 5,
  });

  assert.equal(questions.length, 5);
  for (const q of questions) {
    assert.ok(q.interactiveQuestion, 'Her soruda interactiveQuestion nesnesi bulunmalı');
    assert.ok(q.type, 'Üst seviyede type bulunmalı (QuestionRenderer için kritik)');
    assert.ok(q.prompt, 'Üst seviyede prompt bulunmalı');
    assert.ok(q.payload, 'Üst seviyede payload bulunmalı');
    assert.ok(q.timeLimitSeconds > 0, 'timeLimitSeconds pozitif olmalı');
    assert.ok(q.durationMs > 0, 'durationMs pozitif olmalı');
    assert.ok(q.points > 0, 'points pozitif olmalı');
  }
});

test('generateKahootPin produces unique 6-digit numeric codes', () => {
  const rooms = new Map();
  const pin1 = generateKahootPin(rooms);
  assert.match(pin1, /^\d{6}$/);
  rooms.set(pin1, {});
  const pin2 = generateKahootPin(rooms);
  assert.match(pin2, /^\d{6}$/);
  assert.notEqual(pin1, pin2);
});

test('Kahoot Room lifecycle: create, join, start, answer, intermission, next and finish', async () => {
  const { httpServer, close, kahootRooms } = await createAppServer(0);
  const address = httpServer.address();
  const socketUrl = `http://127.0.0.1:${address.port}`;

  const hostSocket = ioClient(socketUrl, { reconnection: false });
  const student1Socket = ioClient(socketUrl, { reconnection: false });
  const student2Socket = ioClient(socketUrl, { reconnection: false });

  // Bağlantıların tamamlanmasını bekle
  await Promise.all([
    new Promise((res) => hostSocket.on('connect', res)),
    new Promise((res) => student1Socket.on('connect', res)),
    new Promise((res) => student2Socket.on('connect', res)),
  ]);

  try {
    // 1. Host oda oluşturur
    const createRes = await new Promise((resolve) => {
      hostSocket.emit(
        'kahoot:createRoom',
        { examType: 'KARMA', subjects: [], questionCount: 2 },
        resolve
      );
    });

    assert.equal(createRes.ok, true);
    const pin = createRes.pin;
    assert.match(pin, /^\d{6}$/);
    assert.equal(createRes.roomState.status, 'LOBBY');
    assert.equal(createRes.roomState.totalQuestions, 2);

    // 2. İki öğrenci katılır
    const join1 = await new Promise((resolve) => {
      student1Socket.emit(
        'kahoot:joinRoom',
        { pin, playerName: 'Ali', avatarUrl: 'avatar1.png', playerId: 's1' },
        resolve
      );
    });
    assert.equal(join1.ok, true);
    assert.equal(join1.playerId, 's1');

    const join2 = await new Promise((resolve) => {
      student2Socket.emit(
        'kahoot:joinRoom',
        { pin, playerName: 'Ayşe', avatarUrl: 'avatar2.png', playerId: 's2' },
        resolve
      );
    });
    assert.equal(join2.ok, true);
    assert.equal(join2.playerId, 's2');

    // 3. Geçersiz PIN hatası kontrolü
    const invalidJoin = await new Promise((resolve) => {
      student1Socket.emit(
        'kahoot:joinRoom',
        { pin: '999999', playerName: 'Mehmet' },
        resolve
      );
    });
    assert.equal(invalidJoin.ok, false);

    // 4. Oyunu Başlat
    const questionStatePromise = new Promise((resolve) => {
      hostSocket.on('kahoot:roomState', (state) => {
        if (state.status === 'QUESTION' && state.currentQuestionIndex === 0) {
          resolve(state);
        }
      });
    });

    hostSocket.emit('kahoot:startGame', { pin });
    const qState = await questionStatePromise;
    assert.equal(qState.status, 'QUESTION');
    assert.equal(qState.currentQuestionIndex, 0);
    assert.equal(qState.answeredCount, 0);

    // 5. Öğrenciler cevap gönderir: Ali doğru, Ayşe yanlış
    const intermissionPromise = new Promise((resolve) => {
      hostSocket.on('kahoot:roomState', (state) => {
        if (state.status === 'INTERMISSION') {
          resolve(state);
        }
      });
    });

    student1Socket.emit('kahoot:submitAnswer', {
      pin,
      playerId: 's1',
      questionIndex: 0,
      answerResult: { isCorrect: true, accuracy: 1 },
    });

    student2Socket.emit('kahoot:submitAnswer', {
      pin,
      playerId: 's2',
      questionIndex: 0,
      answerResult: { isCorrect: false, accuracy: 0 },
    });

    // Her iki öğrenci de cevapladığı için otomatik INTERMISSION'a geçmeli
    const interState = await intermissionPromise;
    assert.equal(interState.status, 'INTERMISSION');
    assert.equal(interState.leaderboard.length, 2);

    // Ali'nin puanı > 0, serisi 1 olmalı
    const ali = interState.leaderboard.find((p) => p.id === 's1');
    const ayse = interState.leaderboard.find((p) => p.id === 's2');
    assert.ok(ali.score > 0, 'Ali doğru bildiği için puan kazanmalı');
    assert.equal(ali.streak, 1);
    assert.equal(ali.correctCount, 1);
    assert.equal(ayse.score, 0, 'Ayşe yanlış yaptığı için 0 puan almalı');
    assert.equal(ayse.streak, 0);
    assert.equal(ayse.wrongCount, 1);

    // 6. Sonraki soruya geç
    const q2Promise = new Promise((resolve) => {
      hostSocket.on('kahoot:roomState', (state) => {
        if (state.status === 'QUESTION' && state.currentQuestionIndex === 1) {
          resolve(state);
        }
      });
    });

    hostSocket.emit('kahoot:nextQuestion', { pin });
    const q2State = await q2Promise;
    assert.equal(q2State.status, 'QUESTION');
    assert.equal(q2State.currentQuestionIndex, 1);

    // Kısmi puan kurallarını test etmek için 2. sorunun tipini matrix_toggle (Doğru/Yanlış) olarak garantile
    const activeRoom = kahootRooms.get(pin);
    if (activeRoom && activeRoom.questions[1]) {
      activeRoom.questions[1].type = 'matrix_toggle';
      if (activeRoom.questions[1].interactiveQuestion) {
        activeRoom.questions[1].interactiveQuestion.type = 'matrix_toggle';
      }
    }

    // 7. Öğrencilerden biri kısmi doğru gönderir (4'te 3 doğru: accuracy = 0.75)
    student2Socket.emit('kahoot:submitAnswer', {
      pin,
      playerId: 's2',
      questionIndex: 1,
      answerResult: { isCorrect: false, accuracy: 0.75 },
    });

    const inter2Promise = new Promise((resolve) => {
      hostSocket.on('kahoot:roomState', (state) => {
        if (state.status === 'INTERMISSION' && state.currentQuestionIndex === 1) {
          resolve(state);
        }
      });
    });

    hostSocket.emit('kahoot:endQuestion', { pin });
    const inter2State = await inter2Promise;
    assert.equal(inter2State.status, 'INTERMISSION');

    const ayse2 = inter2State.leaderboard.find((p) => p.id === 's2');
    assert.ok(ayse2.lastRoundPoints > 0, 'Kısmi doğru yapan öğrenci (accuracy 0.75) puan almalı');
    assert.ok(ayse2.score > 0, 'Toplam puanına kısmi puan eklenmeli');

    // 8. Son sorudan sonra FINISHED olma testi
    const finishedPromise = new Promise((resolve) => {
      hostSocket.on('kahoot:roomState', (state) => {
        if (state.status === 'FINISHED') {
          resolve(state);
        }
      });
    });

    hostSocket.emit('kahoot:nextQuestion', { pin });
    const finishedState = await finishedPromise;
    assert.equal(finishedState.status, 'FINISHED');
  } finally {
    hostSocket.disconnect();
    student1Socket.disconnect();
    student2Socket.disconnect();
    await close();
  }
});
