const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Read allQuestions.ts and transpile to CommonJS with typescript compiler
const tsCode = fs.readFileSync(path.join(__dirname, '../src/data/allQuestions.ts'), 'utf8');
const jsOutput = ts.transpileModule(tsCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

// Evaluate in a module sandbox
const moduleExports = {};
const fn = new Function('exports', 'require', jsOutput);
fn(moduleExports, (mod) => {
  if (mod.includes('allInteractiveQuestions')) {
    const interTs = fs.readFileSync(path.join(__dirname, '../src/data/allInteractiveQuestions.ts'), 'utf8');
    const interJs = ts.transpileModule(interTs, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const interExports = {};
    new Function('exports', interJs)(interExports);
    return interExports;
  }
  return {};
});

const { normalizeQuestion, filterAppQuestions, getRevisionQuestionsForTopics } = moduleExports;

test('normalizeQuestion: Ham veya eksik soru objelerini QuestionRenderer uyumlu standart formata dönüştürür', () => {
  // 1. Raw question without payload (from backend or bank)
  const rawQ = {
    externalId: 'test_raw_01',
    examType: 'TYT',
    subject: 'fizik',
    subTopic: 'Kuvvet ve Hareket',
    text: 'Sürtünmesiz ortamda serbest düşmeye bırakılan bir cismin ivmesi nedir?',
    options: ['0', 'g', '2g', 'g/2'],
    correctOptionIndex: 1,
    explanation: 'Serbest düşmede ivme yerçekimi ivmesine (g) eşittir.',
  };

  const norm = normalizeQuestion(rawQ);
  assert.equal(norm.id, 'test_raw_01');
  assert.equal(norm.prompt, 'Sürtünmesiz ortamda serbest düşmeye bırakılan bir cismin ivmesi nedir?');
  assert.equal(norm.topic, 'Kuvvet ve Hareket');
  assert.equal(norm.type, 'universal_choice');
  assert.ok(norm.payload);
  assert.equal(norm.payload.options.length, 4);
  assert.equal(norm.payload.correctIndex, 1);
  assert.equal(norm.payload.options[norm.payload.correctIndex], 'g');

  // 2. Already structured interactive question
  const interQ = {
    id: 'test_inter_02',
    examType: 'AYT',
    subject: 'biyoloji',
    topic: 'Genetik',
    type: 'universal_choice',
    prompt: 'DNA polimeraz hangi yönde sentez yapar?',
    payload: {
      variant: 'test',
      options: ['3 to 5', '5 to 3'],
      correctIndex: 1,
    },
  };

  const norm2 = normalizeQuestion(interQ);
  assert.equal(norm2.id, 'test_inter_02');
  assert.equal(norm2.prompt, 'DNA polimeraz hangi yönde sentez yapar?');
  assert.equal(norm2.payload.options.length, 2);
  assert.equal(norm2.payload.correctIndex, 1);
});

test('filterAppQuestions: Her sınav (TYT, AYT, LGS) ve branş için en az 5-10 soru firesiz döner', () => {
  const scenarios = [
    { examType: 'TYT', subjects: ['matematik'], count: 5 },
    { examType: 'TYT', subjects: ['fizik'], count: 5 },
    { examType: 'TYT', subjects: ['kimya'], count: 5 },
    { examType: 'TYT', subjects: ['biyoloji'], count: 5 },
    { examType: 'TYT', subjects: ['turkce'], count: 5 },
    { examType: 'TYT', subjects: ['geometri'], count: 5 },
    { examType: 'AYT', subjects: ['matematik'], count: 10 },
    { examType: 'AYT', subjects: ['fizik'], count: 5 },
    { examType: 'AYT', subjects: ['kimya'], count: 5 },
    { examType: 'AYT', subjects: ['biyoloji'], count: 5 },
    { examType: 'AYT', subjects: ['turkce'], count: 5 },
    { examType: 'LGS', subjects: ['matematik'], count: 5 },
    { examType: 'LGS', subjects: ['fen'], count: 10 },
    { examType: 'LGS', subjects: ['turkce'], count: 5 },
    { examType: 'LGS', subjects: ['sosyal'], count: 5 },
    { examType: 'LGS', subjects: ['turkce', 'matematik', 'sosyal', 'fen'], count: 10 },
  ];

  for (const scen of scenarios) {
    const questions = filterAppQuestions(scen);
    assert.equal(
      questions.length,
      scen.count,
      `Scenario ${scen.examType} ${scen.subjects.join(',')} did not return ${scen.count} questions!`
    );

    for (const q of questions) {
      assert.ok(q.id, 'Soru id olmalı');
      assert.ok(q.prompt, 'Soru prompt metni olmalı');
      assert.ok(q.subject, 'Soru subject olmalı');
      assert.ok(q.topic, 'Soru topic olmalı');
      assert.ok(q.type, 'Soru type olmalı');
      assert.ok(q.payload, 'Soru payload olmalı');
      if (q.type === 'universal_choice') {
        assert.ok(Array.isArray(q.payload.options), 'Universal choice options dizi olmalı');
        assert.ok(q.payload.options.length >= 2, 'Universal choice en az 2 şık içermeli');
        assert.ok(typeof q.payload.correctIndex === 'number', 'correctIndex sayı olmalı');
      }
    }
  }
});

test('getRevisionQuestionsForTopics: Eksik konu çözme isteğinde daima ilgili ve normalize sorular döner', () => {
  const revQuestions = getRevisionQuestionsForTopics({
    examType: 'TYT',
    subjects: ['fizik'],
    topics: ['Dalgalar ve Ses'],
    targetCount: 5,
  });

  assert.equal(revQuestions.length, 5);
  for (const q of revQuestions) {
    assert.ok(q.id);
    assert.ok(q.prompt);
    assert.ok(q.payload);
  }
});
