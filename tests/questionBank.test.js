const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {
  loadQuestionBank,
  getDifficultyDistribution,
  selectMatchQuestions,
} = require('../src/engine/questionBank');

const bankDir = path.join(__dirname, '..', 'question-bank');

test('getDifficultyDistribution matches spec ELO bands (<1200, 1200-1600, >1600)', () => {
  assert.deepEqual(getDifficultyDistribution(1150), { EASY: 3, MEDIUM: 2, HARD: 0 });
  assert.deepEqual(getDifficultyDistribution(1200), { EASY: 1, MEDIUM: 3, HARD: 1 });
  assert.deepEqual(getDifficultyDistribution(1600), { EASY: 1, MEDIUM: 3, HARD: 1 });
  assert.deepEqual(getDifficultyDistribution(1650), { EASY: 0, MEDIUM: 1, HARD: 4 });
});

test('selectMatchQuestions picks 5 unique questions matching difficulty distribution and common subjects', () => {
  const bank = loadQuestionBank(bankDir);
  const questions = selectMatchQuestions(bank, {
    examType: 'TYT',
    commonSubjects: ['matematik', 'fizik'],
    averageElo: 1350,
    count: 5,
  });
  assert.equal(questions.length, 5);
  const difficulties = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    assert.ok(['matematik', 'fizik'].includes(q.subject));
    assert.equal(q.examType, 'TYT');
    return acc;
  }, {});
  assert.deepEqual(difficulties, { EASY: 1, MEDIUM: 3, HARD: 1 });
});

test('selectMatchQuestions enriches questions with interactiveQuestion and supports biyoloji pool', () => {
  const bank = loadQuestionBank(bankDir);
  const questions = selectMatchQuestions(bank, {
    examType: 'TYT',
    commonSubjects: ['biyoloji', 'kimya'],
    averageElo: 1250,
    count: 5,
  });

  assert.equal(questions.length, 5);
  for (const q of questions) {
    assert.ok(q.interactiveQuestion, 'Her soruda interactiveQuestion bulunmalı');
    assert.ok(Array.isArray(q.options), 'options her zaman dizi olmalı');
    assert.equal(typeof q.correctOptionIndex, 'number', 'correctOptionIndex sayı olmalı');
  }

  // En az 2-3 adet zengin interaktif soru bulunmalı
  const richCount = questions.filter(
    (q) => q.interactiveQuestion && (q.interactiveQuestion.type !== 'universal_choice' || (q.externalId && q.externalId.startsWith('q_')))
  ).length;
  assert.ok(richCount >= 2, `En az 2 interaktif soru seçilmeli, bulunan: ${richCount}`);
});
