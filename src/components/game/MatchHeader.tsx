import React from 'react';
import { PlayerInfo } from '../../types/game';
import { Flame } from 'lucide-react';

export interface MatchHeaderProps {
  player1: PlayerInfo;
  player2: PlayerInfo;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  timeLimit: number;
  player1Score: number;
  player2Score: number;
}

export const MatchHeader: React.FC<MatchHeaderProps> = ({
  player1,
  player2,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  timeLimit,
  player1Score,
  player2Score
}) => {
  // Geri sayım oranı (0..1)
  const safeTimeLimit = Math.max(1, timeLimit);
  const progressRatio = Math.max(0, Math.min(1, timeLeft / safeTimeLimit));
  const isUrgent = timeLeft <= 5 && timeLeft > 0;

  // Çekişme dinamometresi hesaplama
  const totalScore = player1Score + player2Score;
  let p1Ratio = 50;
  if (totalScore > 0) {
    p1Ratio = Math.round((player1Score / totalScore) * 100);
    p1Ratio = Math.max(8, Math.min(92, p1Ratio)); // Görsel olarak iki taraf da sıfırda kaybolmasın
  }

  // Dairesel SVG hesapları
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <header className="sticky top-0 z-40 w-full bg-[rgba(26,14,28,0.92)] backdrop-blur-md border-b border-[rgba(241,78,19,0.25)] shadow-lg shadow-black/40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* SOL: Current Player (P1 - Ateş Takımı) */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 justify-start">
          <div className="relative shrink-0">
            <img
              src={player1.avatarUrl}
              alt={player1.name}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 border-[#F14E13] bg-[#1A0E1C] object-cover shadow-md shadow-[#F14E13]/20"
            />
            <span className="absolute -bottom-1 -right-1 bg-[#F14E13] text-white text-[9px] font-poppins font-bold px-1 rounded-full uppercase">
              Sen
            </span>
          </div>

          <div className="min-w-0">
            <div className="font-poppins font-bold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-[140px]">
              {player1.name}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5">
              <span className="text-[#F14E13] font-bold">{player1.elo} ELO</span>
              <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {player1.streak}
              </span>
            </div>
          </div>
        </div>

        {/* ORTA: Soru No & Dairesel Geri Sayım */}
        <div className="flex flex-col items-center justify-center shrink-0 px-2">
          <div className="font-poppins font-semibold text-[10px] sm:text-xs text-[#B5CBC8] uppercase tracking-wider mb-0.5">
            Soru {currentQuestionIndex + 1} / {totalQuestions}
          </div>

          <div className="relative flex items-center justify-center">
            <svg className="w-11 h-11 transform -rotate-90">
              {/* Arka plan halkası */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className="stroke-[rgba(241,78,19,0.15)]"
                strokeWidth="3.5"
                fill="transparent"
              />
              {/* Dinamik geri sayım halkası */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                className={`transition-all duration-300 ease-linear ${
                  isUrgent ? 'stroke-red-500' : 'stroke-[#F14E13]'
                }`}
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Sayacın içindeki rakam */}
            <span
              className={`absolute font-mono font-bold text-sm sm:text-base ${
                isUrgent ? 'text-red-400 animate-pulse' : 'text-white'
              }`}
            >
              {Math.ceil(timeLeft)}
            </span>
          </div>
        </div>

        {/* SAĞ: Opponent Player (P2 - Mavi / Siber Takım) */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 justify-end text-right">
          <div className="min-w-0">
            <div className="font-poppins font-bold text-xs sm:text-sm text-white truncate max-w-[100px] sm:max-w-[140px]">
              {player2.name}
            </div>
            <div className="flex items-center justify-end gap-2 text-[11px] font-mono mt-0.5">
              <span className="flex items-center gap-0.5 text-blue-400 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                {player2.streak}
              </span>
              <span className="text-[#3B82F6] font-bold">{player2.elo} ELO</span>
            </div>
          </div>

          <div className="relative shrink-0">
            <img
              src={player2.avatarUrl}
              alt={player2.name}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 border-[#3B82F6] bg-[#1A0E1C] object-cover shadow-md shadow-[#3B82F6]/20"
            />
            <span className="absolute -bottom-1 -left-1 bg-[#3B82F6] text-white text-[9px] font-poppins font-bold px-1 rounded-full uppercase">
              Rakip
            </span>
          </div>
        </div>
      </div>

      {/* ALT: İnce Çekişme / Dinamometre Barı (Turuncu vs Mavi) */}
      <div className="w-full bg-[#0F0510] h-2 relative flex items-center overflow-hidden">
        {/* P1 Barı */}
        <div
          className="h-full bg-gradient-to-r from-[#D6400D] to-[#F14E13] transition-all duration-500 ease-out"
          style={{ width: `${p1Ratio}%` }}
        />
        {/* P2 Barı */}
        <div
          className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-500 ease-out"
          style={{ width: `${100 - p1Ratio}%` }}
        />

        {/* Merkez İnce Ayrım Çizgisi */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm shadow-white transition-all duration-500"
          style={{ left: `${p1Ratio}%` }}
        />
      </div>

      {/* Skor Etiketleri (İnce alt bilgi) */}
      <div className="max-w-5xl mx-auto px-4 py-0.5 flex justify-between text-[11px] font-mono text-[#B5CBC8]">
        <span className="text-[#F14E13] font-bold">{player1Score} PUAN</span>
        <span className="text-[#3B82F6] font-bold">{player2Score} PUAN</span>
      </div>
    </header>
  );
};

export default MatchHeader;
