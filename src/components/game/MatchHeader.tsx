import React, { useState, useEffect, useRef } from 'react';
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

  // Uçan puan (+Puan) animasyonu takibi
  const p1RoundedScore = Math.round(player1Score);
  const p2RoundedScore = Math.round(player2Score);
  const [scoreDelta, setScoreDelta] = useState<number | null>(null);
  const prevScoreRef = useRef<number>(p1RoundedScore);

  useEffect(() => {
    if (p1RoundedScore > prevScoreRef.current) {
      const delta = p1RoundedScore - prevScoreRef.current;
      setScoreDelta(delta);
      const timer = setTimeout(() => {
        setScoreDelta(null);
      }, 1800);
      prevScoreRef.current = p1RoundedScore;
      return () => clearTimeout(timer);
    } else {
      prevScoreRef.current = p1RoundedScore;
    }
  }, [p1RoundedScore]);

  // Canlı Halat Çekme / Üstünlük Çubuğu (Tug-of-War Arena Bar)
  // Hesaplama: diff = playerScore - opponentScore, playerShare = Math.max(15, Math.min(85, 50 + (diff / 15)))
  const diff = Math.round(p1RoundedScore - p2RoundedScore);
  const playerShare = Math.max(15, Math.min(85, 50 + (diff / 15)));

  // SVG hesapları
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // İsim temizleme (parantez içi debug/rol açıklamalarını gizle)
  const cleanName = (name: string) => (name ? name.split('(')[0].trim() : '');

  return (
    <header className="sticky top-0 z-40 w-full bg-[rgba(26,14,28,0.92)] backdrop-blur-md border-b border-[rgba(241,78,19,0.25)] shadow-lg shadow-black/40">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* SOL: Current Player (P1 - Ateş Takımı) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-start relative">
          {/* Uçan Puan Animasyonu (+Puan) */}
          {scoreDelta !== null && scoreDelta > 0 && (
            <div className="absolute -top-3 left-8 sm:left-12 z-30 pointer-events-none animate-bounce">
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 text-black font-black text-[10px] sm:text-xs shadow-lg shadow-emerald-500/50 whitespace-nowrap">
                +{scoreDelta} PUAN!
              </span>
            </div>
          )}

          <div className="relative shrink-0">
            <img
              src={player1.avatarUrl}
              alt={cleanName(player1.name)}
              className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl border-2 border-[#F14E13] bg-[#1A0E1C] object-cover shadow-md shadow-[#F14E13]/20 transition-all ${
                player1.streak >= 2 ? 'ring-2 ring-amber-400 animate-flame-aura scale-105' : ''
              }`}
            />
            <span className="absolute -bottom-1 -right-1 bg-[#F14E13] text-white text-[8px] sm:text-[9px] font-poppins font-bold px-1 rounded-full uppercase">
              Sen
            </span>
          </div>

          <div className="min-w-0">
            <div className="font-poppins font-bold text-xs sm:text-sm text-white truncate max-w-[75px] sm:max-w-[140px]">
              {cleanName(player1.name)}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono mt-0.5 whitespace-nowrap">
              <span className="text-[#F14E13] font-bold">{player1.elo} ELO</span>
              <span
                className={`flex items-center gap-0.5 text-amber-400 font-semibold transition-all ${
                  player1.streak >= 2
                    ? 'px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-red-500/30 border border-amber-400 text-amber-200 shadow-lg shadow-amber-500/50 ring-1 ring-amber-400/60 animate-flame-aura'
                    : ''
                }`}
              >
                <Flame
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 ${
                    player1.streak >= 2 ? 'animate-bounce' : ''
                  }`}
                />
                {player1.streak >= 2 ? `🔥 ${player1.streak}x ALEV ALDI!` : player1.streak}
              </span>
            </div>
          </div>
        </div>

        {/* ORTA: Soru No & Dairesel Geri Sayım */}
        <div className="flex flex-col items-center justify-center shrink-0 px-1 sm:px-2">
          <div className="font-poppins font-semibold text-[9px] sm:text-xs text-[#B5CBC8] uppercase tracking-wider mb-0.5 whitespace-nowrap">
            Soru {currentQuestionIndex + 1} / {totalQuestions}
          </div>

          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 44 44" className="w-8 h-8 sm:w-11 sm:h-11 transform -rotate-90">
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
              className={`absolute font-mono font-bold text-xs sm:text-base ${
                isUrgent ? 'text-red-400 animate-pulse' : 'text-white'
              }`}
            >
              {Math.ceil(timeLeft)}
            </span>
          </div>
        </div>

        {/* SAĞ: Opponent Player (P2 - Mavi / Siber Takım) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-end text-right">
          <div className="min-w-0">
            <div className="font-poppins font-bold text-xs sm:text-sm text-white truncate max-w-[75px] sm:max-w-[140px]">
              {cleanName(player2.name)}
            </div>
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono mt-0.5 whitespace-nowrap">
              <span
                className={`flex items-center gap-0.5 text-blue-400 font-semibold ${
                  player2.streak >= 2
                    ? 'px-1.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300'
                    : ''
                }`}
              >
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-blue-400 text-blue-400" />
                {player2.streak >= 2 ? `🔥 ${player2.streak}x` : player2.streak}
              </span>
              <span className="text-[#3B82F6] font-bold">{player2.elo} ELO</span>
            </div>
          </div>

          <div className="relative shrink-0">
            <img
              src={player2.avatarUrl}
              alt={cleanName(player2.name)}
              className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl border-2 border-[#3B82F6] bg-[#1A0E1C] object-cover shadow-md shadow-[#3B82F6]/20 transition-all ${
                player2.streak >= 2 ? 'ring-2 ring-blue-400 animate-flame-aura scale-105' : ''
              }`}
            />
            <span className="absolute -bottom-1 -left-1 bg-[#3B82F6] text-white text-[8px] sm:text-[9px] font-poppins font-bold px-1 rounded-full uppercase">
              Rakip
            </span>
          </div>
        </div>
      </div>

      {/* CANLI HALAT ÇEKME / ÜSTÜNLÜK ÇUBUĞU (Tug-of-War Arena Bar) */}
      <div className="w-full relative px-2.5 sm:px-4 py-1 bg-[#100712] border-t border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="relative h-2.5 sm:h-3 rounded-full bg-[#0F0510] border border-white/10 overflow-visible flex items-center shadow-inner">
            {/* Sol Taraf: Turuncu-Altın (from-[#F14E13] to-amber-400) */}
            <div
              className={`h-full rounded-l-full bg-gradient-to-r from-[#F14E13] to-amber-400 transition-all duration-500 ease-out shadow-sm shadow-[#F14E13]/50 relative ${
                diff > 0 ? 'brightness-110' : ''
              }`}
              style={{ width: `${playerShare}%` }}
            >
              {diff > 0 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none rounded-l-full" />
              )}
            </div>
            {/* Sağ Taraf: Mor-Kırmızı (from-fuchsia-600 to-rose-600) */}
            <div
              className={`h-full rounded-r-full bg-gradient-to-r from-fuchsia-600 to-rose-600 transition-all duration-500 ease-out shadow-sm shadow-fuchsia-600/50 relative ${
                diff < 0 ? 'brightness-110' : ''
              }`}
              style={{ width: `${100 - playerShare}%` }}
            >
              {diff < 0 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none rounded-r-full" />
              )}
            </div>

            {/* Tam birleşim noktasında parlayan ⚡ çarpışma ikonu */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-amber-500 flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-lg shadow-amber-400/80 border border-amber-300 animate-pulse transition-all duration-500 ease-out"
              style={{ left: `${playerShare}%` }}
            >
              ⚡
            </div>
          </div>

          {/* Skor Etiketleri ve Üstünlük Bilgisi */}
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono mt-1 px-1">
            <span className="text-[#F14E13] font-black tracking-wide flex items-center gap-1">
              <span>{p1RoundedScore} PUAN</span>
              {diff > 0 && <span className="text-emerald-400 font-semibold text-[9px]">(+{diff} Önde)</span>}
            </span>
            <span className="text-zinc-400 text-[9px] sm:text-[10px] uppercase tracking-wider hidden sm:inline">
              {diff > 0 ? '⚡ Üstünlük Sende!' : diff < 0 ? '⚠️ Rakip Baskı Kuruyor!' : '🤝 Başa Baş Mücadele'}
            </span>
            <span className="text-rose-400 font-black tracking-wide flex items-center gap-1 justify-end">
              {diff < 0 && <span className="text-rose-300 font-semibold text-[9px]">(+{-diff} Önde)</span>}
              <span>{p2RoundedScore} PUAN</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MatchHeader;
