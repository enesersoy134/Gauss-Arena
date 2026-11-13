import React, { useState } from 'react';
import type { ChainConversionQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { ArrowRight, Check, X, Sparkles, RotateCcw } from 'lucide-react';

export const ChainConversion: React.FC<QuestionComponentProps<ChainConversionQuestion>> = ({
  question,
  onSubmit,
  disabled,
}) => {
  const { startEntity, steps, poolOptions } = question.payload;

  // Her adımın seçilen değeri: index -> seçilen metin | null
  const [userSelections, setUserSelections] = useState<(string | null)[]>(
    () => new Array(steps.length).fill(null)
  );

  // Aktif doldurulan adımın indeksi
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Gönderim yapıldı mı?
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Seçilmiş havuz öğeleri seti
  const selectedValues = userSelections.filter(Boolean) as string[];

  // Havuzdan bir öğe tıklandığında
  const handleSelectPoolItem = (option: string) => {
    if (disabled || isSubmitted) return;
    if (selectedValues.includes(option)) return;

    // Aktif adıma bu değeri koy
    const nextSelections = [...userSelections];
    const targetIdx = activeStepIndex < steps.length ? activeStepIndex : nextSelections.findIndex((v) => v === null);

    if (targetIdx !== -1) {
      nextSelections[targetIdx] = option;
      setUserSelections(nextSelections);

      // Sıradaki ilk boş adımı bul ve aktif yap
      const nextEmptyIdx = nextSelections.findIndex((v) => v === null);
      if (nextEmptyIdx !== -1) {
        setActiveStepIndex(nextEmptyIdx);
      } else {
        // Hepsi doldu
        setActiveStepIndex(-1);
      }
    }
  };

  // Bir adım kutusuna tıklandığında (temizle ve aktif yap)
  const handleStepClick = (index: number) => {
    if (disabled || isSubmitted) return;
    const nextSelections = [...userSelections];
    nextSelections[index] = null;
    setUserSelections(nextSelections);
    setActiveStepIndex(index);
  };

  // Tümünü sıfırla
  const handleReset = () => {
    if (disabled || isSubmitted) return;
    setUserSelections(new Array(steps.length).fill(null));
    setActiveStepIndex(0);
  };

  // Tüm adımlar dolu mu?
  const isAllFilled = userSelections.every((v) => v !== null);

  // Gönder
  const handleSubmit = () => {
    if (disabled || isSubmitted || !isAllFilled) return;

    let correctCount = 0;
    steps.forEach((step, idx) => {
      if (userSelections[idx] === step.correctValue) {
        correctCount += 1;
      }
    });

    const accuracy = steps.length > 0 ? correctCount / steps.length : 0;
    const isCorrect = correctCount === steps.length;

    setIsSubmitted(true);
    onSubmit({ isCorrect, accuracy });
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 select-none font-sans">
      {/* 1. ÜST: YATAY ZİNCİR AKIŞI */}
      <div className="w-full overflow-x-auto pb-4 pt-2 px-1">
        <div className="flex items-center justify-center min-w-max gap-3 mx-auto">
          {/* Başlangıç Değeri Kartı */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-isler-surface border border-isler-primary/30 w-52 min-h-[140px] shadow-lg relative">
            <span className="text-[11px] font-poppins font-bold uppercase tracking-wider text-isler-muted/80 bg-isler-deep/80 px-2.5 py-1 rounded-full mb-2">
              Başlangıç
            </span>
            <div className="text-white font-mono text-lg font-bold text-center leading-snug break-words px-2">
              {startEntity}
            </div>
            <span className="text-[11px] text-isler-muted/60 mt-2 font-medium">
              Girdi Tanımlandı
            </span>
          </div>

          {/* Adımlar ve Ara Bağlantı Okları */}
          {steps.map((step, idx) => {
            const chosenValue = userSelections[idx];
            const isActive = !isSubmitted && activeStepIndex === idx;
            const isFilled = chosenValue !== null;

            // Değerlendirme durumları
            const isStepCorrect = isSubmitted && chosenValue === step.correctValue;
            const isStepWrong = isSubmitted && chosenValue !== step.correctValue;

            return (
              <React.Fragment key={step.stepNumber}>
                {/* Ara Ok & Etiket */}
                <div className="flex flex-col items-center justify-center px-1">
                  {step.arrowLabel && (
                    <span className="text-[11px] font-mono font-semibold text-isler-primary bg-isler-deep border border-isler-primary/30 px-2 py-0.5 rounded-full mb-1 max-w-[120px] truncate text-center shadow">
                      {step.arrowLabel}
                    </span>
                  )}
                  <div className="flex items-center text-isler-primary">
                    <div className="w-8 h-0.5 bg-isler-primary/60" />
                    <ArrowRight className="w-5 h-5 -ml-1 text-isler-primary" />
                  </div>
                </div>

                {/* Adım Hedef Kutusu */}
                <button
                  type="button"
                  disabled={disabled || isSubmitted}
                  onClick={() => handleStepClick(idx)}
                  className={`
                    group flex flex-col items-center justify-center p-4 rounded-2xl w-56 min-h-[140px] text-left transition-all duration-200 relative
                    ${
                      isStepCorrect
                        ? 'bg-game-correct/15 border-2 border-game-correct shadow-correct-glow'
                        : isStepWrong
                        ? 'bg-game-wrong/15 border-2 border-game-wrong shadow-wrong-glow'
                        : isActive
                        ? 'bg-isler-elevated/90 border-2 border-dashed border-isler-primary shadow-[0_0_20px_rgba(241,78,19,0.4)] scale-105'
                        : isFilled
                        ? 'bg-isler-surface border border-isler-primary/60 hover:border-isler-primary hover:bg-isler-elevated cursor-pointer'
                        : 'bg-isler-deep/60 border border-white/10 hover:border-white/20'
                    }
                  `}
                >
                  {/* Adım Başlığı & Rozeti */}
                  <div className="flex items-center justify-between w-full mb-2">
                    <span
                      className={`text-[11px] font-poppins font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isStepCorrect
                          ? 'bg-game-correct/20 text-game-correct'
                          : isStepWrong
                          ? 'bg-game-wrong/20 text-game-wrong'
                          : isActive
                          ? 'bg-isler-primary text-white animate-pulse'
                          : 'bg-isler-deep text-isler-muted'
                      }`}
                    >
                      {idx + 1}. Adım
                    </span>

                    {/* Durum İkonu */}
                    {isStepCorrect && <Check className="w-4 h-4 text-game-correct" />}
                    {isStepWrong && <X className="w-4 h-4 text-game-wrong" />}
                    {!isSubmitted && isFilled && (
                      <span className="text-[10px] text-isler-muted/50 group-hover:text-isler-primary transition-colors">
                        Değiştir
                      </span>
                    )}
                  </div>

                  {/* Değer Alanı */}
                  <div className="flex-1 flex items-center justify-center w-full my-1">
                    {chosenValue ? (
                      <div
                        className={`text-center font-mono font-bold text-base px-2 leading-snug break-words ${
                          isStepCorrect
                            ? 'text-game-correct'
                            : isStepWrong
                            ? 'text-game-wrong line-through'
                            : 'text-white'
                        }`}
                      >
                        {chosenValue}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span
                          className={`font-mono text-2xl font-bold ${
                            isActive ? 'text-isler-primary' : 'text-isler-muted/40'
                          }`}
                        >
                          ?
                        </span>
                        <span className="text-[11px] text-isler-muted/50 mt-1">
                          {isActive ? 'Havuzdan Seçin' : 'Bekliyor'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Yanlış ise alt tarafta doğru cevabı göster */}
                  {isStepWrong && (
                    <div className="w-full text-center text-[11px] font-mono font-semibold text-game-correct bg-game-correct/10 rounded py-0.5 mt-1">
                      Doğru: {step.correctValue}
                    </div>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 2. ORTA: SEÇENEK HAVUZU */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-3 mt-2">
        <div className="flex items-center justify-between w-full px-2">
          <span className="text-xs font-poppins font-semibold uppercase tracking-wider text-isler-muted">
            Seçenek Havuzu
          </span>
          {!isSubmitted && userSelections.some(Boolean) && !disabled && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-isler-muted/70 hover:text-isler-primary transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Sıfırla
            </button>
          )}
        </div>

        <div className="w-full flex flex-wrap gap-2.5 justify-center">
          {poolOptions.map((option) => {
            const isUsed = selectedValues.includes(option);

            return (
              <button
                key={option}
                type="button"
                disabled={disabled || isSubmitted || isUsed}
                onClick={() => handleSelectPoolItem(option)}
                className={`
                  px-4 py-2.5 rounded-xl font-mono text-sm font-semibold transition-all duration-200 border text-center
                  ${
                    isUsed
                      ? 'bg-isler-deep/60 border-white/5 text-isler-muted/30 cursor-not-allowed scale-95'
                      : 'bg-isler-surface border-isler-primary/30 text-white hover:bg-isler-elevated hover:border-isler-primary hover:-translate-y-0.5 active:scale-95 shadow cursor-pointer'
                  }
                `}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ALT: AKSİYON / GÖNDER BUTONU */}
      {!isSubmitted && (
        <div className="mt-2 flex items-center justify-center">
          <button
            type="button"
            disabled={disabled || !isAllFilled}
            onClick={handleSubmit}
            className={`
              btn-primary px-8 py-3 rounded-full font-poppins font-bold text-sm tracking-wide uppercase transition-all duration-200 flex items-center gap-2
              ${
                !isAllFilled || disabled
                  ? 'opacity-40 cursor-not-allowed bg-isler-surface border border-white/10 text-isler-muted shadow-none pointer-events-none'
                  : 'bg-isler-primary text-white shadow-btn-glow hover:bg-isler-hover active:scale-95 cursor-pointer'
              }
            `}
          >
            <Sparkles className="w-4 h-4" />
            Zinciri Tamamla
          </button>
        </div>
      )}
    </div>
  );
};

export default ChainConversion;
