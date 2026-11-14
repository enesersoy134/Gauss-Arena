import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import soundEngine from '../../utils/soundEngine';

export interface TurkRapBattleProps {
  onComplete: () => void;
  onNextSubject?: () => void;
  nextSubjectName?: string;
}

interface RapStageRound {
  round: number;
  rhymeSuffix: string;
  themeLabel: string;
  mcLines: [string, string];
  highlightWords: [string, string];
  options: {
    id: string;
    icon: string;
    text: string;
    rhymeWord: string;
    isCorrect: boolean;
    shortReason: string;
  }[];
}

const ROUNDS: RapStageRound[] = [
  {
    round: 1,
    rhymeSuffix: '-rına',
    themeLabel: 'Bilgi & Emek',
    mcLines: [
      'Kelimeler köprüdür, düşünceyi taşır',
      'Sabırla arayanlar ulaşır hakikatin',
    ],
    highlightWords: ['yarına,', 'sırrına...'],
    options: [
      {
        id: '1a',
        icon: '💤',
        text: 'Hiç çalışmadan da çıkılır en yüksek',
        rhymeWord: 'doruklara.',
        isCorrect: false,
        shortReason: '⚠️ "Sabırla aramak" düşüncesiyle çelişti!',
      },
      {
        id: '1b',
        icon: '☀️',
        text: 'Bilgiyle aydınlanır gece, güneş doğar',
        rhymeWord: 'bağrına!',
        isCorrect: true,
        shortReason: '🎉 Tam Uyak ("yarına - sırrına - bağrına") ve anlam bütünlüğü!',
      },
      {
        id: '1c',
        icon: '🥪',
        text: 'Zil çalınca koşa koşa indik okul',
        rhymeWord: 'kantinine.',
        isCorrect: false,
        shortReason: '⚠️ Hem konu dışı hem de "-rına" kafiyesine uymuyor!',
      },
    ],
  },
  {
    round: 2,
    rhymeSuffix: '-la',
    themeLabel: 'Nezaket & Tatlı Dil',
    mcLines: [
      'En güçlü sözdür söylenen tatlı bir',
      'Fırtına kopsa da kökleri sağlam çınar',
    ],
    highlightWords: ['edayla,', 'tutunur toprağıyla...'],
    options: [
      {
        id: '2a',
        icon: '🌿',
        text: 'Kırılmaz dalları, dimdik durur',
        rhymeWord: 'saygıyla!',
        isCorrect: true,
        shortReason: '🎉 Çınar metaforu ve "edayla - toprağıyla - saygıyla" uyumu harika!',
      },
      {
        id: '2b',
        icon: '📢',
        text: 'En çok bağıran haklı çıkar her',
        rhymeWord: 'kavgada.',
        isCorrect: false,
        shortReason: '⚠️ "Tatlı dil ve nezaket" ana fikrine tamamen zıt!',
      },
      {
        id: '2c',
        icon: '🍂',
        text: 'Yapraklar sararır sonbahar',
        rhymeWord: 'aylarında.',
        isCorrect: false,
        shortReason: '⚠️ Mecaz anlamdan kopup mevsim bilgisine geçti!',
      },
    ],
  },
  {
    round: 3,
    rhymeSuffix: '-an',
    themeLabel: 'Sanat & Toplum',
    mcLines: [
      'Sanat bir aynadır toplumun ruhunu',
      'Kültürle yoğrulmuş eserdir zamana',
    ],
    highlightWords: ['yansıtan,', 'dayanan...'],
    options: [
      {
        id: '3a',
        icon: '🎨',
        text: 'Sadece pahalı boyadır tabloyu güzel',
        rhymeWord: 'kılan.',
        isCorrect: false,
        shortReason: '⚠️ Sanatın kültür ve toplumla bağını yok saydı!',
      },
      {
        id: '3b',
        icon: '📺',
        text: 'Akşam televizyonda güzel bir maç',
        rhymeWord: 'başladı.',
        isCorrect: false,
        shortReason: '⚠️ Konu dışı ve "-an" kafiyesini bozdu!',
      },
      {
        id: '3c',
        icon: '🏛️',
        text: 'Kalıcı olamaz hiçbir zaman halktan kopuk',
        rhymeWord: 'yaşayan!',
        isCorrect: true,
        shortReason: '🏆 Muhteşem final! ("yansıtan - dayanan - yaşayan")',
      },
    ],
  },
];

