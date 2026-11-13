import React from 'react';
import { Question } from '../../types/game';
import { CheckCircle2, BookOpen } from 'lucide-react';

export interface QuestionStageProps {
  question: Question;
  opponentAnswered?: boolean;
  children: React.ReactNode;
}

export const QuestionStage: React.FC<QuestionStageProps> = ({
  question,
  opponentAnswered = false,
  children
}) => {
  // Ders rozeti metni: Örn: "FİZİK • Dalgalar ve Ses"
  const badgeLabel = `${question.subject.toUpperCase()} • ${question.topic}`;

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6 flex flex-col gap-3 sm:gap-4">
      {/* Ana Soru Alanı Kartı (.game-card stili) */}
      <section className="game-card !p-3.5 sm:!p-6 md:!p-7 transition-all duration-300">
        {/* Üst Satır: Ders Rozeti ve Rakip Durumu */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3 sm:mb-4">
          {/* Ders Rozeti (.hero-badge) */}
          <div className="hero-badge text-xs sm:text-sm py-1 px-2.5 sm:py-1.5 sm:px-4">
            <BookOpen className="w-3.5 h-3.5 text-[#F14E13] shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">{badgeLabel}</span>
          </div>

          {/* Rakip Cevapladı Göstergesi */}
          {opponentAnswered ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-950/80 border border-blue-500/50 text-blue-300 shadow-sm shadow-blue-500/20 animate-fade-in shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Rakip cevapladı ✓</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium text-[#B5CBC8]/60 bg-[#0F0510]/50 border border-white/5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-blue-400/50 animate-ping shrink-0" />
              <span>Rakip düşünüyor...</span>
            </div>
          )}
        </div>

        {/* Büyük Soru Metni (Prompt) */}
        {/* NOT: Soru Puanı ve Soru Tipi Adı gösterilmez! */}
        <h2 className="font-poppins font-semibold text-base sm:text-xl md:text-2xl text-white leading-relaxed sm:leading-snug mb-4 sm:mb-6">
          {question.prompt}
        </h2>

        {/* Soru İçeriği (QuestionRenderer bileşeni) */}
        <div className="w-full">
          {children}
        </div>
      </section>
    </div>
  );
};

export default QuestionStage;
