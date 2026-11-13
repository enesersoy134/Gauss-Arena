import React, { useState } from 'react';
import { Check, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import type { MultiSelectBubbleQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';

export default function MultiSelectBubble({
  question,
  onSubmit,
  disabled
}: QuestionComponentProps<MultiSelectBubbleQuestion>) {
  const { payload } = question;
  const { instruction, items } = payload;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ isCorrect: boolean; accuracy: number } | null>(null);

  const isInteractionDisabled = disabled || submitted;

  const toggleSelect = (id: string) => {
    if (isInteractionDisabled) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (isInteractionDisabled) return;

    const correctItemIds = new Set(items.filter((i) => i.isCorrect).map((i) => i.id));
    const totalCorrect = correctItemIds.size;

    const correctlySelected = items.filter(
      (i) => selectedIds.includes(i.id) && i.isCorrect
    ).length;
    const wronglySelected = items.filter(
      (i) => selectedIds.includes(i.id) && !i.isCorrect
    ).length;

    const isExactMatch =
      correctlySelected === totalCorrect && wronglySelected === 0;

    const accuracyRaw =
      totalCorrect > 0 ? (correctlySelected - wronglySelected) / totalCorrect : 0;
    const accuracy = Math.max(0, Math.min(1, Number(accuracyRaw.toFixed(2))));

    const res = { isCorrect: isExactMatch, accuracy };
    setResult(res);
    setSubmitted(true);
    onSubmit(res);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-2 select-none">
      <style>{`
        @keyframes bubbleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Yönerge Metni */}
      {instruction && (
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-isler-surface/80 border border-isler-primary/30 text-isler-muted font-sans text-sm md:text-base font-medium shadow-sm">
          <Sparkles className="w-4 h-4 text-isler-primary animate-pulse" />
          <span>{instruction}</span>
        </div>
      )}

      {/* Baloncuk Havuzu */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3.5 md:gap-5 py-4 px-2">
        {items.map((item, index) => {
          const isSelected = selectedIds.includes(item.id);
          const animationDelay = `${(index * 0.18).toFixed(2)}s`;
          const animationDuration = `${(2.8 + (index % 3) * 0.4).toFixed(2)}s`;

          // Gönderim sonrası stil durumu
          let stateStyle = 'bg-isler-surface border-isler-primary/35 text-white hover:border-isler-primary hover:bg-isler-elevated shadow-md';

          if (submitted) {
            if (isSelected) {
              if (item.isCorrect) {
                stateStyle =
                  'bg-game-correct/20 border-game-correct text-white shadow-correct-glow ring-2 ring-game-correct/40';
              } else {
                stateStyle =
                  'bg-game-wrong/20 border-game-wrong text-white shadow-wrong-glow ring-2 ring-game-wrong/40';
              }
            } else {
              if (item.isCorrect) {
                // Seçilmemiş ama doğru olanlar (ipucu/öğretici)
                stateStyle =
                  'bg-isler-surface/60 border-dashed border-game-correct/60 text-game-correct/90';
              } else {
                stateStyle = 'bg-isler-deep/40 border-white/10 text-isler-muted/40 opacity-40';
              }
            }
          } else if (isSelected) {
            stateStyle =
              'bg-gradient-to-r from-isler-primary/90 to-isler-hover border-isler-primary text-white shadow-[0_0_20px_rgba(241,78,19,0.55)] scale-[1.04] ring-2 ring-isler-primary/50';
          }

          return (
            <button
              key={item.id}
              type="button"
              disabled={isInteractionDisabled}
              onClick={() => toggleSelect(item.id)}
              style={{
                animation: submitted ? 'none' : `bubbleFloat ${animationDuration} ease-in-out infinite ${animationDelay}`,
              }}
              className={`group relative flex items-center gap-2.5 px-6 py-3.5 md:px-7 md:py-4 rounded-full border transition-all duration-200 cursor-pointer text-base md:text-lg font-poppins font-semibold active:scale-95 disabled:cursor-not-allowed ${stateStyle}`}
            >
              {/* Durum İkonu */}
              {submitted ? (
                isSelected ? (
                  item.isCorrect ? (
                    <Check className="w-5 h-5 text-game-correct shrink-0 stroke-[3]" />
                  ) : (
                    <X className="w-5 h-5 text-game-wrong shrink-0 stroke-[3]" />
                  )
                ) : item.isCorrect ? (
                  <Check className="w-4 h-4 text-game-correct/70 shrink-0 stroke-[2]" />
                ) : null
              ) : (
                <span
                  className={`w-3 h-3 rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-white border-white'
                      : 'border-isler-primary/60 bg-transparent group-hover:border-isler-primary'
                  }`}
                />
              )}

              <span>{item.text}</span>

              {/* Kaçırıldı Etiketi */}
              {submitted && !isSelected && item.isCorrect && (
                <span className="text-[11px] font-sans font-normal uppercase tracking-wider text-game-correct/80 bg-game-correct/10 px-2 py-0.5 rounded-full ml-1">
                  Doğruydu
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Onay Butonu & Seçim Özeti */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isInteractionDisabled || selectedIds.length === 0}
          className={`btn-primary px-8 py-3.5 text-base md:text-lg font-poppins font-bold tracking-wide rounded-full flex items-center gap-3 transition-all duration-300 ${
            selectedIds.length === 0 && !submitted
              ? 'opacity-50 cursor-not-allowed hover:transform-none shadow-none'
              : ''
          } ${
            submitted
              ? result?.isCorrect
                ? 'bg-game-correct hover:bg-game-correct text-white cursor-default shadow-correct-glow'
                : 'bg-game-wrong hover:bg-game-wrong text-white cursor-default shadow-wrong-glow'
              : ''
          }`}
        >
          {submitted ? (
            result?.isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Harika! Tam Doğru</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>%{Math.round((result?.accuracy ?? 0) * 100)} Doğruluk</span>
              </>
            )
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>
                Onayla ({selectedIds.length} seçildi)
              </span>
            </>
          )}
        </button>

        {/* Gönderim Sonrası Geri Bildirim Notu */}
        {submitted && result && (
          <div
            className={`text-sm md:text-base font-sans font-medium px-4 py-1.5 rounded-full transition-all animate-fade-in ${
              result.isCorrect
                ? 'text-game-correct bg-game-correct/10 border border-game-correct/30'
                : 'text-game-wrong bg-game-wrong/10 border border-game-wrong/30'
            }`}
          >
            {result.isCorrect
              ? 'Tüm doğru seçenekleri eksiksiz buldunuz!'
              : 'Seçimleriniz tam eşleşmedi. Yeşil ile işaretli olanlar doğru yanıtlardır.'}
          </div>
        )}
      </div>
    </div>
  );
}
