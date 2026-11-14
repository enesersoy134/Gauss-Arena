import React, { useState, useRef } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import soundEngine from '../../utils/soundEngine';

export interface MathProfitGameProps {
  onComplete: () => void;
  onNextSubject?: () => void;
  nextSubjectName?: string;
}

type LeverId = 'x1' | 'x2' | 'x3' | 'x4' | 'x5';

interface LeverFormulaDef {
  id: LeverId;
  varName: string;
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
  maxScore: number;
  levers: LeverFormulaDef[];
}

const EQUATION_STAGES: EquationStage[] = [
  {
    id: 'eq-1',
    badge: '1. Denklem',
    name: 'Doğrusal & Parabolik Üretim',
    funcSymbol: 'G₁(x)',
    maxScore: 110,
    levers: [
      {
        id: 'x1',
        varName: 'x₁',
        title: 'Üretim Sayısı (Doğrusal)',
        funcType: 'f₁(x₁) = 10x₁',
        formulaDisplay: '+ 10x₁',
        color: '#3B82F6',
        optimalX: 4,
        initialX: 1,
        minY: 10,
        maxY: 40,
        evaluate: (x) => 10 * x,
        behaviorTip: 'Pozitif eğimli doğru: x₁ büyüdükçe değer doğrusal artar (x₁ = 4 ➔ +40).',
      },
      {
        id: 'x2',
        varName: 'x₂',
        title: 'Vardiya Verimliliği (Parabol)',
        funcType: 'f₂(x₂) = 30 - 4(x₂ - 3)²',
        formulaDisplay: '+ 30 - 4(x₂-3)²',
        color: '#A855F7',
        optimalX: 3,
        initialX: 1,
        minY: 14,
        maxY: 30,
        evaluate: (x) => 30 - 4 * Math.pow(x - 3, 2),
        behaviorTip: 'Kolları aşağı bakan parabol: Tepe noktası r = 3 olduğunda zirveye (+30) ulaşır.',
      },
      {
        id: 'x3',
        varName: 'x₃',
        title: 'Otomasyon Düzeyi (Üstel)',
        funcType: 'f₃(x₃) = 2^(x₃)',
        formulaDisplay: '+ 2^(x₃)',
        color: '#F14E13',
        optimalX: 4,
        initialX: 2,
        minY: 2,
        maxY: 16,
        evaluate: (x) => Math.pow(2, x),
        behaviorTip: 'Üstel fonksiyon: x₃ arttıkça değer katlanarak büyür (x₃ = 4 ➔ +16).',
      },
      {
        id: 'x4',
        varName: 'x₄',
        title: 'Bakım Gideri (Tam Kare)',
        funcType: 'f₄(x₄) = -5(x₄ - 2)²',
        formulaDisplay: '- 5(x₄-2)²',
        color: '#EF4444',
        optimalX: 2,
        initialX: 4,
        minY: -20,
        maxY: 0,
        evaluate: (x) => -5 * Math.pow(x - 2, 2),
        behaviorTip: 'Tam kare kayıp terimi: Kaybı sıfırlamak (0) için parantez içi sıfır yapılmalı (x₄ = 2).',
      },
      {
        id: 'x5',
        varName: 'x₅',
        title: 'Hammadde Fire Oranı (Ters Orantı)',
        funcType: 'f₅(x₅) = 24 / x₅',
        formulaDisplay: '+ 24/x₅',
        color: '#10B981',
        optimalX: 1,
        initialX: 4,
        minY: 6,
        maxY: 24,
        evaluate: (x) => 24 / x,
        behaviorTip: 'Rasyonel ifade: Payda ne kadar küçükse sonuç o kadar büyüktür (x₅ = 1 ➔ +24).',
      },
    ],
  },
  {
    id: 'eq-2',
    badge: '2. Denklem',
    name: 'Kübik & Mutlak Değer',
    funcSymbol: 'G₂(x)',
    maxScore: 160,
    levers: [
      {
        id: 'x1',
        varName: 'x₁',
        title: 'Bant Hızı Verimi (Parabol)',
        funcType: 'f₁(x₁) = 40 - 6(x₁ - 2)²',
        formulaDisplay: '+ 40 - 6(x₁-2)²',
        color: '#3B82F6',
        optimalX: 2,
        initialX: 4,
        minY: 16,
        maxY: 40,
        evaluate: (x) => 40 - 6 * Math.pow(x - 2, 2),
        behaviorTip: 'Tepe noktası T(2, 40) olan parabol: x₁ = 2 seçildiğinde +40 maksimum değerini alır.',
      },
      {
        id: 'x2',
        varName: 'x₂',
        title: 'Satış & Dağıtım Hacmi (Kübik)',
        funcType: 'f₂(x₂) = x₂³',
        formulaDisplay: '+ x₂³',
        color: '#A855F7',
        optimalX: 4,
        initialX: 1,
        minY: 1,
        maxY: 64,
        evaluate: (x) => Math.pow(x, 3),
        behaviorTip: 'Kübik fonksiyon (x³): Artan fonksiyon olduğu için en büyük kademede zirve yapar (4³ = +64).',
      },
      {
        id: 'x3',
        varName: 'x₃',
        title: 'Kalite Sapması (Mutlak Değer)',
        funcType: 'f₃(x₃) = -8|x₃ - 3|',
        formulaDisplay: '- 8|x₃-3|',
        color: '#F14E13',
        optimalX: 3,
        initialX: 1,
        minY: -16,
        maxY: 0,
        evaluate: (x) => -8 * Math.abs(x - 3),
        behaviorTip: 'Negatif mutlak değer: En büyük değerini mutlak değerin içi 0 olduğunda alır (x₃ = 3 ➔ 0).',
      },
      {
        id: 'x4',
        varName: 'x₄',
        title: 'Tedarik Teslimat Süresi (Hiperbolik)',
        funcType: 'f₄(x₄) = 36 / x₄',
        formulaDisplay: '+ 36/x₄',
        color: '#EF4444',
        optimalX: 1,
        initialX: 3,
        minY: 9,
        maxY: 36,
        evaluate: (x) => 36 / x,
        behaviorTip: 'Ters orantı: Paydadaki x₄ = 1 seçildiğinde kesir maksimum değerine (+36) ulaşır.',
      },
      {
        id: 'x5',
        varName: 'x₅',
        title: 'Enerji Tasarrufu (Doğrusal)',
        funcType: 'f₅(x₅) = 25 - 5x₅',
        formulaDisplay: '+ 25 - 5x₅',
        color: '#10B981',
        optimalX: 1,
        initialX: 4,
        minY: 5,
        maxY: 20,
        evaluate: (x) => 25 - 5 * x,
        behaviorTip: 'Negatif eğimli doğru (-5): x₅ en küçük değerini (x₅ = 1) aldığında sonuç +20 olur.',
      },
    ],
  },
  {
    id: 'eq-3',
    badge: '3. Denklem',
    name: 'Polinom & Üstel Zirve',
    funcSymbol: 'G₃(x)',
    maxScore: 176,
    levers: [
      {
        id: 'x1',
        varName: 'x₁',
        title: 'AR-GE İnovasyon Gücü (Üstel)',
        funcType: 'f₁(x₁) = 3^(x₁)',
        formulaDisplay: '+ 3^(x₁)',
        color: '#3B82F6',
        optimalX: 4,
        initialX: 1,
        minY: 3,
        maxY: 81,
        evaluate: (x) => Math.pow(3, x),
        behaviorTip: '3 tabanlı üstel fonksiyon: x₁ = 4 için 3⁴ = +81 maksimum değerini üretir.',
      },
      {
        id: 'x2',
        varName: 'x₂',
        title: 'Reklam Etki Gücü (Parabol)',
        funcType: 'f₂(x₂) = 45 - 5(x₂ - 3)²',
        formulaDisplay: '+ 45 - 5(x₂-3)²',
        color: '#A855F7',
        optimalX: 3,
        initialX: 1,
        minY: 25,
        maxY: 45,
        evaluate: (x) => 45 - 5 * Math.pow(x - 3, 2),
        behaviorTip: 'Tepe noktası T(3, 45) olan parabol: x₂ = 3 noktasında +45 zirvesine çıkar.',
      },
      {
        id: 'x3',
        varName: 'x₃',
        title: 'Stok Devir Hızı (Polinom)',
        funcType: 'f₃(x₃) = 16x₃ - 4x₃²',
        formulaDisplay: '+ 16x₃ - 4x₃²',
        color: '#F14E13',
        optimalX: 2,
        initialX: 4,
        minY: 0,
        maxY: 16,
        evaluate: (x) => 16 * x - 4 * Math.pow(x, 2),
        behaviorTip: 'Tepe noktası r = -b/(2a) = -16/(-8) = 2 olduğundan x₃ = 2 için maksimumdur (+16).',
      },
      {
        id: 'x4',
        varName: 'x₄',
        title: 'Çevre & Atık Cezası (Mutlak Ceza)',
        funcType: 'f₄(x₄) = -10|x₄ - 1|',
        formulaDisplay: '- 10|x₄-1|',
        color: '#EF4444',
        optimalX: 1,
        initialX: 3,
        minY: -30,
        maxY: 0,
        evaluate: (x) => -10 * Math.abs(x - 1),
        behaviorTip: 'Mutlak değer cezası x₄ = 1 seçildiğinde sıfırlanır (0).',
      },
      {
        id: 'x5',
        varName: 'x₅',
        title: 'Toplu Alım Tasarrufu (Konveks Parabol)',
        funcType: 'f₅(x₅) = 3x₅² - 6x₅ + 10',
        formulaDisplay: '+ 3x₅² - 6x₅ + 10',
        color: '#10B981',
        optimalX: 4,
        initialX: 1,
        minY: 7,
        maxY: 34,
        evaluate: (x) => 3 * Math.pow(x, 2) - 6 * x + 10,
        behaviorTip: 'Kolları yukarı bakan parabol (r = 1 dip noktası): En uzak nokta x₅ = 4 zirvedir (+34).',
      },
    ],
  },
];

