import React, { useState, useEffect, useMemo } from 'react';
import type { PairMatchingQuestion } from '../../types/game';
import type { QuestionComponentProps } from './questionProps';
import { CheckCircle2, XCircle, Sparkles, Link2 } from 'lucide-react';

interface MatchedLink {
  leftId: string;
  rightId: string;
  colorIdx: number;
}

const PAIR_COLORS = [
  { border: 'border-[#3B82F6]', bg: 'bg-[#3B82F6]/15', text: 'text-[#60A5FA]', badge: 'bg-[#3B82F6]' },
  { border: 'border-[#A855F7]', bg: 'bg-[#A855F7]/15', text: 'text-[#C084FC]', badge: 'bg-[#A855F7]' },
  { border: 'border-[#F59E0B]', bg: 'bg-[#F59E0B]/15', text: 'text-[#FBBF24]', badge: 'bg-[#F59E0B]' },
  { border: 'border-[#06B6D4]', bg: 'bg-[#06B6D4]/15', text: 'text-[#22D3EE]', badge: 'bg-[#06B6D4]' },
  { border: 'border-[#EC4899]', bg: 'bg-[#EC4899]/15', text: 'text-[#F472B6]', badge: 'bg-[#EC4899]' },
  { border: 'border-[#10B981]', bg: 'bg-[#10B981]/15', text: 'text-[#34D399]', badge: 'bg-[#10B981]' },
];

