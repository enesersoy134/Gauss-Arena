import React, { useState } from 'react';
import type { SliderQuestion as SliderQuestionType } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { Lock, Check, X, Minus, Plus } from 'lucide-react';

export const SliderQuestion: React.FC<QuestionComponentProps<SliderQuestionType>> = ({
  question,
  onSubmit,
  disabled,
}) => {
  const {
    min,
    max,
    step,
    initialValue,
    unit,
    targetValue,
    tolerance,
    visualSimulationType,
  } = question.payload;

  const [currentValue, setCurrentValue] = useState<number>(() => initialValue ?? min);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Birim veya simulation type kontrolü
  const isPhSim =
    visualSimulationType === 'ph' ||
    unit.toLowerCase().includes('ph') ||
    question.prompt.toLowerCase().includes('ph');

  // Değer yüzde hesabı (0 - 100%)
  const range = max - min || 1;
  const percentage = Math.max(0, Math.min(100, ((currentValue - min) / range) * 100));

  // pH rengi (HSL: 0=Kırmızı, 7=Yeşil, 14=Mavi)
  const getPhColor = (ph: number) => {
    const clamped = Math.max(0, Math.min(14, ph));
    const hue = Math.round((clamped / 14) * 240);
    return `hsl(${hue}, 85%, 48%)`;
  };

  const getPhLiquidBg = (ph: number) => {
    const clamped = Math.max(0, Math.min(14, ph));
    const hue = Math.round((clamped / 14) * 240);
    return `linear-gradient(180deg, hsl(${hue}, 85%, 55%) 0%, hsl(${hue}, 80%, 35%) 100%)`;
  };

  const getPhStatusLabel = (ph: number) => {
    if (ph < 3) return 'Kuvvetli Asidik';
    if (ph < 6.5) return 'Zayıf Asidik';
    if (ph >= 6.5 && ph <= 7.5) return 'Nötr Çözelti (Dengede)';
    if (ph <= 11) return 'Zayıf Bazik';
    return 'Kuvvetli Bazik';
  };

  // Slider değişimi
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isSubmitted) return;
    setCurrentValue(parseFloat(e.target.value));
  };

  // Butonla adım adım artır/azalt
  const handleStepChange = (delta: number) => {
    if (disabled || isSubmitted) return;
    setCurrentValue((prev) => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.max(min, Math.min(max, next));
    });
  };

  // Gönder (Değeri Kilitle)
  const handleSubmit = () => {
    if (disabled || isSubmitted) return;

    const diff = Math.abs(currentValue - targetValue);
    const isCorrect = diff <= tolerance;
    const accuracy = Math.max(0, Math.min(1, 1 - diff / range));

    setIsSubmitted(true);
    onSubmit({ isCorrect, accuracy, numericAnswer: currentValue });
  };

  const diff = Math.abs(currentValue - targetValue);
  const isCorrect = isSubmitted && diff <= tolerance;
  const isWrong = isSubmitted && diff > tolerance;

  return (
    <div className="w-full flex flex-col items-center gap-6 select-none font-sans">
      {/* 1. ÜST PANEL: SİMÜLASYON & BÜYÜK DİJİTAL GÖSTERGE */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {/* SOL: GÖRSEL SİMÜLASYON ALANI */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-isler-surface border border-isler-primary/30 shadow-lg relative min-h-[220px]">
          {isPhSim ? (
            /* pH BEHER SİMÜLASYONU */
            <div className="flex items-center gap-6 w-full justify-center">
              {/* Cam Beher SVG */}
              <div className="relative w-32 h-44 flex flex-col items-center justify-end">
                {/* Beher Cam Gövdesi */}
                <div className="absolute inset-0 border-2 border-t-0 border-[#B5CBC8]/70 rounded-b-2xl bg-[#0F0510]/50 overflow-hidden flex flex-col justify-end">
                  {/* Sıvı */}
                  <div
                    className="w-full transition-all duration-300 relative flex items-center justify-center"
                    style={{
                      height: '68%',
                      background: getPhLiquidBg(currentValue),
                      boxShadow: `0 0 25px ${getPhColor(currentValue)}`,
                    }}
                  >
                    {/* Kabarcıklar */}
                    <div className="absolute w-2 h-2 rounded-full bg-white/40 top-3 left-4 animate-ping" />
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-white/50 top-6 right-5 animate-pulse" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-white/30 bottom-4 left-8" />
                  </div>

                  {/* Beher Çizgileri / Skala */}
                  <div className="absolute left-1 inset-y-4 flex flex-col justify-between pointer-events-none opacity-60">
                    <div className="w-3 h-0.5 bg-white" />
                    <div className="w-4 h-0.5 bg-white" />
                    <div className="w-3 h-0.5 bg-white" />
                    <div className="w-5 h-0.5 bg-white" />
                    <div className="w-3 h-0.5 bg-white" />
                  </div>
                </div>

                {/* Beher Üst Dudak */}
                <div className="absolute -top-1 w-36 h-2 rounded-full border-2 border-[#B5CBC8]/70 bg-isler-surface" />
              </div>

              {/* Bilgi Rozetleri */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-poppins font-bold uppercase tracking-wider text-isler-muted">
                  Çözelti İndikatörü
                </span>
                <div
                  className="px-3 py-1.5 rounded-xl font-poppins font-bold text-xs shadow-sm transition-all duration-300"
                  style={{
                    backgroundColor: `${getPhColor(currentValue)}25`,
                    color: getPhColor(currentValue),
                    border: `1px solid ${getPhColor(currentValue)}`,
                  }}
                >
                  {getPhStatusLabel(currentValue)}
                </div>
                <span className="text-[11px] text-isler-muted/70">
                  Renk skalası 0 (kırmızı) ile 14 (mavi) arası anlık güncellenir.
                </span>
              </div>
            </div>
          ) : (
            /* GENEL DOLUM / GAUGE SİMÜLASYONU */
            <div className="flex flex-col items-center justify-center w-full px-4 gap-3">
              <span className="text-xs font-poppins font-bold uppercase tracking-wider text-isler-muted">
                Parametre Seviyesi
              </span>

              {/* Dinamik Dikey / Yatay Dolum Barı */}
              <div className="w-full h-8 rounded-full bg-isler-deep border border-isler-primary/30 p-1 relative overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-isler-surface via-isler-primary to-[#FF7A45] transition-all duration-200 relative"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between w-full text-xs font-mono text-isler-muted px-1">
                <span>Min: {min}</span>
                <span className="font-bold text-isler-primary">
                  %{percentage.toFixed(0)} Kapasite
                </span>
                <span>Max: {max}</span>
              </div>
            </div>
          )}
        </div>

        {/* SAĞ: DİJİTAL LCD GÖSTERGE */}
        <div
          className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-isler-deep border transition-all duration-200 shadow-xl relative min-h-[220px] ${
            isCorrect
              ? 'border-game-correct shadow-correct-glow'
              : isWrong
              ? 'border-game-wrong shadow-wrong-glow'
              : 'border-isler-primary/40 shadow-isler-glow'
          }`}
        >
          <span className="text-xs font-poppins font-bold uppercase tracking-wider text-isler-muted mb-1">
            Anlık Ayarlanan Değer
          </span>

          {/* Büyük Sayı ve Birim */}
          <div className="flex items-baseline gap-2 my-2">
            <span
              className={`font-mono text-6xl md:text-7xl font-bold tracking-tight ${
                isCorrect
                  ? 'text-game-correct'
                  : isWrong
                  ? 'text-game-wrong'
                  : 'text-white'
              }`}
            >
              {Number.isInteger(currentValue)
                ? currentValue
                : currentValue.toFixed(step < 1 ? 1 : 0)}
            </span>
            <span className="font-poppins text-2xl font-bold text-isler-primary">
              {unit}
            </span>
          </div>

          {/* Gönderim Sonrası veya Hedef Durumu */}
          {isSubmitted ? (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-bold mt-2 ${
                isCorrect
                  ? 'bg-game-correct/20 text-game-correct border border-game-correct/40'
                  : 'bg-game-wrong/20 text-game-wrong border border-game-wrong/40'
              }`}
            >
              {isCorrect ? (
                <>
                  <Check className="w-4 h-4" />
                  Kusursuz İsabet! (Hedef: {targetValue} {unit})
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Hedef: {targetValue} {unit} (Sapma: {diff.toFixed(1)} {unit})
                </>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-isler-muted/60 mt-1 font-mono">
              Hassasiyet Toleransı: ±{tolerance} {unit}
            </span>
          )}
        </div>
      </div>

      {/* 2. ORTA: RANGE SLIDER KONTROL ALANI */}
      <div className="w-full max-w-4xl p-6 rounded-2xl bg-isler-surface border border-isler-primary/30 shadow-md flex flex-col gap-4">
        {/* Üst Bilgi ve Hızlı Adım Butonları */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-poppins font-bold text-isler-muted uppercase tracking-wider">
            Sürgüyü Ayarlayın
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={disabled || isSubmitted || currentValue <= min}
              onClick={() => handleStepChange(-step)}
              className="p-2 rounded-xl bg-isler-elevated border border-white/10 text-white hover:border-isler-primary active:scale-95 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              title="Azalt"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={disabled || isSubmitted || currentValue >= max}
              onClick={() => handleStepChange(step)}
              className="p-2 rounded-xl bg-isler-elevated border border-white/10 text-white hover:border-isler-primary active:scale-95 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              title="Artır"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Özel Stilli Input Range */}
        <div className="relative w-full py-4 flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            disabled={disabled || isSubmitted}
            onChange={handleChange}
            className={`
              w-full h-4 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all
              ${
                isPhSim
                  ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-600'
                  : 'bg-gradient-to-r from-isler-surface via-isler-elevated to-isler-primary'
              }
            `}
            style={{
              accentColor: '#F14E13',
            }}
          />
        </div>

        {/* Min / Max / Skala Etiketleri */}
        <div className="flex items-center justify-between text-xs font-mono text-isler-muted px-1">
          <span className="font-semibold">
            {min} {unit}
          </span>
          <span className="text-[11px] text-isler-muted/60">
            Adım: {step} {unit}
          </span>
          <span className="font-semibold">
            {max} {unit}
          </span>
        </div>
      </div>

      {/* 3. ALT: GÖNDER / KİLİTLE BUTONU */}
      {!isSubmitted && (
        <div className="mt-1 flex items-center justify-center">
          <button
            type="button"
            disabled={disabled}
            onClick={handleSubmit}
            className={`
              btn-primary px-10 py-3.5 rounded-full font-poppins font-bold text-sm tracking-wide uppercase transition-all duration-200 flex items-center gap-2
              ${
                disabled
                  ? 'opacity-40 cursor-not-allowed bg-isler-surface border border-white/10 text-isler-muted shadow-none pointer-events-none'
                  : 'bg-isler-primary text-white shadow-btn-glow hover:bg-isler-hover active:scale-95 cursor-pointer'
              }
            `}
          >
            <Lock className="w-4 h-4" />
            <span>Değeri Kilitle</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SliderQuestion;
