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
import { ShieldAlert, Coins } from 'lucide-react';

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
  // 1. MAÇ SONU EKRANI (duelSummary mevcutsa)
  if (duelSummary) {
    const isPlayerA = duelSummary.playerA.id === currentPlayerId;
    const summaryMe = isPlayerA ? duelSummary.playerA : duelSummary.playerB;
    const summaryOpp = isPlayerA ? duelSummary.playerB : duelSummary.playerA;

    const player1Info: PlayerInfo = {
      id: summaryMe.id,
      name: summaryMe.name,
      elo: summaryMe.elo,
      streak: summaryMe.streak,
      avatarUrl: summaryMe.avatarUrl,
    };

    const player2Info: PlayerInfo = {
      id: summaryOpp.id,
      name: summaryOpp.name,
      elo: summaryOpp.elo,
      streak: summaryOpp.streak,
      avatarUrl: summaryOpp.avatarUrl,
    };

    // Raunt geçmişini dönüştür
    const mappedRoundHistory = (duelSummary.roundHistory || []).map((rh) => {
      const ansMe = isPlayerA ? rh.answerA : rh.answerB;
      const ansOpp = isPlayerA ? rh.answerB : rh.answerA;
      const qItem: Question = rh.interactiveQuestion || {
        id: rh.externalId,
        subject: (rh.subject as any) || 'matematik',
        topic: rh.subject,
        type: 'universal_choice',
        difficulty: 'orta',
        timeLimitSeconds: 60,
        points: 100,
        prompt: rh.externalId,
        explanation: rh.explanation || undefined,
        payload: {
          variant: 'test',
          optionCount: 4,
          options: [],
          correctIndex: rh.correctOptionIndex,
        },
      };

      const res: RoundResult = {
        questionId: rh.externalId,
        player1Correct: ansMe.isCorrect,
        player1Points: ansMe.score,
        player1TimeMs: Math.max(0, 60000 - (ansMe.remainingMs || 0)),
        player2Correct: ansOpp.isCorrect,
        player2Points: ansOpp.score,
        player2TimeMs: Math.max(0, 60000 - (ansOpp.remainingMs || 0)),
      };

      return { question: qItem, result: res };
    });

    const myCoinsAwarded = isPlayerA ? duelSummary.coinsAwardedA : duelSummary.coinsAwardedB;
    const eloDelta = summaryMe.deltaElo || (summaryMe.newElo - summaryMe.elo);

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

          {myCoinsAwarded > 0 && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold font-mono ml-auto">
              <Coins className="w-4 h-4 text-orange-400" />
              <span>+{myCoinsAwarded} Coin Kazandın!</span>
            </div>
          )}
        </div>

        <MatchEndScreen
          player1={player1Info}
          player2={player2Info}
          player1TotalScore={summaryMe.totalScore}
          player2TotalScore={summaryOpp.totalScore}
          roundResults={mappedRoundHistory}
          eloWinDelta={eloDelta >= 0 ? eloDelta : 25}
          eloLossDelta={eloDelta < 0 ? eloDelta : -20}
          onRestart={onExit}
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
    name: myPlayer.name,
    elo: myPlayer.elo,
    streak: myPlayer.streak,
    avatarUrl: myPlayer.avatarUrl,
  };

  const player2Info: PlayerInfo = {
    id: opponentPlayer.id,
    name: opponentPlayer.name,
    elo: opponentPlayer.elo,
    streak: opponentPlayer.streak,
    avatarUrl: opponentPlayer.avatarUrl,
  };

  // Zamanlayıcı hesabı
  const durationSec = Math.max(1, Math.round(activeDuel.durationMs / 1000));
  const [timeLeftSec, setTimeLeftSec] = useState<number>(() =>
    Math.max(0, Math.round(activeDuel.remainingMs / 1000))
  );

  useEffect(() => {
    const calcRemaining = () => {
      const elapsed = Date.now() - activeDuel.questionStartedAt;
      const leftMs = Math.max(0, activeDuel.durationMs - elapsed);
      return Math.ceil(leftMs / 1000);
    };

    setTimeLeftSec(calcRemaining());

    const interval = setInterval(() => {
      const left = calcRemaining();
      setTimeLeftSec(left);
      if (left <= 0) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeDuel.questionStartedAt, activeDuel.durationMs, activeDuel.currentQuestionIndex]);

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

      {/* MatchHeader (Coin ve soru puanı içermez!) */}
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

      {/* Soru Aşaması (QuestionStage - Soru puanı ve tipi adı göstermez) */}
      <main className="flex-1 flex flex-col justify-center py-4">
        <QuestionStage
          question={interactiveQ}
          opponentAnswered={opponentPlayer.hasAnsweredCurrent}
        >
          <QuestionRenderer
            question={interactiveQ}
            onSubmit={handleAnswerSubmit}
            disabled={myPlayer.hasAnsweredCurrent}
          />
        </QuestionStage>
      </main>
    </div>
  );
};

export default LiveDuelScreen;
