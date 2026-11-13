/**
 * ============================================================================
 * 🌐 İŞLER HACKATHON '26 - MERKEZİ BACKEND MOCK VERİ HAVUZU
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

export const BACKEND_GAME_DATA: BackendGameDataContract = {
  // Karşılaşmadaki 2 Oyuncunun Verisi
  players: {
    currentPlayer: {
      id: 'p1',
      name: 'Kerim Onur',
      elo: 1420,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kerim&backgroundColor=f14e13',
      streak: 3
    },
    opponentPlayer: {
      id: 'p2',
      name: 'Enes Ersoy',
      elo: 1435,
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Enes&backgroundColor=3b82f6',
      streak: 2
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
      timeLimitSeconds: 30,
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
      timeLimitSeconds: 25,
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
        targetBadge: 'Hedef Reş = 4 Ω',
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
      explanation: 'Golgi cisimciği üst üste dizilmiş yassı keseciklerden oluşur; protein ve lipitlerin paketlenmesinden ve salgılanmasından sorumludur.',
      payload: {
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Ökaryot hücre şeması ve organelleri',
        regions: [
          { id: 'reg_nucleus', label: 'Çekirdek', xPercent: 48, yPercent: 50, radiusPercent: 12 },
          { id: 'reg_golgi', label: 'Golgi Cisimciği', xPercent: 65, yPercent: 62, radiusPercent: 8 },
          { id: 'reg_mito', label: 'Mitokondri', xPercent: 28, yPercent: 38, radiusPercent: 8 }
        ],
        correctRegionId: 'reg_golgi'
      }
    }
  ]
};
