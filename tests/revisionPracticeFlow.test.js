const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadQuestionBank } = require('../src/engine/questionBank');
const { filterQuestions } = require('../src/engine/filterLogic');

const bankDir = path.join(__dirname, '..', 'question-bank');
const bank = loadQuestionBank(bankDir);

test('Bireysel Alıştırma Modu: Sınav, branş ve zorluk filtrelerine göre soru seçimi doğrulaması', () => {
  // 1. TYT Matematik Easy
  const tytMatEasy = filterQuestions(bank.allQuestions, {
    examType: 'TYT',
    subjects: ['matematik'],
    difficultyMode: 'easy',
    count: 5,
  });
  assert.equal(tytMatEasy.length, 5);
  for (const q of tytMatEasy) {
    assert.equal(q.subject.toLowerCase(), 'matematik');
    assert.equal(q.examType.toUpperCase(), 'TYT');
  }

  // 2. AYT Fizik Hard
  const aytFizHard = filterQuestions(bank.allQuestions, {
    examType: 'AYT',
    subjects: ['fizik'],
    difficultyMode: 'hard',
    count: 5,
  });
  assert.equal(aytFizHard.length, 5);
  for (const q of aytFizHard) {
    assert.equal(q.subject.toLowerCase(), 'fizik');
    assert.equal(q.examType.toUpperCase(), 'AYT');
  }

  // 3. LGS Türkçe
  const lgsTurkce = filterQuestions(bank.allQuestions, {
    examType: 'LGS',
    subjects: ['turkce'],
    difficultyMode: 'adaptive',
    count: 5,
  });
  assert.equal(lgsTurkce.length, 5);
  for (const q of lgsTurkce) {
    assert.equal(q.subject.toLowerCase(), 'turkce');
    assert.equal(q.examType.toUpperCase(), 'LGS');
  }
});
