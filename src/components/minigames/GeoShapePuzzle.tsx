import React, { useState, useRef } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Sparkles, Compass } from 'lucide-react';
import soundEngine from '../../utils/soundEngine';

export interface GeoShapePuzzleProps {
  onComplete: () => void;
  onNextSubject?: () => void;
  nextSubjectName?: string;
}

interface PolygonStage {
  id: string;
  name: string;
  n: number;
  vertexLabels: string[];
  accentColor: string;
}

const POLYGON_STAGES: PolygonStage[] = [
  {
    id: 'hexagon',
    name: 'Düzgün Altıgen',
    n: 6,
    vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
    accentColor: '#A855F7',
  },
  {
    id: 'pentagon',
    name: 'Düzgün Beşgen',
    n: 5,
    vertexLabels: ['A', 'B', 'C', 'D', 'E'],
    accentColor: '#3B82F6',
  },
  {
    id: 'octagon',
    name: 'Düzgün Sekizgen',
    n: 8,
    vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    accentColor: '#10B981',
  },
];

const TRIANGLE_COLORS = [
  { fill: 'rgba(59, 130, 246, 0.34)', stroke: '#60A5FA', text: '#BFDBFE' },
  { fill: 'rgba(168, 85, 247, 0.34)', stroke: '#C084FC', text: '#E9D5FF' },
  { fill: 'rgba(16, 185, 129, 0.34)', stroke: '#34D399', text: '#A7F3D0' },
  { fill: 'rgba(245, 158, 11, 0.34)', stroke: '#FBBF24', text: '#FDE68A' },
  { fill: 'rgba(236, 72, 153, 0.34)', stroke: '#F472B6', text: '#FBCFE8' },
  { fill: 'rgba(6, 182, 212, 0.34)', stroke: '#22D3EE', text: '#A5F3FC' },
];

/**
 * Çizgi çekme & üçgen oluşumu için Web Audio ses efekti
 */
function playLineDrawSfx(stepIndex: number) {
  if (soundEngine.getMuted() || typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const baseFreq = 360 + stepIndex * 75;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.45, now + 0.16);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
    setTimeout(() => ctx.close().catch(() => {}), 300);
  } catch {
    // Web Audio desteklenmiyorsa sessiz devam et
  }
}

