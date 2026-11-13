import { useState, useEffect } from 'react';
import { BACKEND_GAME_DATA } from './data/backendMockData';
import { Question } from './types/game';
import GameScreen from './components/game/GameScreen';
import { Swords, Flame, Sparkles, Play, Search, Code2, ChevronRight, BookOpen } from 'lucide-react';

export default function App() {
  const { players, matchSettings, questionPool } = BACKEND_GAME_DATA;

  // Lobi durumu: 'idle' | 'matching' | 'inGame'
  const [lobbyState, setLobbyState] = useState<'idle' | 'matching' | 'inGame'>('idle');
  const [forcedQuestions, setForcedQuestions] = useState<Question[] | undefined>(undefined);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'all' | 'fizik' | 'kimya' | 'biyoloji' | 'matematik'>('all');
  const [showDevMenu, setShowDevMenu] = useState<boolean>(false);

  // Eşleştirme animasyonu (1.5 saniye sürer)
  useEffect(() => {
    if (lobbyState === 'matching') {
      const timer = setTimeout(() => {
        setLobbyState('inGame');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [lobbyState]);

  // Hızlı Eşleşme Başlat
  const handleStartMatchmaking = () => {
    setForcedQuestions(undefined);
    setLobbyState('matching');
  };

  // Geliştirici Soru Testi Başlat
  const handleStartSingleQuestionTest = (q: Question) => {
    setForcedQuestions([q]);
    setLobbyState('inGame');
  };

  // Maçtan Lobiye Dönüş
  const handleExitToLobby = () => {
    setForcedQuestions(undefined);
    setLobbyState('idle');
  };

  // Eğer maçtaysak GameScreen'i render et
  if (lobbyState === 'inGame') {
    return (
      <GameScreen
        forcedQuestions={forcedQuestions}
        onExit={handleExitToLobby}
      />
    );
  }

  // Filtrelenmiş geliştirici soruları
  const filteredQuestions = selectedSubjectFilter === 'all'
    ? questionPool
    : questionPool.filter(q => q.subject === selectedSubjectFilter);

  return (
    <div className="min-h-screen bg-[#150A16] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Arka plan parlama efektleri (Orange Glow) */}
      <div className="hero-button-blur -top-24 -left-24 opacity-35 pointer-events-none" />
      <div className="hero-button-blur -bottom-24 -right-24 opacity-25 pointer-events-none" />

      {/* Üst Bar / Header */}
      <header className="border-b border-[rgba(241,78,19,0.25)] bg-[rgba(26,14,28,0.85)] backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F14E13] to-[#D6400D] flex items-center justify-center shadow-lg shadow-[#F14E13]/30">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-lg sm:text-xl tracking-tight flex items-center gap-2">
                İŞLER TEKNOLOJİ <span className="text-[#F14E13] text-xs sm:text-sm font-semibold">ARENA '26</span>
              </h1>
              <p className="text-xs text-[#B5CBC8]">1v1 Hızlı Mücadele & Akıllı Soru Motoru</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDevMenu(prev => !prev)}
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[rgba(241,78,19,0.3)] bg-[#1A0E1C] text-[#B5CBC8] hover:text-white hover:border-[#F14E13] flex items-center gap-1.5 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-[#F14E13]" />
              <span className="hidden sm:inline">Soru Test Menüsü</span>
            </button>
            <span className="hero-badge text-xs hidden md:inline-flex">
              <Sparkles className="w-3 h-3" /> {questionPool.length} Soru
            </span>
          </div>
        </div>
      </header>

      {/* Ana Lobi İçeriği */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1 flex flex-col items-center justify-center gap-8">
        {/* 1. EŞLEŞTİRME SİMÜLASYONU MODAL / ANİMASYONU */}
        {lobbyState === 'matching' ? (
          <div className="game-card max-w-md w-full p-8 text-center flex flex-col items-center gap-5 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-t-[#F14E13] border-r-transparent border-b-[#F14E13]/40 border-l-transparent animate-spin flex items-center justify-center" />
              <Search className="w-8 h-8 text-[#F14E13] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>

            <div>
              <h2 className="font-poppins font-bold text-xl text-white">Rakip Aranıyor...</h2>
              <p className="text-xs text-[#B5CBC8] mt-1 font-mono">
                {players.currentPlayer.elo} ELO civarında rakip taranıyor
              </p>
            </div>

            <div className="w-full bg-[#0F0510] h-2 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-[#F14E13] to-amber-400 w-3/4 animate-pulse rounded-full" />
            </div>

            <div className="text-[11px] text-[#B5CBC8]/70">
              Karşılaşma saniyeler içinde başlayacak...
            </div>
          </div>
        ) : (
          /* 2. STANDART LOBİ EKRANI */
          <div className="w-full flex flex-col items-center gap-8">
            {/* Oyuncu Kartı (BACKEND_GAME_DATA'dan Okunur) */}
            <div className="game-card w-full max-w-lg p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 border-orange-500/40">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={players.currentPlayer.avatarUrl}
                    alt={players.currentPlayer.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#F14E13] shadow-lg shadow-[#F14E13]/30 bg-[#0F0510] object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-[#F14E13] text-white text-[10px] font-poppins font-bold px-2 py-0.5 rounded-full">
                    SEN
                  </span>
                </div>

                <div>
                  <h2 className="font-poppins font-bold text-xl text-white">
                    {players.currentPlayer.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-mono mt-1">
                    <span className="text-[#F14E13] font-bold">
                      {players.currentPlayer.elo} ELO
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      {players.currentPlayer.streak} Seri
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                <span className="text-xs text-[#B5CBC8]">Maç Kazancı</span>
                <span className="font-mono text-emerald-400 font-bold text-sm sm:text-base">
                  +{matchSettings.eloWinDelta} ELO
                </span>
                <span className="text-xs text-[#B5CBC8] sm:mt-1">Yenilgi: {matchSettings.eloLossDelta} ELO</span>
              </div>
            </div>

            {/* Büyük Eşleştir Butonu */}
            <div className="flex flex-col items-center gap-3 text-center">
              <button
                onClick={handleStartMatchmaking}
                className="btn-primary text-lg sm:text-xl py-4 px-10 shadow-2xl shadow-[#F14E13]/50 flex items-center gap-3 group"
              >
                <Play className="w-6 h-6 fill-white group-hover:scale-110 transition-transform" />
                <span>1v1 Düello Başlat</span>
              </button>
              <p className="text-xs text-[#B5CBC8]">
                {matchSettings.questionsPerMatch} Soru • Hız Bonusu • Canlı Rakip Düellosu
              </p>
            </div>

            {/* 3. GELİŞTİRİCİ SORU TEST MENÜSÜ */}
            {showDevMenu && (
              <section className="w-full game-card p-6 border-orange-500/25 animate-fade-in">
                <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-[#F14E13]" />
                    <h3 className="font-poppins font-bold text-base text-white">
                      Soru Test Menüsü (Geliştirici İnceleme)
                    </h3>
                  </div>

                  {/* Ders Filtreleri */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['all', 'fizik', 'kimya', 'biyoloji', 'matematik'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSelectedSubjectFilter(tab)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          selectedSubjectFilter === tab
                            ? 'bg-[#F14E13] text-white'
                            : 'bg-[#0F0510] text-[#B5CBC8] hover:text-white'
                        }`}
                      >
                        {tab === 'all' ? 'Tümü' : tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soru Listesi */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {filteredQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl border border-white/10 bg-[#0F0510]/80 hover:bg-[#2A1A2C]/60 hover:border-[#F14E13]/40 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-[#F14E13] font-bold">#{idx + 1}</span>
                          <span className="text-[10px] uppercase font-bold text-[#B5CBC8] bg-white/5 px-1.5 py-0.5 rounded">
                            {q.subject}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 truncate">
                            {q.type}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white mt-1 truncate">
                          {q.topic}
                        </div>
                        <div className="text-[11px] text-[#B5CBC8]/80 line-clamp-1 mt-0.5">
                          {q.prompt}
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartSingleQuestionTest(q)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-[#F14E13]/20 hover:bg-[#F14E13] text-[#F14E13] hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                      >
                        <span>Test Et</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Alt Bilgi */}
      <footer className="border-t border-[rgba(241,78,19,0.15)] bg-[#0F0510] py-3 px-6 text-center text-xs text-[#B5CBC8] flex items-center justify-center gap-2">
        <BookOpen className="w-3.5 h-3.5 text-[#F14E13]" />
        <span>İşler Teknoloji • EdTech Hackathon '26 Game Jam</span>
      </footer>
    </div>
  );
}