export default function PairMatching({
  question,
  onSubmit,
  disabled,
}: QuestionComponentProps<PairMatchingQuestion>) {
  const { payload } = question;
  const pairs = payload.pairs || [];
  const totalCount = pairs.length;

  const pairsKey = pairs.map((p) => `${p.pairId}:${p.leftText}:${p.rightText}`).join('\u0000');

  // Sol ve Sağ elemanları hazırla (Sağ sütun yalnızca soru ilk yüklendiğinde karıştırılır)
  const leftItems = useMemo(() => {
    return pairs.map((p) => ({ id: p.pairId, text: p.leftText }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, pairsKey]);

  const rightItems = useMemo(() => {
    const raw = pairs.map((p) => ({ id: p.pairId, text: p.rightText }));
    const shuffled = [...raw];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, pairsKey]);

  // Durumlar
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchedLink[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Soru değiştiğinde sıfırla
  useEffect(() => {
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setMatches([]);
    setIsSubmitted(false);
  }, [question.id]);

  const isLocked = disabled || isSubmitted;

  // Tümü eşleşti mi kontrolü ve otomatik gönderim
  const checkAndSubmit = (newMatches: MatchedLink[]) => {
    if (newMatches.length === totalCount && totalCount > 0) {
      setIsSubmitted(true);
      const correctCount = newMatches.filter((m) => m.leftId === m.rightId).length;
      const accuracy = correctCount / totalCount;
      const isCorrect = accuracy === 1;

      onSubmit({
        isCorrect,
        accuracy,
      });
    }
  };

  // Sol eleman tıklaması
  const handleLeftClick = (id: string) => {
    if (isLocked) return;

    // Zaten eşleşmişse eşleşmeyi kaldır
    const existingMatch = matches.find((m) => m.leftId === id);
    if (existingMatch) {
      const filtered = matches.filter((m) => m.leftId !== id);
      setMatches(filtered);
      return;
    }

    // Sağda bekleyen seçim varsa doğrudan eşleştir
    if (selectedRightId !== null) {
      const newMatches = [
        ...matches,
        { leftId: id, rightId: selectedRightId, colorIdx: matches.length % PAIR_COLORS.length },
      ];
      setMatches(newMatches);
      setSelectedLeftId(null);
      setSelectedRightId(null);
      checkAndSubmit(newMatches);
    } else {
      // Beklemede olan sol seçimi güncelle (veya aynıysa kaldır)
      setSelectedLeftId((prev) => (prev === id ? null : id));
    }
  };

  // Sağ eleman tıklaması
  const handleRightClick = (id: string) => {
    if (isLocked) return;

    // Zaten eşleşmişse eşleşmeyi kaldır
    const existingMatch = matches.find((m) => m.rightId === id);
    if (existingMatch) {
      const filtered = matches.filter((m) => m.rightId !== id);
      setMatches(filtered);
      return;
    }

    // Solda bekleyen seçim varsa doğrudan eşleştir
    if (selectedLeftId !== null) {
      const newMatches = [
        ...matches,
        { leftId: selectedLeftId, rightId: id, colorIdx: matches.length % PAIR_COLORS.length },
      ];
      setMatches(newMatches);
      setSelectedLeftId(null);
      setSelectedRightId(null);
      checkAndSubmit(newMatches);
    } else {
      // Beklemede olan sağ seçimi güncelle (veya aynıysa kaldır)
      setSelectedRightId((prev) => (prev === id ? null : id));
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* İlerleme ve Bilgi Göstergesi */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-poppins font-bold text-isler-muted uppercase tracking-wider">
          Soldan ve sağdan birer öğe seçerek bağla
        </span>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-isler-surface border border-isler-primary/30 font-mono text-xs font-bold text-[#FF7A45]">
          <Link2 className="w-3.5 h-3.5" />
          <span>
            {matches.length} / {totalCount} Eşleşti
          </span>
        </div>
      </div>

      {/* Sütun Başlıkları ve Kart Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* =========================================================================
         * SOL SÜTUN
         * ========================================================================= */}
        <div className="flex flex-col gap-3">
          <div className="p-2.5 rounded-xl bg-isler-deep border border-isler-primary/25 text-center">
            <span className="font-poppins font-bold text-xs uppercase tracking-wider text-[#FF7A45]">
              {payload.leftColumnTitle || 'Sol Sütun (Kavramlar)'}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {leftItems.map((item) => {
              const match = matches.find((m) => m.leftId === item.id);
              const isSelected = selectedLeftId === item.id;
              const isCorrectPair = isSubmitted && match && match.leftId === match.rightId;
              const isWrongPair = isSubmitted && match && match.leftId !== match.rightId;

              let cardStyle =
                'border-isler-primary/35 bg-isler-surface hover:border-isler-primary hover:bg-isler-elevated hover:shadow-[0_4px_20px_-4px_rgba(241,78,19,0.35)]';

              if (isSelected) {
                cardStyle =
                  'border-isler-primary bg-gradient-to-r from-isler-primary/30 to-isler-surface ring-2 ring-isler-primary shadow-[0_0_20px_rgba(241,78,19,0.5)]';
              } else if (match) {
                const color = PAIR_COLORS[match.colorIdx];
                cardStyle = `${color.border} ${color.bg} shadow-md`;

                if (isSubmitted) {
                  if (isCorrectPair) {
                    cardStyle =
                      'border-[#22C55E] bg-[#22C55E]/20 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
                  } else if (isWrongPair) {
                    cardStyle =
                      'border-[#EF4444] bg-[#EF4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
                  }
                }
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleLeftClick(item.id)}
                  className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 min-h-[64px] text-left select-none ${cardStyle} ${
                    !isLocked ? 'cursor-pointer active:scale-98' : 'cursor-default'
                  }`}
                >
                  <span className="font-poppins font-semibold text-sm md:text-base text-white break-words flex-1">
                    {item.text}
                  </span>

                  {/* Rozet veya Durum Göstergesi */}
                  {match && (
                    <div className="ml-3 flex items-center gap-1.5 flex-shrink-0">
                      {isSubmitted ? (
                        isCorrectPair ? (
                          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#EF4444]" />
                        )
                      ) : (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-isler-deep/80 text-white border border-white/20">
                          #{match.colorIdx + 1}
                        </span>
                      )}
                    </div>
                  )}

                  {isSelected && (
                    <span className="ml-2 w-2.5 h-2.5 rounded-full bg-isler-primary animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
         * SAĞ SÜTUN (Karıştırılmış)
         * ========================================================================= */}
        <div className="flex flex-col gap-3">
          <div className="p-2.5 rounded-xl bg-isler-deep border border-isler-primary/25 text-center">
            <span className="font-poppins font-bold text-xs uppercase tracking-wider text-[#60A5FA]">
              {payload.rightColumnTitle || 'Sağ Sütun (Karşılıklar)'}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {rightItems.map((item) => {
              const match = matches.find((m) => m.rightId === item.id);
              const isSelected = selectedRightId === item.id;
              const isCorrectPair = isSubmitted && match && match.leftId === match.rightId;
              const isWrongPair = isSubmitted && match && match.leftId !== match.rightId;

              let cardStyle =
                'border-isler-primary/35 bg-isler-surface hover:border-isler-primary hover:bg-isler-elevated hover:shadow-[0_4px_20px_-4px_rgba(241,78,19,0.35)]';

              if (isSelected) {
                cardStyle =
                  'border-isler-primary bg-gradient-to-r from-isler-primary/30 to-isler-surface ring-2 ring-isler-primary shadow-[0_0_20px_rgba(241,78,19,0.5)]';
              } else if (match) {
                const color = PAIR_COLORS[match.colorIdx];
                cardStyle = `${color.border} ${color.bg} shadow-md`;

                if (isSubmitted) {
                  if (isCorrectPair) {
                    cardStyle =
                      'border-[#22C55E] bg-[#22C55E]/20 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
                  } else if (isWrongPair) {
                    cardStyle =
                      'border-[#EF4444] bg-[#EF4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
                  }
                }
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleRightClick(item.id)}
                  className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 min-h-[64px] text-left select-none ${cardStyle} ${
                    !isLocked ? 'cursor-pointer active:scale-98' : 'cursor-default'
                  }`}
                >
                  <span className="font-poppins font-semibold text-sm md:text-base text-white break-words flex-1">
                    {item.text}
                  </span>

                  {/* Rozet veya Durum Göstergesi */}
                  {match && (
                    <div className="ml-3 flex items-center gap-1.5 flex-shrink-0">
                      {isSubmitted ? (
                        isCorrectPair ? (
                          <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#EF4444]" />
                        )
                      ) : (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-isler-deep/80 text-white border border-white/20">
                          #{match.colorIdx + 1}
                        </span>
                      )}
                    </div>
                  )}

                  {isSelected && (
                    <span className="ml-2 w-2.5 h-2.5 rounded-full bg-isler-primary animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sonuç Geribildirim Özeti */}
      {isSubmitted && (
        <div className="p-3.5 rounded-xl bg-isler-surface border border-isler-primary/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF7A45]" />
            <span className="text-sm font-poppins font-semibold text-white">
              Eşleştirme Tamamlandı:{' '}
              <span className="font-bold text-[#4ADE80]">
                {matches.filter((m) => m.leftId === m.rightId).length} / {totalCount} Doğru
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