export const TurkRapBattle: React.FC<TurkRapBattleProps> = ({
  onComplete,
  onNextSubject,
  nextSubjectName,
}) => {
  const [roundIdx, setRoundIdx] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const cur = ROUNDS[roundIdx];
  const chosenOpt = cur.options.find((o) => o.id === selectedId) || null;
  const isRoundCorrect = Boolean(chosenOpt?.isCorrect);

  const handleSelect = (opt: RapStageRound['options'][0]) => {
    if (isRoundCorrect || isFinished) return;
    setSelectedId(opt.id);
    if (opt.isCorrect) {
      soundEngine.playCorrect();
    } else {
      soundEngine.playWrong();
    }
  };

  const handleNext = () => {
    if (!isRoundCorrect) return;
    if (roundIdx < ROUNDS.length - 1) {
      setRoundIdx((r) => r + 1);
      setSelectedId(null);
    } else {
      setIsFinished(true);
      onComplete();
    }
  };

  const handleReset = () => {
    setRoundIdx(0);
    setSelectedId(null);
    setIsFinished(false);
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5">
      {/* ÜST 3 GÖRSEL GÖSTERGE KARTI */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        <div className="bg-[#0F0510] border border-pink-500/30 rounded-xl p-2 sm:p-2.5 text-center">
          <div className="text-[10px] font-mono text-[#B5CBC8] uppercase">Sahne Turu</div>
          <div className="font-mono font-black text-lg sm:text-xl text-pink-400 mt-0.5">
            {roundIdx + 1} / 3
          </div>
          <div className="text-[9px] font-mono text-zinc-400 truncate">{cur.themeLabel}</div>
        </div>

        <div
          className={`border rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-center transition-all ${
            isFinished || isRoundCorrect
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-[#0F0510] border-white/10 text-amber-300'
          }`}
        >
          <div className="text-[10px] font-mono uppercase">Ritim & Anlam</div>
          <div className="font-poppins font-black text-xs sm:text-sm mt-0.5">
            {isFinished
              ? '🏆 ATIŞMA KAZANILDI!'
              : isRoundCorrect
              ? '✓ TAM KAFİYE & ANLAM!'
              : '🎤 SIRA SENDE!'}
          </div>
          <div className="text-[9px] font-mono opacity-85 truncate">
            {chosenOpt ? chosenOpt.shortReason : 'Doğru kapanış dizesini seç'}
          </div>
        </div>

        <div className="bg-[#0F0510] border border-orange-500/30 rounded-xl p-2 sm:p-2.5 text-center">
          <div className="text-[10px] font-mono text-[#B5CBC8] uppercase">Uyak Eki</div>
          <div className="font-mono font-black text-lg sm:text-xl text-[#F14E13] mt-0.5">
            &ldquo;{cur.rhymeSuffix}&rdquo;
          </div>
          <div className="text-[9px] font-mono text-zinc-400">Ses & Redif</div>
        </div>
      </div>

      {/* =====================================================================
       * VURGULU GÖREV SENARYOSU & FESTİVAL JÜRİ BRİFİNGİ (RAP DÜELLOSU)
       * Ekranda anında fark edilecek, yüksek kontrastlı ve neon fuşya/amber vurgulu kart
       * ===================================================================== */}
      <div
        className={`rounded-xl sm:rounded-2xl border-2 p-2.5 sm:p-3 transition-all duration-300 relative overflow-hidden shadow-lg ${
          chosenOpt && !chosenOpt.isCorrect
            ? 'bg-gradient-to-r from-red-950/85 via-[#1E0D1A] to-[#120815] border-red-400 ring-1 ring-red-400/40 shadow-red-500/25'
            : isRoundCorrect || isFinished
            ? 'bg-gradient-to-r from-emerald-950/85 via-[#101E1C] to-[#0A1215] border-emerald-400 ring-1 ring-emerald-400/40 shadow-emerald-500/25'
            : 'bg-gradient-to-r from-fuchsia-950/80 via-[#1A0E1C] to-purple-950/70 border-fuchsia-500/80 ring-1 ring-fuchsia-400/40 shadow-fuchsia-500/25'
        }`}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            {/* Karakter Avatarı & Canlı Halka */}
            <div className="relative shrink-0">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center text-2xl shadow-md transition-transform duration-300 ${
                  chosenOpt && !chosenOpt.isCorrect
                    ? 'border-red-400 bg-red-500/25 animate-bounce'
                    : isRoundCorrect || isFinished
                    ? 'border-emerald-400 bg-emerald-500/25 scale-105 shadow-emerald-500/30'
                    : 'border-fuchsia-400 bg-fuchsia-500/20'
                }`}
              >
                {chosenOpt && !chosenOpt.isCorrect ? '😬' : isRoundCorrect || isFinished ? '🔥' : '🎭'}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-fuchsia-500 border border-black text-[8px] font-bold text-white items-center justify-center">🎤</span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-poppins font-black text-[10px] tracking-wide uppercase shadow-sm flex items-center gap-1">
                  🎤 RAP ATIŞMASI
                </span>
                <span className="text-[10px] font-mono font-bold text-fuchsia-200 bg-fuchsia-500/25 px-2 py-0.5 rounded-md border border-fuchsia-400/50">
                  Ozan Hoca • Tur {roundIdx + 1}/3
                </span>
                <span className="text-[10px] font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded-md border border-white/10">
                  Tema: <strong className="text-pink-300">{cur.themeLabel}</strong> • Uyak: <strong className="text-amber-300">&ldquo;{cur.rhymeSuffix}&rdquo;</strong>
                </span>
              </div>

              <p className="text-xs text-white font-medium leading-tight">
                {chosenOpt && !chosenOpt.isCorrect ? (
                  <span>
                    &ldquo;Dize hem anlamı bozdu hem de{' '}
                    <strong className="text-amber-300">{cur.rhymeSuffix}</strong> uyağını kaçırdı ({chosenOpt.shortReason}). Başka dize dene!&rdquo;
                  </span>
                ) : isRoundCorrect || isFinished ? (
                  <span>
                    &ldquo;Tebrikler! Hem <strong className="text-emerald-300">{cur.themeLabel}</strong> anlamını tamamladın hem de uyak yakaladın!&rdquo;
                  </span>
                ) : (
                  <span>
                    &ldquo;Hem <strong className="text-pink-300">{cur.themeLabel}</strong> anlamını tamamlayan hem de{' '}
                    <strong className="text-amber-300">&lsquo;{cur.rhymeSuffix}&rsquo;</strong> uyağıyla biten dizeyi seç!&rdquo;
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Aksiyon Hedef Rozeti */}
          <div className="shrink-0 bg-black/50 border border-fuchsia-500/40 rounded-xl px-2.5 py-1.5 flex flex-col items-center sm:items-end justify-center self-stretch sm:self-auto min-w-[150px] shadow-inner">
            <div className="text-[9px] font-mono uppercase text-fuchsia-300 font-black flex items-center gap-1">
              <span>🎯 NE YAPMALISIN?</span>
            </div>
            <div className="text-[11px] font-mono font-black text-white text-center sm:text-right mt-0.5">
              {isFinished ? (
                <span className="text-emerald-400 font-bold">✓ Düello Kazanıldı!</span>
              ) : isRoundCorrect ? (
                <span className="text-emerald-300 font-bold">✓ Tur Başarılı</span>
              ) : (
                <span className="text-amber-200">Tur {roundIdx + 1}/3 • Sıra Sende</span>
              )}
            </div>
            <div className="text-[9px] text-zinc-300 text-center sm:text-right mt-0.5 font-mono">
              Doğru kapanış dizesini seç
            </div>
          </div>
        </div>
      </div>

      {/* ORTA GÖRSEL RAP DÜELLO SAHNESİ */}
      <div
        className={`rounded-2xl sm:rounded-3xl border-2 p-3 sm:p-4 flex flex-col justify-between min-h-[185px] sm:min-h-[205px] transition-all ${
          isRoundCorrect
            ? 'bg-gradient-to-b from-emerald-950/50 via-[#150A16] to-[#0F0510] border-emerald-400/60'
            : 'bg-gradient-to-b from-[#26112B] via-[#150A16] to-[#0F0510] border-pink-500/35'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 items-center my-auto">
          {/* SOL: MC BİLGİ KARAKTERİ VE KONUŞMA BALONU */}
          <div className="bg-black/45 border border-orange-500/40 rounded-xl p-2.5 sm:p-3 flex items-start gap-2.5 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F14E13] to-amber-500 flex flex-col items-center justify-center shrink-0 shadow-sm">
              <span className="text-lg">🎧</span>
              <span className="text-[8px] font-mono font-bold text-white">MC BİLGİ</span>
            </div>

            <div className="flex flex-col gap-1 text-xs sm:text-sm font-poppins text-white">
              <div className="leading-snug">
                &ldquo;{cur.mcLines[0]}{' '}
                <span className="px-1.5 py-0.2 rounded bg-[#F14E13]/30 border border-[#F14E13] font-mono font-bold text-amber-200">
                  {cur.highlightWords[0]}
                </span>
              </div>
              <div className="leading-snug">
                {cur.mcLines[1]}{' '}
                <span className="px-1.5 py-0.2 rounded bg-[#F14E13]/30 border border-[#F14E13] font-mono font-bold text-amber-200">
                  {cur.highlightWords[1]}
                </span>
                &rdquo;
              </div>
            </div>
          </div>

          {/* SAĞ: SENİN MİKROFONUN VE KAPANIŞ BALONUN */}
          <div
            className={`rounded-xl p-2.5 sm:p-3 border-2 flex items-center gap-2.5 min-h-[72px] sm:min-h-[80px] transition-all ${
              isRoundCorrect
                ? 'border-solid border-emerald-400 bg-emerald-500/20 shadow-md'
                : chosenOpt && !chosenOpt.isCorrect
                ? 'border-solid border-red-400 bg-red-500/20'
                : 'border-dashed border-amber-400/50 bg-black/35'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center shrink-0 shadow-sm">
              <span className="text-lg">🎤</span>
              <span className="text-[8px] font-mono font-bold text-white">SEN</span>
            </div>

            <div className="flex-1 text-xs font-poppins">
              {chosenOpt ? (
                <div className="text-white font-semibold leading-snug">
                  &ldquo;{chosenOpt.text}{' '}
                  <span
                    className={`px-1.5 py-0.2 rounded font-mono font-bold border ${
                      chosenOpt.isCorrect
                        ? 'bg-emerald-500/40 border-emerald-300 text-emerald-100'
                        : 'bg-red-500/40 border-red-300 text-red-100'
                    }`}
                  >
                    {chosenOpt.rhymeWord}
                  </span>
                  &rdquo;
                </div>
              ) : (
                <div className="text-amber-200/80 font-mono text-[11px]">
                  Alttan hem anlamı tamamlayan hem de{' '}
                  <strong className="text-white">&ldquo;{cur.rhymeSuffix}&rdquo;</strong> ile biten dizeye tıkla!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ALTTA 3 GÖRSEL DİZE SEÇENEĞİ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2.5">
          {cur.options.map((opt) => {
            const isSel = selectedId === opt.id;
            const isOk = isSel && opt.isCorrect;
            const isBad = isSel && !opt.isCorrect;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                disabled={isRoundCorrect}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isOk
                    ? 'bg-emerald-500/25 border-emerald-400 text-white scale-[1.01] shadow-md'
                    : isBad
                    ? 'bg-red-500/20 border-red-400 text-white'
                    : 'bg-[#0F0510] border-white/15 text-[#B5CBC8] hover:border-[#F14E13] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{opt.icon}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-amber-300 font-bold">
                    ...{opt.rhymeWord}
                  </span>
                </div>
                <div className="text-xs font-poppins font-semibold leading-snug text-white">
                  &ldquo;{opt.text} <span className="text-amber-300 underline">{opt.rhymeWord}</span>&rdquo;
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ALT GEÇİŞ & SIFIRLAMA BARI */}
      <div className="bg-[#0F0510] border border-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5">
        <div className="text-[11px] font-mono text-[#B5CBC8] truncate">
          {chosenOpt ? chosenOpt.shortReason : `💡 İpucu: "${cur.rhymeSuffix}" ile uyumlu ve anlamlı dizeyi seç.`}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isRoundCorrect && (
            <button
              onClick={handleNext}
              disabled={isFinished}
              className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1 !bg-emerald-600 hover:!bg-emerald-500 shadow-md"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {isFinished
                  ? 'Tamamlandı!'
                  : roundIdx < ROUNDS.length - 1
                  ? `Sıradaki Tur (${roundIdx + 2}/3)`
                  : 'Atışmayı Kazan!'}
              </span>
            </button>
          )}

          {isFinished && onNextSubject && (
            <button
              onClick={onNextSubject}
              className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1 !bg-emerald-600 hover:!bg-emerald-500 shadow-md shadow-emerald-500/20"
            >
              <span>
                {nextSubjectName === 'Çıkış'
                  ? 'Tamamla & Çıkış'
                  : nextSubjectName
                  ? `Sonraki (${nextSubjectName})`
                  : 'Sonraki Ders'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurkRapBattle;
