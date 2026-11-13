import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export interface PhysBalanceGameProps {
  onComplete: () => void;
  onNextSubject?: () => void;
}

interface PlacedWeight {
  id: string;
  mass: number;
  isFixed?: boolean;
}

interface LevelConfig {
  level: number;
  title: string;
  description: string;
  fixedLeft: Record<number, number[]>; // distance (1..4) -> array of masses
  fixedRight: Record<number, number[]>;
  availableWeights: { id: string; mass: number; color: string }[];
  hint: string;
}

const LEVELS: LevelConfig[] = [
  {
    level: 1,
    title: 'Aşama 1/2: Temel Kuvvet Kolu & Tork Dengesi',
    description:
      'Sol kolda 3d uzaklıkta 4 kg kütle bulunuyor (τ_sol = 4 × 3 = 12 birim). Elindeki kütleleri bölmelere yerleştirerek çubuğu yatay dengeye (Στ_sol = Στ_sağ) getir!',
    fixedLeft: { 3: [4] },
    fixedRight: {},
    availableWeights: [
      { id: 'w1-2', mass: 2, color: '#3B82F6' },
      { id: 'w1-3', mass: 3, color: '#10B981' },
      { id: 'w1-5', mass: 5, color: '#F59E0B' },
    ],
    hint: 'İpucu: τ = F · d formülüne göre 12 birimlik torku dengelemek için 3 kg kütleyi 4d bölmesine (3 × 4 = 12) koyabilir veya birden fazla kütleyi birleştirebilirsin!',
  },
  {
    level: 2,
    title: 'Aşama 2/2: Çoklu Kütle & Bileşke Tork Dengesi',
    description:
      'Sol kolda 4d bölmesinde 3 kg (τ=12) ve 1d bölmesinde 2 kg (τ=2) sabit kütle var (Toplam τ_sol = 14 birim). Elindeki kütlelerle sağ kolu (veya her iki kolu) kullanarak net torku sıfırla!',
    fixedLeft: { 4: [3], 1: [2] },
    fixedRight: {},
    availableWeights: [
      { id: 'w2-2', mass: 2, color: '#3B82F6' },
      { id: 'w2-3', mass: 3, color: '#10B981' },
      { id: 'w2-5', mass: 5, color: '#F59E0B' },
    ],
    hint: 'İpucu: Sol tork 14 birim. Örneğin sağ 4d bölmesine 3 kg (3×4=12) ve sağ 1d bölmesine 2 kg (2×1=2) yerleştirirsen 12 + 2 = 14 birim ile tam denge sağlanır!',
  },
];

