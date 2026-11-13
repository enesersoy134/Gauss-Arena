/**
 * 🎯 Puanlama, Hız Bonusu ve Numpad Karşılaştırma Yardımcı Fonksiyonları
 */
import { PlayerNumpadSubmission, NumpadEvaluationResult } from '../types/game';

/**
 * Sayısal Tahmin / Kasa Şifresi Kazananını Belirleme Fonksiyonu
 *
 * Kurallar:
 * 1. Doğru cevaba mutlak farkı daha az olan oyuncu kazanır.
 * 2. Yakınlıklar eşitse yanıtı daha hızlı (timeMs daha küçük) veren oyuncu kazanır.
 * 3. Hem yakınlık hem süre tamamen eşitse beraberlik (draw) ilan edilir.
 */
export function evaluateNumpadWinner(
  correctAnswer: number,
  submissionA: PlayerNumpadSubmission,
  submissionB: PlayerNumpadSubmission
): NumpadEvaluationResult {
  const diffA = Math.abs(submissionA.answer - correctAnswer);
  const diffB = Math.abs(submissionB.answer - correctAnswer);

  // Kural 1: Daha yakın olan kazanır
  if (diffA < diffB) {
    return {
      winnerPlayerId: submissionA.playerId,
      playerADiff: diffA,
      playerBDiff: diffB,
      reason: 'closer_answer'
    };
  }
  if (diffB < diffA) {
    return {
      winnerPlayerId: submissionB.playerId,
      playerADiff: diffA,
      playerBDiff: diffB,
      reason: 'closer_answer'
    };
  }

  // Kural 2: Yakınlıklar eşitse daha hızlı olan kazanır
  if (submissionA.timeMs < submissionB.timeMs) {
    return {
      winnerPlayerId: submissionA.playerId,
      playerADiff: diffA,
      playerBDiff: diffB,
      reason: 'faster_speed'
    };
  }
  if (submissionB.timeMs < submissionA.timeMs) {
    return {
      winnerPlayerId: submissionB.playerId,
      playerADiff: diffA,
      playerBDiff: diffB,
      reason: 'faster_speed'
    };
  }

  // Kural 3: Tam eşitlik (Beraberlik)
  return {
    winnerPlayerId: 'draw',
    playerADiff: diffA,
    playerBDiff: diffB,
    reason: 'exact_tie'
  };
}

/**
 * Soru Puanı ve Hız Bonusu Hesaplama
 *
 * @param basePoints - Soru taban puanı
 * @param timeLimitSeconds - Soru için tanınan toplam süre (saniye)
 * @param elapsedTimeMs - Oyuncunun soruyu çözdüğü süre (milisaniye)
 * @param isCorrect - Cevap doğru mu?
 * @param streak - Oyuncunun mevcut galibiyet/seri sayısı
 */
export function calculateQuestionScore({
  basePoints,
  timeLimitSeconds,
  elapsedTimeMs,
  isCorrect,
  streak = 0
}: {
  basePoints: number;
  timeLimitSeconds: number;
  elapsedTimeMs: number;
  isCorrect: boolean;
  streak?: number;
}): {
  points: number;
  speedBonus: number;
  streakMultiplier: number;
} {
  if (!isCorrect) {
    return { points: 0, speedBonus: 0, streakMultiplier: 1.0 };
  }

  const totalTimeMs = Math.max(1000, timeLimitSeconds * 1000);
  const clampedElapsed = Math.min(Math.max(0, elapsedTimeMs), totalTimeMs);
  const remainingRatio = Math.max(0, (totalTimeMs - clampedElapsed) / totalTimeMs);

  // Kalan süre oranına göre taban puanın %50'sine kadar hız bonusu
  const speedBonus = Math.round(basePoints * 0.5 * remainingRatio);

  // Seri / Combo Çarpanı (3+ seri -> x1.25, 2 seri -> x1.10)
  let streakMultiplier = 1.0;
  if (streak >= 3) {
    streakMultiplier = 1.25;
  } else if (streak >= 2) {
    streakMultiplier = 1.1;
  }

  const points = Math.round((basePoints + speedBonus) * streakMultiplier);

  return {
    points,
    speedBonus,
    streakMultiplier
  };
}
