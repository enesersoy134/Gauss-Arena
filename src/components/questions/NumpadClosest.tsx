import React, { useState, useEffect, useCallback } from 'react';
import type { NumpadClosestQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { Delete, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

export default function NumpadClosest({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<NumpadClosestQuestion>) {
  const { payload } = question;
  const allowDecimals = payload.allowDecimals ?? true;
  const allowNegative = payload.allowNegative ?? false;

  const [inputStr, setInputStr] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [lastSubmission, setLastSubmission] = useState<{
    ans: number;
    diff: number;
    isCorrect: boolean;
    accuracy: number;
  } | null>(null);

  // Soru değiştiğinde sıfırla
  useEffect(() => {
    setInputStr('');
    setIsSubmitted(false);
    setLastSubmission(null);
  }, [question.id]);

  const isLocked = disabled || isSubmitted;

  // Rakam ekleme
  const handleDigit = useCallback(
    (digit: string) => {
      if (isLocked) return;
      if (inputStr.length >= 10) return; // LCD taşmasını önle

      // Eğer şu an sadece "0" varsa ve 0 dışında bir rakam gelirse 0'ı ez
      if (inputStr === '0' && digit !== '0') {
        setInputStr(digit);
        return;
      }

      // Başta birden fazla 0 olmasını engelle
      if (inputStr === '0' && digit === '0') return;

      setInputStr((prev) => prev + digit);
    },
    [isLocked, inputStr]
  );

  // Virgül / Ondalık ekleme
  const handleDecimal = useCallback(() => {
    if (isLocked || !allowDecimals) return;
    if (inputStr.includes(',') || inputStr.includes('.')) return;

    if (!inputStr || inputStr === '-') {
      setInputStr((prev) => prev + '0,');
    } else {
      setInputStr((prev) => prev + ',');
    }
  }, [isLocked, allowDecimals, inputStr]);

  // Negatif işareti değiştirme (+ / -)
  const handleNegative = useCallback(() => {
    if (isLocked || !allowNegative) return;

    if (inputStr.startsWith('-')) {
      setInputStr((prev) => prev.slice(1));
    } else {
      setInputStr((prev) => '-' + prev);
    }
  }, [isLocked, allowNegative]);

  // Silme (Backspace)
  const handleDelete = useCallback(() => {
    if (isLocked) return;
    setInputStr((prev) => prev.slice(0, -1));
  }, [isLocked]);

  // Gönderim
  const handleSubmit = useCallback(() => {
    if (isLocked || !inputStr || inputStr === '-') return;

    const parsedNumber = parseFloat(inputStr.replace(',', '.'));
    if (isNaN(parsedNumber)) return;

    const diff = Math.abs(parsedNumber - payload.correctAnswer);
    const tolerance = payload.tolerance ?? 0;
    const isCorrect = diff <= tolerance;
    const accuracy = Math.max(0, 1 - diff / Math.max(1, Math.abs(payload.correctAnswer)));

    setIsSubmitted(true);
    setLastSubmission({
      ans: parsedNumber,
      diff,
      isCorrect,
      accuracy,
    });

    onSubmit({
      isCorrect,
      numericAnswer: parsedNumber,
      accuracy,
    });
  }, [isLocked, inputStr, payload.correctAnswer, payload.tolerance, onSubmit]);

  // Fiziksel Klavye Desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === ',' || e.key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '-' && allowNegative) {
        e.preventDefault();
        handleNegative();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, handleDigit, handleDecimal, handleNegative, handleDelete, handleSubmit, allowNegative]);

  const isValidInput = inputStr.length > 0 && inputStr !== '-';

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* =========================================================================
         * SOL TARAF: DİJİTAL LCD EKRAN VE DURUM
         * ========================================================================= */}
        <div className="md:col-span-6 flex flex-col justify-between gap-4">
          {/* LCD Konsol Ekranı */}
          <div
            className={`relative p-6 rounded-2xl bg-[#09030A] border-2 flex flex-col justify-between min-h-[170px] md:min-h-[220px] transition-all duration-300 ${
              isSubmitted
                ? lastSubmission?.isCorrect
                  ? 'border-[#22C55E] shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                  : 'border-[#EF4444] shadow-[0_0_30px_rgba(239,68,68,0.4)]'
                : 'border-isler-primary shadow-[0_0_30px_-10px_rgba(241,78,19,0.5)]'
            }`}
          >
            {/* Üst Bilgi Satırı */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-[#1A0E1C] border border-isler-primary/30 text-[11px] font-poppins font-bold text-[#FF7A45] tracking-wider uppercase">
                Dijital Konsol Girişi
              </span>

              {isValidInput && !isSubmitted && (
                <span className="text-xs font-poppins font-bold text-[#4ADE80] flex items-center gap-1">
                  ✓ Hazır
                </span>
              )}
            </div>

            {/* Orta Değer Girişi ve Birim */}
            <div className="flex items-baseline gap-3 my-2 overflow-x-auto py-2">
              <span className="font-mono font-black text-5xl md:text-6xl text-white tracking-wider">
                {inputStr || '0'}
              </span>

              {!isLocked && (
                <span className="w-1.5 h-10 bg-isler-primary animate-pulse rounded-full inline-block" />
              )}

              {payload.unit && (
                <span className="font-poppins font-bold text-xl md:text-2xl text-[#FF7A45]">
                  {payload.unit}
                </span>
              )}
            </div>

            {/* Alt Açıklama / İpucu */}
            <div className="text-[11px] font-poppins text-isler-muted flex items-center justify-between border-t border-white/10 pt-2">
              <span>{allowDecimals ? 'Virgüllü giriş serbest' : 'Tam sayı girişi'}</span>
              <span>{allowNegative ? 'Negatif değer kabul edilir' : 'Pozitif değer'}</span>
            </div>
          </div>

          {/* Sonuç Geribildirim Kartı */}
          {isSubmitted && lastSubmission && (
            <div
              className={`p-4 rounded-xl border flex flex-col gap-2 ${
                lastSubmission.isCorrect
                  ? 'bg-[#22C55E]/15 border-[#22C55E]/50'
                  : 'bg-[#EF4444]/15 border-[#EF4444]/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {lastSubmission.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                    <span className="font-poppins font-bold text-sm text-[#4ADE80]">
                      {lastSubmission.diff === 0 ? 'Tam İsabet!' : 'Tolerans Dahilinde Doğru!'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                    <span className="font-poppins font-bold text-sm text-[#F87171]">
                      Fark Oluştu (Sapma: {lastSubmission.diff.toFixed(2)})
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs font-poppins text-isler-muted flex items-center justify-between">
                <span>
                  Hedef Değer:{' '}
                  <strong className="text-white font-mono">
                    {payload.correctAnswer} {payload.unit || ''}
                  </strong>
                </span>
                <span>
                  Doğruluk Oranı:{' '}
                  <strong className="text-white font-mono">
                    %{Math.round(lastSubmission.accuracy * 100)}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
         * SAĞ TARAF: NUMERİK TUŞ TAKIMI (NUMPAD)
         * ========================================================================= */}
        <div className="md:col-span-6 p-4 md:p-6 rounded-2xl bg-isler-surface border border-isler-primary/35 flex flex-col gap-3 shadow-lg">
          {/* Tuş Izgarası (3x4) */}
          <div className="grid grid-cols-3 gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={isLocked}
                onClick={() => handleDigit(digit)}
                className="h-14 md:h-16 rounded-xl bg-isler-deep border border-isler-primary/30 font-mono font-black text-2xl text-white hover:border-isler-primary hover:bg-isler-elevated active:scale-95 transition-all duration-150 flex items-center justify-center select-none disabled:opacity-40"
              >
                {digit}
              </button>
            ))}

            {/* Eksi Tuşu (-) */}
            <button
              type="button"
              disabled={isLocked || !allowNegative}
              onClick={handleNegative}
              className={`h-14 md:h-16 rounded-xl bg-isler-deep border border-isler-primary/30 font-mono font-bold text-2xl text-isler-muted transition-all duration-150 flex items-center justify-center select-none ${
                allowNegative && !isLocked
                  ? 'hover:border-isler-primary hover:bg-isler-elevated active:scale-95 text-white'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              -
            </button>

            {/* Sıfır Tuşu (0) */}
            <button
              type="button"
              disabled={isLocked}
              onClick={() => handleDigit('0')}
              className="h-14 md:h-16 rounded-xl bg-isler-deep border border-isler-primary/30 font-mono font-black text-2xl text-white hover:border-isler-primary hover:bg-isler-elevated active:scale-95 transition-all duration-150 flex items-center justify-center select-none disabled:opacity-40"
            >
              0
            </button>

            {/* Virgül Tuşu (,) */}
            <button
              type="button"
              disabled={isLocked || !allowDecimals}
              onClick={handleDecimal}
              className={`h-14 md:h-16 rounded-xl bg-isler-deep border border-isler-primary/30 font-mono font-bold text-2xl text-isler-muted transition-all duration-150 flex items-center justify-center select-none ${
                allowDecimals && !isLocked
                  ? 'hover:border-isler-primary hover:bg-isler-elevated active:scale-95 text-white'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              ,
            </button>
          </div>

          {/* Alt Aksiyon Butonları: SİL & GÖNDER */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* Sil Butonu */}
            <button
              type="button"
              disabled={isLocked || inputStr.length === 0}
              onClick={handleDelete}
              className="col-span-1 h-14 md:h-16 rounded-xl bg-[#25121B] border border-[#EF4444]/40 font-poppins font-bold text-sm text-[#F87171] hover:bg-[#EF4444]/20 hover:border-[#EF4444] active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5 disabled:opacity-40 select-none"
            >
              <Delete className="w-4 h-4" />
              <span>Sil</span>
            </button>

            {/* Gönder Butonu */}
            <button
              type="button"
              disabled={isLocked || !isValidInput}
              onClick={handleSubmit}
              className="col-span-2 h-14 md:h-16 rounded-xl btn-primary font-poppins font-extrabold text-base flex items-center justify-center gap-2 select-none disabled:opacity-40 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
              <span>Gönder {isValidInput ? `(${inputStr})` : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
