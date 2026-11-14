import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Droplets, Sparkles, FlaskConical } from 'lucide-react';
import soundEngine from '../../utils/soundEngine';

export interface ChemMoleculeGameProps {
  onComplete: () => void;
  onNextSubject?: () => void;
  nextSubjectName?: string;
}

/**
 * Web Audio API ile %100 telifsiz gerçekçi sıvı dökme (glug + su akışı) ve tepkime köpürme sesi üretir
 */
function playLiquidPourSfx(fillStep: 1 | 2, isReset: boolean = false) {
  if (soundEngine.getMuted() || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (isReset) {
      // Kabı boşaltma sesi (aşağı doğru süzülen sıvı sesi)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.28);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.29);
      setTimeout(() => ctx.close().catch(() => {}), 400);
      return;
    }

    // 1) Sıvı akışı (Bandpass filtreli beyaz gürültü - cam kaba dökülen su sesi)
    const duration = 0.62;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    // Kap doldukça rezonans frekansı yükselir (gerçek bardak/beherglas dolum fiziği)
    const startFreq = fillStep === 1 ? 550 : 780;
    const endFreq = fillStep === 1 ? 920 : 1350;
    filter.frequency.setValueAtTime(startFreq, now);
    filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    filter.Q.setValueAtTime(3.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.14, now + 0.08);
    noiseGain.gain.setValueAtTime(0.14, now + duration - 0.14);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);

    // 2) "Glug / Bloop" sıvı damlası ve kabarcık sesleri
    const bubbleOffsets = [0.06, 0.16, 0.27, 0.39, 0.5];
    bubbleOffsets.forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const bGain = ctx.createGain();
      const t = now + offset;
      const baseF = (fillStep === 1 ? 310 : 420) + idx * 48;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseF, t);
      osc.frequency.exponentialRampToValueAtTime(baseF * 1.85, t + 0.075);

      bGain.gain.setValueAtTime(0.09, t);
      bGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(bGain);
      bGain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.085);
    });

    setTimeout(() => ctx.close().catch(() => {}), 850);
  } catch {
    // Web Audio desteklenmiyorsa sessizce devam et
  }
}

interface BottleDef {
  id: string;
  formula: string;
  name: string;
  tag: string;
  color: string;
  isCorrectIngredient: boolean;
}

interface PairOutcome {
  pairKey: string; // sorted "id1+id2"
  productBadge: string;
  explanation: string;
  isDangerous: boolean;
}

interface NpcStory {
  characterName: string;
  roleTitle: string;
  idleAvatar: string;
  dangerAvatar: string;
  wrongAvatar: string;
  successAvatar: string;
  requestQuote: string;
  halfwayQuote: string;
  dangerReactionQuote: string;
  harmlessWrongQuote: string;
  successQuote: string;
}

interface FormulaStage {
  stageNumber: number;
  targetFormula: string;
  targetCommonName: string;
  reactionType: string;
  equationText: string;
  successNote: string;
  story: NpcStory;
  bottles: BottleDef[];
  wrongPairOutcomes: Record<string, PairOutcome>;
}

function makePairKey(idA: string, idB: string): string {
  return [idA, idB].sort().join('+');
}

