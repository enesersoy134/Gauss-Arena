import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import soundEngine from '../../utils/soundEngine';

export interface PhysBalanceGameProps {
  onComplete: () => void;
  onNextSubject?: () => void;
  nextSubjectName?: string;
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

export const PhysBalanceGame: React.FC<PhysBalanceGameProps> = ({
  onComplete,
  onNextSubject,
  nextSubjectName,
}) => {
  const [levelIdx, setLevelIdx] = useState<number>(0);
  const currentLevel = LEVELS[levelIdx];
  const rootRef = useRef<HTMLDivElement>(null);

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

    const nextPlacements = {
      ...placements,
      [selectedWeightId]: { side, distance },
    };
    setPlacements(nextPlacements);

    // Yeni yerleşimle denge sağlandı mı kontrol et
    let nextL = 0;
    let nextR = 0;
    for (let d = 1; d <= 4; d++) {
      (currentLevel.fixedLeft[d] || []).forEach((m) => (nextL += m * d));
      (currentLevel.fixedRight[d] || []).forEach((m) => (nextR += m * d));
    }
    Object.entries(nextPlacements).forEach(([wId, pos]) => {
      const wObj = currentLevel.availableWeights.find((w) => w.id === wId);
      if (!wObj) return;
      if (pos.side === 'left') nextL += wObj.mass * pos.distance;
      else nextR += wObj.mass * pos.distance;
    });

    if (nextL > 0 && nextL === nextR) {
      soundEngine.playCorrect();
    } else {
      soundEngine.playClick();
    }

    // Otomatik olarak henüz yerleştirilmemiş bir sonraki kütleyi seç
    const nextUnplaced = currentLevel.availableWeights.find(
      (w) => w.id !== selectedWeightId && !nextPlacements[w.id]
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

      // Üste yumuşak kaydır
      const scrollParent = rootRef.current?.closest('.overflow-y-auto');
      if (scrollParent) {
        scrollParent.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setIsGameFinished(true);
      onComplete();
    }
  };

  const handleResetLevel = () => {
    setPlacements({});
    setSelectedWeightId(currentLevel.availableWeights[0].id);
  };

  const placedCount = Object.keys(placements).length;

  return (
    <div ref={rootRef} className="flex flex-col gap-2 sm:gap-2.5">
      {/* =====================================================================
       * VURGULU GÖREV SENARYOSU & ŞANTİYE KRİZ BRİFİNGİ (KULE VİNCİ DEVİRME ALARMI)
       * Ekranda anında fark edilecek, yüksek kontrastlı ve neon amber vurgulu kart
       * ===================================================================== */}
      <div
        className={`rounded-xl sm:rounded-2xl border-2 p-2.5 sm:p-3 transition-all duration-300 relative overflow-hidden shadow-lg ${
          isBalanced
            ? 'bg-gradient-to-r from-emerald-950/85 via-[#1D0D1F] to-[#120815] border-emerald-400 ring-1 ring-emerald-400/40 shadow-emerald-500/25'
            : placedCount > 0
            ? 'bg-gradient-to-r from-amber-950/85 via-[#1E0E21] to-orange-950/75 border-amber-400 ring-1 ring-amber-400/50 shadow-amber-500/25'
            : 'bg-gradient-to-r from-amber-950/80 via-[#1A0E1C] to-orange-950/70 border-amber-500/80 ring-1 ring-amber-400/40 shadow-amber-500/20'
        }`}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            {/* Karakter Avatarı & Canlı Halka */}
            <div className="relative shrink-0">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center text-2xl shadow-md transition-transform duration-300 ${
                  isBalanced
                    ? 'border-emerald-400 bg-emerald-500/25 scale-105 shadow-emerald-500/30'
                    : placedCount > 0
                    ? 'border-amber-400 bg-amber-500/25 animate-pulse'
                    : 'border-amber-500/70 bg-amber-500/20'
                }`}
              >
                {isBalanced
                  ? '😎'
                  : placedCount === 0
                  ? '👷‍♂️'
                  : netTorque > 0
                  ? '😱'
                  : '😰'}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-black text-[8px] font-bold text-black items-center justify-center">!</span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-poppins font-black text-[10px] tracking-wide uppercase shadow-sm flex items-center gap-1">
                  🚨 ŞANTİYE BRİFİNGİ
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-500/25 px-2 py-0.5 rounded-md border border-amber-400/50">
                  Kadir Usta • Aşama {currentLevel.level}/2
                </span>
                <span className="text-[10px] font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded-md border border-white/10">
                  Formül: <strong className="text-amber-300">τ = F · d</strong>
                </span>
              </div>

              <p className="text-xs text-white font-medium leading-tight">
                &ldquo;
                {isBalanced
                  ? `Helal olsun! Sol tork (${leftTorque} N·m) ile sağ tork (${rightTorque} N·m) eşitlendi, vinç dengede!`
                  : placedCount === 0
                  ? levelIdx === 0
                    ? 'Sol kolda 3d uzaklıkta 4 kg yük asılı kaldı (τ_sol = 12 N·m). Sağa karşı ağırlık koy!'
                    : 'Sol kolda iki ayrı yük var (Toplam τ_sol = 14 N·m). Elindeki ağırlıklarla sağ kolu tam 14 N·m yap!'
                  : netTorque < 0
                  ? `Sol kol ağır basıyor (Sol: ${leftTorque} > Sağ: ${rightTorque})! Ağırlığı desteğe daha uzağa (3d/4d) taşı!`
                  : `Fazla oldu! Vinç sağa devrilecek (Sağ: ${rightTorque} > Sol: ${leftTorque})! Ağırlığı desteğe yaklaştır!`}
                &rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
            {/* Aksiyon Hedef Rozeti */}
            <div className="bg-black/50 border border-amber-500/40 rounded-xl px-2.5 py-1.5 flex flex-col items-center sm:items-end justify-center min-w-[150px] shadow-inner">
              <div className="text-[9px] font-mono uppercase text-amber-300 font-black flex items-center gap-1">
                <span>🎯 HEDEF TORK</span>
              </div>
              <div className="text-[11px] font-mono font-black text-white text-center sm:text-right mt-0.5">
                {isBalanced ? (
                  <span className="text-emerald-400 font-bold">✓ Tork Dengelendi!</span>
                ) : (
                  <span className="text-amber-200">Sol {leftTorque} N·m = Sağ ?</span>
                )}
              </div>
              <div className="text-[9px] text-zinc-300 text-center sm:text-right font-mono">
                Sağ bölmelere ağırlık koy
              </div>
            </div>

            {isBalanced && !isGameFinished && (
              <button
                onClick={handleNextOrFinish}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-mono font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/30 animate-pulse transition-all shrink-0 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {levelIdx < LEVELS.length - 1
                    ? '2. Aşamaya Geç'
                    : 'Onayla'}
                </span>
              </button>
            )}

            <button
              onClick={handleResetLevel}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1 transition-all shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Topla</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canlı Tork Karşılaştırma Paneli */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#0F0510] border border-orange-500/30 rounded-xl p-2 sm:p-2.5 text-center">
          <div className="text-[10px] font-mono text-[#B5CBC8] uppercase">Sol Tork (Στ_sol)</div>
          <div className="font-mono font-black text-lg sm:text-xl text-[#F14E13] mt-0.5">
            {leftTorque} <span className="text-[10px] font-normal">N·m</span>
          </div>
          <div className="text-[9px] font-mono text-zinc-400 truncate">{leftFormula}</div>
        </div>

        <div
          className={`border rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-center transition-all ${
            isBalanced
              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
              : 'bg-[#0F0510] border-white/10 text-amber-300'
          }`}
        >
          <div className="text-[10px] font-mono uppercase">Net Tork Farkı (Δτ)</div>
          <div className="font-poppins font-black text-xs sm:text-sm mt-0.5">
            {isBalanced ? '✓ TAM DENGE (Δτ = 0)' : `Δτ = ${Math.abs(netTorque)} birim`}
          </div>
          <div className="text-[9px] font-mono opacity-80">
            {netTorque < 0
              ? '↙ Sol ağır'
              : netTorque > 0
              ? '↘ Sağ ağır'
              : 'Yatay dengede!'}
          </div>
        </div>

        <div className="bg-[#0F0510] border border-blue-500/30 rounded-xl p-2 sm:p-2.5 text-center">
          <div className="text-[10px] font-mono text-[#B5CBC8] uppercase">Sağ Tork (Στ_sağ)</div>
          <div className="font-mono font-black text-lg sm:text-xl text-blue-400 mt-0.5">
            {rightTorque} <span className="text-[10px] font-normal">N·m</span>
          </div>
          <div className="text-[9px] font-mono text-zinc-400 truncate">{rightFormula}</div>
        </div>
      </div>

      {/* İnteraktif Denge Çubuğu (Tahterevalli) Sahnesi */}
      <div className="bg-gradient-to-b from-[#1E1022] to-[#0F0510] border-2 border-orange-500/35 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-center min-h-[185px] sm:min-h-[210px] relative overflow-hidden">
        <div className="text-[10px] font-mono text-[#B5CBC8] mb-3 text-center">
          Alttan kütle seç, çubuktaki <strong className="text-white">1d, 2d, 3d, 4d</strong> bölmelerine tıkla! (Kaldırmak için kütleye tekrar tıkla)
        </div>

        {/* Dönen Çubuk Kapsayıcısı */}
        <div
          className="w-full max-w-2xl transition-transform duration-500 ease-out relative"
          style={{ transform: `rotate(${tiltDeg}deg)` }}
        >
          {/* Sol ve Sağ Bölmeler Dizisi */}
          <div className="grid grid-cols-9 items-end gap-1 sm:gap-2 pb-1.5">
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
                  className="flex flex-col items-center justify-end min-h-[68px] sm:min-h-[76px] p-1 rounded-xl border border-dashed border-orange-500/30 hover:border-[#F14E13] hover:bg-[#F14E13]/15 transition-all group"
                >
                  <div className="flex flex-col gap-1 items-center mb-1">
                    {fixedMasses.map((m, idx) => (
                      <div
                        key={`fix-l-${d}-${idx}`}
                        className="px-1.5 py-0.5 rounded bg-red-500/30 border border-red-400 text-white font-mono font-bold text-[9px] sm:text-[10px] shadow"
                        title="Sabit Kütle"
                      >
                        🔒{m}kg
                      </div>
                    ))}
                    {playerWeightsHere.map((w) => (
                      <div
                        key={w.id}
                        onClick={(e) => handleRemoveWeight(w.id, e)}
                        className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] text-white shadow cursor-pointer hover:scale-105 transition-transform"
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
            <div className="flex flex-col items-center justify-end min-h-[68px] sm:min-h-[76px] pb-1">
              <span className="text-[9px] font-mono text-amber-400 font-bold">Destek</span>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow shadow-amber-400/50 mt-1" />
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
                  className="flex flex-col items-center justify-end min-h-[68px] sm:min-h-[76px] p-1 rounded-xl border border-dashed border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/15 transition-all group"
                >
                  <div className="flex flex-col gap-1 items-center mb-1">
                    {fixedMasses.map((m, idx) => (
                      <div
                        key={`fix-r-${d}-${idx}`}
                        className="px-1.5 py-0.5 rounded bg-red-500/30 border border-red-400 text-white font-mono font-bold text-[9px] sm:text-[10px] shadow"
                      >
                        🔒{m}kg
                      </div>
                    ))}
                    {playerWeightsHere.map((w) => (
                      <div
                        key={w.id}
                        onClick={(e) => handleRemoveWeight(w.id, e)}
                        className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] sm:text-[10px] text-white shadow cursor-pointer hover:scale-105 transition-transform"
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
            className={`w-full h-3 rounded-full border transition-colors ${
              isBalanced
                ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 border-emerald-300 shadow-md shadow-emerald-500/30'
                : 'bg-gradient-to-r from-[#F14E13] via-amber-400 to-blue-500 border-white/20'
            }`}
          />
        </div>

        {/* Sabit Üçgen Fulcrum (Destek Ayağı) */}
        <div className="flex flex-col items-center -mt-0.5">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '16px solid transparent',
              borderRight: '16px solid transparent',
              borderBottom: '22px solid #F14E13',
            }}
          />
          <div className="w-20 h-1.5 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Alt Kütle Seçim Envanteri & Aşama Geçiş Butonu */}
      <div className="bg-[#0F0510] border border-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-[#B5CBC8] mr-1">
            Kütleler:
          </span>
          {currentLevel.availableWeights.map((w) => {
            const placedPos = placements[w.id];
            const isSelected = selectedWeightId === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelectedWeightId(w.id)}
                className={`px-2.5 py-1.5 rounded-lg sm:rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 border transition-all ${
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
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-amber-300">
                    ({placedPos.side === 'left' ? 'Sol' : 'Sağ'} {placedPos.distance}d)
                  </span>
                ) : (
                  <span className="text-[9px] text-emerald-300">Boşta</span>
                )}
              </button>
            );
          })}
        </div>

        {isBalanced ? (
          <div className="flex items-center gap-2 shrink-0">
            {!isGameFinished ? (
              <button
                onClick={handleNextOrFinish}
                className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 !bg-emerald-600 hover:!bg-emerald-500 shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {levelIdx < LEVELS.length - 1
                    ? '2. Aşamaya Geç'
                    : 'Dengeyi Onayla'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Denge Sağlandı!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-[#B5CBC8] flex items-center gap-1.5 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{currentLevel.hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysBalanceGame;
