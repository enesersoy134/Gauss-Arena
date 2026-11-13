import React, { useState } from 'react';
import { Target, Zap, Check, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { TargetCombinationQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';

export default function TargetCombination({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<TargetCombinationQuestion>) {
  const { payload } = question;
  const { targetBadge, ruleHint, options, correctPairIds } = payload;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ isCorrect: boolean; accuracy: number } | null>(null);

  const isInteractionDisabled = disabled || submitted;

  const handleCardClick = (id: string) => {
    if (isInteractionDisabled) return;

    // Zaten seçiliyse seçimden çıkar (toggle)
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      return;
    }

    const nextSelected = [...selectedIds, id];
    setSelectedIds(nextSelected);

    // Tam 2 seçim yapıldığında OTOMATİK gönder
    if (nextSelected.length === 2) {
      const correctSet = new Set(correctPairIds);
      const isExactPair =
        nextSelected.every((item) => correctSet.has(item)) &&
        nextSelected[0] !== nextSelected[1];

      const matchCount = nextSelected.filter((item) => correctSet.has(item)).length;
      const accuracy = isExactPair ? 1 : matchCount === 1 ? 0.5 : 0;

      const res = { isCorrect: isExactPair, accuracy };
      setResult(res);
      setSubmitted(true);
      onSubmit(res);
    }
  };

  const isTargetMatched = result?.isCorrect ?? false;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-2 select-none">
      {/* Ortada Parlayan Target Badge & Kural İpucu */}
      <div className="flex flex-col items-center gap-2.5 text-center">
        {/* Hedef Rozet */}
        <div
          className={`relative px-8 py-4 rounded-3xl border-2 transition-all duration-300 flex items-center gap-3 backdrop-blur-md ${
            submitted
              ? isTargetMatched
                ? 'bg-game-correct/20 border-game-correct shadow-correct-glow ring-2 ring-game-correct/40'
                : 'bg-game-wrong/20 border-game-wrong shadow-wrong-glow'
              : 'bg-isler-surface/90 border-isler-primary shadow-[0_0_35px_rgba(241,78,19,0.5)] ring-1 ring-isler-primary/40'
          }`}
        >
          <Target
            className={`w-7 h-7 shrink-0 ${
              submitted
                ? isTargetMatched
                  ? 'text-game-correct'
                  : 'text-game-wrong'
                : 'text-isler-primary animate-pulse'
            }`}
          />
          <span className="font-mono text-2xl md:text-3xl font-black text-white tracking-wider">
            {targetBadge}
          </span>
        </div>

        {/* Kural / Rehber İpucu */}
        {ruleHint && (
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-isler-surface/70 border border-isler-primary/20 text-xs md:text-sm font-sans font-medium text-isler-muted">
            <Zap className="w-3.5 h-3.5 text-isler-primary shrink-0" />
            <span>{ruleHint}</span>
          </div>
        )}

        {/* Seçim Sayaç Rozeti */}
        {!submitted && (
          <div className="text-xs font-poppins font-bold text-isler-primary tracking-wide">
            {selectedIds.length === 0 && 'Hedefe ulaşmak için ilk kartı seçin (0/2)'}
            {selectedIds.length === 1 && '1 kart seçildi! 2. kartı seçtiğinizde otomatik kilitlenir (1/2)'}
          </div>
        )}
      </div>

      {/* Seçenek Kartları Grid'i */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-2">
        {options.map((option, idx) => {
          const isSelected = selectedIds.includes(option.id);
          const isPartOfCorrectPair = correctPairIds.includes(option.id);

          let cardStyle =
            'bg-isler-surface border-isler-primary/35 text-white hover:border-isler-primary hover:bg-isler-elevated hover:scale-[1.03] shadow-md';

          if (submitted) {
            if (isSelected) {
              if (isPartOfCorrectPair) {
                cardStyle =
                  'bg-game-correct/20 border-game-correct text-white shadow-correct-glow ring-2 ring-game-correct/50 scale-[1.02]';
              } else {
                cardStyle =
                  'bg-game-wrong/20 border-game-wrong text-white shadow-wrong-glow ring-2 ring-game-wrong/50';
              }
            } else {
              if (isPartOfCorrectPair) {
                // Seçilmemiş ama hedef ikilinin parçası olan kart (ipucu)
                cardStyle =
                  'bg-isler-surface/70 border-dashed border-game-correct/70 text-game-correct/90';
              } else {
                cardStyle = 'bg-isler-deep/40 border-white/10 text-isler-muted/40 opacity-40';
              }
            }
          } else if (isSelected) {
            cardStyle =
              'bg-gradient-to-br from-isler-primary/90 to-isler-hover border-isler-primary text-white shadow-[0_0_25px_rgba(241,78,19,0.6)] ring-2 ring-isler-primary/50 scale-[1.04]';
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={isInteractionDisabled}
              onClick={() => handleCardClick(option.id)}
              className={`relative flex flex-col items-center justify-center gap-1.5 p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-center active:scale-95 disabled:cursor-not-allowed ${cardStyle}`}
            >
              {/* Seçili / Sıra Rozeti */}
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-isler-muted">
                <span className="w-5 h-5 rounded-md bg-black/30 border border-white/10 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>

                {submitted ? (
                  isSelected ? (
                    isPartOfCorrectPair ? (
                      <Check className="w-4 h-4 text-game-correct stroke-[3]" />
                    ) : (
                      <X className="w-4 h-4 text-game-wrong stroke-[3]" />
                    )
                  ) : isPartOfCorrectPair ? (
                    <Check className="w-4 h-4 text-game-correct/70" />
                  ) : null
                ) : isSelected ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                ) : null}
              </div>

              {/* Ana Seçenek Değeri */}
              <span className="font-mono text-xl md:text-2xl font-extrabold text-white mt-1">
                {option.label}
              </span>

              {/* Ek İpucu / Detay Metni */}
              {option.detailHint && (
                <span className="text-[11px] font-sans text-isler-muted truncate max-w-full">
                  {option.detailHint}
                </span>
              )}

              {/* Hedef İkili Kaçırıldı Etiketi */}
              {submitted && !isSelected && isPartOfCorrectPair && (
                <span className="text-[10px] font-poppins font-bold uppercase text-game-correct bg-game-correct/10 px-1.5 py-0.5 rounded border border-game-correct/30 mt-1">
                  Hedef İkili
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Gönderim Sonrası Bildirim */}
      {submitted && result && (
        <div
          className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-poppins font-bold text-sm md:text-base transition-all ${
            result.isCorrect
              ? 'bg-game-correct text-black shadow-correct-glow'
              : 'bg-game-wrong text-white shadow-wrong-glow'
          }`}
        >
          {result.isCorrect ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Harika! Tam hedef kombinasyonu tutturdunuz!</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              <span>
                {result.accuracy > 0
                  ? 'Kısmi eşleşme: 1 doğru seçim yaptınız (%50 Doğruluk).'
                  : 'Hatalı kombinasyon! Doğru ikili yeşil ile vurgulanmıştır.'}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
