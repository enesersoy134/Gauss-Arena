import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

export interface BioCellGameProps {
  onComplete: () => void;
  onNextSubject?: () => void;
}

type OrganelleSvgType =
  | 'nucleus'
  | 'mitochondria'
  | 'centrosome'
  | 'golgi'
  | 'chloroplast'
  | 'vacuole'
  | 'lysosome'
  | 'flagellum';

interface CellSlotOrganelle {
  id: string;
  name: string;
  roleShort: string;
  svgType: OrganelleSvgType;
  color: string;
  pinColor: string;
  slotLabel: string;
  slotHint: string;
  positionClass: string;
}

interface TrayOrganelleOption {
  id: string;
  name: string;
  roleShort: string;
  color: string;
  pinColor: string;
  isValidForCell: boolean;
  invalidCellReason?: string;
}

interface CellStage {
  stageNumber: 1 | 2;
  title: string;
  subtitle: string;
  cellType: 'animal' | 'plant';
  activeAnimationText: string;
  slots: CellSlotOrganelle[];
  trayOptions: TrayOrganelleOption[];
}

const CELL_STAGES: CellStage[] = [
  {
    stageNumber: 1,
    title: '1. Bölüm: Hayvan Hücresi',
    subtitle: '7 Organel Arasından Hayvan Hücresine Ait 4 Doğru Organeli Seçip İğnele',
    cellType: 'animal',
    activeAnimationText:
      '⚡ HAYVAN HÜCRESİ ÇALIŞIYOR! Mitokondri ATP pompalıyor, Çekirdek yönetiyor, Sentrozom ve Golgi aktif!',
    slots: [
      {
        id: 'anim-nucleus',
        name: 'Çekirdek',
        roleShort: 'DNA & Yönetim',
        svgType: 'nucleus',
        color: '#A855F7',
        pinColor: '#EF4444',
        slotLabel: 'Yönetim Yuvası',
        slotHint: 'DNA ve genetik kontrol merkezi',
        positionClass: 'top-6 left-6 sm:left-10',
      },
      {
        id: 'anim-mito',
        name: 'Mitokondri',
        roleShort: 'ATP Enerji Santrali',
        svgType: 'mitochondria',
        color: '#F97316',
        pinColor: '#F59E0B',
        slotLabel: 'Enerji Yuvası',
        slotHint: 'Oksijenli solunumla ATP üretir',
        positionClass: 'top-6 right-6 sm:right-10',
      },
      {
        id: 'anim-centro',
        name: 'Sentrozom',
        roleShort: 'İğ İpliği & Bölünme',
        svgType: 'centrosome',
        color: '#3B82F6',
        pinColor: '#38BDF8',
        slotLabel: 'Bölünme Yuvası',
        slotHint: 'Hayvan hücresinde iğ ipliği üretir',
        positionClass: 'bottom-6 left-6 sm:left-10',
      },
      {
        id: 'anim-golgi',
        name: 'Golgi Cisimciği',
        roleShort: 'Salgı & Paketleme',
        svgType: 'golgi',
        color: '#EC4899',
        pinColor: '#10B981',
        slotLabel: 'Salgı Yuvası',
        slotHint: 'Proteinleri paketler ve salgılar',
        positionClass: 'bottom-6 right-6 sm:right-10',
      },
    ],
    // 7 Organel Seçeneği (Karışık sırada: 4 doğru + 3 çeldirici)
    trayOptions: [
      {
        id: 'dist-chloro',
        name: 'Kloroplast',
        roleShort: 'Fotosentez',
        color: '#10B981',
        pinColor: '#10B981',
        isValidForCell: false,
        invalidCellReason:
          '❌ BİYOLOJİ UYARISI: Kloroplast sadece Bitki Hücrelerinde (ve alglerde) bulunur! Hayvan hücreleri fotosentez yapamaz.',
      },
      {
        id: 'anim-nucleus',
        name: 'Çekirdek',
        roleShort: 'DNA & Yönetim',
        color: '#A855F7',
        pinColor: '#EF4444',
        isValidForCell: true,
      },
      {
        id: 'dist-vacuole',
        name: 'Merkezi Büyük Koful',
        roleShort: 'Turgor Kesesi',
        color: '#06B6D4',
        pinColor: '#06B6D4',
        isValidForCell: false,
        invalidCellReason:
          '❌ BİYOLOJİ UYARISI: Merkezi Büyük Koful bitki hücrelerine özgüdür! Hayvan hücrelerinde kofullar küçük ve çok sayıdadır.',
      },
      {
        id: 'anim-mito',
        name: 'Mitokondri',
        roleShort: 'ATP Santrali',
        color: '#F97316',
        pinColor: '#F59E0B',
        isValidForCell: true,
      },
      {
        id: 'anim-centro',
        name: 'Sentrozom',
        roleShort: 'Sentriyol Çifti',
        color: '#3B82F6',
        pinColor: '#38BDF8',
        isValidForCell: true,
      },
      {
        id: 'dist-cellwall',
        name: 'Selüloz Çeper',
        roleShort: 'Sert Dış Duvar',
        color: '#84CC16',
        pinColor: '#84CC16',
        isValidForCell: false,
        invalidCellReason:
          '❌ BİYOLOJİ UYARISI: Hayvan hücrelerinde Selüloz Hücre Çeperi (Duvarı) bulunmaz; sadece esnek hücre zarı vardır!',
      },
      {
        id: 'anim-golgi',
        name: 'Golgi Cisimciği',
        roleShort: 'Salgı & Paketleme',
        color: '#EC4899',
        pinColor: '#10B981',
        isValidForCell: true,
      },
    ],
  },
  {
    stageNumber: 2,
    title: '2. Bölüm: Bitki Hücresi',
    subtitle: '7 Organel Arasından Bitki Hücresine Ait 4 Doğru Organeli Seçip İğnele',
    cellType: 'plant',
    activeAnimationText:
      '🌿 BİTKİ HÜCRESİ ÇALIŞIYOR! Kloroplast ışıkla fotosentez yapıyor, Koful turgor sağlıyor, ATP üretiliyor!',
    slots: [
      {
        id: 'plant-chloro',
        name: 'Kloroplast',
        roleShort: 'Fotosentez (Besin & O₂)',
        svgType: 'chloroplast',
        color: '#10B981',
        pinColor: '#EF4444',
        slotLabel: 'Fotosentez Yuvası',
        slotHint: 'Güneş ışığıyla besin ve O₂ üretir',
        positionClass: 'top-6 left-6 sm:left-10',
      },
      {
        id: 'plant-vacuole',
        name: 'Merkezi Koful',
        roleShort: 'Turgor & Su Deposu',
        svgType: 'vacuole',
        color: '#06B6D4',
        pinColor: '#3B82F6',
        slotLabel: 'Turgor Yuvası',
        slotHint: 'Bitki hücresine özgü büyük su kesesi',
        positionClass: 'top-6 right-6 sm:right-10',
      },
      {
        id: 'plant-nucleus',
        name: 'Çekirdek',
        roleShort: 'DNA & Yönetim',
        svgType: 'nucleus',
        color: '#A855F7',
        pinColor: '#F59E0B',
        slotLabel: 'Yönetim Yuvası',
        slotHint: 'DNA ve genetik kontrol merkezi',
        positionClass: 'bottom-6 left-6 sm:left-10',
      },
      {
        id: 'plant-mito',
        name: 'Mitokondri',
        roleShort: 'ATP Enerji Santrali',
        svgType: 'mitochondria',
        color: '#F97316',
        pinColor: '#EC4899',
        slotLabel: 'Enerji Yuvası',
        slotHint: 'Hücresel solunumla ATP üretir',
        positionClass: 'bottom-6 right-6 sm:right-10',
      },
    ],
    // 7 Organel Seçeneği (Karışık sırada: 4 doğru + 3 çeldirici)
    trayOptions: [
      {
        id: 'dist-plant-centro',
        name: 'Sentrozom',
        roleShort: 'Sentriyol Çifti',
        color: '#3B82F6',
        pinColor: '#38BDF8',
        isValidForCell: false,
        invalidCellReason:
          '❌ BİYOLOJİ UYARISI: Gelişmiş Bitki Hücrelerinde Sentrozom BULUNMAZ! İğ iplikleri sitoplazmadaki mikrotübül proteinleriyle oluşturulur.',
      },
      {
        id: 'plant-chloro',
        name: 'Kloroplast',
        roleShort: 'Fotosentez',
        color: '#10B981',
        pinColor: '#EF4444',
        isValidForCell: true,
      },
      {
        id: 'dist-plant-lyso',
        name: 'Lizozom',
        roleShort: 'Sindirim Kesesi',
        color: '#F43F5E',
        pinColor: '#F43F5E',
        isValidForCell: false,
        invalidCellReason:
          '❌ BİYOLOJİ UYARISI: Gelişmiş bitki hücrelerinde Lizozom bulunmaz ve hücre çeperi olduğu için fagositoz yapamazlar!',
      },
      {
        id: 'plant-vacuole',
        name: 'Merkezi Koful',
        roleShort: 'Turgor & Su Deposu',
        color: '#06B6D4',
        pinColor: '#3B82F6',
        isValidForCell: true,
      },
      {
        id: 'plant-nucleus',
        name: 'Çekirdek',
        roleShort: 'DNA & Yönetim',
        color: '#A855F7',
        pinColor: '#F59E0B',
        isValidForCell: true,
      },
      {
        id: 'dist-plant-flag',
        name: 'Kamçı (Flagellum)',
        roleShort: 'Aktif Hareket',
        color: '#EAB308',
        pinColor: '#EAB308',
        isValidForCell: false,
        invalidCellReason:
          '❌ BİYOLOJİ UYARISI: Çeperli gelişmiş bitki hücrelerinde aktif hareket sağlayan Kamçı (Flagellum) bulunmaz!',
      },
      {
        id: 'plant-mito',
        name: 'Mitokondri',
        roleShort: 'ATP Santrali',
        color: '#F97316',
        pinColor: '#EC4899',
        isValidForCell: true,
      },
    ],
  },
];

