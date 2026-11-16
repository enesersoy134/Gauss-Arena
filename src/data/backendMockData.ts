/**
 * ============================================================================
 * 🌐 GAUSS ARENA - MERKEZİ BACKEND MOCK VERİ HAVUZU
 * ============================================================================
 * 
 * ⚠️ GELİŞTİRİCİ NOTU:
 * Bu dosyadaki tüm veriler (`BACKEND_GAME_DATA`) şu an prototip ve geliştirme
 * aşamasında yerel (mock) olarak tanımlanmıştır.
 * 
 * MİMARİ UYUM:
 * İlerleyen aşamalarda bu nesne ve soru havuzu; doğrudan FastAPI / Node.js
 * REST API servislerinden (`GET /api/v1/matches/{id}`) veya WebSocket
 * (Socket.io / Phoenix Channels / WebRTC DataChannel) üzerinden canlı
 * oyun oturumu başlatıldığında dinamik olarak beslenecek biçimde tasarlanmıştır.
 * Hiçbir UI bileşeni statik koda bağımlı kalmadan bu veri kontratını (`Question[]`)
 * tüketebilir.
 * ============================================================================
 */

import { PlayerInfo, MatchSettings, Question } from '../types/game';
export { evaluateNumpadWinner, calculateQuestionScore } from '../utils/scoring';

export interface BackendGameDataContract {
  players: {
    currentPlayer: PlayerInfo;
    opponentPlayer: PlayerInfo;
  };
  matchSettings: MatchSettings;
  questionPool: Question[];
}

export const MOCK_STUDENTS: PlayerInfo[] = [
  {
    id: 'p1',
    name: 'Ahmet Yılmaz',
    elo: 1250,
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmet&backgroundColor=f14e13',
    streak: 0,
    educationLevel: 'lise',
    gradeLevel: '12. Sınıf (YKS)',
    allowedExamTypes: ['TYT', 'AYT'],
    dailyQuestExempt: false,
    dailyCompleted: true,
    dailyQuestDone: true,
    completedMiniGames: ['fizik', 'kimya', 'biyoloji', 'matematik', 'geometri', 'turkce'],
  },
  {
    id: 'p2',
    name: 'Zeynep Kaya',
    elo: 1200,
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zeynep&backgroundColor=b6e3f4',
    streak: 5,
    educationLevel: 'lise',
    gradeLevel: '12. Sınıf (YKS)',
    allowedExamTypes: ['TYT', 'AYT'],
    dailyQuestExempt: false,
    dailyCompleted: true,
    dailyQuestDone: true,
    completedMiniGames: ['fizik', 'kimya', 'biyoloji', 'matematik', 'geometri', 'turkce'],
  },
  {
    id: 'p3',
    name: 'Mehmet Demir',
    elo: 1340,
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mehmet&backgroundColor=c0aede',
    streak: 1,
    educationLevel: 'ortaokul',
    gradeLevel: '8. Sınıf (LGS)',
    allowedExamTypes: ['LGS'],
    dailyQuestExempt: true,
    dailyCompleted: false,
    dailyQuestDone: false,
    completedMiniGames: [],
  },
  {
    id: 'p4',
    name: 'Ayşe Çelik',
    elo: 1620,
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayse&backgroundColor=ffd5dc',
    streak: 3,
    educationLevel: 'ortaokul',
    gradeLevel: '8. Sınıf (LGS)',
    allowedExamTypes: ['LGS'],
    dailyQuestExempt: true,
    dailyCompleted: false,
    dailyQuestDone: false,
    completedMiniGames: [],
  },
];

