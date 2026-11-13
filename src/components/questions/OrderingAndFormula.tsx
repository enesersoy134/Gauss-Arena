import React, { useState, useEffect, useMemo } from 'react';
import type { OrderingAndFormulaQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { ArrowRight, RotateCcw, Lock, CheckCircle2, XCircle, GripVertical } from 'lucide-react';

interface PoolItem {
  id: string;
  text: string;
}

export default function OrderingAndFormula({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<OrderingAndFormulaQuestion>) {
  const { payload } = question;
  const slotCount = payload.correctOrder?.length || payload.items?.length || 0;

  const itemsKey = (payload.items || []).join('\u0000');

  // Başlangıç pool öğeleri
  const initialPool = useMemo<PoolItem[]>(() => {
    return (payload.items || []).map((text, idx) => ({
      id: `${idx}__${text}`,
      text,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, itemsKey]);

  // Yuvalardaki öğeler: uzunluğu slotCount olan dizi (null: boş yuva)
  const [slots, setSlots] = useState<(PoolItem | null)[]>(() => Array(slotCount).fill(null));
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Soru değiştiğinde durumu sıfırla
  useEffect(() => {
    setSlots(Array(slotCount).fill(null));
    setIsSubmitted(false);
  }, [question.id, slotCount]);

  const isLocked = disabled || isSubmitted;

  // Havuzda kalan (henüz hiçbir yuvaya yerleştirilmemiş) öğeler
  const availablePool = useMemo(() => {
    const placedIds = new Set(slots.filter((s): s is PoolItem => s !== null).map((s) => s.id));
    return initialPool.filter((item) => !placedIds.has(item.id));
  }, [initialPool, slots]);

  // Havuzdan bir öğeye tıklandığında: ilk boş yuvaya yerleştir
  const handlePoolItemClick = (item: PoolItem) => {
    if (isLocked) return;
    const firstEmptyIndex = slots.findIndex((s) => s === null);
    if (firstEmptyIndex === -1) return; // Tüm yuvalar dolu

    const nextSlots = [...slots];
    nextSlots[firstEmptyIndex] = item;
    setSlots(nextSlots);
  };

  // Yuvadaki öğeye tıklandığında: yuvadan çıkar (havuza geri döner)
  const handleSlotClick = (slotIndex: number) => {
    if (isLocked) return;
    if (slots[slotIndex] === null) return;

    const nextSlots = [...slots];
    nextSlots[slotIndex] = null;
    setSlots(nextSlots);
  };

  // Sıfırla (tüm yuvaları boşalt)
  const handleReset = () => {
    if (isLocked) return;
    setSlots(Array(slotCount).fill(null));
  };

  // Kilitle ve Gönder
  const handleLockAndSubmit = () => {
    if (isLocked) return;

    const correctOrder = payload.correctOrder || [];
    let correctCount = 0;

    const isExactMatch =
      slots.length === correctOrder.length &&
      slots.every((slot, idx) => {
        const isMatch = slot?.text === correctOrder[idx];
        if (isMatch) correctCount++;
        return isMatch;
      });

    const accuracy = correctOrder.length > 0 ? correctCount / correctOrder.length : 0;
    setIsSubmitted(true);

    onSubmit({
      isCorrect: isExactMatch,
      accuracy,
    });
  };

  const isAllFilled = slots.every((s) => s !== null);

  /* =========================================================================
   * FORMULA_BUILDER ŞABLON AYRIŞTIRMA
   * ========================================================================= */
  // Örn: "[ ? ] = [ ? ] × [ ? ]" -> parçalara böl
  const templateParts = useMemo(() => {
    if (payload.mode !== 'formula_builder' || !payload.template) return null;
    // Regex ile `[ ? ]` veya `[?]` yuvalarını ayır
    return payload.template.split(/(\[\s*\?\s*\])/g);
  }, [payload.mode, payload.template]);

  let slotCounter = 0;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* =========================================================================
       * ÜST: YÖN ETİKETİ (Varsa)
       * ========================================================================= */}
      {payload.directionLabel && (
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-isler-primary/10 border border-isler-primary/30 text-[#FF7A45] font-poppins text-xs font-bold uppercase tracking-wider">
            <span>{payload.directionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>

          {!isLocked && slots.some((s) => s !== null) && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-poppins font-semibold text-isler-muted hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded bg-isler-surface border border-white/10"
            >
              <RotateCcw className="w-3 h-3" /> Temizle
            </button>
          )}
        </div>
      )}

      {/* =========================================================================
       * ORTA ALAN: FORMÜL ŞABLONU VEYA SIRALAMA YUVALARI
       * ========================================================================= */}
      {payload.mode === 'formula_builder' && templateParts ? (
        /* FORMÜL ŞABLON GÖRÜNÜMÜ */
        <div className="p-4 md:p-6 rounded-2xl bg-isler-deep border border-isler-primary/35 flex flex-wrap items-center justify-center gap-2 md:gap-3 min-h-[110px]">
          {templateParts.map((part, partIdx) => {
            const isSlot = /\[\s*\?\s*\]/.test(part);

            if (!isSlot) {
              if (!part.trim()) return null;
              return (
                <span
                  key={`op-${partIdx}`}
                  className="font-mono font-bold text-2xl md:text-3xl text-white px-1 select-none"
                >
                  {part}
                </span>
              );
            }

            const currentSlotIdx = slotCounter++;
            const placedItem = slots[currentSlotIdx];
            const isTargetCorrect =
              isSubmitted && placedItem?.text === payload.correctOrder?.[currentSlotIdx];

            let slotStyle = 'border-2 border-dashed border-isler-primary/50 bg-[#1A0E1C] text-isler-muted';

            if (placedItem) {
              slotStyle = 'border-2 border-isler-primary bg-gradient-to-r from-isler-primary/20 to-isler-surface text-white shadow-[0_0_15px_rgba(241,78,19,0.35)]';
              if (isSubmitted) {
                if (isTargetCorrect) {
                  slotStyle = 'border-2 border-[#22C55E] bg-[#22C55E]/20 text-white shadow-[0_0_15px_rgba(34,197,94,0.45)]';
                } else {
                  slotStyle = 'border-2 border-[#EF4444] bg-[#EF4444]/20 text-white shadow-[0_0_15px_rgba(239,68,68,0.45)]';
                }
              }
            }

            return (
              <button
                key={`slot-${currentSlotIdx}`}
                type="button"
                disabled={isLocked}
                onClick={() => handleSlotClick(currentSlotIdx)}
                className={`min-w-[70px] md:min-w-[90px] h-[60px] md:h-[70px] px-3.5 rounded-xl flex items-center justify-center font-mono font-bold text-xl md:text-2xl transition-all duration-200 select-none ${slotStyle} ${
                  !isLocked && placedItem ? 'cursor-pointer hover:border-[#EF4444] hover:bg-[#EF4444]/10 active:scale-95' : ''
                } ${!isLocked && !placedItem ? 'cursor-default' : ''}`}
                title={placedItem && !isLocked ? 'Çıkarmak için dokunun' : undefined}
              >
                {placedItem ? placedItem.text : '?'}
              </button>
            );
          })}
        </div>
      ) : (
        /* SIRALAMA (SEQUENCE) YUVALARI */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {slots.map((placedItem, slotIdx) => {
            const isTargetCorrect =
              isSubmitted && placedItem?.text === payload.correctOrder?.[slotIdx];

            let slotCardStyle = 'border-2 border-dashed border-isler-primary/40 bg-isler-deep/60';

            if (placedItem) {
              slotCardStyle = 'border-2 border-isler-primary bg-gradient-to-b from-isler-elevated to-isler-surface shadow-[0_0_20px_-5px_rgba(241,78,19,0.4)]';
              if (isSubmitted) {
                if (isTargetCorrect) {
                  slotCardStyle = 'border-2 border-[#22C55E] bg-gradient-to-b from-[#22C55E]/20 to-isler-surface shadow-[0_0_20px_-5px_rgba(34,197,94,0.5)]';
                } else {
                  slotCardStyle = 'border-2 border-[#EF4444] bg-gradient-to-b from-[#EF4444]/20 to-isler-surface shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)]';
                }
              }
            }

            return (
              <button
                key={slotIdx}
                type="button"
                disabled={isLocked}
                onClick={() => handleSlotClick(slotIdx)}
                className={`relative flex flex-col justify-between p-4 rounded-xl transition-all duration-200 min-h-[105px] text-left select-none ${slotCardStyle} ${
                  !isLocked && placedItem ? 'cursor-pointer hover:border-[#EF4444] active:scale-95' : 'cursor-default'
                }`}
                title={placedItem && !isLocked ? 'Yuvadan çıkarmak için dokunun' : undefined}
              >
                {/* Yuva Numarası / Durum Başlığı */}
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="w-6 h-6 rounded-full bg-isler-surface border border-isler-primary/30 flex items-center justify-center font-mono text-xs font-bold text-[#FF7A45]">
                    {slotIdx + 1}
                  </span>

                  {isSubmitted && placedItem && (
                    <span>
                      {isTargetCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#EF4444]" />
                      )}
                    </span>
                  )}
                </div>

                {/* Yuva İçeriği */}
                <div className="flex-1 flex items-center">
                  {placedItem ? (
                    <span className="font-poppins font-semibold text-sm md:text-base text-white break-words">
                      {placedItem.text}
                    </span>
                  ) : (
                    <span className="text-xs font-poppins font-medium text-isler-muted/60 italic">
                      [ {slotIdx + 1}. Boş Yuva ]
                    </span>
                  )}
                </div>

                {placedItem && !isLocked && (
                  <span className="text-[10px] font-poppins text-isler-muted/60 mt-1">
                    Geri almak için dokun
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* =========================================================================
       * ALT: HAVUZ (SEÇİLEBİLİR BLOKLAR)
       * ========================================================================= */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-poppins font-bold text-isler-muted uppercase tracking-wider flex items-center gap-1.5">
            📦 Blok Havuzu ({availablePool.length} Kalan)
          </span>
          <span className="text-[11px] font-poppins text-isler-muted/70">
            {isLocked ? 'Kilitlendi' : 'Boş yuvaya göndermek için tıkla'}
          </span>
        </div>

        {availablePool.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {availablePool.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isLocked}
                onClick={() => handlePoolItemClick(item)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-isler-surface border border-isler-primary/35 text-white font-poppins font-semibold text-sm transition-all duration-200 shadow-md ${
                  !isLocked
                    ? 'cursor-pointer hover:border-isler-primary hover:bg-isler-elevated hover:scale-105 active:scale-95'
                    : 'cursor-default opacity-50'
                }`}
              >
                <GripVertical className="w-3.5 h-3.5 text-isler-primary/60 group-hover:text-isler-primary transition-colors" />
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-isler-surface/40 border border-white/5 text-center text-xs font-poppins text-isler-muted">
            Tüm bloklar yuvalara yerleştirildi.
          </div>
        )}
      </div>

      {/* =========================================================================
       * KİLİTLE VE GÖNDER BUTONU
       * ========================================================================= */}
      {!isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={isLocked || !isAllFilled}
            onClick={handleLockAndSubmit}
            className={`btn-primary px-8 py-3.5 text-sm md:text-base flex items-center gap-2 ${
              !isAllFilled || isLocked ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Sıralamayı Kilitle ve Gönder</span>
          </button>
        </div>
      )}

      {/* Geri Bildirim Özeti */}
      {isSubmitted && (
        <div className="p-3.5 rounded-xl bg-isler-surface border border-isler-primary/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slots.every((s, i) => s?.text === payload.correctOrder?.[i]) ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                <span className="text-sm font-poppins font-bold text-[#4ADE80]">
                  Tebrikler! Sıralama kusursuz tamamlandı.
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-[#EF4444]" />
                <span className="text-sm font-poppins font-bold text-[#F87171]">
                  Doğru sıra:{' '}
                  <span className="text-white font-mono font-normal">
                    {payload.correctOrder?.join(' → ')}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
