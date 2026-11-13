import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { SwipeGroupingQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface CardResult {
  cardId: string;
  text: string;
  chosen: 'left' | 'right';
  correctCategory: 'left' | 'right';
  isCorrect: boolean;
}

export default function SwipeGrouping({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<SwipeGroupingQuestion>) {
  const { payload } = question;
  const cards = payload.cards || [];
  const totalCards = cards.length;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [results, setResults] = useState<CardResult[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sürükleme durumu
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState<'left' | 'right' | null>(null);

  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Soru değiştiğinde sıfırla
  useEffect(() => {
    setCurrentIndex(0);
    setResults([]);
    setIsSubmitted(false);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setIsAnimatingOut(null);
  }, [question.id]);

  const isLocked = disabled || isSubmitted;

  // Kartı kaydırma aksiyonu (Sola veya Sağa)
  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (isLocked || currentIndex >= totalCards || isAnimatingOut) return;

      const currentCard = cards[currentIndex];
      const isCorrect = currentCard.correctCategory === direction;
      const nextResults = [
        ...results,
        {
          cardId: currentCard.id,
          text: currentCard.text,
          chosen: direction,
          correctCategory: currentCard.correctCategory,
          isCorrect,
        },
      ];

      setIsAnimatingOut(direction);

      setTimeout(() => {
        setResults(nextResults);
        setDragOffset({ x: 0, y: 0 });
        setIsAnimatingOut(null);
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        // Tüm kartlar bitti mi?
        if (nextIndex >= totalCards) {
          setIsSubmitted(true);
          const correctCount = nextResults.filter((r) => r.isCorrect).length;
          const accuracy = totalCards > 0 ? correctCount / totalCards : 0;
          const isAllCorrect = accuracy === 1;

          onSubmit({
            isCorrect: isAllCorrect,
            accuracy,
          });
        }
      }, 200);
    },
    [isLocked, currentIndex, totalCards, isAnimatingOut, cards, results, onSubmit]
  );

  // Klavye Kontrolleri (← / A ve → / D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked || currentIndex >= totalCards) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleSwipe('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleSwipe('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, currentIndex, totalCards, handleSwipe]);

  // Pointer Events ile Sürükleme
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked || currentIndex >= totalCards || isAnimatingOut) return;
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };

    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (cardRef.current && cardRef.current.hasPointerCapture(e.pointerId)) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }

    // 100px eşiği
    if (dragOffset.x < -100) {
      handleSwipe('left');
    } else if (dragOffset.x > 100) {
      handleSwipe('right');
    } else {
      // Geri yaylanma
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Aktif kartın dönüş açısı ve stili
  const rotation = isAnimatingOut === 'left' ? -25 : isAnimatingOut === 'right' ? 25 : Math.max(-20, Math.min(20, dragOffset.x * 0.1));
  const translateX = isAnimatingOut === 'left' ? -400 : isAnimatingOut === 'right' ? 400 : dragOffset.x;
  const translateY = isAnimatingOut ? 0 : dragOffset.y * 0.3;

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];
  const thirdCard = cards[currentIndex + 2];

  // Tamamlandı Özeti Ekranı
  if (currentIndex >= totalCards) {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const accuracy = totalCards > 0 ? correctCount / totalCards : 0;

    return (
      <div className="w-full flex flex-col gap-6">
        <div className="p-6 rounded-2xl bg-isler-surface border border-isler-primary/45 flex flex-col items-center justify-center text-center shadow-[0_0_30px_-10px_rgba(241,78,19,0.4)]">
          <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 border-2 border-[#22C55E] flex items-center justify-center mb-3">
            <Sparkles className="w-8 h-8 text-[#4ADE80]" />
          </div>

          <h3 className="font-poppins font-bold text-2xl text-white mb-1">
            Gruplama Tamamlandı!
          </h3>
          <p className="text-sm font-poppins text-isler-muted mb-4">
            Toplam {totalCards} kart sınıflandırıldı.
          </p>

          <div className="px-4 py-2 rounded-full bg-isler-deep border border-isler-primary/30 font-mono font-bold text-lg text-[#FF7A45]">
            {correctCount} / {totalCards} Doğru (%{Math.round(accuracy * 100)})
          </div>
        </div>

        {/* Grupların Detaylı Dağılımı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sol Kategori Sonuçları */}
          <div className="p-4 rounded-xl bg-isler-deep border border-[#3B82F6]/40 flex flex-col gap-2">
            <span className="font-poppins font-bold text-xs text-[#60A5FA] uppercase tracking-wider mb-1">
              {payload.leftCategory.label} (Kabul Edilenler)
            </span>
            {results
              .filter((r) => r.chosen === 'left')
              .map((r) => (
                <div
                  key={r.cardId}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-poppins font-semibold ${
                    r.isCorrect
                      ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-white'
                      : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#F87171]'
                  }`}
                >
                  <span>{r.text}</span>
                  {r.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#EF4444]" />
                  )}
                </div>
              ))}
          </div>

          {/* Sağ Kategori Sonuçları */}
          <div className="p-4 rounded-xl bg-isler-deep border border-[#F14E13]/40 flex flex-col gap-2">
            <span className="font-poppins font-bold text-xs text-[#FF7A45] uppercase tracking-wider mb-1">
              {payload.rightCategory.label} (Kabul Edilenler)
            </span>
            {results
              .filter((r) => r.chosen === 'right')
              .map((r) => (
                <div
                  key={r.cardId}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-poppins font-semibold ${
                    r.isCorrect
                      ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-white'
                      : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#F87171]'
                  }`}
                >
                  <span>{r.text}</span>
                  {r.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#EF4444]" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * OYUN SAHASI (KART DESTE VE HEDEFLER)
   * ========================================================================= */
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Kalan Kart Sayacı */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-poppins font-bold text-isler-muted uppercase tracking-wider">
          Kartı basılı tutup sola/sağa fırlatın veya butonları kullanın
        </span>
        <span className="px-3 py-1 rounded-full bg-isler-deep border border-isler-primary/30 font-mono text-xs font-bold text-[#FF7A45]">
          Kalan: {totalCards - currentIndex} / {totalCards}
        </span>
      </div>

      {/* Sürükleme & Deste Arenası */}
      <div className="relative min-h-[320px] md:min-h-[380px] flex items-center justify-between px-2 md:px-8 overflow-hidden select-none">
        {/* SOL HEDEF BÖLGESİ (Aura) */}
        <div
          className={`hidden md:flex flex-col items-center justify-center p-6 w-[200px] h-[260px] rounded-2xl border-2 border-dashed transition-all duration-200 ${
            dragOffset.x < -30
              ? 'border-[#3B82F6] bg-[#3B82F6]/20 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-105'
              : 'border-[#3B82F6]/30 bg-[#3B82F6]/5 opacity-60'
          }`}
        >
          <ArrowLeft className="w-10 h-10 text-[#60A5FA] mb-2" />
          <span className="font-poppins font-bold text-sm text-[#60A5FA] text-center">
            {payload.leftCategory.label}
          </span>
          <span className="text-[11px] font-mono text-isler-muted mt-2">[← A]</span>
        </div>

        {/* ORTA DESTE ALANI */}
        <div className="relative flex-1 flex items-center justify-center h-full">
          {/* 3. Katman (En Alttaki Kart Önizlemesi) */}
          {thirdCard && (
            <div
              className="absolute w-[280px] md:w-[340px] h-[210px] md:h-[240px] rounded-2xl bg-isler-deep border border-isler-primary/20 pointer-events-none transition-transform"
              style={{
                transform: 'scale(0.88) translateY(24px)',
                opacity: 0.35,
              }}
            />
          )}

          {/* 2. Katman (Bir Sonraki Kart Önizlemesi) */}
          {nextCard && (
            <div
              className="absolute w-[290px] md:w-[350px] h-[220px] md:h-[250px] rounded-2xl bg-isler-surface border border-isler-primary/30 flex flex-col items-center justify-center pointer-events-none transition-transform"
              style={{
                transform: 'scale(0.94) translateY(12px)',
                opacity: 0.7,
              }}
            >
              <span className="text-xs font-poppins font-semibold text-isler-muted">
                Sıradaki: {nextCard.text}
              </span>
            </div>
          )}

          {/* 1. Katman (En Üstteki Aktif Sürüklenebilir Kart) */}
          {currentCard && (
            <div
              ref={cardRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation}deg)`,
                touchAction: 'none',
                transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
              className={`relative z-20 w-[300px] md:w-[360px] h-[230px] md:h-[260px] p-6 rounded-2xl bg-gradient-to-b from-isler-elevated to-isler-surface border-2 border-isler-primary flex flex-col items-center justify-between text-center shadow-[0_10px_35px_-10px_rgba(241,78,19,0.6)] cursor-grab active:cursor-grabbing select-none`}
            >
              {/* Dinamik Damga / Stamp Overlay */}
              {dragOffset.x < -30 && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-lg border-2 border-[#3B82F6] bg-[#3B82F6]/30 text-[#60A5FA] font-poppins font-black text-xs uppercase tracking-wider rotate-12 pointer-events-none">
                  {payload.leftCategory.label}
                </div>
              )}

              {dragOffset.x > 30 && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg border-2 border-[#F14E13] bg-[#F14E13]/30 text-[#FF7A45] font-poppins font-black text-xs uppercase tracking-wider -rotate-12 pointer-events-none">
                  {payload.rightCategory.label}
                </div>
              )}

              <span className="text-xs font-poppins font-bold text-[#FF7A45] uppercase tracking-wider">
                Kart #{currentIndex + 1}
              </span>

              {/* Kart İçerik Metni */}
              <div className="flex-1 flex items-center justify-center my-2">
                <span className="font-poppins font-extrabold text-2xl md:text-3xl text-white break-words">
                  {currentCard.text}
                </span>
              </div>

              <div className="w-full flex items-center justify-between text-[11px] font-poppins text-isler-muted/70 px-1 border-t border-white/10 pt-2">
                <span>◀ Sola Sürükle</span>
                <span>Sağa Sürükle ▶</span>
              </div>
            </div>
          )}
        </div>

        {/* SAĞ HEDEF BÖLGESİ (Aura) */}
        <div
          className={`hidden md:flex flex-col items-center justify-center p-6 w-[200px] h-[260px] rounded-2xl border-2 border-dashed transition-all duration-200 ${
            dragOffset.x > 30
              ? 'border-[#F14E13] bg-[#F14E13]/20 shadow-[0_0_30px_rgba(241,78,19,0.5)] scale-105'
              : 'border-[#F14E13]/30 bg-[#F14E13]/5 opacity-60'
          }`}
        >
          <ArrowRight className="w-10 h-10 text-[#FF7A45] mb-2" />
          <span className="font-poppins font-bold text-sm text-[#FF7A45] text-center">
            {payload.rightCategory.label}
          </span>
          <span className="text-[11px] font-mono text-isler-muted mt-2">[D →]</span>
        </div>
      </div>

      {/* =========================================================================
       * ALT BUTONLAR (DOKUNMATİK VE KLAVYE ALTERNATİFİ)
       * ========================================================================= */}
      <div className="flex items-center justify-center gap-4">
        {/* Sol Buton */}
        <button
          type="button"
          disabled={isLocked}
          onClick={() => handleSwipe('left')}
          className="flex-1 max-w-[240px] flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#131B2D] border-2 border-[#3B82F6] text-[#60A5FA] font-poppins font-bold text-sm hover:bg-[#3B82F6] hover:text-white transition-all duration-200 shadow-[0_0_15px_rgba(59,130,246,0.35)] active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="truncate">{payload.leftCategory.label}</span>
        </button>

        <span className="hidden sm:inline-block font-mono text-xs text-isler-muted/70 px-1">
          [← A / D →]
        </span>

        {/* Sağ Buton */}
        <button
          type="button"
          disabled={isLocked}
          onClick={() => handleSwipe('right')}
          className="flex-1 max-w-[240px] flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#261008] border-2 border-[#F14E13] text-[#FF7A45] font-poppins font-bold text-sm hover:bg-[#F14E13] hover:text-white transition-all duration-200 shadow-[0_0_15px_rgba(241,78,19,0.35)] active:scale-95"
        >
          <span className="truncate">{payload.rightCategory.label}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