const getInitialValuesForStage = (stage: EquationStage): Record<LeverId, 1 | 2 | 3 | 4> => ({
  x1: stage.levers[0].initialX,
  x2: stage.levers[1].initialX,
  x3: stage.levers[2].initialX,
  x4: stage.levers[3].initialX,
  x5: stage.levers[4].initialX,
});

export const MathProfitGame: React.FC<MathProfitGameProps> = ({
  onComplete,
  onNextSubject,
  nextSubjectName,
}) => {
  const [stageIndex, setStageIndex] = useState<number>(0);
  const currentStage = EQUATION_STAGES[stageIndex];

  const [values, setValues] = useState<Record<LeverId, 1 | 2 | 3 | 4>>(() =>
    getInitialValuesForStage(EQUATION_STAGES[0])
  );
  const [activeHintId, setActiveHintId] = useState<LeverId>('x2');
  const [solvedStageIds, setSolvedStageIds] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

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

    // Yeni denkleme geçildiğinde en üste yumuşak kaydır
    const scrollParent = rootRef.current?.closest('.overflow-y-auto');
    if (scrollParent) {
      scrollParent.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateX = (id: LeverId, nextX: 1 | 2 | 3 | 4) => {
    setActiveHintId(id);
    const nextMap = { ...values, [id]: nextX };
    setValues(nextMap);

    const leverDef = currentStage.levers.find((l) => l.id === id);
    const allOpt = currentStage.levers.every((f) => nextMap[f.id] === f.optimalX);

    if (allOpt) {
      soundEngine.playCorrect();
      if (!solvedStageIds.includes(currentStage.id)) {
        setSolvedStageIds((prev) => [...prev, currentStage.id]);
      }
      onComplete();
    } else if (leverDef && nextX === leverDef.optimalX) {
      soundEngine.playPartial();
    } else {
      soundEngine.playClick();
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setValues(getInitialValuesForStage(currentStage));
  };

  const activeLeverObj = termValues.find((f) => f.id === activeHintId) || termValues[0];

  // Seçili Terimin Fonksiyon Eğrisi Koordinatları
  const mapDetailX = (xVal: number) => 60 + ((xVal - 1) / 3) * 300;
  const mapDetailY = (yVal: number, f: LeverFormulaDef) => {
    const span = Math.max(1, f.maxY - f.minY);
    return 118 - ((yVal - f.minY) / span) * 86;
  };

  const detailCurvePts: string[] = [];
  for (let step = 0; step <= 36; step++) {
    const xVal = 1 + (step / 36) * 3;
    const yVal = activeLeverObj.evaluate(xVal);
    detailCurvePts.push(
      `${mapDetailX(xVal).toFixed(1)},${mapDetailY(yVal, activeLeverObj).toFixed(1)}`
    );
  }
  const activePtX = mapDetailX(activeLeverObj.currentX);
  const activePtY = mapDetailY(activeLeverObj.currentVal, activeLeverObj);
  const optimalPtX = mapDetailX(activeLeverObj.optimalX);
  const optimalPtY = mapDetailY(activeLeverObj.maxVal, activeLeverObj);

  const progressPct = Math.min(100, Math.max(8, Math.round((totalRevenue / currentStage.maxScore) * 100)));

  return (
    <div ref={rootRef} className="flex flex-col gap-3.5">
      {/* ÜST BAR: Denklem Seçici + Canlı Toplam Hedef */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F0510] border border-white/10 rounded-2xl p-3">
        <div className="flex items-center gap-2 flex-wrap">
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
                    ? 'bg-[#F14E13] text-white border-orange-300 shadow-md shadow-orange-500/20'
                    : isSolved
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-white/5 text-[#B5CBC8] border-white/10 hover:text-white'
                }`}
              >
                <span>{st.badge}</span>
                <span className="opacity-80">({st.funcSymbol})</span>
                {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Sağ: Toplam Değer ve İlerleme Çubuğu */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-[#B5CBC8]">
              Toplam Fonksiyon Değeri ({optimalCount}/5 Terim Zirvede)
            </div>
            <div className="font-mono font-black text-sm sm:text-base text-white">
              <span className={isAllOptimal ? 'text-emerald-400' : 'text-amber-300'}>
                {totalRevenue}
              </span>{' '}
              / {currentStage.maxScore} Bin ₺
            </div>
          </div>
          <div className="w-24 h-2.5 rounded-full bg-white/10 overflow-hidden border border-white/10 hidden sm:block">
            <div
              className={`h-full transition-all duration-300 ${
                isAllOptimal ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#F14E13] to-amber-400'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ORTA: SADELEŞTİRİLMİŞ TEK FONKSİYON GRAFİĞİ */}
      <div className="bg-gradient-to-b from-[#1E1022] via-[#150A16] to-[#0F0510] border border-white/15 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activeLeverObj.color }}
            />
            <span className="font-poppins font-bold text-xs sm:text-sm text-white">
              {activeLeverObj.title}:
            </span>
            <span
              className="font-mono font-black text-xs sm:text-sm"
              style={{ color: activeLeverObj.color }}
            >
              {activeLeverObj.funcType}
            </span>
          </div>

          <span className="text-xs font-mono text-[#B5CBC8]">
            Seçili Değer:{' '}
            <strong className="text-white">
              {activeLeverObj.varName} = {activeLeverObj.currentX}
            </strong>{' '}
            ➔ Katkı:{' '}
            <strong className={activeLeverObj.isOptimal ? 'text-emerald-400' : 'text-amber-300'}>
              {activeLeverObj.currentVal >= 0
                ? `+${activeLeverObj.currentVal}`
                : activeLeverObj.currentVal}
            </strong>
          </span>
        </div>

        <svg viewBox="0 0 420 140" className="w-full h-36 overflow-visible">
          {/* Yatay & Dikey Eksen */}
          <line x1="40" y1="122" x2="385" y2="122" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          <line x1="40" y1="16" x2="40" y2="122" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

          {/* x = 1, 2, 3, 4 Noktaları (Tıklanabilir Kılavuzlar) */}
          {([1, 2, 3, 4] as const).map((xVal) => {
            const gx = mapDetailX(xVal);
            const yVal = Math.round(activeLeverObj.evaluate(xVal));
            const gy = mapDetailY(yVal, activeLeverObj);
            const isSelected = xVal === activeLeverObj.currentX;
            return (
              <g
                key={xVal}
                onClick={() => updateX(activeLeverObj.id, xVal)}
                className="cursor-pointer"
              >
                <line
                  x1={gx}
                  y1="22"
                  x2={gx}
                  y2="122"
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={gx}
                  cy={gy}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#FBBF24' : 'rgba(255,255,255,0.35)'}
                />
                <text
                  x={gx}
                  y="136"
                  textAnchor="middle"
                  fill={isSelected ? '#FBBF24' : '#94A3B8'}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {activeLeverObj.varName}={xVal} ({yVal >= 0 ? `+${yVal}` : yVal})
                </text>
              </g>
            );
          })}

          {/* Fonksiyon Eğrisi */}
          <polyline
            fill="none"
            stroke={activeLeverObj.color}
            strokeWidth="3.5"
            strokeLinecap="round"
            points={detailCurvePts.join(' ')}
          />

          {/* Tepe / Optimum Hedef Halkası */}
          <circle
            cx={optimalPtX}
            cy={optimalPtY}
            r="8.5"
            fill="rgba(16,185,129,0.2)"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Aktif Nokta */}
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
              y="-12"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {activeLeverObj.currentVal >= 0
                ? `+${activeLeverObj.currentVal}`
                : activeLeverObj.currentVal}
            </text>
          </g>
        </svg>

        {/* HİKAYE KARAKTERİ: STARTUP KURUCUSU BORA'NIN ANLIK TEPKİSİ */}
        <div
          className={`rounded-xl px-3.5 py-2.5 border flex items-center gap-3 transition-all ${
            isAllOptimal
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-100'
              : activeLeverObj.isOptimal
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-100'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-100'
          }`}
        >
          <span className="text-2xl shrink-0">
            {isAllOptimal ? '🤑' : activeLeverObj.isOptimal ? '🚀' : '📉'}
          </span>
          <div className="text-xs leading-relaxed">
            <strong className="text-white font-poppins">Startup Kurucusu Bora: </strong>
            {isAllOptimal ? (
              <span>
                &ldquo;Yatırımcılar ayakta alkışlıyor! 5 fonksiyon terimini de tepe noktasına taşıdın ve{' '}
                <strong className="text-emerald-300">{currentStage.maxScore} Bin ₺</strong> rekor gelire ulaştık!&rdquo;
              </span>
            ) : activeLeverObj.isOptimal ? (
              <span>
                &ldquo;Süper hamle! <strong className="text-white">{activeLeverObj.varName} = {activeLeverObj.currentX}</strong> seçimiyle{' '}
                <strong className="text-emerald-300">{activeLeverObj.title}</strong> terimini zirveye (
                {activeLeverObj.currentVal >= 0 ? `+${activeLeverObj.currentVal}` : activeLeverObj.currentVal}) çıkardın! Diğer terimleri de zirveye taşı!&rdquo;
              </span>
            ) : (
              <span>
                &ldquo;Yatırımcı sunumuna az kaldı! Şu an{' '}
                <strong className="text-white">{activeLeverObj.varName} = {activeLeverObj.currentX}</strong> seçili ama gelir düşük (
                {activeLeverObj.currentVal >= 0 ? `+${activeLeverObj.currentVal}` : activeLeverObj.currentVal}).{' '}
                {activeLeverObj.behaviorTip}&rdquo;
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ALT: 5 SADE TERİM KARTI (1-2-3-4 Kademe Seçici) */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {termValues.map((tv) => {
          const isFocused = activeHintId === tv.id;
          return (
            <div
              key={tv.id}
              onClick={() => setActiveHintId(tv.id)}
              className={`rounded-2xl border p-3 flex flex-col justify-between gap-2.5 cursor-pointer transition-all ${
                tv.isOptimal
                  ? 'border-emerald-400/80 bg-emerald-500/10'
                  : isFocused
                  ? 'border-[#F14E13] bg-[#1A0E1C]'
                  : 'border-white/10 bg-[#0F0510] hover:border-white/25'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-white/80">{tv.title}</span>
                  <span
                    className={`font-bold ${
                      tv.isOptimal ? 'text-emerald-400' : 'text-amber-300'
                    }`}
                  >
                    {tv.currentVal >= 0 ? `+${tv.currentVal}` : tv.currentVal}
                  </span>
                </div>
                <div
                  className="font-mono font-black text-sm mt-1 truncate"
                  style={{ color: tv.color }}
                >
                  {tv.formulaDisplay}
                </div>
              </div>

              {/* 1 - 2 - 3 - 4 Doğrudan Seçim Butonları */}
              <div className="grid grid-cols-4 gap-1">
                {([1, 2, 3, 4] as const).map((xVal) => {
                  const isActive = tv.currentX === xVal;
                  return (
                    <button
                      key={xVal}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateX(tv.id, xVal);
                      }}
                      className={`py-1.5 rounded-lg font-mono text-xs font-black border transition-all ${
                        isActive
                          ? tv.isOptimal
                            ? 'bg-emerald-500 text-black border-white shadow'
                            : 'bg-[#F14E13] text-white border-white shadow'
                          : 'bg-white/5 text-[#B5CBC8] border-white/10 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      {xVal}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ALT AKSİYON BARI */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-xs font-mono text-[#B5CBC8]">
          Her terim için <strong className="text-white">1, 2, 3 veya 4</strong> seçerek toplamı maksimize et.
        </span>

        <div className="flex items-center gap-2">
          {isAllOptimal && stageIndex < EQUATION_STAGES.length - 1 && (
            <button
              type="button"
              onClick={() => selectStage(stageIndex + 1)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Sonraki Denklem ({EQUATION_STAGES[stageIndex + 1].funcSymbol})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isAllOptimal && onNextSubject && (
            <button
              type="button"
              onClick={onNextSubject}
              className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg shadow-emerald-500/20"
            >
              <span>
                {nextSubjectName === 'Çıkış'
                  ? 'Tüm Dersler Bitti - Çıkış'
                  : nextSubjectName
                  ? `Sonraki Ders (${nextSubjectName}) →`
                  : 'Sonraki Derse Geç (Geometri)'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
       * STICKY BOTTOM TEBRİK & SONRAKİ DENKLEM BARI (EKRANI KAYDIRMADAN ERİŞİM)
       * 5 kol da tepe noktasına ulaştığı anda ekranın altında sabitlenir.
       * ===================================================================== */}
      {isAllOptimal && (
        <aside aria-label="Denklem Aksiyonu" className="sticky bottom-0 z-30 w-full p-3 sm:p-4 rounded-2xl bg-[#1A0E1C]/95 backdrop-blur-md border-2 border-emerald-400 shadow-[0_-8px_25px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-3 animate-slide-up mt-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center text-base shrink-0">
              🎉
            </div>
            <div className="min-w-0">
              <span className="font-poppins font-black text-xs sm:text-sm text-white block truncate">
                Tebrikler! {currentStage.funcSymbol} Zirve Kâr ({currentStage.maxScore} Bin ₺) Elde Edildi!
              </span>
              <span className="text-[11px] text-emerald-300/80 font-mono hidden sm:block truncate">
                {stageIndex < EQUATION_STAGES.length - 1
                  ? 'Sıradaki denkleme geçerek optimizasyona devam edebilirsiniz.'
                  : 'Tüm denklemler tamamlandı! Sonraki derse geçebilirsiniz.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {stageIndex < EQUATION_STAGES.length - 1 && (
              <button
                type="button"
                onClick={() => selectStage(stageIndex + 1)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-mono font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 animate-pulse transition-all cursor-pointer"
              >
                <span>Sonraki Denklem ({EQUATION_STAGES[stageIndex + 1].funcSymbol})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onNextSubject && (
              <button
                type="button"
                onClick={onNextSubject}
                className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <span>
                  {nextSubjectName === 'Çıkış'
                    ? 'Tüm Dersler Bitti - Çıkış'
                    : nextSubjectName
                    ? `Sonraki Ders (${nextSubjectName}) →`
                    : 'Sonraki Ders (Geometri) →'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sıfırla</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default MathProfitGame;
