import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Question } from '../../types/game';
import { ALL_INTERACTIVE_QUESTIONS } from '../../data/allInteractiveQuestions';
import { QuestionRenderer } from '../questions/QuestionRenderer';
import { AnswerResult } from '../questions/questionProps';
import { calculateQuestionScore, evaluateNumpadWinner } from '../../utils/scoring';
import KahootHostView from './KahootHostView';
import {
  Swords,
  Flame,
  Sparkles,
  Trophy,
  Clock,
  Maximize2,
  Minimize2,
  Lock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Home,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  Shield,
  Layers,
  Check,
  FastForward,
  Award,
  Smartphone,
} from 'lucide-react';

export interface SmartboardScreenProps {
  onExit: () => void;
}

type SmartboardPhase = 'setup' | 'battle' | 'intermission' | 'finished';

interface RoundHistoryItem {
  roundIndex: number;
  question: Question;
  red: {
    isCorrect: boolean;
    passed: boolean;
    timeElapsedSec: number;
    pointsEarned: number;
    speedBonus: number;
  };
  blue: {
    isCorrect: boolean;
    passed: boolean;
    timeElapsedSec: number;
    pointsEarned: number;
    speedBonus: number;
  };
}

// Web Audio API ses efektleri (opsiyonel bildirim sesleri)
function playTone(freq: number, type: OscillatorType, duration: number, isMuted: boolean) {
  if (isMuted || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ses desteği olmayan ortamlarda sessizce geç
  }
}

/**
 * Akıllı Tahta için filtrelenmiş ve karıştırılmış soru seçici
 */
function pickSmartboardQuestions(
  pool: Question[],
  options: {
    examType: 'TYT' | 'AYT' | 'Karma';
    subject: string;
    questionCount: number;
  }
): Question[] {
  let candidates = [...pool];

  // 1. Sınav Türü
  if (options.examType !== 'Karma') {
    const byExam = candidates.filter((q) => q.examType === options.examType);
    if (byExam.length >= options.questionCount) {
      candidates = byExam;
    }
  }

  // 2. Ders Filtresi
  if (options.subject !== 'all') {
    const bySubject = candidates.filter(
      (q) => q.subject.toLowerCase() === options.subject.toLowerCase()
    );
    if (bySubject.length >= options.questionCount) {
      candidates = bySubject;
    } else if (bySubject.length > 0) {
      const rest = candidates.filter(
        (q) => q.subject.toLowerCase() !== options.subject.toLowerCase()
      );
      candidates = [...bySubject, ...rest];
    }
  }

  // 3. Karıştır ve farklı soru tiplerini sıralamaya çalış
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  const selected: Question[] = [];

  for (const q of shuffled) {
    if (selected.length >= options.questionCount) break;
    if (
      selected.length > 0 &&
      selected[selected.length - 1].type === q.type &&
      shuffled.some((o) => !selected.includes(o) && o.type !== q.type)
    ) {
      continue;
    }
    selected.push(q);
  }

  if (selected.length < options.questionCount) {
    for (const q of shuffled) {
      if (selected.length >= options.questionCount) break;
      if (!selected.includes(q)) {
        selected.push(q);
      }
    }
  }

  return selected;
}

