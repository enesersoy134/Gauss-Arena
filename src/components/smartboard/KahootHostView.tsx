import React, { useState, useEffect, useRef } from 'react';
import { getBackendSocket } from '../../services/backendSocket';
import { KahootRoomState, KahootPlayer } from '../../types/kahoot';
import type { Question } from '../../types/game';
import { QuestionRenderer } from '../questions/QuestionRenderer';
import { getRecommendationsForTopic } from '../../utils/resourceRecommendations';
import { soundEngine } from '../../utils/soundEngine';
import { ConfettiCanvas } from '../effects/ConfettiCanvas';
import {
  QrCode,
  Users,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  Smartphone,
  ChevronRight,
  Square,
  Volume2,
  VolumeX,
  HelpCircle,
  Check,
  BookOpen,
} from 'lucide-react';

interface KahootHostViewProps {
  onBackToDuel?: () => void;
}

// Ses efektleri (soundEngine entegrasyonu)
function playTone(freq: number, type: OscillatorType, duration: number, isMuted: boolean) {
  if (isMuted) return;
  try {
    if (freq >= 750) {
      soundEngine.playCorrect();
    } else if (freq <= 350) {
      soundEngine.playWrong();
    } else if (freq === 520 || freq === 600) {
      soundEngine.playTick(true);
    } else if (freq === 587) {
      soundEngine.playMatchFound();
    } else {
      soundEngine.playClick();
    }
  } catch {}
}

// Tüm soru tiplerinin doğru cevabını net metin olarak özetleyen fonksiyon
function getCorrectAnswerSummary(q: Question | any): string | null {
  if (!q) return null;
  const type = q.type || 'universal_choice';
  const payload = q.payload || {};

  switch (type) {
    case 'universal_choice': {
      const options = payload.options || q.options || [];
      const correctIdx =
        typeof payload.correctIndex === 'number'
          ? payload.correctIndex
          : typeof q.correctOptionIndex === 'number'
          ? q.correctOptionIndex
          : 0;
      const letter = String.fromCharCode(65 + correctIdx);
      const text = options[correctIdx] || '';
      return `${letter}) ${text}`;
    }

    case 'ordering_and_formula': {
      const order = payload.correctOrder || payload.items || [];
      return Array.isArray(order) ? order.join(' ➔ ') : null;
    }

    case 'pair_matching': {
      const pairs = payload.pairs || [];
      if (Array.isArray(pairs) && pairs.length > 0) {
        return pairs.map((p: any) => `${p.leftText} ↔ ${p.rightText}`).join('  |  ');
      }
      return null;
    }

    case 'swipe_grouping': {
      const cards = payload.cards || [];
      const leftLabel = payload.leftCategory?.label || 'Sol';
      const rightLabel = payload.rightCategory?.label || 'Sağ';
      if (Array.isArray(cards) && cards.length > 0) {
        return cards
          .map((c: any) => `${c.text} ➔ ${c.correctCategory === 'left' ? leftLabel : rightLabel}`)
          .join('  •  ');
      }
      return null;
    }

    case 'numpad_closest': {
      const ans = payload.correctAnswer ?? q.correctAnswer;
      const unit = payload.unit || q.unit || '';
      return ans !== undefined ? `${ans} ${unit}`.trim() : null;
    }

    case 'slider': {
      const target = payload.targetValue ?? payload.correctAnswer;
      const unit = payload.unit || '';
      return target !== undefined ? `${target} ${unit}`.trim() : null;
    }

    case 'matrix_toggle': {
      const rows = payload.rows || [];
      const answers = payload.answers || [];
      if (Array.isArray(answers) && answers.length > 0) {
        return answers
          .map((a: any) => {
            const row = rows.find((r: any) => r.id === a.rowId);
            const rowTitle = row?.title || a.rowId;
            return `${rowTitle}: ${a.expectedBool ? 'VAR / DOĞRU' : 'YOK / YANLIŞ'}`;
          })
          .join('  |  ');
      }
      return null;
    }

    case 'multi_select_bubble': {
      const items = payload.items || [];
      const corrects = items.filter((i: any) => i.isCorrect).map((i: any) => i.text);
      return corrects.length > 0 ? corrects.join(', ') : null;
    }

    case 'stepper_balance': {
      const slots = payload.slots || [];
      if (Array.isArray(slots) && slots.length > 0) {
        return slots.map((s: any) => `${s.label || 'Katsayı'}: ${s.correctValue}`).join('  |  ');
      }
      return null;
    }

    case 'spot_the_bug': {
      const blocks = payload.blocks || [];
      const bug = blocks.find((b: any) => b.isBug);
      return bug ? `Hatalı Parça: "${bug.blockText}"` : null;
    }

    case 'progressive_clues': {
      const options = payload.options || [];
      const idx = payload.correctIndex ?? 0;
      return options[idx] ? `${String.fromCharCode(65 + idx)}) ${options[idx]}` : null;
    }

    case 'target_combination': {
      const options = payload.options || [];
      const pairIds = payload.correctPairIds || [];
      const matched = pairIds.map((id: string) => options.find((o: any) => o.id === id)?.label || id);
      return matched.length > 0 ? matched.join(' + ') : null;
    }

    case 'chain_conversion': {
      const start = payload.startEntity || '';
      const steps = payload.steps || [];
      const stepTexts = steps.map((s: any) => `${s.arrowLabel || ''} ➔ ${s.correctValue}`);
      return [start, ...stepTexts].filter(Boolean).join(' ');
    }

    case 'hotspot': {
      const regions = payload.regions || [];
      const correctId = payload.correctRegionId;
      const r = regions.find((reg: any) => reg.id === correctId);
      return r?.label || correctId || null;
    }

    default: {
      if (typeof q.correctOptionIndex === 'number' && Array.isArray(q.options)) {
        return `${String.fromCharCode(65 + q.correctOptionIndex)}) ${q.options[q.correctOptionIndex]}`;
      }
      return null;
    }
  }
}