const FORMULA_STAGES: FormulaStage[] = [
  {
    stageNumber: 1,
    targetFormula: 'NaClO',
    targetCommonName: 'Çamaşır Suyu',
    reactionType: 'Bazik Ortamda Klorlama',
    equationText: '2NaOH + Cl₂ → NaClO + NaCl + H₂O',
    successNote:
      '🎉 1. Sentez Tamam! Sud Kostik (NaOH) ve Klor Gazı (Cl₂) birleşerek Çamaşır Suyunu (NaClO) oluşturdu!',
    story: {
      characterName: 'Hijyen Şefi Leyla Abla',
      roleTitle: 'Revir & Hijyen Sorumlusu',
      idleAvatar: '🧑‍⚕️',
      dangerAvatar: '😷',
      wrongAvatar: '🤦‍♀️',
      successAvatar: '🤩',
      requestQuote:
        'Acil durum! Okul revirini dezenfekte etmem lazım ama Çamaşır Suyumuz (NaClO) bitti! Bana hemen Sud Kostik ile doğru çözeltiyi karıştırıp NaClO üretir misin?',
      halfwayQuote:
        'Güzel, ilk çözeltiyi beherglasa döktün! Şimdi ikinciyi dikkatli seç; sakın Tuz Ruhu veya Amonyak karıştırıp reviri zehirli gazla doldurma!',
      dangerReactionQuote:
        'ÖHÖ ÖHÖ! Ne yaptın?! Laboratuvarı zehirli gazla doldurdun, pencereleri açın! Hemen kabı boşalt!',
      harmlessWrongQuote:
        'İlahi! Bana mikrop kırıcı Çamaşır Suyu (NaClO) lazım, sen nötr Tuzlu Su (NaCl) yaptın! Bununla ancak gargara yapılır!',
      successQuote:
        'Harikasın genç kimyager! Tam kıvamında Çamaşır Suyu (NaClO) sentezledin, revir pırıl pırıl oldu!',
    },
    bottles: [
      {
        id: 'NaOH',
        formula: 'NaOH',
        name: 'Sud Kostik',
        tag: 'Sodyum Hidroksit',
        color: '#3B82F6',
        isCorrectIngredient: true,
      },
      {
        id: 'Cl2',
        formula: 'Cl₂',
        name: 'Klor Gazı',
        tag: 'Diklor Molekülü',
        color: '#06B6D4',
        isCorrectIngredient: true,
      },
      {
        id: 'HCl',
        formula: 'HCl',
        name: 'Tuz Ruhu',
        tag: 'Hidroklorik Asit',
        color: '#8B5CF6',
        isCorrectIngredient: false,
      },
      {
        id: 'NH3',
        formula: 'NH₃',
        name: 'Amonyak',
        tag: 'Azot Trihidrür',
        color: '#6366F1',
        isCorrectIngredient: false,
      },
    ],
    wrongPairOutcomes: {
      [makePairKey('Cl2', 'HCl')]: {
        pairKey: makePairKey('Cl2', 'HCl'),
        productBadge: '☠️ Zehirli Klor Gazı (Cl₂↑)',
        explanation:
          '☠️ TEHLİKE! Tuz Ruhu (HCl) ile Klor (Cl₂) / Çamaşır Suyu karıştırıldığında (NaClO + 2HCl → NaCl + H₂O + Cl₂↑) solunum yollarını yakan ölümcül Klor Gazı açığa çıkar!',
        isDangerous: true,
      },
      [makePairKey('Cl2', 'NH3')]: {
        pairKey: makePairKey('Cl2', 'NH3'),
        productBadge: '☠️ Kloramin Gazı (NH₂Cl↑)',
        explanation:
          '☠️ TEHLİKE! Klor Gazı (Cl₂) ile Amonyak (NH₃) birleştirildiğinde (NH₃ + Cl₂ → NH₂Cl + HCl) akciğerlere zarar veren zehirli Kloramin (NH₂Cl) buharı oluşur!',
        isDangerous: true,
      },
      [makePairKey('NaOH', 'HCl')]: {
        pairKey: makePairKey('NaOH', 'HCl'),
        productBadge: '⚠️ Tuzlu Su (NaCl + H₂O)',
        explanation:
          '⚠️ YANLIŞ BİLEŞİM! Sud Kostik (NaOH) ile Tuz Ruhu (HCl) birleştiğinde (NaOH + HCl → NaCl + H₂O) Çamaşır Suyu (NaClO) değil, nötr Sofra Tuzu (NaCl) ve Su oluşur!',
        isDangerous: false,
      },
      [makePairKey('NaOH', 'NH3')]: {
        pairKey: makePairKey('NaOH', 'NH3'),
        productBadge: '☠️ Keskin Amonyak Buharı (NH₃↑)',
        explanation:
          '☠️ TEHLİKE! Sud Kostik (NaOH) ile Amonyak (NH₃) iki bazdır; birleştiğinde keskin ve tahriş edici Amonyak gazı (NH₃↑) çıkışı olur ve Klor (Cl) olmadığı için NaClO oluşmaz!',
        isDangerous: true,
      },
      [makePairKey('HCl', 'NH3')]: {
        pairKey: makePairKey('HCl', 'NH3'),
        productBadge: '☠️ Nişadır Dumanı (NH₄Cl)',
        explanation:
          '☠️ TEHLİKE! Tuz Ruhu (HCl) ile Amonyak (NH₃) birleştiğinde (HCl + NH₃ → NH₄Cl) yoğun beyaz Amonyum Klorür (Nişadır) dumanı çıkar; Sodyum (Na) ve Oksijen (O) olmadığı için NaClO oluşmaz!',
        isDangerous: true,
      },
    },
  },
  {
    stageNumber: 2,
    targetFormula: 'NaCl',
    targetCommonName: 'Sofra Tuzu',
    reactionType: 'Asit - Baz Nötralleşmesi',
    equationText: 'HCl + NaOH → NaCl (Tuz) + H₂O (Su)',
    successNote:
      '🎉 2. Sentez Tamam! Tuz Ruhu (HCl) ve Sud Kostik (NaOH) nötralleşerek Sofra Tuzunu (NaCl) ve suyu oluşturdu!',
    story: {
      characterName: 'Baş Aşçı Kemal Usta',
      roleTitle: 'Yemekhane Mutfak Şefi',
      idleAvatar: '👨‍🍳',
      dangerAvatar: '😱',
      wrongAvatar: '😖',
      successAvatar: '🥳',
      requestQuote:
        'Öğle yemeğine 10 dakika kaldı! Kazanla çorba kaynıyor ama mutfakta Sofra Tuzu (NaCl) bitmiş! Bana asit-baz nötralleşmesiyle saf NaCl çözeltisi sentezle!',
      halfwayQuote:
        'İlk şişeyi döktün! Şimdi nötralleşmeyi tamamlayacak doğru karşı çözeltiyi dök; sakın iki kuvvetli asidi veya iki bazı birbiriyle karıştırma!',
      dangerReactionQuote:
        'Aman evladım ne yaptın?! Çorbaya koyacağız dedik, sen yakıcı asit/kostik bombası yaptın! Mutfak duman altı oldu!',
      harmlessWrongQuote:
        'Ögh, tadı zehir gibi acı! Bu Sofra Tuzu (NaCl) değil, deterjan/gübre sanayisi tuzu üretmişsin! Öğrenciler kazan kaldırır!',
      successQuote:
        'İşte gerçek lezzet! HCl ile NaOH tam nötralleşti ve saf Sofra Tuzu (NaCl) oluştu! Yemekhaneyi kurtardın!',
    },
    bottles: [
      {
        id: 'HCl',
        formula: 'HCl',
        name: 'Tuz Ruhu',
        tag: 'Hidroklorik Asit',
        color: '#3B82F6',
        isCorrectIngredient: true,
      },
      {
        id: 'NaOH',
        formula: 'NaOH',
        name: 'Sud Kostik',
        tag: 'Sodyum Hidroksit',
        color: '#06B6D4',
        isCorrectIngredient: true,
      },
      {
        id: 'H2SO4',
        formula: 'H₂SO₄',
        name: 'Zaç Yağı',
        tag: 'Sülfürik Asit',
        color: '#8B5CF6',
        isCorrectIngredient: false,
      },
      {
        id: 'KOH',
        formula: 'KOH',
        name: 'Potas Kostik',
        tag: 'Potasyum Hidroksit',
        color: '#6366F1',
        isCorrectIngredient: false,
      },
    ],
    wrongPairOutcomes: {
      [makePairKey('H2SO4', 'NaOH')]: {
        pairKey: makePairKey('H2SO4', 'NaOH'),
        productBadge: '⚠️ Sodyum Sülfat (Na₂SO₄)',
        explanation:
          '⚠️ YANLIŞ TUZ! Zaç Yağı (H₂SO₄) ile Sud Kostik (NaOH) birleştirildiğinde (H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O) Sofra Tuzu (NaCl) değil, deterjan sanayisinde kullanılan Sodyum Sülfat (Na₂SO₄) oluşur!',
        isDangerous: false,
      },
      [makePairKey('HCl', 'KOH')]: {
        pairKey: makePairKey('HCl', 'KOH'),
        productBadge: '⚠️ Potasyum Klorür (KCl)',
        explanation:
          '⚠️ YANLIŞ TUZ! Tuz Ruhu (HCl) ile Potas Kostik (KOH) birleştirildiğinde (HCl + KOH → KCl + H₂O) Sodyum Klorür (NaCl) yerine Potasyum Klorür (KCl) tuzu oluşur!',
        isDangerous: false,
      },
      [makePairKey('H2SO4', 'KOH')]: {
        pairKey: makePairKey('H2SO4', 'KOH'),
        productBadge: '⚠️ Potasyum Sülfat (K₂SO₄)',
        explanation:
          '⚠️ YANLIŞ TUZ! Zaç Yağı (H₂SO₄) ile Potas Kostik (KOH) birleştirildiğinde (H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O) ne Sodyum ne Klor içeren Potasyum Sülfat (K₂SO₄) gübre tuzu oluşur!',
        isDangerous: false,
      },
      [makePairKey('HCl', 'H2SO4')]: {
        pairKey: makePairKey('HCl', 'H2SO4'),
        productBadge: '☠️ Yakıcı Asit Buharı (HCl↑)',
        explanation:
          '☠️ TEHLİKE! Tuz Ruhu (HCl) ile Zaç Yağı (H₂SO₄) iki kuvvetli asittir; birleştirildiğinde nötralleşme olmaz, derişik H₂SO₄ suyu çekerek aşındırıcı HCl gazı çıkışına ve aşırı ısınmaya yol açar!',
        isDangerous: true,
      },
      [makePairKey('NaOH', 'KOH')]: {
        pairKey: makePairKey('NaOH', 'KOH'),
        productBadge: '☠️ Yakıcı Kostik Karışım',
        explanation:
          '☠️ TEHLİKE! Sud Kostik (NaOH) ile Potas Kostik (KOH) iki kuvvetli bazdır; asit olmadan birleştirildiğinde tuz oluşmaz, dokuları tahrip eden aşırı bazik (pH 14) kostik çözelti oluşur!',
        isDangerous: true,
      },
    },
  },
  {
    stageNumber: 3,
    targetFormula: 'NaHCO₃',
    targetCommonName: 'Yemek Sodası (Kabartma Tozu)',
    reactionType: 'Karbonatlama Tepkimesi',
    equationText: 'NaOH + CO₂ → NaHCO₃ (Sodyum Bikarbonat)',
    successNote:
      '🎉 3. Sentez Tamam! Sud Kostik (NaOH) ile Karbondioksit (CO₂) birleşerek Kabartma Tozunu (NaHCO₃) oluşturdu!',
    story: {
      characterName: 'Pastacı Zeynep',
      roleTitle: 'Kantin & Fırın Ustası',
      idleAvatar: '🧁',
      dangerAvatar: '🤢',
      wrongAvatar: '🪨',
      successAvatar: '🎉',
      requestQuote:
        'Hackathon kutlama kekleri fırına girecek ama Kabartma Tozumuz (Yemek Sodası - NaHCO₃) kalmamış! Keklerin sönmemesi için bana acil NaHCO₃ sentezler misin?',
      halfwayQuote:
        'Harika, ilk bileşen beherglasta! Şimdi karbonatlama tepkimesi için doğru ikinci çözeltiyi ekle!',
      dangerReactionQuote:
        'Ögh! Fırından kükürt ve asit yağmuru kokusu yükseliyor, bu karışım çok tehlikeli! Hemen beherglası boşalt!',
      harmlessWrongQuote:
        'Eyvah! Kabartma tozu yerine suda çözünmeyen Kireç Taşı / Mermer (CaCO₃) çökerttin! Kekleri yiyenlerin dişi kırılır!',
      successQuote:
        'Muhteşem! NaOH + CO₂ tepkimesiyle puf puf kabaran Yemek Sodası (NaHCO₃) ürettin! Kekler harika kabardı!',
    },
    bottles: [
      {
        id: 'NaOH',
        formula: 'NaOH',
        name: 'Sud Kostik',
        tag: 'Sodyum Hidroksit',
        color: '#3B82F6',
        isCorrectIngredient: true,
      },
      {
        id: 'CO2',
        formula: 'CO₂',
        name: 'Karbondioksit',
        tag: 'Karbon Dioksit',
        color: '#06B6D4',
        isCorrectIngredient: true,
      },
      {
        id: 'SO2',
        formula: 'SO₂',
        name: 'Kükürt Dioksit',
        tag: 'Kükürt Oksit Gazı',
        color: '#8B5CF6',
        isCorrectIngredient: false,
      },
      {
        id: 'CaO',
        formula: 'CaO',
        name: 'Sönmemiş Kireç',
        tag: 'Kalsiyum Oksit',
        color: '#6366F1',
        isCorrectIngredient: false,
      },
    ],
    wrongPairOutcomes: {
      [makePairKey('NaOH', 'SO2')]: {
        pairKey: makePairKey('NaOH', 'SO2'),
        productBadge: '☠️ Sodyum Bisülfit (NaHSO₃)',
        explanation:
          '☠️ TEHLİKE! Sud Kostik (NaOH) ile Kükürt Dioksit (SO₂) birleştirildiğinde (NaOH + SO₂ → NaHSO₃) Yemek Sodası (NaHCO₃) değil, tahriş edici Sodyum Bisülfit (NaHSO₃) kimyasalı oluşur!',
        isDangerous: true,
      },
      [makePairKey('CaO', 'CO2')]: {
        pairKey: makePairKey('CaO', 'CO2'),
        productBadge: '⚠️ Kireç Taşı (CaCO₃)',
        explanation:
          '⚠️ YANLIŞ BİLEŞİK! Sönmemiş Kireç (CaO) ile Karbondioksit (CO₂) birleştirildiğinde (CaO + CO₂ → CaCO₃) Yemek Sodası değil, suda çözünmeyen Kireç Taşı (Mermer - CaCO₃) katısı çöker!',
        isDangerous: false,
      },
      [makePairKey('CaO', 'SO2')]: {
        pairKey: makePairKey('CaO', 'SO2'),
        productBadge: '☠️ Kalsiyum Sülfit (CaSO₃)',
        explanation:
          '☠️ TEHLİKE! Sönmemiş Kireç (CaO) ile Kükürt Dioksit (SO₂) birleştirildiğinde (CaO + SO₂ → CaSO₃) endüstriyel baca atığı olan Kalsiyum Sülfit (CaSO₃) katısı oluşur!',
        isDangerous: true,
      },
      [makePairKey('NaOH', 'CaO')]: {
        pairKey: makePairKey('NaOH', 'CaO'),
        productBadge: '☠️ Yakıcı Kireçli Kostik',
        explanation:
          '☠️ TEHLİKE! Sud Kostik (NaOH) ile Sönmemiş Kireç (CaO) iki bazik maddedir; birleştirildiğinde Karbon (C) olmadığı için NaHCO₃ oluşmaz, aşındırıcı ve yakıcı bazik karışım meydana gelir!',
        isDangerous: true,
      },
      [makePairKey('CO2', 'SO2')]: {
        pairKey: makePairKey('CO2', 'SO2'),
        productBadge: '☠️ Asit Yağmuru Gazları',
        explanation:
          '☠️ TEHLİKE! Karbondioksit (CO₂) ile Kükürt Dioksit (SO₂) iki asidik oksit gazıdır; Sodyum (NaOH) olmadan birleştirildiğinde tuz oluşmaz, boğucu ve asit yağmuru yapan (H₂SO₃ + H₂CO₃) gaz karışımı oluşur!',
        isDangerous: true,
      },
    },
  },
];

