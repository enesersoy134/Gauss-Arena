import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, MessageCircle, BookOpen } from 'lucide-react';
import soundEngine from '../../utils/soundEngine';

export interface TurkRapBattleProps {
  onComplete: () => void;
  onNextSubject?: () => void;
  nextSubjectName?: string;
}

interface DialogueOption {
  id: string;
  playerText: string;
  isCorrect: boolean;
  npcReaction: string;
  wordMeaningNote?: string;
}

interface DialogueStep {
  step: number;
  targetWord: string;
  wordDictionaryMeaning: string;
  npcPromptBefore: string;
  npcPromptAfter: string;
  options: DialogueOption[];
}

interface ChatLogEntry {
  id: string;
  sender: 'npc' | 'player';
  text: string;
  highlightWord?: string;
  tone?: 'normal' | 'wrong' | 'correct' | 'walkaway';
  wordNote?: string;
}

const DIALOGUE_STEPS: DialogueStep[] = [
  {
    step: 1,
    targetWord: 'yeknesak',
    wordDictionaryMeaning: 'Yeknesak: Tekdüze, monoton, hiçbir değişiklik göstermeyen, sıradan.',
    npcPromptBefore:
      'Hoş geldin evladım, buyur tabureye soluklan. Bugünlerde sahaflar çarşısına gelenler hep ',
    npcPromptAfter:
      'romanlar soruyor; oysa insan ruhu bunlarla doyar mı?',
    options: [
      {
        id: '1a',
        playerText:
          'Şunu kastettiniz sanırım: Okurlar hep çok kalın ve ağır dilli romanlar arıyor. Peki sizce ince kitaplar daha mı çok okunmalı?',
        isCorrect: false,
        npcReaction:
          'Yok yahu, sayfa sayısıyla ne alakası var! Bir daha düşün bakalım...',
      },
      {
        id: '1b',
        playerText:
          'Şunu kastettiniz sanırım: Herkes birbirine benzeyen, tekdüze kitaplar okuyor. Peki sizin tezgâhta bu sıradanlığı kıracak farklı bir eser var mı?',
        isCorrect: true,
        npcReaction:
          'Hah, ağzına sağlık! Tam da bunu kastettim; tekdüzelikten sıyrılmak şart! Olmaz mı hiç, bak tam arkandaki rafta genç bir şairin defteri duruyor...',
        wordMeaningNote: 'Yeknesak = Tekdüze, monoton, sıradan.',
      },
      {
        id: '1c',
        playerText:
          'Şunu kastettiniz sanırım: Gelenler sadece yabancı yazarların kitaplarını soruyor. Yerli yazarlarımızı kimse okumuyor mu artık?',
        isCorrect: false,
        npcReaction:
          'Yok canım, yerlisi yabancısı mesele değil! "Yeknesak" dedim yahu!',
      },
    ],
  },
  {
    step: 2,
    targetWord: 'beyhude',
    wordDictionaryMeaning: 'Beyhude: Boşuna, yararsız, sonuçsuz, nafile.',
    npcPromptBefore:
      'İşte o raftaki defterin sahibi geçen gün dükkâna uğradı. Kelimelerin derinliğini hiç araştırmadan, sözlük karıştırmadan kalıcı bir şiir yazmaya çabalıyor... Dedim ki; evladım bu yaptığın',
    npcPromptAfter: 'bir gayrettir!',
    options: [
      {
        id: '2a',
        playerText:
          'Şunu kastettiniz sanırım: Sözcükleri tanımadan yapılan bu çaba tamamen boşuna ve sonuçsuz kalır. Peki o genç şair bu uyarınıza ne tepki verdi?',
        isCorrect: true,
        npcReaction:
          'Aynen öyle azizim! Beyhude, yani boşuna uğraş... Ne yapsın, önce biraz bozuldu ama çayını içince hak verdi. Gerçi kabahat sadece onda da değil, devrin alışkanlığında...',
        wordMeaningNote: 'Beyhude = Boşuna, nafile, yararsız.',
      },
      {
        id: '2b',
        playerText:
          'Şunu kastettiniz sanırım: Genç şair çok cesur ve takdire değer bir işe girişmiş. Şiirlerini ne zaman bastıracakmış?',
        isCorrect: false,
        npcReaction:
          'Yok yahu, ne takdir etmesi! Tam aksine "beyhude" dedim!',
      },
      {
        id: '2c',
        playerText:
          'Şunu kastettiniz sanırım: Şiir kitabı bastırmak bu devirde çok masraflı bir uğraş. Matbaa ücretleri o kadar arttı mı?',
        isCorrect: false,
        npcReaction:
          'Aman evladım, parayla matbaayla ne ilgisi var şimdi bunun? "Beyhude" diyorum, beyhude!',
      },
    ],
  },
  {
    step: 3,
    targetWord: 'kanıksamış',
    wordDictionaryMeaning: 'Kanıksamak: Çok tekrarlanmaktan ötürü etkilenmez olmak, alışmak, duyarsızlaşmak.',
    npcPromptBefore:
      'Beni asıl üzen ne biliyor musun? İnsanların dilimizdeki bu savrukluğu ve anlatım bozukluklarını artık iyice',
    npcPromptAfter: 'olması.',
    options: [
      {
        id: '3a',
        playerText:
          'Şunu kastettiniz sanırım: İnsanlar en ufak bir dil yanlışını bile hemen sertçe eleştiriyor. Sizce biraz daha hoşgörülü mü olmalıyız?',
        isCorrect: false,
        npcReaction:
          'Yok yahu, keşke eleştirseler! "Kanıksamışlar" dedim!',
      },
      {
        id: '3b',
        playerText:
          'Şunu kastettiniz sanırım: İnsanlar bu yanlış kelimeleri bilerek ve özenerek icat ediyor. Yeni kuşak kendi dilini mi kuruyor?',
        isCorrect: false,
        npcReaction:
          'Yok be evladım, icat etmek değil mesele!',
      },
      {
        id: '3c',
        playerText:
          'Şunu kastettiniz sanırım: Çok sık karşılaşıldığı için bu yanlışlara artık alışıldı ve kimse tepki göstermiyor. Peki bu duyarsızlığı kırmak için nereden başlamalıyız?',
        isCorrect: true,
        npcReaction:
          'Yaşa be evladım! Kanıksamak tam olarak budur; yanlışa alışıp duyarsızlaşmak... Nereden mi başlamalı? Tabii ki senin gibi meraklı gençlerin doğru eserlerle buluşmasından!',
        wordMeaningNote: 'Kanıksamak = Çok tekrardan dolayı alışmak, duyarsızlaşmak.',
      },
    ],
  },
  {
    step: 4,
    targetWord: 'müstesna',
    wordDictionaryMeaning: 'Müstesna: Benzerlerinden ayrı, kural dışı, seçkin, özel.',
    npcPromptBefore:
      'Doğrusu senin gibi kelimelerin inceliğine kulak veren ve sohbeti böyle güzel açan gençleri görünce içim ferahlıyor. Sen bu devirde pek',
    npcPromptAfter: 'bir okursun; şu özel ciltli sözlüğü sana hediye etmek isterim!',
    options: [
      {
        id: '4a',
        playerText:
          'Şunu kastettiniz sanırım: Benim çok aceleci ve sabırsız bir okur olduğumu düşünüyorsunuz. Sözlüğü hemen okuyup geri mi getireyim?',
        isCorrect: false,
        npcReaction:
          'Yok yahu, sana o kadar iltifat ediyorum, sen aceleci diyorsun! "Müstesna" dedim evladım, bir daha düşün!',
      },
      {
        id: '4b',
        playerText:
          'Şunu kastettiniz sanırım: Benim alışılmışın dışında, seçkin ve özel bir okur olduğumu söyleyerek iltifat ettiniz. Bu kıymetli hediyenizi mutlulukla kabul ederim, çay için de çok teşekkürler!',
        isCorrect: true,
        npcReaction:
          'Maşallah, bin yaşa! Müstesna yani benzerlerinden ayrı, seçkin ve özel! Seninle sohbet etmek büyük keyifti, sözlük helali hoş olsun; yolun her daim açık olsun!',
        wordMeaningNote: 'Müstesna = Benzerlerinden ayrı, seçkin, özel.',
      },
      {
        id: '4c',
        playerText:
          'Şunu kastettiniz sanırım: Kitap okumaya yeni başlayan acemi biri olduğum için bana temel bir sözlük veriyorsunuz. İlk hangi sayfadan başlayayım?',
        isCorrect: false,
        npcReaction:
          'Yok canım, ne acemisi! Sabahtan beri ne güzel sohbet ediyoruz, "müstesna" diyerek seni diğerlerinden ayrı bir yere koydum!',
      },
    ],
  },
];

