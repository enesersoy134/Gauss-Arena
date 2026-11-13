import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BACKEND_GAME_DATA } from '../../data/backendMockData';
import { Question, RoundResult, NumpadClosestPayload } from '../../types/game';
import { AnswerResult } from '../questions/questionProps';
import { calculateQuestionScore, evaluateNumpadWinner } from '../../utils/scoring';
import { simulateOpponentAnswer, OpponentSimulationResult } from '../../utils/opponentSimulator';

import QuestionRenderer from '../questions/QuestionRenderer';
import { MatchHeader } from './MatchHeader';
import { QuestionStage } from './QuestionStage';
import { IntermissionScreen } from './IntermissionScreen';
import { MatchEndScreen } from './MatchEndScreen';

export type GameState = 'playing' | 'intermission' | 'matchEnd';

export interface GameScreenProps {
  /** Opsiyonel olarak belirli soruları zorunlu koşmak için (örn. Soru Test Menüsü) */
  forcedQuestions?: Question[];
  /** Aktif oyuncu kimliği (yanlış yapılan soruları revize konularına kaydetmek için) */
  playerId?: string;
  /** Maç bittiğinde veya lobiye dönmek istendiğinde */
  onExit?: () => void;
}

/**
 * Havuzdan aynı tip soruların arka arkaya gelmesini engelleyerek soru seçer
 */
