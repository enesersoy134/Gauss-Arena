import rawCatalog from '../../kaynak-onerileri.json';

export interface ResourceRecommendation {
  id: string;
  bookTitle: string;
  publisher: string;
  recommendedSection: string;
  level: string;
  studyTip: string;
  examType: string;
}

/**
 * Yanlış yapılan ders (subject) ve konu başlığına (topic) göre kaynak-onerileri.json
 * dosyasından en uygun kaynak önerilerini döndürür.
 */
export function getRecommendationsForTopic(
  subject: string = 'matematik',
  topic: string = '',
  examType: string = 'TYT'
): ResourceRecommendation[] {
  const normSubj = String(subject || 'matematik').trim().toLowerCase();
  const normTopic = String(topic || '').trim().toLowerCase();
  const normExam = String(examType || 'TYT').trim().toUpperCase();

  const matches: ResourceRecommendation[] = [];

  for (const item of rawCatalog.topicRecommendations || []) {
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

  matches.sort((a, b) => {
    const aExact = a.examType === normExam ? 1 : 0;
    const bExact = b.examType === normExam ? 1 : 0;
    return bExact - aExact;
  });

  if (matches.length > 0) {
    return matches;
  }

  const defaults = rawCatalog.defaultBySubject as Record<string, any> | undefined;
  const fallback = defaults && defaults[normSubj];
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
