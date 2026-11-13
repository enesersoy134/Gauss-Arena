const fs = require('node:fs');
const path = require('node:path');

const defaultFilePath = path.join(__dirname, '..', '..', 'kaynak-onerileri.json');

let cachedCatalog = null;

function loadResourceCatalog(filePath = defaultFilePath) {
  if (cachedCatalog && filePath === defaultFilePath) {
    return cachedCatalog;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (filePath === defaultFilePath) {
      cachedCatalog = parsed;
    }
    return parsed;
  } catch {
    return {
      meta: { title: 'İşler Yayın Grubu Kaynak Önerileri' },
      topicRecommendations: [],
      defaultBySubject: {},
    };
  }
}

/**
 * Yanlış yapılan ders (subject) ve konu başlığına (topic) göre kaynak-onerileri.json'dan
 * en uygun İşler Yayın Grubu kitap ve fasikül önerilerini döndürür.
 */
function getRecommendationsForTopic(subject = 'matematik', topic = '', examType = 'TYT') {
  const catalog = loadResourceCatalog();
  const normSubj = String(subject || 'matematik').trim().toLowerCase();
  const normTopic = String(topic || '').trim().toLowerCase();
  const normExam = String(examType || 'TYT').trim().toUpperCase();

  const matches = [];

  for (const item of catalog.topicRecommendations || []) {
    if (String(item.subject).toLowerCase() !== normSubj) continue;

    const keywords = Array.isArray(item.topicKeywords) ? item.topicKeywords : [];
    const hit = keywords.some((kw) => normTopic.includes(String(kw).toLowerCase()));
    if (hit) {
      matches.push({
        id: item.id,
        bookTitle: item.bookTitle,
        publisher: item.publisher,
        recommendedSection: item.recommendedSection,
        level: item.level,
        studyTip: item.studyTip,
        examType: item.examType,
      });
    }
  }

  // Sınav türüne (TYT/AYT) tam uyanları öne sırala
  matches.sort((a, b) => {
    const aExact = a.examType === normExam ? 1 : 0;
    const bExact = b.examType === normExam ? 1 : 0;
    return bExact - aExact;
  });

  if (matches.length > 0) {
    return matches;
  }

  // Eşleşen özel anahtar kelime yoksa dersin genel önerisini döndür
  const fallback = catalog.defaultBySubject && catalog.defaultBySubject[normSubj];
  if (fallback) {
    return [
      {
        id: fallback.id,
        bookTitle: fallback.bookTitle,
        publisher: fallback.publisher,
        recommendedSection: fallback.recommendedSection,
        level: fallback.level,
        studyTip: fallback.studyTip,
        examType: fallback.examType,
      },
    ];
  }

  return [
    {
      id: 'rec_generic_isler',
      bookTitle: 'İşler Yayın Grubu Branş Soru Bankası',
      publisher: 'İşler Yayın Grubu',
      recommendedSection: `${topic || subject} Konu Tarama Testleri`,
      level: 'Orta',
      studyTip: 'Yanlış yaptığın konunun özetini tekrar edip 2 tarama testi çöz.',
      examType: normExam,
    },
  ];
}

module.exports = {
  loadResourceCatalog,
  getRecommendationsForTopic,
};
