/**
 * ============================================================================
 * 🤖 RAKİP SİMÜLATÖRÜ (OPPONENT SIMULATOR)
 * ============================================================================
 * 
 * ⚠️ GELİŞTİRİCİ NOTU:
 * Bu simülasyon mantığı prototip ve yerel test amaçlıdır.
 * İleride doğrudan gerçek zamanlı WebSocket (Socket.io / WebRTC DataChannel)
 * üzerinden rakip oyuncunun canlı soket olaylarından (match:player_answer)
 * beslenecektir.
 * ============================================================================
 */

import { Question, NumpadClosestPayload } from '../types/game';
import { AnswerResult } from '../components/questions/questionProps';

export interface OpponentSimulationResult extends AnswerResult {
  /** Rakibin soruyu cevapladığı süre (milisaniye) */
  timeMs: number;
}

/**
 * Verilen soru için rakibin tahmini cevap süresi ve doğruluğunu simüle eder.
 * 
 * Kurallar:
 * - Süre: Soru süresinin %35 - %90'ı arasında rastgele bir an.
 * - Başarı: Yaklaşık %65 olasılıkla doğru cevap.
 * - Numpad_closest: Doğru cevaba yakın veya hafif sapmalı bir sayı üretilir.
 */
export function simulateOpponentAnswer(question: Question): OpponentSimulationResult {
  const timeLimitMs = question.timeLimitSeconds * 1000;
  
  // %35 - %90 arasında süre
  const timeRatio = 0.35 + Math.random() * 0.55;
  const timeMs = Math.round(timeLimitMs * timeRatio);

  const isNumpad = question.type === 'numpad_closest';
  const isLikelyCorrect = Math.random() < 0.65;

  if (isNumpad) {
    const payload = question.payload as NumpadClosestPayload;
    const target = payload.correctAnswer;
    let numericAnswer: number;

    if (isLikelyCorrect) {
      // Doğru ya da çok yakın (örneğin +- 0 ile 2 arası)
      const offset = Math.floor(Math.random() * 3);
      const sign = Math.random() < 0.5 ? -1 : 1;
      numericAnswer = target + sign * offset;
    } else {
      // Biraz daha uzak bir sapma (örneğin %15-30 sapma veya +- 3-15)
      const maxSpread = Math.max(5, Math.round(Math.abs(target) * 0.25));
      const offset = 2 + Math.floor(Math.random() * maxSpread);
      const sign = Math.random() < 0.5 ? -1 : 1;
      numericAnswer = target + sign * offset;
    }

    // Min / max sınırlarını koru
    if (payload.min !== undefined) numericAnswer = Math.max(payload.min, numericAnswer);
    if (payload.max !== undefined) numericAnswer = Math.min(payload.max, numericAnswer);

    const isCorrect = numericAnswer === target;

    return {
      isCorrect,
      accuracy: isCorrect ? 1 : Math.max(0, 1 - Math.abs(numericAnswer - target) / Math.max(1, Math.abs(target))),
      numericAnswer,
      timeMs
    };
  }

  // Standart soru tipleri için
  if (isLikelyCorrect) {
    return {
      isCorrect: true,
      accuracy: 1.0,
      timeMs
    };
  } else {
    // Yanlış cevap veya kısmi doğruluk
    const isPartial = Math.random() < 0.3;
    return {
      isCorrect: false,
      accuracy: isPartial ? 0.5 : 0.0,
      timeMs
    };
  }
}
