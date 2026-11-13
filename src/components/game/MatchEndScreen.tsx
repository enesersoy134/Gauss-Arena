import React, { useEffect, useState } from 'react';
import { PlayerInfo, Question, RoundResult } from '../../types/game';
import { getRecommendationsForTopic, ResourceRecommendation } from '../../utils/resourceRecommendations';
import { Trophy, RotateCcw, Check, X, Flame, Award, TrendingUp, TrendingDown, BookOpen, AlertTriangle } from 'lucide-react';

export interface MatchEndScreenProps {
  player1: PlayerInfo;
  player2: PlayerInfo;
  player1TotalScore: number;
  player2TotalScore: number;
  roundResults: Array<{
    question: Question;
    result: RoundResult;
  }>;
  eloWinDelta: number;
  eloLossDelta: number;
  onRestart: () => void;
}

/**
 * ELO ve Skor animasyonu için yardımcı Hook
 */
function useAnimatedNumber(target: number, initial: number, durationMs: number = 1500) {
  const [current, setCurrent] = useState(initial);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = initial;
    const diff = target - startVal;

    if (diff === 0) {
      setCurrent(target);
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(startVal + diff * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, initial, durationMs]);

  return current;
}

export const MatchEndScreen: React.FC<MatchEndScreenProps> = ({
  player1,
  player2,
  player1TotalScore,
  player2TotalScore,
  roundResults,
  eloWinDelta,
  eloLossDelta,
  onRestart
}) => {
  // Kazanan durumu:
  const isWinner = player1TotalScore > player2TotalScore;
  const isDraw = player1TotalScore === player2TotalScore;
  const isLoser = player1TotalScore < player2TotalScore;

  // ELO Değişimi (küsüratsız tam sayı yuvarlama):
  let eloDelta = 0;
  if (isWinner) eloDelta = Math.round(eloWinDelta);
  else if (isLoser) eloDelta = Math.round(eloLossDelta);

  const initialElo = Math.round(player1.elo);
  const finalElo = Math.max(0, Math.round(initialElo + eloDelta));
  const animatedElo = useAnimatedNumber(finalElo, initialElo, 1400);

  // Yanlış yapılan soruları ayırt et ve konu başlıkları (topic) altında grupla
  const wrongRounds = roundResults.filter(({ result }) => !result.player1Correct);
  const revisionTopicGroups = React.useMemo(() => {
    const map = new Map<
      string,
      {
        topic: string;
        subject: string;
        questions: Question[];
        recommendedResources: ResourceRecommendation[];
      }
    >();
    for (const { question } of wrongRounds) {
      const topicTitle = (question.topic || question.subject || 'Genel Konu').trim();
      const key = `${question.subject.toLowerCase()}__${topicTitle.toLowerCase()}`;
      const existing = map.get(key);
      if (existing) {
        existing.questions.push(question);
      } else {
        map.set(key, {
          topic: topicTitle,
          subject: question.subject,
          questions: [question],
          recommendedResources: getRecommendationsForTopic(question.subject, topicTitle),
        });
      }
    }
    return Array.from(map.values());
  }, [wrongRounds]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-8 animate-fade-in">
      {/* 1. ÜST: ZAFER / BOZGUN / BERABERE BAŞLIĞI */}
      <div className="text-center relative">
        <div className="hero-button-blur -top-12 left-1/2 -translate-x-1/2 opacity-40 pointer-events-none" />

        <div className="relative inline-flex items-center justify-center p-3 mb-3 rounded-full bg-[#1A0E1C] border border-[rgba(241,78,19,0.4)] shadow-xl">
          {isWinner ? (
            <Trophy className="w-12 h-12 text-[#F14E13] fill-[#F14E13]/30 animate-bounce" />
          ) : isDraw ? (
            <Award className="w-12 h-12 text-amber-400" />
          ) : (
            <Award className="w-12 h-12 text-red-500" />
          )}
        </div>

        <h1
          className={`font-poppins font-black text-3xl sm:text-5xl uppercase tracking-wider ${
            isWinner
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F14E13] via-orange-400 to-[#F14E13]'
              : isDraw
              ? 'text-amber-400'
              : 'text-red-500'
          }`}
        >
          {isWinner ? '🏆 ZAFER!' : isDraw ? '🤝 BERABERE!' : '💔 BOZGUN!'}
        </h1>

        <p className="text-sm sm:text-base text-[#B5CBC8] font-sans mt-2">
          {isWinner
            ? 'Muazzam refleksler ve doğru stratejiyle düelloyu kazandın!'
            : isDraw
            ? 'Kora kor bir mücadele! İki taraf da eşit güç sergiledi.'
            : 'Güzel mücadeleydi, sonraki karşılaşmada rövanşı alabilirsin!'}
        </p>
      </div>

      {/* 2. ELO DEĞİŞİM ROZETİ (Animasyonlu Sayma) */}
      <div className="game-card p-5 w-full max-w-md text-center border-orange-500/30">
        <div className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider mb-1">
          Derece & ELO Güncellemesi
        </div>
        <div className="flex items-center justify-center gap-3 my-2">
          <span className="font-mono text-xl text-[#B5CBC8]">{initialElo}</span>
          <span className="text-[#B5CBC8]">➔</span>
          <span className="font-mono text-3xl sm:text-4xl font-black text-white">
            {animatedElo} ELO
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono">
          {eloDelta > 0 ? (
            <span className="text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +{eloDelta} ELO Kazandın
            </span>
          ) : eloDelta < 0 ? (
            <span className="text-red-400 bg-red-500/20 px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> {eloDelta} ELO Kaybettin
            </span>
          ) : (
            <span className="text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full">
              ±0 ELO Değişmedi
            </span>
          )}
        </div>
      </div>

      {/* 3. İKİ OYUNCUNUN FİNAL SKORLARI */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* P1 Final Kartı */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            isWinner
              ? 'bg-[#1A0E1C] border-[#F14E13] shadow-lg shadow-[#F14E13]/25'
              : 'bg-[#1A0E1C] border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={player1.avatarUrl}
              alt={player1.name}
              className="w-14 h-14 rounded-2xl border-2 border-[#F14E13] bg-[#0F0510]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-poppins font-bold text-base text-white">{player1.name}</span>
                <span className="bg-[#F14E13]/20 text-[#F14E13] text-[10px] font-bold px-1.5 py-0.5 rounded">SEN</span>
              </div>
              <div className="text-xs text-amber-400 flex items-center gap-1 mt-1 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {player1.streak} Seri
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#B5CBC8]">Toplam Puan</div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-[#F14E13]">
              {player1TotalScore}
            </div>
          </div>
        </div>

        {/* P2 Final Kartı */}
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            isLoser
              ? 'bg-[#1A0E1C] border-[#3B82F6] shadow-lg shadow-[#3B82F6]/25'
              : 'bg-[#1A0E1C] border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={player2.avatarUrl}
              alt={player2.name}
              className="w-14 h-14 rounded-2xl border-2 border-[#3B82F6] bg-[#0F0510]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-poppins font-bold text-base text-white">{player2.name}</span>
                <span className="bg-[#3B82F6]/20 text-[#3B82F6] text-[10px] font-bold px-1.5 py-0.5 rounded">RAKİP</span>
              </div>
              <div className="text-xs text-blue-400 flex items-center gap-1 mt-1 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-blue-400" /> {player2.streak} Seri
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#B5CBC8]">Toplam Puan</div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-[#3B82F6]">
              {player2TotalScore}
            </div>
          </div>
        </div>
      </div>

      {/* 4. SORU BAZLI SONUÇ TABLOSU */}
      <div className="w-full bg-[#1A0E1C] border border-[rgba(241,78,19,0.25)] rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-[#0F0510] px-5 py-3 border-b border-[rgba(241,78,19,0.2)] flex items-center justify-between">
          <span className="font-poppins font-bold text-xs uppercase tracking-wider text-white">
            Raunt & Soru Dökümü
          </span>
          <span className="text-xs text-[#B5CBC8] font-mono">
            Toplam {roundResults.length} Soru
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {roundResults.map(({ question, result }, index) => (
            <div
              key={question.id}
              className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[#2A1A2C]/40 transition-colors"
            >
              {/* Sol: Soru Bilgisi */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#F14E13]">#{index + 1}</span>
                  <span className="text-xs text-[#B5CBC8] uppercase font-semibold">{question.subject}</span>
                </div>
                <div className="text-sm font-medium text-white truncate max-w-sm sm:max-w-md mt-0.5">
                  {question.topic}
                </div>
              </div>

              {/* Sağ: İki Oyuncunun Raunt Performansı */}
              <div className="flex items-center gap-4 sm:gap-8 shrink-0 font-mono text-xs">
                {/* P1 Sonucu */}
                <div className="flex items-center gap-2 min-w-[90px] justify-end">
                  <span className={result.player1Correct ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                    +{result.player1Points}
                  </span>
                  {result.player1Correct ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* P2 Sonucu */}
                <div className="flex items-center gap-2 min-w-[90px] justify-end">
                  <span className={result.player2Correct ? 'text-blue-400 font-bold' : 'text-zinc-500'}>
                    +{result.player2Points}
                  </span>
                  {result.player2Correct ? (
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                      <X className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. REVİZE EDİLMESİ GEREKEN KONULAR (PEKİŞTİRİLEMEYEN BAŞLIKLAR) */}
      <div className="w-full bg-[#1A0E1C] border border-amber-500/35 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-[#0F0510] px-5 py-3.5 border-b border-amber-500/20 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="font-poppins font-bold text-xs sm:text-sm uppercase tracking-wider text-white">
              Revize Edilmesi Gereken Konular (Pekiştirilemeyen Başlıklar)
            </span>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {revisionTopicGroups.length} Konu Başlığı • {wrongRounds.length} Yanlış Soru
          </span>
        </div>

        {revisionTopicGroups.length === 0 ? (
          <div className="p-5 text-center text-xs sm:text-sm text-emerald-300 bg-emerald-500/5 font-medium">
            🎉 Tebrikler! Bu karşılaşmadaki tüm soruları doğru yanıtladın; revize edilmesi gereken eksik konu başlığın bulunmuyor.
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-4">
            {/* Hızlı Konu Başlığı Etiketleri */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#B5CBC8] mb-2">
                Pekiştirilmesi Gereken Konu Başlıkları:
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {revisionTopicGroups.map((group) => (
                  <span
                    key={`${group.subject}-${group.topic}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-poppins font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/35"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#F14E13]" />
                    <span className="uppercase text-[10px] font-mono text-[#F14E13]">{group.subject}:</span>
                    <span>{group.topic}</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-black/40 font-mono text-[10px] text-amber-200">
                      {group.questions.length} Soru
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Konu Başlığı Altında Yanlış Yapılan Soruların Detayı */}
            <div className="grid grid-cols-1 gap-3">
              {revisionTopicGroups.map((group) => (
                <div
                  key={`${group.subject}-${group.topic}-detail`}
                  className="rounded-xl bg-[#0F0510] border border-white/10 p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F14E13]/20 text-[#F14E13] border border-[#F14E13]/30">
                        {group.subject}
                      </span>
                      <h4 className="font-poppins font-bold text-sm text-amber-300">
                        {group.topic}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-red-400">
                      {group.questions.length} Yanlış
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {group.questions.map((q) => (
                      <div
                        key={q.id}
                        className="text-xs bg-[#1A0E1C]/80 rounded-lg p-3 border border-red-500/20 flex flex-col gap-1"
                      >
                        <div className="text-white font-medium leading-relaxed">
                          <span className="text-red-400 font-mono font-bold mr-1.5">✗ Soru:</span>
                          {q.prompt}
                        </div>
                        {q.explanation && (
                          <div className="text-[#B5CBC8] text-[11px] leading-relaxed mt-1 pt-1 border-t border-white/5">
                            <span className="text-emerald-400 font-semibold mr-1">💡 Çözüm Notu:</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bu Konu İçin Kaynak Önerileri (kaynak-onerileri.json) */}
                  {group.recommendedResources && group.recommendedResources.length > 0 && (
                    <div className="mt-1 pt-2.5 border-t border-amber-500/20 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-[#F14E13]" />
                        <span>Önerilen Kaynak & Çalışma Rehberi:</span>
                      </div>
                      {group.recommendedResources.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3 rounded-lg bg-[#1A0E1C] border border-[#F14E13]/30 text-xs flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-poppins font-bold text-white">{rec.bookTitle}</span>
                            <span className="px-2 py-0.5 rounded bg-[#F14E13]/20 text-[#F14E13] font-mono text-[10px] font-semibold">
                              {rec.publisher} • {rec.level}
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-200/90 font-medium">
                            📖 Bölüm: {rec.recommendedSection}
                          </div>
                          <div className="text-[11px] text-[#B5CBC8] leading-relaxed">
                            🎯 Tavsiye: {rec.studyTip}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. TEKRAR OYNA BUTONU */}
      <button
        onClick={onRestart}
        className="btn-primary py-3.5 px-8 text-base font-bold shadow-xl shadow-[#F14E13]/40 flex items-center gap-2.5"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Tekrar Oyna / Yeni Karşılaşma</span>
      </button>
    </div>
  );
};

export default MatchEndScreen;
