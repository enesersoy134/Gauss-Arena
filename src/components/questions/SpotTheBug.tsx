import React, { useState } from 'react';
import { Bug, AlertTriangle, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import type { SpotTheBugQuestion, BugBlockItem } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';

export default function SpotTheBug({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<SpotTheBugQuestion>) {
  const { payload } = question;
  const { contextPrompt, displayLayout, blocks } = payload;

  const [clickedId, setClickedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ isCorrect: boolean } | null>(null);

  const isInteractionDisabled = disabled || submitted;

  const handleBlockClick = (block: BugBlockItem) => {
    if (isInteractionDisabled) return;

    setClickedId(block.id);
    const isCorrect = block.isBug;
    const res = { isCorrect, accuracy: isCorrect ? 1 : 0 };
    setResult(res);
    setSubmitted(true);
    onSubmit(res);
  };

  const isHorizontal = displayLayout === 'horizontal_formula';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-2 select-none">
      <style>{`
        @keyframes glitchFrame {
          0%, 100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.7), inset 0 0 15px rgba(239, 68, 68, 0.25);
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-2px, 1px);
          }
          50% {
            transform: translate(2px, -1px);
          }
          75% {
            transform: translate(-1px, 2px);
          }
        }
        .animate-glitch {
          animation: glitchFrame 0.35s ease-in-out 3;
        }
      `}</style>

      {/* Bağlam / İfade Başlığı (Örn: Denklem: 3(2x - 4) + 5 = 23) */}
      {contextPrompt && (
        <div className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-isler-surface border border-isler-primary/40 text-white font-mono text-base md:text-xl font-bold shadow-isler-glow">
          <Terminal className="w-5 h-5 text-isler-primary shrink-0" />
          <span>{contextPrompt}</span>
        </div>
      )}

      {/* Küçük Yönerge İpucu */}
      {!submitted && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-isler-muted font-sans font-medium">
          <Bug className="w-4 h-4 text-isler-primary" />
          <span>Hatalı olduğunu düşündüğünüz parçaya dokunarak seçin:</span>
        </div>
      )}

      {/* Bloklar Alanı (Horizontal Formula vs Vertical Steps) */}
      <div
        className={`w-full ${
          isHorizontal
            ? 'flex flex-row flex-wrap items-center justify-center gap-3.5 md:gap-5'
            : 'flex flex-col gap-3.5 max-w-xl mx-auto'
        }`}
      >
        {blocks.map((block, idx) => {
          const isClicked = clickedId === block.id;
          const isBug = block.isBug;

          let blockStyle =
            'bg-isler-surface border-isler-primary/35 hover:border-isler-primary hover:bg-isler-elevated hover:scale-[1.015] shadow-md';

          if (submitted) {
            if (isBug) {
              // Hatalı blok (kırmızı glitch çerçevesi ve neon parlama)
              blockStyle =
                'bg-[#2A0B12] border-2 border-game-wrong shadow-wrong-glow animate-glitch relative ring-2 ring-game-wrong/40';
            } else if (isClicked) {
              // Kullanıcı hatasız bir bloğa tıkladıysa
              blockStyle = 'bg-game-wrong/20 border-2 border-game-wrong text-white/90';
            } else {
              // Diğer hatasız bloklar
              blockStyle = 'bg-isler-deep/50 border-white/10 text-isler-muted/50 opacity-60';
            }
          }

          return (
            <div key={block.id} className="relative flex flex-col items-center w-full">
              <button
                type="button"
                disabled={isInteractionDisabled}
                onClick={() => handleBlockClick(block)}
                className={`w-full flex items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left active:scale-[0.98] disabled:cursor-not-allowed ${blockStyle}`}
              >
                {/* Blok İçeriği */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-isler-deep border border-isler-primary/30 flex items-center justify-center font-mono text-xs font-bold text-isler-muted shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-base md:text-lg font-bold text-white tracking-wide truncate">
                    {block.blockText}
                  </span>
                </div>

                {/* Gönderim Sonrası Durum Rozeti */}
                {submitted && (
                  <div className="shrink-0 flex items-center gap-2">
                    {isBug ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-game-wrong text-white text-xs font-poppins font-extrabold shadow-sm">
                        <Bug className="w-3.5 h-3.5" />
                        <span>GLITCH</span>
                      </span>
                    ) : isClicked ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-game-wrong/20 text-game-wrong border border-game-wrong/40 text-xs font-sans font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Hata Yoktu</span>
                      </span>
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-game-correct/50" />
                    )}
                  </div>
                )}
              </button>

              {/* Gönderim Sonrası: Hatalı Blok Açıklama Balonu (feedbackNote) */}
              {submitted && isBug && block.feedbackNote && (
                <div className="relative mt-2.5 w-full rounded-xl bg-[#220D1A] border-2 border-isler-primary p-3.5 shadow-isler-glow text-left animate-fade-in">
                  {/* Ok Ucu */}
                  <div className="absolute -top-2 left-8 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-isler-primary" />

                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-isler-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-poppins font-bold uppercase tracking-wider text-isler-primary">
                        Hata Açıklaması:
                      </span>
                      <p className="text-xs md:text-sm font-sans font-medium text-white/95 leading-relaxed">
                        {block.feedbackNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Gönderim Sonucu Özet Bildirimi */}
      {submitted && result && (
        <div
          className={`mt-2 flex items-center gap-2.5 px-6 py-2.5 rounded-full font-poppins font-bold text-sm md:text-base transition-all ${
            result.isCorrect
              ? 'bg-game-correct text-black shadow-correct-glow'
              : 'bg-game-wrong text-white shadow-wrong-glow'
          }`}
        >
          {result.isCorrect ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Harika! Hatalı adımı tek dokunuşta tespit ettin!</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5" />
              <span>Bu adım doğruydu! Kırmızı işaretli adımdaki hatayı inceleyin.</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
