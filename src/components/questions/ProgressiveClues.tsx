import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Clock, CheckCircle2, AlertCircle, Check, X } from 'lucide-react';
import type { ProgressiveCluesQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';

export default function ProgressiveClues({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<ProgressiveCluesQuestion>) {
  const { payload } = question;
  const { clues, options, correctIndex } = payload;

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ isCorrect: boolean; accuracy: number } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInteractionDisabled = disabled || submitted;

  // İpucu zamanlayıcısı (saniye bazlı)
  useEffect(() => {
    if (submitted || disabled) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submitted, disabled]);

  const handleSelectOption = (index: number) => {
    if (isInteractionDisabled) return;

    setSelectedOptionIndex(index);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = index === correctIndex;

    // Açık olan en yüksek aşamanın pointsReward / ilk ipucunun pointsReward
    const unlockedClues = clues.filter((c) => elapsedSeconds >= c.secondsToReveal);
    const latestUnlocked =
      unlockedClues.length > 0 ? unlockedClues[unlockedClues.length - 1] : clues[0];

    const firstReward = clues[0]?.pointsReward || 1;
    const currentReward = latestUnlocked?.pointsReward ?? firstReward;

    const ratio = firstReward > 0 ? currentReward / firstReward : 1;
    const accuracy = isCorrect ? Math.max(0, Math.min(1, Number(ratio.toFixed(2)))) : 0;

    const res = { isCorrect, accuracy };
    setResult(res);
    setSubmitted(true);
    onSubmit(res);
  };

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-2 select-none">
      {/* Aşamalı İpuçları Listesi */}
      <div className="w-full flex flex-col gap-3">
        {clues.map((clue) => {
          // Gönderim yapıldıysa veya süre geldiyse açık kabul et
          const isUnlocked = submitted || elapsedSeconds >= clue.secondsToReveal;
          const remainingSec = Math.max(0, clue.secondsToReveal - elapsedSeconds);

          return (
            <div
              key={clue.stage}
              className={`w-full rounded-2xl border p-4 md:p-4.5 transition-all duration-300 flex items-center justify-between gap-4 ${
                isUnlocked
                  ? 'bg-isler-surface border-isler-primary/40 shadow-sm'
                  : 'bg-isler-surface/30 border-dashed border-white/15 backdrop-blur-md opacity-75'
              }`}
            >
              {/* Sol: Aşama Rozeti & İpucu Metni */}
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <span
                  className={`px-3 py-1.5 rounded-full font-poppins text-xs font-bold tracking-wider shrink-0 uppercase flex items-center gap-1.5 ${
                    isUnlocked
                      ? 'bg-isler-primary/20 text-isler-primary border border-isler-primary/40'
                      : 'bg-isler-deep text-isler-muted border border-white/10'
                  }`}
                >
                  {isUnlocked ? (
                    <Unlock className="w-3.5 h-3.5 text-isler-primary" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-isler-muted" />
                  )}
                  <span>Aşama {clue.stage}</span>
                </span>

                {/* İpucu İçeriği */}
                <div className="flex-1 min-w-0">
                  {isUnlocked ? (
                    <p className="font-sans text-sm md:text-base font-semibold text-white/95 leading-snug">
                      {clue.clueText}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-44 md:w-80 rounded bg-white/10 animate-pulse" />
                      <span className="text-xs text-isler-muted/60 font-sans italic hidden sm:inline">
                        (Gizli İpucu)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sağ: Geri Sayım / Açıldı Durumu */}
              <div className="shrink-0 flex items-center">
                {isUnlocked ? (
                  <span className="text-xs font-poppins font-bold text-game-correct bg-game-correct/10 px-2.5 py-1 rounded-full border border-game-correct/30 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Açık</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-isler-muted bg-isler-deep px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-isler-primary animate-spin" />
                    <span>{remainingSec} sn</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Şıklar / Seçenekler Alanı */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {options.map((option, idx) => {
          const isSelected = selectedOptionIndex === idx;
          const isCorrectOption = idx === correctIndex;

          let cardStyle =
            'bg-isler-surface border-isler-primary/35 text-white hover:border-isler-primary hover:bg-isler-elevated hover:scale-[1.015] shadow-md';

          if (submitted) {
            if (isCorrectOption) {
              cardStyle =
                'bg-game-correct/20 border-game-correct text-white shadow-correct-glow ring-2 ring-game-correct/40';
            } else if (isSelected) {
              cardStyle =
                'bg-game-wrong/20 border-game-wrong text-white shadow-wrong-glow ring-2 ring-game-wrong/40';
            } else {
              cardStyle = 'bg-isler-deep/40 border-white/10 text-isler-muted/40 opacity-40';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isInteractionDisabled}
              onClick={() => handleSelectOption(idx)}
              className={`option-card flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 disabled:cursor-not-allowed ${cardStyle}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-isler-deep border border-isler-primary/30 flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
                  {optionLetters[idx] ?? idx + 1}
                </span>
                <span className="font-poppins text-base md:text-lg font-bold truncate">
                  {option}
                </span>
              </div>

              {/* Doğru / Yanlış İkonu */}
              {submitted && (
                <div className="shrink-0 ml-2">
                  {isCorrectOption ? (
                    <Check className="w-5 h-5 text-game-correct stroke-[3]" />
                  ) : isSelected ? (
                    <X className="w-5 h-5 text-game-wrong stroke-[3]" />
                  ) : null}
                </div>
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
              <span>
                Tebrikler! Doğru cevabı buldunuz (%{Math.round(result.accuracy * 100)} Hız Doğruluğu)!
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              <span>Yanlış yanıt! Doğru cevap yeşil ile gösterilmiştir.</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
