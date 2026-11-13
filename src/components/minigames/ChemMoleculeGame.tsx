import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, FlaskConical } from 'lucide-react';

export interface ChemMoleculeGameProps {
  onComplete: () => void;
  onNextSubject?: () => void;
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

interface FormulaStage {
  stageNumber: number;
  targetFormula: string;
  targetCommonName: string;
  reactionType: string;
  equationText: string;
  successNote: string;
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

export const ChemMoleculeGame: React.FC<ChemMoleculeGameProps> = ({ onComplete, onNextSubject }) => {
  const [stageIdx, setStageIdx] = useState<number>(0);
  const [beakerItems, setBeakerItems] = useState<string[]>([]);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

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
    setStageIdx(idx);
    setBeakerItems([]);
  };

  const handleToggleBottle = (bottle: BottleDef) => {
    if (isSuccess) return;

    let next: string[];
    if (beakerItems.includes(bottle.id)) {
      next = beakerItems.filter((i) => i !== bottle.id);
    } else {
      if (beakerItems.length >= 2) {
        next = [beakerItems[1], bottle.id];
      } else {
        next = [...beakerItems, bottle.id];
      }
    }
    setBeakerItems(next);

    if (
      next.length === 2 &&
      correctIds.every((id) => next.includes(id))
    ) {
      const updatedCompleted = completedStages.includes(stageIdx)
        ? completedStages
        : [...completedStages, stageIdx];
      setCompletedStages(updatedCompleted);
      onComplete();
    }
  };

  const handleNextStage = () => {
    if (stageIdx < FORMULA_STAGES.length - 1) {
      setStageIdx(stageIdx + 1);
      setBeakerItems([]);
    }
  };

  const handleReset = () => {
    setBeakerItems([]);
  };

  const liquidHeightPercent = Math.min(82, beakerItems.length * 40);
  const liquidColor = isWrongCombination
    ? wrongOutcome?.isDangerous
      ? 'from-red-600/80 to-red-900/90 border-red-400'
      : 'from-amber-600/80 to-amber-900/90 border-amber-400'
    : isSuccess
    ? 'from-emerald-400/80 to-teal-600/90 border-emerald-300'
    : beakerItems.length > 0
    ? 'from-blue-500/70 to-cyan-800/80 border-cyan-400'
    : 'from-white/5 to-white/10 border-white/10';

  return (
    <div className="flex flex-col gap-4">
      {/* ÜST FORMÜL SEÇİCİ (3 FARKLI FORMÜL VERSİYONU) */}
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
                  {stg.targetFormula}{' '}
                  <span className="font-poppins font-semibold text-xs text-cyan-300">
                    ({stg.targetCommonName})
                  </span>
                </div>
              </div>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* ORTA BÜYÜK GÖRSEL BEHERGLAS & REAKSİYON SAHNESİ */}
      <div
        className={`relative rounded-3xl border-2 p-6 flex flex-col items-center justify-center min-h-[265px] overflow-hidden transition-all duration-500 ${
          isWrongCombination
            ? wrongOutcome?.isDangerous
              ? 'bg-gradient-to-b from-red-950/60 via-[#150A16] to-[#0F0510] border-red-500/60'
              : 'bg-gradient-to-b from-amber-950/60 via-[#150A16] to-[#0F0510] border-amber-500/60'
            : isSuccess
            ? 'bg-gradient-to-b from-emerald-950/60 via-[#150A16] to-[#0F0510] border-emerald-400/60'
            : 'bg-gradient-to-b from-[#1E1022] via-[#150A16] to-[#0F0510] border-cyan-500/35'
        }`}
      >
        <div className="text-xs font-mono text-cyan-300 mb-3 text-center">
          Hedef Sentez:{' '}
          <strong className="text-white">
            {currentStage.targetCommonName} ({currentStage.targetFormula})
          </strong>
        </div>