export const PhysBalanceGame: React.FC<PhysBalanceGameProps> = ({ onComplete, onNextSubject }) => {
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const currentLevel = LEVELS[levelIdx];

  const [selectedWeightId, setSelectedWeightId] = useState<string | null>(
    LEVELS[0].availableWeights[1].id
  );
  // Yerleştirilen oyuncu kütleleri: { weightId: { side: 'left' | 'right', distance: 1|2|3|4 } }
  const [placements, setPlacements] = useState<
    Record<string, { side: 'left' | 'right'; distance: number }>
  >({});
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);

  // Sol ve Sağ Tork Hesabı
  const calculateTorques = () => {
    let leftTorque = 0;
    let rightTorque = 0;
    const leftFormulaParts: string[] = [];
    const rightFormulaParts: string[] = [];

    // Sabit kütleler
    for (let d = 1; d <= 4; d++) {
      const fixedL = currentLevel.fixedLeft[d] || [];
      fixedL.forEach((m) => {
        leftTorque += m * d;
        leftFormulaParts.push(`(${m}kg × ${d}d)`);
      });
      const fixedR = currentLevel.fixedRight[d] || [];
      fixedR.forEach((m) => {
        rightTorque += m * d;
        rightFormulaParts.push(`(${m}kg × ${d}d)`);
      });
    }

    // Oyuncunun yerleştirdiği kütleler
    Object.entries(placements).forEach(([wId, pos]) => {
      const wObj = currentLevel.availableWeights.find((w) => w.id === wId);
      if (!wObj) return;
      if (pos.side === 'left') {
        leftTorque += wObj.mass * pos.distance;
        leftFormulaParts.push(`(${wObj.mass}kg × ${pos.distance}d)`);
      } else {
        rightTorque += wObj.mass * pos.distance;
        rightFormulaParts.push(`(${wObj.mass}kg × ${pos.distance}d)`);
      }
    });

    return {
      leftTorque,
      rightTorque,
      netTorque: rightTorque - leftTorque,
      leftFormula: leftFormulaParts.length > 0 ? leftFormulaParts.join(' + ') : '0',
      rightFormula: rightFormulaParts.length > 0 ? rightFormulaParts.join(' + ') : '0',
    };
  };

  const { leftTorque, rightTorque, netTorque, leftFormula, rightFormula } = calculateTorques();
  const isBalanced = leftTorque > 0 && leftTorque === rightTorque;

  // Eğim açısı (-16 deg ile +16 deg arası)
  const tiltDeg = Math.max(-16, Math.min(16, netTorque * 1.4));

  const handlePlaceOnSlot = (side: 'left' | 'right', distance: number) => {
    if (isGameFinished) return;
    if (!selectedWeightId) return;

    setPlacements((prev) => ({
      ...prev,
      [selectedWeightId]: { side, distance },
    }));

    // Otomatik olarak henüz yerleştirilmemiş bir sonraki kütleyi seç
    const nextUnplaced = currentLevel.availableWeights.find(
      (w) => w.id !== selectedWeightId && !placements[w.id]
    );
    if (nextUnplaced) {
      setSelectedWeightId(nextUnplaced.id);
    }
  };

  const handleRemoveWeight = (wId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGameFinished) return;
    setPlacements((prev) => {
      const copy = { ...prev };
      delete copy[wId];
      return copy;
    });
    setSelectedWeightId(wId);
  };

  const handleNextOrFinish = () => {
    if (!isBalanced) return;
    if (levelIdx < LEVELS.length - 1) {
      const nextIdx = levelIdx + 1;
      setLevelIdx(nextIdx);
      setPlacements({});
      setSelectedWeightId(LEVELS[nextIdx].availableWeights[0].id);
    } else {
      setIsGameFinished(true);
      onComplete();
    }
  };

  const handleResetLevel = () => {
    setPlacements({});
    setSelectedWeightId(currentLevel.availableWeights[0].id);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Üst Bilgi & Formül Özeti */}
      <div className="bg-[#0F0510] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${
              isBalanced
                ? 'bg-emerald-500/20 border-emerald-500/50'
                : 'bg-amber-500/15 border-amber-500/40'
            }`}
          >
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-poppins font-bold text-sm sm:text-base text-white">
                {currentLevel.title}
              </h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                τ = F · d (Tork = Kuvvet × Kol)
              </span>
            </div>
            <p className="text-xs text-[#B5CBC8] mt-0.5">{currentLevel.description}</p>
          </div>
        </div>

        <button
          onClick={handleResetLevel}
          className="self-end sm:self-auto px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1.5 transition-all shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kütleleri Topla</span>
        </button>
      </div>

      {/* Canlı Tork Karşılaştırma Paneli */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0F0510] border border-orange-500/30 rounded-2xl p-3.5 text-center">
          <div className="text-[11px] font-mono text-[#B5CBC8] uppercase">Sol Tork (Στ_sol)</div>
          <div className="font-mono font-black text-xl sm:text-2xl text-[#F14E13] mt-0.5">
            {leftTorque} <span className="text-xs font-normal">N·m</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">{leftFormula}</div>
        </div>

        <div
          className={`border rounded-2xl p-3.5 text-center flex flex-col items-center justify-center transition-all ${
            isBalanced
              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
              : 'bg-[#0F0510] border-white/10 text-amber-300'
          }`}
        >
          <div className="text-[11px] font-mono uppercase">Net Tork Farkı (Δτ)</div>
          <div className="font-poppins font-black text-base sm:text-lg mt-0.5">
            {isBalanced ? '✓ TAM DENGE (Δτ = 0)' : `Δτ = ${Math.abs(netTorque)} birim`}
          </div>
          <div className="text-[10px] font-mono opacity-80 mt-0.5">
            {netTorque < 0
              ? '↙ Sol taraf ağır basıyor'
              : netTorque > 0
              ? '↘ Sağ taraf ağır basıyor'
              : 'Çubuk yatay dengede!'}
          </div>
        </div>

        <div className="bg-[#0F0510] border border-blue-500/30 rounded-2xl p-3.5 text-center">
          <div className="text-[11px] font-mono text-[#B5CBC8] uppercase">Sağ Tork (Στ_sağ)</div>
          <div className="font-mono font-black text-xl sm:text-2xl text-blue-400 mt-0.5">
            {rightTorque} <span className="text-xs font-normal">N·m</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">{rightFormula}</div>
        </div>
      </div>

      {/* İnteraktif Denge Çubuğu (Tahterevalli) Sahnesi */}
      <div className="bg-gradient-to-b from-[#1E1022] to-[#0F0510] border-2 border-orange-500/35 rounded-3xl p-5 sm:p-8 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
        <div className="text-[11px] font-mono text-[#B5CBC8] mb-8 text-center">
          Aşağıdaki kütlelerden birini seç, ardından çubuk üzerindeki <strong className="text-white">1d, 2d, 3d, 4d</strong> bölmelerinden birine tıklayarak yerleştir! (Kaldırmak için kütlenin üzerine tıkla)
        </div>

        {/* Dönen Çubuk Kapsayıcısı */}
        <div
          className="w-full max-w-2xl transition-transform duration-500 ease-out relative"
          style={{ transform: `rotate(${tiltDeg}deg)` }}
        >
          {/* Sol ve Sağ Bölmeler Dizisi */}
          <div className="grid grid-cols-9 items-end gap-1 sm:gap-2 pb-2">
            {/* SOL KOL: 4d, 3d, 2d, 1d */}
            {[4, 3, 2, 1].map((d) => {
              const fixedMasses = currentLevel.fixedLeft[d] || [];
              const playerWeightsHere = Object.entries(placements)
                .filter(([, pos]) => pos.side === 'left' && pos.distance === d)
                .map(([wId]) => currentLevel.availableWeights.find((w) => w.id === wId)!)
                .filter(Boolean);

              return (
                <button
                  key={`left-${d}`}
                  onClick={() => handlePlaceOnSlot('left', d)}
                  className="flex flex-col items-center justify-end min-h-[92px] p-1 rounded-xl border border-dashed border-orange-500/30 hover:border-[#F14E13] hover:bg-[#F14E13]/15 transition-all group"
                >
                  <div className="flex flex-col gap-1 items-center mb-1">
                    {fixedMasses.map((m, idx) => (
                      <div
                        key={`fix-l-${d}-${idx}`}
                        className="px-2 py-1 rounded-lg bg-red-500/30 border border-red-400 text-white font-mono font-bold text-[10px] sm:text-xs shadow"
                        title="Sabit Kütle"
                      >
                        🔒{m}kg
                      </div>
                    ))}
                    {playerWeightsHere.map((w) => (
                      <div
                        key={w.id}
                        onClick={(e) => handleRemoveWeight(w.id, e)}
                        className="px-2 py-1 rounded-lg font-mono font-bold text-[10px] sm:text-xs text-white shadow cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: w.color }}
                        title="Kaldırmak için tıkla"
                      >
                        {w.mass}kg ✕
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-orange-300 group-hover:text-white">
                    {d}d
                  </span>
                </button>
              );
            })}

            {/* MERKEZ DESTEK NOKTASI (0) */}
            <div className="flex flex-col items-center justify-end min-h-[92px] pb-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold">Destek</span>
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow shadow-amber-400/50 mt-1" />
            </div>

            {/* SAĞ KOL: 1d, 2d, 3d, 4d */}
            {[1, 2, 3, 4].map((d) => {
              const fixedMasses = currentLevel.fixedRight[d] || [];
              const playerWeightsHere = Object.entries(placements)
                .filter(([, pos]) => pos.side === 'right' && pos.distance === d)
                .map(([wId]) => currentLevel.availableWeights.find((w) => w.id === wId)!)
                .filter(Boolean);

              return (
                <button
                  key={`right-${d}`}
                  onClick={() => handlePlaceOnSlot('right', d)}
                  className="flex flex-col items-center justify-end min-h-[92px] p-1 rounded-xl border border-dashed border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/15 transition-all group"
                >
                  <div className="flex flex-col gap-1 items-center mb-1">
                    {fixedMasses.map((m, idx) => (
                      <div
                        key={`fix-r-${d}-${idx}`}
                        className="px-2 py-1 rounded-lg bg-red-500/30 border border-red-400 text-white font-mono font-bold text-[10px] sm:text-xs shadow"
                      >
                        🔒{m}kg
                      </div>
                    ))}
                    {playerWeightsHere.map((w) => (
                      <div
                        key={w.id}
                        onClick={(e) => handleRemoveWeight(w.id, e)}
                        className="px-2 py-1 rounded-lg font-mono font-bold text-[10px] sm:text-xs text-white shadow cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: w.color }}
                        title="Kaldırmak için tıkla"
                      >
                        {w.mass}kg ✕
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-blue-300 group-hover:text-white">
                    {d}d
                  </span>
                </button>
              );
            })}
          </div>

          {/* Yatay Çubuk Gövdesi */}
          <div
            className={`w-full h-3.5 rounded-full border transition-colors ${
              isBalanced
                ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 border-emerald-300 shadow-lg shadow-emerald-500/30'
                : 'bg-gradient-to-r from-[#F14E13] via-amber-400 to-blue-500 border-white/20'
            }`}
          />
        </div>

        {/* Sabit Üçgen Fulcrum (Destek Ayağı) */}
        <div className="flex flex-col items-center -mt-1">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '22px solid transparent',
              borderRight: '22px solid transparent',
              borderBottom: '32px solid #F14E13',
            }}
          />
          <div className="w-28 h-2 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Alt Kütle Seçim Envanteri & Aşama Geçiş Butonu */}
      <div className="bg-[#0F0510] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-mono font-bold text-[#B5CBC8] mr-1">
            Elindeki Kütleler:
          </span>
          {currentLevel.availableWeights.map((w) => {
            const placedPos = placements[w.id];
            const isSelected = selectedWeightId === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelectedWeightId(w.id)}
                className={`px-3.5 py-2 rounded-xl font-mono font-bold text-xs flex items-center gap-2 border transition-all ${
                  isSelected
                    ? 'border-white scale-105 shadow-md'
                    : 'border-white/15 opacity-85 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: `${w.color}25`,
                  color: '#fff',
                  borderColor: isSelected ? '#fff' : w.color,
                }}
              >
                <span>🏋️ {w.mass} kg</span>
                {placedPos ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300">
                    ({placedPos.side === 'left' ? 'Sol' : 'Sağ'} {placedPos.distance}d)
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-300">Boşta</span>
                )}
              </button>
            );
          })}
        </div>

        {isBalanced ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleNextOrFinish}
              disabled={isGameFinished}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 !bg-emerald-600 hover:!bg-emerald-500 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isGameFinished
                  ? '✓ Tork Simülasyonu Tamamlandı!'
                  : levelIdx < LEVELS.length - 1
                  ? 'Harika! 2. Aşamaya Geç →'
                  : '🎉 Dengeyi Onayla & Tamamla'}
              </span>
            </button>
            {onNextSubject && (
              <button
                onClick={onNextSubject}
                className="btn-primary py-2.5 px-5 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 !bg-emerald-600 hover:!bg-emerald-500 shrink-0"
              >
                <span>Sonraki Derse Geç (Matematik)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-xs text-[#B5CBC8] flex items-center gap-1.5 font-mono">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{currentLevel.hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysBalanceGame;
