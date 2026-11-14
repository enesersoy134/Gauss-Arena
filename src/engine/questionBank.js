const fs = require('node:fs');
const path = require('node:path');
const { INTERACTIVE_QUESTIONS } = require('./interactiveQuestionPool');

const SUPERSCRIPT_MAP = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'x': 'ˣ',
};

const SUBSCRIPT_MAP = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', 'n': 'ₙ',
};

function toSuperscript(str) {
  const chars = [...String(str)];
  if (chars.every((c) => SUPERSCRIPT_MAP[c])) {
    return chars.map((c) => SUPERSCRIPT_MAP[c]).join('');
  }
  return `^(${str})`;
}

function toSubscript(str) {
  const chars = [...String(str)];
  if (chars.every((c) => SUBSCRIPT_MAP[c])) {
    return chars.map((c) => SUBSCRIPT_MAP[c]).join('');
  }
  return str.length > 1 ? `(${str})` : str;
}

/**
 * Normalizes raw LaTeX/escape sequences into clean, human-readable Unicode math/science notation.
 */
function formatQuestionText(input) {
  if (typeof input !== 'string' || !input) return input;

  let s = input;

  // Fix accidental JS escape sequences (\t -> tab before ext{, \f -> form-feed before rac{)
  s = s.replace(/\text\{/g, '\\text{');
  s = s.replace(/\frac\{/g, '\\frac{');

  // Remove $$ and $ math mode wrappers
  s = s.replace(/\$\$/g, '');

  // Clean \text{...} (including nested) AFTER replacing operators that may touch \text
  s = s
    .replace(/\\rightarrow|\\to\b/g, '→')
    .replace(/\\cap\b/g, '∩')
    .replace(/\\cup\b/g, '∪')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\Delta\s*/g, 'Δ')
    .replace(/\\pi\b/g, 'π')
    .replace(/\\omega\b/g, 'ω')
    .replace(/\\sin\b/g, 'sin')
    .replace(/\\cos\b/g, 'cos')
    .replace(/\\tan\b/g, 'tan')
    .replace(/\\log\b/g, 'log')
    .replace(/\\%/g, '%')
    .replace(/\\,/g, ' ');

  for (let i = 0; i < 3; i++) {
    s = s.replace(/\\text\{([^{}]*)\}/g, '$1');
  }

  // Handle degrees: ^\circ or ^{\circ}
  s = s.replace(/\^\{\\circ\}|\^\\circ/g, '°');

  // Handle \lim_{x \to a} and \int_{a}^{b}
  s = s.replace(/\\lim_\{([^{}]*)\}/g, (_, sub) => {
    const cleanSub = sub.replace(/\\to|\\rightarrow/g, '→').trim();
    return `lim(${cleanSub})`;
  });
  s = s.replace(/\\int_\{([^{}]*)\}\^\{([^{}]*)\}/g, (_, lower, upper) => {
    return `∫${toSubscript(lower)}${toSuperscript(upper)}`;
  });

  // Handle isotope/atomic notation and sub/superscripts BEFORE \frac so inner braces are resolved
  s = s.replace(/\^\{([^{}]+)\}_\{([^{}]+)\}/g, (_, sup, sub) => `${toSuperscript(sup)}${toSubscript(sub)}`);
  s = s.replace(/\^\{([^{}]+)\}/g, (_, sup) => toSuperscript(sup));
  s = s.replace(/\^([0-9+\-n])/g, (_, sup) => toSuperscript(sup));
  s = s.replace(/_\{([^{}]+)\}/g, (_, sub) => toSubscript(sub));
  s = s.replace(/_([0-9n])/g, (_, sub) => toSubscript(sub));

  // Handle \frac{a}{b} (up to 2 passes for nested)
  for (let i = 0; i < 2; i++) {
    s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, num, den) => {
      const n = num.trim();
      const d = den.trim();
      const nWrap = /[+\-]/.test(n) && n.length > 2 ? `(${n})` : n;
      const dWrap = /[+\-]/.test(d) && d.length > 2 ? `(${d})` : d;
      return `${nWrap}/${dWrap}`;
    });
  }

  // Handle \sqrt{...}
  s = s.replace(/\\sqrt\{([^{}]*)\}/g, (_, inner) => {
    const clean = inner.trim();
    return /[+\-\s]/.test(clean) ? `√(${clean})` : `√${clean}`;
  });

  // Collapse multiple spaces
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s;
}

/**
 * Dynamic duration determination for 1v1 duels:
 * EASY: 15s (15000ms)
 * MEDIUM: 20s (20000ms)
 * HARD: 25s (25000ms)
 */
