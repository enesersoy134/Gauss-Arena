import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getBackendSocket } from '../../services/backendSocket';
import { KahootRoomState, KahootPlayer } from '../../types/kahoot';
import type { Question } from '../../types/game';
import { QuestionRenderer } from '../questions/QuestionRenderer';
import { AnswerResult } from '../questions/questionProps';
import { soundEngine } from '../../utils/soundEngine';
import {
  Smartphone,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Home,
  Check,
  Send,
  Lock,
  Layers,
} from 'lucide-react';

interface KahootPlayerViewProps {
  onExit?: () => void;
}

// Hazır eğlenceli avatarlar
const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Kerim&backgroundColor=f14e13',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Elif&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmet&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Zeynep&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Mert&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Selin&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Can&backgroundColor=bbf7d0',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Deniz&backgroundColor=fecdd3',
];

export const KahootPlayerView: React.FC<KahootPlayerViewProps> = ({ onExit }) => {
  // URL parametresinden PIN'i oku
  const urlParams = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialPin = urlParams.get('pin') || '';

  // Form State
  const [pin, setPin] = useState<string>(initialPin);
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_OPTIONS[0]);

  // Katılım ve Oda State
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [room, setRoom] = useState<KahootRoomState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Oyuncunun bu sorudaki cevap durumu
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [myAnswerResult, setMyAnswerResult] = useState<AnswerResult | null>(null);

  // Canlı Soru Kalan Süre Barı
  const [remainingSec, setRemainingSec] = useState<number>(30);

  // Benzersiz Oyuncu ID'si (sayfa yenilense de korunsun)
  const [playerId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kahoot_player_id');
      if (stored) return stored;
      const gen = 'k_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('kahoot_player_id', gen);
      return gen;
    }
    return 'k_' + Math.random().toString(36).slice(2, 10);
  });

  const socket = getBackendSocket();

  // Socket Olayları
  useEffect(() => {
    const handleJoined = (data: { pin: string; playerId: string; roomState: KahootRoomState }) => {
      setIsJoined(true);
      setRoom(data.roomState);
      setErrorMessage(null);
    };

    const handleRoomState = (roomState: KahootRoomState) => {
      setRoom(roomState);
      setErrorMessage(null);
    };

    const handleError = (err: { message: string }) => {
      setErrorMessage(err.message || 'Bir hata oluştu');
      setTimeout(() => setErrorMessage(null), 4000);
    };

    socket.on('kahoot:joined', handleJoined);
    socket.on('kahoot:roomState', handleRoomState);
    socket.on('kahoot:error', handleError);

    // Eğer zaten PIN varsa ve bağlantı kurulduysa odayı sorgula
    if (initialPin && isJoined) {
      socket.emit('kahoot:getRoom', { pin: initialPin, playerId });
    }

    return () => {
      socket.off('kahoot:joined', handleJoined);
      socket.off('kahoot:roomState', handleRoomState);
      socket.off('kahoot:error', handleError);
    };
  }, [socket, initialPin, isJoined, playerId]);

  // Yeni soru geldiğinde yerel cevap durumunu sıfırla
  useEffect(() => {
    if (room?.status === 'QUESTION') {
      // Benim bu soruya cevap verip vermediğimi kontrol et
      const me = room.leaderboard?.find((p) => p.id === playerId);
      if (me && me.hasAnsweredCurrent) {
        setHasAnswered(true);
      } else {
        setHasAnswered(false);
        setMyAnswerResult(null);
      }
    }
  }, [room?.status, room?.currentQuestionIndex, room?.leaderboard, playerId]);

  // Raunt Sonu (INTERMISSION) ve Oyun Bitişi (FINISHED) Sesleri
  useEffect(() => {
    if (!room) return;
    if (room.status === 'INTERMISSION') {
      const me = room.leaderboard?.find((p) => p.id === playerId);
      if (me?.lastRoundCorrect) {
        soundEngine.playCorrect();
        if ((me?.streak || 0) > 1) {
          soundEngine.playCombo(me.streak);
        }
      } else if ((me?.lastRoundPoints || 0) > 0) {
        soundEngine.playPartial();
      } else {
        soundEngine.playWrong();
      }
    } else if (room.status === 'FINISHED') {
      soundEngine.playVictory();
    }
  }, [room?.status, room?.currentQuestionIndex, room?.leaderboard, playerId]);

  // Canlı Soru Kalan Süre Sayacı
  useEffect(() => {
    if (!room || room.status !== 'QUESTION') return;

    let lastSec = 30;
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - room.questionStartedAt);
      const remainingMs = Math.max(0, room.durationMs - elapsed);
      const sec = Math.ceil(remainingMs / 1000);
      setRemainingSec(sec);

      if (sec !== lastSec) {
        lastSec = sec;
        if (sec <= 5 && sec > 0) {
          soundEngine.playTick(true);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [room?.status, room?.questionStartedAt, room?.durationMs]);

  // Katıl butonu aksiyonu
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    const cleanPin = pin.replace(/\s+/g, '').trim();
    const cleanName = playerName.trim();

    if (!cleanPin || cleanPin.length < 4) {
      setErrorMessage('Geçerli bir PIN kodu giriniz!');
      return;
    }
    if (!cleanName) {
      setErrorMessage('Lütfen isminizi veya takma adınızı giriniz!');
      return;
    }

    socket.emit('kahoot:joinRoom', {
      pin: cleanPin,
      playerName: cleanName,
      avatarUrl: selectedAvatar,
      playerId,
    });
  };

  // Öğrenci Soru Cevap Gönderimi
  const handleStudentSubmit = (result: AnswerResult) => {
    if (hasAnswered || !room || room.status !== 'QUESTION') return;
    soundEngine.playLock();
    setHasAnswered(true);
    setMyAnswerResult(result);

    socket.emit('kahoot:submitAnswer', {
      pin: room.pin,
      playerId,
      questionIndex: room.currentQuestionIndex,
      answerResult: result,
    });
  };

  // Soruyu Boş Bırak / Geç
  const handlePass = () => {
    soundEngine.playClick();
    handleStudentSubmit({ isCorrect: false, accuracy: 0 });
  };

  // Kendi oyuncu verim
  const myPlayer: KahootPlayer | undefined = room?.leaderboard?.find((p) => p.id === playerId);
  // Sınıftaki güncel sıram
  const myRank = useMemo(() => {
    if (!room?.leaderboard) return 1;
    const sorted = [...room.leaderboard].sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex((p) => p.id === playerId);
    return idx >= 0 ? idx + 1 : 1;
  }, [room?.leaderboard, playerId]);

  // =========================================================================
  // 1. GİRİŞ VE KATILIM EKRANI (!isJoined || !room)
  // =========================================================================
  if (!isJoined || !room) {
    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-x-hidden">
        {/* Glow & Ambiyans */}
        <div className="hero-button-blur -top-20 -left-20 opacity-30 pointer-events-none" />
        <div className="hero-button-blur -bottom-20 -right-20 opacity-25 pointer-events-none" />

        {/* Üst Logo */}
        <header className="flex items-center justify-between gap-3 max-w-md mx-auto w-full pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F14E13] to-amber-500 flex items-center justify-center shadow-lg shadow-[#F14E13]/30">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#F14E13] uppercase tracking-wider block">
                CANLI SINIF YARIŞMASI
              </span>
              <h1 className="font-poppins font-black text-sm sm:text-base text-white">
                İŞLER ARENA • KATIL
              </h1>
            </div>
          </div>

          {onExit && (
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Ana Sayfa</span>
            </button>
          )}
        </header>

        {/* Orta Katılım Formu */}
        <main className="max-w-md mx-auto w-full py-6 flex flex-col gap-5">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2 animate-shake">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1A0E1C] via-[#210D24] to-[#120713] border-2 border-orange-500/30 shadow-2xl flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-xl font-black font-poppins text-white">
                📱 Sınıf Yarışmasına Katıl
              </h2>
              <p className="text-xs text-[#B5CBC8] mt-1">
                Akıllı tahtadaki PIN kodunu ve isminizi girerek yarışmaya katılın.
              </p>
            </div>

            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              {/* PIN Kodu */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                  Oda PIN Kodu
                </label>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Örn: 482915"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0F0510] border border-white/15 text-white font-mono font-black text-xl tracking-widest text-center focus:outline-none focus:border-[#F14E13] transition-all"
                  required
                />
              </div>

              {/* Öğrenci Adı */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                  Öğrenci Adı / Takma Ad
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Örn: Kerim"
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0F0510] border border-white/15 text-white font-poppins font-bold text-base focus:outline-none focus:border-[#F14E13] transition-all"
                  required
                />
              </div>

              {/* Avatar Seçici */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs font-poppins font-bold uppercase tracking-wider text-[#FF7A45]">
                  Avatarını Seç
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_OPTIONS.map((av, idx) => {
                    const isSelected = selectedAvatar === av;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedAvatar(av)}
                        className={`p-1.5 rounded-2xl border-2 transition-all flex items-center justify-center ${
                          isSelected
                            ? 'border-[#F14E13] bg-[#F14E13]/20 shadow-lg shadow-[#F14E13]/30 scale-105'
                            : 'border-white/10 bg-[#0F0510] hover:border-white/30'
                        }`}
                      >
                        <img src={av} alt={`Avatar ${idx}`} className="w-10 h-10 rounded-xl object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Katıl Butonu */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 text-white font-poppins font-black text-base shadow-xl shadow-[#F14E13]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-white/20 mt-2"
              >
                <span>YARIŞMAYA KATIL</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </main>

        <footer className="max-w-md mx-auto w-full text-center text-[11px] text-zinc-500 pb-2">
          İşler Teknoloji • Akıllı Tahta & Mobil Sınıf Deneyimi
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 2. LOBİ BEKLEME EKRANI (room.status === 'LOBBY')
  // =========================================================================
  if (room.status === 'LOBBY') {
    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-4 sm:p-6 font-sans relative">
        <div className="hero-button-blur -top-20 -left-20 opacity-30 pointer-events-none" />

        {/* Üst Bar */}
        <header className="flex items-center justify-between gap-3 max-w-md mx-auto w-full pt-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Odaya Katıldın</span>
          </span>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
            PIN: {room.pin}
          </span>
        </header>

        {/* Orta Bekleme Kartı */}
        <main className="max-w-md mx-auto w-full py-8 flex flex-col items-center text-center gap-6">
          <div className="relative">
            <span className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-400 opacity-40 blur-lg animate-pulse" />
            <img
              src={selectedAvatar}
              alt={playerName}
              className="w-24 h-24 rounded-3xl border-2 border-orange-400 object-cover bg-black relative shadow-2xl"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black font-poppins text-white">{playerName}</h2>
            <p className="text-xs text-[#B5CBC8] mt-1 font-mono">
              {room.examType} Sınavı • {room.totalQuestions} Soru
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1A0E1C] border border-white/10 shadow-xl flex flex-col items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center animate-spin">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="font-poppins font-bold text-base text-white">
              Öğretmen Bekleniyor...
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Akıllı tahtadan yarışma başlatıldığında sorular anında ekranına gelecektir. Hazırda bekle!
            </p>
            <div className="mt-2 px-3 py-1.5 rounded-xl bg-white/5 text-amber-300 text-xs font-mono font-semibold">
              Sınıfta Şu An {room.leaderboard?.length || 1} Öğrenci Hazır
            </div>
          </div>
        </main>

        <footer className="max-w-md mx-auto w-full text-center text-xs text-zinc-500 pb-3">
          Ekranı kapatma, yarışma her an başlayabilir!
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 3. CANLI SORU ÇÖZÜM EKRANI (room.status === 'QUESTION')
  // =========================================================================
  if (room.status === 'QUESTION') {
    const q: Question | null = (((room.currentQuestion as any)?.interactiveQuestion || room.currentQuestion) as Question) || null;

    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-start gap-2.5 p-2.5 sm:p-5 font-sans relative">
        {/* Üst Oyuncu Bilgi Barı */}
        <header className="flex items-center justify-between gap-2 max-w-lg mx-auto w-full pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src={selectedAvatar} alt={playerName} className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover bg-black" />
            <div className="leading-tight">
              <span className="font-poppins font-bold text-xs text-white block truncate max-w-[100px]">
                {playerName}
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">
                {myPlayer?.score || 0} Puan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(myPlayer?.streak || 0) > 1 && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>{myPlayer?.streak}x</span>
              </span>
            )}
            <span className="px-2.5 py-1 rounded-xl bg-orange-600/20 text-orange-300 text-xs font-mono font-bold border border-orange-500/30">
              Soru {room.currentQuestionIndex + 1} / {room.totalQuestions}
            </span>
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black border ${
                remainingSec <= 5
                  ? 'bg-red-600/30 text-red-300 border-red-500 animate-pulse'
                  : 'bg-white/5 text-zinc-300 border-white/10'
              }`}
            >
              {remainingSec}s
            </span>
          </div>
        </header>

        {/* Canlı Kalan Süre Çubuğu */}
        <div className="max-w-lg mx-auto w-full mt-1 bg-[#0F0510] h-1.5 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, (remainingSec / ((room.durationMs || 30000) / 1000)) * 100))}%` }}
          />
        </div>

        {/* Ana Soru Alanı */}
        <main className="max-w-lg mx-auto w-full py-1.5 sm:py-3 flex-1 flex flex-col gap-2.5 sm:gap-4 justify-center">
          {hasAnswered ? (
            /* Cevap Verildi - Bekleme Modu (Doğru/Yanlış gizlenir, tahtaya yönlendirilir) */
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1A0E1C] via-[#210D24] to-[#120713] border-2 border-emerald-500/40 shadow-2xl flex flex-col items-center text-center gap-4 animate-scale-up my-auto">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <span className="absolute w-20 h-20 rounded-full border border-emerald-500/30 animate-ping" />
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Lock className="w-8 h-8 text-emerald-400" />
                </div>
              </div>

              <div>
                <h3 className="font-poppins font-black text-lg sm:text-xl text-white">
                  🔒 Cevabın Gönderildi!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed max-w-xs">
                  Süre bitince doğru cevap ve sonuçlar <strong>akıllı tahtada</strong> gösterilecek.
                </p>
              </div>

              <div className="w-full bg-[#0F0510] p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Cevaplayanlar:</span>
                <span className="text-amber-400 font-bold">
                  {room.answeredCount || 1} / {room.totalPlayers || 1} Öğrenci
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                <Clock className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                <span>Kalan Süre: {remainingSec} saniye</span>
              </div>
            </div>
          ) : (
            <>
              {/* Soru Başlık Kartı */}
              <div className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1A0E1C] border border-white/10 shadow-lg flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400">
                  <span className="uppercase text-[#FF7A45] font-bold">{q?.subject}</span>
                  <span>{q?.topic}</span>
                </div>
                <h3 className="font-poppins font-bold text-sm sm:text-lg text-white leading-snug mb-1">
                  {q?.prompt || 'Soru yükleniyor...'}
                </h3>
              </div>

              {/* 14 İnteraktif Mekaniğin Tamamını Destekleyen QuestionRenderer */}
              {q && (
                <div className="flex-1 flex flex-col justify-start sm:justify-center">
                  <QuestionRenderer
                    key={q.id}
                    question={q}
                    onSubmit={handleStudentSubmit}
                    disabled={false}
                  />
                </div>
              )}

              {/* Boş Bırak / Geç Butonu */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handlePass}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-semibold text-zinc-400 hover:text-white transition-all text-center"
                >
                  ⏭️ Bu Soruyu Boş Bırak / Pas Geç
                </button>
              </div>
            </>
          )}
        </main>

        <footer className="max-w-lg mx-auto w-full text-center text-[10px] text-zinc-500 pb-1 hidden sm:block">
          Hızlı ve doğru cevap ekstra hız bonusu kazandırır!
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 4. RAUNT SONU AŞAMASI (room.status === 'INTERMISSION')
  // =========================================================================
  if (room.status === 'INTERMISSION') {
    const isCorrect = myPlayer?.lastRoundCorrect || false;
    const pointsGained = myPlayer?.lastRoundPoints || 0;
    const q: Question | null = (((room.currentQuestion as any)?.interactiveQuestion || room.currentQuestion) as Question) || null;

    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-4 sm:p-6 font-sans relative">
        <header className="flex items-center justify-between gap-2 max-w-md mx-auto w-full pb-2">
          <span className="text-xs font-mono text-zinc-400">Soru {room.currentQuestionIndex + 1} Sonucu</span>
          <span className="text-xs font-mono font-bold text-amber-400">
            Sınıfta #{myRank} / {room.leaderboard?.length || 1}
          </span>
        </header>

        <main className="max-w-md mx-auto w-full py-6 flex flex-col gap-5 items-center text-center">
          {/* Dev Doğru / Kısmi Doğru / Yanlış Kartı */}
          <div
            className={`w-full p-8 rounded-3xl border-2 shadow-2xl flex flex-col items-center gap-3 animate-scale-up ${
              isCorrect
                ? 'bg-gradient-to-b from-emerald-950/60 via-[#1A0E1C] to-black border-emerald-500 shadow-emerald-950/50'
                : pointsGained > 0
                ? 'bg-gradient-to-b from-amber-950/60 via-[#1A0E1C] to-black border-amber-500 shadow-amber-950/50'
                : 'bg-gradient-to-b from-red-950/60 via-[#1A0E1C] to-black border-red-500 shadow-red-950/50'
            }`}
          >
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
                isCorrect
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : pointsGained > 0
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-12 h-12" />
              ) : pointsGained > 0 ? (
                <Sparkles className="w-12 h-12 text-amber-400" />
              ) : (
                <XCircle className="w-12 h-12" />
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-poppins text-white">
              {isCorrect
                ? 'HARİKA! DOĞRU CEVAP'
                : pointsGained > 0
                ? '⚡ KISMİ DOĞRU!'
                : 'YANLIŞ CEVAP'}
            </h2>

            <span className="text-xl sm:text-2xl font-mono font-black text-amber-400">
              {pointsGained > 0 ? `+${pointsGained} Puan` : '0 Puan'}
            </span>
          </div>

          {/* Oyuncu Durum Özeti */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-3.5 rounded-2xl bg-[#1A0E1C] border border-white/10 text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Toplam Puan</span>
              <span className="font-mono font-black text-lg text-amber-300">
                {myPlayer?.score || 0}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#1A0E1C] border border-white/10 text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Seri / Streak</span>
              <span className="font-mono font-bold text-lg text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400" />
                <span>{myPlayer?.streak || 0}x</span>
              </span>
            </div>
          </div>

          {/* Akıllı Tahta Yönlendirme Kartı */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1A0E1C] via-[#241026] to-[#120713] border border-orange-500/40 text-left text-xs sm:text-sm text-white w-full flex items-center gap-3 shadow-lg">
            <span className="text-2xl shrink-0">👀</span>
            <div className="min-w-0 flex-1">
              <span className="font-poppins font-bold text-orange-400 block mb-0.5">
                Akıllı Tahtaya Bak!
              </span>
              <p className="text-zinc-300 text-xs leading-relaxed">
                Doğru cevap ve detaylı çözüm şu an <strong>akıllı tahtada</strong> gösteriliyor.
              </p>
            </div>
          </div>

          {/* Bekleme İpucu */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Öğretmenin akıllı tahtadan sonraki soruyu başlatması bekleniyor...</span>
          </div>
        </main>

        <footer className="max-w-md mx-auto w-full text-center text-xs text-zinc-500 pb-2">
          Gözün akıllı tahtada olsun!
        </footer>
      </div>
    );
  }

  // =========================================================================
  // 5. FİNAL KARNESİ (room.status === 'FINISHED')
  // =========================================================================
  if (room.status === 'FINISHED') {
    const isWinner = myRank === 1;

    return (
      <div className="min-h-screen bg-[#110712] text-white flex flex-col justify-between p-4 sm:p-6 font-sans relative">
        <header className="text-center pt-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            YARIŞMA SONA ERDİ
          </span>
          <h1 className="text-xl font-black font-poppins text-white">Yarışma Karnen</h1>
        </header>

        <main className="max-w-md mx-auto w-full py-6 flex flex-col items-center gap-6 text-center">
          <div
            className={`w-full p-8 rounded-3xl border-2 shadow-2xl flex flex-col items-center gap-3 ${
              isWinner
                ? 'bg-gradient-to-b from-amber-950/60 via-[#1A0E1C] to-black border-amber-400'
                : 'bg-gradient-to-b from-[#1A0E1C] to-black border-white/15'
            }`}
          >
            <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>

            <h2 className="text-3xl font-black font-poppins text-white">
              {isWinner ? '🏆 1. Oldun! Tebrikler!' : `Sınıfta #${myRank}. Oldun`}
            </h2>

            <span className="text-2xl font-mono font-black text-amber-300">
              {myPlayer?.score || 0} Puan
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-4 rounded-2xl bg-[#1A0E1C] border border-white/10">
              <span className="text-xs text-zinc-400 block font-mono">Doğru Sayısı</span>
              <span className="font-mono font-black text-xl text-emerald-400">
                {myPlayer?.correctCount || 0}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A0E1C] border border-white/10">
              <span className="text-xs text-zinc-400 block font-mono">Yanlış Sayısı</span>
              <span className="font-mono font-black text-xl text-red-400">
                {myPlayer?.wrongCount || 0}
              </span>
            </div>
          </div>

          {onExit && (
            <button
              onClick={onExit}
              className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-poppins font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Ana Menüye Dön</span>
            </button>
          )}
        </main>

        <footer className="max-w-md mx-auto w-full text-center text-xs text-zinc-500 pb-2">
          İşler Teknoloji Sınıf Yarışması
        </footer>
      </div>
    );
  }

  return null;
};

export default KahootPlayerView;
