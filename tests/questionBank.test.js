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

test('all questions in questionBank have clean human-readable text without raw LaTeX or control characters', () => {
  const bank = loadQuestionBank(bankDir);
  const badPattern = /\$\$|\\frac|\\text|\\sqrt|\\circ|\\Omega|\\Delta|\\rightarrow|\\cap|\\cup|[\t\f]|ext\{|rac\{|\?\(Not:/;

  for (const q of bank.allQuestions) {
    assert.equal(
      badPattern.test(q.text),
      false,
      `Soru metninde bozuk karakter/LaTeX bulundu (${q.externalId}): ${q.text}`
    );
    if (q.interactiveQuestion && q.interactiveQuestion.prompt) {
      assert.equal(
        badPattern.test(q.interactiveQuestion.prompt),
        false,
        `İnteraktif promptta bozuk karakter/LaTeX bulundu (${q.externalId}): ${q.interactiveQuestion.prompt}`
      );
    }
    for (const opt of q.options || []) {
      assert.equal(
        badPattern.test(String(opt)),
        false,
        `Seçenekte bozuk karakter/LaTeX bulundu (${q.externalId}): ${opt}`
      );
    }
  }
});

test('both TYT and AYT include expanded questions across all 5 subjects and q_hs_018 uses eukaryotic cell SVG', () => {
  const bank = loadQuestionBank(bankDir);
  const subjects = ['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce'];

  for (const examType of ['TYT', 'AYT']) {
    for (const subj of subjects) {
      assert.ok(bank.byExamSubjectDifficulty[examType][subj], `${examType} ${subj} havuzu bulunmalı`);
      assert.ok(bank.byExamSubjectDifficulty[examType][subj].EASY.length >= 10, `${examType} ${subj} EASY >= 10 olmalı`);
      assert.ok(bank.byExamSubjectDifficulty[examType][subj].MEDIUM.length >= 10, `${examType} ${subj} MEDIUM >= 10 olmalı`);
      assert.ok(bank.byExamSubjectDifficulty[examType][subj].HARD.length >= 10, `${examType} ${subj} HARD >= 10 olmalı`);
    }
  }

  const aytQuestions = selectMatchQuestions(bank, {
    examType: 'AYT',
    commonSubjects: ['biyoloji', 'matematik', 'turkce'],
    averageElo: 1300,
    count: 5,
  });
  assert.equal(aytQuestions.length, 5);

  const golgiQ = bank.allQuestions.find((q) => q.externalId === 'q_hs_018');
  assert.ok(golgiQ, 'Golgi hotspot sorusu (q_hs_018) bulunmalı');
  assert.equal(golgiQ.interactiveQuestion.payload.imageUrl, '/eukaryotic-cell.svg');
});