export const SmartboardScreen: React.FC<SmartboardScreenProps> = ({ onExit }) => {
  // Faz yönetimi
  const [phase, setPhase] = useState<SmartboardPhase>('setup');

  // Tahta Çalışma Modu (2 Takım Düello vs Canlı Sınıf QR Kahoot Modu)
  const [boardMode, setBoardMode] = useState<'duel' | 'kahoot'>('duel');

  // Kurulum Ayarları
  const [redTeamName, setRedTeamName] = useState<string>('Kırmızı Takım');
  const [blueTeamName, setBlueTeamName] = useState<string>('Mavi Takım');
  const [selectedExamType, setSelectedExamType] = useState<'TYT' | 'AYT' | 'Karma'>('Karma');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionMode, setQuestionMode] = useState<'interactive14' | 'mixed'>('interactive14');

  // Ses & Tam Ekran
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Oyun Durumu
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(25);

  // Kırmızı Takım Durumu
  const [redTotalScore, setRedTotalScore] = useState<number>(0);
  const [redStreak, setRedStreak] = useState<number>(0);
  const [redMaxStreak, setRedMaxStreak] = useState<number>(0);
  const [redAnswered, setRedAnswered] = useState<boolean>(false);
  const [redPassed, setRedPassed] = useState<boolean>(false);
  const [redTimeElapsedSec, setRedTimeElapsedSec] = useState<number>(0);
  const [redAnswerResult, setRedAnswerResult] = useState<AnswerResult | null>(null);
  const [redPointsAwarded, setRedPointsAwarded] = useState<number>(0);
  const [redSpeedBonus, setRedSpeedBonus] = useState<number>(0);

  // Mavi Takım Durumu
  const [blueTotalScore, setBlueTotalScore] = useState<number>(0);
  const [blueStreak, setBlueStreak] = useState<number>(0);
  const [blueMaxStreak, setBlueMaxStreak] = useState<number>(0);
  const [blueAnswered, setBlueAnswered] = useState<boolean>(false);
  const [bluePassed, setBluePassed] = useState<boolean>(false);
  const [blueTimeElapsedSec, setBlueTimeElapsedSec] = useState<number>(0);
  const [blueAnswerResult, setBlueAnswerResult] = useState<AnswerResult | null>(null);
  const [bluePointsAwarded, setBluePointsAwarded] = useState<number>(0);
  const [blueSpeedBonus, setBlueSpeedBonus] = useState<number>(0);

  // Soru Arası 3 Saniyelik Geçiş Sayacı
  const [intermissionCountdown, setIntermissionCountdown] = useState<number | null>(null);

  // Karşılaşma Geçmişi
  const [matchHistory, setMatchHistory] = useState<RoundHistoryItem[]>([]);

  // Zamanlayıcı referansları
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);

  // Tam ekran dinleyicisi
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Aktif soru
  const currentQuestion: Question | undefined = questions[currentQuestionIndex];
  const timeLimit = currentQuestion?.timeLimitSeconds || 25;

  // Yeni Düelloyu Başlat
  const handleStartDuel = () => {
    const picked = pickSmartboardQuestions(ALL_INTERACTIVE_QUESTIONS, {
      examType: selectedExamType,
      subject: selectedSubject,
      questionCount,
    });

    setQuestions(picked);
    setCurrentQuestionIndex(0);
    setRedTotalScore(0);
    setBlueTotalScore(0);
    setRedStreak(0);
    setBlueStreak(0);
    setRedMaxStreak(0);
    setBlueMaxStreak(0);
    setMatchHistory([]);

    // İlk soruyu başlat
    initQuestionRound(picked[0]);
    setPhase('battle');
    playTone(587, 'triangle', 0.2, isMuted);
  };

  // Soru raundunu hazırla ve sayaç başlat
  const initQuestionRound = (q: Question) => {
    const dur = q.timeLimitSeconds || 25;
    setTimeLeft(dur);
    setRedAnswered(false);
    setRedPassed(false);
    setRedTimeElapsedSec(0);
    setRedAnswerResult(null);
    setRedPointsAwarded(0);
    setRedSpeedBonus(0);

    setBlueAnswered(false);
    setBluePassed(false);
    setBlueTimeElapsedSec(0);
    setBlueAnswerResult(null);
    setBluePointsAwarded(0);
    setBlueSpeedBonus(0);
    setIntermissionCountdown(null);

    questionStartTimeRef.current = Date.now();
  };

  // Soru süresi geri sayım motoru
  useEffect(() => {
    if (phase !== 'battle') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          return 0;
        }
        if (prev <= 6) {
          playTone(440, 'sine', 0.08, isMuted);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [phase, currentQuestionIndex, isMuted]);

  // Süre dolduğunda veya her iki takım da cevapladığında raundu tamamla
  const finalizeRound = useCallback(
    (
      redRes: AnswerResult | null,
      redPass: boolean,
      redTime: number,
      blueRes: AnswerResult | null,
      bluePass: boolean,
      blueTime: number
    ) => {
      if (!currentQuestion) return;

      const basePoints = currentQuestion.points || 100;
      const durationSec = currentQuestion.timeLimitSeconds || 25;

      let redIsCorrect = !redPass && Boolean(redRes?.isCorrect);
      let blueIsCorrect = !bluePass && Boolean(blueRes?.isCorrect);

      // Numpad Closest özel değerlendirmesi
      if (
        currentQuestion.type === 'numpad_closest' &&
        !redPass &&
        !bluePass &&
        redRes?.numericAnswer !== undefined &&
        blueRes?.numericAnswer !== undefined
      ) {
        const correctVal = (currentQuestion.payload as any)?.correctAnswer ?? 0;
        const comp = evaluateNumpadWinner(
          correctVal,
          { playerId: 'red', answer: redRes.numericAnswer, timeMs: redTime * 1000 },
          { playerId: 'blue', answer: blueRes.numericAnswer, timeMs: blueTime * 1000 }
        );

        if (comp.winnerPlayerId === 'red') {
          redIsCorrect = true;
          blueIsCorrect = false;
        } else if (comp.winnerPlayerId === 'blue') {
          blueIsCorrect = true;
          redIsCorrect = false;
        } else {
          redIsCorrect = true;
          blueIsCorrect = true;
        }
      }

      const qType = currentQuestion?.type;
      const allowsPartial = ['matrix_toggle', 'pair_matching', 'swipe_grouping'].includes(qType || '');
      const rawRedAcc = redRes?.accuracy ?? (redIsCorrect ? 1 : 0);
      const rawBlueAcc = blueRes?.accuracy ?? (blueIsCorrect ? 1 : 0);
      const redAcc = redPass ? 0 : (redIsCorrect ? 1 : (allowsPartial ? rawRedAcc : 0));
      const blueAcc = bluePass ? 0 : (blueIsCorrect ? 1 : (allowsPartial ? rawBlueAcc : 0));

      // Skor Hesaplama (Hız Bonusu + Seri Çarpanı + Kısmi Doğruluk Doğrulama)
      const redScore = calculateQuestionScore({
        basePoints,
        timeLimitSeconds: durationSec,
        elapsedTimeMs: redTime * 1000,
        isCorrect: redIsCorrect,
        streak: redStreak,
        accuracy: redAcc,
      });

      const blueScore = calculateQuestionScore({
        basePoints,
        timeLimitSeconds: durationSec,
        elapsedTimeMs: blueTime * 1000,
        isCorrect: blueIsCorrect,
        streak: blueStreak,
        accuracy: blueAcc,
      });

      // Puanları state'e aktar
      setRedPointsAwarded(redScore.points);
      setRedSpeedBonus(redScore.speedBonus);
      setBluePointsAwarded(blueScore.points);
      setBlueSpeedBonus(blueScore.speedBonus);

      setRedTotalScore((prev) => prev + redScore.points);
      setBlueTotalScore((prev) => prev + blueScore.points);

      const nextRedStreak = redIsCorrect ? redStreak + 1 : (redScore.points > 0 ? redStreak : 0);
      const nextBlueStreak = blueIsCorrect ? blueStreak + 1 : (blueScore.points > 0 ? blueStreak : 0);
      setRedStreak(nextRedStreak);
      setBlueStreak(nextBlueStreak);
      setRedMaxStreak((prev) => Math.max(prev, nextRedStreak));
      setBlueMaxStreak((prev) => Math.max(prev, nextBlueStreak));

      // Geçmişe ekle
      const historyEntry: RoundHistoryItem = {
        roundIndex: currentQuestionIndex,
        question: currentQuestion,
        red: {
          isCorrect: redIsCorrect || redScore.points > 0,
          passed: redPass,
          timeElapsedSec: redTime,
          pointsEarned: redScore.points,
          speedBonus: redScore.speedBonus,
        },
        blue: {
          isCorrect: blueIsCorrect || blueScore.points > 0,
          passed: bluePass,
          timeElapsedSec: blueTime,
          pointsEarned: blueScore.points,
          speedBonus: blueScore.speedBonus,
        },
      };

      setMatchHistory((prev) => [...prev, historyEntry]);

      // Raunt Sonu (Intermission) Fazına Geç
      setPhase('intermission');
      if (redIsCorrect || blueIsCorrect) {
        playTone(659, 'triangle', 0.25, isMuted);
      } else {
        playTone(260, 'sawtooth', 0.25, isMuted);
      }
    },
    [currentQuestion, currentQuestionIndex, redStreak, blueStreak, isMuted]
  );

  // Zaman 0 olduğunda henüz cevaplamayanları süre aşımı ile tamamla
  useEffect(() => {
    if (phase === 'battle' && timeLeft === 0) {
      const redTime = redAnswered
        ? redTimeElapsedSec
        : currentQuestion?.timeLimitSeconds || 25;
      const blueTime = blueAnswered
        ? blueTimeElapsedSec
        : currentQuestion?.timeLimitSeconds || 25;

      const finalRedRes = redAnswered ? redAnswerResult : { isCorrect: false, accuracy: 0 };
      const finalBlueRes = blueAnswered ? blueAnswerResult : { isCorrect: false, accuracy: 0 };

      if (!redAnswered) {
        setRedAnswered(true);
        setRedTimeElapsedSec(redTime);
        setRedAnswerResult(finalRedRes);
      }
      if (!blueAnswered) {
        setBlueAnswered(true);
        setBlueTimeElapsedSec(blueTime);
        setBlueAnswerResult(finalBlueRes);
      }

      finalizeRound(
        finalRedRes,
        redPassed,
        redTime,
        finalBlueRes,
        bluePassed,
        blueTime
      );
    }
  }, [
    timeLeft,
    phase,
    redAnswered,
    blueAnswered,
    redAnswerResult,
    blueAnswerResult,
    redPassed,
    bluePassed,
    redTimeElapsedSec,
    blueTimeElapsedSec,
    currentQuestion,
    finalizeRound,
  ]);

  // Her iki takım da cevap verdiğinde (veya pas geçtiğinde) tetikleme
  useEffect(() => {
    if (phase === 'battle' && redAnswered && blueAnswered) {
      finalizeRound(
        redAnswerResult,
        redPassed,
        redTimeElapsedSec,
        blueAnswerResult,
        bluePassed,
        blueTimeElapsedSec
      );
    }
  }, [
    phase,
    redAnswered,
    blueAnswered,
    redAnswerResult,
    blueAnswerResult,
    redPassed,
    bluePassed,
    redTimeElapsedSec,
    blueTimeElapsedSec,
    finalizeRound,
  ]);

  // Kırmızı Takım Cevap Gönderimi
  const handleRedSubmit = (result: AnswerResult) => {
    if (redAnswered || phase !== 'battle') return;
    const elapsed = Math.min(
      timeLimit,
      Math.max(0.2, (Date.now() - questionStartTimeRef.current) / 1000)
    );
    setRedTimeElapsedSec(elapsed);
    setRedAnswerResult(result);
    setRedAnswered(true);
    playTone(523, 'sine', 0.12, isMuted);
  };

  // Kırmızı Takım Soruyu Geç (Boş Bırak)
  const handleRedPass = () => {
    if (redAnswered || phase !== 'battle') return;
    const elapsed = Math.min(
      timeLimit,
      Math.max(0.2, (Date.now() - questionStartTimeRef.current) / 1000)
    );
    setRedTimeElapsedSec(elapsed);
    setRedPassed(true);
    setRedAnswerResult({ isCorrect: false, accuracy: 0 });
    setRedAnswered(true);
    playTone(330, 'sine', 0.1, isMuted);
  };

  // Mavi Takım Cevap Gönderimi
  const handleBlueSubmit = (result: AnswerResult) => {
    if (blueAnswered || phase !== 'battle') return;
    const elapsed = Math.min(
      timeLimit,
      Math.max(0.2, (Date.now() - questionStartTimeRef.current) / 1000)
    );
    setBlueTimeElapsedSec(elapsed);
    setBlueAnswerResult(result);
    setBlueAnswered(true);
    playTone(523, 'sine', 0.12, isMuted);
  };

  // Mavi Takım Soruyu Geç (Boş Bırak)
  const handleBluePass = () => {
    if (blueAnswered || phase !== 'battle') return;
    const elapsed = Math.min(
      timeLimit,
      Math.max(0.2, (Date.now() - questionStartTimeRef.current) / 1000)
    );
    setBlueTimeElapsedSec(elapsed);
    setBluePassed(true);
    setBlueAnswerResult({ isCorrect: false, accuracy: 0 });
    setBlueAnswered(true);
    playTone(330, 'sine', 0.1, isMuted);
  };

  // Sıradaki Soruya Geç (Intermission -> Sonraki Soru veya Final)
  const handleAdvanceToNext = useCallback(() => {
    setIntermissionCountdown(null);
    if (currentQuestionIndex + 1 >= questions.length) {
      setPhase('finished');
      playTone(784, 'triangle', 0.4, isMuted);
    } else {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      initQuestionRound(questions[nextIdx]);
      setPhase('battle');
      playTone(587, 'triangle', 0.2, isMuted);
    }
  }, [currentQuestionIndex, questions, isMuted]);

  // Soru Arası 3 Saniyelik Geri Sayım Motoru (3 -> 2 -> 1 -> Başla)
  useEffect(() => {
    if (phase !== 'intermission' || intermissionCountdown === null) return;

    if (intermissionCountdown <= 0) {
      handleAdvanceToNext();
      return;
    }

    playTone(523, 'sine', 0.12, isMuted);

    const timer = setTimeout(() => {
      setIntermissionCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, intermissionCountdown, handleAdvanceToNext, isMuted]);

  // Çekişme Çubuğu Dinamometre Oranları
  const totalScoreBoth = redTotalScore + blueTotalScore;
  let redScorePercent = 50;
  if (totalScoreBoth > 0) {
    redScorePercent = Math.max(12, Math.min(88, Math.round((redTotalScore / totalScoreBoth) * 100)));
  }

  // Dairesel Geri Sayım SVG Hesapları
  const safeTimeLimit = Math.max(1, timeLimit);
  const progressRatio = Math.max(0, Math.min(1, timeLeft / safeTimeLimit));
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);
  const isUrgent = timeLeft <= 5 && timeLeft > 0;

  // =========================================================================
  // 1. FAZ: BAŞLANGIÇ KURULUM (SETUP) EKRANI
  // =========================================================================
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-x-hidden font-sans">
        {/* Glow & Ambiyans */}
        <div className="hero-button-blur -top-24 -left-24 opacity-35 pointer-events-none" />
        <div className="hero-button-blur -bottom-24 -right-24 opacity-30 pointer-events-none" />

        {/* Üst Bar: Başlık & Çıkış */}
        <header className="flex items-center justify-between gap-4 max-w-6xl mx-auto w-full border-b border-orange-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-600 to-[#F14E13] flex items-center justify-center shadow-lg shadow-[#F14E13]/30">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  SINIF İÇİ CANLI YARIŞMA
                </span>
                <span className="text-xs font-mono text-[#B5CBC8]">/tahta</span>
              </div>
              <h1 className="font-poppins font-black text-xl sm:text-2xl text-white tracking-tight">
                🖥️ İŞLER AKILLI TAHTA DÜELLO MODU
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-white/10 bg-[#1A0E1C] hover:bg-white/10 text-zinc-300 flex items-center gap-1.5 text-xs font-semibold transition-all"
              title="Tam Ekran Aç/Kapat"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Normal Ekran' : 'Tam Ekran'}</span>
            </button>
            <button
              onClick={onExit}
              className="px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center gap-1.5 text-xs font-semibold transition-all"
              title="Öğrenci Arayüzüne Dön"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Lobiye Dön</span>
            </button>
          </div>
        </header>

        {/* 2'li Sekme Seçici: 2 Takım Düello vs Canlı Sınıf Kahoot Modu */}
        <div className="max-w-6xl mx-auto w-full pt-4">
          <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[#0F0510] border border-white/10 max-w-2xl mx-auto w-full shadow-lg">
            <button
              onClick={() => setBoardMode('duel')}
              className={`py-3 px-4 rounded-xl font-poppins font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                boardMode === 'duel'
                  ? 'bg-gradient-to-r from-orange-600 to-[#F14E13] text-white shadow-lg shadow-[#F14E13]/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Swords className="w-4 h-4 shrink-0" />
              <span>⚔️ 2 Takım Tahtada Düello</span>
            </button>
            <button
              onClick={() => setBoardMode('kahoot')}
              className={`py-3 px-4 rounded-xl font-poppins font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                boardMode === 'kahoot'
                  ? 'bg-gradient-to-r from-orange-600 to-[#F14E13] text-white shadow-lg shadow-[#F14E13]/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              <span>📱 QR ile Canlı Sınıf (Kahoot Modu)</span>
            </button>
          </div>
        </div>

        {/* MOD 2: KAHOOT CANLI SINIF YARIŞMASI */}
        {boardMode === 'kahoot' ? (
          <main className="max-w-6xl mx-auto w-full py-6 flex-1 flex flex-col justify-center">
            <KahootHostView onBackToDuel={() => setBoardMode('duel')} />
          </main>
        ) : (
          /* MOD 1: 2 TAKIM TAHTADA DÜELLO AYARLARI */
          <>
            <main className="max-w-6xl mx-auto w-full py-6 flex flex-col gap-6">
              {/* Takım Kartları (Yan Yana Kırmızı vs Mavi) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Kırmızı Takım Kartı */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-red-950/50 via-[#1A0E1C] to-black/70 border-2 border-red-500/40 shadow-xl shadow-red-950/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-poppins font-black text-lg text-red-400">
                    🔴 SOL KANAT: 1. TAKIM
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  Sol Dokunmatik Alan
                </span>
              </div>
              <label className="text-xs font-semibold text-zinc-400">Takım Adı (Düzenlenebilir):</label>
              <input
                type="text"
                value={redTeamName}
                onChange={(e) => setRedTeamName(e.target.value)}
                maxLength={24}
                className="w-full px-4 py-3 rounded-2xl bg-[#0F0510] border border-red-500/40 text-white font-poppins font-bold text-lg focus:outline-none focus:border-red-400 transition-all"
                placeholder="Örn: Kırmızı Şimşekler"
              />
              <p className="text-xs text-zinc-400">
                Sol alt panelden yarışacak öğrenciler bu takımı temsil eder.
              </p>
            </div>

            {/* Mavi Takım Kartı */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-950/50 via-[#1A0E1C] to-black/70 border-2 border-blue-500/40 shadow-xl shadow-blue-950/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-poppins font-black text-lg text-blue-400">
                    🔵 SAĞ KANAT: 2. TAKIM
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Sağ Dokunmatik Alan
                </span>
              </div>
              <label className="text-xs font-semibold text-zinc-400">Takım Adı (Düzenlenebilir):</label>
              <input
                type="text"
                value={blueTeamName}
                onChange={(e) => setBlueTeamName(e.target.value)}
                maxLength={24}
                className="w-full px-4 py-3 rounded-2xl bg-[#0F0510] border border-blue-500/40 text-white font-poppins font-bold text-lg focus:outline-none focus:border-blue-400 transition-all"
                placeholder="Örn: Mavi Fırtına"
              />
              <p className="text-xs text-zinc-400">
                Sağ alt panelden yarışacak öğrenciler bu takımı temsil eder.
              </p>
            </div>
          </div>

          {/* Karşılaşma Kuralları ve Seçimler */}
          <div className="p-6 rounded-3xl bg-[#1A0E1C]/90 border border-white/10 shadow-lg flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Sınav Türü */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                  Sınav Türü
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#0F0510] p-1.5 rounded-2xl border border-white/5">
                  {(['TYT', 'AYT', 'Karma'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedExamType(t)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedExamType === t
                          ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ders Seçimi */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                  Ders Havuzu
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#0F0510] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#F14E13]"
                >
                  <option value="all">Tüm Dersler (Karma Havuz)</option>
                  <option value="matematik">Matematik</option>
                  <option value="fizik">Fizik</option>
                  <option value="kimya">Kimya</option>
                  <option value="biyoloji">Biyoloji</option>
                  <option value="turkce">Türkçe</option>
                </select>
              </div>

              {/* Soru Sayısı */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                  Soru Sayısı
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#0F0510] p-1.5 rounded-2xl border border-white/5">
                  {[5, 7, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        questionCount === n
                          ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {n} Soru
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bilgilendirme Rozetleri */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5 text-xs text-zinc-300">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Kopya Önleme:</strong> Hamlesini yapan takımın paneli gizlenir ve kilitlenir.
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Hız & Seri Bonusu:</strong> Hızlı cevaplayanlar ekstra hız ve seri puanı kazanır.
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>14 İnteraktif Mekanik:</strong> Eşleştirme, sıralama, matris, numpad ve fazlası.
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Alt Büyük Başlat Butonu */}
        <footer className="max-w-6xl mx-auto w-full pt-4">
          <button
            onClick={handleStartDuel}
            className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-red-600 text-white font-poppins font-black text-lg sm:text-xl shadow-2xl shadow-[#F14E13]/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 tracking-wide border border-white/20"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>🖥️ AKILLI TAHTA DÜELLOSUNU BAŞLAT ({questionCount} SORU)</span>
          </button>
        </footer>
        </>
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. FAZ: FİNAL / PODYUM VE ŞAMPİYONLUK EKRANI
  // =========================================================================
  if (phase === 'finished') {
    const isRedWinner = redTotalScore > blueTotalScore;
    const isBlueWinner = blueTotalScore > redTotalScore;
    const isDraw = redTotalScore === blueTotalScore;

    const winnerName = isRedWinner ? redTeamName : isBlueWinner ? blueTeamName : 'Beraberlik';

    const redCorrectCount = matchHistory.filter((h) => h.red.isCorrect).length;
    const blueCorrectCount = matchHistory.filter((h) => h.blue.isCorrect).length;

    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-x-hidden font-sans">
        <div className="hero-button-blur -top-24 -left-24 opacity-35 pointer-events-none" />
        <div className="hero-button-blur -bottom-24 -right-24 opacity-30 pointer-events-none" />

        {/* Üst Bar */}
        <header className="flex items-center justify-between gap-4 max-w-5xl mx-auto w-full border-b border-orange-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold">AKILLI TAHTA BİLGİ DÜELLOSU</span>
              <h1 className="font-poppins font-black text-lg sm:text-xl text-white">
                🏆 KARŞILAŞMA SONUCU VE ŞAMPİYONLUK
              </h1>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-white/10 bg-[#1A0E1C] hover:bg-white/10 text-zinc-300 flex items-center gap-1.5 text-xs font-semibold"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Normal' : 'Tam Ekran'}</span>
          </button>
        </header>

        {/* Şampiyonluk Kutusu */}
        <main className="max-w-5xl mx-auto w-full py-6 flex flex-col gap-6 items-center">
          <div
            className={`w-full p-8 rounded-3xl border-2 text-center relative overflow-hidden shadow-2xl ${
              isRedWinner
                ? 'bg-gradient-to-b from-red-950/60 via-[#1A0E1C] to-black/80 border-red-500 shadow-red-950/50'
                : isBlueWinner
                ? 'bg-gradient-to-b from-blue-950/60 via-[#1A0E1C] to-black/80 border-blue-500 shadow-blue-950/50'
                : 'bg-gradient-to-b from-purple-950/60 via-[#1A0E1C] to-black/80 border-amber-500 shadow-amber-950/50'
            }`}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mb-4 shadow-xl shadow-amber-400/30">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>

            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-amber-400 mb-1 block">
              {isDraw ? 'DÜELLO BERABERLİKLE BİTTİ' : 'DÜELLO ŞAMPİYONU'}
            </span>

            <h2 className="text-3xl sm:text-5xl font-black font-poppins text-white mb-3">
              {isDraw ? '🤝 HER İKİ TAKIM DA KAZANDI!' : `🎉 ${winnerName.toUpperCase()}`}
            </h2>

            <p className="text-sm font-mono text-zinc-300 max-w-md mx-auto">
              Toplam {questions.length} soru sonunda sınıfta heyecan dolu bir karşılaşma tamamlandı!
            </p>

            {/* Skor Karşılaştırması */}
            <div className="flex items-center justify-center gap-6 sm:gap-12 mt-6">
              <div className="flex flex-col items-center">
                <span className="text-xs font-mono font-bold text-red-400">🔴 {redTeamName}</span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-red-400">
                  {redTotalScore}
                </span>
                <span className="text-[11px] text-zinc-400">Puan</span>
              </div>

              <div className="text-2xl font-mono font-black text-zinc-600">VS</div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-mono font-bold text-blue-400">🔵 {blueTeamName}</span>
                <span className="text-3xl sm:text-4xl font-mono font-black text-blue-400">
                  {blueTotalScore}
                </span>
                <span className="text-[11px] text-zinc-400">Puan</span>
              </div>
            </div>
          </div>

          {/* İstatistik Tablosu */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#1A0E1C] border border-white/10 flex flex-col items-center text-center">
              <span className="text-xs text-zinc-400 font-semibold mb-1">Doğru Sayısı</span>
              <div className="flex items-center gap-3 text-lg font-mono font-black">
                <span className="text-red-400">
                  🔴 {redCorrectCount}/{questions.length}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-blue-400">
                  🔵 {blueCorrectCount}/{questions.length}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A0E1C] border border-white/10 flex flex-col items-center text-center">
              <span className="text-xs text-zinc-400 font-semibold mb-1">En Yüksek Seri</span>
              <div className="flex items-center gap-3 text-lg font-mono font-black">
                <span className="text-red-400">🔴 {redMaxStreak} Soru</span>
                <span className="text-zinc-500">•</span>
                <span className="text-blue-400">🔵 {blueMaxStreak} Soru</span>
              </div>
            </div>
          </div>

          {/* Soru Soru Özet Listesi */}
          <div className="w-full p-4 rounded-2xl bg-[#1A0E1C]/80 border border-white/10">
            <h3 className="text-xs font-poppins font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Raunt Raunt Detaylı Sonuçlar
            </h3>
            <div className="flex flex-col gap-2">
              {matchHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F0510] border border-white/5 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">Soru {idx + 1}:</span>
                    <span className="text-zinc-300 truncate max-w-[240px] sm:max-w-md">
                      {item.question.prompt}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={item.red.isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                      🔴 {item.red.isCorrect ? `+${item.red.pointsEarned}p` : '0p'} ({item.red.timeElapsedSec.toFixed(1)}s)
                    </span>
                    <span className="text-zinc-600">|</span>
                    <span className={item.blue.isCorrect ? 'text-emerald-400 font-bold' : 'text-blue-400'}>
                      🔵 {item.blue.isCorrect ? `+${item.blue.pointsEarned}p` : '0p'} ({item.blue.timeElapsedSec.toFixed(1)}s)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Alt Aksiyon Butonları */}
        <footer className="max-w-5xl mx-auto w-full pt-4 flex items-center justify-between gap-4">
          <button
            onClick={() => setPhase('setup')}
            className="px-6 py-3.5 rounded-2xl bg-[#F14E13] hover:bg-[#D6400D] text-white font-poppins font-bold text-sm shadow-xl shadow-[#F14E13]/30 flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeni Akıllı Tahta Düellosu</span>
          </button>

          <button
            onClick={onExit}
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-poppins font-bold text-sm flex items-center gap-2 transition-all border border-white/10"
          >
            <Home className="w-4 h-4" />
            <span>Ana Menüye / Lobiye Dön</span>
          </button>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 3. FAZ: RAUNT SONUCU (INTERMISSION) EKRANI
  // =========================================================================
  if (phase === 'intermission') {
    const isLastQuestion = currentQuestionIndex + 1 >= questions.length;

    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-x-hidden font-sans">
        <div className="hero-button-blur -top-24 -left-24 opacity-35 pointer-events-none" />
        <div className="hero-button-blur -bottom-24 -right-24 opacity-30 pointer-events-none" />

        {/* Üst Karşılaştırma Barı */}
        <header className="flex items-center justify-between gap-4 max-w-6xl mx-auto w-full border-b border-orange-500/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-[#FF7A45] text-xs font-mono font-bold border border-orange-500/40">
              RAUNT {currentQuestionIndex + 1} / {questions.length} SONUCU
            </span>
            <h2 className="font-poppins font-black text-lg sm:text-xl text-white">
              🎯 Soru Değerlendirmesi ve Puanlar
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-[#1A0E1C] border border-white/10 text-zinc-300 hover:text-white"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-[#1A0E1C] border border-white/10 text-zinc-300 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Ana İçerik: Sol Takım — Orta Doğru Çözüm — Sağ Takım */}
        <main className="max-w-6xl mx-auto w-full py-4 flex flex-col gap-6">
          {/* İki Takımın Bu Raundaki Performansı */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Kırmızı Takım Raunt Kartı */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border-2 flex flex-col gap-3 transition-all ${
                redAnswerResult?.isCorrect && !redPassed
                  ? 'bg-gradient-to-br from-emerald-950/40 via-[#1A0E1C] to-black/70 border-emerald-500/60 shadow-xl shadow-emerald-950/30'
                  : redPointsAwarded > 0 && !redPassed
                  ? 'bg-gradient-to-br from-amber-950/40 via-[#1A0E1C] to-black/70 border-amber-500/60 shadow-xl shadow-amber-950/30'
                  : 'bg-gradient-to-br from-red-950/40 via-[#1A0E1C] to-black/70 border-red-500/40 shadow-xl shadow-red-950/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-poppins font-black text-lg text-red-400">
                  🔴 {redTeamName.toUpperCase()}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                    redPassed
                      ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      : redAnswerResult?.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : redPointsAwarded > 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-red-500/20 text-red-300 border-red-500/50'
                  }`}
                >
                  {redPassed
                    ? '⏭️ PAS GEÇİLDİ'
                    : redAnswerResult?.isCorrect
                    ? '✅ DOĞRU CEVAP'
                    : redPointsAwarded > 0
                    ? `⚡ KISMİ DOĞRU (%${Math.round((redAnswerResult?.accuracy || 0) * 100)})`
                    : '❌ YANLIŞ CEVAP'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-white/5 text-sm font-mono">
                <span className="text-zinc-400">Cevaplama Süresi:</span>
                <span className="text-white font-bold">{redTimeElapsedSec.toFixed(1)} saniye</span>
              </div>

              <div className="flex items-center justify-between py-1 text-sm font-mono">
                <span className="text-zinc-400">Kazanılan Puan:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-emerald-400">
                    +{redPointsAwarded} Puan
                  </span>
                  {redSpeedBonus > 0 && (
                    <span className="text-xs text-amber-400 font-semibold">
                      (+{redSpeedBonus} Hız Bonusu)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-sm font-mono">
                <span className="text-zinc-400">Güncel Toplam Skor:</span>
                <span className="text-lg font-black text-white">{redTotalScore} Puan</span>
              </div>
            </div>

            {/* Mavi Takım Raunt Kartı */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border-2 flex flex-col gap-3 transition-all ${
                blueAnswerResult?.isCorrect && !bluePassed
                  ? 'bg-gradient-to-br from-emerald-950/40 via-[#1A0E1C] to-black/70 border-emerald-500/60 shadow-xl shadow-emerald-950/30'
                  : bluePointsAwarded > 0 && !bluePassed
                  ? 'bg-gradient-to-br from-amber-950/40 via-[#1A0E1C] to-black/70 border-amber-500/60 shadow-xl shadow-amber-950/30'
                  : 'bg-gradient-to-br from-blue-950/40 via-[#1A0E1C] to-black/70 border-blue-500/40 shadow-xl shadow-blue-950/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-poppins font-black text-lg text-blue-400">
                  🔵 {blueTeamName.toUpperCase()}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                    bluePassed
                      ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      : blueAnswerResult?.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : bluePointsAwarded > 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-red-500/20 text-red-300 border-red-500/50'
                  }`}
                >
                  {bluePassed
                    ? '⏭️ PAS GEÇİLDİ'
                    : blueAnswerResult?.isCorrect
                    ? '✅ DOĞRU CEVAP'
                    : bluePointsAwarded > 0
                    ? `⚡ KISMİ DOĞRU (%${Math.round((blueAnswerResult?.accuracy || 0) * 100)})`
                    : '❌ YANLIŞ CEVAP'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-white/5 text-sm font-mono">
                <span className="text-zinc-400">Cevaplama Süresi:</span>
                <span className="text-white font-bold">{blueTimeElapsedSec.toFixed(1)} saniye</span>
              </div>

              <div className="flex items-center justify-between py-1 text-sm font-mono">
                <span className="text-zinc-400">Kazanılan Puan:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-emerald-400">
                    +{bluePointsAwarded} Puan
                  </span>
                  {blueSpeedBonus > 0 && (
                    <span className="text-xs text-amber-400 font-semibold">
                      (+{blueSpeedBonus} Hız Bonusu)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-sm font-mono">
                <span className="text-zinc-400">Güncel Toplam Skor:</span>
                <span className="text-lg font-black text-white">{blueTotalScore} Puan</span>
              </div>
            </div>
          </div>

          {/* Ortada Doğru Çözüm Açıklaması */}
          {currentQuestion?.explanation && (
            <div className="p-5 rounded-3xl bg-[#1A0E1C]/95 border border-amber-500/30 shadow-lg text-left">
              <div className="flex items-center gap-2 mb-2 text-amber-400">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <span className="font-poppins font-bold text-sm tracking-wide">
                  DOĞRU ÇÖZÜM & AÇIKLAMA:
                </span>
              </div>
              <p className="text-sm md:text-base text-zinc-200 leading-relaxed font-sans">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Dinamometre / Çekişme Barı */}
          <div className="p-4 rounded-2xl bg-[#1A0E1C] border border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-red-400">🔴 {redTeamName}: {redTotalScore}p</span>
              <span className="text-zinc-400">
                {redTotalScore > blueTotalScore
                  ? `🔴 Kırmızı ${redTotalScore - blueTotalScore}p Önde`
                  : blueTotalScore > redTotalScore
                  ? `🔵 Mavi ${blueTotalScore - redTotalScore}p Önde`
                  : 'Eşitlik'}
              </span>
              <span className="text-blue-400">🔵 {blueTeamName}: {blueTotalScore}p</span>
            </div>
            <div className="h-4 rounded-full bg-zinc-900 overflow-hidden flex border border-white/10">
              <div
                className="bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 h-full"
                style={{ width: `${redScorePercent}%` }}
              />
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 h-full"
                style={{ width: `${100 - redScorePercent}%` }}
              />
            </div>
          </div>
        </main>

        {/* 3 Saniyelik Geri Sayım Görseli */}
        {intermissionCountdown !== null && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-36 h-36 rounded-full border-4 border-orange-500/40 flex items-center justify-center animate-ping absolute opacity-30" />
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-orange-600 via-[#F14E13] to-red-600 border-4 border-white/40 flex items-center justify-center shadow-2xl shadow-[#F14E13]/60">
                <span className="font-poppins font-black text-5xl sm:text-6xl text-white animate-bounce">
                  {intermissionCountdown}
                </span>
              </div>
            </div>
            <h3 className="font-poppins font-black text-2xl sm:text-4xl text-white tracking-wide mb-2 text-center">
              Yeni Soru Başlıyor!
            </h3>
            <p className="text-sm sm:text-base font-mono text-orange-300 text-center">
              Takımlar dokunmatik tahtadaki yerlerine... ({intermissionCountdown})
            </p>
          </div>
        )}

        {/* Alt İlerleme Butonu */}
        <footer className="max-w-6xl mx-auto w-full pt-4 flex items-center justify-center">
          <button
            onClick={() => {
              if (intermissionCountdown !== null) return;
              if (isLastQuestion) {
                handleAdvanceToNext();
              } else {
                setIntermissionCountdown(3);
              }
            }}
            disabled={intermissionCountdown !== null}
            className="w-full sm:w-auto px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-red-600 hover:brightness-110 active:scale-95 text-white font-poppins font-black text-base sm:text-xl shadow-2xl shadow-[#F14E13]/40 flex items-center justify-center gap-3 border border-white/20 transition-all disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {intermissionCountdown !== null ? (
              <>
                <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                <span>Yeni Soru Başlıyor: {intermissionCountdown}...</span>
              </>
            ) : isLastQuestion ? (
              <>
                <span>🏆 Sonuçları Gör</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </>
            ) : (
              <>
                <span>⏭️ Sonraki Soruya Geç</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </>
            )}
          </button>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 2. FAZ: CANLI KARŞILAŞMA (BATTLE) EKRANI
  // =========================================================================
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#110712] text-white flex items-center justify-center p-6">
        <p className="text-zinc-400 font-mono">Soru yükleniyor...</p>
      </div>
    );
  }

  const payload: any = currentQuestion.payload || {};

  return (
    <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-2.5 sm:p-5 relative overflow-x-hidden font-sans">
      {/* Arka Plan Glow */}
      <div className="hero-button-blur -top-24 -left-24 opacity-35 pointer-events-none" />
      <div className="hero-button-blur -bottom-24 -right-24 opacity-30 pointer-events-none" />

      {/* =========================================================================
       * 1. ÜST HEADER: SKORLAR, ÇEKİŞME BARI, DAİRESEL GERİ SAYIM
       * ========================================================================= */}
      <header className="w-full max-w-7xl mx-auto bg-[rgba(26,14,28,0.95)] backdrop-blur-md border border-[rgba(241,78,19,0.25)] rounded-2xl p-2.5 sm:p-4 shadow-xl shadow-black/40 sticky top-1 z-30 mb-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
          {/* Sol: 🔴 Kırmızı Takım Skoru & Serisi */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-500 flex items-center justify-center shadow-lg shadow-red-500/25 shrink-0">
              <span className="font-poppins font-black text-sm sm:text-base text-white">🔴</span>
            </div>
            <div className="min-w-0">
              <span className="font-poppins font-bold text-xs sm:text-sm text-red-400 block truncate max-w-[90px] sm:max-w-[140px]">
                {redTeamName}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-bold mt-0.5">
                <span className="text-white text-sm sm:text-base">{redTotalScore} Puan</span>
                {redStreak > 1 && (
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>x{redStreak}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Orta: Soru No, Dairesel Geri Sayım, Çekişme Barı */}
          <div className="flex flex-col items-center justify-center flex-1 max-w-md px-1 sm:px-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-poppins font-bold text-[10px] sm:text-xs text-[#B5CBC8] uppercase tracking-wider">
                Soru {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Dairesel Sayaç */}
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 56 56" className="w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className="stroke-white/10"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  className={`transition-all duration-300 ease-linear ${
                    isUrgent ? 'stroke-red-500 animate-pulse' : 'stroke-[#F14E13]'
                  }`}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span
                className={`absolute font-mono font-black text-xs sm:text-sm ${
                  isUrgent ? 'text-red-400 animate-ping-once' : 'text-white'
                }`}
              >
                {timeLeft}
              </span>
            </div>

            {/* Çekişme Çubuğu */}
            <div className="w-full mt-1.5 h-2 rounded-full bg-zinc-900 overflow-hidden flex border border-white/10">
              <div
                className="bg-red-500 transition-all duration-300 h-full"
                style={{ width: `${redScorePercent}%` }}
              />
              <div
                className="bg-blue-500 transition-all duration-300 h-full"
                style={{ width: `${100 - redScorePercent}%` }}
              />
            </div>
          </div>

          {/* Sağ: 🔵 Mavi Takım Skoru & Butonlar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 justify-end min-w-0">
            <div className="min-w-0 text-right">
              <span className="font-poppins font-bold text-xs sm:text-sm text-blue-400 block truncate max-w-[90px] sm:max-w-[140px]">
                {blueTeamName}
              </span>
              <div className="flex items-center justify-end gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-bold mt-0.5">
                {blueStreak > 1 && (
                  <span className="flex items-center gap-0.5 text-amber-400">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>x{blueStreak}</span>
                  </span>
                )}
                <span className="text-white text-sm sm:text-base">{blueTotalScore} Puan</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <span className="font-poppins font-black text-sm sm:text-base text-white">🔵</span>
            </div>

            {/* Kontrol Butonları */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                title="Tam Ekran (F11)"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onExit}
                className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-300 hover:text-red-400"
                title="Lobiye Dön"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
       * 2. ORTA MERKEZ ALAN: BÜYÜK ORTAK SORU SAHNESİ
       * ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto bg-[rgba(26,14,28,0.92)] border border-orange-500/30 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl mb-4 text-center transition-all">
        {/* Ders & Konu Rozeti + Puan */}
        <div className="flex items-center justify-center gap-2.5 mb-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/35 text-xs sm:text-sm font-poppins font-bold text-[#FF7A45]">
            <BookOpen className="w-3.5 h-3.5 shrink-0 text-[#F14E13]" />
            <span>
              {currentQuestion.subject.toUpperCase()} • {currentQuestion.topic}
            </span>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            ⭐ {currentQuestion.points || 100} Puan
          </span>
        </div>

        {/* Büyük Soru Metni (Prompt) */}
        <h2 className="font-poppins font-black text-lg sm:text-2xl md:text-3xl text-white leading-snug sm:leading-relaxed max-w-4xl mx-auto mb-2">
          {currentQuestion.prompt}
        </h2>

        {/* =====================================================================
         * EKSTRA SORU DETAYLARI / ÖZEL GÖRSEL ALANLARI
         * ===================================================================== */}
        {/* 1. Karşılaştırma Öğeleri (Comparison Items) */}
        {payload.comparisonItems && (
          <div className="flex items-center justify-center gap-3 sm:gap-6 my-4 max-w-xl mx-auto">
            <div className="flex-1 p-3.5 sm:p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 text-center">
              <span className="text-[10px] sm:text-xs text-orange-400 font-bold block mb-1">
                SOL DEĞER
              </span>
              <span className="text-lg sm:text-2xl font-mono font-bold text-white">
                {payload.comparisonItems.left}
              </span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm sm:text-base text-amber-400">
              VS
            </div>
            <div className="flex-1 p-3.5 sm:p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-center">
              <span className="text-[10px] sm:text-xs text-blue-400 font-bold block mb-1">
                SAĞ DEĞER
              </span>
              <span className="text-lg sm:text-2xl font-mono font-bold text-white">
                {payload.comparisonItems.right}
              </span>
            </div>
          </div>
        )}

        {/* 2. Denklem Şablonu (Equation Template) */}
        {payload.equationTemplate && (
          <div className="my-3 p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 text-center max-w-xl mx-auto">
            <span className="text-xs text-purple-300 font-bold block mb-1">DENKLEM ŞABLONU</span>
            <span className="text-base sm:text-xl font-mono font-bold text-purple-200">
              {payload.equationTemplate}
            </span>
          </div>
        )}

        {/* 3. Bağlam / Okuma Parçası (Context Prompt) */}
        {payload.contextPrompt && (
          <div className="my-3 p-3.5 rounded-2xl bg-[#0F0510] border border-white/15 text-left max-w-2xl mx-auto">
            <span className="text-xs text-amber-400 font-bold block mb-1">METİN / ÖN BİLGİ:</span>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
              {payload.contextPrompt}
            </p>
          </div>
        )}

        {/* 4. Zincir Başlangıcı (Start Entity) */}
        {payload.startEntity && (
          <div className="my-3 p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center inline-flex items-center gap-2.5">
            <span className="text-xs text-emerald-400 font-bold">BAŞLANGIÇ:</span>
            <span className="text-sm sm:text-base font-mono font-bold text-emerald-200">
              {payload.startEntity}
            </span>
            <span className="text-emerald-400 font-bold">➔ ...</span>
          </div>
        )}

        {/* 5. Hedef Sayı (Target Number) */}
        {payload.targetNumber !== undefined && (
          <div className="my-2 p-2 px-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 inline-flex items-center gap-2">
            <span className="text-xs text-amber-400 font-bold">HEDEF SAYI:</span>
            <span className="text-lg font-mono font-black text-amber-300">
              {payload.targetNumber}
            </span>
          </div>
        )}
      </section>

      {/* =========================================================================
       * 3. ALT ALAN: SOL ALT (🔴 KIRMIZI) & SAĞ ALT (🔵 MAVİ) CEVAPLAMA ALANI
       * ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-x-hidden">
        {/* =====================================================================
         * SOL ALT PANEL: 🔴 KIRMIZI TAKIM CEVAPLAMA YERİ
         * ===================================================================== */}
        <div className="border-2 border-red-500/40 bg-[#1A0E1C]/95 rounded-3xl p-3 sm:p-4 md:p-5 shadow-2xl shadow-red-950/30 flex flex-col justify-between transition-all overflow-x-hidden min-w-0 max-w-full">
          {/* Panel Header */}
          <div className="flex items-center justify-between gap-2 border-b border-red-500/25 pb-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="font-poppins font-black text-sm sm:text-base text-red-400 truncate">
                🔴 {redTeamName.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  redAnswered
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/15 border-red-500/30 text-red-300 animate-pulse'
                }`}
              >
                {redAnswered ? '✅ Kilitlendi' : '⏳ Cevap Bekleniyor...'}
              </span>

              <button
                onClick={handleRedPass}
                disabled={redAnswered}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Soruyu boş bırak"
              >
                ⏭️ Soruyu Geç
              </button>
            </div>
          </div>

          {/* Panel Body: Kopya Önleme Ekranı VEYA Bağımsız QuestionRenderer */}
          <div className="flex-1 flex flex-col justify-center overflow-x-hidden min-w-0">
            {redAnswered ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-gradient-to-b from-red-950/40 via-[#1A0E1C] to-black/60 rounded-2xl border border-red-500/30 text-center animate-fade-in min-h-[260px]">
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500/60 flex items-center justify-center mb-4 shadow-lg shadow-red-500/20">
                  <Lock className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-base sm:text-lg font-black font-poppins text-white mb-1.5 tracking-wide">
                  🔒 {redTeamName.toUpperCase()} HAMLESİNİ KİLİTLEDİ!
                </h3>
                <p className="text-xs sm:text-sm font-mono text-red-300/90 mb-3">
                  Süre: {redTimeElapsedSec.toFixed(1)} sn {redPassed ? '• (Pas Geçildi)' : ''}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>🔵 {blueTeamName} cevabı bekleniyor...</span>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-hidden min-w-0">
                <QuestionRenderer
                  key={`red-${currentQuestion.id}`}
                  question={currentQuestion}
                  onSubmit={handleRedSubmit}
                  disabled={redAnswered}
                />
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
         * SAĞ ALT PANEL: 🔵 MAVİ TAKIM CEVAPLAMA YERİ
         * ===================================================================== */}
        <div className="border-2 border-blue-500/40 bg-[#1A0E1C]/95 rounded-3xl p-3 sm:p-4 md:p-5 shadow-2xl shadow-blue-950/30 flex flex-col justify-between transition-all overflow-x-hidden min-w-0 max-w-full">
          {/* Panel Header */}
          <div className="flex items-center justify-between gap-2 border-b border-blue-500/25 pb-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span className="font-poppins font-black text-sm sm:text-base text-blue-400 truncate">
                🔵 {blueTeamName.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  blueAnswered
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-blue-500/15 border-blue-500/30 text-blue-300 animate-pulse'
                }`}
              >
                {blueAnswered ? '✅ Kilitlendi' : '⏳ Cevap Bekleniyor...'}
              </span>

              <button
                onClick={handleBluePass}
                disabled={blueAnswered}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Soruyu boş bırak"
              >
                ⏭️ Soruyu Geç
              </button>
            </div>
          </div>

          {/* Panel Body: Kopya Önleme Ekranı VEYA Bağımsız QuestionRenderer */}
          <div className="flex-1 flex flex-col justify-center overflow-x-hidden min-w-0">
            {blueAnswered ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-gradient-to-b from-blue-950/40 via-[#1A0E1C] to-black/60 rounded-2xl border border-blue-500/30 text-center animate-fade-in min-h-[260px]">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-500/60 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                  <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-base sm:text-lg font-black font-poppins text-white mb-1.5 tracking-wide">
                  🔒 {blueTeamName.toUpperCase()} HAMLESİNİ KİLİTLEDİ!
                </h3>
                <p className="text-xs sm:text-sm font-mono text-blue-300/90 mb-3">
                  Süre: {blueTimeElapsedSec.toFixed(1)} sn {bluePassed ? '• (Pas Geçildi)' : ''}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  <span>🔴 {redTeamName} cevabı bekleniyor...</span>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-hidden min-w-0">
                <QuestionRenderer
                  key={`blue-${currentQuestion.id}`}
                  question={currentQuestion}
                  onSubmit={handleBlueSubmit}
                  disabled={blueAnswered}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SmartboardScreen;
