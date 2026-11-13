const test = require('node:test');
const assert = require('node:assert/strict');
const { DuelSession } = require('../src/engine/duelSession');

const sampleQuestions = Array.from({ length: 5 }, (_, idx) => ({
  externalId: `Q-${idx + 1}`,
  examType: 'TYT',
  subject: 'matematik',
  difficulty: 'MEDIUM',
  subTopic: 'Test',
  text: `Soru ${idx + 1}`,
  options: ['A', 'B', 'C', 'D'],
  correctOptionIndex: 2,
  durationMs: 60000,
}));

test('DuelSession prevents duplicate answers, hides correctOptionIndex while active, scores accuracy+speed, and finalizes ELO', () => {
  const t0 = 5_000_000;
  const duel = new DuelSession({
    matchId: 'm1',
    playerA: { id: 'p1', name: 'P1', elo: 1200, streak: 0 },
    playerB: { id: 'p2', name: 'P2', elo: 1200, streak: 0 },
    questions: sampleQuestions,
    commonSubjects: ['matematik'],
    examType: 'TYT',
    mode: 'ranked',
    startedAt: t0,
  });

  // Public state must not leak correctOptionIndex
  const pub = duel.getCurrentPublicState();
  assert.equal(pub.currentQuestion.correctOptionIndex, undefined);

  for (let i = 0; i < 5; i++) {
    const qStart = duel.questionStartedAt;
    // P1 answers correctly in 15s (45s remaining -> 137.5 pts)
    const r1 = duel.submitAnswer('p1', i, 2, qStart + 15000);
    assert.equal(r1.accepted, true);
    assert.equal(r1.bothAnswered, false);

    // Duplicate answer from P1 is ignored
    const dup = duel.submitAnswer('p1', i, 0, qStart + 16000);
    assert.equal(dup.accepted, false);

    // P2 answers correctly in 30s (30s remaining -> 125 pts)
    const r2 = duel.submitAnswer('p2', i, 2, qStart + 30000);
    assert.equal(r2.accepted, true);
    assert.equal(r2.bothAnswered, true);

    const next = duel.advanceToNextQuestion(qStart + 33000);
    if (i < 4) {
      assert.equal(next.finished, false);
    } else {
      assert.equal(next.finished, true);
      assert.equal(next.finalSummary.winnerId, 'p1');
      assert.ok(next.finalSummary.eloUpdate.deltaA > 0);
    }
  }
});

test('DuelSession supports rich interactive questions, avatarUrl, and object answers with accuracy', () => {
  const t0 = 10_000_000;
  const interactiveQ = {
    externalId: 'q_sw_008',
    examType: 'TYT',
    subject: 'fizik',
    difficulty: 'EASY',
    subTopic: 'Vektörler',
    text: 'Sınıflandır',
    options: ['A', 'B'],
    correctOptionIndex: 0,
    durationMs: 20000,
    explanation: 'Detaylı vektör açıklaması',
    interactiveQuestion: {
      id: 'q_sw_008',
      type: 'swipe_grouping',
      payload: { cards: [] },
    },
  };

  const duel = new DuelSession({
    matchId: 'm2',
    playerA: { id: 'p1', name: 'Ahmet', elo: 1250, streak: 1 },
    playerB: { id: 'p2', name: 'Zeynep', elo: 1200, streak: 5 },
    questions: [interactiveQ],
    commonSubjects: ['fizik'],
    examType: 'TYT',
    startedAt: t0,
  });

  assert.ok(duel.playerA.avatarUrl.includes('api.dicebear.com'));
  assert.ok(duel.playerB.avatarUrl.includes('api.dicebear.com'));

  const pub = duel.getCurrentPublicState(t0 + 2000);
  assert.equal(pub.currentQuestion.interactiveQuestion.type, 'swipe_grouping');
  assert.equal(pub.currentQuestion.explanation, 'Detaylı vektör açıklaması');

  // Player A answers with object payload: partial accuracy 0.8
  const resA = duel.submitAnswer('p1', 0, {
    isCorrect: false,
    accuracy: 0.8,
    selectedOptionIndex: 0,
  }, t0 + 5000);
  assert.equal(resA.accepted, true);

  // Player B answers with 100% correct object payload
  const resB = duel.submitAnswer('p2', 0, {
    isCorrect: true,
    accuracy: 1.0,
    selectedOptionIndex: 0,
  }, t0 + 10000);
  assert.equal(resB.accepted, true);
  assert.equal(resB.bothAnswered, true);

  const roundRes = resB.roundResult;
  assert.ok(roundRes.answerA.score > 0);
  assert.ok(roundRes.answerB.score > roundRes.answerA.score);
  assert.equal(roundRes.interactiveQuestion.type, 'swipe_grouping');
});
