/**
 * Tüm soru bileşenlerinin uyduğu ORTAK SÖZLEŞME.
 * Her soru bileşeni sadece bu props'ları alır ve cevabı onSubmit ile bildirir.
 * Puan hesaplama / süre / rakip simülasyonu bileşenin işi DEĞİLDİR (GameScreen yapar).
 */
import type { Question } from '../../types/game';

export interface AnswerResult {
  /** Cevap tamamen doğru mu? */
  isCorrect: boolean;
  /** 0–1 arası kısmi doğruluk (eşleştirme, gruplama, matris vb. için). Yoksa isCorrect'e göre 1/0 kabul edilir. */
  accuracy?: number;
  /** Sadece numpad_closest için: oyuncunun girdiği sayı (yakınlık hesabı için). */
  numericAnswer?: number;
}

export interface QuestionComponentProps<Q extends Question = Question> {
  question: Q;
  /** Oyuncu cevabını kilitlediğinde BİR KEZ çağrılır. */
  onSubmit: (result: AnswerResult) => void;
  /** true ise bileşen etkileşimi kapatır (cevap gönderildi / süre doldu). */
  disabled: boolean;
}