export const GeoShapePuzzle: React.FC<GeoShapePuzzleProps> = ({
  onComplete,
  onNextSubject,
  nextSubjectName,
}) => {
  const [stageIdx, setStageIdx] = useState<number>(0);
  const [drawnTargets, setDrawnTargets] = useState<number[]>([]);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverVertex, setHoverVertex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'info' | 'warning' | 'success';
    text: string;
  }>({
    type: 'info',
    text: 'Kütüphanenin Altıgen Cam Kubbesini inşa ediyoruz! Kubbenin çökmemesi için A köşesinden diğer köşelere çelik kirişler (köşegenler) çekerek onu sağlam üçgen kafeslere böl!',
  });

  const svgRef = useRef<SVGSVGElement | null>(null);

  const stage = POLYGON_STAGES[stageIdx];
  const n = stage.n;
  const maxDiagonals = n - 3; // Bir köşeden çizilebilen köşegen sayısı: n - 3
  const maxTriangles = n - 2; // Oluşan üçgen sayısı: n - 2

  // Çokgenin köşe koordinatlarını hesapla (Merkez: 160, 145, Yarıçap: 108)
  const cx = 160;
  const cy = 145;
  const radius = 106;

  const vertices = Array.from({ length: n }, (_, idx) => {
    const angleRad = -Math.PI / 2 + (idx * 2 * Math.PI) / n;
    return {
      idx,
      label: stage.vertexLabels[idx],
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad),
      labelX: cx + (radius + 24) * Math.cos(angleRad),
      labelY: cy + (radius + 24) * Math.sin(angleRad),
      isAnchor: idx === 0,
      isAdjacent: idx === 1 || idx === n - 1,
      isValidDiagonalTarget: idx >= 2 && idx <= n - 2,
    };
  });

  const anchor = vertices[0];

  // Şu ana kadar çizilen köşegenlerle oluşan birim üçgenleri hesapla
  // Birim üçgen k (k = 1 .. n-2), köşeleri (0, k, k+1) olan üçgendir.
  // k=1 üçgeni için 2 numaralı köşegen gerekir; k=n-2 üçgeni için n-2 numaralı köşegen gerekir;
  // aradaki k üçgeni için hem k hem k+1 köşegenlerinin çizilmiş olması gerekir.
  const formedTriangles: Array<{
    triangleOrder: number;
    v1: number;
    v2: number;
    pointsStr: string;
    centroidX: number;
    centroidY: number;
  }> = [];

  for (let k = 1; k <= n - 2; k++) {
    const needsFirstDiag = k === 1 ? true : drawnTargets.includes(k);
    const needsSecondDiag = k === n - 2 ? true : drawnTargets.includes(k + 1);
    if (needsFirstDiag && needsSecondDiag) {
      const p0 = vertices[0];
      const p1 = vertices[k];
      const p2 = vertices[k + 1];
      formedTriangles.push({
        triangleOrder: formedTriangles.length + 1,
        v1: k,
        v2: k + 1,
        pointsStr: `${p0.x.toFixed(1)},${p0.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`,
        centroidX: (p0.x + p1.x + p2.x) / 3,
        centroidY: (p0.y + p1.y + p2.y) / 3,
      });
    }
  }

  const isStageComplete = drawnTargets.length === maxDiagonals;

  const handleSelectStage = (idx: number) => {
    const nextStage = POLYGON_STAGES[idx];
    setStageIdx(idx);
    setDrawnTargets([]);
    setDragPos(null);
    setFeedback({
      type: 'info',
      text: `${nextStage.name} (${nextStage.n} kenar) kubbe planı açıldı! A köşesinden komşu olmayan köşelere çelik kiriş çekerek (n - 2) = ${nextStage.n - 2} adet üçgen kafes oluştur!`,
    });
  };

  const attemptConnectVertex = (targetIdx: number) => {
    if (targetIdx === 0) return;

    const targetV = vertices[targetIdx];
    if (targetV.isAdjacent) {
      soundEngine.playWrong();
      setFeedback({
        type: 'warning',
        text: `🙅‍♂️ Başmimar Kaan: "Usta dikkat! ${targetV.label} köşesi A'ya komşudur; [A${targetV.label}] zaten dış duvardır! İç köşegen kiriş için komşu olmayan (n - 3 = ${maxDiagonals}) köşeye çizgi çekmelisin!"`,
      });
      return;
    }

    if (drawnTargets.includes(targetIdx)) {
      setFeedback({
        type: 'info',
        text: `[A${targetV.label}] çelik kirişi zaten yerleştirildi. Kalan sarı hedef köşelere çizgi çek!`,
      });
      return;
    }

    const nextDrawn = [...drawnTargets, targetIdx].sort((a, b) => a - b);
    setDrawnTargets(nextDrawn);
    playLineDrawSfx(nextDrawn.length);

    if (nextDrawn.length === maxDiagonals) {
      setTimeout(() => soundEngine.playCorrect(), 220);
      if (!completedStages.includes(stage.id)) {
        setCompletedStages((prev) => [...prev, stage.id]);
      }
      setFeedback({
        type: 'success',
        text: `👑 Başmimar Kaan: "Ellerine sağlık! ${stage.name} kubbede (n=${n}) A köşesinden n - 3 = ${maxDiagonals} kiriş çektin ve kubbeyi n - 2 = ${maxTriangles} sağlam üçgene ayırdın! İç açılar toplamı: ${maxTriangles} × 180° = ${maxTriangles * 180}°"`,
      });
      onComplete();
    } else {
      const remaining = maxDiagonals - nextDrawn.length;
      setFeedback({
        type: 'info',
        text: `✨ Başmimar Kaan: "Harika! [A${targetV.label}] köşegen kirişi yerine oturdu (${nextDrawn.length}/${maxDiagonals}). Kubbeyi tamamlamak için ${remaining} kiriş daha çek!"`,
      });
    }
  };

  const getSvgCoords = (clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 320 / rect.width;
    const scaleY = 290 / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDownAnchor = (e: React.PointerEvent) => {
    e.stopPropagation();
    const coords = getSvgCoords(e.clientX, e.clientY);
    if (coords) {
      setDragPos(coords);
    }
  };

  const handlePointerMoveSvg = (e: React.PointerEvent) => {
    if (!dragPos) return;
    const coords = getSvgCoords(e.clientX, e.clientY);
    if (!coords) return;
    setDragPos(coords);

    // En yakın köşeyi bul (yakalama yarıçapı: 28px)
    let nearest: number | null = null;
    let minDist = 28;
    for (const v of vertices) {
      if (v.idx === 0) continue;
      const dist = Math.hypot(v.x - coords.x, v.y - coords.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = v.idx;
      }
    }
    setHoverVertex(nearest);
  };

  const handlePointerUpSvg = () => {
    if (dragPos && hoverVertex !== null) {
      attemptConnectVertex(hoverVertex);
    }
    setDragPos(null);
    setHoverVertex(null);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setDrawnTargets([]);
    setDragPos(null);
    setFeedback({
      type: 'info',
      text: `A köşesinden diğer köşelere çizgi çekerek ${stage.name}i üçgenlere ayır!`,
    });
  };

  const polygonPointsStr = vertices.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5">
      {/* ÜST SEKMELER: Çokgen Seçici (Başlangıç: Düzgün Altıgen) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {POLYGON_STAGES.map((stg, idx) => {
          const isCurrent = idx === stageIdx;
          const isDone = completedStages.includes(stg.id);
          return (
            <button
              key={stg.id}
              type="button"
              onClick={() => handleSelectStage(idx)}
              className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center justify-between gap-1.5 ${
                isCurrent
                  ? 'bg-purple-500/20 border-purple-400 text-white shadow-md shadow-purple-500/15'
                  : isDone
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  : 'bg-[#0F0510] border-white/10 text-[#B5CBC8] hover:border-white/25 hover:text-white'
              }`}
            >
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] font-mono uppercase opacity-80">
                  n = {stg.n} Kenarlı
                </div>
                <div className="font-poppins font-black text-xs sm:text-sm text-white truncate mt-0.5">
                  {stg.name}{' '}
                  <span className="font-mono font-bold text-[11px] sm:text-xs text-purple-300">
                    ({stg.n - 2} Üçgen)
                  </span>
                </div>
              </div>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* =====================================================================
       * VURGULU GÖREV SENARYOSU & BAŞMİMAR BRİFİNGİ (KUBBE İNŞAATI)
       * Ekranda anında fark edilecek, yüksek kontrastlı ve neon mor/amber vurgulu kart
       * ===================================================================== */}
      <div
        className={`rounded-xl sm:rounded-2xl border-2 p-2.5 sm:p-3 transition-all relative overflow-hidden shadow-lg ${
          feedback.type === 'warning'
            ? 'bg-gradient-to-r from-amber-950/80 via-[#1C0F22] to-orange-950/70 border-amber-400 ring-1 ring-amber-400/40 shadow-amber-500/20'
            : feedback.type === 'success'
            ? 'bg-gradient-to-r from-emerald-950/80 via-[#1C0F22] to-[#120815] border-emerald-400 ring-1 ring-emerald-400/40 shadow-emerald-500/20'
            : 'bg-gradient-to-r from-purple-950/80 via-[#1A0E1C] to-[#120815] border-purple-500/80 ring-1 ring-purple-400/40 shadow-purple-500/20'
        }`}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            {/* Karakter Avatarı & Canlı Halka */}
            <div className="relative shrink-0">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center text-2xl shadow-md transition-transform duration-300 ${
                  feedback.type === 'warning'
                    ? 'border-amber-400 bg-amber-500/25 animate-bounce'
                    : feedback.type === 'success'
                    ? 'border-emerald-400 bg-emerald-500/25 scale-105'
                    : 'border-purple-400 bg-purple-500/20'
                }`}
              >
                {feedback.type === 'warning'
                  ? '🙅‍♂️'
                  : feedback.type === 'success'
                  ? '👑'
                  : drawnTargets.length > 0
                  ? '✨'
                  : '🏛️'}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-500 border border-black text-[8px] font-bold text-white items-center justify-center">📐</span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-poppins font-black text-[10px] tracking-wide uppercase shadow-sm flex items-center gap-1">
                  🏛️ MİMARİ BRİFİNG
                </span>
                <span className="text-[10px] font-mono font-bold text-purple-200 bg-purple-500/25 px-2 py-0.5 rounded-md border border-purple-400/50">
                  {stage.name} (n = {n})
                </span>
                <span className="text-[10px] font-mono text-white/90 bg-white/10 px-1.5 py-0.5 rounded-md border border-white/10">
                  Formül: <strong className="text-amber-300 font-bold">n - 3 = {maxDiagonals} Kiriş</strong> ➔ <strong className="text-emerald-300 font-bold">n - 2 = {maxTriangles} Üçgen</strong>
                </span>
              </div>

              <div className="text-xs text-white font-medium leading-tight">
                <strong className="text-purple-300 font-bold">Başmimar Kaan: </strong>
                <span>&ldquo;{feedback.text}&rdquo;</span>
              </div>
            </div>
          </div>

          {/* Aksiyon Hedef Rozeti */}
          <div className="shrink-0 bg-black/50 border border-purple-500/40 rounded-xl px-3 py-1.5 sm:py-2 flex flex-col items-center sm:items-end justify-center self-stretch sm:self-auto min-w-[170px] shadow-inner">
            <div className="text-[9px] font-mono uppercase text-purple-300 font-black flex items-center gap-1">
              <span>🎯 NE YAPMALISIN?</span>
            </div>
            <div className="text-[11px] font-mono font-black text-white text-center sm:text-right mt-0.5">
              {isStageComplete ? (
                <span className="text-emerald-400 font-bold">✓ Kubbe Çelik Kafesi Tam!</span>
              ) : (
                <span className="text-amber-200">{drawnTargets.length} / {maxDiagonals} Kiriş Çekildi</span>
              )}
            </div>
            <div className="text-[9px] text-zinc-300 text-center sm:text-right mt-0.5 font-mono">
              Şekildeki A&apos;dan hedeflere tıkla/çiz
            </div>
          </div>
        </div>
      </div>

      {/* ORTA BÖLÜM: SOLDA İNTERAKTİF ÇOKGEN ÇİZİM ALANI, SAĞDA VURGULU FORMÜL KARTI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3">
        {/* SOL (7 Sütun): İnteraktif Köşegen Çizim Tuvali */}
        <div
          className={`lg:col-span-7 rounded-2xl sm:rounded-3xl border-2 p-2.5 sm:p-3 flex flex-col items-center justify-between transition-all ${
            isStageComplete
              ? 'bg-gradient-to-b from-emerald-950/50 via-[#150A16] to-[#0F0510] border-emerald-400/60'
              : 'bg-gradient-to-b from-[#1E1022] via-[#150A16] to-[#0F0510] border-purple-500/40'
          }`}
        >
          <div className="flex items-center justify-between w-full text-[11px] font-mono px-1">
            <span className="text-purple-300 font-bold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>A&apos;dan sarı hedef köşelere tıkla veya sürükle</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold text-[10px]">
              {formedTriangles.length} / {maxTriangles} Üçgen
            </span>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 320 290"
            onPointerMove={handlePointerMoveSvg}
            onPointerUp={handlePointerUpSvg}
            onPointerLeave={handlePointerUpSvg}
            className="w-full max-w-[290px] sm:max-w-[310px] h-[220px] sm:h-[240px] select-none touch-none overflow-visible my-1"
          >
            {/* Çokgen Ana Gövdesi */}
            <polygon
              points={polygonPointsStr}
              fill="rgba(168, 85, 247, 0.08)"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Oluşan Üçgenlerin Renkli Dolguları ve Numaraları */}
            {formedTriangles.map((tri, idx) => {
              const palette = TRIANGLE_COLORS[idx % TRIANGLE_COLORS.length];
              return (
                <g key={`${tri.v1}-${tri.v2}`} className="transition-all duration-500">
                  <polygon
                    points={tri.pointsStr}
                    fill={palette.fill}
                    stroke={palette.stroke}
                    strokeWidth="1.5"
                  />
                  <text
                    x={tri.centroidX}
                    y={tri.centroidY - 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {tri.triangleOrder}. Üçgen
                  </text>
                  <text
                    x={tri.centroidX}
                    y={tri.centroidY + 10}
                    textAnchor="middle"
                    fill={palette.text}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    180°
                  </text>
                </g>
              );
            })}

            {/* Henüz Çizilmemiş Köşegenler İçin Hafif Kılavuz İzleri */}
            {vertices
              .filter((v) => v.isValidDiagonalTarget && !drawnTargets.includes(v.idx))
              .map((v) => (
                <line
                  key={`guide-${v.idx}`}
                  x1={anchor.x}
                  y1={anchor.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              ))}

            {/* Çizilmiş Köşegen Çizgileri */}
            {drawnTargets.map((targetIdx) => {
              const targetV = vertices[targetIdx];
              return (
                <g key={`diag-${targetIdx}`}>
                  <line
                    x1={anchor.x}
                    y1={anchor.y}
                    x2={targetV.x}
                    y2={targetV.y}
                    stroke="#FBBF24"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* Kullanıcı A Köşesinden Çizgi Çekerken Canlı Lazer Çizgisi */}
            {dragPos && (
              <line
                x1={anchor.x}
                y1={anchor.y}
                x2={dragPos.x}
                y2={dragPos.y}
                stroke="#38BDF8"
                strokeWidth="3"
                strokeDasharray="5 3"
                strokeLinecap="round"
              />
            )}

            {/* Çokgen Köşe Noktaları */}
            {vertices.map((v) => {
              const isDrawn = drawnTargets.includes(v.idx);
              const isHovered = hoverVertex === v.idx;

              const circleFill = v.isAnchor
                ? '#F14E13'
                : isDrawn
                ? '#10B981'
                : v.isValidDiagonalTarget
                ? '#FBBF24'
                : '#475569';

              return (
                <g
                  key={v.idx}
                  onPointerDown={v.isAnchor ? handlePointerDownAnchor : undefined}
                  onClick={() => !v.isAnchor && attemptConnectVertex(v.idx)}
                  className="cursor-pointer group"
                >
                  {/* Başlangıç A köşesi veya hedef köşeler için halka */}
                  {(v.isAnchor || (v.isValidDiagonalTarget && !isDrawn)) && (
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r={v.isAnchor ? 15 : 13}
                      fill={v.isAnchor ? 'rgba(241, 78, 19, 0.28)' : 'rgba(251, 191, 36, 0.22)'}
                      className="animate-ping"
                      style={{ animationDuration: v.isAnchor ? '1.5s' : '2.2s' }}
                    />
                  )}

                  {/* Tıklama Kolaylığı İçin Görünmez Geniş Hit Alanı */}
                  <circle cx={v.x} cy={v.y} r="22" fill="transparent" />

                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={v.isAnchor ? 10 : isHovered ? 10 : 8}
                    fill={circleFill}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="transition-transform duration-200"
                  />

                  {/* Köşe Harf Etiketi */}
                  <text
                    x={v.labelX}
                    y={v.labelY + 4}
                    textAnchor="middle"
                    fill={v.isAnchor ? '#FDBA74' : isDrawn ? '#6EE7B7' : '#FFFFFF'}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {v.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* SAĞ (5 Sütun): VURGULANAN GEOMETRİ FORMÜL KARTI */}
        <div className="lg:col-span-5 bg-[#0F0510] border-2 border-amber-500/40 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 flex flex-col justify-between gap-2 shadow-xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-amber-300">
                  TEMEL ÇOKGEN FORMÜLÜ
                </span>
                <h3 className="font-poppins font-black text-sm sm:text-base text-white">
                  Köşegen & Üçgen İlişkisi
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 border border-purple-400/50 font-mono font-black text-xs text-purple-200">
                n = {n}
              </span>
            </div>

            {/* 1. FORMÜL: BİR KÖŞEDEN ÇİZİLEN KÖŞEGEN SAYISI (n - 3) */}
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-2.5">
              <div className="flex items-center justify-between text-[11px] font-poppins font-semibold text-[#B5CBC8]">
                <span>1 Köşeden Çizilen Köşegen:</span>
                <span className="font-mono font-black text-amber-300 text-xs">n - 3</span>
              </div>
              <div className="font-mono font-black text-sm text-white mt-0.5">
                {n} - 3 ={' '}
                <span className="text-amber-400 underline decoration-amber-400/60">
                  {maxDiagonals} Köşegen
                </span>
                <span className="text-[10px] text-amber-300 font-normal ml-2">
                  ({drawnTargets.length}/{maxDiagonals} Çizildi)
                </span>
              </div>
            </div>

            {/* 2. ANA VURGULU FORMÜL: OLUŞAN ÜÇGEN SAYISI (n - 2) */}
            <div
              className={`rounded-xl border-2 p-2.5 transition-all ${
                isStageComplete
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-500/15'
                  : 'bg-gradient-to-br from-amber-500/20 via-purple-500/15 to-transparent border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-poppins font-black uppercase tracking-wide text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Oluşan Üçgen Sayısı:</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-mono font-black text-xs">
                  n - 2
                </span>
              </div>

              <div className="font-mono font-black text-base sm:text-lg text-white mt-0.5">
                {n} - 2 ={' '}
                <span className="text-emerald-300">
                  {maxTriangles} Adet Üçgen!
                </span>
              </div>
            </div>

            {/* 3. FORMÜL: İÇ AÇILAR TOPLAMI (n - 2) × 180° */}
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-2.5">
              <div className="flex items-center justify-between text-[11px] font-poppins font-semibold text-[#B5CBC8]">
                <span>Çokgenin İç Açılar Toplamı:</span>
                <span className="font-mono font-black text-cyan-300 text-xs">(n - 2) × 180°</span>
              </div>
              <div className="font-mono font-black text-sm text-white mt-0.5">
                {maxTriangles} Üçgen × 180° ={' '}
                <span className="text-cyan-300">{maxTriangles * 180}°</span>
              </div>
            </div>
          </div>

          {/* Alt Aksiyon Butonları */}
          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Çizgileri Temizle</span>
            </button>

            {isStageComplete && onNextSubject && (
              <button
                type="button"
                onClick={onNextSubject}
                className="btn-primary !py-1.5 !px-3 text-xs font-bold flex items-center gap-1 !bg-emerald-600 hover:!bg-emerald-500 shadow-md shadow-emerald-500/20"
              >
                <span>
                  {nextSubjectName === 'Çıkış'
                    ? 'Tamamla & Çıkış'
                    : nextSubjectName
                    ? `Sonraki (${nextSubjectName})`
                    : 'Sonraki Ders'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoShapePuzzle;
