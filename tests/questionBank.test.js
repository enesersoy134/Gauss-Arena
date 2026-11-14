const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {
  loadQuestionBank,
  getDifficultyDistribution,
  getDurationByDifficulty,
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

test('LGS kademesi ve difficultyMode parametreleri soru bankasında doğru çalışır', () => {
  const bank = loadQuestionBank(bankDir);

  // 8 yeni LGS sorusu havuzda bulunmalı
  const lgsQuestions = bank.allQuestions.filter((q) => q.examType === 'LGS');
  assert.ok(lgsQuestions.length >= 8, `En az 8 LGS sorusu bulunmalı, bulunan: ${lgsQuestions.length}`);

  // LGS matematik sorusu seçimi
  const pickedLgs = selectMatchQuestions(bank, {
    examType: 'LGS',
    commonSubjects: ['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce'],
    count: 5,
  });
  assert.equal(pickedLgs.length, 5);
  for (const q of pickedLgs) {
    assert.equal(q.examType, 'LGS');
  }

  // LGS müfredat branşları: Türkçe, Matematik, Fen, Sosyal
  const pickedFen = selectMatchQuestions(bank, {
    examType: 'LGS',
    commonSubjects: ['fen'],
    count: 5,
  });
  assert.equal(pickedFen.length, 5);
  for (const q of pickedFen) {
    assert.equal(q.examType, 'LGS');
  }

  const pickedSosyal = selectMatchQuestions(bank, {
    examType: 'LGS',
    commonSubjects: ['sosyal'],
    count: 5,
  });
  assert.equal(pickedSosyal.length, 5);
  for (const q of pickedSosyal) {
    assert.equal(q.examType, 'LGS');
  }

  // difficultyMode = 'easy'
  const distEasy = getDifficultyDistribution(1200, 'easy');
  assert.deepEqual(distEasy, { EASY: 4, MEDIUM: 1, HARD: 0 });

  // difficultyMode = 'hard'
  const distHard = getDifficultyDistribution(1200, 'hard');
  assert.deepEqual(distHard, { EASY: 0, MEDIUM: 1, HARD: 4 });
});

test('getDurationByDifficulty and questionBank enforce dynamic 1v1 duel durations (15s, 20s, 25s, no 60s)', () => {
  assert.equal(getDurationByDifficulty('easy'), 15000);
  assert.equal(getDurationByDifficulty('kolay'), 15000);
  assert.equal(getDurationByDifficulty('EASY'), 15000);
  assert.equal(getDurationByDifficulty('medium'), 20000);
  assert.equal(getDurationByDifficulty('orta'), 20000);
  assert.equal(getDurationByDifficulty('MEDIUM'), 20000);
  assert.equal(getDurationByDifficulty('hard'), 25000);
  assert.equal(getDurationByDifficulty('zor'), 25000);
  assert.equal(getDurationByDifficulty('HARD'), 25000);

  const bank = loadQuestionBank(bankDir);

  // Hiçbir soruda 60 saniye (60000ms) kalmamalı
  const slowQuestions = bank.allQuestions.filter((q) => q.durationMs >= 60000 || (q.timeLimitSeconds && q.timeLimitSeconds >= 60));
  assert.equal(slowQuestions.length, 0, `60 saniye süresi olan soru bulunmamalı: ${slowQuestions.map(q => q.externalId).join(', ')}`);

  // İnteraktif sorularda 30 saniye kalan soru olmamalı (maksimum 20-25s olmalı)
  const over25Questions = bank.allQuestions.filter(
    (q) => (q.durationMs > 25000) || (q.interactiveQuestion && q.interactiveQuestion.timeLimitSeconds > 25)
  );
  assert.equal(over25Questions.length, 0, `25 saniyeden uzun soru bulunmamalı: ${over25Questions.map(q => q.externalId).join(', ')}`);

  // Kolay, orta ve zor soruların süreleri doğru atanmış olmalı
  const easySample = bank.byExamSubjectDifficulty.TYT.matematik.EASY[0];
  assert.equal(easySample.durationMs, 15000);
  assert.equal(easySample.timeLimitSeconds, 15);
  assert.equal(easySample.interactiveQuestion.timeLimitSeconds, 15);

  const medSample = bank.byExamSubjectDifficulty.TYT.matematik.MEDIUM[0];
  assert.equal(medSample.durationMs, 20000);
  assert.equal(medSample.timeLimitSeconds, 20);
  assert.equal(medSample.interactiveQuestion.timeLimitSeconds, 20);

  const hardSample = bank.byExamSubjectDifficulty.TYT.matematik.HARD[0];
  assert.equal(hardSample.durationMs, 25000);
  assert.equal(hardSample.timeLimitSeconds, 25);
  assert.equal(hardSample.interactiveQuestion.timeLimitSeconds, 25);
});