        {/* Görsel Denklem Eşleşmesi: [ 1. Madde ] + [ 2. Madde ] ===> [ Beherglas ] */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full max-w-2xl my-1">
          {/* Sol: Eklenen Formül Kutuları (Emojisiz, Nötr Görünüm) */}
          <div className="flex items-center gap-3">
            {[0, 1].map((slotIdx) => {
              const bottleId = beakerItems[slotIdx];
              const bottle = currentStage.bottles.find((b) => b.id === bottleId);
              return (
                <React.Fragment key={slotIdx}>
                  {slotIdx === 1 && (
                    <span className="font-mono font-black text-2xl text-white/60">+</span>
                  )}
                  <div
                    onClick={() => bottle && handleToggleBottle(bottle)}
                    className={`w-32 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all px-2 text-center ${
                      bottle
                        ? 'cursor-pointer border-solid shadow-lg scale-105'
                        : 'border-dashed border-white/20 bg-black/30'
                    }`}
                    style={
                      bottle
                        ? {
                            backgroundColor: `${bottle.color}25`,
                            borderColor: bottle.color,
                          }
                        : undefined
                    }
                    title={bottle ? 'Çıkarmak için tıkla' : 'Alttan şişe seç'}
                  >
                    {bottle ? (
                      <>
                        <span className="font-mono font-black text-lg text-white">
                          {bottle.formula}
                        </span>
                        <span className="font-poppins font-semibold text-xs text-cyan-200 mt-0.5">
                          {bottle.name}
                        </span>
                        <span className="text-[10px] font-mono text-white/60 mt-1">
                          Kaptan Çıkar ✕
                        </span>
                      </>
                    ) : (
                      <>
                        <FlaskConical className="w-5 h-5 text-white/30" />
                        <span className="text-[10px] font-mono text-zinc-400 mt-1.5">
                          {slotIdx === 0 ? '1. Reaktif' : '2. Reaktif'}
                        </span>
                      </>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Ok İşareti */}
          <div className="font-mono text-2xl font-black text-[#F14E13] rotate-90 sm:rotate-0">
            ➔
          </div>

          {/* Sağ: Görsel Cam Beherglas */}
          <div className="relative flex flex-col items-center">
            {isWrongCombination && wrongOutcome && (
              <div
                className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full animate-bounce mb-2 border ${
                  wrongOutcome.isDangerous
                    ? 'text-red-200 bg-red-500/30 border-red-400'
                    : 'text-amber-200 bg-amber-500/30 border-amber-400'
                }`}
              >
                {wrongOutcome.productBadge}
              </div>
            )}
            {isSuccess && (
              <div className="text-xs font-mono font-bold text-emerald-200 bg-emerald-500/30 border border-emerald-400 px-3 py-0.5 rounded-full animate-bounce mb-2">
                ✓ {currentStage.targetFormula} Üretildi!
              </div>
            )}

            <div className="w-36 h-36 rounded-b-3xl rounded-t-lg border-4 border-white/35 border-t-white/15 bg-black/40 relative overflow-hidden flex flex-col justify-end shadow-2xl">
              <div className="absolute left-2 top-4 flex flex-col gap-4 text-[9px] font-mono text-white/35 z-10 pointer-events-none">
                <span>200ml —</span>
                <span>150ml —</span>
                <span>100ml —</span>
                <span>50ml —</span>
              </div>

              <div
                className={`w-full bg-gradient-to-t border-t-2 transition-all duration-500 flex flex-col items-center justify-center ${liquidColor}`}
                style={{ height: `${liquidHeightPercent}%` }}
              >
                {beakerItems.length > 0 && (
                  <span className="font-mono font-black text-xs text-white drop-shadow text-center px-1.5">
                    {isSuccess
                      ? `${currentStage.targetFormula} (${currentStage.targetCommonName})`
                      : isWrongCombination && wrongOutcome
                      ? wrongOutcome.productBadge
                      : `${
                          currentStage.bottles.find((b) => b.id === beakerItems[0])?.formula
                        } (2. maddeyi ekle)`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bilimsel Geri Bildirim Bandı: Tam Olarak Neyle Ne Birleşince Ne Oluştuğunu Yazar */}
        <div
          className={`mt-4 px-4 py-2.5 rounded-xl text-xs font-medium text-center border max-w-3xl leading-relaxed ${
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
            ? `Kaba "${
                currentStage.bottles.find((b) => b.id === beakerItems[0])?.name
              } (${
                currentStage.bottles.find((b) => b.id === beakerItems[0])?.formula
              })" eklendi. Tepkimeyi görmek için alttan 2. bileşeni seç!`
            : `Alttaki bileşenlerden "${currentStage.targetCommonName} (${currentStage.targetFormula})" sentezi için gereken 2 doğru maddeyi kaba ekle!`}
        </div>
      </div>

      {/* ALT KİMYASAL ŞİŞE SEÇİM BARI (Emojisiz, Kopya Vermeyen Eşit Tasarım) */}
      <div className="bg-[#0F0510] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="text-xs font-mono font-bold text-[#B5CBC8] mr-1">
            Bileşenler:
          </span>
          {currentStage.bottles.map((bottle) => {
            const isAdded = beakerItems.includes(bottle.id);
            return (
              <button
                key={bottle.id}
                onClick={() => handleToggleBottle(bottle)}
                disabled={isSuccess}
                className={`px-4 py-2 rounded-xl font-mono font-bold text-xs flex items-center gap-2.5 border transition-all ${
                  isAdded
                    ? 'scale-105 shadow-md text-white bg-cyan-500/25 border-white'
                    : 'bg-white/5 border-white/15 text-[#B5CBC8] hover:text-white hover:border-white/30'
                }`}
              >
                <div className="text-left">
                  <div className="text-white text-sm font-black">{bottle.formula}</div>
                  <div className="text-[11px] font-poppins font-medium opacity-85">
                    {bottle.name}
                  </div>
                </div>
                {isAdded && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                    ✕
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isSuccess && (
            <>
              {stageIdx < FORMULA_STAGES.length - 1 && (
                <button
                  onClick={handleNextStage}
                  className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500"
                >
                  <span>Sonraki Formül ({stageIdx + 2}/3)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onNextSubject && (
                <button
                  onClick={onNextSubject}
                  className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-md shadow-emerald-500/20"
                >
                  <span>Sonraki Derse Geç (Fizik)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kabı Boşalt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChemMoleculeGame;
