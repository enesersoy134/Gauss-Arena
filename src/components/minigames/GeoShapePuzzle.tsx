import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

export interface GeoShapePuzzleProps {
  onComplete: () => void;
  onNextSubject?: () => void;
  nextSubjectName?: string;
}

interface AngleBlock {
  angle: 45 | 60 | 90 | 120;
  label: string;
  desc: string;
  color: string;
}

const ANGLE_BLOCKS: AngleBlock[] = [
  { angle: 45, label: '45° Dilim', desc: 'Dar Açı', color: '#F59E0B' },
  { angle: 60, label: '60° Dilim', desc: 'Eşkenar Açı', color: '#3B82F6' },
  { angle: 90, label: '90° Dilim', desc: 'Dik Açı', color: '#10B981' },
  { angle: 120, label: '120° Dilim', desc: 'Altıgen Açısı', color: '#A855F7' },
];

export const GeoShapePuzzle: React.FC<GeoShapePuzzleProps> = ({
  onComplete,
  onNextSubject,
  nextSubjectName,
}) => {
  // Başlangıçta hiçbir açı seçili olmaz, oyuncu kendisi seçer
  const [selectedAngle, setSelectedAngle] = useState<AngleBlock['angle'] | null>(null);
  const [solved, setSolved] = useState<{
    straight180: boolean;
    full360: boolean;
    hexagon120: boolean;
  }>({
    straight180: false,
    full360: false,
    hexagon120: false,
  });

  const [msg, setMsg] = useState<{ type: 'info' | 'error' | 'success'; text: string }>({
    type: 'info',
    text: 'Alttan bir açı dilimi seç ve yukarıdaki eksik geometrik şekle tıklayarak tamamla!',
  });

  const solvedCount = Object.values(solved).filter(Boolean).length;
  const isAllDone = solvedCount === 3;

  const handleClickShape = (
    targetKey: 'straight180' | 'full360' | 'hexagon120',
    requiredAngle: 60 | 90 | 120,
    ruleExplanation: string
  ) => {
    if (solved[targetKey]) return;

    if (selectedAngle === null) {
      setMsg({
        type: 'error',
        text: `⚠️ Önce alttan yerleştirmek istediğin bir açı dilimini seçmelisin!`,
      });
      return;
    }

    if (selectedAngle !== requiredAngle) {
      setMsg({
        type: 'error',
        text: `⚠️ ${selectedAngle}° bu boşluğa uymadı! İpucu: ${ruleExplanation}`,
      });
      return;
    }

    const nextSolved = { ...solved, [targetKey]: true };
    setSolved(nextSolved);
    // Asla otomatik sıradaki açıyı seçme - sıfırla ki oyuncu kendisi seçsin
    setSelectedAngle(null);

    const newCount = Object.values(nextSolved).filter(Boolean).length;
    if (newCount === 3) {
      setMsg({
        type: 'success',
        text: '🎉 TEBRİKLER! Doğru açı (180°), tam açı (360°) ve düzgün altıgen (120°) kusursuz tamamlandı!',
      });
      onComplete();
    } else {
      setMsg({
        type: 'success',
        text: `✅ Harika! ${requiredAngle}° dilim tam oturdu. Şimdi alttan diğer şekil için bir açı dilimi seç!`,
      });
    }
  };

  const handleReset = () => {
    setSolved({ straight180: false, full360: false, hexagon120: false });
    setSelectedAngle(null);
    setMsg({
      type: 'info',
      text: 'Bulmaca sıfırlandı. Alttan açı dilimini seçip eksik şekle tıkla!',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ÜST 3 GÖRSEL GÖSTERGE KARTI */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className={`border rounded-2xl p-3 text-center transition-all ${
            solved.straight180
              ? 'bg-blue-500/20 border-blue-400 text-blue-200'
              : 'bg-[#0F0510] border-white/10 text-[#B5CBC8]'
          }`}
        >
          <div className="text-[11px] font-mono uppercase">1. Doğru Açı (180°)</div>
          <div className="font-mono font-black text-base sm:text-xl text-white mt-0.5">
            120° + {solved.straight180 ? '60°' : '?°'} = 180°
          </div>
          <div className="text-[10px] font-mono text-blue-400">
            {solved.straight180 ? '✓ Tamamlandı' : 'Bütünler Açı'}
          </div>
        </div>

        <div
          className={`border rounded-2xl p-3 text-center transition-all ${
            solved.full360
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
              : 'bg-[#0F0510] border-white/10 text-[#B5CBC8]'
          }`}
        >
          <div className="text-[11px] font-mono uppercase">2. Tam Açı (360°)</div>
          <div className="font-mono font-black text-base sm:text-xl text-white mt-0.5">
            270° + {solved.full360 ? '90°' : '?°'} = 360°
          </div>
          <div className="text-[10px] font-mono text-emerald-400">
            {solved.full360 ? '✓ Tamamlandı' : 'Merkez Tam Açı'}
          </div>
        </div>

        <div
          className={`border rounded-2xl p-3 text-center transition-all ${
            solved.hexagon120
              ? 'bg-purple-500/20 border-purple-400 text-purple-200'
              : 'bg-[#0F0510] border-white/10 text-[#B5CBC8]'
          }`}
        >
          <div className="text-[11px] font-mono uppercase">3. Düzgün Altıgen</div>
          <div className="font-mono font-black text-base sm:text-xl text-white mt-0.5">
            İç Açı = {solved.hexagon120 ? '120°' : '?°'}
          </div>
          <div className="text-[10px] font-mono text-purple-400">
            {solved.hexagon120 ? '✓ Tamamlandı' : '(6-2)·180° / 6'}
          </div>
        </div>
      </div>

      {/* ORTA BÜYÜK GÖRSEL 3'LÜ GEOMETRİ SAHNESİ */}
      <div
        className={`rounded-3xl border-2 p-5 sm:p-6 flex flex-col items-center justify-between min-h-[275px] transition-all ${
          isAllDone
            ? 'bg-gradient-to-b from-emerald-950/50 via-[#150A16] to-[#0F0510] border-emerald-400/60'
            : 'bg-gradient-to-b from-[#1E1022] via-[#150A16] to-[#0F0510] border-purple-500/35'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* ŞEKİL 1: DOĞRU AÇI (120° + 60° = 180°) */}
          <button
            onClick={() =>
              handleClickShape(
                'straight180',
                60,
                'Doğru açı 180°’dir. 180° - 120° = 60° dilimi seçmelisin!'
              )
            }
            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-between gap-2 transition-all group ${
              solved.straight180
                ? 'border-solid border-blue-400 bg-blue-500/15'
                : 'border-dashed border-white/20 bg-black/35 hover:border-blue-400 hover:scale-[1.02]'
            }`}
          >
            <span className="text-xs font-poppins font-bold text-white">
              1. Doğru Açı (180°)
            </span>

            <svg viewBox="0 0 180 110" className="w-40 h-28">
              {/* Taban Doğrusu */}
              <line x1="15" y1="90" x2="165" y2="90" stroke="#fff" strokeWidth="3" />
              {/* Mevcut 120° Pasta Dilimi (Soldan 120 derece: 180° -> 60°) */}
              <path
                d="M 90 90 L 20 90 A 70 70 0 0 1 125 29 Z"
                fill="rgba(241,78,19,0.35)"
                stroke="#F14E13"
                strokeWidth="2.5"
              />
              <text x="58" y="65" fill="#fff" fontSize="13" fontFamily="monospace" fontWeight="bold">
                120°
              </text>

              {/* Eksik 60° Dilim (Sağ taraf: 60° -> 0°) */}
              <path
                d="M 90 90 L 125 29 A 70 70 0 0 1 160 90 Z"
                fill={solved.straight180 ? 'rgba(59,130,246,0.55)' : 'rgba(255,255,255,0.06)'}
                stroke={solved.straight180 ? '#3B82F6' : '#94A3B8'}
                strokeWidth="2.5"
                strokeDasharray={solved.straight180 ? '0' : '4 4'}
              />
              <text
                x="118"
                y="72"
                fill={solved.straight180 ? '#93C5FD' : '#FBBF24'}
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {solved.straight180 ? '60°' : '?°'}
              </text>
              <circle cx="90" cy="90" r="4" fill="#fff" />
            </svg>

            <span className="text-[11px] font-mono text-blue-300">
              {solved.straight180 ? '✓ 120° + 60° = 180°' : '+ Boş Dilime Yerleştir'}
            </span>
          </button>

          {/* ŞEKİL 2: TAM AÇI (270° + 90° = 360°) */}
          <button
            onClick={() =>
              handleClickShape(
                'full360',
                90,
                'Tam açı 360°’dir. 360° - 270° = 90° dik dilimi seçmelisin!'
              )
            }
            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-between gap-2 transition-all group ${
              solved.full360
                ? 'border-solid border-emerald-400 bg-emerald-500/15'
                : 'border-dashed border-white/20 bg-black/35 hover:border-emerald-400 hover:scale-[1.02]'
            }`}
          >
            <span className="text-xs font-poppins font-bold text-white">
              2. Tam Açı (360°)
            </span>

            <svg viewBox="0 0 180 120" className="w-40 h-28">
              {/* Mevcut 270° Daire Dilimi */}
              <path
                d="M 90 60 L 142 60 A 52 52 0 1 1 90 8 Z"
                fill="rgba(241,78,19,0.35)"
                stroke="#F14E13"
                strokeWidth="2.5"
              />
              <text x="52" y="78" fill="#fff" fontSize="13" fontFamily="monospace" fontWeight="bold">
                270°
              </text>

              {/* Eksik 90° Sağ Üst Çeyrek Dilim */}
              <path
                d="M 90 60 L 90 8 A 52 52 0 0 1 142 60 Z"
                fill={solved.full360 ? 'rgba(16,185,129,0.55)' : 'rgba(255,255,255,0.06)'}
                stroke={solved.full360 ? '#10B981' : '#94A3B8'}
                strokeWidth="2.5"
                strokeDasharray={solved.full360 ? '0' : '4 4'}
              />
              <text
                x="102"
                y="45"
                fill={solved.full360 ? '#6EE7B7' : '#FBBF24'}
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {solved.full360 ? '90°' : '?°'}
              </text>
              <circle cx="90" cy="60" r="4" fill="#fff" />
            </svg>

            <span className="text-[11px] font-mono text-emerald-300">
              {solved.full360 ? '✓ 270° + 90° = 360°' : '+ Boş Dilime Yerleştir'}
            </span>
          </button>

          {/* ŞEKİL 3: DÜZGÜN ALTIGEN KÖŞE AÇISI (120°) */}
          <button
            onClick={() =>
              handleClickShape(
                'hexagon120',
                120,
                'Düzgün altıgenin her bir iç açısı 120°’dir!'
              )
            }
            className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-between gap-2 transition-all group ${
              solved.hexagon120
                ? 'border-solid border-purple-400 bg-purple-500/15'
                : 'border-dashed border-white/20 bg-black/35 hover:border-purple-400 hover:scale-[1.02]'
            }`}
          >
            <span className="text-xs font-poppins font-bold text-white">
              3. Düzgün Altıgen Köşesi
            </span>

            <svg viewBox="0 0 180 120" className="w-40 h-28">
              {/* Altıgen Gövdesi */}
              <polygon
                points="90,10 140,35 140,85 90,110 40,85 40,35"
                fill="rgba(168,85,247,0.18)"
                stroke="#A855F7"
                strokeWidth="2.5"
              />
              {/* Alt Köşe 120° Referansı */}
              <text x="75" y="100" fill="#E9D5FF" fontSize="11" fontFamily="monospace">
                120°
              </text>

              {/* Üst Köşe Eksik 120° Dilim */}
              <polygon
                points="90,10 140,35 90,60 40,35"
                fill={solved.hexagon120 ? 'rgba(168,85,247,0.65)' : 'rgba(255,255,255,0.07)'}
                stroke={solved.hexagon120 ? '#C084FC' : '#FBBF24'}
                strokeWidth="2.5"
                strokeDasharray={solved.hexagon120 ? '0' : '4 4'}
              />
              <text
                x="76"
                y="40"
                fill={solved.hexagon120 ? '#fff' : '#FBBF24'}
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {solved.hexagon120 ? '120°' : '?°'}
              </text>
            </svg>

            <span className="text-[11px] font-mono text-purple-300">
              {solved.hexagon120 ? '✓ İç Açı = 120°' : '+ Boş Köşeye Yerleştir'}
            </span>
          </button>
        </div>

        {/* Durum İpucu Bandı */}
        <div
          className={`mt-4 px-4 py-2 rounded-xl text-xs font-medium text-center border ${
            msg.type === 'error'
              ? 'bg-red-500/20 border-red-500/40 text-red-200'
              : msg.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
              : 'bg-white/5 border-white/10 text-[#B5CBC8]'
          }`}
        >
          {msg.text}
        </div>
      </div>

      {/* ALT AÇI DİLİMİ SEÇİM BARI (Fizikteki kütle barı gibi) */}
      <div className="bg-[#0F0510] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="text-xs font-mono font-bold text-[#B5CBC8] mr-1">
            Açı Parçaları:
          </span>
          {ANGLE_BLOCKS.map((b) => {
            const isSel = selectedAngle === b.angle;
            return (
              <button
                key={b.angle}
                onClick={() => {
                  setSelectedAngle(b.angle);
                  setMsg({
                    type: 'info',
                    text: `Seçildi: ${b.label} (${b.desc}). Şimdi yukarıdaki eksik geometrik şekle tıkla!`,
                  });
                }}
                className={`px-4 py-2 rounded-xl font-mono font-bold text-xs flex items-center gap-2 border transition-all ${
                  isSel
                    ? 'scale-105 shadow-lg text-white'
                    : 'bg-white/5 border-white/15 text-[#B5CBC8] hover:text-white'
                }`}
                style={
                  isSel
                    ? {
                        backgroundColor: `${b.color}35`,
                        borderColor: '#fff',
                      }
                    : undefined
                }
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                <div className="text-left">
                  <div className="text-white">{b.label}</div>
                  <div className="text-[10px] opacity-80">{b.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAllDone && onNextSubject && (
            <button
              onClick={onNextSubject}
              className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-md shadow-emerald-500/20"
            >
              <span>
                {nextSubjectName === 'Çıkış'
                  ? 'Tüm Dersler Bitti - Çıkış'
                  : nextSubjectName
                  ? `Sonraki Çözülmemiş Ders (${nextSubjectName})`
                  : 'Sonraki Ders'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeoShapePuzzle;
