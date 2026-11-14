import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../../types/game';
import { AnswerResult } from '../questions/questionProps';
import QuestionRenderer from '../questions/QuestionRenderer';
import { getRecommendationsForTopic } from '../../utils/resourceRecommendations';
import { soundEngine } from '../../utils/soundEngine';
import {
  Target,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Trophy,
  Coins,
  Sparkles,
  Volume2,
  VolumeX,
  Home,
  Check,
} from 'lucide-react';

export interface RevisionPracticeScreenProps {
  questions: Question[];
  topics: string[];
  modeTitle?: string;
  subtitle?: string;
  exitLabel?: string;
  rewardLabel?: string;
  onComplete: (stats: { solvedTopics: string[]; correctCount: number; totalCount: number }) => void;
  onExit: () => void;
}

export const RevisionPracticeScreen: React.FC<RevisionPracticeScreenProps> = ({
  questions: initialQuestions,
  topics,
  modeTitle = '🎯 Eksik Konu Pekiştirme',
  subtitle = 'BİREYSEL TELAFİ ANTRENMANI',
  exitLabel = 'Antrenmandan Çık',
  rewardLabel = '+30 Coin Telafi Ödülü',
  onComplete,
  onExit,
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [correctQuestionIds, setCorrectQuestionIds] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Yeni soruya geçildiğinde otomatik en üste yumuşak kaydır
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex, isFinished]);

  // Ses Durumu
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundEngine.getMuted());
  useEffect(() => {
    return soundEngine.subscribe(() => {
      setIsSoundMuted(soundEngine.getMuted());
    });
  }, []);

  // Bireysel antrenmanda rahatlatıcı ve odaklayıcı lobi müziği
  useEffect(() => {
    if (!isFinished) {
      soundEngine.startMusic('lobby');
    }
    return () => {
      soundEngine.startMusic('lobby');
    };
  }, [isFinished]);

  const currentQ = questions[currentIndex];

  // Öğrenci Cevapladığında
  const handleAnswer = (result: AnswerResult) => {
    if (hasAnswered || !currentQ) return;
    setHasAnswered(true);
    setLastResult(result);

    if (result.isCorrect) {
      soundEngine.playCorrect();
      if (!correctQuestionIds.has(currentQ.id)) {
        setCorrectQuestionIds((prev) => new Set(prev).add(currentQ.id));
        setCorrectCount((prev) => prev + 1);
      }
    } else {
      soundEngine.playWrong();
    }

    // Cevaplandığında ekranı gereksiz aşağı çekme; alt bar fixed bottom-0 olarak ekranda sabit kalacaktır.
  };

  // Şimdi Tekrar Dene
  const handleRetry = () => {
    soundEngine.playClick();
    setHasAnswered(false);
    setLastResult(null);
    setRetryCount((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sıradaki Soruya Geç veya Tamamla
  const handleNext = () => {
    soundEngine.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setHasAnswered(false);
      setLastResult(null);
      setRetryCount(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinished(true);
      soundEngine.stopMusic();
      soundEngine.playVictory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Tekrar Karıştır ve Baştan Çöz
  const handleReshuffleAndRestart = () => {
    soundEngine.playClick();
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setHasAnswered(false);
    setLastResult(null);
    setRetryCount(0);
    setCorrectCount(0);
    setCorrectQuestionIds(new Set());
    setIsFinished(false);
    soundEngine.startMusic('lobby');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ödülü Al ve Çık
  const handleClaimReward = () => {
    soundEngine.playClick();
    onComplete({
      solvedTopics: topics,
      correctCount,
      totalCount: questions.length,
    });
  };

  // İlerleme yüzdesi
  const progressPercent = Math.round(
    ((currentIndex + (hasAnswered ? 1 : 0)) / Math.max(1, questions.length)) * 100
  );

  // =========================================================================
  // 1. TAMAMLANDI EKRANI
  // =========================================================================
  if (isFinished) {
    const successRate = Math.round((correctCount / Math.max(1, questions.length)) * 100);

    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-x-hidden">
        {/* Glow & Ambiyans */}
        <div className="hero-button-blur -top-24 -left-24 opacity-30 pointer-events-none" />
        <div className="hero-button-blur -bottom-24 -right-24 opacity-25 pointer-events-none" />

        <header className="max-w-2xl mx-auto w-full flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Antrenman Tamamlandı
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.toggleMute();
              soundEngine.playClick();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
            title={isSoundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </header>

        <main className="max-w-2xl mx-auto w-full py-8 flex flex-col items-center text-center gap-6">
          {/* Kutlama Kartı */}
          <div className="w-full p-8 rounded-3xl bg-gradient-to-br from-[#1F1023] via-[#2A1130] to-[#140816] border-2 border-emerald-500/50 shadow-2xl flex flex-col items-center gap-4 animate-scale-up">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <Trophy className="w-10 h-10 text-emerald-400 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-300">
                {modeTitle.includes('Alıştırma') ? 'ALIŞTIRMA BAŞARIYLA TAMAMLANDI' : 'KAZANIM PEKİŞTİRME BAŞARILI'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-poppins text-white mt-1">
                {modeTitle.includes('Alıştırma') ? '🎉 Bireysel Alıştırma Tamamlandı!' : '🎉 Eksik Konu Antrenmanı Tamamlandı!'}
              </h1>
              <p className="text-xs sm:text-sm text-[#B5CBC8] mt-2 max-w-md mx-auto leading-relaxed">
                {modeTitle.includes('Alıştırma')
                  ? 'Seçtiğiniz ders ve zorluktaki soruları bireysel hızınızda çözerek pratik yaptınız.'
                  : 'Yanlış yaptığınız soruların çözüm adımlarını bireysel hızınızda inceleyerek eksiklerinizi başarıyla telafi ettiniz.'}
              </p>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-3 w-full mt-2">
              <div className="p-4 rounded-2xl bg-[#0F0510] border border-white/10 flex flex-col items-center">
                <span className="text-[11px] font-mono text-zinc-400 uppercase">Toplam Soru</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-white mt-1">
                  {questions.length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F0510] border border-white/10 flex flex-col items-center">
                <span className="text-[11px] font-mono text-zinc-400 uppercase">Doğru Sayısı</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-emerald-400 mt-1">
                  {correctCount}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F0510] border border-white/10 flex flex-col items-center">
                <span className="text-[11px] font-mono text-zinc-400 uppercase">Başarı</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-amber-400 mt-1">
                  %{successRate}
                </span>
              </div>
            </div>

            {/* Pekiştirilen Konular */}
            {topics.length > 0 && (
              <div className="w-full text-left bg-[#0F0510] p-4 rounded-2xl border border-white/10 mt-1">
                <span className="text-[11px] font-mono font-bold text-[#FF7A45] uppercase block mb-2">
                  📚 Çözülen Konular ({topics.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Telafi Ödülü Kartı */}
            <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/50 flex items-center justify-between gap-3 shadow-lg shadow-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/30 flex items-center justify-center shrink-0">
                  <Coins className="w-6 h-6 text-amber-300 animate-spin" />
                </div>
                <div className="text-left">
                  <span className="font-poppins font-black text-sm sm:text-base text-amber-200 block">
                    {rewardLabel}
                  </span>
                  <span className="text-[11px] text-amber-300/80 font-mono">
                    {modeTitle.includes('Alıştırma') ? 'Çözülen sorular başarı havuzunuza eklendi' : 'Eksiklik oranınız başarıyla düşürüldü'}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-400 text-black font-black font-mono text-xs shrink-0">
                KAZANILDI
              </span>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={handleReshuffleAndRestart}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-poppins font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Soruları Tekrar Karıştır & Çöz</span>
            </button>
            <button
              onClick={handleClaimReward}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 text-white font-poppins font-black text-sm shadow-xl shadow-[#F14E13]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-white/20"
            >
              <span>{modeTitle.includes('Alıştırma') ? 'Tamamla ve Menüye Dön' : 'Ödülü Al ve Eksik Konularıma Dön'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        <footer className="max-w-2xl mx-auto w-full text-center text-xs text-zinc-500 pb-2">
          İşler Teknoloji • Bireysel Adaptif Öğrenme Platformu
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 2. AKTİF SORU ÇÖZÜM & EĞİTSEL PEKİŞTİRME EKRANI
  // =========================================================================
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col items-center justify-center p-6">
        <p className="text-zinc-400 font-mono">Antrenman soruları yükleniyor...</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 rounded-xl bg-white/10 text-xs">
          Geri Dön
        </button>
      </div>
    );
  }

  // Yanlış veya kısmi doğru yapıldığında İşler Yayınları kaynak tavsiyeleri
  const recommendations = getRecommendationsForTopic(
    currentQ.subject,
    currentQ.topic,
    (currentQ as any).examType || 'TYT'
  );
  const topRec = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between font-sans relative overflow-x-clip">
      {/* Glow & Ambiyans */}
      <div className="hero-button-blur -top-24 -left-24 opacity-25 pointer-events-none" />
      <div className="hero-button-blur -bottom-24 -right-24 opacity-20 pointer-events-none" />

      {/* =====================================================================
       * ÜST BAR (SÜRE BASKISI YOK - BİREYSEL HIZ VE İLERLEME)
       * ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#160A18]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Sol: Başlık ve Soru Rozeti */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F14E13] to-amber-500 flex items-center justify-center shadow-lg shadow-[#F14E13]/30 shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#FF7A45] uppercase tracking-wider">
                  {subtitle}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-orange-500/20 text-amber-300 font-mono text-[10px] font-bold border border-orange-500/30">
                  Soru {currentIndex + 1} / {questions.length}
                </span>
              </div>
              <h1 className="font-poppins font-black text-sm sm:text-base text-white">
                {modeTitle}
              </h1>
            </div>
          </div>

          {/* Sağ: Doğru Sayısı, Ses ve Çıkış Butonları */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{correctCount} Doğru</span>
            </div>

            <button
              onClick={() => {
                soundEngine.toggleMute();
                soundEngine.playClick();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all text-xs"
              title={isSoundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onExit();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-zinc-300 hover:text-red-300 transition-all text-xs font-semibold flex items-center gap-1.5"
              title={exitLabel}
              aria-label={exitLabel}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{exitLabel}</span>
            </button>
          </div>
        </div>

        {/* İlerleme Çubuğu (Progress Bar) */}
        <div className="max-w-4xl mx-auto w-full mt-2.5 bg-[#0A040C] h-1.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-[#F14E13] to-amber-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* =====================================================================
       * ORTA ALAN: SORU VE ETKİLEŞİM
       * ===================================================================== */}
      <main className="max-w-4xl mx-auto w-full flex-1 px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 pb-28 sm:pb-32">
        {/* Soru Başlık Kartı: Konu & Rozetler */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1A0E1C] via-[#210D24] to-[#120713] border border-white/10 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-orange-600/20 border border-orange-500/40 text-[#FF7A45] font-black uppercase tracking-wider text-[11px]">
                {currentQ.subject}
              </span>
              <span className="text-zinc-300 font-semibold">{currentQ.topic}</span>
            </div>

            <span className="text-[11px] text-zinc-400 uppercase">
              {currentQ.difficulty} Seviye
            </span>
          </div>

          <h2 className="font-poppins font-bold text-base sm:text-lg text-white leading-relaxed mt-1">
            {currentQ.prompt}
          </h2>
        </div>

        {/* İnteraktif Soru Renderer (retryCount değiştikçe sıfırlanır) */}
        <div className="rounded-2xl bg-[#160A18] border border-white/10 p-3 sm:p-5 shadow-lg">
          <QuestionRenderer
            key={`${currentQ.id}_${retryCount}`}
            question={currentQ}
            onSubmit={handleAnswer}
            disabled={hasAnswered}
          />
        </div>

        {/* ===================================================================
         * EĞİTSEL GERİ BİLDİRİM & ÇÖZÜM KARTI (Cevaplandıktan Sonra Açılır)
         * =================================================================== */}
        {hasAnswered && lastResult && (
          <div
            ref={feedbackRef}
            className={`p-5 sm:p-6 rounded-3xl border-2 shadow-2xl flex flex-col gap-4 animate-fade-in ${
              lastResult.isCorrect
                ? 'bg-gradient-to-br from-emerald-950/40 via-[#1A0E1C] to-black border-emerald-500/60 shadow-emerald-950/40'
                : 'bg-gradient-to-br from-amber-950/40 via-[#1A0E1C] to-black border-amber-500/60 shadow-amber-950/40'
            }`}
          >
            {/* Durum Başlığı */}
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  lastResult.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {lastResult.isCorrect ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <Lightbulb className="w-7 h-7" />
                )}
              </div>

              <div>
                <h3 className="font-poppins font-black text-base sm:text-lg text-white">
                  {lastResult.isCorrect
                    ? '✅ Harika! Doğru Cevap — Kazanım Pekiştirildi'
                    : '💡 Öğrenme Fırsatı — Detaylı Çözümü İnceleyin'}
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {lastResult.isCorrect
                    ? 'Bu kazanımdaki temel prensibi başarıyla kavradınız.'
                    : 'Hata yapmak öğrenmenin en değerli parçasıdır. Çözümü inceleyip hemen tekrar deneyebilirsiniz.'}
                </p>
              </div>
            </div>

            {/* Detaylı Çözüm Analizi */}
            <div className="p-4 rounded-2xl bg-[#0F0510] border border-white/10 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              <span className="font-mono font-bold text-amber-300 text-xs uppercase block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Çözüm ve Mantık Analizi:</span>
              </span>
              <p>
                {currentQ.explanation ||
                  'Bu soruda verilen öncüller ve kurallar dikkatle incelendiğinde doğru yanıt adım adım ortaya çıkmaktadır. Temel kavram tanımlarını gözden geçirmeyi unutmayın.'}
              </p>
            </div>

            {/* Yanlış/Kısmi Doğru ise: İşler Yayın Grubu Kaynak İpucu */}
            {!lastResult.isCorrect && topRec && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 to-amber-500/10 border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-poppins font-bold text-orange-300 block">
                      📚 Önerilen İşler Kaynağı: {topRec.bookTitle} ({topRec.publisher})
                    </span>
                    <span className="text-zinc-300 block mt-0.5">
                      Bölüm: <strong>{topRec.recommendedSection}</strong> • {topRec.studyTip}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-300 font-mono text-[10px] font-bold border border-orange-500/30 shrink-0">
                  {topRec.examType}
                </span>
              </div>
            )}

            {/* Aksiyon Butonları (Yanlış yanıt durumunda hızlı tekrar deneme; sıradaki soruya geçiş alt barda mevcuttur) */}
            {!lastResult.isCorrect && (
              <div className="flex items-center justify-end gap-3 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-poppins font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-amber-300" />
                  <span>Şimdi Tekrar Dene</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =====================================================================
       * FIXED BOTTOM AKSİYON BARI (EKRANIN EN ALTINA SABİTLENMİŞ AKSİYON)
       * Kullanıcı soruya yanıt verdiği anda ekranın en altında sabit kalır.
       * ===================================================================== */}
      {hasAnswered && lastResult && (
        <aside aria-label="Soru Aksiyonu" className="fixed bottom-0 left-0 right-0 z-50 w-full bg-[#160A18]/95 backdrop-blur-md border-t-2 border-orange-500/50 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  lastResult.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {lastResult.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Lightbulb className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <span className="font-poppins font-black text-xs sm:text-sm text-white block truncate">
                  {lastResult.isCorrect ? '✅ Harika! Doğru Cevap' : '💡 Detaylı Çözüm Hazır'}
                </span>
                <span className="text-[11px] text-[#B5CBC8] hidden sm:block truncate">
                  {lastResult.isCorrect
                    ? 'Tebrikler! Sıradaki soruya tek tıkla geçebilirsiniz.'
                    : 'İster çözümü inceleyin, ister hemen tekrar deneyin veya sıradaki soruya geçin.'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!lastResult.isCorrect && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-poppins font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tekrar Dene</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 hover:brightness-110 active:scale-95 text-white font-poppins font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xl shadow-[#F14E13]/40 border border-white/20 animate-pulse"
              >
                <span>
                  {currentIndex + 1 >= questions.length
                    ? 'Antrenmanı Tamamla'
                    : 'Sıradaki Soruya Geç'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-zinc-500 py-3 pb-24 sm:pb-28">
        İşler Teknoloji • Bireysel Eksik Konu Telafi Modülü
      </footer>
    </div>
  );
};

export default RevisionPracticeScreen;
