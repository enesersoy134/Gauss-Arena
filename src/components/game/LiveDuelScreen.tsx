import React, { useState, useEffect, useRef } from 'react';
import {
  DuelPublicState,
  DuelRoundResultEvent,
  DuelSummary,
} from '../../services/backendSocket';
import { PlayerInfo, Question, RoundResult } from '../../types/game';
import { AnswerResult } from '../questions/questionProps';
import QuestionRenderer from '../questions/QuestionRenderer';
import { MatchHeader } from './MatchHeader';
import { QuestionStage } from './QuestionStage';
import { IntermissionScreen } from './IntermissionScreen';
import { MatchEndScreen } from './MatchEndScreen';
import { ShieldAlert, Coins, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { CriticalVignette } from '../effects/CriticalVignette';

export interface LiveDuelScreenProps {
  currentPlayerId: string;
  activeDuel: DuelPublicState | null;
  roundResultEvent: DuelRoundResultEvent | null;
  duelSummary: DuelSummary | null;
  onSubmitAnswer: (matchId: string, questionIndex: number, answerResult: any, selectedOptionIndex?: number) => void;
  onReadyForNextRound: (matchId: string) => void;
  onExit: () => void;
}

export const LiveDuelScreen: React.FC<LiveDuelScreenProps> = ({
  currentPlayerId,
  activeDuel,
  roundResultEvent,
  duelSummary,
  onSubmitAnswer,
  onReadyForNextRound,
  onExit,
}) => {
  const cleanPlayerName = (name: string) => (name ? name.split('(')[0].trim() : '');

  // Ses Durumu ve Senkronizasyonu
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundEngine.getMuted());
  useEffect(() => {
    return soundEngine.subscribe(() => {
      setIsSoundMuted(soundEngine.getMuted());
    });
  }, []);

  // VS Karşılaşma Başlangıç (Intro) Animasyonu State'i
  // activeDuel.currentQuestionIndex === 0 iken ilk 1.6 saniye boyunca gösterilir
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return Boolean(activeDuel && activeDuel.currentQuestionIndex === 0);
  });
  const currentMatchIdRef = useRef<string | null>(activeDuel?.matchId || null);

  // Müzik Yönetimi (Düello başlayınca battle, çıkışta lobby)
  useEffect(() => {
    if (activeDuel && !duelSummary) {
      soundEngine.startMusic('battle');
    }
    return () => {
      soundEngine.startMusic('lobby');
    };
  }, [activeDuel?.matchId, Boolean(duelSummary)]);

  useEffect(() => {
    if (activeDuel && activeDuel.matchId !== currentMatchIdRef.current) {
      currentMatchIdRef.current = activeDuel.matchId;
      if (activeDuel.currentQuestionIndex === 0) {
        setShowIntro(true);
      }
    }
  }, [activeDuel?.matchId, activeDuel?.currentQuestionIndex]);

  useEffect(() => {
    if (showIntro) {
      soundEngine.playMatchFound();
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Maç Sonu Zafer Fanfarı
  useEffect(() => {
    if (duelSummary) {
      soundEngine.stopMusic();
      soundEngine.playVictory();
    }
  }, [Boolean(duelSummary)]);

  // Zamanlayıcı hesabı (React Hook Kuralı: Tüm erken return'lerin üzerinde olmalıdır)
  const durationSec = Math.max(1, Math.round((activeDuel?.durationMs || 20000) / 1000));
  const [timeLeftSec, setTimeLeftSec] = useState<number>(() =>
    Math.max(0, Math.round((activeDuel?.remainingMs || 20000) / 1000))
  );

  useEffect(() => {
    if (!activeDuel || !activeDuel.currentQuestion || duelSummary) return;

    const calcRemaining = () => {
      const elapsed = Date.now() - (activeDuel.questionStartedAt || Date.now());
      const leftMs = Math.max(0, (activeDuel.durationMs || 20000) - elapsed);
      return Math.ceil(leftMs / 1000);
    };

    let lastSec = calcRemaining();
    setTimeLeftSec(lastSec);

    const interval = setInterval(() => {
      const left = calcRemaining();
      setTimeLeftSec(left);
      soundEngine.setRemainingTime(left, durationSec);
      if (left !== lastSec) {
        lastSec = left;
        if (left <= 5 && left > 0) {
          soundEngine.playTick(true);
        }
      }
      if (left <= 0) {
        clearInterval(interval);
        soundEngine.resetTension();
      }
    }, 250);

    return () => {
      clearInterval(interval);
      soundEngine.resetTension();
    };
  }, [
    activeDuel?.questionStartedAt,
    activeDuel?.durationMs,
    activeDuel?.currentQuestionIndex,
    Boolean(duelSummary),
    durationSec,
  ]);

  // 1. MAÇ SONU EKRANI (duelSummary mevcutsa)
  if (duelSummary) {
    const isPlayerA = duelSummary.playerA?.id === currentPlayerId;
    const summaryMe = (isPlayerA ? duelSummary.playerA : duelSummary.playerB) || duelSummary.playerA;
    const summaryOpp = (isPlayerA ? duelSummary.playerB : duelSummary.playerA) || duelSummary.playerB;

    const player1Info: PlayerInfo = {
      id: summaryMe?.id || currentPlayerId,
      name: cleanPlayerName(summaryMe?.name || 'Sen'),
      elo: Math.round(summaryMe?.elo || 1200),
      streak: summaryMe?.streak || 0,
      avatarUrl: summaryMe?.avatarUrl,
    };

    const player2Info: PlayerInfo = {
      id: summaryOpp?.id || 'opponent',
      name: cleanPlayerName(summaryOpp?.name || 'Rakip'),
      elo: Math.round(summaryOpp?.elo || 1200),
      streak: summaryOpp?.streak || 0,
      avatarUrl: summaryOpp?.avatarUrl,
    };

    // Raunt geçmişini dönüştür
    const mappedRoundHistory = (duelSummary.roundHistory || []).map((rh) => {
      const ansMe = (isPlayerA ? rh.answerA : rh.answerB) || { isCorrect: false, score: 0, remainingMs: 0 };
      const ansOpp = (isPlayerA ? rh.answerB : rh.answerA) || { isCorrect: false, score: 0, remainingMs: 0 };
      const qDurationMs = (rh as any)?.durationMs || (rh.interactiveQuestion && rh.interactiveQuestion.timeLimitSeconds ? rh.interactiveQuestion.timeLimitSeconds * 1000 : 20000);
      const qTimeLimitSec = (rh as any)?.timeLimitSeconds || (rh.interactiveQuestion && rh.interactiveQuestion.timeLimitSeconds ? rh.interactiveQuestion.timeLimitSeconds : Math.round(qDurationMs / 1000));
      const qItem: Question = rh.interactiveQuestion || {
        id: rh.externalId || '',
        subject: (rh.subject as any) || 'matematik',
        topic: rh.subTopic || rh.subject || 'matematik',
        type: 'universal_choice',
        difficulty: 'orta',
        timeLimitSeconds: qTimeLimitSec,
        points: 100,
        prompt: rh.text || rh.externalId || '',
        explanation: rh.explanation || undefined,
        payload: {
          variant: 'test',
          optionCount: 4,
          options: [],
          correctIndex: rh.correctOptionIndex,
        },
      };

      const res: RoundResult = {
        questionId: rh.externalId || '',
        player1Correct: ansMe?.isCorrect ?? false,
        player1Points: ansMe?.score ?? 0,
        player1TimeMs: Math.max(0, qDurationMs - (ansMe?.remainingMs || 0)),
        player2Correct: ansOpp?.isCorrect ?? false,
        player2Points: ansOpp?.score ?? 0,
        player2TimeMs: Math.max(0, qDurationMs - (ansOpp?.remainingMs || 0)),
      };

      return { question: qItem, result: res };
    });

    const myCoinsAwarded = (isPlayerA ? duelSummary.coinsAwardedA : duelSummary.coinsAwardedB) ?? 0;
    const eloDelta = Math.round(summaryMe?.deltaElo ?? ((summaryMe?.newElo ?? 1200) - (summaryMe?.elo ?? 1200)));

    const handleExitWithSound = () => {
      soundEngine.playClick();
      soundEngine.startMusic('lobby');
      onExit();
    };

    return (
      <div className="min-h-screen bg-[#150A16] text-white flex flex-col justify-center py-6 px-4">
        {/* Anti-Farming & Coin Bilgi Bannerı */}
        <div className="max-w-2xl mx-auto w-full mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {duelSummary.eloUpdate?.antiFarmDamped && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Anti-Farming Koruması Devrede (ELO değişimi sınırlandı)</span>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {myCoinsAwarded > 0 && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold font-mono">
                <Coins className="w-4 h-4 text-orange-400" />
                <span>+{myCoinsAwarded} Coin Kazandın!</span>
              </div>
            )}
            <button
              onClick={() => {
                soundEngine.toggleMute();
                soundEngine.playClick();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
              title={isSoundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        <MatchEndScreen
          player1={player1Info}
          player2={player2Info}
          player1TotalScore={summaryMe.totalScore}
          player2TotalScore={summaryOpp.totalScore}
          roundResults={mappedRoundHistory}
          eloWinDelta={eloDelta >= 0 ? eloDelta : 25}
          eloLossDelta={eloDelta < 0 ? eloDelta : -20}
          onRestart={handleExitWithSound}
        />
      </div>
    );
  }

  // Eğer aktif düello yoksa boş dön veya yükleniyor göster
  if (!activeDuel || !activeDuel.currentQuestion) {
    return (
      <div className="min-h-screen bg-[#150A16] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-t-[#F14E13] border-white/10 animate-spin mb-4" />
        <p className="text-sm font-mono text-[#B5CBC8]">Düello oturumu yükleniyor...</p>
      </div>
    );
  }

  // 2. AKTİF OYUNCU VE RAKİP BİLGİLERİ
  const isPlayerA = activeDuel.playerA.id === currentPlayerId;
  const myPlayer = isPlayerA ? activeDuel.playerA : activeDuel.playerB;
  const opponentPlayer = isPlayerA ? activeDuel.playerB : activeDuel.playerA;

  const player1Info: PlayerInfo = {
    id: myPlayer.id,
    name: cleanPlayerName(myPlayer.name),
    elo: myPlayer.elo,
    streak: myPlayer.streak,
    avatarUrl: myPlayer.avatarUrl,
  };

  const player2Info: PlayerInfo = {
    id: opponentPlayer.id,
    name: cleanPlayerName(opponentPlayer.name),
    elo: opponentPlayer.elo,
    streak: opponentPlayer.streak,
    avatarUrl: opponentPlayer.avatarUrl,
  };

  // Soru nesnesini hazırla (interactiveQuestion varsa doğrudan kullan)
  const currentQ = activeDuel.currentQuestion;
  const interactiveQ: Question = currentQ.interactiveQuestion || {
    id: currentQ.externalId,
    subject: (currentQ.subject as any) || 'matematik',
    topic: currentQ.subTopic || currentQ.subject,
    type: 'universal_choice',
    difficulty: (currentQ.difficulty?.toLowerCase() === 'easy' ? 'kolay' : currentQ.difficulty?.toLowerCase() === 'hard' ? 'zor' : 'orta') as any,
    timeLimitSeconds: durationSec,
    points: 100,
    prompt: currentQ.text,
    explanation: currentQ.explanation || undefined,
    payload: {
      variant: 'test',
      optionCount: currentQ.options.length,
      options: currentQ.options,
      correctIndex: 0,
      shuffleOptions: false,
    },
  };

  // Cevap verme işleyicisi
  const handleAnswerSubmit = (result: AnswerResult) => {
    soundEngine.resetTension();
    soundEngine.playLock();
    if (result.isCorrect) {
      soundEngine.playCorrect();
      if ((myPlayer?.streak || 0) >= 1) {
        soundEngine.playCombo((myPlayer?.streak || 0) + 1);
      }
    } else if ((result.accuracy || 0) > 0 && !result.isCorrect) {
      soundEngine.playPartial();
    } else if (!result.isCorrect && !(result as any).skipped) {
      soundEngine.playWrong();
    }

    let optIndex = -1;
    if (interactiveQ.type === 'universal_choice') {
      const payload: any = interactiveQ.payload;
      if (typeof result.numericAnswer === 'number') {
        optIndex = result.numericAnswer;
      } else if (result.isCorrect && typeof payload?.correctIndex === 'number') {
        optIndex = payload.correctIndex;
      }
    }

    onSubmitAnswer(activeDuel.matchId, activeDuel.currentQuestionIndex, result, optIndex);
  };

  // 3. INTERMISSION (Soru Sonu / 5 Saniyelik Mola Ekranı)
  if (roundResultEvent) {
    const ansMe = isPlayerA ? roundResultEvent.roundResult.answerA : roundResultEvent.roundResult.answerB;
    const ansOpp = isPlayerA ? roundResultEvent.roundResult.answerB : roundResultEvent.roundResult.answerA;

    const mappedRoundResult: RoundResult = {
      questionId: roundResultEvent.roundResult.externalId,
      player1Correct: ansMe.isCorrect,
      player1Points: ansMe.score,
      player1TimeMs: Math.max(0, activeDuel.durationMs - (ansMe.remainingMs || 0)),
      player2Correct: ansOpp.isCorrect,
      player2Points: ansOpp.score,
      player2TimeMs: Math.max(0, activeDuel.durationMs - (ansOpp.remainingMs || 0)),
    };

    const isLastQ = activeDuel.currentQuestionIndex + 1 >= activeDuel.totalQuestions;

    return (
      <div className="min-h-screen bg-[#150A16] text-white flex flex-col justify-center py-6">
        <IntermissionScreen
          countdownSec={5}
          roundResult={mappedRoundResult}
          question={interactiveQ}
          player1={player1Info}
          player2={player2Info}
          player1TotalScore={myPlayer.totalScore}
          player2TotalScore={opponentPlayer.totalScore}
          isLastQuestion={isLastQ}
          onDone={() => onReadyForNextRound(activeDuel.matchId)}
        />
      </div>
    );
  }

  // 4. CANLI SORU EKRANI
  return (
    <div className="min-h-screen bg-[#150A16] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Arka plan parlama efektleri (Orange Glow) */}
      <div className="hero-button-blur -top-24 -left-24 opacity-25 pointer-events-none" />
      <div className="hero-button-blur -bottom-24 -right-24 opacity-20 pointer-events-none" />

      {/* Son 5 Saniye Kritik Vignette Kırmızı Nabız Işığı */}
      <CriticalVignette active={timeLeftSec <= 5 && timeLeftSec > 0 && !myPlayer.hasAnsweredCurrent} timeLeft={timeLeftSec} />

      {/* Ses Aç / Kapat Düğmesi */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40">
        <button
          onClick={() => {
            soundEngine.toggleMute();
            soundEngine.playClick();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all flex items-center gap-1.5 backdrop-blur-md shadow-lg text-xs font-mono"
          title={isSoundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
        >
          {isSoundMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline text-[11px] text-red-300">Sessiz</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-[11px] text-emerald-300">Ses Açık</span>
            </>
          )}
        </button>
      </div>

      {/* VS KARŞILAŞMA BAŞLANGIÇ (INTRO) ANİMASYONU KATMANI */}
      {showIntro && (
        <div className="fixed inset-0 z-50 bg-[#0C040E]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-amber-300 font-poppins font-black text-xs sm:text-sm tracking-widest uppercase mb-6 animate-pulse">
            ⚡ 1V1 CANLI DÜELLO BAŞLIYOR ⚡
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-14 max-w-2xl w-full">
            {/* Oyuncu 1 (Sen) */}
            <div className="flex flex-col items-center text-center transform -translate-x-2">
              <div className="relative mb-3">
                <img
                  src={player1Info.avatarUrl}
                  alt={player1Info.name}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border-4 border-[#F14E13] bg-[#1A0E1C] object-cover shadow-2xl shadow-[#F14E13]/50"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#F14E13] text-white font-black text-[10px] sm:text-xs tracking-wider uppercase">
                  SEN
                </span>
              </div>
              <span className="font-poppins font-black text-base sm:text-xl text-white max-w-[120px] sm:max-w-[160px] truncate">
                {player1Info.name}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#F14E13] mt-0.5">
                {player1Info.elo} ELO
              </span>
            </div>

            {/* Ortada Dev ⚡ VS ⚡ */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#F14E13] via-amber-500 to-[#3B82F6] p-1 flex items-center justify-center shadow-2xl shadow-orange-500/60 animate-bounce">
                <div className="w-full h-full rounded-full bg-[#1A0E1C] flex items-center justify-center">
                  <span className="font-poppins font-black text-xl sm:text-3xl text-amber-400">
                    VS
                  </span>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 tracking-widest mt-2 animate-pulse">
                BAŞLIYOR
              </span>
            </div>

            {/* Oyuncu 2 (Rakip) */}
            <div className="flex flex-col items-center text-center transform translate-x-2">
              <div className="relative mb-3">
                <img
                  src={player2Info.avatarUrl}
                  alt={player2Info.name}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border-4 border-[#3B82F6] bg-[#1A0E1C] object-cover shadow-2xl shadow-[#3B82F6]/50"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#3B82F6] text-white font-black text-[10px] sm:text-xs tracking-wider uppercase">
                  RAKİP
                </span>
              </div>
              <span className="font-poppins font-black text-base sm:text-xl text-white max-w-[120px] sm:max-w-[160px] truncate">
                {player2Info.name}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#3B82F6] mt-0.5">
                {player2Info.elo} ELO
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MatchHeader (Halat çekme barı ve uçan puan rozeti) */}
      <MatchHeader
        player1={player1Info}
        player2={player2Info}
        currentQuestionIndex={activeDuel.currentQuestionIndex}
        totalQuestions={activeDuel.totalQuestions}
        timeLeft={timeLeftSec}
        timeLimit={durationSec}
        player1Score={myPlayer.totalScore}
        player2Score={opponentPlayer.totalScore}
      />

      {/* RAKİP CEVAPLADIĞINDA "⚡ BASKI / GERİLİM" UYARI ETKİSİ */}
      {opponentPlayer.hasAnsweredCurrent && !myPlayer.hasAnsweredCurrent && (
        <div className="w-full max-w-4xl mx-auto px-4 pt-2 z-10 animate-fade-in">
          <div className="py-2 px-4 rounded-2xl bg-gradient-to-r from-red-600/30 via-orange-600/30 to-amber-600/30 border-2 border-orange-500/70 text-white flex items-center justify-center gap-2.5 shadow-xl shadow-orange-500/20 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping shrink-0" />
            <span className="font-poppins font-black text-xs sm:text-sm text-amber-200 tracking-wide text-center">
              ⚡ Rakip Cevabını Kilitledi! Süre bitmeden hamleni yap!
            </span>
          </div>
        </div>
      )}

      {/* Soru Aşaması (QuestionStage) */}
      <main className="flex-1 flex flex-col justify-center py-2 sm:py-4 px-2 sm:px-4">
        <QuestionStage
          question={interactiveQ}
          opponentAnswered={opponentPlayer.hasAnsweredCurrent}
        >
          <QuestionRenderer
            question={interactiveQ}
            onSubmit={handleAnswerSubmit}
            disabled={myPlayer.hasAnsweredCurrent}
          />

          {/* Henüz cevap verilmediyse: Soruyu Geç (Boş Bırak) butonu */}
          {!myPlayer.hasAnsweredCurrent && (
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] sm:text-[11px] text-[#B5CBC8] font-mono">
                Emin değilseniz soruyu boş bırakabilirsiniz.
              </span>
              <button
                onClick={() => {
                  onSubmitAnswer(
                    activeDuel.matchId,
                    activeDuel.currentQuestionIndex,
                    { isCorrect: false, accuracy: 0, skipped: true },
                    -1
                  );
                }}
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-semibold text-[#B5CBC8] hover:text-white bg-[#0F0510] border border-white/10 hover:border-amber-500/50 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>⏭️ Soruyu Geç (Boş Bırak)</span>
              </button>
            </div>
          )}

          {/* Cevap verildi / geçildi ama rakip henüz tamamlamadıysa: Bekleme Kartı */}
          {myPlayer.hasAnsweredCurrent && !opponentPlayer.hasAnsweredCurrent && (
            <div className="mt-3 sm:mt-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/40 flex items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-amber-200 animate-pulse shadow-lg shadow-amber-500/5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="font-semibold text-center">
                ⏳ Hamlen kaydedildi! Rakibin ({cleanPlayerName(opponentPlayer.name)}) soruyu tamamlaması veya geçmesi bekleniyor...
              </span>
            </div>
          )}
        </QuestionStage>
      </main>
    </div>
  );
};

export default LiveDuelScreen;