function pickMatchQuestions(pool: Question[], count: number): Question[] {
  if (pool.length <= count) {
    return [...pool].sort(() => Math.random() - 0.5);
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected: Question[] = [];

  for (let i = 0; i < shuffled.length && selected.length < count; i++) {
    const candidate = shuffled[i];
    if (selected.length === 0) {
      selected.push(candidate);
      continue;
    }

    const lastType = selected[selected.length - 1].type;
    // Eğer aynı tip arka arkaya gelecekse ve alternatif varsa sonraki elemanlara bak
    if (candidate.type === lastType) {
      const alternativeIndex = shuffled.findIndex(
        (q, idx) => idx > i && q.type !== lastType && !selected.includes(q)
      );
      if (alternativeIndex !== -1) {
        selected.push(shuffled[alternativeIndex]);
        // Elemanı başa alarak sırayı koru
        shuffled.splice(alternativeIndex, 1);
        shuffled.splice(i + 1, 0, candidate);
        continue;
      }
    }

    selected.push(candidate);
  }

  return selected;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  forcedQuestions,
  playerId,
  onExit
}) => {
  const { players, matchSettings, questionPool } = BACKEND_GAME_DATA;

  // 1. Karşılaşma Soruları
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (forcedQuestions && forcedQuestions.length > 0) {
      return forcedQuestions;
    }
    return pickMatchQuestions(questionPool, matchSettings.questionsPerMatch);
  });

  // 2. Durum Makinesi
  const [gameState, setGameState] = useState<GameState>('playing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // 3. Skorlar ve Raunt Geçmişi
  const [p1TotalScore, setP1TotalScore] = useState<number>(0);
  const [p2TotalScore, setP2TotalScore] = useState<number>(0);
  const [p1Streak, setP1Streak] = useState<number>(players.currentPlayer.streak);
  const [p2Streak, setP2Streak] = useState<number>(players.opponentPlayer.streak);

  const [roundResultsHistory, setRoundResultsHistory] = useState<
    Array<{ question: Question; result: RoundResult }>
  >([]);
  const [lastRoundResult, setLastRoundResult] = useState<RoundResult | null>(null);

  // 4. Aktif Soru Durumu
  const currentQuestion = questions[currentQuestionIndex];
  const [timeLeft, setTimeLeft] = useState<number>(currentQuestion?.timeLimitSeconds ?? 20);
  const [p1Answered, setP1Answered] = useState<boolean>(false);
  const [opponentAnswered, setOpponentAnswered] = useState<boolean>(false);

  // Yanıt ve zamanlama referansları
  const questionStartTimeRef = useRef<number>(Date.now());
  const p1AnswerResultRef = useRef<{ result: AnswerResult; timeMs: number } | null>(null);
  const p2AnswerResultRef = useRef<OpponentSimulationResult | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opponentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // --------------------------------------------------------------------------
  // Raunt Tamamlama ve Puanlama Fonksiyonu
  // --------------------------------------------------------------------------
  const finishCurrentRound = useCallback(() => {
    if (isTransitioningRef.current || !currentQuestion) return;
    isTransitioningRef.current = true;

    const p1Data = p1AnswerResultRef.current ?? {
      result: { isCorrect: false, accuracy: 0 },
      timeMs: currentQuestion.timeLimitSeconds * 1000
    };

    const p2Data = p2AnswerResultRef.current ?? {
      isCorrect: false,
      accuracy: 0,
      timeMs: currentQuestion.timeLimitSeconds * 1000
    };

    let p1Points = 0;
    let p2Points = 0;

    if (currentQuestion.type === 'numpad_closest') {
      const payload = currentQuestion.payload as NumpadClosestPayload;
      const evalResult = evaluateNumpadWinner(
        payload.correctAnswer,
        {
          playerId: players.currentPlayer.id,
          answer: p1Data.result.numericAnswer ?? 0,
          timeMs: p1Data.timeMs
        },
        {
          playerId: players.opponentPlayer.id,
          answer: p2Data.numericAnswer ?? 0,
          timeMs: p2Data.timeMs
        }
      );

      const p1Calc = calculateQuestionScore({
        basePoints: currentQuestion.points,
        timeLimitSeconds: currentQuestion.timeLimitSeconds,
        elapsedTimeMs: p1Data.timeMs,
        isCorrect: true,
        streak: p1Streak
      });

      const p2Calc = calculateQuestionScore({
        basePoints: currentQuestion.points,
        timeLimitSeconds: currentQuestion.timeLimitSeconds,
        elapsedTimeMs: p2Data.timeMs,
        isCorrect: true,
        streak: p2Streak
      });

      if (evalResult.winnerPlayerId === players.currentPlayer.id) {
        p1Points = p1Calc.points;
        p2Points = Math.round(p2Calc.points * 0.4);
      } else if (evalResult.winnerPlayerId === players.opponentPlayer.id) {
        p1Points = Math.round(p1Calc.points * 0.4);
        p2Points = p2Calc.points;
      } else {
        // Beraberlik
        p1Points = Math.round(p1Calc.points * 0.8);
        p2Points = Math.round(p2Calc.points * 0.8);
      }
    } else {
      // Standart puanlama
      const p1Calc = calculateQuestionScore({
        basePoints: currentQuestion.points,
        timeLimitSeconds: currentQuestion.timeLimitSeconds,
        elapsedTimeMs: p1Data.timeMs,
        isCorrect: p1Data.result.isCorrect,
        streak: p1Streak
      });

      const p1Acc = p1Data.result.accuracy ?? (p1Data.result.isCorrect ? 1 : 0);
      p1Points = Math.round(p1Calc.points * p1Acc);

      const p2Calc = calculateQuestionScore({
        basePoints: currentQuestion.points,
        timeLimitSeconds: currentQuestion.timeLimitSeconds,
        elapsedTimeMs: p2Data.timeMs,
        isCorrect: p2Data.isCorrect,
        streak: p2Streak
      });

      const p2Acc = p2Data.accuracy ?? (p2Data.isCorrect ? 1 : 0);
      p2Points = Math.round(p2Calc.points * p2Acc);
    }

    // Streak güncelleme
    setP1Streak(prev => (p1Data.result.isCorrect ? prev + 1 : 0));
    setP2Streak(prev => (p2Data.isCorrect ? prev + 1 : 0));

    // Toplam skorları artır
    setP1TotalScore(prev => prev + p1Points);
    setP2TotalScore(prev => prev + p2Points);

    const roundRes: RoundResult = {
      questionId: currentQuestion.id,
      player1Correct: p1Data.result.isCorrect,
      player1Points: p1Points,
      player1TimeMs: p1Data.timeMs,
      player2Correct: p2Data.isCorrect,
      player2Points: p2Points,
      player2TimeMs: p2Data.timeMs
    };

    setLastRoundResult(roundRes);
    setRoundResultsHistory(prev => [...prev, { question: currentQuestion, result: roundRes }]);

    // 800ms sonra intermission ekranına geçiş yap
    transitionTimeoutRef.current = setTimeout(() => {
      setGameState('intermission');
    }, 800);
  }, [
    currentQuestion,
    players.currentPlayer.id,
    players.opponentPlayer.id,
    p1Streak,
    p2Streak
  ]);

  // --------------------------------------------------------------------------
  // Yeni Soru Başlatma Döngüsü
  // --------------------------------------------------------------------------
  const startQuestion = useCallback((q: Question) => {
    isTransitioningRef.current = false;
    p1AnswerResultRef.current = null;
    setP1Answered(false);
    setOpponentAnswered(false);
    setTimeLeft(q.timeLimitSeconds);
    questionStartTimeRef.current = Date.now();

    // Rakip cevabını simüle et
    const sim = simulateOpponentAnswer(q);
    p2AnswerResultRef.current = sim;

    // Rakibin simüle edilmiş süresinde tetikle
    if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
    opponentTimeoutRef.current = setTimeout(() => {
      setOpponentAnswered(true);

      // Eğer P1 zaten cevap vermişse ve rakip de şimdi verdiyse raundu bitir
      if (p1AnswerResultRef.current && !isTransitioningRef.current) {
        finishCurrentRound();
      }
    }, sim.timeMs);
  }, [finishCurrentRound]);

  // Soru değiştiğinde veya oyun başladığında
  useEffect(() => {
    if (gameState === 'playing' && currentQuestion) {
      startQuestion(currentQuestion);
    }

    return () => {
      if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [gameState, currentQuestion, startQuestion]);

  // --------------------------------------------------------------------------
  // Soru Süresi Geri Sayım Döngüsü (100ms hassasiyetle)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (gameState !== 'playing' || !currentQuestion) return;

    const timer = setInterval(() => {
      const elapsed = (Date.now() - questionStartTimeRef.current) / 1000;
      const remaining = Math.max(0, currentQuestion.timeLimitSeconds - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        // Süre bitti: P1 cevap vermediyse otomatik yanlış say
        if (!p1AnswerResultRef.current) {
          p1AnswerResultRef.current = {
            result: { isCorrect: false, accuracy: 0 },
            timeMs: currentQuestion.timeLimitSeconds * 1000
          };
          setP1Answered(true);
        }
        finishCurrentRound();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, currentQuestion, finishCurrentRound]);

  // --------------------------------------------------------------------------
  // P1 Cevap Gönderim Olayı
  // --------------------------------------------------------------------------
  const handleP1Submit = (result: AnswerResult) => {
    if (p1Answered || isTransitioningRef.current || gameState !== 'playing') return;

    const elapsedMs = Math.max(500, Date.now() - questionStartTimeRef.current);
    p1AnswerResultRef.current = { result, timeMs: elapsedMs };
    setP1Answered(true);

    // Eğer rakip zaten cevap vermişse veya rakip bekleniyorsa:
    // Kullanıcı deneyimi için oyuncu cevap verdikten hemen sonra (veya rakip de verdiyse) raundu bitir
    if (opponentAnswered) {
      finishCurrentRound();
    } else {
      // Oyuncu cevapladı ama rakip henüz vermediyse en fazla 1 saniye bekle veya rakibi tamamla
      if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
      opponentTimeoutRef.current = setTimeout(() => {
        setOpponentAnswered(true);
        finishCurrentRound();
      }, 700);
    }
  };

  // --------------------------------------------------------------------------
  // Intermission Ekranı Tamamlandığında
  // --------------------------------------------------------------------------
  const handleIntermissionDone = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setGameState('playing');
    } else {
      if (playerId) {
        const mappedHistory = roundResultsHistory.map(({ question, result }, idx) => ({
          questionIndex: idx,
          externalId: question.id,
          subject: question.subject,
          subTopic: question.topic,
          difficulty: question.difficulty.toUpperCase(),
          text: question.prompt,
          explanation: question.explanation || null,
          interactiveQuestion: question,
          answerA: { isCorrect: result.player1Correct, score: result.player1Points },
          answerB: { isCorrect: result.player2Correct, score: result.player2Points },
        }));
        fetch('/api/revision/record-local', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, roundHistory: mappedHistory, examType: 'TYT' }),
        }).catch(() => {});
      }
      setGameState('matchEnd');
    }
  };

  // --------------------------------------------------------------------------
  // Oyunu / Maçı Yeniden Başlatma
  // --------------------------------------------------------------------------
  const handleRestart = () => {
    if (forcedQuestions && forcedQuestions.length > 0) {
      setQuestions(forcedQuestions);
    } else {
      setQuestions(pickMatchQuestions(questionPool, matchSettings.questionsPerMatch));
    }
    setCurrentQuestionIndex(0);
    setP1TotalScore(0);
    setP2TotalScore(0);
    setP1Streak(players.currentPlayer.streak);
    setP2Streak(players.opponentPlayer.streak);
    setRoundResultsHistory([]);
    setLastRoundResult(null);
    setGameState('playing');
  };

  // --------------------------------------------------------------------------
  // RENDER AŞAMALARI
  // --------------------------------------------------------------------------

  // 1. MATCH END EKRANI
  if (gameState === 'matchEnd') {
    return (
      <div className="min-h-screen bg-[#150A16] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="hero-button-blur -top-24 -left-24 opacity-30 pointer-events-none" />
        <div className="hero-button-blur -bottom-24 -right-24 opacity-25 pointer-events-none" />

        <MatchEndScreen
          player1={players.currentPlayer}
          player2={players.opponentPlayer}
          player1TotalScore={p1TotalScore}
          player2TotalScore={p2TotalScore}
          roundResults={roundResultsHistory}
          eloWinDelta={matchSettings.eloWinDelta}
          eloLossDelta={matchSettings.eloLossDelta}
          onRestart={onExit ? onExit : handleRestart}
        />
      </div>
    );
  }

  // 2. INTERMISSION (RAUNT ARASI) EKRANI
  if (gameState === 'intermission' && lastRoundResult && currentQuestion) {
    return (
      <div className="min-h-screen bg-[#150A16] text-white flex flex-col justify-between relative overflow-hidden font-sans">
        <div className="hero-button-blur -top-24 -left-24 opacity-25 pointer-events-none" />
        <div className="hero-button-blur -bottom-24 -right-24 opacity-20 pointer-events-none" />

        <MatchHeader
          player1={players.currentPlayer}
          player2={players.opponentPlayer}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          timeLeft={0}
          timeLimit={currentQuestion.timeLimitSeconds}
          player1Score={p1TotalScore}
          player2Score={p2TotalScore}
        />

        <main className="flex-1 flex items-center justify-center py-4">
          <IntermissionScreen
            countdownSec={matchSettings.intermissionCountdownSec}
            roundResult={lastRoundResult}
            question={currentQuestion}
            player1={players.currentPlayer}
            player2={players.opponentPlayer}
            player1TotalScore={p1TotalScore}
            player2TotalScore={p2TotalScore}
            isLastQuestion={currentQuestionIndex >= questions.length - 1}
            onDone={handleIntermissionDone}
          />
        </main>
      </div>
    );
  }

  // 3. PLAYING (AKTİF OYUN) EKRANI
  return (
    <div className="min-h-screen bg-[#150A16] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Arka plan glow efektleri */}
      <div className="hero-button-blur -top-24 -left-24 opacity-30 pointer-events-none" />
      <div className="hero-button-blur -bottom-24 -right-24 opacity-20 pointer-events-none" />

      {/* Üst Bar: Skorlar, Geri Sayım, Dinamometre */}
      <MatchHeader
        player1={players.currentPlayer}
        player2={players.opponentPlayer}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        timeLimit={currentQuestion?.timeLimitSeconds ?? 20}
        player1Score={p1TotalScore}
        player2Score={p2TotalScore}
      />

      {/* Ana Oyun Sahnesi: Soru Başlığı, Rozeti ve Renderer */}
      <main className="flex-1 flex items-center justify-center py-4">
        {currentQuestion && (
          <QuestionStage
            question={currentQuestion}
            opponentAnswered={opponentAnswered}
          >
            <QuestionRenderer
              question={currentQuestion}
              onSubmit={handleP1Submit}
              disabled={p1Answered || timeLeft <= 0}
            />
          </QuestionStage>
        )}
      </main>
    </div>
  );
};

export default GameScreen;