const MAX_WRONG_LIMIT = 3;

export const TurkRapBattle: React.FC<TurkRapBattleProps> = ({
  onComplete,
  onNextSubject,
  nextSubjectName,
}) => {
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [triedOptionIds, setTriedOptionIds] = useState<string[]>([]);
  const [isStepCompleted, setIsStepCompleted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isWalkedAway, setIsWalkedAway] = useState<boolean>(false);
  const [learnedWords, setLearnedWords] = useState<{ word: string; meaning: string }[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatLogEntry[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const curStep = DIALOGUE_STEPS[stepIdx];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [chatHistory, stepIdx, isWalkedAway, isFinished]);

  const handleSelectOption = (opt: DialogueOption) => {
    if (isStepCompleted || isFinished || isWalkedAway || triedOptionIds.includes(opt.id)) return;

    setTriedOptionIds((prev) => [...prev, opt.id]);

    const playerMsg: ChatLogEntry = {
      id: `p-${stepIdx}-${opt.id}`,
      sender: 'player',
      text: opt.playerText,
      tone: opt.isCorrect ? 'correct' : 'wrong',
    };

    if (opt.isCorrect) {
      soundEngine.playCorrect();
      const npcReply: ChatLogEntry = {
        id: `npc-ok-${stepIdx}-${opt.id}`,
        sender: 'npc',
        text: opt.npcReaction,
        tone: 'correct',
        wordNote: opt.wordMeaningNote,
      };
      setChatHistory((prev) => [...prev, playerMsg, npcReply]);
      setLearnedWords((prev) =>
        prev.some((w) => w.word === curStep.targetWord)
          ? prev
          : [...prev, { word: curStep.targetWord, meaning: curStep.wordDictionaryMeaning }]
      );

      if (stepIdx < DIALOGUE_STEPS.length - 1) {
        setIsStepCompleted(true);
      } else {
        setIsStepCompleted(true);
        setIsFinished(true);
        onComplete();
      }
    } else {
      soundEngine.playWrong();
      const nextWrong = wrongCount + 1;
      setWrongCount(nextWrong);

      if (nextWrong >= MAX_WRONG_LIMIT) {
        const walkAwayMsg: ChatLogEntry = {
          id: `npc-walkaway-${stepIdx}`,
          sender: 'npc',
          text: 'Peki... Anlaşılan bugün aynı dili konuşamıyoruz evladım. Neyse, ben yoluma devam edeyim, haydi sağlıcakla kal!',
          tone: 'walkaway',
        };
        setChatHistory((prev) => [...prev, playerMsg, walkAwayMsg]);
        setIsWalkedAway(true);
      } else {
        const npcWrongReply: ChatLogEntry = {
          id: `npc-bad-${stepIdx}-${opt.id}`,
          sender: 'npc',
          text: opt.npcReaction,
          tone: 'wrong',
        };
        setChatHistory((prev) => [...prev, playerMsg, npcWrongReply]);
      }
    }
  };

  const handleAdvanceStep = () => {
    if (!isStepCompleted || isFinished || isWalkedAway) return;
    soundEngine.playClick();
    setStepIdx((prev) => prev + 1);
    setTriedOptionIds([]);
    setIsStepCompleted(false);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setStepIdx(0);
    setWrongCount(0);
    setTriedOptionIds([]);
    setIsStepCompleted(false);
    setIsFinished(false);
    setIsWalkedAway(false);
    setLearnedWords([]);
    setChatHistory([]);
  };

  const remainingPatience = Math.max(0, MAX_WRONG_LIMIT - wrongCount);

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5">
      {/* ÜST 3 GÖRSEL GÖSTERGE KARTI */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        <div className="bg-[#0F0510] border border-amber-500/30 rounded-xl p-2 sm:p-2.5 text-center">
          <div className="text-[10px] font-mono text-[#B5CBC8] uppercase">Sohbet Adımı</div>
          <div className="font-mono font-black text-lg sm:text-xl text-amber-400 mt-0.5">
            {stepIdx + 1} / {DIALOGUE_STEPS.length}
          </div>
          <div className="text-[9px] font-mono text-zinc-400 truncate">
            Kelime: &ldquo;{curStep.targetWord}&rdquo;
          </div>
        </div>

        <div
          className={`border rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-center transition-all ${
            isWalkedAway
              ? 'bg-red-500/20 border-red-500 text-red-300'
              : isFinished
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : isStepCompleted
              ? 'bg-emerald-500/15 border-emerald-400/60 text-emerald-200'
              : 'bg-[#0F0510] border-white/10 text-amber-300'
          }`}
        >
          <div className="text-[10px] font-mono uppercase">Diyalog Durumu</div>
          <div className="font-poppins font-black text-xs sm:text-sm mt-0.5">
            {isWalkedAway
              ? '🚶‍♂️ "PEKİ" DEYİP GİTTİ!'
              : isFinished
              ? '🎉 SOHBET TAMAMLANDI!'
              : isStepCompleted
              ? '✓ SOHBET AKIYOR!'
              : '💬 "ŞUNU KASTETTİNİZ SANIRIM..."'}
          </div>
          <div className="text-[9px] font-mono opacity-85 truncate">
            {isWalkedAway
              ? '3 kez yanlış anladığın için sohbet bitti'
              : isStepCompleted
              ? curStep.wordDictionaryMeaning
              : 'Kelimeyi doğru yorumla ve sohbeti ilerlet'}
          </div>
        </div>

        <div className="bg-[#0F0510] border border-orange-500/30 rounded-xl p-2 sm:p-2.5 text-center">
          <div className="text-[10px] font-mono text-[#B5CBC8] uppercase">Mümtaz Bey&apos;in Sabrı</div>
          <div className="font-mono font-black text-base sm:text-lg text-[#F14E13] mt-0.5 flex items-center justify-center gap-1">
            {Array.from({ length: MAX_WRONG_LIMIT }).map((_, idx) => (
              <span
                key={idx}
                className={idx < remainingPatience ? 'opacity-100' : 'opacity-25 grayscale'}
              >
                ☕
              </span>
            ))}
          </div>
          <div className="text-[9px] font-mono text-zinc-400">
            Yanlış: {wrongCount} / {MAX_WRONG_LIMIT}
          </div>
        </div>
      </div>

      {/* KARAKTER & GÖREV BRİFİNG KARTI */}
      <div
        className={`rounded-xl sm:rounded-2xl border-2 p-2.5 sm:p-3 transition-all duration-300 relative overflow-hidden shadow-lg ${
          isWalkedAway
            ? 'bg-gradient-to-r from-red-950/85 via-[#1E0D1A] to-[#120815] border-red-400'
            : isFinished || isStepCompleted
            ? 'bg-gradient-to-r from-emerald-950/85 via-[#101E1C] to-[#0A1215] border-emerald-400'
            : 'bg-gradient-to-r from-amber-950/80 via-[#1A0E1C] to-orange-950/70 border-amber-500/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center text-2xl shrink-0 shadow-md ${
                isWalkedAway
                  ? 'border-red-400 bg-red-500/25'
                  : isFinished || isStepCompleted
                  ? 'border-emerald-400 bg-emerald-500/25'
                  : 'border-amber-400 bg-amber-500/20'
              }`}
            >
              {isWalkedAway ? '🚶‍♂️' : isFinished || isStepCompleted ? '😊' : '🧐'}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-poppins font-black text-[10px] tracking-wide uppercase flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>SAHAF SOHBETİ</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/40">
                  Sahaf Mümtaz Bey • Diyalog {stepIdx + 1}/{DIALOGUE_STEPS.length}
                </span>
              </div>

              <p className="text-xs text-white font-medium leading-snug">
                {isWalkedAway ? (
                  <span>
                    <strong className="text-red-300">3 kez yanlış diyaloğu seçtiğin için</strong> Mümtaz Bey &ldquo;Peki...&rdquo; deyip yoluna devam etti! Yeniden denemek için sohbeti sıfırla.
                  </span>
                ) : isFinished ? (
                  <span>
                    Tüm kelimeleri doğru yorumlayıp sohbeti ustalıkla sürdürdün ve Mümtaz Bey&apos;in özel sözlüğünü kazandın!
                  </span>
                ) : (
                  <span>
                    Mümtaz Bey&apos;in kullandığı <strong className="text-amber-300">&ldquo;{curStep.targetWord}&rdquo;</strong> kelimesini doğru yorumlayan ve sohbeti devam ettiren seçeneği bul!
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 bg-black/50 border border-amber-500/40 rounded-xl px-2.5 py-1.5 flex flex-col items-center sm:items-end justify-center self-stretch sm:self-auto min-w-[155px]">
            <div className="text-[9px] font-mono uppercase text-amber-300 font-black">
              🎯 HEDEF KELİME
            </div>
            <div className="text-xs font-mono font-black text-white uppercase tracking-wider mt-0.5">
              &ldquo;{curStep.targetWord}&rdquo;
            </div>
            <div className="text-[9px] text-zinc-400 font-mono">
              3 yanlışta sohbet biter
            </div>
          </div>
        </div>
      </div>

      {/* ORTA ALAN: AKAN SOHBET BALONLARI VE SEÇENEKLER */}
      <div className="rounded-2xl sm:rounded-3xl border-2 border-amber-500/35 bg-gradient-to-b from-[#21121D] via-[#150A16] to-[#0F0510] p-3 sm:p-4 flex flex-col gap-3">
        {/* GÜNCEL MÜMTAZ BEY SÖZÜ (AKTİF SORU BALONU) */}
        <div className="bg-black/50 border border-amber-500/45 rounded-2xl p-3 sm:p-3.5 flex items-start gap-3 shadow-md">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-[#F14E13] flex flex-col items-center justify-center shrink-0 shadow-sm">
            <span className="text-lg">🎩</span>
            <span className="text-[8px] font-mono font-bold text-white">MÜMTAZ</span>
          </div>

          <div className="flex-1 text-xs sm:text-sm font-poppins text-white leading-relaxed">
            <div className="text-[10px] font-mono text-amber-300 font-bold mb-1">
              Sahaf Mümtaz Bey diyor ki:
            </div>
            <p>
              &ldquo;{curStep.npcPromptBefore}{' '}
              <span className="px-2 py-0.5 rounded-lg bg-[#F14E13]/30 border border-[#F14E13] font-mono font-black text-amber-200 underline decoration-amber-400">
                {curStep.targetWord}
              </span>{' '}
              {curStep.npcPromptAfter}&rdquo;
            </p>
          </div>
        </div>

        {/* BU ADIMDAKİ VEYA ÖNCEKİ CANLI DİYALOG TEPKİLERİ */}
        {chatHistory.length > 0 && (
          <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1 bg-black/30 rounded-xl p-2.5 border border-white/10">
            {chatHistory.slice(-4).map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-2 text-xs rounded-xl p-2 border ${
                  item.sender === 'player'
                    ? item.tone === 'correct'
                      ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-100 ml-4'
                      : 'bg-red-500/15 border-red-400/50 text-red-100 ml-4'
                    : item.tone === 'walkaway'
                    ? 'bg-red-950/90 border-red-400 text-red-200 mr-4 font-semibold'
                    : item.tone === 'wrong'
                    ? 'bg-amber-950/70 border-amber-400/60 text-amber-100 mr-4'
                    : 'bg-emerald-950/70 border-emerald-400/60 text-emerald-100 mr-4'
                }`}
              >
                <span className="text-base shrink-0">
                  {item.sender === 'player'
                    ? '🗣️'
                    : item.tone === 'walkaway'
                    ? '🚶‍♂️'
                    : item.tone === 'wrong'
                    ? '🤨'
                    : '😄'}
                </span>
                <div className="flex-1 leading-snug">
                  <span className="font-bold mr-1">
                    {item.sender === 'player' ? 'Sen:' : 'Mümtaz Bey:'}
                  </span>
                  <span>&ldquo;{item.text}&rdquo;</span>
                  {item.wordNote && (
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/25 border border-emerald-400/40 text-[10px] font-mono text-emerald-200 font-bold">
                      <BookOpen className="w-3 h-3" />
                      <span>{item.wordNote}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* EĞER 3 YANLIŞ OLDUYSA: MÜMTAZ BEY YOLUNA DEVAM ETTİ EKRANI */}
        {isWalkedAway ? (
          <div className="rounded-2xl border-2 border-red-400/80 bg-red-950/40 p-4 text-center flex flex-col items-center gap-2.5">
            <div className="text-3xl">🚶‍♂️💨</div>
            <div className="font-poppins font-black text-sm sm:text-base text-red-200">
              Mümtaz Bey &ldquo;Peki...&rdquo; Deyip Yoluna Devam Etti!
            </div>
            <p className="text-xs text-[#B5CBC8] max-w-md">
              Üst üste 3 kez yanlış diyalog seçeneğini seçtiğin için Mümtaz Bey sohbeti sonlandırdı. Hemen yeniden başlayıp sohbeti doğru akışta sürdürebilirsin!
            </p>
            <button
              onClick={handleReset}
              className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 mt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>🔄 Mümtaz Bey&apos;i Durdur & Sohbete Yeniden Başla</span>
            </button>
          </div>
        ) : (
          /* 3 SEÇENEKLİ "ŞUNU KASTETTİNİZ SANIRIM..." YANIT KARTLARI */
          <div className="flex flex-col gap-2">
            <div className="text-[11px] font-mono text-amber-300 font-bold flex items-center justify-between">
              <span>🗣️ Sohbeti Sürdürecek Yanıtını Seç (&ldquo;Şunu kastettiniz sanırım...&rdquo;):</span>
              {isStepCompleted && !isFinished && (
                <span className="text-emerald-300">✓ Doğru! Sohbet bir sonraki konuya bağlandı...</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2">
              {curStep.options.map((opt) => {
                const wasTried = triedOptionIds.includes(opt.id);
                const isOk = wasTried && opt.isCorrect;
                const isBad = wasTried && !opt.isCorrect;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isStepCompleted || isFinished || wasTried}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isOk
                        ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-md'
                        : isBad
                        ? 'bg-red-500/20 border-red-400/70 text-red-200 opacity-75 cursor-not-allowed'
                        : 'bg-[#0F0510] border-white/15 text-[#B5CBC8] hover:border-[#F14E13] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">
                        {isOk ? '✅' : isBad ? '❌' : '💬'}
                      </span>
                      <span className="text-xs sm:text-sm font-poppins font-semibold leading-snug text-white">
                        &ldquo;{opt.playerText}&rdquo;
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300 shrink-0">
                      {isOk ? 'Sohbet Aktı' : isBad ? 'Yok Yahu!' : 'Seç'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ÖĞRENİLEN KELİMELER SÖZLÜK ŞERİDİ */}
      {learnedWords.length > 0 && (
        <div className="bg-[#0F0510] border border-emerald-500/30 rounded-xl p-2.5 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>Sohbette Öğrenilen Kelimeler:</span>
          </span>
          {learnedWords.map((lw) => (
            <span
              key={lw.word}
              className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-200"
              title={lw.meaning}
            >
              <strong>{lw.word}:</strong> {lw.meaning.split(':')[1]}
            </span>
          ))}
        </div>
      )}

      {/* ALT GEÇİŞ & SIFIRLAMA BARI */}
      <div className="bg-[#0F0510] border border-white/10 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2.5">
        <div className="text-[11px] font-mono text-[#B5CBC8] truncate">
          {isWalkedAway
            ? '⚠️ Mümtaz Bey 3 yanlış cevaptan sonra "Peki" diyerek sohbetten ayrıldı.'
            : isStepCompleted
            ? `📖 ${curStep.wordDictionaryMeaning}`
            : `💡 İpucu: "${curStep.targetWord}" kelimesini anlayıp sohbeti devam ettiren cümleyi seç.`}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isStepCompleted && !isFinished && (
            <button
              onClick={handleAdvanceStep}
              className="btn-primary !py-1.5 !px-3.5 text-xs font-bold flex items-center gap-1 !bg-emerald-600 hover:!bg-emerald-500 shadow-md animate-pulse"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sohbeti Sürdür ({stepIdx + 2}/{DIALOGUE_STEPS.length}) →</span>
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
