import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, RotateCw, ArrowRight } from 'lucide-react';

export interface MathProfitGameProps {
  onComplete: () => void;
  onNextSubject?: () => void;
}

type LeverId = 'x1' | 'x2' | 'x3' | 'x4' | 'x5';

interface LeverFormulaDef {
  id: LeverId;
  varName: string;
  leverNumber: number;
  title: string;
  funcType: string;
  formulaDisplay: string;
  color: string;
  optimalX: 1 | 2 | 3 | 4;
  initialX: 1 | 2 | 3 | 4;
  minY: number;
  maxY: number;
  evaluate: (x: number) => number;
  behaviorTip: string;
}

interface EquationStage {
  id: string;
  badge: string;
  name: string;
  funcSymbol: string;
  questionPrompt: string;
  fullEquationText: string;
  maxScore: number;
  minScore: number;
  levers: LeverFormulaDef[];
}

const EQUATION_STAGES: EquationStage[] = [
  // =========================================================================
  // DENKLEM 1: G₁(x) = 10x₁ + [30 - 4(x₂-3)²] + 2^(x₃) - 5(x₄-2)² + 24/x₅
  // =========================================================================
  {
    id: 'eq-1',
    badge: 'Denklem 1/3',
    name: 'Standart Üretim Fonksiyonu',
    funcSymbol: 'G₁(x)',
    questionPrompt:
      '5 kontrol kolunu (x₁–x₅) doğru kademelere (1–4) getirerek toplam kârı zirveye (110 Bin ₺) ulaştır.',
    fullEquationText: 'G₁(x) = 10x₁ + [30 - 4(x₂-3)²] + 2^(x₃) - 5(x₄-2)² + 24/x₅',
    maxScore: 110, // 40 + 30 + 16 + 0 + 24
    minScore: 12,  // 10 + 14 + 2 - 20 + 6
    levers: [
      {
        id: 'x1',
        varName: 'x₁',
        leverNumber: 1,
        title: 'Doğrusal Üretim',
        funcType: 'f₁(x₁) = 10·x₁',
        formulaDisplay: '+ 10x₁',
        color: '#3B82F6',
        optimalX: 4,
        initialX: 1,
        minY: 10,
        maxY: 40,
        evaluate: (x) => 10 * x,
        behaviorTip:
          'Pozitif eğimli doğrusal fonksiyon: Kolu sağa çevirdikçe grafikteki nokta sabit eğimle yukarı tırmanır (Maks: x₁=4 ➔ +40).',
      },
      {
        id: 'x2',
        varName: 'x₂',
        leverNumber: 2,
        title: 'Parabolik Verim',
        funcType: 'f₂(x₂) = 30 - 4(x₂-3)²',
        formulaDisplay: '+ 30 - 4(x₂-3)²',
        color: '#A855F7',
        optimalX: 3,
        initialX: 1,
        minY: 14,
        maxY: 30,
        evaluate: (x) => 30 - 4 * Math.pow(x - 3, 2),
        behaviorTip:
          'Tepe noktalı parabol: Nokta x₂=3 tepe noktasında zirveye (+30) ulaşır, x₂=4 yapılırsa simetrik olarak düşer.',
      },
      {
        id: 'x3',
        varName: 'x₃',
        leverNumber: 3,
        title: 'Üstel Teknoloji',
        funcType: 'f₃(x₃) = 2^(x₃)',
        formulaDisplay: '+ 2^(x₃)',
        color: '#F14E13',
        optimalX: 4,
        initialX: 2,
        minY: 2,
        maxY: 16,
        evaluate: (x) => Math.pow(2, x),
        behaviorTip:
          'Üstel büyüme fonksiyonu: Kolu sağa çevirdikçe grafikteki nokta katlanarak yükselir (Maks: x₃=4 ➔ +16).',
      },
      {
        id: 'x4',
        varName: 'x₄',
        leverNumber: 4,
        title: 'Isınma Kaybı',
        funcType: 'f₄(x₄) = -5(x₄-2)²',
        formulaDisplay: '- 5(x₄-2)²',
        color: '#EF4444',
        optimalX: 2,
        initialX: 4,
        minY: -20,
        maxY: 0,
        evaluate: (x) => -5 * Math.pow(x - 2, 2),
        behaviorTip:
          'Negatif tam kare fonksiyonu: Nokta x₄=2 değerinde 0 tepe noktasına (sıfır kayıp) çıkar; uzaklaştıkça hızla düşer.',
      },
      {
        id: 'x5',
        varName: 'x₅',
        leverNumber: 5,
        title: 'Ters Orantı',
        funcType: 'f₅(x₅) = 24 / x₅',
        formulaDisplay: '+ 24/x₅',
        color: '#10B981',
        optimalX: 1,
        initialX: 4,
        minY: 6,
        maxY: 24,
        evaluate: (x) => 24 / x,
        behaviorTip:
          'Ters orantı (hiperbolik) fonksiyon: x₅ paydada olduğu için kolu sola (x₅=1) çevirdikçe nokta en üste (+24) çıkar.',
      },
    ],
  },

  // =========================================================================
  // DENKLEM 2: G₂(x) = [40 - 6(x₁-2)²] + x₂³ - 8|x₃-3| + 36/x₄ + (25 - 5x₅)
  // =========================================================================
  {
    id: 'eq-2',
    badge: 'Denklem 2/3',
    name: 'Kübik & Mutlak Değer Fonksiyonu',
    funcSymbol: 'G₂(x)',
    questionPrompt:
      'Kolları ayarlayarak mutlak değer kaybını sıfırla, kübik gücü maksimize et ve 160 Bin ₺ hedefine ulaş.',
    fullEquationText: 'G₂(x) = [40 - 6(x₁-2)²] + x₂³ - 8|x₃-3| + 36/x₄ + (25 - 5x₅)',
    maxScore: 160, // 40 + 64 + 0 + 36 + 20
    minScore: 15,  // 16 + 1 - 16 + 9 + 5
    levers: [
      {
        id: 'x1',
        varName: 'x₁',
        leverNumber: 1,
        title: 'Karesel Rezonans',
        funcType: 'f₁(x₁) = 40 - 6(x₁-2)²',
        formulaDisplay: '+ 40 - 6(x₁-2)²',
        color: '#3B82F6',
        optimalX: 2,
        initialX: 4,
        minY: 16,
        maxY: 40,
        evaluate: (x) => 40 - 6 * Math.pow(x - 2, 2),
        behaviorTip:
          'Parabol tepe noktası (r=2, k=40): Kolu x₁=2 konumuna getirdiğinde parabol zirvesine (+40) ulaşır.',
      },
      {
        id: 'x2',
        varName: 'x₂',
        leverNumber: 2,
        title: 'Kübik Güç',
        funcType: 'f₂(x₂) = x₂³',
        formulaDisplay: '+ x₂³',
        color: '#A855F7',
        optimalX: 4,
        initialX: 1,
        minY: 1,
        maxY: 64,
        evaluate: (x) => Math.pow(x, 3),
        behaviorTip:
          'Kübik polinom fonksiyonu (x³): Kolu sağa çevirdikçe değer 1 ➔ 8 ➔ 27 ➔ 64 şeklinde çok dik yükselir (Maks: x₂=4).',
      },
      {
        id: 'x3',
        varName: 'x₃',
        leverNumber: 3,
        title: 'Mutlak Sapma',
        funcType: 'f₃(x₃) = -8·|x₃ - 3|',
        formulaDisplay: '- 8|x₃-3|',
        color: '#F14E13',
        optimalX: 3,
        initialX: 1,
        minY: -16,
        maxY: 0,
        evaluate: (x) => -8 * Math.abs(x - 3),
        behaviorTip:
          'Mutlak değer fonksiyonu: Ters V şeklindeki keskin grafiğin zirvesi |x₃-3|=0 olan x₃=3 noktasındadır (0 kayıp).',
      },
      {
        id: 'x4',
        varName: 'x₄',
        leverNumber: 4,
        title: 'Hiperbolik Akış',
        funcType: 'f₄(x₄) = 36 / x₄',
        formulaDisplay: '+ 36/x₄',
        color: '#EF4444',
        optimalX: 1,
        initialX: 3,
        minY: 9,
        maxY: 36,
        evaluate: (x) => 36 / x,
        behaviorTip:
          'Rasyonel hiperbolik fonksiyon: Payda küçüldükçe kesir büyür; x₄=1 seçildiğinde grafik en yüksek noktaya (+36) çıkar.',
      },
      {
        id: 'x5',
        varName: 'x₅',
        leverNumber: 5,
        title: 'Azalan Doğrusal',
        funcType: 'f₅(x₅) = 25 - 5x₅',
        formulaDisplay: '+ 25 - 5x₅',
        color: '#10B981',
        optimalX: 1,
        initialX: 4,
        minY: 5,
        maxY: 20,
        evaluate: (x) => 25 - 5 * x,
        behaviorTip:
          'Negatif eğimli (-5) doğrusal fonksiyon: x₅ arttıkça gelir düşer, bu yüzden en sol kademe (x₅=1 ➔ +20) maksimumdur.',
      },
    ],
  },

  // =========================================================================
  // DENKLEM 3: G₃(x) = 3^(x₁) + [45 - 5(x₂-3)²] + (16x₃ - 4x₃²) - 10|x₄-1| + (3x₅² - 6x₅ + 10)
  // =========================================================================
  {
    id: 'eq-3',
    badge: 'Denklem 3/3',
    name: 'Kuantum Polinom & Üstel Fonksiyonu',
    funcSymbol: 'G₃(x)',
    questionPrompt:
      'Parabol tepe noktalarını ve üstel artışı analiz ederek kârı maksimum seviyeye (176 Bin ₺) çıkar.',
    fullEquationText: 'G₃(x) = 3^(x₁) + [45 - 5(x₂-3)²] + (16x₃ - 4x₃²) - 10|x₄-1| + (3x₅² - 6x₅ + 10)',
    maxScore: 176, // 81 + 45 + 16 + 0 + 34
    minScore: 5,   // 3 + 25 + 0 - 30 + 7
    levers: [
      {
        id: 'x1',
        varName: 'x₁',
        leverNumber: 1,
        title: '3 Tabanlı Üstel',
        funcType: 'f₁(x₁) = 3^(x₁)',
        formulaDisplay: '+ 3^(x₁)',
        color: '#3B82F6',
        optimalX: 4,
        initialX: 1,
        minY: 3,
        maxY: 81,
        evaluate: (x) => Math.pow(3, x),
        behaviorTip:
          'Üstel fonksiyon (3^x): Her adımda 3 katına çıkar (3 ➔ 9 ➔ 27 ➔ 81). Maksimum için x₁=4 seçilmelidir.',
      },
      {
        id: 'x2',
        varName: 'x₂',
        leverNumber: 2,
        title: 'Simetrik Parabol',
        funcType: 'f₂(x₂) = 45 - 5(x₂-3)²',
        formulaDisplay: '+ 45 - 5(x₂-3)²',
        color: '#A855F7',
        optimalX: 3,
        initialX: 1,
        minY: 25,
        maxY: 45,
        evaluate: (x) => 45 - 5 * Math.pow(x - 3, 2),
        behaviorTip:
          'Tepe noktası x₂=3 olan aşağı kolları bakan parabol: x₂=3 noktasında +45 maksimum değerini üretir.',
      },
      {
        id: 'x3',
        varName: 'x₃',
        leverNumber: 3,
        title: 'Açık Parabol Polinomu',
        funcType: 'f₃(x₃) = 16x₃ - 4x₃²',
        formulaDisplay: '+ 16x₃ - 4x₃²',
        color: '#F14E13',
        optimalX: 2,
        initialX: 4,
        minY: 0,
        maxY: 16,
        evaluate: (x) => 16 * x - 4 * Math.pow(x, 2),
        behaviorTip:
          'İkinci dereceden polinom: Tepe noktası r = -b/(2a) = -16/(-8) = 2 olduğundan x₃=2 noktasında zirve (+16) yapar!',
      },
      {
        id: 'x4',
        varName: 'x₄',
        leverNumber: 4,
        title: 'Tolerans Cezası',
        funcType: 'f₄(x₄) = -10·|x₄ - 1|',
        formulaDisplay: '- 10|x₄-1|',
        color: '#EF4444',
        optimalX: 1,
        initialX: 3,
        minY: -30,
        maxY: 0,
        evaluate: (x) => -10 * Math.abs(x - 1),
        behaviorTip:
          'Mutlak değer kayıp fonksiyonu: x₄=1 noktasında kayıp sıfırlanır (0); sağa gittikçe -10, -20, -30 ceza yazar.',
      },
      {
        id: 'x5',
        varName: 'x₅',
        leverNumber: 5,
        title: 'Konveks Parabol',
        funcType: 'f₅(x₅) = 3x₅² - 6x₅ + 10',
        formulaDisplay: '+ 3x₅² - 6x₅ + 10',
        color: '#10B981',
        optimalX: 4,
        initialX: 1,
        minY: 7,
        maxY: 34,
        evaluate: (x) => 3 * Math.pow(x, 2) - 6 * x + 10,
        behaviorTip:
          'Kolları yukarı bakan parabol: x₅=1 dip noktasıdır (+7), kol sağa çevrildikçe eğri hızla yukarı kıvrılır (x₅=4 ➔ +34).',
      },
    ],
  },
];