export const ChemMoleculeGame: React.FC<ChemMoleculeGameProps> = ({
  onComplete,
  onNextSubject,
  nextSubjectName,
}) => {
  const [stageIdx, setStageIdx] = useState<number>(0);
  const [beakerItems, setBeakerItems] = useState<string[]>([]);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [pouringBottle, setPouringBottle] = useState<BottleDef | null>(null);
  const pourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (pourTimerRef.current) clearTimeout(pourTimerRef.current);
    };
  }, []);

  const currentStage = FORMULA_STAGES[stageIdx];
  const correctIds = currentStage.bottles
    .filter((b) => b.isCorrectIngredient)
    .map((b) => b.id);

  // Sadece 2 madde birleştirildiğinde tepkime sonucunu değerlendir
  const isTwoCombined = beakerItems.length === 2;
  const activePairKey = isTwoCombined ? makePairKey(beakerItems[0], beakerItems[1]) : null;
  const wrongOutcome = activePairKey ? currentStage.wrongPairOutcomes[activePairKey] || null : null;

  const isSuccess =
    isTwoCombined &&
    !wrongOutcome &&
    correctIds.every((id) => beakerItems.includes(id));

  const isWrongCombination = isTwoCombined && Boolean(wrongOutcome);

  const handleSelectStage = (idx: number) => {
    if (pourTimerRef.current) clearTimeout(pourTimerRef.current);
    setPouringBottle(null);
    setStageIdx(idx);
    setBeakerItems([]);
  };

  const handleToggleBottle = (bottle: BottleDef) => {
    if (isSuccess) return;

    let next: string[];
    const isRemoving = beakerItems.includes(bottle.id);

    if (isRemoving) {
      next = beakerItems.filter((i) => i !== bottle.id);
      setPouringBottle(null);
      playLiquidPourSfx(1, true);
    } else {
      if (beakerItems.length >= 2) {
        next = [beakerItems[1], bottle.id];
      } else {
        next = [...beakerItems, bottle.id];
      }

      // Dökme animasyonu ve sıvı dökülme ses efekti başlat
      if (pourTimerRef.current) clearTimeout(pourTimerRef.current);
      setPouringBottle(bottle);
      playLiquidPourSfx(next.length === 2 ? 2 : 1, false);
      pourTimerRef.current = setTimeout(() => {
        setPouringBottle(null);
      }, 720);
    }

    setBeakerItems(next);

    if (!isRemoving && next.length === 2) {
      const nextPairKey = makePairKey(next[0], next[1]);
      const nextWrong = currentStage.wrongPairOutcomes[nextPairKey];
      if (!nextWrong && correctIds.every((id) => next.includes(id))) {
        const updatedCompleted = completedStages.includes(stageIdx)
          ? completedStages
          : [...completedStages, stageIdx];
        setCompletedStages(updatedCompleted);
        setTimeout(() => soundEngine.playCorrect(), 380);
        onComplete();
      } else if (nextWrong) {
        setTimeout(() => soundEngine.playWrong(), 380);
      }
    }
  };

  const handleNextStage = () => {
    if (pourTimerRef.current) clearTimeout(pourTimerRef.current);
    setPouringBottle(null);
    if (stageIdx < FORMULA_STAGES.length - 1) {
      setStageIdx(stageIdx + 1);
      setBeakerItems([]);

      // Üste yumuşak kaydır
      const scrollParent = rootRef.current?.closest('.overflow-y-auto');
      if (scrollParent) {
        scrollParent.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleReset = () => {
    if (pourTimerRef.current) clearTimeout(pourTimerRef.current);
    setPouringBottle(null);
    if (beakerItems.length > 0) {
      playLiquidPourSfx(1, true);
    }
    setBeakerItems([]);
  };

  const addedBottles = beakerItems
    .map((id) => currentStage.bottles.find((b) => b.id === id))
    .filter((b): b is BottleDef => Boolean(b));

  const liquidHeightPercent = Math.min(82, beakerItems.length * 41);
  const liquidColor = isWrongCombination
    ? wrongOutcome?.isDangerous
      ? 'from-red-600/85 via-red-700/85 to-red-950/95 border-red-400'
      : 'from-amber-500/85 via-amber-700/85 to-amber-950/95 border-amber-300'
    : isSuccess
    ? 'from-emerald-400/85 via-teal-500/85 to-emerald-800/95 border-emerald-300'
    : beakerItems.length > 0
    ? 'from-cyan-400/75 via-blue-600/80 to-indigo-900/90 border-cyan-300'
    : 'from-white/5 to-white/10 border-white/10';

  return (
    <div ref={rootRef} className="flex flex-col gap-4">
      {/* ÜST SENTEZ SEÇİCİ (3 FARKLI HEDEF ÇÖZELTİ) */}
      <div className="grid grid-cols-3 gap-2.5">
        {FORMULA_STAGES.map((stg, idx) => {
          const isCurrent = idx === stageIdx;
          const isDone = completedStages.includes(idx);
          return (
            <button
              key={stg.targetFormula}
              onClick={() => handleSelectStage(idx)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                isCurrent
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/15'
                  : isDone
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  : 'bg-[#0F0510] border-white/10 text-[#B5CBC8] hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase opacity-80">
                  Sentez {stg.stageNumber}/3 • {stg.reactionType}
                </div>
                <div className="font-mono font-black text-sm sm:text-base text-white truncate mt-0.5">
                  {stg.targetCommonName}{' '}
                  <span className="font-poppins font-semibold text-xs text-cyan-300">
                    ({stg.targetFormula})
                  </span>
                </div>
              </div>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* HİKAYE KARAKTERİ SİPARİŞ & ANLIK TEPKİ BALONU */}
      <div
        className={`rounded-2xl border-2 p-3.5 flex items-center gap-3.5 transition-all duration-300 ${
          isWrongCombination
            ? wrongOutcome?.isDangerous
              ? 'bg-red-950/60 border-red-400 shadow-lg shadow-red-500/20'
              : 'bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-500/20'
            : isSuccess
            ? 'bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-500/20'
            : 'bg-[#170B19] border-cyan-500/40'
        }`}
      >
        {/* Karakter Avatarı (Duruma Göre Yüz İfadesi Değişir) */}
        <div
          className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl shrink-0 transition-transform duration-300 ${
            isWrongCombination
              ? 'border-red-400 bg-red-500/20 animate-bounce'
              : isSuccess
              ? 'border-emerald-400 bg-emerald-500/20 scale-105'
              : 'border-cyan-400/50 bg-cyan-500/15'
          }`}
        >
          {isWrongCombination
            ? wrongOutcome?.isDangerous
              ? currentStage.story.dangerAvatar
              : currentStage.story.wrongAvatar
            : isSuccess
            ? currentStage.story.successAvatar
            : currentStage.story.idleAvatar}
        </div>

        {/* Karakter Konuşma Balonu */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-poppins font-black text-xs sm:text-sm text-white">
              {currentStage.story.characterName}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-200">
              {currentStage.story.roleTitle}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ml-auto ${
                isWrongCombination
                  ? wrongOutcome?.isDangerous
                    ? 'bg-red-500/30 text-red-200 border border-red-400/50'
                    : 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                  : isSuccess
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                  : 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40'
              }`}
            >
              {isWrongCombination
                ? wrongOutcome?.isDangerous
                  ? '☠️ PANİK: Zehirli Tepkime!'
                  : '⚠️ ŞİKAYET: Yanlış Bileşik!'
                : isSuccess
                ? '🎉 SİPARİŞ TESLİM EDİLDİ!'
                : `🧪 İSTEK: ${currentStage.targetCommonName} (${currentStage.targetFormula})`}
            </span>
          </div>

          <p className="text-xs text-white/95 mt-1 leading-relaxed font-medium">
            &ldquo;
            {isWrongCombination
              ? wrongOutcome?.isDangerous
                ? currentStage.story.dangerReactionQuote
                : currentStage.story.harmlessWrongQuote
              : isSuccess
              ? currentStage.story.successQuote
              : beakerItems.length === 1
              ? currentStage.story.halfwayQuote
              : currentStage.story.requestQuote}
            &rdquo;
          </p>
        </div>
      </div>

      {/* ORTA MERKEZİ TEK BEHERGLAS & SIVI DÖKME SAHNESİ */}
      <div
        className={`relative rounded-3xl border-2 px-6 py-5 flex flex-col items-center justify-between min-h-[295px] overflow-hidden transition-all duration-500 ${
          isWrongCombination
            ? wrongOutcome?.isDangerous
              ? 'bg-gradient-to-b from-red-950/60 via-[#150A16] to-[#0F0510] border-red-500/60'
              : 'bg-gradient-to-b from-amber-950/60 via-[#150A16] to-[#0F0510] border-amber-500/60'
            : isSuccess
            ? 'bg-gradient-to-b from-emerald-950/60 via-[#150A16] to-[#0F0510] border-emerald-400/60'
            : 'bg-gradient-to-b from-[#1E1022] via-[#150A16] to-[#0F0510] border-cyan-500/35'
        }`}
      >
        {/* Hedef Başlığı */}
        <div className="text-xs font-mono text-cyan-300 text-center z-10">
          Hedef Çözelti Sentezi:{' '}
          <strong className="text-white">
            {currentStage.targetCommonName} ({currentStage.targetFormula})
          </strong>
        </div>

        {/* Tek Merkez Beherglas ve Canlı Dökülme Efekti */}
        <div className="relative flex flex-col items-center justify-end pt-10 pb-2 my-1">
          {/* Tepkime Sonuç Rozeti (Sentez veya Tehlike Uyarısı) */}
          {isWrongCombination && wrongOutcome && (
            <div
              className={`text-xs font-mono font-bold px-3.5 py-1 rounded-full animate-bounce mb-2 border shadow-lg z-20 ${
                wrongOutcome.isDangerous
                  ? 'text-red-100 bg-red-600/40 border-red-400'
                  : 'text-amber-100 bg-amber-600/40 border-amber-400'
              }`}
            >
              {wrongOutcome.productBadge}
            </div>
          )}
          {isSuccess && (
            <div className="text-xs font-mono font-bold text-emerald-100 bg-emerald-500/35 border border-emerald-400 px-3.5 py-1 rounded-full animate-bounce mb-2 shadow-lg z-20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>✓ {currentStage.targetCommonName} ({currentStage.targetFormula}) Çözeltisi Hazır!</span>
            </div>
          )}

          {/* DÖKÜLEN ŞİŞE & AKAN SIVI ANİMASYONU */}
          {pouringBottle && (
            <div className="absolute -top-1 left-1/2 -translate-x-2 z-30 pointer-events-none flex flex-col items-center">
              {/* Eğik Çözelti Şişesi */}
              <div
                className="flex items-center -rotate-[52deg] origin-bottom-left transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              >
                {/* Şişe Gövdesi */}
                <div
                  className="w-16 h-11 rounded-xl border-2 border-white/60 bg-slate-900/90 relative overflow-hidden flex items-center justify-center shadow-inner"
                  style={{ borderColor: pouringBottle.color }}
                >
                  <div
                    className="w-full h-full opacity-75"
                    style={{
                      background: `linear-gradient(135deg, ${pouringBottle.color}, ${pouringBottle.color}55)`,
                    }}
                  />
                  <span className="absolute font-mono font-black text-[10px] text-white drop-shadow">
                    {pouringBottle.name}
                  </span>
                </div>
                {/* Şişe Dar Boynu / Ağız Kısmı */}
                <div className="w-4 h-4 border-y-2 border-r-2 border-white/60 bg-white/15 rounded-r-sm -ml-0.5" />
              </div>

              {/* Beherglasın İçine Akan Sıvı Sütunu & Damlalar */}
              <div
                className="w-2.5 h-36 -mt-2 -ml-14 rounded-full animate-pulse"
                style={{
                  background: `linear-gradient(to bottom, ${pouringBottle.color}, ${pouringBottle.color}cc, transparent)`,
                  boxShadow: `0 0 14px ${pouringBottle.color}`,
                }}
              />
              <div
                className="w-3 h-3 rounded-full animate-ping -mt-12 -ml-14"
                style={{ backgroundColor: pouringBottle.color }}
              />
            </div>
          )}

          {/* ANA CAM BEHERGLAS (TEK MERKEZİ REAKSİYON KABI) */}
          <div className="relative flex items-center">
            {/* Beherglas Ağız Çıkıntısı (Cam Dudak) */}
            <div className="w-56 h-48 rounded-b-[32px] rounded-t-lg border-4 border-white/40 border-t-white/20 bg-slate-950/65 relative overflow-hidden flex flex-col justify-end shadow-[0_0_35px_rgba(6,182,212,0.15)] backdrop-blur-sm">
              {/* Cam Parlama Yansıması */}
              <div className="absolute right-3 top-3 bottom-5 w-2 rounded-full bg-gradient-to-b from-white/25 via-white/10 to-transparent pointer-events-none z-20" />

              {/* Mililitre Ölçek Çizgileri */}
              <div className="absolute left-3 top-3.5 flex flex-col gap-3.5 text-[9px] font-mono text-white/40 z-20 pointer-events-none select-none">
                <span>250ml ──</span>
                <span>200ml ──</span>
                <span>150ml ──</span>
                <span>100ml ──</span>
                <span>50ml  ──</span>
              </div>

              {/* Beherglas Boşken Gösterilen Rehber */}
              {beakerItems.length === 0 && !pouringBottle && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                  <Droplets className="w-7 h-7 text-cyan-400/40 mb-1.5 animate-pulse" />
                  <span className="text-xs font-poppins font-medium text-white/45">
                    Alttaki çözelti şişelerine tıklayarak beherglasa dök!
                  </span>
                </div>
              )}

              {/* Beherglas İçindeki Sıvı Katmanı */}
              <div
                className={`w-full bg-gradient-to-t border-t-2 transition-all duration-700 ease-out relative flex flex-col items-center justify-center px-3 ${liquidColor}`}
                style={{ height: `${liquidHeightPercent}%` }}
              >
                {/* Sıvı Yüzeyi Dalgalanma / Köpük Çizgisi */}
                {beakerItems.length > 0 && (
                  <div className="absolute -top-1.5 inset-x-0 h-2.5 bg-white/25 blur-[1px] animate-pulse" />
                )}

                {/* Sıvı İçi Yükselen Kabarcık Efektleri */}
                {beakerItems.length > 0 && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <span className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-white/45 animate-ping" />
                    <span
                      className="absolute bottom-4 left-1/2 w-2.5 h-2.5 rounded-full bg-white/40 animate-bounce"
                      style={{ animationDuration: '1.3s' }}
                    />
                    <span
                      className="absolute bottom-3 right-1/4 w-1.5 h-1.5 rounded-full bg-white/50 animate-ping"
                      style={{ animationDuration: '1.7s' }}
                    />
                    {(isTwoCombined || pouringBottle) && (
                      <>
                        <span
                          className="absolute bottom-6 left-1/3 w-3 h-3 rounded-full bg-white/50 animate-bounce"
                          style={{ animationDuration: '0.9s' }}
                        />
                        <span
                          className="absolute bottom-5 right-1/3 w-2.5 h-2.5 rounded-full bg-white/60 animate-ping"
                          style={{ animationDuration: '1.1s' }}
                        />
                      </>
                    )}
                  </div>
                )}

                {/* Beherglasın İçine Dökülmüş Çözeltiler (Tıklayıp Geri Çıkarma Etiketleri) */}
                {addedBottles.length > 0 && (
                  <div className="relative z-20 flex flex-col items-center gap-1.5 w-full">
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {addedBottles.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => handleToggleBottle(b)}
                          title="Bu çözeltiyi kaptan boşaltmak için tıkla"
                          className="px-2.5 py-1 rounded-full bg-black/45 hover:bg-black/65 border border-white/30 text-[11px] font-poppins font-semibold text-white flex items-center gap-1.5 shadow transition-all"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: b.color }}
                          />
                          <span>{b.name} Çözeltisi</span>
                          <span className="text-[10px] font-mono text-cyan-200/90">
                            ({b.formula})
                          </span>
                          {!isSuccess && (
                            <span className="text-[10px] text-amber-300 ml-0.5">✕</span>
                          )}
                        </button>
                      ))}
                    </div>

                    <span className="font-mono font-bold text-[11px] text-white/95 drop-shadow text-center">
                      {isSuccess
                        ? `✨ ${currentStage.targetCommonName} (${currentStage.targetFormula}) Çözeltisi Oluştu!`
                        : isWrongCombination && wrongOutcome
                        ? wrongOutcome.productBadge
                        : '100ml Çözelti Eklendi • 2. Çözeltiyi Dök'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bilimsel Geri Bildirim Bandı */}
        <div
          className={`mt-2 px-4 py-2.5 rounded-xl text-xs font-medium text-center border max-w-3xl leading-relaxed z-10 ${
            isWrongCombination
              ? wrongOutcome?.isDangerous
                ? 'bg-red-500/20 border-red-500/50 text-red-100'
                : 'bg-amber-500/20 border-amber-500/50 text-amber-100'
              : isSuccess
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100'
              : 'bg-white/5 border-white/10 text-[#B5CBC8]'
          }`}
        >
          {isWrongCombination && wrongOutcome
            ? wrongOutcome.explanation
            : isSuccess
            ? `${currentStage.successNote} (${currentStage.equationText})`
            : beakerItems.length === 1
            ? `Beherglasa "${addedBottles[0]?.name} (${addedBottles[0]?.formula})" çözeltisi döküldü. Tepkimeyi başlatmak için alttan 2. çözelti şişesini dök!`
            : `Alttaki laboratuvar çözeltilerinden "${currentStage.targetCommonName} (${currentStage.targetFormula})" sentezi için gereken 2 doğru çözeltiyi beherglasa dök!`}
        </div>
      </div>

      {/* ALT LABORATUVAR ÇÖZELTİ ŞİŞELERİ RAF BARI */}
      <div className="bg-[#0F0510] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-mono font-bold text-[#B5CBC8] flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Laboratuvar Çözeltileri (Beherglasa Dökmek İçin Şişeye Tıkla):</span>
          </span>

          <div className="flex items-center gap-2 shrink-0">
            {isSuccess && (
              <>
                {stageIdx < FORMULA_STAGES.length - 1 && (
                  <button
                    onClick={handleNextStage}
                    className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500"
                  >
                    <span>Sonraki Sentez ({stageIdx + 2}/3)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onNextSubject && (
                  <button
                    onClick={onNextSubject}
                    className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-md shadow-emerald-500/20"
                  >
                    <span>
                      {nextSubjectName === 'Çıkış'
                        ? 'Tüm Dersler Bitti - Çıkış'
                        : nextSubjectName
                        ? `Sonraki Ders (${nextSubjectName}) →`
                        : 'Sonraki Ders (Fizik) →'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Beherglası Boşalt</span>
            </button>
          </div>
        </div>

        {/* 4 Çözelti Şişesi Kartı */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currentStage.bottles.map((bottle) => {
            const isAdded = beakerItems.includes(bottle.id);
            const isPouringThis = pouringBottle?.id === bottle.id;
            return (
              <button
                key={bottle.id}
                onClick={() => handleToggleBottle(bottle)}
                disabled={isSuccess}
                className={`group relative p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  isAdded
                    ? 'bg-cyan-500/15 border-cyan-400/80 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-white/[0.04] border-white/15 text-[#B5CBC8] hover:text-white hover:border-cyan-400/50 hover:bg-white/[0.08] hover:-translate-y-0.5'
                }`}
              >
                {/* Görsel Cam Çözelti Şişesi (Beher / Erlenmayer) */}
                <div
                  className={`relative flex flex-col items-center shrink-0 transition-transform duration-300 ${
                    isPouringThis
                      ? '-rotate-45 -translate-y-2 scale-110'
                      : isAdded
                      ? '-rotate-12 opacity-85'
                      : 'group-hover:-rotate-12'
                  }`}
                >
                  {/* Şişe Ağzı & Tıpa */}
                  <div className="w-5 h-1.5 rounded-t bg-white/40 border border-white/50" />
                  <div className="w-3.5 h-2.5 bg-slate-900/80 border-x-2 border-white/40" />

                  {/* Şişe Cam Gövdesi & İçindeki Renkli Çözelti */}
                  <div className="w-11 h-14 rounded-b-xl rounded-t-md border-2 border-white/45 bg-slate-950/80 relative overflow-hidden flex flex-col justify-end shadow-inner">
                    {/* Cam Ölçek Çizgileri */}
                    <div className="absolute left-1 top-2 flex flex-col gap-1.5 text-[6px] font-mono text-white/35 z-10">
                      <span>—</span>
                      <span>—</span>
                      <span>—</span>
                    </div>

                    {/* Şişe İçindeki Sıvı (Döküldüğünde Seviyesi Azalır) */}
                    <div
                      className="w-full transition-all duration-500 relative"
                      style={{
                        height: isAdded ? '22%' : '76%',
                        background: `linear-gradient(to top, ${bottle.color}ee, ${bottle.color}88)`,
                        borderTop: `2px solid ${bottle.color}`,
                      }}
                    >
                      {/* Çözelti İçi Minik Kabarcıklar */}
                      {!isAdded && (
                        <>
                          <span className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                          <span className="absolute bottom-3.5 right-2 w-1 h-1 rounded-full bg-white/45" />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Çözelti Etiketi Bilgileri */}
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300/90 truncate">
                    {bottle.tag}
                  </div>
                  <div className="font-poppins font-bold text-sm text-white truncate mt-0.5">
                    {bottle.name}
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-1">
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-white/80 border border-white/10">
                      {bottle.formula} (aq)
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isAdded ? 'text-amber-300' : 'text-cyan-300 group-hover:underline'
                      }`}
                    >
                      {isAdded ? 'Geri Al ✕' : 'Dök 💧'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChemMoleculeGame;