export const KahootHostView: React.FC<KahootHostViewProps> = ({ onBackToDuel }) => {
  const [room, setRoom] = useState<KahootRoomState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ses Durumu Senkronizasyonu
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  useEffect(() => {
    return soundEngine.subscribe(() => {
      setIsMuted(soundEngine.getMuted());
    });
  }, []);

  // Sınıf Yarışması Arka Plan Müzik Yönetimi
  useEffect(() => {
    if (!room || room.status === 'LOBBY' || room.status === 'INTERMISSION') {
      soundEngine.startMusic('lobby');
    } else if (room.status === 'QUESTION') {
      soundEngine.startMusic('battle');
    } else if (room.status === 'FINISHED') {
      soundEngine.stopMusic();
      soundEngine.playVictory();
    }
    return () => {
      soundEngine.startMusic('lobby');
    };
  }, [room?.status]);

  // Kurulum formu state
  const [examType, setExamType] = useState<string>('TYT');
  const [difficultyMode, setDifficultyMode] = useState<'adaptive' | 'easy' | 'medium' | 'hard'>('adaptive');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['matematik', 'fizik', 'kimya']);
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Soru ekranı için canlı geri sayım
  const [remainingSec, setRemainingSec] = useState<number>(30);
  // Intermission 3->2->1 sayacı
  const [nextCountdown, setNextCountdown] = useState<number | null>(null);

  const socket = getBackendSocket();

  // Socket dinleyicileri
  useEffect(() => {
    const handleRoomState = (roomState: KahootRoomState) => {
      setRoom(roomState);
      setErrorMessage(null);
    };

    const handleError = (err: { message: string }) => {
      setErrorMessage(err.message || 'Bir hata oluştu');
      setTimeout(() => setErrorMessage(null), 4000);
    };

    socket.on('kahoot:roomState', handleRoomState);
    socket.on('kahoot:error', handleError);

    return () => {
      socket.off('kahoot:roomState', handleRoomState);
      socket.off('kahoot:error', handleError);
    };
  }, [socket]);

  // Soru ekranında canlı sayaç hesaplama
  useEffect(() => {
    if (!room || room.status !== 'QUESTION') return;

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - room.questionStartedAt);
      const remainingMs = Math.max(0, room.durationMs - elapsed);
      const sec = Math.ceil(remainingMs / 1000);
      setRemainingSec(sec);
      soundEngine.setRemainingTime(sec, Math.round(room.durationMs / 1000));

      if (sec <= 5 && sec > 0) {
        playTone(520, 'sine', 0.08, isMuted);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 500);
    return () => {
      clearInterval(timer);
      soundEngine.resetTension();
    };
  }, [room?.status, room?.questionStartedAt, room?.durationMs, isMuted]);

  // Yeni oda oluştur (LGS ve difficultyMode dahil)
  const handleCreateRoom = () => {
    if (selectedSubjects.length === 0) {
      setErrorMessage('En az bir ders seçmelisiniz!');
      return;
    }
    socket.emit('kahoot:createRoom', {
      examType,
      subjects: selectedSubjects,
      questionCount,
      difficultyMode,
    });
    playTone(440, 'triangle', 0.2, isMuted);
  };

  // Yarışmayı başlat
  const handleStartGame = () => {
    if (!room) return;
    socket.emit('kahoot:startGame', { pin: room.pin });
    playTone(587, 'triangle', 0.3, isMuted);
  };

  // Soruyu erken bitir
  const handleEndQuestion = () => {
    if (!room) return;
    socket.emit('kahoot:endQuestion', { pin: room.pin });
    playTone(330, 'sine', 0.15, isMuted);
  };

  // Sıradaki soruya geç (Son soruysa anında podyuma, değilse 3 saniye geri sayım ile)
  const handleNextQuestionWithCountdown = () => {
    if (!room) return;
    if (nextCountdown !== null) return;

    const isLastQuestion = room.currentQuestionIndex + 1 >= room.totalQuestions;
    if (isLastQuestion) {
      socket.emit('kahoot:nextQuestion', { pin: room.pin });
      playTone(800, 'triangle', 0.2, isMuted);
      return;
    }

    setNextCountdown(3);
    playTone(600, 'sine', 0.1, isMuted);

    const interval = setInterval(() => {
      setNextCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setNextCountdown(null);
          socket.emit('kahoot:nextQuestion', { pin: room.pin });
          playTone(800, 'triangle', 0.2, isMuted);
          return null;
        }
        playTone(600, 'sine', 0.1, isMuted);
        return prev - 1;
      });
    }, 1000);
  };

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  // Katılım bağlantısı
  const joinUrl =
    typeof window !== 'undefined' && room?.pin
      ? `${window.location.origin}/katil?pin=${room.pin}`
      : '';

  const qrImageUrl = room?.pin
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(joinUrl)}`
    : '';

  // =========================================================================
  // 1. KURULUM EKRANI (Oda Yokken)
  // =========================================================================
  if (!room) {
    const lgsSubjects = [
      { id: 'turkce', label: 'Türkçe' },
      { id: 'matematik', label: 'Matematik' },
      { id: 'sosyal', label: 'Sosyal Bilgiler (Sosyal)' },
      { id: 'fen', label: 'Fen Bilimleri (Fen)' },
    ];
    const highSchoolSubjects = [
      { id: 'matematik', label: 'Matematik' },
      { id: 'fizik', label: 'Fizik' },
      { id: 'kimya', label: 'Kimya' },
      { id: 'biyoloji', label: 'Biyoloji' },
      { id: 'geometri', label: 'Geometri' },
      { id: 'turkce', label: 'Türkçe' },
    ];
    const subjectsList = examType === 'LGS' ? lgsSubjects : highSchoolSubjects;

    const handleExamTypeChange = (t: string) => {
      setExamType(t);
      if (t === 'LGS') {
        setSelectedSubjects(['turkce', 'matematik', 'sosyal', 'fen']);
      } else {
        setSelectedSubjects(['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce']);
      }
    };

    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-4 animate-fade-in font-sans">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-300 text-sm font-semibold flex items-center gap-2">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1A0E1C] via-[#200F23] to-[#120713] border-2 border-orange-500/30 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F14E13] to-amber-500 flex items-center justify-center shadow-lg shadow-[#F14E13]/30">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-[#F14E13] uppercase tracking-wider">
                  Canlı Sınıf Etkileşimi
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-poppins text-white">
                  📱 Canlı Sınıf Yarışması Kur
                </h2>
              </div>
            </div>
            {onBackToDuel && (
              <button
                onClick={onBackToDuel}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-semibold transition-all"
              >
                ← 2 Takım Düellosuna Dön
              </button>
            )}
          </div>

          <p className="text-sm text-[#B5CBC8] leading-relaxed">
            Akıllı tahtada QR kod gösterilir. Sınıftaki öğrenciler telefonlarından QR kodu okutarak PIN girmeden
            veya <strong>/katil</strong> adresinden yarışmaya katılır. Sorular eşzamanlı olarak öğrencilerin
            ekranına düşer ve tüm sınıf canlı liderlik tablosunda yarışır!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {/* Sınav Türü (LGS eklendi) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                1. Sınav Kategorisi
              </label>
              <div className="grid grid-cols-4 gap-1 bg-[#0F0510] p-1.5 rounded-2xl border border-white/5">
                {(['LGS', 'TYT', 'AYT', 'KARMA'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleExamTypeChange(t)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      examType === t
                        ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Öğrenci Seviyesi / Zorluk Seçimi */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                2. Öğrenci Seviyesi / Zorluk
              </label>
              <div className="grid grid-cols-4 gap-1 bg-[#0F0510] p-1.5 rounded-2xl border border-white/5">
                {[
                  { id: 'adaptive', label: 'Adaptif' },
                  { id: 'easy', label: 'Kolay' },
                  { id: 'medium', label: 'Orta' },
                  { id: 'hard', label: 'Zor' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficultyMode(d.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      difficultyMode === d.id
                        ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Soru Sayısı */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                3. Soru Sayısı
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#0F0510] p-1.5 rounded-2xl border border-white/5">
                {[5, 7, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      questionCount === n
                        ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {n} Soru
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ders Seçimi */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                4. Soru Havuzuna Dahil Edilecek Dersler
              </label>
              <span className="text-xs font-mono text-orange-400">
                {selectedSubjects.length} Ders Seçili
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {subjectsList.map((sub) => {
                const isSel = selectedSubjects.includes(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => toggleSubject(sub.id)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                      isSel
                        ? 'border-[#F14E13] bg-[#F14E13]/20 text-white shadow-md shadow-[#F14E13]/20'
                        : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20'
                    }`}
                  >
                    <span>{sub.label}</span>
                    {isSel ? (
                      <Check className="w-3.5 h-3.5 text-[#F14E13]" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-white/20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Büyük Oluştur Butonu */}
          <button
            onClick={handleCreateRoom}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 text-white font-poppins font-black text-base sm:text-lg shadow-xl shadow-[#F14E13]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 border border-white/20 mt-2"
          >
            <QrCode className="w-5 h-5" />
            <span>QR KODLU CANLI SINIF ODASI OLUŞTUR</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. LOBİ AŞAMASI (status === 'LOBBY')
  // =========================================================================
  if (room.status === 'LOBBY') {
    const formattedPin = room.pin.replace(/(\d{3})(\d{3})/, '$1 $2');
    const playersCount = room.leaderboard?.length || 0;

    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full py-2 animate-fade-in font-sans">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Üst Bilgi Barı */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-[#1A0E1C]/80 p-3 sm:p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              CANLI LOBİ AÇIK
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {room.examType} • {room.totalQuestions} Soru • {room.subjects.join(', ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.toggleMute();
                soundEngine.playClick();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Ana Lobi Izgarası: Sol QR & PIN | Sağ Katılan Öğrenciler */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol Kolon: QR Kod & Katılım Bilgisi (5 Kolon) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#1A0E1C] via-[#210D24] to-[#120713] border-2 border-orange-500/40 shadow-2xl flex flex-col items-center text-center gap-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF7A45]">
              ÖĞRENCİ KATILIM EKRANI
            </span>

            {/* Büyük Beyaz Çerçeveli QR Kod */}
            <div className="p-3 bg-white rounded-3xl shadow-2xl shadow-[#F14E13]/30 transition-transform hover:scale-105 duration-300">
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt={`Katılım QR Kodu PIN: ${room.pin}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-zinc-100 text-zinc-500 text-xs">
                  QR Yükleniyor...
                </div>
              )}
            </div>

            {/* Dev Puntolu 6 Haneli PIN Kodu */}
            <div className="flex flex-col items-center gap-1 w-full bg-[#0F0510] py-3.5 px-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                VEYA WEB ADRESİNDEN GİRİŞ:
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-[#F14E13]">
                {formattedPin}
              </div>
              <span className="text-xs font-mono text-[#F14E13] font-semibold mt-0.5">
                /katil (PIN: {room.pin})
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-tight">
              Kameranızı QR koda tutun ya da telefonunuzdan tarayıcıyı açıp PIN kodunu girin.
            </p>
          </div>

          {/* Sağ Kolon: Katılan Öğrenciler Izgarası (7 Kolon) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#1A0E1C]/80 border border-white/10 shadow-xl flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <h3 className="font-poppins font-bold text-base sm:text-lg text-white">
                    Sınıfta Hazır Olanlar
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
                  {playersCount} Öğrenci
                </span>
              </div>

              {/* Öğrenci Kartları Izgarası */}
              {playersCount === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-bounce">
                    <Smartphone className="w-8 h-8 text-orange-400" />
                  </div>
                  <h4 className="font-poppins font-bold text-white text-sm">
                    Öğrenciler Bekleniyor...
                  </h4>
                  <p className="text-xs text-[#B5CBC8] max-w-sm">
                    Öğrenciler QR kodu okuttuğunda isimleri ve avatarları bu ekrana canlı olarak yansıyacaktır.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {room.leaderboard.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="p-2.5 rounded-2xl bg-[#0F0510] border border-white/10 hover:border-orange-500/40 flex items-center gap-2.5 shadow-md transition-all animate-scale-up"
                    >
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-orange-500/50 object-cover bg-black shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-poppins font-bold text-xs text-white truncate block">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Hazır</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Alt Başlat Butonu & İptal */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setRoom(null)}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-400 hover:text-white transition-all"
              >
                🔄 İptal Et / Yeni Oda
              </button>

              <button
                onClick={handleStartGame}
                disabled={playersCount === 0}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-poppins font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all ${
                  playersCount > 0
                    ? 'bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 text-white shadow-[#F14E13]/30 hover:brightness-110 active:scale-[0.99] border border-white/20'
                    : 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed opacity-60'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>
                  {playersCount > 0
                    ? `YARIŞMAYI BAŞLAT (${playersCount} Öğrenci)`
                    : 'En Az 1 Öğrenci Katılmalı'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. CANLI SORU EKRANI (status === 'QUESTION')
  // =========================================================================
  if (room.status === 'QUESTION') {
    const rawQ = (room.currentQuestion as any)?.interactiveQuestion || room.currentQuestion;
    const q: Question | null = rawQ ? (rawQ as Question) : null;
    const answered = room.answeredCount || 0;
    const total = room.totalPlayers || 1;
    const progressPercent = Math.min(100, (answered / total) * 100);

    return (
      <div className="flex flex-col gap-2.5 sm:gap-3.5 max-w-5xl mx-auto w-full h-full max-h-full py-1 animate-fade-in font-sans justify-between min-h-0">
        {/* Üst Bilgi Başlığı */}
        <div className="flex items-center justify-between gap-3 bg-[#1A0E1C]/90 px-3.5 py-2 sm:py-2.5 rounded-2xl border border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-orange-600/30 text-orange-300 border border-orange-500/40 text-xs font-mono font-bold">
              SORU {room.currentQuestionIndex + 1} / {room.totalQuestions}
            </span>
            {q?.subject && (
              <span className="px-2.5 py-1 rounded-xl bg-white/5 text-zinc-300 border border-white/10 text-xs font-bold uppercase">
                {q.subject}
              </span>
            )}
            {q?.topic && (
              <span className="text-xs text-[#B5CBC8] hidden sm:inline font-mono">
                • {q.topic}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cevaplayanlar Sayacı */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#0F0510] px-3 py-1 rounded-xl border border-white/10">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white">
                {answered} / {total} Cevapladı
              </span>
            </div>

            <button
              onClick={handleEndQuestion}
              className="px-2.5 sm:px-3 py-1 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Süreyi beklemeden soruyu bitir ve sonuçları göster"
            >
              <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span>⏹️ Soruyu Bitir</span>
            </button>
          </div>
        </div>

        {/* Cevaplama İlerleme Çubuğu */}
        <div className="w-full bg-[#0F0510] h-1.5 rounded-full overflow-hidden border border-white/10 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Orta Büyük Soru Paneli (Ekrana sığacak şekilde flex-1 ve min-h-0) */}
        <div className="p-3.5 sm:p-5 lg:p-6 rounded-3xl bg-gradient-to-br from-[#1A0E1C] via-[#210D24] to-[#120713] border-2 border-orange-500/30 shadow-2xl flex flex-col flex-1 min-h-0 justify-between gap-3 relative overflow-hidden">
          {/* Ortada Büyük Dairesel Sayaç */}
          <div className="flex items-center justify-between shrink-0">
            <span className="text-[11px] sm:text-xs font-mono font-bold text-[#FF7A45] uppercase tracking-wider">
              ÖĞRENCİLER TELEFONDAN CEVAPLIYOR...
            </span>

            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-2xl border font-mono font-black text-base sm:text-xl transition-all ${
                remainingSec <= 5
                  ? 'bg-red-600/20 border-red-500 text-red-400 animate-pulse'
                  : 'bg-orange-500/20 border-orange-500/40 text-orange-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{remainingSec}s</span>
            </div>
          </div>

          {/* Soru Metni & Varsa Görsel (Dikeyde ferah ve taşmayan esnek alan) */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center overflow-y-auto px-2 py-1">
            {Boolean((q as any)?.imageUrl || (q as any)?.image) && (
              <img
                src={(q as any)?.imageUrl || (q as any)?.image}
                alt="Soru Görseli"
                className="max-h-28 sm:max-h-40 object-contain rounded-xl border border-white/10 mb-2 shrink-0 shadow-md"
              />
            )}
            <h2 className="text-base sm:text-xl lg:text-2xl font-black font-poppins text-white leading-snug sm:leading-relaxed max-w-3xl">
              {q?.prompt || 'Soru yükleniyor...'}
            </h2>
          </div>

          {/* Çoktan Seçmeli veya Soru Seçenekleri Önizlemesi (Tahta Görünümü - alta sabit, taşmaz) */}
          {q?.type === 'universal_choice' && (q.payload as any)?.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 shrink-0 pt-1">
              {((q.payload as any).options as string[]).map((opt, i) => (
                <div
                  key={i}
                  className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#0F0510]/90 border border-white/10 flex items-center gap-2.5 text-white font-semibold text-xs sm:text-sm lg:text-base shadow-sm"
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-[#F14E13]/20 border border-[#F14E13]/40 text-[#F14E13] font-mono font-bold flex items-center justify-center shrink-0 text-xs sm:text-sm">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="line-clamp-2 leading-tight">{opt}</span>
                </div>
              ))}
            </div>
          )}

          {/* Diğer interaktif soru tipleri için tahtadaki ipucu kartı & salt-okunur önizleme */}
          {q && q.type !== 'universal_choice' && (
            <div className="flex flex-col gap-2 shrink-0 pt-1">
              <div className="px-3 py-1.5 rounded-xl bg-[#0F0510]/60 border border-white/10 flex items-center justify-between text-[11px] sm:text-xs text-zinc-300 font-mono">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    İnteraktif Tip: <strong>{(q.type || 'universal_choice').replace(/_/g, ' ').toUpperCase()}</strong>
                  </span>
                </span>
                <span className="text-orange-400 text-[10px] sm:text-xs">Öğrenciler telefonlarından interaktif çözüyor</span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0F0510]/40 border border-white/10 pointer-events-none opacity-95 max-h-[180px] sm:max-h-[240px] overflow-y-auto">
                <QuestionRenderer question={q} onSubmit={() => {}} disabled={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. RAUNT SONU & CANLI LİDERLİK TABLOSU (status === 'INTERMISSION')
  // =========================================================================
  if (room.status === 'INTERMISSION') {
    const rawQ = (room.currentQuestion as any)?.interactiveQuestion || room.currentQuestion;
    const q: Question | null = rawQ ? (rawQ as Question) : null;
    const isLastQuestion = room.currentQuestionIndex + 1 >= room.totalQuestions;
    const sorted = [...(room.leaderboard || [])].sort((a, b) => b.score - a.score);
    const top10 = sorted.slice(0, 10);

    const correctCountThisRound = room.leaderboard?.filter((p) => p.lastRoundCorrect).length || 0;

    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full py-2 animate-fade-in font-sans">
        {/* Üst Bilgi ve Geçiş Barı */}
        <div className="flex items-center justify-between flex-wrap gap-3 bg-[#1A0E1C]/80 p-4 rounded-2xl border border-white/10">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              RAUNT SONU RAPORU
            </span>
            <h2 className="text-lg sm:text-xl font-black font-poppins text-white">
              📊 Soru {room.currentQuestionIndex + 1} Tamamlandı ({correctCountThisRound} Doğru)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNextQuestionWithCountdown}
              disabled={nextCountdown !== null}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 hover:brightness-110 active:scale-[0.99] text-white font-poppins font-black text-sm flex items-center gap-2 shadow-lg shadow-[#F14E13]/30 border border-white/20 transition-all"
            >
              {nextCountdown !== null ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Başlıyor ({nextCountdown})...</span>
                </>
              ) : isLastQuestion ? (
                <>
                  <Trophy className="w-4 h-4" />
                  <span>Final Podyumunu Görüntüle</span>
                </>
              ) : (
                <>
                  <span>Sonraki Soruya Geç (3s)</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* DOĞRU CEVAP & DETAYLI ÇÖZÜM KARTI */}
        {q && (
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#121B14] via-[#101D1A] to-[#0A120E] border-2 border-emerald-500/50 shadow-2xl flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-base">
                  🎯
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    TUR SONUCU
                  </span>
                  <h3 className="font-poppins font-black text-base sm:text-lg text-white">
                    Doğru Cevap & Çözüm Analizi
                  </h3>
                </div>
              </div>

              {q.subject && (
                <span className="px-3 py-1 rounded-xl bg-white/5 text-zinc-300 border border-white/10 text-xs font-mono font-bold uppercase">
                  {q.subject} {q.topic ? `• ${q.topic}` : ''}
                </span>
              )}
            </div>

            {/* Soru Metni */}
            <div className="text-sm sm:text-base text-zinc-200 font-poppins font-semibold leading-relaxed">
              <span className="text-zinc-400 font-normal mr-2 font-mono">Soru:</span>
              {q.prompt}
            </div>

            {/* Büyük Vurgulu Doğru Cevap Kutusu */}
            {(() => {
              const answerText = getCorrectAnswerSummary(q);
              if (!answerText) return null;
              return (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500/80 flex items-start gap-3 shadow-lg shadow-emerald-950/40">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-mono font-black text-emerald-400 uppercase tracking-wider block mb-1">
                      DOĞRU CEVAP:
                    </span>
                    <span className="text-base sm:text-xl font-poppins font-black text-white block leading-snug break-words">
                      {answerText}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Detaylı Çözüm Açıklaması */}
            {q.explanation && (
              <div className="p-4 rounded-2xl bg-[#090F0C] border border-emerald-500/20 text-xs sm:text-sm text-emerald-200/90 flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold shrink-0">💡</span>
                <div className="leading-relaxed">
                  <span className="font-bold text-emerald-300 block mb-0.5">Çözüm İpucu & Açıklama:</span>
                  <p>{q.explanation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Canlı Liderlik Tablosu (Top 10) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A0E1C] via-[#210D24] to-[#120713] border-2 border-orange-500/30 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-poppins font-bold text-base sm:text-lg text-white">
                Canlı Sınıf Sıralaması (Top 10)
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Toplam {room.leaderboard?.length || 0} Öğrenci
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {top10.map((player, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;
              const badgeColors = ['#f59e0b', '#94a3b8', '#b45309'];

              return (
                <div
                  key={player.id || idx}
                  className="py-3 px-3 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isTop3
                          ? 'text-black font-black'
                          : 'bg-white/5 text-zinc-400 border border-white/10'
                      }`}
                      style={isTop3 ? { backgroundColor: badgeColors[rank - 1] } : {}}
                    >
                      {rank}
                    </span>

                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-9 h-9 rounded-xl border border-white/15 object-cover bg-black shrink-0"
                    />

                    <div className="min-w-0">
                      <span className="font-poppins font-bold text-sm text-white truncate block">
                        {player.name}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                        {player.streak > 1 && (
                          <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                            <Flame className="w-3 h-3 fill-amber-400" />
                            <span>{player.streak}x Seri</span>
                          </span>
                        )}
                        <span>{player.correctCount} Doğru</span>
                      </div>
                    </div>
                  </div>

                  {/* Sağ Puan Bilgisi */}
                  <div className="flex items-center gap-3 text-right shrink-0">
                    {player.lastRoundPoints > 0 ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        +{player.lastRoundPoints}
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-zinc-500">0</span>
                    )}

                    <span className="font-mono font-black text-base text-amber-300 min-w-[70px]">
                      {player.score} P
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. FİNAL PODYUMU & SINIF KONU ANALİZİ (status === 'FINISHED')
  // =========================================================================
  if (room.status === 'FINISHED') {
    const sorted = [...(room.leaderboard || [])].sort((a, b) => b.score - a.score);
    const first = sorted[0];
    const second = sorted[1];
    const third = sorted[2];

    const topicAnalytics: Array<{
      topic: string;
      subject: string;
      totalAttempts: number;
      wrongAttempts: number;
      wrongPercent: number;
    }> = (room as any).topicAnalytics || [];

    return (
      <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-4 animate-fade-in font-sans relative">
        {/* Tahta Podyumu Şampiyonluk Konfeti Patlaması */}
        <ConfettiCanvas active={true} durationMs={6000} />

        {/* Üst Başlık */}
        <div className="text-center flex flex-col items-center gap-2 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/25 via-yellow-500/10 to-transparent pointer-events-none animate-sunburst blur-2xl" />
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 mt-1">
            YARIŞMA TAMAMLANDI
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-poppins text-white">
            🏆 BİLGİ YARIŞMASI ŞAMPİYONLUK PODYUMU
          </h2>
        </div>

        {/* 3'lü Podyum Kürsüsü */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto w-full pt-4">
          {/* 🥈 2. Sıra (Gümüş) */}
          <div className="flex flex-col items-center gap-2 order-1">
            {second ? (
              <>
                <img
                  src={second.avatarUrl}
                  alt={second.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-slate-300 object-cover bg-black shadow-lg"
                />
                <span className="font-poppins font-bold text-xs sm:text-sm text-white truncate max-w-[90px] sm:max-w-none">
                  {second.name}
                </span>
                <span className="font-mono text-xs text-slate-300 font-bold">{second.score} P</span>
                <div className="w-full h-24 sm:h-32 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border-t-4 border-slate-300 flex items-center justify-center font-poppins font-black text-2xl text-slate-200 shadow-xl">
                  2
                </div>
              </>
            ) : (
              <div className="w-full h-24 bg-white/5 rounded-t-2xl" />
            )}
          </div>

          {/* 🥇 1. Sıra (Altın - En Yüksek) */}
          <div className="flex flex-col items-center gap-2 order-2">
            {first ? (
              <>
                <div className="relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <img
                    src={first.avatarUrl}
                    alt={first.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-yellow-400 object-cover bg-black shadow-xl shadow-yellow-500/30"
                  />
                </div>
                <span className="font-poppins font-black text-sm sm:text-base text-yellow-300 truncate max-w-[100px] sm:max-w-none">
                  {first.name}
                </span>
                <span className="font-mono text-xs sm:text-sm text-yellow-400 font-black">{first.score} P</span>
                <div className="w-full h-32 sm:h-44 rounded-t-2xl bg-gradient-to-t from-amber-700 to-yellow-500/90 border-t-4 border-yellow-300 flex items-center justify-center font-poppins font-black text-3xl text-black shadow-2xl">
                  1
                </div>
              </>
            ) : (
              <div className="w-full h-32 bg-white/5 rounded-t-2xl" />
            )}
          </div>

          {/* 🥉 3. Sıra (Bronz) */}
          <div className="flex flex-col items-center gap-2 order-3">
            {third ? (
              <>
                <img
                  src={third.avatarUrl}
                  alt={third.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-amber-700 object-cover bg-black shadow-lg"
                />
                <span className="font-poppins font-bold text-xs sm:text-sm text-white truncate max-w-[90px] sm:max-w-none">
                  {third.name}
                </span>
                <span className="font-mono text-xs text-amber-500 font-bold">{third.score} P</span>
                <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-amber-950 to-amber-800/80 border-t-4 border-amber-700 flex items-center justify-center font-poppins font-black text-xl text-amber-200 shadow-xl">
                  3
                </div>
              </>
            ) : (
              <div className="w-full h-20 bg-white/5 rounded-t-2xl" />
            )}
          </div>
        </div>

        {/* 📊 Sınıf Konu & Kazanım Analizi (En Çok Yanlış Yapılan Konular) */}
        {topicAnalytics.length > 0 && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A0E1C] via-[#200F23] to-[#120713] border-2 border-orange-500/40 shadow-2xl flex flex-col gap-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-lg">
                  📊
                </div>
                <div>
                  <h3 className="font-poppins font-black text-base sm:text-lg text-white">
                    Sınıf Konu & Kazanım Analizi (En Çok Yanlış Yapılan Konular)
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Öğrencilerin zorlandığı konular ve İşler Yayın Grubu hedef kaynak önerileri
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {topicAnalytics.length} Konu İncelendi
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {topicAnalytics.map((item, idx) => {
                const recs = getRecommendationsForTopic(item.subject, item.topic, room.examType);
                const book = recs && recs.length > 0 ? recs[0] : null;

                // Bar rengi belirleme: >= 60 kırmızı, 30-59 sarı/kehribar, < 30 yeşil
                const barColorClass =
                  item.wrongPercent >= 60
                    ? 'bg-gradient-to-r from-red-600 to-rose-600'
                    : item.wrongPercent >= 30
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400';

                const badgeColorClass =
                  item.wrongPercent >= 60
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : item.wrongPercent >= 30
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0F0510] border border-white/10 hover:border-orange-500/30 transition-all flex flex-col gap-2.5 shadow-md"
                  >
                    {/* Üst Bilgi: Konu, Ders Rozeti ve Yanlış Oranı */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-zinc-300 text-[11px] font-mono font-bold uppercase">
                          {item.subject.toUpperCase()}
                        </span>
                        <span className="font-poppins font-bold text-sm sm:text-base text-white">
                          {item.topic}
                        </span>
                      </div>

                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${badgeColorClass}`}>
                        %{item.wrongPercent} Yanlış Oranı ({item.wrongAttempts} / {item.totalAttempts} Öğrenci)
                      </span>
                    </div>

                    {/* Görsel Yüzdelik İlerleme Çubuğu */}
                    <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
                        style={{ width: `${Math.min(100, Math.max(5, item.wrongPercent))}%` }}
                      />
                    </div>

                    {/* Kitap / Kaynak Önerisi Rozeti */}
                    {item.wrongPercent > 0 && book && (
                      <div className="mt-1 p-2.5 rounded-xl bg-orange-950/30 border border-orange-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2 text-orange-200">
                          <BookOpen className="w-4 h-4 text-orange-400 shrink-0" />
                          <span>
                            <strong>📚 Önerilen Sınıf Kaynağı:</strong> {book.bookTitle}{' '}
                            <span className="text-orange-400 font-semibold">({book.publisher})</span>
                          </span>
                        </div>
                        {book.recommendedSection && (
                          <span className="text-zinc-400 font-mono text-[11px]">
                            Bölüm: {book.recommendedSection}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tüm Sınıf Sıralama Tablosu */}
        <div className="p-6 rounded-3xl bg-[#1A0E1C]/80 border border-white/10 shadow-xl flex flex-col gap-4">
          <h3 className="font-poppins font-bold text-base text-white border-b border-white/10 pb-3">
            📋 Tüm Katılımcı Karnesi ({sorted.length} Öğrenci)
          </h3>

          <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto">
            {sorted.map((p, idx) => (
              <div key={p.id || idx} className="py-2.5 px-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 font-mono font-bold text-zinc-400 text-center">#{idx + 1}</span>
                  <img src={p.avatarUrl} alt={p.name} className="w-7 h-7 rounded-lg object-cover bg-black" />
                  <span className="font-poppins font-bold text-white">{p.name}</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-emerald-400">{p.correctCount} Doğru</span>
                  <span className="text-red-400">{p.wrongCount} Yanlış</span>
                  <span className="font-black text-amber-300 text-sm">{p.score} Puan</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setRoom(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 text-white font-poppins font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#F14E13]/30 hover:brightness-110 active:scale-[0.99] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeni Bir Canlı Sınıf Yarışması Kur</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default KahootHostView;
