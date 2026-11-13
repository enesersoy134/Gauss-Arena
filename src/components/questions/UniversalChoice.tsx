import React, { useState, useEffect, useMemo } from 'react';
import type { UniversalChoiceQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { Check, X, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface OptionItem {
  text: string;
  originalIndex: number;
}

export default function UniversalChoice({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<UniversalChoiceQuestion>) {
  const { payload } = question;
  const [selectedOriginalIndex, setSelectedOriginalIndex] = useState<number | null>(null);

  // Soru değiştiğinde seçimi sıfırla
  useEffect(() => {
    setSelectedOriginalIndex(null);
  }, [question.id]);

  // Şıkları hazırla ve gerekirse karıştır
  const displayItems = useMemo<OptionItem[]>(() => {
    const raw: OptionItem[] = (payload.options || []).map((text, idx) => ({
      text,
      originalIndex: idx,
    }));

    // true_false ve comparison genellikle karıştırılmaz
    if (payload.shuffleOptions && payload.variant !== 'comparison' && payload.variant !== 'true_false') {
      const shuffled = [...raw];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    return raw;
  }, [question.id, payload.options, payload.shuffleOptions, payload.variant]);

  const handleSelect = (originalIndex: number) => {
    if (disabled || selectedOriginalIndex !== null) return;
    setSelectedOriginalIndex(originalIndex);

    const isCorrect = originalIndex === payload.correctIndex;
    onSubmit({
      isCorrect,
      accuracy: isCorrect ? 1 : 0,
    });
  };

  const isLocked = disabled || selectedOriginalIndex !== null;

  /* =========================================================================
   * 1. VARYANT: TRUE_FALSE (2 Dev Kart: Doğru / Yanlış)
   * ========================================================================= */
  if (payload.variant === 'true_false') {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {displayItems.map((item, displayIdx) => {
            const isSelected = selectedOriginalIndex === item.originalIndex;
            const isTargetCorrect = item.originalIndex === payload.correctIndex;
            const isTrueCard = displayIdx === 0 || item.text.toLowerCase().includes('doğru') || item.text.toLowerCase().includes('true');

            // Görsel durum belirleme
            let cardClasses = 'border-isler-primary/35 bg-isler-surface hover:border-isler-primary hover:bg-isler-elevated hover:shadow-[0_4px_20px_-4px_rgba(241,78,19,0.35)]';
            let iconColor = isTrueCard ? 'text-[#22C55E]' : 'text-[#EF4444]';
            let badgeText = isTrueCard ? 'DOĞRU' : 'YANLIŞ';

            if (selectedOriginalIndex !== null) {
              if (isSelected) {
                if (isTargetCorrect) {
                  cardClasses = 'border-[#22C55E] bg-gradient-to-br from-[#22C55E]/25 via-isler-surface to-isler-surface shadow-[0_0_25px_rgba(34,197,94,0.55)] ring-2 ring-[#22C55E]/40';
                } else {
                  cardClasses = 'border-[#EF4444] bg-gradient-to-br from-[#EF4444]/25 via-isler-surface to-isler-surface shadow-[0_0_25px_rgba(239,68,68,0.55)] ring-2 ring-[#EF4444]/40';
                }
              } else if (isTargetCorrect) {
                // Doğru cevap buydu vurgusu
                cardClasses = 'border-[#22C55E]/80 bg-[#22C55E]/10 opacity-80';
              } else {
                cardClasses = 'border-white/10 bg-isler-surface/40 opacity-40';
              }
            }

            return (
              <button
                key={item.originalIndex}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelect(item.originalIndex)}
                className={`group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border-2 transition-all duration-200 min-h-[170px] md:min-h-[220px] select-none text-left ${cardClasses} ${
                  !isLocked ? 'cursor-pointer active:scale-95' : 'cursor-default'
                }`}
              >
                {/* Simge Çemberi */}
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 transition-transform duration-200 ${
                    !isLocked ? 'group-hover:scale-110' : ''
                  } ${
                    isTrueCard
                      ? 'bg-[#22C55E]/15 border border-[#22C55E]/40'
                      : 'bg-[#EF4444]/15 border border-[#EF4444]/40'
                  }`}
                >
                  {isTrueCard ? (
                    <Check className={`w-9 h-9 md:w-11 md:h-11 ${iconColor} stroke-[3]`} />
                  ) : (
                    <X className={`w-9 h-9 md:w-11 md:h-11 ${iconColor} stroke-[3]`} />
                  )}
                </div>

                {/* Ana Başlık Metni */}
                <span className="font-poppins font-extrabold text-2xl md:text-3xl text-white tracking-wide mb-1">
                  {item.text}
                </span>

                <span className="text-xs md:text-sm font-poppins font-semibold text-isler-muted">
                  {isTrueCard ? 'Önerme bilimsel olarak geçerlidir' : 'Önerme hatalı / yanıltıcıdır'}
                </span>

                {/* Durum Rozeti */}
                {selectedOriginalIndex !== null && isSelected && (
                  <div
                    className={`mt-4 px-3 py-1 rounded-full text-xs font-poppins font-bold flex items-center gap-1.5 ${
                      isTargetCorrect
                        ? 'bg-[#22C55E]/20 text-[#4ADE80] border border-[#22C55E]'
                        : 'bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]'
                    }`}
                  >
                    {isTargetCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Doğru Seçim!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Yanlış Seçim
                      </>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* =========================================================================
   * 2. VARYANT: COMPARISON (Sol/Sağ İfade Kartları + Ortada <, =, > Butonları)
   * ========================================================================= */
  if (payload.variant === 'comparison') {
    const leftText = payload.comparisonItems?.left ?? 'İfade A';
    const rightText = payload.comparisonItems?.right ?? 'İfade B';

    // Seçilen veya doğru olan sembol
    const selectedSymbol = selectedOriginalIndex !== null ? payload.options[selectedOriginalIndex] : null;
    const isSelectedCorrect = selectedOriginalIndex === payload.correctIndex;

    return (
      <div className="w-full flex flex-col gap-6">
        {/* Karşılaştırma Arenası: Sol Kart — Orta Durum — Sağ Kart */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 md:gap-4 items-center">
          {/* Sol Kart */}
          <div className="md:col-span-5 p-5 md:p-6 rounded-2xl bg-isler-surface border border-isler-primary/35 flex flex-col items-center justify-center text-center min-h-[120px] md:min-h-[140px] shadow-lg">
            <span className="text-xs font-poppins font-bold text-[#FF7A45] tracking-wider uppercase mb-2">
              Sol Değer
            </span>
            <span className="font-mono font-bold text-2xl md:text-3xl text-white">
              {leftText}
            </span>
          </div>

          {/* Orta Kutu (Seçilen Bağıntı / Soru İşareti) */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-200 ${
                selectedSymbol
                  ? isSelectedCorrect
                    ? 'border-[#22C55E] bg-[#22C55E]/20 text-[#4ADE80] shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                    : 'border-[#EF4444] bg-[#EF4444]/20 text-[#F87171] shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                  : 'border-isler-primary/45 bg-isler-deep text-isler-muted animate-pulse'
              }`}
            >
              <span className="font-mono font-black text-2xl md:text-3xl">
                {selectedSymbol || '?'}
              </span>
            </div>
          </div>

          {/* Sağ Kart */}
          <div className="md:col-span-5 p-5 md:p-6 rounded-2xl bg-isler-surface border border-isler-primary/35 flex flex-col items-center justify-center text-center min-h-[120px] md:min-h-[140px] shadow-lg">
            <span className="text-xs font-poppins font-bold text-[#60A5FA] tracking-wider uppercase mb-2">
              Sağ Değer
            </span>
            <span className="font-mono font-bold text-2xl md:text-3xl text-white">
              {rightText}
            </span>
          </div>
        </div>

        {/* 3 Büyük Buton: [<], [=], [>] */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {displayItems.map((item) => {
            const isSelected = selectedOriginalIndex === item.originalIndex;
            const isTargetCorrect = item.originalIndex === payload.correctIndex;

            let btnClasses = 'border-isler-primary/35 bg-isler-surface hover:border-isler-primary hover:bg-isler-elevated hover:shadow-[0_4px_20px_-4px_rgba(241,78,19,0.35)]';
            let label = item.text === '<' ? 'KÜÇÜKTÜR' : item.text === '=' ? 'EŞİTTİR' : item.text === '>' ? 'BÜYÜKTÜR' : item.text;

            if (selectedOriginalIndex !== null) {
              if (isSelected) {
                if (isTargetCorrect) {
                  btnClasses = 'border-[#22C55E] bg-[#22C55E]/25 text-white shadow-[0_0_25px_rgba(34,197,94,0.55)] ring-2 ring-[#22C55E]';
                } else {
                  btnClasses = 'border-[#EF4444] bg-[#EF4444]/25 text-white shadow-[0_0_25px_rgba(239,68,68,0.55)] ring-2 ring-[#EF4444]';
                }
              } else if (isTargetCorrect) {
                btnClasses = 'border-[#22C55E]/80 bg-[#22C55E]/15 text-white';
              } else {
                btnClasses = 'border-white/10 bg-isler-surface/40 opacity-40';
              }
            }

            return (
              <button
                key={item.originalIndex}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelect(item.originalIndex)}
                className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border-2 transition-all duration-200 min-h-[90px] md:min-h-[110px] select-none ${btnClasses} ${
                  !isLocked ? 'cursor-pointer active:scale-95' : 'cursor-default'
                }`}
              >
                <span className="font-mono font-black text-3xl md:text-4xl mb-1 text-white">
                  {item.text}
                </span>
                <span className="text-xs font-poppins font-semibold text-isler-muted uppercase tracking-wider">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* =========================================================================
   * 3. VARYANT: ODD_ONE_OUT (Gruba Uymayanı / Yabancıyı Bul - 2x3 veya 2x2 Grid)
   * ========================================================================= */
  if (payload.variant === 'odd_one_out') {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {displayItems.map((item, idx) => {
            const isSelected = selectedOriginalIndex === item.originalIndex;
            const isTargetCorrect = item.originalIndex === payload.correctIndex;

            let cardClasses = 'border-isler-primary/35 bg-isler-surface hover:border-isler-primary hover:bg-isler-elevated hover:shadow-[0_4px_20px_-4px_rgba(241,78,19,0.35)]';

            if (selectedOriginalIndex !== null) {
              if (isSelected) {
                if (isTargetCorrect) {
                  cardClasses = 'border-[#22C55E] bg-gradient-to-r from-[#22C55E]/25 to-isler-surface shadow-[0_0_20px_rgba(34,197,94,0.5)] ring-2 ring-[#22C55E]';
                } else {
                  cardClasses = 'border-[#EF4444] bg-gradient-to-r from-[#EF4444]/25 to-isler-surface shadow-[0_0_20px_rgba(239,68,68,0.5)] ring-2 ring-[#EF4444]';
                }
              } else if (isTargetCorrect) {
                cardClasses = 'border-[#22C55E]/80 bg-[#22C55E]/15';
              } else {
                cardClasses = 'border-white/10 bg-isler-surface/40 opacity-40';
              }
            }

            return (
              <button
                key={item.originalIndex}
                type="button"
                disabled={isLocked}
                onClick={() => handleSelect(item.originalIndex)}
                className={`relative flex items-center justify-between p-4 md:p-5 rounded-xl border transition-all duration-200 min-h-[72px] text-left select-none ${cardClasses} ${
                  !isLocked ? 'cursor-pointer active:scale-98' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-isler-deep border border-isler-primary/30 flex items-center justify-center font-mono text-xs font-bold text-isler-muted flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-poppins font-semibold text-base md:text-lg text-white">
                    {item.text}
                  </span>
                </div>

                {selectedOriginalIndex !== null && isSelected && (
                  <div className="ml-2 flex-shrink-0">
                    {isTargetCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-6 h-6 text-[#EF4444]" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* =========================================================================
   * 4. VARYANT: TEST (Klasik Çoktan Seçmeli 2x2 Grid)
   * ========================================================================= */
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {displayItems.map((item, idx) => {
          const isSelected = selectedOriginalIndex === item.originalIndex;
          const isTargetCorrect = item.originalIndex === payload.correctIndex;

          let cardClasses = 'border-isler-primary/35 bg-isler-surface hover:border-isler-primary hover:bg-isler-elevated hover:shadow-[0_4px_20px_-4px_rgba(241,78,19,0.35)]';

          if (selectedOriginalIndex !== null) {
            if (isSelected) {
              if (isTargetCorrect) {
                cardClasses = 'border-[#22C55E] bg-gradient-to-r from-[#22C55E]/25 to-isler-surface shadow-[0_0_20px_rgba(34,197,94,0.5)] ring-2 ring-[#22C55E]';
              } else {
                cardClasses = 'border-[#EF4444] bg-gradient-to-r from-[#EF4444]/25 to-isler-surface shadow-[0_0_20px_rgba(239,68,68,0.5)] ring-2 ring-[#EF4444]';
              }
            } else if (isTargetCorrect) {
              cardClasses = 'border-[#22C55E]/80 bg-[#22C55E]/15';
            } else {
              cardClasses = 'border-white/10 bg-isler-surface/40 opacity-40';
            }
          }

          const letter = optionLetters[idx] || `${idx + 1}`;

          return (
            <button
              key={item.originalIndex}
              type="button"
              disabled={isLocked}
              onClick={() => handleSelect(item.originalIndex)}
              className={`group relative flex items-center justify-between p-4 md:p-5 rounded-xl border transition-all duration-200 min-h-[72px] text-left select-none ${cardClasses} ${
                !isLocked ? 'cursor-pointer active:scale-98' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#2A1A2C] border border-isler-primary/35 flex items-center justify-center font-poppins font-bold text-sm text-[#FF7A45] flex-shrink-0 group-hover:border-isler-primary transition-colors">
                  {letter}
                </div>
                <span className="font-source-sans font-semibold text-base md:text-lg text-white break-words">
                  {item.text}
                </span>
              </div>

              {selectedOriginalIndex !== null && (
                <div className="ml-3 flex-shrink-0">
                  {isSelected && isTargetCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                  )}
                  {isSelected && !isTargetCorrect && (
                    <XCircle className="w-6 h-6 text-[#EF4444]" />
                  )}
                  {!isSelected && isTargetCorrect && (
                    <span className="text-xs font-poppins font-bold text-[#4ADE80] px-2 py-0.5 rounded bg-[#22C55E]/20 border border-[#22C55E]/40">
                      Doğru
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
