import React, { useState } from 'react';
import type { HotspotQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { Check, X, Target, Crosshair } from 'lucide-react';

export const Hotspot: React.FC<QuestionComponentProps<HotspotQuestion>> = ({
  question,
  onSubmit,
  disabled,
}) => {
  const { imageUrl, imageAlt, regions, correctRegionId } = question.payload;

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const promptLower = question.prompt.toLowerCase();
  const isCellDiagram =
    question.subject === 'biyoloji' ||
    promptLower.includes('hücre') ||
    promptLower.includes('golgi') ||
    promptLower.includes('organel') ||
    Boolean(imageUrl && imageUrl.includes('eukaryotic-cell'));

  // Parabol veya grafik sorusu mu? Veya resim yüklenemedi mi?
  const isMathGraph =
    !isCellDiagram &&
    (!imageUrl ||
      imageUrl.trim() === '' ||
      imageError ||
      promptLower.includes('parabol') ||
      promptLower.includes('grafik') ||
      promptLower.includes('tepe noktası'));

  const handleRegionClick = (regionId: string) => {
    if (disabled || isSubmitted) return;

    setSelectedRegionId(regionId);
    const isCorrect = regionId === correctRegionId;

    setIsSubmitted(true);
    onSubmit({
      isCorrect,
      accuracy: isCorrect ? 1 : 0,
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 select-none font-sans">
      {/* 1. GÖRSEL / GRAFİK ALANI */}
      <div className="relative w-full max-w-3xl aspect-[16/10] rounded-2xl bg-isler-deep border border-white/15 overflow-hidden flex items-center justify-center">
        {/* ARKA PLAN: ÖKARYOT HÜCRE SVG, MATEMATİK PARABOL SVG VEYA HARİCİ GÖRSEL */}
        {isCellDiagram ? (
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full select-none pointer-events-none"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="cellBgGrad" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#132238" />
                <stop offset="100%" stopColor="#090D16" />
              </radialGradient>
              <radialGradient id="cytoplasmGrad" cx="48%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#0F243C" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#0B192C" stopOpacity="0.98" />
              </radialGradient>
              <radialGradient id="nucleusGrad" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="70%" stopColor="#6B21A8" />
                <stop offset="100%" stopColor="#3B0764" />
              </radialGradient>
              <radialGradient id="nucleolusGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="50%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#581C87" />
              </radialGradient>
              <linearGradient id="mitoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
              <linearGradient id="golgiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <radialGradient id="vacuoleGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.35" />
              </radialGradient>
              <pattern id="bioGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="1" strokeOpacity="0.5" />
              </pattern>
            </defs>

            <rect width="800" height="500" fill="url(#cellBgGrad)" />
            <rect width="800" height="500" fill="url(#bioGridPattern)" />

            {/* Başlık Etiketi */}
            <rect x="24" y="20" width="235" height="34" rx="17" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="44" cy="37" r="5" fill="#38BDF8" />
            <text x="58" y="42" fill="#E2E8F0" fontFamily="sans-serif" fontSize="13" fontWeight="bold">
              ÖKARYOT HÜCRE MODELİ
            </text>

            {/* Hücre Zarı (Dış ve İç Fosfolipit Çift Katmanı) */}
            <path
              d="M 400 52 C 585 48, 695 125, 702 252 C 708 378, 575 452, 398 450 C 218 448, 95 375, 98 248 C 101 120, 215 56, 400 52 Z"
              fill="url(#cytoplasmGrad)"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeOpacity="0.85"
            />
            <path
              d="M 400 62 C 575 58, 682 132, 688 252 C 694 370, 565 440, 398 438 C 228 436, 108 368, 110 248 C 112 128, 225 66, 400 62 Z"
              fill="none"
              stroke="#7DD3FC"
              strokeWidth="2"
              strokeDasharray="8 5"
              strokeOpacity="0.6"
            />

            {/* Sitoplazma İçi Serbest Ribozom Tanecikleri */}
            <g fill="#94A3B8" opacity="0.45">
              <circle cx="170" cy="270" r="3" />
              <circle cx="185" cy="282" r="2.5" />
              <circle cx="290" cy="390" r="3" />
              <circle cx="450" cy="395" r="3" />
              <circle cx="610" cy="240" r="3" />
              <circle cx="595" cy="255" r="2.5" />
              <circle cx="330" cy="140" r="3" />
              <circle cx="480" cy="120" r="2.5" />
              <circle cx="620" cy="320" r="3" />
            </g>

            {/* Koful (Vacuole) */}
            <g transform="translate(235, 345)">
              <ellipse cx="0" cy="0" rx="46" ry="34" fill="url(#vacuoleGrad)" stroke="#38BDF8" strokeWidth="2.5" />
              <ellipse cx="-12" cy="-8" rx="16" ry="8" fill="#E0F2FE" opacity="0.25" />
            </g>

            {/* Sentrozom */}
            <g transform="translate(545, 155)" stroke="#34D399" strokeWidth="2" fill="#065F46" opacity="0.9">
              <rect x="-22" y="-8" width="28" height="14" rx="4" transform="rotate(-25)" />
              <rect x="-5" y="-15" width="14" height="28" rx="4" transform="rotate(35)" />
              <line x1="-30" y1="0" x2="30" y2="0" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="-30" x2="0" y2="30" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="3 3" />
            </g>

            {/* Endoplazmik Retikulum (Granüllü ER) */}
            <g fill="none" stroke="#818CF8" strokeWidth="7" strokeLinecap="round">
              <path d="M 315 215 C 295 185, 330 155, 380 158 C 430 160, 460 185, 452 215" opacity="0.85" />
              <path d="M 302 198 C 282 165, 325 135, 384 138 C 440 140, 475 170, 468 205" strokeWidth="5" opacity="0.7" />
            </g>
            <g fill="#E0E7FF">
              <circle cx="315" cy="175" r="2.5" />
              <circle cx="345" cy="158" r="2.5" />
              <circle cx="380" cy="156" r="2.5" />
              <circle cx="415" cy="162" r="2.5" />
              <circle cx="445" cy="180" r="2.5" />
            </g>

            {/* 1. MİTOKONDRİ -> x=28% (224), y=38% (190) */}
            <g transform="translate(224, 190) rotate(-18)">
              <rect x="-58" y="-30" width="116" height="60" rx="30" fill="url(#mitoGrad)" stroke="#FCA5A5" strokeWidth="3" />
              <path
                d="M -44 0 L -32 -18 L -20 16 L -6 -18 L 8 16 L 22 -18 L 34 16 L 44 0"
                fill="none"
                stroke="#FEF2F2"
                strokeWidth="3.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.9"
              />
              <rect x="-48" y="-22" width="96" height="44" rx="22" fill="none" stroke="#FEE2E2" strokeWidth="1.5" strokeOpacity="0.65" />
            </g>

            {/* 2. ÇEKİRDEK -> x=48% (384), y=50% (250) */}
            <g transform="translate(384, 250)">
              <circle cx="0" cy="0" r="66" fill="url(#nucleusGrad)" stroke="#D8B4FE" strokeWidth="4" strokeDasharray="18 5" />
              <path d="M -38 -20 Q -15 -45 20 -25 T 35 15 T -10 42 T -42 10" fill="none" stroke="#E9D5FF" strokeWidth="1.8" opacity="0.55" />
              <path d="M -25 30 Q 10 45 32 5 T 5 -38 T -35 -5" fill="none" stroke="#F3E8FF" strokeWidth="1.5" opacity="0.45" />
              <circle cx="-10" cy="-6" r="22" fill="url(#nucleolusGrad)" stroke="#F3E8FF" strokeWidth="1.5" />
            </g>

            {/* 3. GOLGİ CİSİMCİĞİ -> x=65% (520), y=62% (310) */}
            <g transform="translate(520, 310)">
              <circle cx="0" cy="0" r="56" fill="#F59E0B" opacity="0.14" />
              <path d="M -38 -30 Q 0 -18 38 -30" fill="none" stroke="url(#golgiGrad)" strokeWidth="9" strokeLinecap="round" />
              <path d="M -46 -15 Q 0 -2 46 -15" fill="none" stroke="#FBBF24" strokeWidth="10" strokeLinecap="round" />
              <path d="M -52 2 Q 0 16 52 2" fill="none" stroke="url(#golgiGrad)" strokeWidth="11" strokeLinecap="round" />
              <path d="M -44 19 Q 0 32 44 19" fill="none" stroke="#FBBF24" strokeWidth="10" strokeLinecap="round" />
              <path d="M -32 35 Q 0 46 32 35" fill="none" stroke="url(#golgiGrad)" strokeWidth="8" strokeLinecap="round" />
              <circle cx="-58" cy="-10" r="7" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
              <circle cx="60" cy="-6" r="8" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
              <circle cx="56" cy="18" r="6.5" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
              <circle cx="-52" cy="24" r="6" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
              <circle cx="42" cy="40" r="5.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
            </g>
          </svg>
        ) : !isMathGraph ? (
          <img
            src={imageUrl}
            alt={imageAlt || 'Hotspot Hedef Görseli'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        ) : (
          /* SVG KOORDİNAT DÜZLEMİ VE f(x) = x² - 4 PARABOLÜ */
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full select-none"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Izgara Deseni */}
              <pattern
                id="gridPattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#2A1A2C"
                  strokeWidth="1"
                  strokeOpacity="0.8"
                />
              </pattern>
            </defs>

            {/* Izgara arka planı */}
            <rect width="800" height="500" fill="url(#gridPattern)" />

            {/* KOORDİNAT EKSENLERİ (Merkez: 400, 250) */}
            {/* X Ekseni */}
            <line
              x1="40"
              y1="250"
              x2="760"
              y2="250"
              stroke="#B5CBC8"
              strokeWidth="2"
            />
            <polygon points="760,245 772,250 760,255" fill="#B5CBC8" />
            <text
              x="775"
              y="268"
              fill="#FFFFFF"
              fontFamily="JetBrains Mono"
              fontSize="14"
              fontWeight="bold"
            >
              x
            </text>

            {/* Y Ekseni */}
            <line
              x1="400"
              y1="470"
              x2="400"
              y2="30"
              stroke="#B5CBC8"
              strokeWidth="2"
            />
            <polygon points="395,30 400,18 405,30" fill="#B5CBC8" />
            <text
              x="415"
              y="28"
              fill="#FFFFFF"
              fontFamily="JetBrains Mono"
              fontSize="14"
              fontWeight="bold"
            >
              y
            </text>

            {/* Orijin */}
            <text
              x="388"
              y="268"
              fill="#B5CBC8"
              fontFamily="JetBrains Mono"
              fontSize="12"
            >
              O
            </text>

            {/* Eksen İşaretleri (Ticks) */}
            {/* x = -2 (300, 250) */}
            <line x1="280" y1="245" x2="280" y2="255" stroke="#FFF" strokeWidth="2" />
            <text x="280" y="274" fill="#B5CBC8" fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">
              -2
            </text>

            {/* x = +2 (520, 250) */}
            <line x1="520" y1="245" x2="520" y2="255" stroke="#FFF" strokeWidth="2" />
            <text x="520" y="274" fill="#B5CBC8" fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">
              +2
            </text>

            {/* y = +4 (400, 130) */}
            <line x1="395" y1="130" x2="405" y2="130" stroke="#FFF" strokeWidth="2" />
            <text x="388" y="134" fill="#B5CBC8" fontSize="12" textAnchor="end" fontFamily="JetBrains Mono">
              +4
            </text>

            {/* y = -4 (400, 370) */}
            <line x1="395" y1="370" x2="405" y2="370" stroke="#FFF" strokeWidth="2" />
            <text x="388" y="374" fill="#B5CBC8" fontSize="12" textAnchor="end" fontFamily="JetBrains Mono">
              -4
            </text>

            {/* PARABOL EĞRİSİ: f(x) = x² - 4 */}
            {/* Noktalar: Tepe(400, 370), Kök1(280, 250), Kök2(520, 250) */}
            <path
              d="M 200 37 Q 400 703 600 37"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="3.5"
            />

            {/* Parabol Fonksiyon Etiketi */}
            <rect
              x="620"
              y="60"
              width="130"
              height="28"
              rx="14"
              fill="#0F0510"
              stroke="#60A5FA"
              strokeWidth="1.2"
            />
            <text
              x="685"
              y="79"
              fill="#FFFFFF"
              fontFamily="JetBrains Mono"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              f(x) = x² - 4
            </text>
          </svg>
        )}

        {/* 2. ETKİLEŞİMLİ BÖLGELER (HOTSPOT TARGETS) */}
        {regions.map((region) => {
          const isSelected = selectedRegionId === region.id;
          const isThisCorrect = region.id === correctRegionId;

          // Gönderim sonrası stil belirleyicileri
          const showSuccess = isSubmitted && isThisCorrect;
          const showWrong = isSubmitted && isSelected && !isThisCorrect;

          return (
            <div
              key={region.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-auto"
              style={{
                left: `${region.xPercent}%`,
                top: `${region.yPercent}%`,
              }}
            >
              <button
                type="button"
                disabled={disabled || isSubmitted}
                onClick={() => handleRegionClick(region.id)}
                className={`
                  relative group flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-150 cursor-pointer
                  ${disabled || isSubmitted ? 'cursor-default' : 'hover:scale-110 active:scale-95'}
                `}
                title={region.label}
              >
                {/* Seçildikten Sonraki Halka */}
                {isSelected && (
                  <span
                    className={`absolute -inset-1 rounded-full border-2 border-dashed ${
                      isThisCorrect ? 'border-emerald-400' : 'border-rose-400'
                    }`}
                  />
                )}

                {/* Çekirdek Daire (Hotspot Core) */}
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors duration-200
                    ${
                      showSuccess
                        ? 'bg-emerald-500 border-white text-white'
                        : showWrong
                        ? 'bg-rose-500 border-white text-white'
                        : isSelected
                        ? 'bg-[#F14E13] border-white text-white'
                        : 'bg-[#0F0510] border-[#F14E13] text-[#F14E13] group-hover:bg-[#F14E13] group-hover:text-white'
                    }
                  `}
                >
                  {showSuccess ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : showWrong ? (
                    <X className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Crosshair className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Bölge Etiketi (Kapsül) - Kesinlikle butonun merkezini kaydırmaz */}
              <div
                className={`
                  absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-tight transition-all duration-200 pointer-events-none whitespace-nowrap border
                  ${
                    showSuccess
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : showWrong
                      ? 'bg-rose-600 text-white border-rose-400'
                      : isSelected
                      ? 'bg-[#F14E13] text-white border-orange-400'
                      : 'bg-[#0F0510]/90 text-[#B5CBC8] border-white/10 group-hover:text-white'
                  }
                `}
              >
                {region.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. ALT BİLGİ VE GERİ BİLDİRİM */}
      <div className="flex items-center justify-center gap-3 text-xs font-poppins">
        {!isSubmitted ? (
          <div className="flex items-center gap-2 text-[#B5CBC8] bg-[#0F0510] px-4 py-2 rounded-full border border-white/10">
            <Target className="w-4 h-4 text-[#F14E13]" />
            <span>Hedef bölgeye doğrudan dokunarak seçiminizi kilitleyin.</span>
          </div>
        ) : selectedRegionId === correctRegionId ? (
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-5 py-2.5 rounded-full border border-emerald-500/30 font-bold">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Kusursuz İsabet! Doğru bölgeyi buldunuz.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-5 py-2.5 rounded-full border border-rose-500/30 font-bold">
            <X className="w-4 h-4 stroke-[3]" />
            <span>Hatalı Bölge! Doğru hedef işaretlendi.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotspot;
