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

  // Parabol veya grafik sorusu mu? Veya resim yüklenemedi mi?
  const isMathGraph =
    !imageUrl ||
    imageUrl.trim() === '' ||
    imageError ||
    question.prompt.toLowerCase().includes('parabol') ||
    question.prompt.toLowerCase().includes('grafik') ||
    question.prompt.toLowerCase().includes('tepe noktası');

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
      <div className="relative w-full max-w-4xl aspect-[16/10] max-h-[520px] rounded-2xl bg-isler-deep border-2 border-isler-primary/40 shadow-2xl overflow-hidden flex items-center justify-center">
        {/* ARKA PLAN: GERÇEK RESİM VEYA SVG KOORDİNAT DÜZLEMİ */}
        {!isMathGraph ? (
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
            preserveAspectRatio="xMidYMid meet"
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
            {/* Noktalar: Tepe(400, 370), Kök1(280, 250), Kök2(520, 250), Uçlar(160, 50), (640, 50) */}
            <path
              d="M 160 50 Q 280 250 400 370 Q 520 250 640 50"
              fill="none"
              stroke="#F14E13"
              strokeWidth="5"
              strokeOpacity="0.2"
              filter="blur(4px)"
            />
            <path
              d="M 160 50 Q 280 250 400 370 Q 520 250 640 50"
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
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-auto"
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
                  relative group flex items-center justify-center p-3 rounded-full transition-all duration-300 cursor-pointer
                  ${disabled || isSubmitted ? 'cursor-default' : 'hover:scale-125'}
                `}
                title={region.label}
              >
                {/* Dış Nabız Dalgaları (Radar Pulse) */}
                {!isSubmitted && (
                  <span className="absolute inset-0 rounded-full bg-isler-primary opacity-40 animate-ping" />
                )}

                {/* Seçildikten Sonraki Radar Halkası Animasyonu */}
                {isSelected && (
                  <span
                    className={`absolute -inset-4 rounded-full border-2 border-dashed animate-spin ${
                      isThisCorrect ? 'border-game-correct' : 'border-game-wrong'
                    }`}
                  />
                )}

                {/* Başarı Dalgalanması */}
                {showSuccess && (
                  <span className="absolute -inset-2 rounded-full bg-game-correct/30 animate-pulse shadow-correct-glow" />
                )}

                {/* Hata Dalgalanması */}
                {showWrong && (
                  <span className="absolute -inset-2 rounded-full bg-game-wrong/30 animate-pulse shadow-wrong-glow" />
                )}

                {/* Çekirdek Daire (Hotspot Core) */}
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md
                    ${
                      showSuccess
                        ? 'bg-game-correct border-white text-white shadow-correct-glow scale-110'
                        : showWrong
                        ? 'bg-game-wrong border-white text-white shadow-wrong-glow scale-110'
                        : isSelected
                        ? 'bg-isler-primary border-white text-white shadow-btn-glow scale-110'
                        : 'bg-isler-deep/90 border-isler-primary text-isler-primary group-hover:bg-isler-primary group-hover:text-white'
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

              {/* Bölge Etiketi (Kapsül) */}
              <div
                className={`
                  px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-tight shadow-lg transition-all duration-200 pointer-events-none mt-1 whitespace-nowrap
                  ${
                    showSuccess
                      ? 'bg-game-correct text-white border border-white/40'
                      : showWrong
                      ? 'bg-game-wrong text-white border border-white/40'
                      : isSelected
                      ? 'bg-isler-primary text-white border border-white/30'
                      : 'bg-isler-deep/95 text-isler-muted border border-white/10 group-hover:text-white'
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
          <div className="flex items-center gap-2 text-isler-muted bg-isler-surface px-4 py-2 rounded-full border border-isler-primary/30">
            <Target className="w-4 h-4 text-isler-primary animate-pulse" />
            <span>Hedef bölgeye doğrudan dokunarak seçiminizi kilitleyin.</span>
          </div>
        ) : selectedRegionId === correctRegionId ? (
          <div className="flex items-center gap-2 text-game-correct bg-game-correct/10 px-5 py-2.5 rounded-full border border-game-correct/40 font-bold shadow-correct-glow">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Kusursuz İsabet! Doğru bölgeyi buldunuz.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-game-wrong bg-game-wrong/10 px-5 py-2.5 rounded-full border border-game-wrong/40 font-bold shadow-wrong-glow">
            <X className="w-4 h-4 stroke-[3]" />
            <span>Hatalı Bölge! Doğru hedef yeşil renkle işaretlendi.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotspot;
