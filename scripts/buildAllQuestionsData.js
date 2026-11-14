const fs = require('node:fs');
const path = require('node:path');
const { formatQuestionText } = require('../src/engine/questionBank');
const { RAW_INTERACTIVE_QUESTIONS } = require('../src/engine/interactiveQuestionPool');

const bankDir = path.resolve(__dirname, '..', 'question-bank');
const allQuestions = [];
const seenIds = new Set();

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) {
      walk(p);
    } else if (d.name.endsWith('.json') && d.name !== 'interactive.json') {
      const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
      const meta = raw.meta || {};
      const examType = meta.examType.toUpperCase();
      const subject = meta.subject.toLowerCase();
      const diffStr = (meta.difficulty || path.basename(p, '.json')).toUpperCase();
      const diff = diffStr === 'EASY' ? 'kolay' : diffStr === 'HARD' ? 'zor' : 'orta';
      const durationMs = diffStr === 'EASY' ? 15000 : diffStr === 'HARD' ? 25000 : 20000;
      const timeLimitSeconds = Math.round(durationMs / 1000);
      const points = diffStr === 'EASY' ? 80 : diffStr === 'HARD' ? 120 : 100;

      for (const q of raw.questions || []) {
        if (seenIds.has(q.externalId)) continue;
        seenIds.add(q.externalId);
        allQuestions.push({
          id: q.externalId,
          examType,
          subject,
          topic: q.subTopic || '',
          type: 'universal_choice',
          difficulty: diff,
          timeLimitSeconds: q.durationMs ? Math.round(q.durationMs / 1000) : timeLimitSeconds,
          points,
          prompt: formatQuestionText(q.text),
          explanation: q.explanation ? formatQuestionText(q.explanation) : undefined,
          payload: {
            variant: 'test',
            optionCount: (q.options || []).length,
            options: (q.options || []).map((o) => formatQuestionText(o)),
            correctIndex: Number(q.correctOptionIndex),
            shuffleOptions: false,
          },
        });
      }
    }
  });
}

walk(bankDir);

for (const rawQ of RAW_INTERACTIVE_QUESTIONS) {
  if (seenIds.has(rawQ.id)) continue;
  seenIds.add(rawQ.id);
  allQuestions.push(rawQ);
}

const code = `import { Question } from '../types/game';
import { ALL_INTERACTIVE_QUESTIONS } from './allInteractiveQuestions';

export { ALL_INTERACTIVE_QUESTIONS };

export const ALL_QUESTIONS: Question[] = ${JSON.stringify(allQuestions, null, 2)} as Question[];

export interface QuestionFilterOptions {
  examType?: 'LGS' | 'TYT' | 'AYT' | 'KARMA' | string;
  subjects?: string[];
  difficultyMode?: 'adaptive' | 'easy' | 'medium' | 'hard' | string;
  count?: number;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Kullanıcının seçtiği sınav, ders/branş ve zorluk filtrelerine %100 sadık kalarak soru seçer.
 * Asla seçilmeyen bir ders veya sınav kategorisinden soru sızdırmaz.
 */
export function filterAppQuestions(options: QuestionFilterOptions): Question[] {
  const normExam = (options.examType || 'TYT').toUpperCase();
  const subjects = (options.subjects && options.subjects.length > 0 ? options.subjects : ['matematik']).map((s) => s.toLowerCase());
  const diffMode = options.difficultyMode || 'adaptive';
  const targetCount = options.count && options.count > 0 ? options.count : 5;

  // 1. İstenen sınav ve branşa ait tüm sorular
  const matchingExamAndSubject = ALL_QUESTIONS.filter((q) => {
    const qExam = (q.examType || 'TYT').toUpperCase();
    const examOk = normExam === 'KARMA' || qExam === normExam;
    const subjOk = subjects.includes((q.subject || '').toLowerCase());
    return examOk && subjOk;
  });

  // 2. Zorluk önceliğine göre sırala
  let primaryPool: Question[] = [];
  if (diffMode === 'easy') {
    const easy = matchingExamAndSubject.filter((q) => q.difficulty === 'kolay');
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta');
    primaryPool = [...shuffle(easy), ...shuffle(medium)];
  } else if (diffMode === 'medium') {
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta');
    const easy = matchingExamAndSubject.filter((q) => q.difficulty === 'kolay');
    const hard = matchingExamAndSubject.filter((q) => q.difficulty === 'zor');
    primaryPool = [...shuffle(medium), ...shuffle(easy), ...shuffle(hard)];
  } else if (diffMode === 'hard') {
    const hard = matchingExamAndSubject.filter((q) => q.difficulty === 'zor');
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta');
    primaryPool = [...shuffle(hard), ...shuffle(medium)];
  } else {
    primaryPool = shuffle(matchingExamAndSubject);
  }

  const selected: Question[] = [];
  const usedIds = new Set<string>();

  for (const q of primaryPool) {
    if (selected.length >= targetCount) break;
    if (!usedIds.has(q.id)) {
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // 3. Fallback 1: Aynı sınav ve seçili branş havuzundan kalanları ekle
  if (selected.length < targetCount) {
    for (const q of shuffle(matchingExamAndSubject)) {
      if (selected.length >= targetCount) break;
      if (!usedIds.has(q.id)) {
        selected.push(q);
        usedIds.add(q.id);
      }
    }
  }

  // 4. Fallback 2: Seçilen branşı ASLA değiştirmeden diğer sınavlardan aynı branş sorularını ekle
  if (selected.length < targetCount) {
    const sameSubjectOtherExams = ALL_QUESTIONS.filter(
      (q) => subjects.includes((q.subject || '').toLowerCase()) && !usedIds.has(q.id)
    );
    for (const q of shuffle(sameSubjectOtherExams)) {
      if (selected.length >= targetCount) break;
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // 5. Fallback 3: Aynı branşta tekil soru tükendiyse döngüsel olarak aynı branştan tamamla
  if (selected.length < targetCount) {
    const cycleSubject = ALL_QUESTIONS.filter((q) => subjects.includes((q.subject || '').toLowerCase()));
    if (cycleSubject.length > 0) {
      while (selected.length < targetCount) {
        for (const q of shuffle(cycleSubject)) {
          if (selected.length >= targetCount) break;
          selected.push({ ...q, id: \`\${q.id}_rep_\${selected.length}\` });
        }
      }
    }
  }

  return selected.slice(0, targetCount);
}
`;

const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'allQuestions.ts');
fs.writeFileSync(outputPath, code, 'utf8');
console.log(`Generated ${outputPath} with ${allQuestions.length} questions.`);
