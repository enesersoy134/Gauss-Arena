import React, { useEffect, useState } from 'react';
import { PlayerInfo, Question, RoundResult } from '../../types/game';
import { Check, X, Clock, HelpCircle, ArrowRight } from 'lucide-react';

export interface IntermissionScreenProps {
  countdownSec: number;
  roundResult: RoundResult;
  question: Question;
  player1: PlayerInfo;
  player2: PlayerInfo;
  player1TotalScore: number;
  player2TotalScore: number;
  isLastQuestion: boolean;
  onDone: () => void;
}

/**
 * Sayıların sayarak artması için yardımcı Hook
 */
function useAnimatedNumber(target: number, initial: number, durationMs: number = 1200) {
  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = initial;
    const diff = target - startVal;

    if (diff === 0) {
      setCurrent(target);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(startVal + diff * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, initial, durationMs]);

  return current;
}

export const IntermissionScreen: React.FC<IntermissionScreenProps> = ({
  countdownSec,
  roundResult,
  question,
  player1,
  player2,
  player1TotalScore,
  player2TotalScore,
  isLastQuestion,
  onDone
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(countdownSec);
  const [isReadyClicked, setIsReadyClicked] = useState<boolean>(false);

  // Bu raunttan önceki skorlar (sayarak artma efekti için)
  const prevP1Score = Math.max(0, player1TotalScore - roundResult.player1Points);
  const prevP2Score = Math.max(0, player2TotalScore - roundResult.player2Points);

  const displayP1Score = useAnimatedNumber(player1TotalScore, prevP1Score, 1000);
  const displayP2Score = useAnimatedNumber(player2TotalScore, prevP2Score, 1000);

  // Geri sayım döngüsü
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setTimeLeft(countdownSec);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onDoneRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownSec]);

  // SVG dairesel sayaç hesapları
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, timeLeft / countdownSec);
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Toplam skor karşılaştırma barı
  const totalScore = displayP1Score + displayP2Score;
  const p1Ratio = totalScore > 0 ? Math.max(8, Math.min(92, Math.round((displayP1Score / totalScore) * 100))) : 50;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center gap-6 animate-fade-in">
      {/* 1. ÜST: Büyük Dairesel Geri Sayım & Durum Başlığı */}
      <div className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center my-2">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Arka plan halkası */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-[rgba(241,78,19,0.2)]"
              strokeWidth="5"
              fill="transparent"
            />
            {/* Animasyonlu geri sayım halkası */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-[#F14E13] transition-all duration-1000 ease-linear"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Sayacın içindeki rakam */}
          <span className="absolute font-mono font-bold text-3xl text-white">
            {timeLeft}
          </span>
        </div>

        <h3 className="font-poppins font-bold text-xl text-white mt-1">
          {isLastQuestion ? 'Son Soru Tamamlandı!' : 'Raunt Sona Erdi'}
        </h3>
        <p className="text-sm text-[#B5CBC8] font-sans mt-0.5">
          {isLastQuestion ? 'Maç sonucu geliyor...' : 'Sonraki soruya geçiliyor...'}
        </p>
      </div>

      {/* 2. BU SORUDAKİ SONUÇLAR (P1 vs P2) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* P1 Sonuç Kartı */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            roundResult.player1Correct
              ? 'bg-[#1A0E1C] border-[#22C55E]/50 shadow-lg shadow-[#22C55E]/10'
              : 'bg-[#1A0E1C] border-[#EF4444]/50 shadow-lg shadow-[#EF4444]/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={player1.avatarUrl}
                alt={player1.name}
                className="w-10 h-10 rounded-xl border border-[#F14E13] bg-[#0F0510]"
              />
              <div>
                <span className="font-poppins font-bold text-sm text-white block">{player1.name.split('(')[0].trim()}</span>
                <span className="text-[11px] text-[#F14E13] font-semibold">SEN</span>
              </div>
            </div>

            {/* Doğru / Yanlış İkonu */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                roundResult.player1Correct
                  ? 'bg-[#22C55E]/20 text-[#22C55E]'
                  : 'bg-[#EF4444]/20 text-[#EF4444]'
              }`}
            >
              {roundResult.player1Correct ? (
                <>
                  <Check className="w-4 h-4" /> Doğru
                </>
              ) : (
                <>
                  <X className="w-4 h-4" /> Yanlış
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <div className="text-[#B5CBC8] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#F14E13]" />
              <span>{(roundResult.player1TimeMs / 1000).toFixed(1)} sn</span>
            </div>
            <div className="font-mono font-bold text-base text-[#22C55E]">
              +{Math.round(roundResult.player1Points)} PUAN
            </div>
          </div>
        </div>

        {/* P2 (Rakip) Sonuç Kartı */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            roundResult.player2Correct
              ? 'bg-[#1A0E1C] border-[#22C55E]/50 shadow-lg shadow-[#22C55E]/10'
              : 'bg-[#1A0E1C] border-[#EF4444]/50 shadow-lg shadow-[#EF4444]/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={player2.avatarUrl}
                alt={player2.name}
                className="w-10 h-10 rounded-xl border border-[#3B82F6] bg-[#0F0510]"
              />
              <div>
                <span className="font-poppins font-bold text-sm text-white block">{player2.name.split('(')[0].trim()}</span>
                <span className="text-[11px] text-[#3B82F6] font-semibold">RAKİP</span>
              </div>
            </div>

            {/* Doğru / Yanlış İkonu */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                roundResult.player2Correct
                  ? 'bg-[#22C55E]/20 text-[#22C55E]'
                  : 'bg-[#EF4444]/20 text-[#EF4444]'
              }`}
            >
              {roundResult.player2Correct ? (
                <>
                  <Check className="w-4 h-4" /> Doğru
                </>
              ) : (
                <>
                  <X className="w-4 h-4" /> Yanlış
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <div className="text-[#B5CBC8] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>{(roundResult.player2TimeMs / 1000).toFixed(1)} sn</span>
            </div>
            <div className="font-mono font-bold text-base text-[#22C55E]">
              +{Math.round(roundResult.player2Points)} PUAN
            </div>
          </div>
        </div>
      </div>

      {/* 3. ANLIK TOPLAM SKOR & DİNAMOMETRE (Sayarak Artış Animasyonu) */}
      <div className="w-full game-card p-5">
        <div className="text-center mb-3">
          <span className="text-xs uppercase tracking-wider text-[#B5CBC8] font-poppins font-semibold">
            Anlık Toplam Skor
          </span>
        </div>

        <div className="flex items-center justify-between px-4 sm:px-8 mb-3">
          {/* P1 Skor */}
          <div className="text-left">
            <div className="text-xs text-[#F14E13] font-bold uppercase">{player1.name}</div>
            <div className="font-mono font-bold text-3xl sm:text-4xl text-white">
              {displayP1Score}
            </div>
          </div>

          <div className="font-mono text-sm font-semibold text-[#B5CBC8] px-2">VS</div>

          {/* P2 Skor */}
          <div className="text-right">
            <div className="text-xs text-[#3B82F6] font-bold uppercase">{player2.name}</div>
            <div className="font-mono font-bold text-3xl sm:text-4xl text-white">
              {displayP2Score}
            </div>
          </div>
        </div>

        {/* Karşılaştırma Barı */}
        <div className="w-full bg-[#0F0510] h-3 rounded-full relative flex items-center overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#D6400D] to-[#F14E13] transition-all duration-700 ease-out"
            style={{ width: `${p1Ratio}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-700 ease-out"
            style={{ width: `${100 - p1Ratio}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-md shadow-white transition-all duration-700"
            style={{ left: `${p1Ratio}%` }}
          />
        </div>
      </div>

      {/* 4. DOĞRU CEVAP VE KISA AÇIKLAMA */}
      {question.explanation && (
        <div className="w-full bg-[#0F0510] border border-[rgba(241,78,19,0.3)] rounded-2xl p-4 sm:p-5 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F14E13] uppercase tracking-wider mb-1.5">
            <HelpCircle className="w-4 h-4 text-[#F14E13]" />
            <span>Doğru Çözüm & Açıklama</span>
          </div>
          <p className="text-sm text-[#B5CBC8] leading-relaxed font-sans">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Hemen Geç Butonu (Hızlı oynanış için) */}
      <button
        onClick={() => {
          setIsReadyClicked(true);
          onDone();
        }}
        disabled={isReadyClicked}
        className={`btn-primary text-sm py-2.5 px-6 flex items-center justify-center gap-2 mt-2 transition-all ${
          isReadyClicked
            ? 'opacity-80 cursor-not-allowed bg-[#2A162D] border-orange-500/40 text-orange-200 shadow-none'
            : ''
        }`}
      >
        {isReadyClicked ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-1" />
            <span>⏳ Rakibin Hazır Olması Bekleniyor...</span>
          </>
        ) : (
          <>
            <span>{isLastQuestion ? 'Sonucu Gör' : 'Sıradaki Soruya Geç'}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default IntermissionScreen;
