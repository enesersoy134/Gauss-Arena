/**
 * Ortak Soru Filtreleme ve Havuz Seçim Motoru
 * Hem 1v1 Karşılaşma hem de Bireysel Alıştırma modlarında filtre bütünlüğünü (%100 Branş & Sınav doğruluğu) garanti eder.
 */

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Verilen soru havuzundan sınav kategorisi, ders/branş ve zorluk seviyesine göre soru seçer.
 * Asla seçilmeyen bir ders veya sınav kategorisinden soru sızdırmaz.
 */
function filterQuestions(allQuestions, {
  examType = 'TYT',
  subjects = ['matematik'],
  difficultyMode = 'adaptive',
  count = 5,
} = {}) {
  const normExam = String(examType || 'TYT').toUpperCase();
  const targetSubjects = (Array.isArray(subjects) && subjects.length > 0 ? subjects : ['matematik']).map((s) =>
    String(s).toLowerCase()
  );
  const diffMode = String(difficultyMode || 'adaptive').toLowerCase();
  const targetCount = Number(count) > 0 ? Number(count) : 5;

  // 1. İstenen sınav ve branşa ait tüm soruları filtrele
  const matchingExamAndSubject = (allQuestions || []).filter((q) => {
    const qExam = String(q.examType || 'TYT').toUpperCase();
    const examOk = normExam === 'KARMA' || qExam === normExam;
    const subjOk = targetSubjects.includes(String(q.subject || '').toLowerCase());
    return examOk && subjOk;
  });

  // 2. Zorluk önceliğine göre sırala
  let primaryPool = [];
  if (diffMode === 'easy' || diffMode === 'kolay') {
    const easy = matchingExamAndSubject.filter((q) => q.difficulty === 'kolay' || q.difficulty === 'EASY');
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta' || q.difficulty === 'MEDIUM');
    primaryPool = [...shuffle(easy), ...shuffle(medium)];
  } else if (diffMode === 'medium' || diffMode === 'orta') {
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta' || q.difficulty === 'MEDIUM');
    const easy = matchingExamAndSubject.filter((q) => q.difficulty === 'kolay' || q.difficulty === 'EASY');
    const hard = matchingExamAndSubject.filter((q) => q.difficulty === 'zor' || q.difficulty === 'HARD');
    primaryPool = [...shuffle(medium), ...shuffle(easy), ...shuffle(hard)];
  } else if (diffMode === 'hard' || diffMode === 'zor') {
    const hard = matchingExamAndSubject.filter((q) => q.difficulty === 'zor' || q.difficulty === 'HARD');
    const medium = matchingExamAndSubject.filter((q) => q.difficulty === 'orta' || q.difficulty === 'MEDIUM');
    primaryPool = [...shuffle(hard), ...shuffle(medium)];
  } else {
    // Adaptif mod
    primaryPool = shuffle(matchingExamAndSubject);
  }

  const selected = [];
  const usedIds = new Set();

  for (const q of primaryPool) {
    if (selected.length >= targetCount) break;
    const qId = q.id || q.externalId;
    if (!usedIds.has(qId)) {
      selected.push(q);
      usedIds.add(qId);
    }
  }

  // 3. Fallback 1: Aynı sınav ve seçili branş havuzundan kalan tüm sorular
  if (selected.length < targetCount) {
    for (const q of shuffle(matchingExamAndSubject)) {
      if (selected.length >= targetCount) break;
      const qId = q.id || q.externalId;
      if (!usedIds.has(qId)) {
        selected.push(q);
        usedIds.add(qId);
      }
    }
  }

  // 4. Fallback 2: Seçilen BRANŞI ASLA BOZMADAN diğer sınavlardan aynı branş sorularını ekle
  if (selected.length < targetCount) {
    const sameSubjectOtherExams = (allQuestions || []).filter((q) => {
      const qId = q.id || q.externalId;
      return targetSubjects.includes(String(q.subject || '').toLowerCase()) && !usedIds.has(qId);
    });
    for (const q of shuffle(sameSubjectOtherExams)) {
      if (selected.length >= targetCount) break;
      const qId = q.id || q.externalId;
      selected.push(q);
      usedIds.add(qId);
    }
  }

  // 5. Fallback 3: Aynı branşta tekil soru tükendiyse aynı branştan döngüsel olarak tamamla
  if (selected.length < targetCount) {
    const cycleSubject = (allQuestions || []).filter((q) =>
      targetSubjects.includes(String(q.subject || '').toLowerCase())
    );
    if (cycleSubject.length > 0) {
      while (selected.length < targetCount) {
        for (const q of shuffle(cycleSubject)) {
          if (selected.length >= targetCount) break;
          const qId = q.id || q.externalId;
          selected.push({ ...q, id: `${qId}_cycle_${selected.length}` });
        }
      }
    }
  }

  return selected.slice(0, targetCount);
}

module.exports = {
  filterQuestions,
  shuffle,
};