function getDurationByDifficulty(difficulty) {
  const d = String(difficulty || '').toLowerCase();
  if (d === 'easy' || d === 'kolay' || d === '1') return 15000;
  if (d === 'hard' || d === 'zor' || d === '3') return 25000;
  return 20000;
}

/**
 * Loads all JSON files in question-bank/{tyt,ayt}/{subject}/{easy,medium,hard}.json
 * and enriches them with interactiveQuestion objects for QuestionRenderer.
 * Also integrates the 14 interactive question types (18 rich questions).
 */
function loadQuestionBank(baseDir) {
  const byExamSubjectDifficulty = {};
  const allQuestions = [];

  if (fs.existsSync(baseDir)) {
    const examDirs = fs.readdirSync(baseDir, { withFileTypes: true }).filter((d) => d.isDirectory());

    for (const examDir of examDirs) {
      const examType = examDir.name.toUpperCase();
      byExamSubjectDifficulty[examType] = byExamSubjectDifficulty[examType] || {};

      const examPath = path.join(baseDir, examDir.name);
      const subjectDirs = fs.readdirSync(examPath, { withFileTypes: true }).filter((d) => d.isDirectory());

      for (const subjDir of subjectDirs) {
        const subject = subjDir.name.toLowerCase();
        byExamSubjectDifficulty[examType][subject] = byExamSubjectDifficulty[examType][subject] || {
          EASY: [],
          MEDIUM: [],
          HARD: [],
        };

        const subjPath = path.join(examPath, subjDir.name);
        const files = fs.readdirSync(subjPath).filter((f) => f.endsWith('.json'));

        for (const file of files) {
          const filePath = path.join(subjPath, file);
          const raw = fs.readFileSync(filePath, 'utf8').trim();
          if (!raw) continue;

          try {
            const parsed = JSON.parse(raw);
            const meta = parsed.meta || {};
            const difficulty = (meta.difficulty || path.basename(file, '.json')).toUpperCase();
            const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

            for (const q of questions) {
              const cleanText = formatQuestionText(q.text);
              const cleanOptions = (q.options || []).map((opt) => formatQuestionText(opt));
              const cleanExplanation = q.explanation ? formatQuestionText(q.explanation) : null;

              // Süre belirleme sırası:
              // 1. Sorunun kendi durationMs veya timeLimitSeconds değeri (varsa)
              // 2. Dosya meta'sındaki defaultDurationMs (eğer 60000'den küçükse)
              // 3. Zorluk derecesine göre dinamik süre: Kolay 15s, Orta 20s, Zor 25s
              const diffDurationMs = getDurationByDifficulty(difficulty);
              const metaDurationMs = (meta.defaultDurationMs && meta.defaultDurationMs < 60000)
                ? meta.defaultDurationMs
                : diffDurationMs;

              const durationMs = q.durationMs
                ? Number(q.durationMs)
                : q.timeLimitSeconds
                ? Number(q.timeLimitSeconds) * 1000
                : metaDurationMs;

              const timeLimitSeconds = Math.round(durationMs / 1000);

              const normalized = {
                externalId: q.externalId,
                examType,
                subject,
                difficulty,
                subTopic: q.subTopic || '',
                text: cleanText,
                imageUrl: q.imageUrl || null,
                options: cleanOptions,
                correctOptionIndex: Number(q.correctOptionIndex),
                durationMs,
                rawDurationMs: durationMs,
                timeLimitSeconds,
                explanation: cleanExplanation,
                // Otomatik olarak QuestionRenderer uyumlu interactiveQuestion nesnesi ekle:
                interactiveQuestion: {
                  id: q.externalId,
                  subject,
                  topic: q.subTopic || '',
                  type: 'universal_choice',
                  difficulty: difficulty.toLowerCase() === 'easy' ? 'kolay' : difficulty.toLowerCase() === 'hard' ? 'zor' : 'orta',
                  timeLimitSeconds,
                  points: 100,
                  prompt: cleanText,
                  explanation: cleanExplanation,
                  payload: {
                    variant: 'test',
                    optionCount: cleanOptions.length,
                    options: cleanOptions,
                    correctIndex: Number(q.correctOptionIndex),
                    shuffleOptions: false,
                  },
                },
              };

              if (!byExamSubjectDifficulty[examType][subject][difficulty]) {
                byExamSubjectDifficulty[examType][subject][difficulty] = [];
              }
              byExamSubjectDifficulty[examType][subject][difficulty].push(normalized);
              allQuestions.push(normalized);
            }
          } catch {
            // Ignore malformed JSON
          }
        }
      }
    }
  }

  // 14 İnteraktif Soru Tipini (18 Soru) da soru bankasına dahil et
  for (const rawQ of INTERACTIVE_QUESTIONS) {
    const qExam = rawQ.examType || 'TYT';
    const qSubj = rawQ.subject;
    const qDiff = rawQ.difficulty;

    byExamSubjectDifficulty[qExam] = byExamSubjectDifficulty[qExam] || {};
    byExamSubjectDifficulty[qExam][qSubj] = byExamSubjectDifficulty[qExam][qSubj] || {
      EASY: [],
      MEDIUM: [],
      HARD: [],
    };
    if (!byExamSubjectDifficulty[qExam][qSubj][qDiff]) {
      byExamSubjectDifficulty[qExam][qSubj][qDiff] = [];
    }
    byExamSubjectDifficulty[qExam][qSubj][qDiff].push(rawQ);
    allQuestions.push(rawQ);
  }

  const byExam = {};
  for (const q of allQuestions) {
    byExam[q.examType] = (byExam[q.examType] || 0) + 1;
  }

  return {
    byExamSubjectDifficulty,
    allQuestions,
    stats: {
      totalQuestions: allQuestions.length,
      byExam,
    },
  };
}