/**
 * Gerçekçi Organel SVG Çizimi + Üzerine Saplanmış Toplu İğne (Pin) Görseli
 */
const PinnedOrganelleIllustration: React.FC<{
  svgType: OrganelleSvgType;
  pinColor: string;
  isWorking: boolean;
}> = ({ svgType, pinColor, isWorking }) => {
  return (
    <div
      className={`relative w-16 h-16 flex items-center justify-center ${
        isWorking ? 'animate-bounce' : ''
      }`}
    >
      {/* ÜSTTEN SAPLANMIŞ TOPLU İĞNE (RAPTİYE / DİSEKSİYON İĞNESİ) */}
      <svg
        viewBox="0 0 40 40"
        className="w-8 h-8 absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 drop-shadow-md pointer-events-none"
      >
        <ellipse cx="20" cy="34" rx="5" ry="2" fill="rgba(0,0,0,0.45)" />
        <line
          x1="20"
          y1="14"
          x2="20"
          y2="34"
          stroke="#E2E8F0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="10" r="7" fill={pinColor} stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="17.5" cy="7.5" r="2.2" fill="rgba(255,255,255,0.75)" />
      </svg>

      {/* ORGANELİN KENDİ GÖRSEL ÇİZİMİ */}
      <svg viewBox="0 0 70 70" className="w-14 h-14 drop-shadow-lg">
        {svgType === 'nucleus' && (
          <g>
            <circle
              cx="35"
              cy="38"
              r="24"
              fill="#7E22CE"
              stroke="#E9D5FF"
              strokeWidth="2.5"
              strokeDasharray="5 2"
            />
            <circle cx="35" cy="38" r="10" fill="#C084FC" />
            <path
              d="M22,30 Q35,20 48,32 M24,48 Q36,55 47,44"
              stroke="#F3E8FF"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}

        {svgType === 'mitochondria' && (
          <g>
            <rect
              x="10"
              y="20"
              width="50"
              height="32"
              rx="16"
              fill="#EA580C"
              stroke="#FED7AA"
              strokeWidth="2.5"
            />
            <path
              d="M 16 36 L 23 26 L 29 46 L 36 26 L 43 46 L 49 26 L 54 36"
              fill="none"
              stroke="#FFEDD5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {svgType === 'centrosome' && (
          <g>
            <line
              x1="35"
              y1="14"
              x2="35"
              y2="60"
              stroke="#93C5FD"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <line
              x1="12"
              y1="38"
              x2="58"
              y2="38"
              stroke="#93C5FD"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <rect
              x="20"
              y="24"
              width="14"
              height="26"
              rx="4"
              fill="#2563EB"
              stroke="#BFDBFE"
              strokeWidth="2"
            />
            <rect
              x="30"
              y="32"
              width="24"
              height="14"
              rx="4"
              fill="#3B82F6"
              stroke="#BFDBFE"
              strokeWidth="2"
            />
          </g>
        )}

        {svgType === 'golgi' && (
          <g>
            <path
              d="M16,26 Q35,20 54,26"
              stroke="#F472B6"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M14,36 Q35,30 56,36"
              stroke="#EC4899"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M18,46 Q35,40 52,46"
              stroke="#DB2777"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="14" cy="52" r="4" fill="#FBCFE8" />
            <circle cx="55" cy="24" r="3.5" fill="#FBCFE8" />
          </g>
        )}

        {svgType === 'chloroplast' && (
          <g>
            <rect
              x="10"
              y="20"
              width="50"
              height="32"
              rx="16"
              fill="#059669"
              stroke="#A7F3D0"
              strokeWidth="2.5"
            />
            <ellipse cx="25" cy="30" rx="6" ry="3" fill="#34D399" />
            <ellipse cx="25" cy="36" rx="6" ry="3" fill="#10B981" />
            <ellipse cx="25" cy="42" rx="6" ry="3" fill="#34D399" />
            <ellipse cx="44" cy="31" rx="6" ry="3" fill="#34D399" />
            <ellipse cx="44" cy="37" rx="6" ry="3" fill="#10B981" />
            <ellipse cx="44" cy="43" rx="6" ry="3" fill="#34D399" />
            <line x1="31" y1="36" x2="38" y2="37" stroke="#A7F3D0" strokeWidth="2" />
          </g>
        )}

        {svgType === 'vacuole' && (
          <g>
            <path
              d="M16,28 Q20,16 38,18 Q56,20 54,38 Q52,56 34,54 Q14,52 16,28 Z"
              fill="rgba(6,182,212,0.75)"
              stroke="#CFFAFE"
              strokeWidth="2.5"
            />
            <path
              d="M24,32 Q34,26 44,32"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export const BioCellGame: React.FC<BioCellGameProps> = ({ onComplete, onNextSubject }) => {
  const [stageIdx, setStageIdx] = useState<number>(0);
  const currentStage = CELL_STAGES[stageIdx];

  // Kullanıcı kendisi seçene kadar hiçbir organel seçili başlamaz
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [pinnedByStage, setPinnedByStage] = useState<Record<number, string[]>>({
    0: [],
    1: [],
  });
  const [statusMsg, setStatusMsg] = useState<{
    type: 'info' | 'error' | 'success';
    text: string;
  }>({
    type: 'info',
    text: 'Alttaki tepsiden bir organel seç, ardından hücre üzerindeki ilgili iğne yuvasına tıkla!',
  });

  const currentPinnedIds = pinnedByStage[stageIdx] || [];
  const isCurrentCellWorking = currentPinnedIds.length === currentStage.slots.length;
  const areAllStagesDone =
    (pinnedByStage[0] || []).length === CELL_STAGES[0].slots.length &&
    (pinnedByStage[1] || []).length === CELL_STAGES[1].slots.length;

  const switchStage = (newIdx: number) => {
    setStageIdx(newIdx);
    setSelectedOrgId(null);
    setStatusMsg({
      type: 'info',
      text: `${CELL_STAGES[newIdx].title}: Alttaki 7 organel arasından birini seç, ardından hücre üzerindeki doğru yuvaya tıkla!`,
    });
  };

  const handlePinSlotClick = (slotOrg: CellSlotOrganelle) => {
    if (currentPinnedIds.includes(slotOrg.id)) return;

    if (!selectedOrgId) {
      setStatusMsg({
        type: 'error',
        text: `⚠️ Önce alttaki tepsiden bir organel seçmelisin! (Hedef: "${slotOrg.slotLabel}" - ${slotOrg.slotHint})`,
      });
      return;
    }

    const chosenOption = currentStage.trayOptions.find((o) => o.id === selectedOrgId);
    if (!chosenOption) return;

    // 1. Bu hücre tipinde hiç bulunmayan çeldirici organel mi?
    if (!chosenOption.isValidForCell) {
      setStatusMsg({
        type: 'error',
        text:
          chosenOption.invalidCellReason ||
          'Bu organel bu hücre tipinde bulunmaz!',
      });
      return;
    }

    // 2. Hücreye ait ama yanlış yuvaya mı tıklandı?
    if (chosenOption.id !== slotOrg.id) {
      setStatusMsg({
        type: 'error',
        text: `⚠️ Yanlış Yuva! Burası "${slotOrg.slotLabel}" (${slotOrg.slotHint}). Seçtiğin "${chosenOption.name}" (${chosenOption.roleShort}) için diğer iğne yuvasını dene!`,
      });
      return;
    }

    // 3. Doğru organel ve doğru yuva!
    const nextPinned = [...currentPinnedIds, slotOrg.id];
    const nextMap = { ...pinnedByStage, [stageIdx]: nextPinned };
    setPinnedByStage(nextMap);
    // Asla otomatik sıradaki organeli seçme - öğrenci kendi seçsin
    setSelectedOrgId(null);

    if (nextPinned.length === currentStage.slots.length) {
      setStatusMsg({
        type: 'success',
        text: currentStage.activeAnimationText,
      });
      onComplete();
    } else {
      setStatusMsg({
        type: 'success',
        text: `📍 ${slotOrg.name} hücreye iğnelendi! (${nextPinned.length}/4 tamamlandı). Şimdi sıradaki organeli tepsiden seç!`,
      });
    }
  };

  const handleReset = () => {
    setPinnedByStage((prev) => ({ ...prev, [stageIdx]: [] }));
    setSelectedOrgId(null);
    setStatusMsg({
      type: 'info',
      text: 'Hücre üzerindeki iğneler çıkarıldı. Tepsiden bir organel seçip doğru yuvaya iğnele!',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ÜST BÖLÜM SEÇİCİ: 1. HAYVAN HÜCRESİ / 2. BİTKİ HÜCRESİ */}
      <div className="grid grid-cols-2 gap-3">
        {CELL_STAGES.map((stg, idx) => {
          const isCurrent = idx === stageIdx;
          const pinnedCount = (pinnedByStage[idx] || []).length;
          const isDone = pinnedCount === stg.slots.length;

          return (
            <button
              key={stg.stageNumber}
              onClick={() => switchStage(idx)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                isCurrent
                  ? stg.cellType === 'animal'
                    ? 'bg-pink-500/20 border-pink-400 text-white shadow-md'
                    : 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                  : isDone
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-[#0F0510] border-white/10 text-[#B5CBC8] hover:border-white/25 hover:text-white'
              }`}
            >
              <div>
                <div className="text-[10px] font-mono uppercase opacity-80">
                  {stg.cellType === 'animal'
                    ? '🔴 Yuvarlak / Esnek Zarlı'
                    : '🟢 Köşeli / Selüloz Çeperli'}
                </div>
                <div className="font-poppins font-black text-xs sm:text-sm text-white mt-0.5">
                  {stg.title} ({pinnedCount}/4 İğnelendi)
                </div>
              </div>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* ORTA BÜYÜK GÖRSEL HÜCRE SAHNESİ */}
      <div className="relative rounded-3xl border-2 border-white/15 bg-gradient-to-b from-[#1D0F22] via-[#140917] to-[#0B040D] p-4 sm:p-6 flex flex-col items-center justify-center min-h-[340px] overflow-hidden">
        {isCurrentCellWorking && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className={`w-72 h-72 rounded-full blur-2xl animate-pulse ${
                currentStage.cellType === 'animal'
                  ? 'bg-pink-500/20'
                  : 'bg-emerald-500/25'
              }`}
            />
          </div>
        )}

        <div
          className={`relative w-full max-w-xl h-[270px] sm:h-[290px] flex items-center justify-center transition-transform duration-700 ${
            isCurrentCellWorking ? 'scale-[1.02]' : ''
          }`}
        >
          {/* ARKA PLAN SVG: HAYVAN HÜCRESİ VEYA BİTKİ HÜCRESİ */}
          <svg
            viewBox="0 0 560 300"
            className="w-full h-full absolute inset-0 pointer-events-none drop-shadow-2xl"
          >
            {currentStage.cellType === 'animal' ? (
              <g>
                <ellipse
                  cx="280"
                  cy="150"
                  rx="255"
                  ry="132"
                  fill="rgba(236, 72, 153, 0.14)"
                  stroke={isCurrentCellWorking ? '#F472B6' : '#BE185D'}
                  strokeWidth="6"
                />
                <ellipse
                  cx="280"
                  cy="150"
                  rx="240"
                  ry="118"
                  fill="rgba(168, 85, 247, 0.12)"
                  stroke="rgba(244, 114, 182, 0.35)"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />
                <path
                  d="M 90 150 Q 280 90 470 150 M 120 200 Q 280 240 440 190"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                  fill="none"
                />
                <text
                  x="280"
                  y="154"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.22)"
                  fontSize="14"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {isCurrentCellWorking ? '⚡ SİTOPLAZMA AKTİF ⚡' : 'HAYVAN HÜCRESİ SİTOPLAZMASI'}
                </text>
              </g>
            ) : (
              <g>
                <polygon
                  points="65,20 495,20 545,150 495,280 65,280 15,150"
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke={isCurrentCellWorking ? '#34D399' : '#059669'}
                  strokeWidth="9"
                  strokeLinejoin="round"
                />
                <polygon
                  points="80,34 480,34 525,150 480,266 80,266 35,150"
                  fill="rgba(6, 182, 212, 0.10)"
                  stroke="#6EE7B7"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
                <text
                  x="280"
                  y="154"
                  textAnchor="middle"
                  fill="rgba(167,243,208,0.28)"
                  fontSize="14"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {isCurrentCellWorking
                    ? '🌿 FOTOSENTEZ & TURGOR AKTİF 🌿'
                    : 'BİTKİ HÜCRESİ (SELÜLOZ ÇEPERLİ)'}
                </text>
              </g>
            )}

            {isCurrentCellWorking && (
              <g>
                <line
                  x1="150"
                  y1="85"
                  x2="410"
                  y2="85"
                  stroke="#FBBF24"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
                <line
                  x1="150"
                  y1="85"
                  x2="150"
                  y2="215"
                  stroke="#34D399"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
                <line
                  x1="410"
                  y1="85"
                  x2="410"
                  y2="215"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
                <line
                  x1="150"
                  y1="215"
                  x2="410"
                  y2="215"
                  stroke="#F472B6"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
                <circle
                  cx="280"
                  cy="150"
                  r="34"
                  fill="rgba(16,185,129,0.2)"
                  stroke="#34D399"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                />
              </g>
            )}
          </svg>

          {isCurrentCellWorking && (
            <div className="z-20 px-3.5 py-1.5 rounded-full bg-emerald-500/90 text-white font-poppins font-black text-xs shadow-lg shadow-emerald-500/40 animate-bounce flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>
                {currentStage.cellType === 'animal'
                  ? '⚡ ATP & Protein Üretiliyor!'
                  : '☀️ O₂ & Glikoz Üretiliyor!'}
              </span>
            </div>
          )}

          {/* HÜCRE ÜZERİNDEKİ 4 İĞNE YUVASI */}
          {currentStage.slots.map((slotOrg) => {
            const isPinned = currentPinnedIds.includes(slotOrg.id);

            return (
              <button
                key={slotOrg.id}
                onClick={() => handlePinSlotClick(slotOrg)}
                className={`absolute ${slotOrg.positionClass} w-44 sm:w-48 p-2.5 rounded-2xl transition-all flex items-center gap-2.5 text-left z-10 ${
                  isPinned
                    ? 'bg-black/65 border-2 border-emerald-400/80 shadow-xl scale-105'
                    : 'bg-black/45 border-2 border-dashed border-white/30 hover:border-[#F14E13] hover:bg-[#F14E13]/20 hover:scale-105'
                }`}
              >
                {isPinned ? (
                  <>
                    <PinnedOrganelleIllustration
                      svgType={slotOrg.svgType}
                      pinColor={slotOrg.pinColor}
                      isWorking={isCurrentCellWorking}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-poppins font-bold text-xs text-white truncate">
                        {slotOrg.name}
                      </div>
                      <div className="text-[10px] text-emerald-300 font-mono leading-tight mt-0.5">
                        📍 İğnelendi & Aktif
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full border-2 border-dashed border-amber-400/70 bg-amber-500/10 flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-poppins font-bold text-xs text-amber-200 truncate">
                        {slotOrg.slotLabel}
                      </div>
                      <div className="text-[10px] text-[#B5CBC8] leading-tight mt-0.5">
                        {slotOrg.slotHint}
                      </div>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Alt Durum Mesajı */}
        <div
          className={`mt-3 px-4 py-2 rounded-xl text-xs font-medium text-center border max-w-2xl ${
            statusMsg.type === 'error'
              ? 'bg-red-500/20 border-red-500/50 text-red-200'
              : statusMsg.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
              : 'bg-white/5 border-white/10 text-[#B5CBC8]'
          }`}
        >
          {statusMsg.text}
        </div>
      </div>

      {/* ALT ORGANEL TEPSİSİ (7 SEÇENEK: 4 DOĞRU + 3 ÇELDİRİCİ) */}
      <div className="bg-[#0F0510] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-mono font-bold text-[#B5CBC8]">
            Organel Tepsisi (7 Organelden Bu Hücreye Ait 4 Tanesini Seç & İğnele):
          </span>
          <div className="flex items-center gap-2">
            {isCurrentCellWorking && stageIdx === 0 && (
              <button
                onClick={() => switchStage(1)}
                className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg"
              >
                <span>2. Bölüm: Bitki Hücresi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {isCurrentCellWorking && (stageIdx === 1 || areAllStagesDone) && onNextSubject && (
              <button
                onClick={onNextSubject}
                className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg shadow-emerald-500/20"
              >
                <span>Sonraki Derse Geç (Kimya)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>İğneleri Sök</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {currentStage.trayOptions.map((org) => {
            const isPinned = currentPinnedIds.includes(org.id);
            const isSelected = selectedOrgId === org.id && !isPinned;

            return (
              <button
                key={org.id}
                onClick={() => {
                  if (!isPinned) {
                    setSelectedOrgId(org.id);
                    setStatusMsg({
                      type: 'info',
                      text: `Seçildi: "${org.name}" (${org.roleShort}). Şimdi hücre üzerindeki ilgili iğne yuvasına tıkla!`,
                    });
                  }
                }}
                disabled={isPinned}
                className={`p-2.5 rounded-xl font-poppins font-bold text-xs flex items-center gap-2 border transition-all text-left ${
                  isPinned
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 opacity-50 cursor-default'
                    : isSelected
                    ? 'scale-105 shadow-lg text-white'
                    : 'bg-white/5 border-white/15 text-[#B5CBC8] hover:text-white hover:border-white/30'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${org.color}35`,
                        borderColor: '#fff',
                      }
                    : undefined
                }
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-white"
                  style={{ backgroundColor: org.pinColor }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-white truncate text-[11px]">{org.name}</div>
                  <div className="text-[9px] font-mono opacity-80 truncate">{org.roleShort}</div>
                </div>
                {isPinned && <span className="text-xs shrink-0">📍</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BioCellGame;
