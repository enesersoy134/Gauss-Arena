import React, { useState } from 'react';
import type { MatrixToggleQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { Check, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const MatrixToggle: React.FC<QuestionComponentProps<MatrixToggleQuestion>> = ({
  question,
  onSubmit,
  disabled,
}) => {
  const { rows, columns, answers } = question.payload;

  // Hücre durumları: `${rowId}_${colId}` -> boolean | null (başlangıçta null)
  const [cellStates, setCellStates] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {};
    rows.forEach((r) => {
      columns.forEach((c) => {
        initial[`${r.id}_${c.id}`] = null;
      });
    });
    return initial;
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Hücreye tıklandığında döngü: null -> true -> false -> true
  const handleToggleCell = (rowId: string, colId: string) => {
    if (disabled || isSubmitted) return;

    const key = `${rowId}_${colId}`;
    const current = cellStates[key];

    let next: boolean | null;
    if (current === null || current === undefined) {
      next = true;
    } else if (current === true) {
      next = false;
    } else {
      next = true;
    }

    setCellStates((prev) => ({
      ...prev,
      [key]: next,
    }));
  };

  // Tüm hücreler dolu mu?
  const totalCells = rows.length * columns.length;
  const filledCellsCount = Object.values(cellStates).filter((v) => v !== null).length;
  const isAllFilled = filledCellsCount === totalCells;

  // Kontrol Et & Gönder
  const handleSubmit = () => {
    if (disabled || isSubmitted || !isAllFilled) return;

    let correctCount = 0;
    answers.forEach((ans) => {
      const key = `${ans.rowId}_${ans.colId}`;
      if (cellStates[key] === ans.expectedBool) {
        correctCount += 1;
      }
    });

    const accuracy = totalCells > 0 ? correctCount / totalCells : 0;
    const isCorrect = correctCount === totalCells;

    setIsSubmitted(true);
    onSubmit({ isCorrect, accuracy });
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 select-none font-sans">
      {/* 1. TABLO KAPSAYICISI (Responsive Yatay Kaydırma) */}
      <div className="w-full overflow-x-auto pb-2 px-1">
        <div className="min-w-max mx-auto flex flex-col gap-3">
          {/* TABLO BAŞLIK SATIRI (SÜTUNLAR) */}
          <div className="flex items-center gap-3">
            {/* Sol Köşe Boşluk / Başlık */}
            <div className="w-56 p-3 rounded-xl bg-isler-deep/90 border border-isler-primary/20 flex items-center justify-start text-xs font-poppins font-bold text-isler-muted uppercase tracking-wider">
              Hücre / Kategori
            </div>

            {/* Sütun Başlıkları */}
            {columns.map((col) => (
              <div
                key={col.id}
                className="w-56 p-3 rounded-xl bg-isler-deep/90 border border-isler-primary/20 flex items-center justify-center text-center text-sm font-poppins font-bold text-white shadow-sm"
              >
                {col.title}
              </div>
            ))}
          </div>

          {/* TABLO GÖVDE SATIRLARI */}
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-3 p-2 rounded-2xl bg-isler-surface/70 border border-white/5 hover:border-isler-primary/30 transition-all duration-200"
            >
              {/* Satır Başlığı Kartı */}
              <div className="w-56 p-3.5 rounded-xl bg-isler-deep flex flex-col justify-center border border-white/5">
                <span className="text-base font-poppins font-bold text-white">
                  {row.title}
                </span>
                <span className="text-[11px] text-isler-muted/60 mt-0.5">
                  Özelliklerini Ayarla
                </span>
              </div>

              {/* Satırdaki Hücre Sürgüleri (Toggles) */}
              {columns.map((col) => {
                const cellKey = `${row.id}_${col.id}`;
                const val = cellStates[cellKey];

                // Beklenen cevap kontrolü
                const expected = answers.find(
                  (a) => a.rowId === row.id && a.colId === col.id
                )?.expectedBool;

                const isCellCorrect = isSubmitted && val === expected;
                const isCellWrong = isSubmitted && val !== expected;

                return (
                  <button
                    key={col.id}
                    type="button"
                    disabled={disabled || isSubmitted}
                    onClick={() => handleToggleCell(row.id, col.id)}
                    className={`
                      w-56 h-20 rounded-xl px-4 flex items-center justify-between transition-all duration-200 border cursor-pointer relative group
                      ${
                        isCellCorrect
                          ? 'bg-game-correct/10 border-game-correct shadow-correct-glow'
                          : isCellWrong
                          ? 'bg-game-wrong/10 border-game-wrong shadow-wrong-glow'
                          : val === true
                          ? 'bg-[#22C55E]/10 border-game-correct shadow-[0_0_15px_rgba(34,197,94,0.25)]'
                          : val === false
                          ? 'bg-[#EF4444]/10 border-game-wrong shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                          : 'bg-isler-elevated/80 border-white/10 hover:border-isler-primary/50 hover:bg-isler-elevated'
                      }
                    `}
                  >
                    {/* Sol Metin / Durum Etiketi */}
                    <div className="flex flex-col items-start justify-center">
                      {val === true && (
                        <span className="text-xs font-poppins font-bold text-game-correct flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          VAR / EVET
                        </span>
                      )}
                      {val === false && (
                        <span className="text-xs font-poppins font-bold text-game-wrong flex items-center gap-1">
                          <X className="w-3.5 h-3.5" />
                          YOK / HAYIR
                        </span>
                      )}
                      {val === null && (
                        <span className="text-xs font-poppins font-semibold text-isler-muted/60 group-hover:text-isler-primary transition-colors">
                          Seçmek için dokun
                        </span>
                      )}

                      {/* Gönderim Sonrası Doğruluk Bilgisi */}
                      {isSubmitted && (
                        <span
                          className={`text-[10px] font-mono mt-0.5 font-bold ${
                            isCellCorrect ? 'text-game-correct' : 'text-game-wrong'
                          }`}
                        >
                          {isCellCorrect
                            ? 'Doğru Seçim'
                            : `Beklenen: ${expected ? 'VAR' : 'YOK'}`}
                        </span>
                      )}
                    </div>

                    {/* Sürgülü Şalter Görseli (Switch Track) */}
                    <div
                      className={`
                        w-16 h-8 rounded-full p-1 flex items-center transition-all duration-200 relative
                        ${
                          val === true
                            ? 'bg-game-correct justify-end shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                            : val === false
                            ? 'bg-game-wrong justify-start shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                            : 'bg-isler-deep justify-center border border-white/20'
                        }
                      `}
                    >
                      {/* Kayar Top / Thumb */}
                      <div
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-200
                          ${
                            val === true
                              ? 'bg-white text-game-correct'
                              : val === false
                              ? 'bg-white text-game-wrong'
                              : 'bg-isler-muted/30 text-white'
                          }
                        `}
                      >
                        {val === true && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        {val === false && <X className="w-3.5 h-3.5 stroke-[3]" />}
                        {val === null && '?'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 2. ALT: KONTROL ET VE İLERLEME ÇUBUĞU */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-2xl px-2 mt-2">
        {/* İlerleme Bilgisi */}
        <div className="flex items-center gap-2 text-xs font-poppins text-isler-muted">
          <span>Hücre Durumu:</span>
          <span className="font-mono font-bold text-white">
            {filledCellsCount} / {totalCells}
          </span>
          {isAllFilled ? (
            <span className="inline-flex items-center gap-1 text-game-correct font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tümü Ayarlandı
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-isler-primary font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              {totalCells - filledCellsCount} hücre bekliyor
            </span>
          )}
        </div>

        {/* Gönder / Kontrol Et Butonu */}
        {!isSubmitted && (
          <button
            type="button"
            disabled={disabled || !isAllFilled}
            onClick={handleSubmit}
            className={`
              btn-primary px-8 py-3 rounded-full font-poppins font-bold text-sm tracking-wide uppercase transition-all duration-200 flex items-center gap-2
              ${
                !isAllFilled || disabled
                  ? 'opacity-40 cursor-not-allowed bg-isler-surface border border-white/10 text-isler-muted shadow-none pointer-events-none'
                  : 'bg-isler-primary text-white shadow-btn-glow hover:bg-isler-hover active:scale-95 cursor-pointer'
              }
            `}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Kontrol Et
          </button>
        )}
      </div>
    </div>
  );
};

export default MatrixToggle;
