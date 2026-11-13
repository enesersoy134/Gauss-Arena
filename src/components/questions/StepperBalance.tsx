import React, { useState, useMemo } from 'react';
import { Plus, Minus, Scale, Check, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { StepperBalanceQuestion, StepperSlot } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';

interface Segment {
  key: string;
  type: 'text' | 'slot';
  text?: string;
  slot?: StepperSlot;
}

export default function StepperBalance({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<StepperBalanceQuestion>) {
  const { payload } = question;
  const { equationTemplate, targetDescription, slots } = payload;

  // Başlangıç sayaç değerleri
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    slots.forEach((s) => {
      init[s.id] = s.initialValue ?? 1;
    });
    return init;
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ isCorrect: boolean; accuracy: number } | null>(null);

  const isInteractionDisabled = disabled || submitted;

  // equationTemplate'i slotlar ve metin parçalarına böl
  const segments = useMemo<Segment[]>(() => {
    const res: Segment[] = [];
    if (!equationTemplate) {
      // Şablon yoksa sadece slotları ardışık diz
      slots.forEach((s, i) => {
        res.push({ key: `slot-${s.id}`, type: 'slot', slot: s });
        if (i < slots.length - 1) {
          res.push({ key: `sep-${i}`, type: 'text', text: ' + ' });
        }
      });
      return res;
    }

    // Regex: [ {s1} ] veya {s1} veya [ ? ]
    const tokenRegex = /\[?\s*\{([a-zA-Z0-9_-]+)\}\s*\]?|\[\s*\?\s*\]/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let sequentialSlotIndex = 0;

    while ((match = tokenRegex.exec(equationTemplate)) !== null) {
      const matchStart = match.index;
      const matchEnd = tokenRegex.lastIndex;

      // Önceki düz metin parçası
      if (matchStart > lastIndex) {
        const textPiece = equationTemplate.slice(lastIndex, matchStart);
        if (textPiece) {
          res.push({
            key: `text-${lastIndex}`,
            type: 'text',
            text: textPiece,
          });
        }
      }

      // Slot eşleşmesi
      let matchedSlot: StepperSlot | undefined;
      const slotIdParam = match[1];

      if (slotIdParam) {
        matchedSlot = slots.find((s) => s.id === slotIdParam);
      }

      if (!matchedSlot && sequentialSlotIndex < slots.length) {
        matchedSlot = slots[sequentialSlotIndex];
      }
      sequentialSlotIndex++;

      if (matchedSlot) {
        res.push({
          key: `slot-${matchedSlot.id}-${matchStart}`,
          type: 'slot',
          slot: matchedSlot,
        });
      }

      lastIndex = matchEnd;
    }

    // Kalan son metin parçası
    if (lastIndex < equationTemplate.length) {
      const remaining = equationTemplate.slice(lastIndex);
      if (remaining) {
        res.push({
          key: `text-${lastIndex}`,
          type: 'text',
          text: remaining,
        });
      }
    }

    return res;
  }, [equationTemplate, slots]);

  const handleIncrement = (slot: StepperSlot) => {
    if (isInteractionDisabled) return;
    const step = slot.step ?? 1;
    const max = slot.max ?? 99;
    setValues((prev) => {
      const current = prev[slot.id] ?? slot.initialValue ?? 1;
      const next = Math.min(max, current + step);
      return { ...prev, [slot.id]: next };
    });
  };

  const handleDecrement = (slot: StepperSlot) => {
    if (isInteractionDisabled) return;
    const step = slot.step ?? 1;
    const min = slot.min ?? 1;
    setValues((prev) => {
      const current = prev[slot.id] ?? slot.initialValue ?? 1;
      const next = Math.max(min, current - step);
      return { ...prev, [slot.id]: next };
    });
  };

  const handleBalance = () => {
    if (isInteractionDisabled) return;

    let correctCount = 0;
    slots.forEach((s) => {
      const currentVal = values[s.id] ?? s.initialValue ?? 1;
      if (currentVal === s.correctValue) {
        correctCount++;
      }
    });

    const isAllCorrect = correctCount === slots.length;
    const accuracyRaw = slots.length > 0 ? correctCount / slots.length : (isAllCorrect ? 1 : 0);
    const accuracy = Math.max(0, Math.min(1, Number(accuracyRaw.toFixed(2))));

    const res = { isCorrect: isAllCorrect, accuracy };
    setResult(res);
    setSubmitted(true);
    onSubmit(res);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-2 select-none">
      {/* Hedef Bilgilendirme / İpucu Rozeti */}
      {targetDescription && (
        <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-isler-surface/90 border border-isler-primary/30 text-isler-muted font-sans text-sm md:text-base font-medium shadow-sm">
          <Scale className="w-4 h-4 text-isler-primary shrink-0 animate-pulse" />
          <span>{targetDescription}</span>
        </div>
      )}

      {/* Ana Denklem & Stepper Kartı */}
      <div className="w-full rounded-2xl bg-isler-surface/90 border border-isler-primary/40 p-4 md:p-8 shadow-isler-glow backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-4 text-center">
          {segments.map((seg) => {
            if (seg.type === 'slot' && seg.slot) {
              const slot = seg.slot;
              const val = values[slot.id] ?? slot.initialValue ?? 1;
              const isCorrectSlot = val === slot.correctValue;
              const minVal = slot.min ?? 1;
              const maxVal = slot.max ?? 99;

              let slotBorder = 'border-isler-primary/50 bg-isler-deep';
              if (submitted) {
                slotBorder = isCorrectSlot
                  ? 'border-game-correct shadow-correct-glow bg-game-correct/10'
                  : 'border-game-wrong shadow-wrong-glow bg-game-wrong/10';
              }

              return (
                <div
                  key={seg.key}
                  className="inline-flex flex-col items-center gap-1.5 p-1.5 rounded-xl bg-isler-elevated/40 border border-white/5"
                >
                  {/* [+] Artır Butonu */}
                  <button
                    type="button"
                    disabled={isInteractionDisabled || val >= maxVal}
                    onClick={() => handleIncrement(slot)}
                    aria-label={`${slot.id} artır`}
                    className="w-12 h-9 md:w-14 md:h-10 rounded-lg bg-isler-primary hover:bg-isler-hover active:scale-95 text-white flex items-center justify-center transition-all shadow-btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </button>

                  {/* Sayaç Ekranı */}
                  <div
                    className={`relative w-12 h-14 md:w-14 md:h-16 rounded-xl border-2 flex items-center justify-center font-mono text-2xl md:text-3xl font-extrabold text-white transition-all ${slotBorder}`}
                  >
                    <span>{val}</span>

                    {/* Sonuç Onay / Hata Rozeti */}
                    {submitted && (
                      <div className="absolute -top-2 -right-2">
                        {isCorrectSlot ? (
                          <div className="w-5 h-5 rounded-full bg-game-correct text-black flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-game-wrong text-white flex items-center justify-center shadow-md">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* [-] Azalt Butonu */}
                  <button
                    type="button"
                    disabled={isInteractionDisabled || val <= minVal}
                    onClick={() => handleDecrement(slot)}
                    aria-label={`${slot.id} azalt`}
                    className="w-12 h-9 md:w-14 md:h-10 rounded-lg bg-isler-surface border border-isler-primary/40 hover:bg-isler-elevated active:scale-95 text-isler-muted hover:text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Minus className="w-5 h-5 stroke-[3]" />
                  </button>

                  {/* Gönderim Sonrası Doğru Değer İpucu */}
                  {submitted && !isCorrectSlot && (
                    <span className="text-[11px] font-mono font-bold text-game-correct bg-game-correct/10 px-1.5 py-0.5 rounded border border-game-correct/30 mt-0.5">
                      Hedef: {slot.correctValue}
                    </span>
                  )}
                </div>
              );
            }

            // Düz Metin / Operatör Parçası
            const textContent = seg.text ?? '';
            const isArrow = textContent.includes('→') || textContent.includes('->');

            return (
              <span
                key={seg.key}
                className={`font-poppins select-text font-bold ${
                  isArrow
                    ? 'text-isler-primary text-2xl md:text-4xl px-1 md:px-2 drop-shadow-[0_0_12px_rgba(241,78,19,0.7)]'
                    : 'text-white text-xl md:text-3xl tracking-wide'
                }`}
              >
                {textContent}
              </span>
            );
          })}
        </div>
      </div>

      {/* Dengele Onay Butonu */}
      <div className="flex flex-col items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleBalance}
          disabled={isInteractionDisabled}
          className={`btn-primary px-10 py-3.5 text-base md:text-lg font-poppins font-bold tracking-wide rounded-full flex items-center gap-3 transition-all duration-300 ${
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
                <span>Tepkime Tam Dengelendi!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>%{Math.round((result?.accuracy ?? 0) * 100)} Denge Sağlandı</span>
              </>
            )
          ) : (
            <>
              <Scale className="w-5 h-5" />
              <span>Dengeyi Onayla</span>
            </>
          )}
        </button>

        {/* Gönderim Sonrası Durum Metni */}
        {submitted && result && (
          <div
            className={`text-sm md:text-base font-sans font-medium px-4 py-1.5 rounded-full transition-all ${
              result.isCorrect
                ? 'text-game-correct bg-game-correct/10 border border-game-correct/30'
                : 'text-game-wrong bg-game-wrong/10 border border-game-wrong/30'
            }`}
          >
            {result.isCorrect
              ? 'Tüm katsayılar doğru! Kütle ve atom korunumu sağlandı.'
              : 'Denge sağlanamadı. Kırmızı ile gösterilen yerlerdeki hedef katsayılara dikkat edin.'}
          </div>
        )}
      </div>
    </div>
  );
}