export const BACKEND_GAME_DATA: BackendGameDataContract = {
  // Karşılaşmadaki 2 Oyuncunun Verisi
  players: {
    currentPlayer: {
      id: 'p1',
      name: 'Ahmet Yılmaz',
      elo: 1250,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmet&backgroundColor=f14e13',
      streak: 0,
      educationLevel: 'lise',
      gradeLevel: '12. Sınıf (YKS)',
      allowedExamTypes: ['TYT', 'AYT'],
      dailyQuestExempt: false,
      dailyCompleted: true,
      dailyQuestDone: true,
      completedMiniGames: ['fizik', 'kimya', 'biyoloji', 'matematik', 'geometri', 'turkce'],
    },
    opponentPlayer: {
      id: 'p2',
      name: 'Zeynep Kaya',
      elo: 1200,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zeynep&backgroundColor=b6e3f4',
      streak: 5,
      educationLevel: 'lise',
      gradeLevel: '12. Sınıf (YKS)',
      allowedExamTypes: ['TYT', 'AYT'],
      dailyQuestExempt: false,
      dailyCompleted: true,
      dailyQuestDone: true,
      completedMiniGames: ['fizik', 'kimya', 'biyoloji', 'matematik', 'geometri', 'turkce'],
    }
  },

  // Karşılaşma ve Maç Kuralları
  matchSettings: {
    matchId: 'match-2026-isler',
    questionsPerMatch: 5,
    intermissionCountdownSec: 5,
    eloWinDelta: 25,
    eloLossDelta: -20
  },

  // 14 Soru Mekaniği ve Tüm Varyantlarını (Toplam 18 Zengin Soru) Kapsayan Soru Havuzu
  questionPool: [
    /* ----------------------------------------------------------------------
     * 1. UNIVERSAL CHOICE - Varyant: 'test' (Klasik 4 Şıklı Test) | Matematik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_uc_test_001',
      subject: 'matematik',
      topic: 'Türev ve Teğet Eğimi',
      type: 'universal_choice',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 100,
      prompt: 'f(x) = 3x² - 4x + 7 fonksiyonunun x = 2 noktasındaki teğetinin eğimi (f\'(2)) kaçtır?',
      explanation: 'f\'(x) = 6x - 4 türevidir. x = 2 için f\'(2) = 6(2) - 4 = 12 - 4 = 8 bulunur.',
      payload: {
        variant: 'test',
        optionCount: 4,
        options: ['6', '8', '10', '12'],
        correctIndex: 1,
        shuffleOptions: true
      }
    },

    /* ----------------------------------------------------------------------
     * 2. UNIVERSAL CHOICE - Varyant: 'true_false' (Doğru / Yanlış Hız Kartı) | Fizik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_uc_tf_002',
      subject: 'fizik',
      topic: 'Dalgalar ve Ses',
      type: 'universal_choice',
      difficulty: 'kolay',
      timeLimitSeconds: 10,
      points: 80,
      prompt: 'Ses dalgaları yayılmak için maddesel ortama ihtiyaç duyar; bu sebeple uzay boşluğunda yayılamaz.',
      explanation: 'Doğru! Ses mekanik bir dalgadır ve parçacıkların titreşimiyle yayılır. Boşlukta madde olmadığı için ses iletilemez.',
      payload: {
        variant: 'true_false',
        optionCount: 2,
        options: ['Doğru', 'Yanlış'],
        correctIndex: 0,
        shuffleOptions: false
      }
    },

    /* ----------------------------------------------------------------------
     * 3. UNIVERSAL CHOICE - Varyant: 'comparison' (3 Şıklı Karşılaştırma) | Matematik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_uc_comp_003',
      subject: 'matematik',
      topic: 'Trigonometrik Değerler',
      type: 'universal_choice',
      difficulty: 'orta',
      timeLimitSeconds: 15,
      points: 100,
      prompt: 'Sol ve sağdaki ifadeleri karşılaştırarak aralarındaki doğru ilişkiyi seçin:',
      explanation: 'Tümler açılarda sin(30°) = cos(60°) = 1/2 olduğundan her iki değer birbirine eşittir (=).',
      payload: {
        variant: 'comparison',
        optionCount: 3,
        comparisonItems: {
          left: 'sin(30°)',
          right: 'cos(60°)'
        },
        options: ['<', '=', '>'],
        correctIndex: 1,
        shuffleOptions: false
      }
    },

    /* ----------------------------------------------------------------------
     * 4. UNIVERSAL CHOICE - Varyant: 'odd_one_out' (Yabancıyı Bul) | Kimya
     * ---------------------------------------------------------------------- */
    {
      id: 'q_uc_odd_004',
      subject: 'kimya',
      topic: 'Periyodik Sistem ve Element Sınıfları',
      type: 'universal_choice',
      difficulty: 'kolay',
      timeLimitSeconds: 12,
      points: 90,
      prompt: 'Aşağıdaki elementlerden hangisi gruba uymaz (soygaz değildir)?',
      explanation: 'Helyum (He), Neon (Ne) ve Argon (Ar) 8A grubu soygazlarıdır. Klor (Cl) ise 7A grubu halojenidir.',
      payload: {
        variant: 'odd_one_out',
        optionCount: 4,
        options: ['Helyum (He)', 'Neon (Ne)', 'Klor (Cl)', 'Argon (Ar)'],
        correctIndex: 2,
        shuffleOptions: true
      }
    },

    /* ----------------------------------------------------------------------
     * 5. ORDERING AND FORMULA - Mod: 'sequence' (Biyolojik Süreç Sıralama) | Biyoloji
     * ---------------------------------------------------------------------- */
    {
      id: 'q_of_seq_005',
      subject: 'biyoloji',
      topic: 'Hücre Bölünmesi (Mitoz)',
      type: 'ordering_and_formula',
      difficulty: 'orta',
      timeLimitSeconds: 25,
      points: 150,
      prompt: 'Mitoz bölünmenin karyokinez (çekirdek bölünmesi) evrelerini gerçekleşme sırasına göre dizin.',
      explanation: 'Mitozun doğru evre sırası: Profaz -> Metafaz -> Anafaz -> Telofaz (PMAT kuralı).',
      payload: {
        mode: 'sequence',
        directionLabel: 'İlk Evreden -> Son Evreye',
        items: ['Telofaz', 'Profaz', 'Anafaz', 'Metafaz'],
        correctOrder: ['Profaz', 'Metafaz', 'Anafaz', 'Telofaz']
      }
    },

    /* ----------------------------------------------------------------------
     * 6. ORDERING AND FORMULA - Mod: 'formula_builder' (Fizik Formül İnşası) | Fizik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_of_form_006',
      subject: 'fizik',
      topic: 'Newton\'un Hareket Yasaları',
      type: 'ordering_and_formula',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 150,
      prompt: 'Newton\'un 2. Hareket Yasası\'nın temel formülünü blokları doğru sırayla yerleştirerek kurun:',
      explanation: 'Net kuvvet, kütle ile ivmenin çarpımına eşittir: F = m × a.',
      payload: {
        mode: 'formula_builder',
        template: '[ ? ] = [ ? ] × [ ? ]',
        items: ['m', 'F', 'v', 'a', 't'],
        correctOrder: ['F', 'm', 'a']
      }
    },

    /* ----------------------------------------------------------------------
     * 7. PAIR MATCHING (İkili Eşleştirme Düellosu) | Matematik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_pm_007',
      subject: 'matematik',
      topic: 'Temel Türev Alma Kuralları',
      type: 'pair_matching',
      difficulty: 'orta',
      timeLimitSeconds: 25,
      points: 200,
      prompt: 'Sol sütundaki fonksiyonları sağ sütundaki birinci türevleriyle eşleştirin.',
      explanation: '(x³)\' = 3x², (sin x)\' = cos x, (ln x)\' = 1/x, (eˣ)\' = eˣ türev kurallarıdır.',
      payload: {
        leftColumnTitle: 'Fonksiyon f(x)',
        rightColumnTitle: 'Türevi f\'(x)',
        pairs: [
          { pairId: 'pm_1', leftText: 'x³', rightText: '3x²' },
          { pairId: 'pm_2', leftText: 'sin(x)', rightText: 'cos(x)' },
          { pairId: 'pm_3', leftText: 'ln(x)', rightText: '1 / x' },
          { pairId: 'pm_4', leftText: 'eˣ', rightText: 'eˣ' }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 8. SWIPE GROUPING (Tinder Tarzı Sağa/Sola Hızlı Sınıflandırma) | Fizik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_sw_008',
      subject: 'fizik',
      topic: 'Fiziksel Büyüklükler (Skaler vs Vektörel)',
      type: 'swipe_grouping',
      difficulty: 'kolay',
      timeLimitSeconds: 20,
      points: 200,
      prompt: 'Gelen fiziksel büyüklükleri SOLA (Skaler) veya SAĞA (Vektörel) kaydırarak sınıflandır!',
      explanation: 'Yönü olan büyüklükler vektörel (Kuvvet, Yer Değiştirme, Hız); yönü olmayan sadece sayı ve birimle ifade edilenler skalerdir (Kütle, Sıcaklık, Enerji).',
      payload: {
        leftCategory: { id: 'left', label: '⬅️ Skaler Büyüklük' },
        rightCategory: { id: 'right', label: 'Vektörel Büyüklük ➡️' },
        cards: [
          { id: 'c1', text: 'Kütle', correctCategory: 'left' },
          { id: 'c2', text: 'Kuvvet', correctCategory: 'right' },
          { id: 'c3', text: 'Sıcaklık', correctCategory: 'left' },
          { id: 'c4', text: 'Yer Değiştirme', correctCategory: 'right' },
          { id: 'c5', text: 'Hız', correctCategory: 'right' },
          { id: 'c6', text: 'Enerji', correctCategory: 'left' }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 9. NUMPAD CLOSEST (Sayısal Kasa Şifresi / En Yakın Kazansın) | Kimya
     * ---------------------------------------------------------------------- */
    {
      id: 'q_np_009',
      subject: 'kimya',
      topic: 'Mol Kavramı ve Bağıl Molekül Kütlesi',
      type: 'numpad_closest',
      difficulty: 'orta',
      timeLimitSeconds: 15,
      points: 150,
      prompt: 'Suyun (H₂O) mol kütlesi kaç g/mol\'dür? (H: 1, O: 16)',
      explanation: 'H₂O için: 2·(1) + 16 = 18 g/mol.',
      payload: {
        correctAnswer: 18,
        unit: 'g/mol',
        allowDecimals: false,
        allowNegative: false,
        min: 1,
        max: 200
      }
    },

    /* ----------------------------------------------------------------------
     * 10. MULTI SELECT BUBBLE (Baloncuk Avı / Çoklu Seçim) | Biyoloji
     * ---------------------------------------------------------------------- */
    {
      id: 'q_mb_010',
      subject: 'biyoloji',
      topic: 'Hücre Zarından Madde Geçişleri',
      type: 'multi_select_bubble',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 180,
      prompt: 'Hücre zarından doğrudan (sindirilmeden/fagositozsuz) geçebilen monomer ve küçük molekülleri patlatın!',
      explanation: 'Glikoz, Amino Asit ve Oksijen küçük monomer/gazlardır ve zardan doğrudan geçer. Nişasta, Protein ve Glikojen makromoleküldür, sindirilmeden geçemez.',
      payload: {
        instruction: 'Doğrudan geçebilen tüm küçük molekülleri seçin:',
        minRequiredCorrect: 3,
        items: [
          { id: 'b1', text: 'Glikoz', isCorrect: true },
          { id: 'b2', text: 'Nişasta', isCorrect: false },
          { id: 'b3', text: 'Amino Asit', isCorrect: true },
          { id: 'b4', text: 'Protein', isCorrect: false },
          { id: 'b5', text: 'Oksijen', isCorrect: true },
          { id: 'b6', text: 'Glikojen', isCorrect: false }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 11. STEPPER BALANCE (Katsayı Artır / Azalt ile Tepkime Dengeleme) | Kimya
     * ---------------------------------------------------------------------- */
    {
      id: 'q_sb_011',
      subject: 'kimya',
      topic: 'Kimyasal Tepkime Denkleştirme',
      type: 'stepper_balance',
      difficulty: 'orta',
      timeLimitSeconds: 25,
      points: 180,
      prompt: 'Propan gazının yanma tepkimesini katsayıları ayarlayarak en küçük tam sayılarla denkleştirin:',
      explanation: '1 C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O katsayılarıyla C (3), H (8) ve O (10) atomları her iki tarafta eşitlenir.',
      payload: {
        equationTemplate: '[ {s1} ] C₃H₈ + [ {s2} ] O₂ → [ {s3} ] CO₂ + [ {s4} ] H₂O',
        targetDescription: 'Her iki taraftaki C, H ve O atom sayılarını dengeleyin',
        slots: [
          { id: 's1', label: 'C₃H₈', initialValue: 1, correctValue: 1, min: 1, max: 10 },
          { id: 's2', label: 'O₂', initialValue: 1, correctValue: 5, min: 1, max: 10 },
          { id: 's3', label: 'CO₂', initialValue: 1, correctValue: 3, min: 1, max: 10 },
          { id: 's4', label: 'H₂O', initialValue: 1, correctValue: 4, min: 1, max: 10 }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 12. SPOT THE BUG (Hatalı Parçayı / Adımı Bul) | Matematik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_stb_012',
      subject: 'matematik',
      topic: 'Birinci Dereceden Denklemler',
      type: 'spot_the_bug',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 140,
      prompt: '3(2x - 4) + 5 = 23 denklemini çözen öğrencinin yaptığı İLK HATALI adımı seçin:',
      explanation: '2. Adımda parantez açılırken 3 katsayısı -4 ile çarpılmamış (-12 yerine -4 yazılmıştır).',
      payload: {
        contextPrompt: 'Denklem: 3(2x - 4) + 5 = 23',
        displayLayout: 'vertical_steps',
        blocks: [
          { id: 'b1', blockText: '1. Adım: 3(2x - 4) = 18', isBug: false },
          { id: 'b2', blockText: '2. Adım: 6x - 4 = 18', isBug: true, feedbackNote: 'Dağılma hatası: 6x - 12 = 18 olmalıydı.' },
          { id: 'b3', blockText: '3. Adım: 6x = 22', isBug: false },
          { id: 'b4', blockText: '4. Adım: x = 11/3', isBug: false }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 13. PROGRESSIVE CLUES (Aşamalı İpucu / Ben Kimim?) | Kimya
     * ---------------------------------------------------------------------- */
    {
      id: 'q_pc_013',
      subject: 'kimya',
      topic: 'Periyodik Sistem ve Elementler',
      type: 'progressive_clues',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 400,
      prompt: 'Açılan ipuçlarını takip ederek gizemli elementi en kısa sürede bulun!',
      explanation: 'Alüminyum (Al): 3. periyot 3A grubunda yer alır, amfoter metaldir, bileşiklerinde +3 alır ve atom numarası 13\'tür.',
      payload: {
        options: ['Magnezyum', 'Alüminyum', 'Silisyum', 'Çinko'],
        correctIndex: 1,
        revealIntervalSeconds: 4,
        clues: [
          { stage: 1, secondsToReveal: 0, clueText: 'Hem asitlerle hem de kuvvetli bazlarla tepkimeye giren amfoter bir metalim.', pointsReward: 400 },
          { stage: 2, secondsToReveal: 4, clueText: 'Periyodik tablonun 3. periyot 3A (13.) grubunda yer alırım.', pointsReward: 300 },
          { stage: 3, secondsToReveal: 8, clueText: 'Bileşiklerimde yalnızca +3 yükseltgenme basamağına sahibim.', pointsReward: 200 },
          { stage: 4, secondsToReveal: 12, clueText: 'Sembolüm \'Al\' ve atom numaram 13\'tür.', pointsReward: 100 }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 14. TARGET COMBINATION (Hedef Değeri Sağlayan İkiliyi Seç) | Fizik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_tc_014',
      subject: 'fizik',
      topic: 'Elektrik Akımı ve Direnç Bağlantıları',
      type: 'target_combination',
      difficulty: 'orta',
      timeLimitSeconds: 15,
      points: 160,
      prompt: 'Paralel bağlandıklarında eşdeğer direnci 4 Ω yapan İKİ direnci seçin:',
      explanation: 'Paralel bağlı 6 Ω ve 12 Ω için eşdeğer direnç: (6 × 12) / (6 + 12) = 72 / 18 = 4 Ω olur.',
      payload: {
        targetBadge: 'Hedef: Eşdeğer Direnç = 4 Ω',
        ruleHint: 'Paralel bağlandığında 4 Ω veren 2 direnci seçin',
        options: [
          { id: 'r1', label: '2 Ω' },
          { id: 'r2', label: '6 Ω' },
          { id: 'r3', label: '8 Ω' },
          { id: 'r4', label: '12 Ω' },
          { id: 'r5', label: '16 Ω' }
        ],
        correctPairIds: ['r2', 'r4']
      }
    },

    /* ----------------------------------------------------------------------
     * 15. CHAIN CONVERSION (Zincirleme Dönüşüm) | Biyoloji
     * ---------------------------------------------------------------------- */
    {
      id: 'q_cc_015',
      subject: 'biyoloji',
      topic: 'Hücresel Enerji Dönüşümleri',
      type: 'chain_conversion',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 170,
      prompt: 'Güneş ışığından başlayarak hücresel enerjinin üretim zincirini tamamlayın:',
      explanation: 'Güneş enerjisi kloroplastta glikozun kimyasal bağ enerjisine, ardından mitokondride hücresel solunumla ATP\'ye dönüştürülür.',
      payload: {
        startEntity: 'Güneş Işığı Enerjisi',
        steps: [
          { stepNumber: 1, arrowLabel: 'Kloroplast (Fotosentez)', correctValue: 'Glikoz (Kimyasal Bağ)' },
          { stepNumber: 2, arrowLabel: 'Mitokondri (Solunum)', correctValue: 'ATP Enerjisi' }
        ],
        poolOptions: [
          'Glikoz (Kimyasal Bağ)',
          'ATP Enerjisi',
          'Kreatin Fosfat',
          'Glikojen Deposu',
          'Isı Enerjisi'
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 16. MATRIX TOGGLE (Özellik Matrisi / Şalter Tablosu) | Biyoloji
     * ---------------------------------------------------------------------- */
    {
      id: 'q_mt_016',
      subject: 'biyoloji',
      topic: 'Hücre Bölünmeleri Karşılaştırması',
      type: 'matrix_toggle',
      difficulty: 'orta',
      timeLimitSeconds: 25,
      points: 190,
      prompt: 'Mitoz ve Mayoz bölünme özelliklerini tablodaki hücrelere dokunarak (✓ / ✗) doldurun:',
      explanation: 'Mitozda krossing-over görülmez (✗), vücut hücresinde görülür (✓). Mayozda krossing-over görülür (✓), üreme ana hücrelerinde görülür (vücut hücresinde değil ✗).',
      payload: {
        tablePrompt: 'Her hücreyi ✓ (Evet) veya ✗ (Hayır) olarak işaretleyin:',
        rows: [
          { id: 'r_mitoz', title: 'Mitoz' },
          { id: 'r_mayoz', title: 'Mayoz' }
        ],
        columns: [
          { id: 'c_kross', title: 'Krossing-over Görülür' },
          { id: 'c_somat', title: 'Vücut Hücresinde Görülür' }
        ],
        answers: [
          { rowId: 'r_mitoz', colId: 'c_kross', expectedBool: false },
          { rowId: 'r_mitoz', colId: 'c_somat', expectedBool: true },
          { rowId: 'r_mayoz', colId: 'c_kross', expectedBool: true },
          { rowId: 'r_mayoz', colId: 'c_somat', expectedBool: false }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 17. SLIDER (Parametre Ayarlama ve Sistem Dengeleme) | Fizik
     * ---------------------------------------------------------------------- */
    {
      id: 'q_sl_017',
      subject: 'fizik',
      topic: 'Tork ve Kaldıraç Dengesi',
      type: 'slider',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 150,
      prompt: 'Destek noktasının solunda 3 birim uzaklıkta 40 N ağırlık var. Çubuğun yatay dengede kalması için sağ tarafta 2 birim uzaklıktaki F kuvvetini sürgü ile ayarlayın!',
      explanation: 'Sol tork = Sağ tork => 40 · 3 = F · 2 => 120 = 2F => F = 60 N olmalıdır.',
      payload: {
        min: 0,
        max: 100,
        step: 5,
        initialValue: 20,
        unit: 'N',
        targetValue: 60,
        tolerance: 0,
        visualSimulationType: 'torque_seesaw'
      }
    },

    /* ----------------------------------------------------------------------
     * 18. HOTSPOT (Görsel Üzerinde Doğru Bölgeye Dokunma) | Biyoloji
     * ---------------------------------------------------------------------- */
    {
      id: 'q_hs_018',
      subject: 'biyoloji',
      topic: 'Hücre Organelleri',
      type: 'hotspot',
      difficulty: 'orta',
      timeLimitSeconds: 15,
      points: 150,
      prompt: 'Verilen ökaryot hücre modeli üzerinde \'Golgi Cisimciği\'nin bulunduğu bölgeye dokunun!',
      explanation: 'Golgi cisimciği üst üste dizilmiş yassı keseciklerden (sisternalardan) oluşur; protein ve lipitlerin paketlenmesinden ve salgılanmasından sorumludur.',
      payload: {
        imageUrl: '/eukaryotic-cell.svg',
        imageAlt: 'Ökaryot hücre şeması ve organelleri',
        regions: [
          { id: 'reg_nucleus', label: 'Çekirdek', xPercent: 48, yPercent: 50, radiusPercent: 12 },
          { id: 'reg_golgi', label: 'Golgi Cisimciği', xPercent: 65, yPercent: 62, radiusPercent: 8 },
          { id: 'reg_mito', label: 'Mitokondri', xPercent: 28, yPercent: 38, radiusPercent: 8 },
          { id: 'reg_vacuole', label: 'Koful', xPercent: 29, yPercent: 69, radiusPercent: 8 }
        ],
        correctRegionId: 'reg_golgi'
      }
    },

    /* ----------------------------------------------------------------------
     * 19. HOTSPOT - Parabol ve Tepe Noktası (AYT Matematik)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_hs_019',
      subject: 'matematik',
      topic: 'Parabol ve Tepe Noktası',
      type: 'hotspot',
      difficulty: 'orta',
      timeLimitSeconds: 15,
      points: 160,
      prompt: 'Koordinat düzleminde verilen f(x) = x² - 4 parabolünün Tepe Noktasının (T) bulunduğu bölgeye dokunun!',
      explanation: 'f(x) = x² - 4 parabolünün simetri ekseni r = 0 ve minimum değeri k = -4 olduğundan tepe noktası T(0, -4) noktasıdır.',
      payload: {
        imageUrl: '',
        imageAlt: 'f(x) = x² - 4 parabol grafiği',
        regions: [
          { id: 'reg_vertex', label: 'T(0, -4)', xPercent: 50, yPercent: 74, radiusPercent: 8 },
          { id: 'reg_root_left', label: 'Kök (-2, 0)', xPercent: 35, yPercent: 50, radiusPercent: 8 },
          { id: 'reg_root_right', label: 'Kök (+2, 0)', xPercent: 65, yPercent: 50, radiusPercent: 8 },
          { id: 'reg_origin', label: 'Orijin (0, 0)', xPercent: 50, yPercent: 50, radiusPercent: 8 }
        ],
        correctRegionId: 'reg_vertex'
      }
    },

    /* ----------------------------------------------------------------------
     * 20. PAIR MATCHING - Cumhuriyet Dönemi Roman ve Yazar Eşleştirmesi (AYT Edebiyat)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_pm_020',
      subject: 'turkce',
      topic: 'Cumhuriyet Dönemi Roman ve Yazar Eşleştirmesi',
      type: 'pair_matching',
      difficulty: 'orta',
      timeLimitSeconds: 25,
      points: 200,
      prompt: 'Sol sütundaki başyapıt romanları sağ sütundaki yazarlarımızla eşleştirin.',
      explanation: 'Tutunamayanlar -> Oğuz Atay, Saatleri Ayarlama Enstitüsü -> Ahmet Hamdi Tanpınar, İnce Memed -> Yaşar Kemal, Kürk Mantolu Madonna -> Sabahattin Ali.',
      payload: {
        leftColumnTitle: 'Roman',
        rightColumnTitle: 'Yazar',
        pairs: [
          { pairId: 'lit_1', leftText: 'Tutunamayanlar', rightText: 'Oğuz Atay' },
          { pairId: 'lit_2', leftText: 'Saatleri Ayarlama Enstitüsü', rightText: 'Ahmet Hamdi Tanpınar' },
          { pairId: 'lit_3', leftText: 'İnce Memed', rightText: 'Yaşar Kemal' },
          { pairId: 'lit_4', leftText: 'Kürk Mantolu Madonna', rightText: 'Sabahattin Ali' }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 21. SWIPE GROUPING - Endotermik vs Ekzotermik Tepkimeler (AYT Kimya)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_sw_021',
      subject: 'kimya',
      topic: 'Kimyasal Tepkimelerde Enerji (Endotermik vs Ekzotermik)',
      type: 'swipe_grouping',
      difficulty: 'orta',
      timeLimitSeconds: 25,
      points: 200,
      prompt: 'Verilen olayları SOLA (Endotermik / Isı Alan) veya SAĞA (Ekzotermik / Isı Veren) kaydırarak sınıflandırın!',
      explanation: 'Erime, buharlaşma ve azot gazının yanması ısı alan (endotermik, ΔH > 0); doğalgazın yanması, nötralleşme ve donma ısı veren (ekzotermik, ΔH < 0) olaylardır.',
      payload: {
        leftCategory: { id: 'left', label: '⬅️ Endotermik (ΔH > 0)' },
        rightCategory: { id: 'right', label: 'Ekzotermik (ΔH < 0) ➡️' },
        cards: [
          { id: 'e1', text: 'Buzun Erimesi', correctCategory: 'left' },
          { id: 'e2', text: 'Doğalgazın Yanması', correctCategory: 'right' },
          { id: 'e3', text: 'Suyun Buharlaşması', correctCategory: 'left' },
          { id: 'e4', text: 'Asit-Baz Nötralleşmesi', correctCategory: 'right' },
          { id: 'e5', text: 'Azot Gazının Yanması', correctCategory: 'left' },
          { id: 'e6', text: 'Suyun Donması', correctCategory: 'right' }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 22. ORDERING AND FORMULA - Oksijenli Solunum Evreleri (AYT Biyoloji)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_of_seq_022',
      subject: 'biyoloji',
      topic: 'Oksijenli Solunum Evreleri',
      type: 'ordering_and_formula',
      difficulty: 'zor',
      timeLimitSeconds: 25,
      points: 180,
      prompt: 'Ökaryot bir hücrede glikozun oksijenli solunumla yıkım evrelerini gerçekleşme sırasına göre dizin.',
      explanation: 'Oksijenli solunum sırasıyla: Glikoliz (Sitoplazma) -> Pirüvat Oksidasyonu -> Krebs Döngüsü (Matriks) -> ETS (Krista) aşamalarıyla gerçekleşir.',
      payload: {
        mode: 'sequence',
        directionLabel: 'İlk Evreden -> Son Evreye',
        items: ['Krebs Döngüsü', 'Glikoliz', 'ETS (Elektron Taşıma Sistemi)', 'Pirüvat Oksidasyonu'],
        correctOrder: ['Glikoliz', 'Pirüvat Oksidasyonu', 'Krebs Döngüsü', 'ETS (Elektron Taşıma Sistemi)']
      }
    },

    /* ----------------------------------------------------------------------
     * 23. ORDERING AND FORMULA - Kondansatör (Sığaç) Yük Formülü (AYT Fizik)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_of_form_023',
      subject: 'fizik',
      topic: 'Sığaçlar (Kondansatörler)',
      type: 'ordering_and_formula',
      difficulty: 'kolay',
      timeLimitSeconds: 20,
      points: 150,
      prompt: 'Bir kondansatörde (sığaçta) depolanan elektrik yükü formülünü blokları doğru sırayla yerleştirerek kurun:',
      explanation: 'Kondansatörde depolanan yük, sığa ile gerilimin çarpımına eşittir: Q = C × V.',
      payload: {
        mode: 'formula_builder',
        template: '[ ? ] = [ ? ] × [ ? ]',
        items: ['C', 'Q', 'V', 'R', 'I'],
        correctOrder: ['Q', 'C', 'V']
      }
    },

    /* ----------------------------------------------------------------------
     * 24. NUMPAD CLOSEST - Logaritma Hesaplama (AYT Matematik)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_np_024',
      subject: 'matematik',
      topic: 'Logaritma Hesaplama',
      type: 'numpad_closest',
      difficulty: 'kolay',
      timeLimitSeconds: 18,
      points: 150,
      prompt: 'log₂(64) + log₃(81) + log₅(25) işleminin sonucu kaçtır?',
      explanation: 'log₂(2⁶) = 6, log₃(3⁴) = 4 ve log₅(5²) = 2 olduğundan 6 + 4 + 2 = 12 bulunur.',
      payload: {
        correctAnswer: 12,
        unit: '',
        allowDecimals: false,
        allowNegative: false,
        min: 0,
        max: 100
      }
    },

    /* ----------------------------------------------------------------------
     * 25. MULTI SELECT BUBBLE - Yazım Kuralları (TYT Türkçe)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_mb_025',
      subject: 'turkce',
      topic: 'Yazım Kuralları (Birleşik Sözcükler)',
      type: 'multi_select_bubble',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 180,
      prompt: 'TDK Yazım Kılavuzuna göre yazımı DOĞRU olan 3 sözcüğü seçerek baloncukları patlatın!',
      explanation: 'Öngörü, Başvuru ve Vazgeçmek bitişik yazılır (doğru). "Her şey", "fark etmek" ve "ya da" ise ayrı yazılmalıdır.',
      payload: {
        instruction: 'Yazımı DOĞRU olan 3 sözcüğü seçin:',
        minRequiredCorrect: 3,
        items: [
          { id: 'w1', text: 'Öngörü', isCorrect: true },
          { id: 'w2', text: 'Herşey', isCorrect: false },
          { id: 'w3', text: 'Başvuru', isCorrect: true },
          { id: 'w4', text: 'Farketmek', isCorrect: false },
          { id: 'w5', text: 'Vazgeçmek', isCorrect: true },
          { id: 'w6', text: 'Yada', isCorrect: false }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 26. STEPPER BALANCE - Haber-Bosch Amonyak Sentezi (AYT Kimya)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_sb_026',
      subject: 'kimya',
      topic: 'Kimyasal Denge ve Amonyak Sentezi',
      type: 'stepper_balance',
      difficulty: 'kolay',
      timeLimitSeconds: 20,
      points: 170,
      prompt: 'Haber-Bosch amonyak sentezi tepkimesini en küçük tam sayılarla denkleştirin:',
      explanation: '1 N₂ + 3 H₂ → 2 NH₃ katsayılarıyla her iki tarafta 2 azot ve 6 hidrojen atomu eşitlenir.',
      payload: {
        equationTemplate: '[ {s1} ] N₂(g) + [ {s2} ] H₂(g) ⇌ [ {s3} ] NH₃(g)',
        targetDescription: 'Azot (N) ve Hidrojen (H) atom sayılarını dengeleyin',
        slots: [
          { id: 's1', label: 'N₂', initialValue: 1, correctValue: 1, min: 1, max: 6 },
          { id: 's2', label: 'H₂', initialValue: 1, correctValue: 3, min: 1, max: 6 },
          { id: 's3', label: 'NH₃', initialValue: 1, correctValue: 2, min: 1, max: 6 }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 27. SPOT THE BUG - Logaritma Denklemleri (AYT Matematik)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_stb_027',
      subject: 'matematik',
      topic: 'Logaritma Denklemleri',
      type: 'spot_the_bug',
      difficulty: 'zor',
      timeLimitSeconds: 22,
      points: 180,
      prompt: 'log₂(x) + log₂(x - 2) = 3 denklemini çözen öğrencinin yaptığı İLK HATALI adımı seçin:',
      explanation: '1. Adımda aynı tabandaki logaritmaların toplamı çarpıma dönüşmeliydi: log₂(x · (x - 2)) = 3 olmalıydı.',
      payload: {
        contextPrompt: 'Denklem: log₂(x) + log₂(x - 2) = 3',
        displayLayout: 'vertical_steps',
        blocks: [
          { id: 'lb1', blockText: '1. Adım: log₂(x + x - 2) = 3', isBug: true, feedbackNote: 'Logaritma özelliği hatası: log₂(x · (x - 2)) = 3 olmalıydı!' },
          { id: 'lb2', blockText: '2. Adım: 2x - 2 = 2³', isBug: false },
          { id: 'lb3', blockText: '3. Adım: 2x = 10', isBug: false },
          { id: 'lb4', blockText: '4. Adım: x = 5', isBug: false }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 28. PROGRESSIVE CLUES - Endokrin Sistem ve Hormonlar (AYT Biyoloji)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_pc_028',
      subject: 'biyoloji',
      topic: 'Endokrin Sistem ve Hormonlar',
      type: 'progressive_clues',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 400,
      prompt: 'İpuçlarını takip ederek insan vücudundaki bu kritik hormonu en erken aşamada bulun!',
      explanation: 'İnsülin hormonu pankreasın Langerhans adacıklarındaki Beta hücrelerinden salgılanır ve kan şekerini düşürür.',
      payload: {
        options: ['Glukagon', 'İnsülin', 'Adrenalin', 'Tiroksin'],
        correctIndex: 1,
        revealIntervalSeconds: 4,
        clues: [
          { stage: 1, secondsToReveal: 0, clueText: 'Peptit (protein) yapılı bir hormonum ve hedef hücre zarındaki reseptörlere bağlanırım.', pointsReward: 400 },
          { stage: 2, secondsToReveal: 4, clueText: 'Pankreasın Langerhans adacıklarındaki Beta (β) hücrelerinden salgılanırım.', pointsReward: 300 },
          { stage: 3, secondsToReveal: 8, clueText: 'Kandaki fazla glikozun çizgili kas ve karaciğerde glikojen olarak depolanmasını sağlarım.', pointsReward: 200 },
          { stage: 4, secondsToReveal: 12, clueText: 'Eksikliğimde veya reseptör direncinde Diyabet (Şeker Hastalığı) ortaya çıkar.', pointsReward: 100 }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 29. TARGET COMBINATION - Trigonometrik Özdeşlikler (AYT Matematik)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_tc_029',
      subject: 'matematik',
      topic: 'Trigonometrik Özdeşlikler',
      type: 'target_combination',
      difficulty: 'kolay',
      timeLimitSeconds: 15,
      points: 150,
      prompt: 'Her x gerçel sayısı için toplamları daima 1 olan İKİ trigonometrik ifadeyi seçin:',
      explanation: 'Temel Pisagor trigonometrik özdeşliğine göre sin²(x) + cos²(x) = 1 olur.',
      payload: {
        targetBadge: 'Hedef Toplam = 1',
        ruleHint: 'Toplamları özdeş olarak 1 veren 2 ifadeyi seçin',
        options: [
          { id: 't1', label: 'sin²(x)' },
          { id: 't2', label: 'tan²(x)' },
          { id: 't3', label: 'cos²(x)' },
          { id: 't4', label: 'sec²(x)' },
          { id: 't5', label: '2·sin(x)' }
        ],
        correctPairIds: ['t1', 't3']
      }
    },

    /* ----------------------------------------------------------------------
     * 30. CHAIN CONVERSION - Santral Dogma (AYT Biyoloji)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_cc_030',
      subject: 'biyoloji',
      topic: 'Santral Dogma (Genden Proteine)',
      type: 'chain_conversion',
      difficulty: 'orta',
      timeLimitSeconds: 20,
      points: 170,
      prompt: 'Hücrede genetik bilginin DNA\'dan proteine aktarılma zincirini (Santral Dogma) tamamlayın:',
      explanation: 'DNA\'daki şifre transkripsiyonla mRNA\'ya yazılır, mRNA ise ribozomda translasyonla polipeptit (protein) zincirine dönüştürülür.',
      payload: {
        startEntity: 'DNA (Genetik Şifre)',
        steps: [
          { stepNumber: 1, arrowLabel: 'Transkripsiyon (Yazılım)', correctValue: 'mRNA (Elçi RNA)' },
          { stepNumber: 2, arrowLabel: 'Translasyon (Ribozomda Okuma)', correctValue: 'Polipeptit (Protein)' }
        ],
        poolOptions: [
          'mRNA (Elçi RNA)',
          'Polipeptit (Protein)',
          'Glikojen',
          'Kolesterol',
          'Kitin'
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 31. MATRIX TOGGLE - Asitler ve Bazlar Karşılaştırması (TYT Kimya)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_mt_031',
      subject: 'kimya',
      topic: 'Asitler ve Bazlar Karşılaştırması',
      type: 'matrix_toggle',
      difficulty: 'kolay',
      timeLimitSeconds: 22,
      points: 180,
      prompt: 'Oda koşullarındaki (25 °C) sulu asit ve baz çözeltileri için tabloyu (✓ / ✗) olarak doldurun:',
      explanation: '25 °C sıcaklıkta asitlerin pH değeri 7\'den küçüktür (✓), bazların 7\'den büyüktür (✗). Her ikisinin sulu çözeltisi de iyon içerdiğinden elektrik akımını iletir (✓).',
      payload: {
        tablePrompt: 'Her hücreyi ✓ (Evet) veya ✗ (Hayır) olarak işaretleyin:',
        rows: [
          { id: 'r_asit', title: 'Asit Sulu Çözeltisi' },
          { id: 'r_baz', title: 'Baz Sulu Çözeltisi' }
        ],
        columns: [
          { id: 'c_ph7', title: 'pH Değeri 7\'den Küçüktür' },
          { id: 'c_iletken', title: 'Elektrik Akımını İletir' }
        ],
        answers: [
          { rowId: 'r_asit', colId: 'c_ph7', expectedBool: true },
          { rowId: 'r_asit', colId: 'c_iletken', expectedBool: true },
          { rowId: 'r_baz', colId: 'c_ph7', expectedBool: false },
          { rowId: 'r_baz', colId: 'c_iletken', expectedBool: true }
        ]
      }
    },

    /* ----------------------------------------------------------------------
     * 32. UNIVERSAL CHOICE - Elektromanyetik Spektrum Karşılaştırma (AYT Fizik)
     * ---------------------------------------------------------------------- */
    {
      id: 'q_uc_comp_032',
      subject: 'fizik',
      topic: 'Elektromanyetik Dalgalar ve Foton Enerjisi',
      type: 'universal_choice',
      difficulty: 'zor',
      timeLimitSeconds: 15,
      points: 120,
      prompt: 'Görünür ışık spektrumundaki iki fotonun enerjilerini karşılaştırarak doğru ilişkiyi seçin:',
      explanation: 'Mavi ışığın frekansı kırmızı ışıktan daha büyüktür (dalga boyu daha küçüktür). E = h·f bağıntısına göre mavi fotonun enerjisi > kırmızı fotonun enerjisidir.',
      payload: {
        variant: 'comparison',
        optionCount: 3,
        comparisonItems: {
          left: 'Mavi Işık Fotonunun Enerjisi',
          right: 'Kırmızı Işık Fotonunun Enerjisi'
        },
        options: ['<', '=', '>'],
        correctIndex: 2,
        shuffleOptions: false
      }
    }
  ]
};