const ANGLES_BY_X: Record<1 | 2 | 3 | 4, number> = {
  1: -60,
  2: -20,
  3: 20,
  4: 60,
};

const getInitialValuesForStage = (stage: EquationStage): Record<LeverId, 1 | 2 | 3 | 4> => ({
  x1: stage.levers[0].initialX,
  x2: stage.levers[1].initialX,
  x3: stage.levers[2].initialX,
  x4: stage.levers[3].initialX,
  x5: stage.levers[4].initialX,
});

export const MathProfitGame: React.FC<MathProfitGameProps> = ({ onComplete, onNextSubject }) => {
  const [stageIndex, setStageIndex] = useState<number>(0);
  const currentStage = EQUATION_STAGES[stageIndex];

  const [values, setValues] = useState<Record<LeverId, 1 | 2 | 3 | 4>>(() =>
    getInitialValuesForStage(EQUATION_STAGES[0])
  );
  const [activeHintId, setActiveHintId] = useState<LeverId>('x2');
  const [solvedStageIds, setSolvedStageIds] = useState<string[]>([]);

  const termValues = currentStage.levers.map((f) => ({
    ...f,
    currentX: values[f.id],
    currentVal: Math.round(f.evaluate(values[f.id])),
    maxVal: Math.round(f.evaluate(f.optimalX)),
    isOptimal: values[f.id] === f.optimalX,
  }));

  const totalRevenue = termValues.reduce((acc, item) => acc + item.currentVal, 0);
  const optimalCount = termValues.filter((t) => t.isOptimal).length;
  const isAllOptimal = optimalCount === currentStage.levers.length;

  const selectStage = (idx: number) => {
    const targetStage = EQUATION_STAGES[idx];
    setStageIndex(idx);
    setValues(getInitialValuesForStage(targetStage));
    setActiveHintId('x2');
  };

  const updateX = (id: LeverId, nextX: 1 | 2 | 3 | 4) => {
    setActiveHintId(id);
    const nextMap = { ...values, [id]: nextX };
    setValues(nextMap);

    const allOpt = currentStage.levers.every((f) => nextMap[f.id] === f.optimalX);
    if (allOpt) {
      if (!solvedStageIds.includes(currentStage.id)) {
        setSolvedStageIds((prev) => [...prev, currentStage.id]);
      }
      onComplete();
    }
  };

  const cycleLever = (id: LeverId) => {
    const cur = values[id];
    const next = ((cur % 4) + 1) as 1 | 2 | 3 | 4;
    updateX(id, next);
  };

  const stepLever = (id: LeverId, delta: -1 | 1) => {
    const cur = values[id];
    const next = Math.max(1, Math.min(4, cur + delta)) as 1 | 2 | 3 | 4;
    updateX(id, next);
  };

  const handleReset = () => {
    setValues(getInitialValuesForStage(currentStage));
  };

  const activeLeverObj = termValues.find((f) => f.id === activeHintId) || termValues[0];

  // =========================================================================
  // 1. SOL ANA GRAFİK: TOPLAM FABRİKA GELİR EĞRİSİ ÜZERİNDE HAREKET EDEN NOKTA
  // =========================================================================
  const normalizedProgress = Math.max(
    0,
    Math.min(
      1,
      (totalRevenue - currentStage.minScore) /
        Math.max(1, currentStage.maxScore - currentStage.minScore)
    )
  );
  const mainCurveX = 35 + normalizedProgress * 220;
  const mainCurveY = 28 + Math.pow(1 - normalizedProgress, 2) * 115;

  const mainCurvePathPts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const px = 35 + t * 220;
    const py = 28 + Math.pow(1 - t, 2) * 115;
    mainCurvePathPts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }

  // =========================================================================
  // 2. SAĞ SEÇİLİ KOL FONKSİYON GRAFİĞİ: f_i(x) EĞRİSİ VE HAREKET EDEN NOKTASI
  // =========================================================================
  const mapDetailX = (xVal: number) => 45 + ((xVal - 1) / 3) * 210;
  const mapDetailY = (yVal: number, f: LeverFormulaDef) => {
    const span = Math.max(1, f.maxY - f.minY);
    return 135 - ((yVal - f.minY) / span) * 100;
  };

  const detailCurvePts: string[] = [];
  for (let step = 0; step <= 30; step++) {
    const xVal = 1 + (step / 30) * 3;
    const yVal = activeLeverObj.evaluate(xVal);
    detailCurvePts.push(
      `${mapDetailX(xVal).toFixed(1)},${mapDetailY(yVal, activeLeverObj).toFixed(1)}`
    );
  }
  const activePtX = mapDetailX(activeLeverObj.currentX);
  const activePtY = mapDetailY(activeLeverObj.currentVal, activeLeverObj);
  const optimalPtX = mapDetailX(activeLeverObj.optimalX);
  const optimalPtY = mapDetailY(activeLeverObj.maxVal, activeLeverObj);

  return (
    <div className="flex flex-col gap-3">
      {/* ÜST SEKMELER: 3 FARKLI MATEMATİKSEL EŞİTLİK SEÇİCİ */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0F0510] border border-white/10 rounded-2xl p-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {EQUATION_STAGES.map((st, idx) => {
            const isCurrent = idx === stageIndex;
            const isSolved = solvedStageIds.includes(st.id);
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => selectStage(idx)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isCurrent
                    ? 'bg-[#F14E13] text-white border-orange-300 shadow-lg shadow-orange-500/20'
                    : isSolved
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-white/5 text-[#B5CBC8] border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{st.badge}:</span>
                <span>{st.funcSymbol}</span>
                {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-[#B5CBC8] px-2">
          <span className="text-amber-300 font-bold">{currentStage.name}</span> • Çözülen:{' '}
          <strong className="text-emerald-400">{solvedStageIds.length}/3</strong>
        </div>
      </div>

      {/* SADE VE NET SORU METNİ */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#1A0E1C] to-emerald-500/10 border border-amber-500/35 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center text-lg shrink-0">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                Görev
              </span>
              <span className="font-poppins font-bold text-xs sm:text-sm text-white">
                {currentStage.questionPrompt}
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#B5CBC8] mt-0.5">
              💡 İpucu: Kolların üstüne tıklayarak tepe noktalarını ve grafik eğrilerini inceleyebilirsin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <div className="text-right px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 font-mono">
            <span className="text-[10px] text-zinc-400 uppercase block">Hedef Zirve</span>
            <span className="font-black text-xs sm:text-sm text-emerald-400">
              {currentStage.maxScore} Bin ₺
            </span>
          </div>

          {isAllOptimal && onNextSubject && (
            <button
              onClick={onNextSubject}
              className="btn-primary !py-2 !px-3.5 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-md"
            >
              <span>Sonraki Ders (Geometri) →</span>
            </button>
          )}
        </div>
      </div>

      {/* CANLI DENKLEM BARI */}
      <div className="bg-[#0F0510] border border-orange-500/40 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs sm:text-sm">
          <span className="font-black text-amber-300 mr-1">{currentStage.funcSymbol} =</span>
          {termValues.map((tv) => (
            <button
              key={tv.id}
              type="button"
              onClick={() => setActiveHintId(tv.id)}
              className={`px-2 py-1 rounded-lg border transition-all ${
                activeHintId === tv.id
                  ? 'border-white bg-white/15 scale-105'
                  : tv.isOptimal
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-white/10 bg-black/40'
              }`}
              title={`${tv.leverNumber}. İbre (${tv.title}): ${tv.funcType}`}
            >
              <span className="font-bold" style={{ color: tv.color }}>
                {tv.formulaDisplay}
              </span>
              <span className="text-white font-black ml-1.5">
                ({tv.currentVal >= 0 ? `+${tv.currentVal}` : tv.currentVal})
              </span>
            </button>
          ))}
        </div>

        <div className="font-mono font-black text-sm sm:text-base text-emerald-400">
          Toplam: {totalRevenue} / {currentStage.maxScore} Bin ₺
        </div>
      </div>

      {/* ORTA ÜST: 2 CANLI GRAFİK PANELİ (SOL: TOPLAM GELİR NOKTASI, SAĞ: SEÇİLİ KOLUN FONKSİYON EĞRİSİ) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* SOL GRAFİK: Herhangi bir kol döndürüldüğünde hareket eden Toplam Fabrika Geliri Noktası + 5 Kol Noktası */}
        <div className="lg:col-span-6 bg-[#0F0510] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-[#B5CBC8] font-bold">
              📈 1. Toplam Gelir Grafiği {currentStage.funcSymbol}
            </span>
            <span className="text-amber-300 font-bold">
              Nokta: {totalRevenue}k ₺{' '}
              {isAllOptimal ? '🏆' : `➔ Hedef: ${currentStage.maxScore}k ₺`}
            </span>
          </div>

          <svg viewBox="0 0 300 165" className="w-full h-40 overflow-visible">
            {/* Eksenler */}
            <line x1="30" y1="145" x2="280" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="30" y1="15" x2="30" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* Zirve Kesikli Kılavuz */}
            <line
              x1="255"
              y1="28"
              x2="255"
              y2="145"
              stroke="rgba(16,185,129,0.4)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <line
              x1="30"
              y1="28"
              x2="255"
              y2="28"
              stroke="rgba(16,185,129,0.4)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Toplam Gelir Tırmanış Eğrisi */}
            <polyline
              fill="none"
              stroke={isAllOptimal ? '#10B981' : '#F14E13'}
              strokeWidth="3.5"
              strokeLinecap="round"
              points={mainCurvePathPts.join(' ')}
            />

            {/* Zirve Hedef Noktası */}
            <circle
              cx="255"
              cy="28"
              r="8"
              fill="rgba(16,185,129,0.2)"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="2 2"
            />
            <text
              x="245"
              y="16"
              textAnchor="end"
              fill="#6EE7B7"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              🏆 Zirve ({currentStage.maxScore}k)
            </text>

            {/* 5 Kolun Ayrı Katkı Noktaları */}
            {termValues.map((tv, idx) => {
              const slotX = 55 + idx * 42;
              const ratio = (tv.currentVal - tv.minY) / Math.max(1, tv.maxY - tv.minY);
              const dotY = 135 - ratio * 85;
              return (
                <g key={tv.id}>
                  <line
                    x1={slotX}
                    y1="145"
                    x2={slotX}
                    y2={dotY}
                    stroke={tv.color}
                    strokeWidth="2"
                    strokeOpacity="0.45"
                  />
                  <circle
                    cx={slotX}
                    cy={dotY}
                    r="4.5"
                    fill={tv.color}
                    stroke="#fff"
                    strokeWidth="1.2"
                    className="transition-all duration-300"
                  />
                  <text
                    x={slotX}
                    y="158"
                    textAnchor="middle"
                    fill={tv.color}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {tv.varName}
                  </text>
                </g>
              );
            })}

            {/* ANA TOPLAM GELİR HAREKETLİ NOKTASI */}
            <g
              className="transition-all duration-300 ease-out"
              style={{ transform: `translate(${mainCurveX}px, ${mainCurveY}px)` }}
            >
              <circle r="12" fill="rgba(251,191,36,0.25)" className="animate-ping" />
              <circle
                r="7.5"
                fill={isAllOptimal ? '#10B981' : '#FBBF24'}
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text
                x="0"
                y="-12"
                textAnchor="middle"
                fill="#FDE68A"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {totalRevenue}k ₺
              </text>
            </g>
          </svg>
        </div>

        {/* SAĞ GRAFİK: O An Oynanan Kolun (x_i) Kendi Fonksiyon Eğrisi ve Üzerinde Kayan Nokta */}
        <div className="lg:col-span-6 bg-[#0F0510] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="font-bold text-white">
              🎯 2. {activeLeverObj.leverNumber}. İbre ({activeLeverObj.title}):{' '}
              <span style={{ color: activeLeverObj.color }}>{activeLeverObj.funcType}</span>
            </span>
            <span className="text-emerald-300 font-bold">
              ({activeLeverObj.varName}={activeLeverObj.currentX}, y={activeLeverObj.currentVal})
            </span>
          </div>

          <svg viewBox="0 0 300 165" className="w-full h-40 overflow-visible">
            {/* Eksenler */}
            <line x1="35" y1="145" x2="275" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="35" y1="15" x2="35" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* x = 1, 2, 3, 4 Dikey Kılavuz Çizgileri */}
            {([1, 2, 3, 4] as const).map((xVal) => {
              const gx = mapDetailX(xVal);
              const gy = mapDetailY(activeLeverObj.evaluate(xVal), activeLeverObj);
              return (
                <g key={xVal}>
                  <line
                    x1={gx}
                    y1="25"
                    x2={gx}
                    y2="145"
                    stroke="rgba(255,255,255,0.07)"
                    strokeDasharray="3 3"
                  />
                  <circle cx={gx} cy={gy} r="3.5" fill="rgba(255,255,255,0.35)" />
                  <text
                    x={gx}
                    y="158"
                    textAnchor="middle"
                    fill={xVal === activeLeverObj.currentX ? '#FBBF24' : '#94A3B8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {activeLeverObj.varName}={xVal}
                  </text>
                </g>
              );
            })}

            {/* Seçili Kolun Fonksiyon Eğrisi */}
            <polyline
              fill="none"
              stroke={activeLeverObj.color}
              strokeWidth="3.5"
              strokeLinecap="round"
              points={detailCurvePts.join(' ')}
            />

            {/* Optimum Hedef Halkası */}
            <circle
              cx={optimalPtX}
              cy={optimalPtY}
              r="8"
              fill="rgba(16,185,129,0.2)"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="2 2"
            />

            {/* Kolu Döndürdükçe Eğri Üzerinde Hareket Eden Nokta */}
            <g
              className="transition-all duration-300 ease-out"
              style={{ transform: `translate(${activePtX}px, ${activePtY}px)` }}
            >
              <circle
                r="7.5"
                fill={activeLeverObj.isOptimal ? '#10B981' : activeLeverObj.color}
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text
                x="0"
                y="-11"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {activeLeverObj.currentVal >= 0
                  ? `+${activeLeverObj.currentVal}`
                  : activeLeverObj.currentVal}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* ALT: 5 DÖNDÜRÜLEBİLİR KOL VE HER KOLUN KENDİ CANLI MİNİ GRAFİĞİ */}
      <div
        className={`rounded-3xl border-2 p-4 flex flex-col justify-between transition-all ${
          isAllOptimal
            ? 'bg-gradient-to-b from-emerald-950/50 via-[#150A16] to-[#0F0510] border-emerald-400/60'
            : 'bg-gradient-to-b from-[#1E1022] via-[#150A16] to-[#0F0510] border-orange-500/35'
        }`}
      >
        {/* 5 İbrenin Genel Açıklama Başlığı */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
            <h4 className="font-poppins font-bold text-xs sm:text-sm text-white">
              5 Fabrika Kontrol İbresi (Parametre Fonksiyonları)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-[#B5CBC8]">
            Her ibre bir fonksiyonu temsil eder • İbreyi çevirmek için tıkla
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {termValues.map((tv) => {
            const angleDeg = ANGLES_BY_X[tv.currentX];

            const mapMiniX = (xVal: number) => 14 + ((xVal - 1) / 3) * 72;
            const mapMiniY = (yVal: number) => {
              const span = Math.max(1, tv.maxY - tv.minY);
              return 34 - ((yVal - tv.minY) / span) * 26;
            };
            const miniPts = [1, 2, 3, 4]
              .map(
                (xVal) => `${mapMiniX(xVal).toFixed(1)},${mapMiniY(tv.evaluate(xVal)).toFixed(1)}`
              )
              .join(' ');
            const curMiniX = mapMiniX(tv.currentX);
            const curMiniY = mapMiniY(tv.currentVal);

            return (
              <div
                key={tv.id}
                onClick={() => setActiveHintId(tv.id)}
                className={`rounded-2xl border-2 p-2.5 flex flex-col items-center justify-between gap-2 cursor-pointer transition-all ${
                  tv.isOptimal
                    ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                    : activeHintId === tv.id
                    ? 'border-[#F14E13] bg-[#0F0510]'
                    : 'border-white/15 bg-[#0F0510]/90 hover:border-white/30'
                }`}
              >
                {/* İbrenin Neyi İfade Ettiğini Açıklayan Başlık */}
                <div className="w-full text-center pb-1.5 border-b border-white/10">
                  <span className="text-[9px] font-mono font-bold uppercase text-[#B5CBC8] block tracking-wider">
                    {tv.leverNumber}. İbre
                  </span>
                  <div className="font-poppins font-black text-xs text-white truncate mt-0.5" title={tv.title}>
                    {tv.title}
                  </div>
                  <div className="text-[10px] font-mono font-semibold truncate mt-0.5" style={{ color: tv.color }}>
                    {tv.funcType}
                  </div>
                </div>

                {/* Değişken Durumu ve Katkı Değeri */}
                <div className="text-center w-full">
                  <div className="flex items-center justify-between text-[10px] font-mono px-0.5">
                    <span className="font-bold text-white bg-white/10 px-1.5 py-0.2 rounded">
                      {tv.varName} = {tv.currentX}
                    </span>
                    {tv.isOptimal ? (
                      <span className="text-emerald-300 font-bold">✓ ZİRVE</span>
                    ) : (
                      <span className="text-amber-300 font-bold">
                        {tv.currentVal >= 0 ? `+${tv.currentVal}` : tv.currentVal}
                      </span>
                    )}
                  </div>
                  <div
                    className="font-mono font-black text-xs mt-0.5 truncate"
                    style={{ color: tv.color }}
                  >
                    {tv.formulaDisplay}
                  </div>
                </div>

                {/* DÖNDÜRÜLEBİLİR FABRİKA KOLU */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    cycleLever(tv.id);
                  }}
                  className="relative w-24 h-16 flex flex-col items-center justify-end cursor-pointer select-none group"
                  title="Kolu döndürmek için tıkla"
                >
                  <div className="w-20 h-10 rounded-t-full border-2 border-b-0 border-white/20 bg-black/50 relative overflow-visible">
                    {([1, 2, 3, 4] as const).map((xVal) => {
                      const deg = ANGLES_BY_X[xVal];
                      const isDotActive = xVal === tv.currentX;
                      return (
                        <span
                          key={xVal}
                          className={`absolute left-1/2 bottom-0 w-3.5 h-3.5 -ml-1.5 rounded-full text-[8px] font-mono font-bold flex items-center justify-center transition-all ${
                            isDotActive
                              ? 'bg-amber-400 text-black scale-110'
                              : 'bg-white/10 text-white/60'
                          }`}
                          style={{
                            transform: `rotate(${deg}deg) translateY(-34px) rotate(${-deg}deg)`,
                            transformOrigin: '50% 100%',
                          }}
                        >
                          {xVal}
                        </span>
                      );
                    })}
                  </div>

                  <div
                    className="absolute bottom-1.5 left-1/2 w-1.5 h-11 -ml-0.5 origin-bottom transition-transform duration-300 ease-out"
                    style={{ transform: `rotate(${angleDeg}deg)` }}
                  >
                    <div className="w-1.5 h-8 mx-auto rounded-full bg-gradient-to-t from-zinc-400 to-white shadow" />
                    <div
                      className="w-5 h-5 -ml-1.5 -mt-1.5 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center text-[9px] font-mono font-black text-white"
                      style={{
                        backgroundColor: tv.isOptimal ? '#10B981' : tv.color,
                      }}
                    >
                      {tv.currentX}
                    </div>
                  </div>

                  <div className="w-7 h-3 rounded-t-full bg-zinc-700 border-2 border-white/40 z-10" />
                </div>

                {/* Sol / Sağ Döndürme Butonları */}
                <div className="flex items-center justify-center gap-1 w-full">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      stepLever(tv.id, -1);
                    }}
                    disabled={tv.currentX <= 1}
                    className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono text-white disabled:opacity-30 flex items-center justify-center gap-0.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Sol</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      stepLever(tv.id, 1);
                    }}
                    disabled={tv.currentX >= 4}
                    className="flex-1 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono text-white disabled:opacity-30 flex items-center justify-center gap-0.5"
                  >
                    <span>Sağ</span>
                    <RotateCw className="w-3 h-3" />
                  </button>
                </div>

                {/* HER KOLUN ALTINDA CANLI NOKTASI HAREKET EDEN MİNİ GRAFİK */}
                <div className="w-full bg-black/55 rounded-xl p-1.5 border border-white/5">
                  <svg viewBox="0 0 100 42" className="w-full h-10 overflow-visible">
                    <line
                      x1="10"
                      y1="36"
                      x2="90"
                      y2="36"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                    <polyline
                      fill="none"
                      stroke={tv.color}
                      strokeWidth="2"
                      points={miniPts}
                    />
                    <circle
                      cx={curMiniX}
                      cy={curMiniY}
                      r="4.5"
                      fill={tv.isOptimal ? '#10B981' : '#FBBF24'}
                      stroke="#fff"
                      strokeWidth="1.5"
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Seçili Kolun Fonksiyon Etkisi Açıklaması + Sonraki Denklem / Sıfırla */}
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/10">
          <div className="text-xs text-[#B5CBC8]">
            {isAllOptimal ? (
              <span className="text-emerald-300 font-bold">
                🎉 TEBRİKLER! {currentStage.funcSymbol} denkleminin 5 kolu da tepe noktasına ulaştı
                (Maksimum: {currentStage.maxScore} Bin ₺)!
              </span>
            ) : (
              <span>
                🔍 <strong className="text-white">{activeLeverObj.leverNumber}. İbre ({activeLeverObj.title} - {activeLeverObj.varName}):</strong>{' '}
                {activeLeverObj.behaviorTip}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAllOptimal && stageIndex < EQUATION_STAGES.length - 1 && (
              <button
                type="button"
                onClick={() => selectStage(stageIndex + 1)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span>Sonraki Denklem ({EQUATION_STAGES[stageIndex + 1].funcSymbol})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {isAllOptimal && (stageIndex === EQUATION_STAGES.length - 1 || solvedStageIds.length >= 1) && onNextSubject && (
              <button
                type="button"
                onClick={onNextSubject}
                className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg shadow-emerald-500/20"
              >
                <span>Sonraki Derse Geç (Geometri)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathProfitGame;
