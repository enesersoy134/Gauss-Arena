const fs = require('node:fs');
const path = require('node:path');

/**
 * Loads all JSON files in question-bank/{tyt,ayt}/{subject}/{easy,medium,hard}.json
 */
function loadQuestionBank(baseDir) {
  const byExamSubjectDifficulty = {};
  const allQuestions = [];

  if (!fs.existsSync(baseDir)) {
    return { byExamSubjectDifficulty, allQuestions, stats: { totalQuestions: 0, byExam: {} } };
  }

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
            const normalized = {
              externalId: q.externalId,
              examType,
              subject,
              difficulty,
              subTopic: q.subTopic || '',
              text: q.text,
              imageUrl: q.imageUrl || null,
              options: q.options || [],
              correctOptionIndex: Number(q.correctOptionIndex),
              // Spec: 60s (60000ms) demo duration per question
              durationMs: 60000,
              rawDurationMs: q.durationMs || meta.defaultDurationMs || 60000,
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
 * ELO-based question difficulty distribution:
 * < 1200: 3 EASY, 2 MEDIUM
 * 1200 - 1600: 1 EASY, 3 MEDIUM, 1 HARD
 * > 1600: 1 MEDIUM, 4 HARD
 */
function getDifficultyDistribution(averageElo) {
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
 * Selects `count` (5) questions matching the ELO difficulty distribution across `commonSubjects`.
 */
function selectMatchQuestions(bank, { examType = 'TYT', commonSubjects = ['matematik'], averageElo = 1200, count = 5 }) {
  const normExam = String(examType).toUpperCase();
  const subjects = (commonSubjects.length > 0 ? commonSubjects : ['matematik']).map((s) => String(s).toLowerCase());
  const dist = getDifficultyDistribution(averageElo);

  const selected = [];
  const usedIds = new Set();

  const examMap = (bank.byExamSubjectDifficulty && bank.byExamSubjectDifficulty[normExam]) || {};

  for (const [diff, needed] of Object.entries(dist)) {
    if (needed <= 0) continue;
    let pool = [];
    for (const subj of subjects) {
      const list = (examMap[subj] && examMap[subj][diff]) || [];
      pool.push(...list);
    }
    pool = shuffleArray(pool).filter((q) => !usedIds.has(q.externalId));
    for (const q of pool.slice(0, needed)) {
      selected.push(q);
      usedIds.add(q.externalId);
    }
  }

  // Fallback if fewer than `count` found in requested subjects/difficulties
  if (selected.length < count) {
    let fallbackPool = bank.allQuestions.filter(
      (q) => q.examType === normExam && subjects.includes(q.subject) && !usedIds.has(q.externalId)
    );
    if (fallbackPool.length < count - selected.length) {
      fallbackPool = bank.allQuestions.filter((q) => !usedIds.has(q.externalId));
    }
    for (const q of shuffleArray(fallbackPool)) {
      if (selected.length >= count) break;
      selected.push(q);
      usedIds.add(q.externalId);
    }
  }

  return selected.slice(0, count);
}

module.exports = {
  loadQuestionBank,
  getDifficultyDistribution,
  selectMatchQuestions,
};