/**
 * ELO / Zorluk Modu Dağılımı:
 * easy: 4 Kolay, 1 Orta, 0 Zor
 * medium: 1 Kolay, 3 Orta, 1 Zor
 * hard: 0 Kolay, 1 Orta, 4 Zor
 * adaptive (ELO tabanlı):
 * < 1200: 3 EASY, 2 MEDIUM
 * 1200 - 1600: 1 EASY, 3 MEDIUM, 1 HARD
 * > 1600: 1 MEDIUM, 4 HARD
 */
function getDifficultyDistribution(averageElo, difficultyMode = 'adaptive') {
  if (difficultyMode === 'easy') {
    return { EASY: 4, MEDIUM: 1, HARD: 0 };
  }
  if (difficultyMode === 'medium') {
    return { EASY: 1, MEDIUM: 3, HARD: 1 };
  }
  if (difficultyMode === 'hard') {
    return { EASY: 0, MEDIUM: 1, HARD: 4 };
  }

  const avg = Number(averageElo) || 1200;
  if (avg < 1200) {
    return { EASY: 3, MEDIUM: 2, HARD: 0 };
  }
  if (avg <= 1600) {
    return { EASY: 1, MEDIUM: 3, HARD: 1 };
  }
  return { EASY: 0, MEDIUM: 1, HARD: 4 };
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Check if a question is a rich interactive question from the interactive pool
 */
function isRichInteractive(q) {
  if (!q) return false;
  if (q.externalId && q.externalId.startsWith('q_')) return true;
  if (q.interactiveQuestion) {
    const iq = q.interactiveQuestion;
    if (iq.type && iq.type !== 'universal_choice') return true;
    if (iq.payload && iq.payload.variant && iq.payload.variant !== 'test') return true;
  }
  return false;
}

/**
 * Check if a question is a matrix_toggle type
 */
function isMatrixToggleQuestion(q) {
  if (!q) return false;
  if (q.type === 'matrix_toggle') return true;
  if (q.interactiveQuestion && q.interactiveQuestion.type === 'matrix_toggle') return true;
  return false;
}

/**
 * Selects `count` (5) questions matching the ELO/difficulty distribution across `commonSubjects`.
 * Supports examType: 'LGS', 'TYT', 'AYT', 'KARMA'.
 * Ensures 2-3 questions come from rich interactive questions when available,
 * while strictly respecting the difficulty distribution and commonSubjects filter.
 * Düello karşılaşmalarında matrix_toggle türü sorular hariç tutulur.
 */
function selectMatchQuestions(bank, {
  examType = 'TYT',
  commonSubjects = ['matematik'],
  averageElo = 1200,
  count = 5,
  difficultyMode = 'adaptive',
}) {
  const normExam = String(examType).toUpperCase();
  const subjects = (commonSubjects.length > 0 ? commonSubjects : ['matematik']).map((s) => String(s).toLowerCase());
  const dist = getDifficultyDistribution(averageElo, difficultyMode);

  const selected = [];
  const usedIds = new Set();

  // Hedef: 5 soruluk bir maçta 2 ila 3 adet zengin interaktif soru seçmek
  const targetInteractive = count >= 5 ? 2 + Math.floor(Math.random() * 2) : Math.floor(count / 2);
  let interactivePicked = 0;

  const examMap = (bank.byExamSubjectDifficulty && bank.byExamSubjectDifficulty[normExam]) || {};

  for (const [diff, needed] of Object.entries(dist)) {
    if (needed <= 0) continue;

    let pool = [];
    if (normExam === 'KARMA') {
      for (const eKey of Object.keys(bank.byExamSubjectDifficulty || {})) {
        const eMap = bank.byExamSubjectDifficulty[eKey] || {};
        for (const subj of subjects) {
          const list = (eMap[subj] && eMap[subj][diff]) || [];
          pool.push(...list);
        }
      }
    } else {
      for (const subj of subjects) {
        const list = (examMap[subj] && examMap[subj][diff]) || [];
        pool.push(...list);
      }
    }
    // Düello eşleşmelerinde matrix_toggle türü soruları ele
    pool = shuffleArray(pool)
      .filter((q) => !usedIds.has(q.externalId))
      .filter((q) => !isMatrixToggleQuestion(q));

    const interactiveCandidates = pool.filter(isRichInteractive);
    const standardCandidates = pool.filter((q) => !isRichInteractive(q));

    let takeFromDiff = 0;

    // Bu zorluk seviyesinden interaktif soru alabilir miyiz?
    if (interactivePicked < targetInteractive && interactiveCandidates.length > 0) {
      const wantInteractive = Math.min(
        needed,
        targetInteractive - interactivePicked,
        interactiveCandidates.length
      );
      for (const q of interactiveCandidates.slice(0, wantInteractive)) {
        selected.push(q);
        usedIds.add(q.externalId);
        interactivePicked++;
        takeFromDiff++;
      }
    }

    // Bu zorluk için kalan kotayı standart sorulardan (yetmezse interaktiflerden) tamamla
    const remainingNeeded = needed - takeFromDiff;
    if (remainingNeeded > 0) {
      const remainingCandidates = standardCandidates.length >= remainingNeeded
        ? standardCandidates
        : [...standardCandidates, ...interactiveCandidates.filter((q) => !usedIds.has(q.externalId))];

      for (const q of remainingCandidates.slice(0, remainingNeeded)) {
        selected.push(q);
        usedIds.add(q.externalId);
      }
    }
  }

  // Güvenli ve Kademeli Fallback: Filtrelerin (özellikle seçilen ders/branşın) korunması esastır
  if (selected.length < count) {
    // 1. Kademe: İstenen sınav ve seçili branş havuzundaki kalan tüm sorular (farklı zorluklar dahil, matrix_toggle hariç)
    const sameExamSubjectPool = bank.allQuestions.filter(
      (q) => (normExam === 'KARMA' || q.examType === normExam) &&
             subjects.includes(q.subject) &&
             !usedIds.has(q.externalId) &&
             !isMatrixToggleQuestion(q)
    );
    for (const q of shuffleArray(sameExamSubjectPool)) {
      if (selected.length >= count) break;
      selected.push(q);
      usedIds.add(q.externalId);
    }
  }

  if (selected.length < count) {
    // 2. Kademe: Seçilen BRANŞI ASLA BOZMADAN diğer sınavlardan aynı branşa ait sorular (matrix_toggle hariç)
    const sameSubjectOtherExams = bank.allQuestions.filter(
      (q) => subjects.includes(q.subject) &&
             !usedIds.has(q.externalId) &&
             !isMatrixToggleQuestion(q)
    );
    for (const q of shuffleArray(sameSubjectOtherExams)) {
      if (selected.length >= count) break;
      selected.push(q);
      usedIds.add(q.externalId);
    }
  }

  if (selected.length < count) {
    // 3. Kademe: Seçilen branşta hiç kullanılmamış soru kalmadıysa, başka branşa geçmek yerine aynı branş sorularını döngüyle tekrar ekle (matrix_toggle hariç)
    const cycleSubjectPool = bank.allQuestions.filter(
      (q) => subjects.includes(q.subject) && !isMatrixToggleQuestion(q)
    );
    if (cycleSubjectPool.length > 0) {
      for (const q of shuffleArray(cycleSubjectPool)) {
        if (selected.length >= count) break;
        selected.push(q);
      }
    } else {
      // Sadece ve sadece soru bankasında bu branş hiç tanımlı değilse genel havuzdan al (güvenlik koruması)
      const generalFallback = bank.allQuestions.filter(
        (q) => !usedIds.has(q.externalId) && !isMatrixToggleQuestion(q)
      );
      for (const q of shuffleArray(generalFallback)) {
        if (selected.length >= count) break;
        selected.push(q);
        usedIds.add(q.externalId);
      }
    }
  }

  return selected.slice(0, count);
}

module.exports = {
  loadQuestionBank,
  getDifficultyDistribution,
  getDurationByDifficulty,
  selectMatchQuestions,
  isRichInteractive,
  formatQuestionText,
};
