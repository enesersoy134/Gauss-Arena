const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadQuestionBank, selectMatchQuestions } = require('../src/engine/questionBank');
const { filterQuestions } = require('../src/engine/filterLogic');

const bankDir = path.join(__dirname, '..', 'question-bank');
const bank = loadQuestionBank(bankDir);

test('Karşılaşma Seçenekleri Filtreleri: Yalnızca tek ders seçildiğinde (Biyoloji, Türkçe, Fizik, vb.) gelen sorular istisnasız o derse ait olmalıdır', () => {
  const subjectsToTest = ['biyoloji', 'turkce', 'fizik', 'kimya', 'matematik'];
  const examTypesToTest = ['TYT', 'AYT', 'LGS'];

  for (const exam of examTypesToTest) {
    for (const subj of subjectsToTest) {
      const questions = selectMatchQuestions(bank, {
        examType: exam,
        commonSubjects: [subj],
        count: 5,
        difficultyMode: 'adaptive',
      });

      assert.equal(questions.length, 5, `${exam} ${subj} için 5 soru dönmeli`);
      for (const q of questions) {
        assert.equal(
          q.subject.toLowerCase(),
          subj,
          `Filtre ihlali! ${exam} ${subj} seçildiğinde soru branşı ${q.subject} geldi (${q.externalId})`
        );
        assert.equal(
          q.examType.toUpperCase(),
          exam,
          `Sınav kategorisi ihlali! ${exam} seçildiğinde ${q.examType} sorusu geldi (${q.externalId})`
        );
      }
    }
  }
});

test('Karşılaşma Seçenekleri Zorluk Filtreleri: easy, medium, hard modları doğru önceliklendirilir', () => {
  // 1. Easy Modu (TYT Fizik)
  const easyQuestions = selectMatchQuestions(bank, {
    examType: 'TYT',
    commonSubjects: ['fizik'],
    count: 5,
    difficultyMode: 'easy',
  });
  assert.equal(easyQuestions.length, 5);
  const easyCount = easyQuestions.filter((q) => q.difficulty === 'EASY').length;
  assert.ok(easyCount >= 4, `Easy modunda en az 4 kolay soru olmalı, bulunan: ${easyCount}`);
  for (const q of easyQuestions) {
    assert.equal(q.subject, 'fizik');
    assert.equal(q.examType, 'TYT');
  }

  // 2. Hard Modu (AYT Matematik)
  const hardQuestions = selectMatchQuestions(bank, {
    examType: 'AYT',
    commonSubjects: ['matematik'],
    count: 5,
    difficultyMode: 'hard',
  });
  assert.equal(hardQuestions.length, 5);
  const hardCount = hardQuestions.filter((q) => q.difficulty === 'HARD').length;
  assert.ok(hardCount >= 4, `Hard modunda en az 4 zor soru olmalı, bulunan: ${hardCount}`);
  for (const q of hardQuestions) {
    assert.equal(q.subject, 'matematik');
    assert.equal(q.examType, 'AYT');
  }
});

test('Çoklu branş seçimi: Seçilen 2 dersten karma sorular gelir ve harici bir branş asla sızmaz', () => {
  const chosenSubjects = ['kimya', 'biyoloji'];
  const questions = selectMatchQuestions(bank, {
    examType: 'TYT',
    commonSubjects: chosenSubjects,
    count: 5,
    difficultyMode: 'adaptive',
  });

  assert.equal(questions.length, 5);
  for (const q of questions) {
    assert.ok(
      chosenSubjects.includes(q.subject.toLowerCase()),
      `Seçilmeyen branş sızdı: ${q.subject} (${q.externalId})`
    );
    assert.equal(q.examType, 'TYT');
  }
});

test('Bireysel Alıştırma Modu (filterQuestions): 5, 10 ve 15 soruluk seçimlerde sınav ve branş filtreleri %100 korunmalıdır', () => {
  const testCounts = [5, 10, 15];

  for (const count of testCounts) {
    // LGS Türkçe
    const lgsTurkce = filterQuestions(bank.allQuestions, {
      examType: 'LGS',
      subjects: ['turkce'],
      difficultyMode: 'easy',
      count,
    });
    assert.equal(lgsTurkce.length, count, `LGS Türkçe için ${count} soru seçilmeli`);
    for (const q of lgsTurkce) {
      assert.equal(q.subject.toLowerCase(), 'turkce', `LGS Türkçe harici branş sızdı: ${q.subject}`);
      assert.equal(q.examType.toUpperCase(), 'LGS', `LGS harici sınav sızdı: ${q.examType}`);
    }

    // TYT Biyoloji
    const tytBio = filterQuestions(bank.allQuestions, {
      examType: 'TYT',
      subjects: ['biyoloji'],
      difficultyMode: 'medium',
      count,
    });
    assert.equal(tytBio.length, count, `TYT Biyoloji için ${count} soru seçilmeli`);
    for (const q of tytBio) {
      assert.equal(q.subject.toLowerCase(), 'biyoloji', `TYT Biyoloji harici branş sızdı: ${q.subject}`);
      assert.equal(q.examType.toUpperCase(), 'TYT', `TYT harici sınav sızdı: ${q.examType}`);
    }

    // AYT Matematik
    const aytMat = filterQuestions(bank.allQuestions, {
      examType: 'AYT',
      subjects: ['matematik'],
      difficultyMode: 'hard',
      count,
    });
    assert.equal(aytMat.length, count, `AYT Matematik için ${count} soru seçilmeli`);
    for (const q of aytMat) {
      assert.equal(q.subject.toLowerCase(), 'matematik', `AYT Matematik harici branş sızdı: ${q.subject}`);
      assert.equal(q.examType.toUpperCase(), 'AYT', `AYT harici sınav sızdı: ${q.examType}`);
    }
  }
});
