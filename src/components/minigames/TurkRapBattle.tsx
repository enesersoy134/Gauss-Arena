import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import soundEngine from '../../utils/soundEngine';

export interface TurkRapBattleProps {
  onComplete: () => void;
  onNextSubject?: () => void;
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

export const TurkRapBattle: React.FC<TurkRapBattleProps> = ({ onComplete, onNextSubject }) => {
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
    <div className="flex flex-col gap-4">
      {/* ÜST 3 GÖRSEL GÖSTERGE KARTI */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0F0510] border border-pink-500/30 rounded-2xl p-3 text-center">
          <div className="text-[11px] font-mono text-[#B5CBC8] uppercase">Sahne Turu</div>
          <div className="font-mono font-black text-xl sm:text-2xl text-pink-400 mt-0.5">
            {roundIdx + 1} / 3
          </div>
          <div className="text-[10px] font-mono text-zinc-400">{cur.themeLabel}</div>
        </div>

        <div
          className={`border rounded-2xl p-3 text-center flex flex-col items-center justify-center transition-all ${
            isFinished || isRoundCorrect
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-[#0F0510] border-white/10 text-amber-300'
          }`}
        >
          <div className="text-[11px] font-mono uppercase">Ritim & Anlam Uyumu</div>
          <div className="font-poppins font-black text-sm sm:text-base mt-0.5">
            {isFinished
              ? '🏆 RAP ATIŞMASI KAZANILDI!'
              : isRoundCorrect
              ? '✓ TAM KAFİYE & ANLAM!'
              : '🎤 SIRA SENDE!'}
          </div>
          <div className="text-[10px] font-mono opacity-85">
            {chosenOpt ? chosenOpt.shortReason : 'Alttan doğru kapanış dizesini seç'}
          </div>
        </div>

        <div className="bg-[#0F0510] border border-orange-500/30 rounded-2xl p-3 text-center">
          <div className="text-[11px] font-mono text-[#B5CBC8] uppercase">Aranan Uyak Eki</div>
          <div className="font-mono font-black text-xl sm:text-2xl text-[#F14E13] mt-0.5">
            &ldquo;{cur.rhymeSuffix}&rdquo;
          </div>
          <div className="text-[10px] font-mono text-zinc-400">Ses & Redif Uyumu</div>
        </div>
      </div>

      {/* HİKAYE KARAKTERİ: FESTİVAL JÜRİSİ & SEYİRCİ TEPKİ BALONU */}
      <div
        className={`rounded-2xl border-2 p-3.5 flex items-center gap-3.5 transition-all duration-300 ${
          chosenOpt && !chosenOpt.isCorrect
            ? 'bg-red-950/60 border-red-400 shadow-lg shadow-red-500/20'
            : isRoundCorrect || isFinished
            ? 'bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-500/20'
            : 'bg-[#170B19] border-pink-500/40'
        }`}
      >
        <div
          className={`w-13 h-13 p-2.5 rounded-2xl border-2 flex items-center justify-center text-2xl shrink-0 ${
            chosenOpt && !chosenOpt.isCorrect
              ? 'border-red-400 bg-red-500/20 animate-bounce'
              : isRoundCorrect || isFinished
              ? 'border-emerald-400 bg-emerald-500/20 scale-105'
              : 'border-pink-400/50 bg-pink-500/15'
          }`}
        >
          {chosenOpt && !chosenOpt.isCorrect ? '😬' : isRoundCorrect || isFinished ? '🔥' : '🎭'}
        </div>

        <div className="min-w-0 flex-1 text-xs leading-relaxed">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-poppins font-black text-white">
              Festival Başjürisi Ozan Hoca
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-pink-200">
              Canlı Kültür & Şiir Atışması • Tur {roundIdx + 1}/3
            </span>
          </div>
          <p className="text-white/95 mt-0.5 font-medium">
            {chosenOpt && !chosenOpt.isCorrect ? (
              <span>
                &ldquo;Eyvah! Seyirci buz kesti! Seçtiğin dize hem anlam bütünlüğünü bozdu hem de{' '}
                <strong className="text-amber-300">{cur.rhymeSuffix}</strong> kafiyesini kaçırdı ({chosenOpt.shortReason}). Hemen başka dize dene!&rdquo;
              </span>
            ) : isRoundCorrect || isFinished ? (
              <span>
                &ldquo;Salon ayakta alkışlıyor! Hem <strong className="text-emerald-300">{cur.themeLabel}</strong> ana fikrini tamamladın hem de kusursuz uyak yakaladın ({chosenOpt?.shortReason})!&rdquo;
              </span>
            ) : (
              <span>
                &ldquo;Mikrofon sende! MC Bilgi ilk iki dizeyi söyledi; salonu coşturmak için hem{' '}
                <strong className="text-pink-300">{cur.themeLabel}</strong> anlamını tamamlayan hem de{' '}
                <strong className="text-amber-300">&lsquo;{cur.rhymeSuffix}&rsquo;</strong> uyağıyla biten dizeyi patlat!&rdquo;
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ORTA GÖRSEL RAP DÜELLO SAHNESİ */}
      <div
        className={`rounded-3xl border-2 p-5 sm:p-6 flex flex-col justify-between min-h-[250px] transition-all ${
          isRoundCorrect
            ? 'bg-gradient-to-b from-emerald-950/50 via-[#150A16] to-[#0F0510] border-emerald-400/60'
            : 'bg-gradient-to-b from-[#26112B] via-[#150A16] to-[#0F0510] border-pink-500/35'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-auto">
          {/* SOL: MC BİLGİ KARAKTERİ VE KONUŞMA BALONU */}
          <div className="bg-black/45 border border-orange-500/40 rounded-2xl p-4 flex items-start gap-3.5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F14E13] to-amber-500 flex flex-col items-center justify-center shrink-0 shadow-md">
              <span className="text-2xl">🎧</span>
              <span className="text-[9px] font-mono font-bold text-white">MC BİLGİ</span>
            </div>

            <div className="flex flex-col gap-2 text-xs sm:text-sm font-poppins text-white">
              <div className="leading-relaxed">
                &ldquo;{cur.mcLines[0]}{' '}
                <span className="px-2 py-0.5 rounded-lg bg-[#F14E13]/30 border border-[#F14E13] font-mono font-bold text-amber-200">
                  {cur.highlightWords[0]}
                </span>
              </div>
              <div className="leading-relaxed">
                {cur.mcLines[1]}{' '}
                <span className="px-2 py-0.5 rounded-lg bg-[#F14E13]/30 border border-[#F14E13] font-mono font-bold text-amber-200">
                  {cur.highlightWords[1]}
                </span>
                &rdquo;
              </div>
            </div>
          </div>

          {/* SAĞ: SENİN MİKROFONUN VE KAPANIŞ BALONUN */}
          <div
            className={`rounded-2xl p-4 border-2 flex items-center gap-3.5 min-h-[104px] transition-all ${
              isRoundCorrect
                ? 'border-solid border-emerald-400 bg-emerald-500/20 shadow-lg'
                : chosenOpt && !chosenOpt.isCorrect
                ? 'border-solid border-red-400 bg-red-500/20'
                : 'border-dashed border-amber-400/50 bg-black/35'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center shrink-0 shadow-md">
              <span className="text-2xl">🎤</span>
              <span className="text-[9px] font-mono font-bold text-white">SEN</span>
            </div>

            <div className="flex-1 text-xs sm:text-sm font-poppins">
              {chosenOpt ? (
                <div className="text-white font-semibold leading-relaxed">
                  &ldquo;{chosenOpt.text}{' '}
                  <span
                    className={`px-2 py-0.5 rounded-lg font-mono font-bold border ${
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
                <div className="text-amber-200/80 font-mono text-xs">
                  Alttaki 3 dizeden hem anlamı tamamlayan hem de{' '}
                  <strong className="text-white">&ldquo;{cur.rhymeSuffix}&rdquo;</strong> ile biten dizeye tıkla!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ALTTA 3 GÖRSEL DİZE SEÇENEĞİ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {cur.options.map((opt) => {
            const isSel = selectedId === opt.id;
            const isOk = isSel && opt.isCorrect;
            const isBad = isSel && !opt.isCorrect;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                disabled={isRoundCorrect}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isOk
                    ? 'bg-emerald-500/25 border-emerald-400 text-white scale-[1.02] shadow-lg'
                    : isBad
                    ? 'bg-red-500/20 border-red-400 text-white'
                    : 'bg-[#0F0510] border-white/15 text-[#B5CBC8] hover:border-[#F14E13] hover:text-white hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-bold">
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
      <div className="bg-[#0F0510] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="text-xs font-mono text-[#B5CBC8]">
          {chosenOpt ? chosenOpt.shortReason : `💡 İpucu: Son kelimesi "${cur.rhymeSuffix}" ile uyumlu ve anlamlı dizeyi seç.`}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isRoundCorrect && (
            <button
              onClick={handleNext}
              disabled={isFinished}
              className="btn-primary !py-2 !px-5 text-xs sm:text-sm font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isFinished
                  ? '✓ Tamamlandı!'
                  : roundIdx < ROUNDS.length - 1
                  ? `Sıradaki Tur (${roundIdx + 2}/3) →`
                  : '🎉 Atışmayı Kazan!'}
              </span>
            </button>
          )}

          {isFinished && onNextSubject && (
            <button
              onClick={onNextSubject}
              className="btn-primary !py-2 !px-5 text-xs sm:text-sm font-bold flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-500 shadow-lg shadow-emerald-500/20"
            >
              <span>Sonraki Derse Geç (Biyoloji)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#B5CBC8] hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurkRapBattle;
