import React, { useState } from 'react';
import {
  useBackendGame,
} from './services/backendSocket';
import { BACKEND_GAME_DATA } from './data/backendMockData';
import { Question } from './types/game';
import { getRecommendationsForTopic } from './utils/resourceRecommendations';
import LiveDuelScreen from './components/game/LiveDuelScreen';
import GameScreen from './components/game/GameScreen';
import {
  Swords,
  Flame,
  Sparkles,
  Code2,
  Trophy,
  Coins,
  Clock,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  FastForward,
  BarChart3,
  Tag,
  Shield,
  Check,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

type ActiveTab = 'matchmaking' | 'economy' | 'tournaments' | 'revision';

export default function App() {
  const {
    isConnected,
    windowNum,
    currentPlayerId,
    selectPlayer,
    backendState,
    currentPlayer,
    myQueueEntry,
    isQueueing,
    activeDuel,
    roundResultEvent,
    duelSummary,
    queueError,
    joinQueue,
    leaveQueue,
    fastForwardQueue,
    submitDuelAnswer,
    readyForNextRound,
    exitDuel,
    claimWeeklyReward,
    convertCoins,
    simulate15Matches,
    joinTournament,
    distributeTournamentRewards,
    updatePlayerDemo,
    resetDemo,
    clearRevisionTopic,
  } = useBackendGame();

  // Sekme yönetimi
  const [activeTab, setActiveTab] = useState<ActiveTab>('matchmaking');
  const [revisionSubjectFilter, setRevisionSubjectFilter] = useState<string>('all');

  // Geliştirici Soru Test Menüsü (Local Simulation)
  const [forcedQuestions, setForcedQuestions] = useState<Question[] | undefined>(undefined);
  const [showDevMenu, setShowDevMenu] = useState<boolean>(false);
  const [devSubjectFilter, setDevSubjectFilter] = useState<'all' | 'fizik' | 'kimya' | 'biyoloji' | 'matematik' | 'turkce'>('all');

  // Eşleştirme Formu Ayarları
  const [selectedExamType, setSelectedExamType] = useState<'TYT' | 'AYT'>('TYT');
  const [selectedMode, setSelectedMode] = useState<'ranked' | 'tournament'>('ranked');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['matematik', 'fizik', 'kimya']);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('tour-tyt-1');

  // Demo ELO & Streak Güncelleme Modalı
  const [showEloModal, setShowEloModal] = useState<boolean>(false);
  const [editElo, setEditElo] = useState<number>(currentPlayer?.elo || 1200);
  const [editStreak, setEditStreak] = useState<number>(currentPlayer?.streak || 0);

  // Coin Dönüştürme State
  const [coinsToConvert, setCoinsToConvert] = useState<number>(100);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // 1. CANLI SOCKET DÜELLO EKRANI (Sunucuda maç varsa)
  if (activeDuel || duelSummary) {
    return (
      <LiveDuelScreen
        currentPlayerId={currentPlayerId}
        activeDuel={activeDuel}
        roundResultEvent={roundResultEvent}
        duelSummary={duelSummary}
        onSubmitAnswer={submitDuelAnswer}
        onReadyForNextRound={readyForNextRound}
        onExit={exitDuel}
      />
    );
  }

  // 2. GELİŞTİRİCİ SORU TEST MODU (Forced Questions ile yerel simülasyon)
  if (forcedQuestions && forcedQuestions.length > 0) {
    return (
      <GameScreen
        forcedQuestions={forcedQuestions}
        playerId={currentPlayerId}
        onExit={() => setForcedQuestions(undefined)}
      />
    );
  }

  const allSubjects = [
    { id: 'matematik', label: 'Matematik' },
    { id: 'fizik', label: 'Fizik' },
    { id: 'kimya', label: 'Kimya' },
    { id: 'biyoloji', label: 'Biyoloji' },
    { id: 'turkce', label: 'Türkçe' },
  ];

  const toggleSubject = (subjId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjId) ? prev.filter((s) => s !== subjId) : [...prev, subjId]
    );
  };

  const handleStartQueue = () => {
    if (selectedSubjects.length === 0) {
      showToast('En az bir ders seçmelisiniz!');
      return;
    }
    joinQueue({
      examType: selectedExamType,
      subjects: selectedSubjects,
      mode: selectedMode,
      tournamentId: selectedMode === 'tournament' ? selectedTournamentId : null,
    });
  };

  const handleOpenSecondWindow = () => {
    const targetPlayer = currentPlayerId === 'p2' ? 'p3' : 'p2';
    window.open(`/?window=2&player=${targetPlayer}`, '_blank');
  };

  const handleSaveDemoElo = async () => {
    await updatePlayerDemo({
      playerId: currentPlayerId,
      elo: Number(editElo),
      streak: Number(editStreak),
    });
    setShowEloModal(false);
    showToast(`Oyuncu verileri güncellendi! ELO: ${editElo}, Seri: ${editStreak}`);
  };

  const handleConvertCoins = async () => {
    if (coinsToConvert < 100) {
      showToast('En az 100 Coin dönüştürebilirsiniz!');
      return;
    }
    const res = await convertCoins(coinsToConvert, currentPlayerId);
    if (res.ok) {
      showToast(`Tebrikler! ${coinsToConvert} Coin karşılığında ${res.islerPointsAwarded} İşler Puanı ve indirim kuponu kazandınız!`);
    } else {
      showToast(res.reason || 'Dönüştürme başarısız oldu.');
    }
  };

  const handleClaimWeekly = async () => {
    const res = await claimWeeklyReward(currentPlayerId);
    if (res.ok) {
      showToast(`Tebrikler! ${res.rewardCoins} Coin haftalık lig ödülü hesabınıza eklendi!`);
    } else {
      showToast(res.reason || 'Haftalık ödül henüz alınamaz.');
    }
  };

  const handleSimulate15Matches = async () => {
    const res = await simulate15Matches(currentPlayerId);
    if (res.ok) {
      showToast('15 maç başarıyla simüle edildi! Şimdi haftalık lig ödülünü alabilirsiniz.');
    }
  };

  const handleReset = async () => {
    await resetDemo();
    showToast('Tüm demo durumu ve kuyruklar sıfırlandı.');
  };

  const filteredDevQuestions =
    devSubjectFilter === 'all'
      ? BACKEND_GAME_DATA.questionPool
      : BACKEND_GAME_DATA.questionPool.filter((q) => q.subject === devSubjectFilter);

  return (
    <div className="min-h-screen bg-[#150A16] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Arka plan parlama efektleri (Orange Glow) */}
      <div className="hero-button-blur -top-24 -left-24 opacity-35 pointer-events-none" />
      <div className="hero-button-blur -bottom-24 -right-24 opacity-25 pointer-events-none" />

      {/* Üst Bar (Header) */}
      <header className="border-b border-[rgba(241,78,19,0.25)] bg-[rgba(26,14,28,0.92)] backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Sol: Logo ve Pencere Rozeti */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F14E13] to-[#D6400D] flex items-center justify-center shadow-lg shadow-[#F14E13]/30">
              <Swords className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-poppins font-black text-lg sm:text-xl tracking-tight">
                  İŞLER TEKNOLOJİ <span className="text-[#F14E13] text-sm font-bold">ARENA</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F14E13]/20 text-[#F14E13] border border-[#F14E13]/40">
                  Pencere {windowNum}
                </span>
                <span
                  className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
                  {isConnected ? 'Canlı Socket' : 'Bağlanıyor...'}
                </span>
              </div>
              <p className="text-xs text-[#B5CBC8]">1v1 Düello • Momentum Eşleştirme • İşler Sadakat Ekonomisi</p>
            </div>
          </div>

          {/* Sağ: Aktif Oyuncu Dropdown + Aksiyon Butonları */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Oyuncu Seçici */}
            <div className="flex items-center gap-1.5 bg-[#0F0510] border border-white/10 rounded-xl px-2.5 py-1.5">
              <img
                src={currentPlayer.avatarUrl}
                alt={currentPlayer.name}
                className="w-6 h-6 rounded-lg border border-[#F14E13]"
              />
              <select
                value={currentPlayerId}
                onChange={(e) => selectPlayer(e.target.value)}
                className="bg-transparent text-xs font-poppins font-semibold text-white focus:outline-none cursor-pointer pr-1"
              >
                {backendState.players.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#1A0E1C] text-white">
                    {p.name} ({p.elo} ELO, S:{p.streak > 0 ? `+${p.streak}` : p.streak})
                  </option>
                ))}
              </select>
            </div>

            {/* Yan Yana 2. Pencere Aç Butonu */}
            <button
              onClick={handleOpenSecondWindow}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/50 flex items-center gap-1.5 transition-all"
              title="İki ayrı pencerede karşılıklı oynamak için 2. oyuncuyu açar"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Yan Yana 2. Pencere Aç</span>
            </button>

            {/* Soru Test Menüsü */}
            <button
              onClick={() => setShowDevMenu(true)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-[rgba(241,78,19,0.3)] bg-[#1A0E1C] text-[#B5CBC8] hover:text-white hover:border-[#F14E13] flex items-center gap-1.5 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-[#F14E13]" />
              <span className="hidden md:inline">Soru Test Menüsü (18)</span>
            </button>

            {/* Demo Sıfırla */}
            <button
              onClick={handleReset}
              className="text-xs font-mono px-2.5 py-1.5 rounded-xl border border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:text-red-400 hover:border-red-500/40 transition-all"
              title="Kuyruk ve oyuncu durumlarını sıfırlar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Ana Sekme Barı */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 border-t border-white/5 pt-2">
          <button
            onClick={() => setActiveTab('matchmaking')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-poppins font-bold flex items-center gap-2 transition-all ${
              activeTab === 'matchmaking'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>1v1 Düello & Momentum Eşleştirme</span>
            {isQueueing && (
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('economy')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-poppins font-bold flex items-center gap-2 transition-all ${
              activeTab === 'economy'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Haftalık Lig & İşler Sadakat Mağazası</span>
            <span className="text-[11px] font-mono font-normal opacity-80">
              ({currentPlayer.coins} Coin)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-poppins font-bold flex items-center gap-2 transition-all ${
              activeTab === 'tournaments'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Haftalık Turnuvalar</span>
            <span className="text-[11px] font-mono font-normal opacity-80">
              ({backendState.tournaments.length} Aktif)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('revision')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-poppins font-bold flex items-center gap-2 transition-all ${
              activeTab === 'revision'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Revize Konularım</span>
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                (currentPlayer.revisionTopics?.length || 0) > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'opacity-80'
              }`}
            >
              {currentPlayer.revisionTopics?.length || 0} Başlık
            </span>
          </button>
        </div>
      </header>

      {/* Bildirim Toast */}
      {actionMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-gradient-to-r from-orange-600 to-[#F14E13] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Kuyruk Hatası Toast */}
      {queueError && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-red-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{queueError}</span>
        </div>
      )}

      {/* ANA İÇERİK ALANI */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* =========================================================================
         * SEKME 1: 1v1 DÜELLO & MOMENTUM EŞLEŞTİRME
         * ========================================================================= */}
        {activeTab === 'matchmaking' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SOL KOLON: Aktif Oyuncu Kartı & Eşleştirme Formu (7 Kolon) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Aktif Oyuncu Kartı */}
              <div className="game-card p-6 border-orange-500/40 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={currentPlayer.avatarUrl}
                        alt={currentPlayer.name}
                        className="w-20 h-20 rounded-2xl border-2 border-[#F14E13] shadow-lg shadow-[#F14E13]/30 bg-[#0F0510] object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-[#F14E13] text-white text-[10px] font-poppins font-bold px-2 py-0.5 rounded-full">
                        SEN
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-poppins font-bold text-lg sm:text-xl text-white">
                          {currentPlayer.name}
                        </h2>
                        <span
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${currentPlayer.bracket.badgeColor}22`,
                            color: currentPlayer.bracket.badgeColor,
                            border: `1px solid ${currentPlayer.bracket.badgeColor}66`,
                          }}
                        >
                          {currentPlayer.bracket.tierName}
                        </span>
                      </div>
                      <p className="text-xs text-[#B5CBC8] mt-0.5 font-mono">{currentPlayer.roleTag || 'Aktif Yarışmacı'}</p>

                      <div className="flex items-center gap-3 text-xs font-mono mt-2 flex-wrap">
                        <span className="text-[#F14E13] font-bold bg-[#F14E13]/10 px-2 py-0.5 rounded border border-[#F14E13]/25">
                          {currentPlayer.elo} Gerçek ELO
                        </span>
                        <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/25">
                          {currentPlayer.effectiveMmr} MMR<sub>eff</sub>
                        </span>
                        <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                          <Flame className="w-3.5 h-3.5 fill-amber-400" />
                          {currentPlayer.streak > 0 ? `+${currentPlayer.streak}` : currentPlayer.streak} Seri
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ELO/Seri Değiştir Butonu */}
                  <button
                    onClick={() => {
                      setEditElo(currentPlayer.elo);
                      setEditStreak(currentPlayer.streak);
                      setShowEloModal(true);
                    }}
                    className="shrink-0 text-xs font-mono px-3 py-2 rounded-xl border border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:text-white hover:border-[#F14E13] transition-all"
                  >
                    ✏️ ELO/Seri Değiştir
                  </button>
                </div>

                {/* Oyuncunun Pekiştiremediği Konu Başlıkları Hızlı Erişim Bandı */}
                {currentPlayer.revisionTopics && currentPlayer.revisionTopics.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-poppins font-bold text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Revize Edilmesi Gereken Konu Başlıkların ({currentPlayer.revisionTopics.length}):</span>
                      </span>
                      <button
                        onClick={() => setActiveTab('revision')}
                        className="text-[11px] font-mono font-semibold text-[#F14E13] hover:underline"
                      >
                        Tüm Yanlış Soruları & Çözümleri Gör →
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {currentPlayer.revisionTopics.map((rev) => (
                        <button
                          key={`${rev.subject}-${rev.topic}`}
                          onClick={() => {
                            setRevisionSubjectFilter(rev.subject);
                            setActiveTab('revision');
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-200 hover:border-[#F14E13] transition-all"
                        >
                          <span className="uppercase font-mono text-[10px] text-[#F14E13] font-bold">
                            {rev.subject}:
                          </span>
                          <span>{rev.topic}</span>
                          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-mono text-[10px] font-bold">
                            {rev.mistakeCount}✗
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Eşleştirme Ayarları ve Kuyruk Butonları */}
              <div className="game-card p-6 flex flex-col gap-5">
                <h3 className="font-poppins font-bold text-base text-white flex items-center gap-2">
                  <Swords className="w-4 h-4 text-[#F14E13]" />
                  <span>1v1 Karşılaşma Ayarları</span>
                </h3>

                {/* Mod Seçimi (Dereceli / Turnuva) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider">
                    Oyun Modu
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedMode('ranked')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMode === 'ranked'
                          ? 'border-[#F14E13] bg-[#F14E13]/15 text-white'
                          : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20'
                      }`}
                    >
                      <div className="font-poppins font-bold text-xs sm:text-sm">⚔️ Dereceli Lig</div>
                      <div className="text-[11px] opacity-70 mt-0.5">Momentum & ELO Puanlı Karşılaşma</div>
                    </button>

                    <button
                      onClick={() => setSelectedMode('tournament')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedMode === 'tournament'
                          ? 'border-[#F14E13] bg-[#F14E13]/15 text-white'
                          : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20'
                      }`}
                    >
                      <div className="font-poppins font-bold text-xs sm:text-sm">🏆 Turnuva Maçı</div>
                      <div className="text-[11px] opacity-70 mt-0.5">Turnuva Puanı & Büyük Ödül</div>
                    </button>
                  </div>
                </div>

                {/* Sınav Tipi (TYT / AYT) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider">
                    Sınav Kategorisi
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedExamType('TYT')}
                      className={`py-2.5 px-4 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-all ${
                        selectedExamType === 'TYT'
                          ? 'border-[#F14E13] bg-[#F14E13]/20 text-[#F14E13]'
                          : 'border-white/10 bg-[#0F0510] text-[#B5CBC8]'
                      }`}
                    >
                      TYT (Temel Yeterlilik)
                    </button>
                    <button
                      onClick={() => setSelectedExamType('AYT')}
                      className={`py-2.5 px-4 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-all ${
                        selectedExamType === 'AYT'
                          ? 'border-[#F14E13] bg-[#F14E13]/20 text-[#F14E13]'
                          : 'border-white/10 bg-[#0F0510] text-[#B5CBC8]'
                      }`}
                    >
                      AYT (Alan Yeterlilik)
                    </button>
                  </div>
                </div>

                {/* Ders Seçimi */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider">
                      Ders Seçimi (Ortak Dersler Eşleştirilir)
                    </label>
                    <span className="text-[11px] font-mono text-orange-400">
                      {selectedSubjects.length} Seçili
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allSubjects.map((sub) => {
                      const isSel = selectedSubjects.includes(sub.id);
                      return (
                        <button
                          key={sub.id}
                          onClick={() => toggleSubject(sub.id)}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                            isSel
                              ? 'border-[#F14E13] bg-[#F14E13]/20 text-white'
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

                {/* Turnuva ID Seçici (Eğer tournament seçildiyse) */}
                {selectedMode === 'tournament' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider">
                      Turnuva Seçimi
                    </label>
                    <select
                      value={selectedTournamentId}
                      onChange={(e) => setSelectedTournamentId(e.target.value)}
                      className="bg-[#0F0510] border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none"
                    >
                      {backendState.tournaments.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} ({t.examType})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Kuyruk Kontrol Butonları */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {!isQueueing ? (
                    <button
                      onClick={handleStartQueue}
                      className="btn-primary w-full sm:flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F14E13]/30"
                    >
                      <Swords className="w-4 h-4" />
                      <span>Eşleştirmeye Katıl (Kuyruğa Gir)</span>
                    </button>
                  ) : (
                    <button
                      onClick={leaveQueue}
                      className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Kuyruktan Çık</span>
                      <span className="font-mono text-xs opacity-75">
                        ({myQueueEntry?.waitSeconds ?? 0}s)
                      </span>
                    </button>
                  )}

                  {/* ⏱️ Kuyruk Süresini +5sn İlerlet Butonu */}
                  <button
                    onClick={() => fastForwardQueue(5)}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all"
                    title="Kuyruk bekleme süresini 5 saniye ileri alarak tolerans genişlemesi ve Ghost Bot eşleşmesini test edin"
                  >
                    <FastForward className="w-4 h-4 text-amber-400" />
                    <span>⏱️ Kuyruğu +5sn İlerlet</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SAĞ KOLON: Canlı Kuyruk ve Momentum Teşhis Tablosu (5 Kolon) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Canlı Kuyruk Durumu */}
              <div className="game-card p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-bold text-sm text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#F14E13]" />
                    <span>Canlı Kuyruk ({backendState.queueSnapshot.length} Oyuncu)</span>
                  </h3>
                  {isQueueing && (
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Sıradasın ({myQueueEntry?.waitSeconds || 0}s)
                    </span>
                  )}
                </div>

                {backendState.queueSnapshot.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#B5CBC8]/60 font-mono bg-[#0F0510]/60 rounded-xl border border-white/5">
                    Şu an kuyrukta bekleyen oyuncu yok.
                    <br />
                    Kuyruğa girin veya 2. pencereyi açarak yan yana test edin!
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                    {backendState.queueSnapshot.map((q) => {
                      const isMe = q.playerId === currentPlayerId;
                      return (
                        <div
                          key={q.playerId}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                            isMe
                              ? 'bg-[#F14E13]/10 border-[#F14E13]/40 text-white'
                              : 'bg-[#0F0510] border-white/5 text-[#B5CBC8]'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{q.name}</span>
                              {isMe && (
                                <span className="bg-[#F14E13] text-white text-[9px] font-bold px-1.5 rounded">
                                  SEN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono opacity-80 mt-0.5">
                              {q.examType} • {q.subjects.join(', ')} • {q.elo} ELO (S:{q.streak})
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-amber-400 font-bold">{q.waitSeconds ?? 0}s</span>
                            <div className="text-[10px] text-zinc-500">
                              {q.waitSeconds && q.waitSeconds >= 30 ? 'Ghost Hazır' : 'Bekliyor'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Momentum Eşleştirme Teşhis Tablosu */}
              <div className="game-card p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-bold text-sm text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span>Momentum Teşhis Motoru</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#B5CBC8] bg-white/5 px-2 py-0.5 rounded">
                    ΔMMR<sub>eff</sub> Analizi
                  </span>
                </div>

                {backendState.pairDiagnostics.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#B5CBC8]/60 font-mono bg-[#0F0510]/60 rounded-xl border border-white/5">
                    Kuyrukta 2 veya daha fazla oyuncu olduğunda ikili tolerans ve momentum teşhisleri burada canlı akar.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {backendState.pairDiagnostics.map((diag, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 ${
                          diag.matched
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                            : 'bg-[#0F0510] border-white/5 text-[#B5CBC8]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-white">
                            {diag.playerAName} <span className="text-zinc-500">vs</span> {diag.playerBName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              diag.matched
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {diag.matched ? 'EŞLEŞTİ ✓' : 'BEKLİYOR'}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1 font-mono text-[11px] opacity-80">
                          <div>ΔGerçek ELO: {diag.deltaRealElo ?? '-'}</div>
                          <div>ΔMMR<sub>eff</sub>: {diag.deltaEffectiveMmr ?? '-'}</div>
                          <div>Tolerans: ±{diag.streakTolerance ?? '-'}</div>
                        </div>

                        {diag.reason && (
                          <div className="text-[10px] text-zinc-400 italic">
                            Sebep: {diag.reason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * SEKME 2: HAFTALIK LİG & İŞLER SADAKAT MAĞAZASI
         * ========================================================================= */}
        {activeTab === 'economy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SOL: Haftalık 15 Maç & Lig Seviyesi (7 Kolon) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* 15 Maç İlerleme Kartı */}
              <div className="game-card p-6 flex flex-col gap-4 border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-poppins font-bold text-base text-white">
                      Haftalık 15 Maç Görevi
                    </h3>
                    <p className="text-xs text-[#B5CBC8]">
                      Her hafta lig ödülünü alabilmek için en az 15 maç tamamlanmalıdır.
                    </p>
                  </div>
                  <span className="font-mono font-bold text-lg text-[#F14E13]">
                    {currentPlayer.weeklyMatchesPlayed} / 15
                  </span>
                </div>

                {/* İlerleme Barı */}
                <div className="w-full bg-[#0F0510] h-3 rounded-full overflow-hidden border border-white/5 relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#F14E13] to-amber-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (currentPlayer.weeklyMatchesPlayed / 15) * 100)}%`,
                    }}
                  />
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleSimulate15Matches}
                    className="text-xs font-mono px-3.5 py-2 rounded-xl border border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:text-white hover:border-[#F14E13] transition-all"
                  >
                    ⚡ +15 Maç Simüle Et
                  </button>

                  <button
                    onClick={handleClaimWeekly}
                    disabled={currentPlayer.weeklyMatchesPlayed < 15 || currentPlayer.weeklyRewardClaimed}
                    className={`btn-primary flex-1 py-2 px-4 text-xs font-bold ${
                      currentPlayer.weeklyMatchesPlayed < 15 || currentPlayer.weeklyRewardClaimed
                        ? 'opacity-40 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {currentPlayer.weeklyRewardClaimed
                      ? '✓ Haftalık Ödül Alındı'
                      : `🎁 Haftalık Lig Ödülünü Al (+${currentPlayer.bracket.weeklyCoins} Coin)`}
                  </button>
                </div>
              </div>

              {/* Haftalık ELO Lig Tablosu */}
              <div className="game-card p-5 flex flex-col gap-3">
                <h3 className="font-poppins font-bold text-sm text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Haftalık ELO Lig Kademeleri</span>
                </h3>

                <div className="divide-y divide-white/5">
                  {backendState.weeklyBrackets.map((br) => {
                    const isMyTier = currentPlayer.bracket.tierName === br.tierName;
                    return (
                      <div
                        key={br.tierName}
                        className={`py-3 px-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                          isMyTier ? 'bg-[#F14E13]/15 border border-[#F14E13]/40' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: br.badgeColor }}
                          />
                          <div>
                            <span className="font-bold text-white">{br.tierName}</span>
                            <div className="text-[11px] font-mono text-[#B5CBC8]">
                              {br.minElo} - {br.maxElo === Infinity ? 'Üstü' : br.maxElo} ELO
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className="font-bold text-amber-400">+{br.weeklyCoins} Coin</span>
                          <div className="text-[10px] text-[#B5CBC8]">Haftalık Ödül</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SAĞ: Coin -> İşler Puanı Dönüştürücü & Kuponlar (5 Kolon) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Dönüştürücü Kartı */}
              <div className="game-card p-6 flex flex-col gap-4 border-amber-500/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-bold text-base text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Coin ➔ İşler Sadakat Puanı</span>
                  </h3>
                </div>

                <p className="text-xs text-[#B5CBC8] leading-relaxed">
                  Düellolardan ve haftalık ligden kazandığınız Coin'leri, İşler Kitabevi şubelerinde geçerli indirim kuponlarına dönüştürün!
                  <br />
                  <span className="font-mono text-amber-400 font-bold">100 Coin = 10 İşler Puanı (%10 İndirim)</span>
                </p>

                <div className="flex items-center gap-2 bg-[#0F0510] p-3 rounded-xl border border-white/10">
                  <Coins className="w-5 h-5 text-amber-400 shrink-0" />
                  <input
                    type="number"
                    step="50"
                    min="100"
                    max={currentPlayer.coins}
                    value={coinsToConvert}
                    onChange={(e) => setCoinsToConvert(Number(e.target.value))}
                    className="w-full bg-transparent text-white font-mono font-bold text-sm focus:outline-none"
                    placeholder="Dönüştürülecek Coin"
                  />
                  <span className="text-xs font-mono text-[#B5CBC8] shrink-0">
                    Mevcut: {currentPlayer.coins}
                  </span>
                </div>

                <button
                  onClick={handleConvertCoins}
                  disabled={currentPlayer.coins < 100}
                  className="btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>Kupon Üret ({Math.floor(coinsToConvert / 10)} Puan)</span>
                </button>
              </div>

              {/* Kazanılan Kuponlar */}
              <div className="game-card p-5 flex flex-col gap-3">
                <h3 className="font-poppins font-bold text-sm text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#F14E13]" />
                  <span>İşler Kitabevi Kuponlarım ({currentPlayer.coupons?.length || 0})</span>
                </h3>

                {!currentPlayer.coupons || currentPlayer.coupons.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#B5CBC8]/60 font-mono bg-[#0F0510]/60 rounded-xl border border-white/5">
                    Henüz oluşturulmuş kuponunuz yok.
                    <br />
                    Coin'lerinizi dönüştürerek indirim kuponu kazanın!
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                    {currentPlayer.coupons.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#0F0510] border border-orange-500/30 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-mono font-bold text-orange-400">{c.code}</div>
                          <div className="text-[11px] text-[#B5CBC8]">{c.description}</div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-emerald-400 font-bold">%{c.discountPercent} İndirim</span>
                          <div className="text-[10px] text-zinc-500">{c.pointsSpent} Puan</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * SEKME 3: HAFTALIK TURNUVALAR
         * ========================================================================= */}
        {activeTab === 'tournaments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {backendState.tournaments.map((t) => (
              <div key={t.id} className="game-card p-6 flex flex-col gap-5 border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-poppins font-bold text-base text-white">{t.title}</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        {t.examType}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400 font-mono mt-1">{t.prizePoolDesc}</p>
                  </div>
                </div>

                {/* Katılımcı Tablosu */}
                <div className="bg-[#0F0510] rounded-xl border border-white/5 overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-white/5 flex justify-between text-[11px] font-mono text-[#B5CBC8]">
                    <span>Katılımcı / Sıra</span>
                    <span>Puan • G/M</span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {t.participants.map((p, idx) => {
                      const isMe = p.playerId === currentPlayerId;
                      return (
                        <div
                          key={p.playerId}
                          className={`px-3.5 py-2.5 flex items-center justify-between text-xs ${
                            isMe ? 'bg-[#F14E13]/10 text-white font-semibold' : 'text-[#B5CBC8]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-zinc-500">#{idx + 1}</span>
                            <span>{p.name}</span>
                            {isMe && (
                              <span className="bg-[#F14E13] text-white text-[9px] font-bold px-1 rounded">
                                SEN
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-right">
                            <span className="text-amber-400 font-bold">{p.points} Puan</span>
                            <span className="text-[10px] text-zinc-500 ml-2">
                              ({p.wins}G / {p.losses}M)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Turnuva Aksiyonları */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      const res = await joinTournament(t.id, currentPlayerId);
                      if (res.ok) showToast('Turnuvaya başarıyla katıldınız!');
                    }}
                    className="text-xs font-semibold px-4 py-2 rounded-xl border border-white/10 bg-[#0F0510] text-white hover:border-[#F14E13] transition-all"
                  >
                    Turnuvaya Kaydol
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMode('tournament');
                      setSelectedTournamentId(t.id);
                      setSelectedExamType(t.examType);
                      setActiveTab('matchmaking');
                      joinQueue({
                        examType: t.examType,
                        subjects: t.allowedSubjects,
                        mode: 'tournament',
                        tournamentId: t.id,
                      });
                    }}
                    className="btn-primary flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Turnuva Maçı Ara</span>
                  </button>

                  <button
                    onClick={async () => {
                      const res = await distributeTournamentRewards(t.id);
                      if (res.ok) showToast('Turnuva ödülleri dereceye girenlere başarıyla dağıtıldı!');
                      else showToast(res.reason || 'Ödüller dağıtılamadı.');
                    }}
                    className="text-xs font-mono px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all"
                    title="Turnuvayı sonlandırıp ilk 3'e Coin & İşler Puanı dağıtır"
                  >
                    🏆 Ödülleri Dağıt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================================
         * SEKME 4: REVİZE EDİLMESİ GEREKEN KONULAR (PEKİŞTİRİLEMEYEN BAŞLIKLAR)
         * ========================================================================= */}
        {activeTab === 'revision' && (
          <div className="flex flex-col gap-6">
            {/* Üst Bilgi ve Konu Başlıkları Özeti */}
            <div className="game-card p-6 border-amber-500/35 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-poppins font-bold text-lg text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#F14E13]" />
                    <span>Revize Edilmesi Gereken Konular & Yanlış Yapılan Sorular</span>
                  </h2>
                  <p className="text-xs text-[#B5CBC8] mt-1">
                    Düellolarda ve soru testlerinde yanlış yanıtladığın sorular otomatik olarak ayırt edilir ve pekiştirmen gereken konu başlıkları altında toplanır.
                  </p>
                </div>

                {currentPlayer.revisionTopics && currentPlayer.revisionTopics.length > 0 && (
                  <button
                    onClick={async () => {
                      await clearRevisionTopic(undefined, currentPlayerId);
                      showToast('Tüm konu başlıkları pekiştirildi olarak işaretlendi!');
                    }}
                    className="shrink-0 text-xs font-mono px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all"
                  >
                    ✓ Tümünü Pekiştirildi İşaretle
                  </button>
                )}
              </div>

              {/* Pekiştirilemeyen Konu Başlıkları Etiket Bulutu */}
              {currentPlayer.revisionTopics && currentPlayer.revisionTopics.length > 0 && (
                <div className="bg-[#0F0510] p-4 rounded-xl border border-white/10 flex flex-col gap-2.5">
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                    📌 Pekiştirilemeyen Konu Başlıkları ({currentPlayer.revisionTopics.length} Başlık):
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {currentPlayer.revisionTopics.map((rev) => (
                      <button
                        key={`tag-${rev.subject}-${rev.topic}`}
                        onClick={() => setRevisionSubjectFilter(rev.subject)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-poppins font-semibold bg-amber-500/15 text-white border border-amber-500/35 hover:border-[#F14E13] transition-all"
                      >
                        <span className="uppercase font-mono text-[10px] text-[#F14E13] font-bold">
                          {rev.subject}
                        </span>
                        <span>•</span>
                        <span>{rev.topic}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-red-500/25 text-red-300 font-mono text-[10px]">
                          {rev.mistakeCount} hata
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ders Filtreleri */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {[
                  { id: 'all', label: 'TÜM DERSLER' },
                  { id: 'matematik', label: 'MATEMATİK' },
                  { id: 'fizik', label: 'FİZİK' },
                  { id: 'kimya', label: 'KİMYA' },
                  { id: 'biyoloji', label: 'BİYOLOJİ' },
                  { id: 'turkce', label: 'TÜRKÇE' },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setRevisionSubjectFilter(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      revisionSubjectFilter === sub.id
                        ? 'bg-[#F14E13] text-white'
                        : 'bg-[#0F0510] text-[#B5CBC8] border border-white/10 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Konu Kartları ve Yanlış Yapılan Sorular */}
            {!currentPlayer.revisionTopics || currentPlayer.revisionTopics.length === 0 ? (
              <div className="game-card p-10 text-center flex flex-col items-center gap-3 border-emerald-500/30">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-poppins font-bold text-base text-white">
                  Şu Anda Revize Edilmesi Gereken Konu Başlığı Yok!
                </h3>
                <p className="text-xs text-[#B5CBC8] max-w-md">
                  1v1 Düellolarda veya Soru Test Menüsünde yanlış yaptığın sorular otomatik olarak burada ilgili konu başlığı altında listelenir.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentPlayer.revisionTopics
                  .filter((rev) => revisionSubjectFilter === 'all' || rev.subject === revisionSubjectFilter)
                  .map((rev) => (
                    <div
                      key={`card-${rev.subject}-${rev.topic}`}
                      className="game-card p-5 border-amber-500/30 flex flex-col justify-between gap-4"
                    >
                      <div className="flex flex-col gap-3">
                        {/* Konu Başlığı Üst Satırı */}
                        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F14E13]/20 text-[#F14E13] border border-[#F14E13]/30">
                                {rev.subject}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#B5CBC8] bg-white/5">
                                {rev.examType}
                              </span>
                            </div>
                            <h3 className="font-poppins font-bold text-base text-amber-300 mt-1.5">
                              {rev.topic}
                            </h3>
                          </div>

                          <span className="px-2.5 py-1 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 font-mono text-xs font-bold shrink-0">
                            {rev.mistakeCount} Yanlış
                          </span>
                        </div>

                        {/* Bu Konu Başlığı Altında Yanlış Yapılan Sorular */}
                        <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                          {rev.wrongQuestions.map((wq) => (
                            <div
                              key={wq.externalId}
                              className="p-3 rounded-xl bg-[#0F0510] border border-white/10 text-xs flex flex-col gap-1.5"
                            >
                              <div className="text-white font-medium leading-relaxed">
                                <span className="text-red-400 font-mono font-bold mr-1.5">✗ Soru:</span>
                                {wq.text}
                              </div>
                              {wq.explanation && (
                                <div className="text-[11px] text-[#B5CBC8] leading-relaxed pt-1.5 border-t border-white/5">
                                  <span className="text-emerald-400 font-semibold mr-1">💡 Çözüm:</span>
                                  {wq.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Bu Konu İçin Kaynak Önerileri (kaynak-onerileri.json) */}
                        {(() => {
                          const recs =
                            rev.recommendedResources && rev.recommendedResources.length > 0
                              ? rev.recommendedResources
                              : getRecommendationsForTopic(rev.subject, rev.topic, rev.examType);
                          if (!recs || recs.length === 0) return null;
                          return (
                            <div className="pt-2.5 border-t border-amber-500/20 flex flex-col gap-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                                <BookOpen className="w-3.5 h-3.5 text-[#F14E13]" />
                                <span>Önerilen Kaynak & Çalışma Rehberi:</span>
                              </div>
                              {recs.map((rec) => (
                                <div
                                  key={rec.id}
                                  className="p-3 rounded-xl bg-[#0F0510] border border-[#F14E13]/30 text-xs flex flex-col gap-1"
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
                          );
                        })()}
                      </div>

                      {/* Aksiyonlar: Bu Derste Pratik Yap / Pekiştirildi İşaretle */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => {
                            setSelectedSubjects([rev.subject]);
                            setActiveTab('matchmaking');
                            showToast(`${rev.topic} (${rev.subject.toUpperCase()}) pekiştirmesi için ders seçildi!`);
                          }}
                          className="btn-primary flex-1 py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>Bu Derste Düelloya Gir</span>
                        </button>

                        <button
                          onClick={async () => {
                            await clearRevisionTopic(rev.topic, currentPlayerId);
                            showToast(`"${rev.topic}" konusu pekiştirildi olarak işaretlendi!`);
                          }}
                          className="px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-mono font-semibold transition-all"
                        >
                          ✓ Pekiştirildi
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
       * MODAL 1: DEMO ELO & SERİ DÜZENLEME MODALI
       * ========================================================================= */}
      {showEloModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="game-card max-w-sm w-full p-6 flex flex-col gap-4 border-orange-500/40 animate-fade-in">
            <h3 className="font-poppins font-bold text-base text-white">
              Demo: ELO & Seri Düzenle
            </h3>
            <p className="text-xs text-[#B5CBC8]">
              {currentPlayer.name} için ELO ve kazanma serisini manuel ayarlayarak momentum etkisini ($MMR_{'{eff}'}$) anında test edin.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#B5CBC8] font-mono">Gerçek ELO (Örn: 1200 - 1800)</label>
              <input
                type="number"
                value={editElo}
                onChange={(e) => setEditElo(Number(e.target.value))}
                className="bg-[#0F0510] border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#B5CBC8] font-mono">Seri (Streak, Örn: +5 veya -4)</label>
              <input
                type="number"
                value={editStreak}
                onChange={(e) => setEditStreak(Number(e.target.value))}
                className="bg-[#0F0510] border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEloModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#B5CBC8] hover:text-white"
              >
                İptal
              </button>
              <button
                onClick={handleSaveDemoElo}
                className="btn-primary px-5 py-2 text-xs font-bold"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * MODAL 2: GELİŞTİRİCİ SORU TEST MENÜSÜ (18 Zengin Soru / 14 Soru Tipi)
       * ========================================================================= */}
      {showDevMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="game-card max-w-3xl w-full p-6 flex flex-col gap-4 border-orange-500/40 max-h-[85vh] overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#F14E13]" />
                <h3 className="font-poppins font-bold text-base text-white">
                  Soru Test Menüsü (14 İnteraktif Soru Tipi • {BACKEND_GAME_DATA.questionPool.length} Soru)
                </h3>
              </div>
              <button
                onClick={() => setShowDevMenu(false)}
                className="text-xs text-[#B5CBC8] hover:text-white font-mono"
              >
                ✕ Kapat
              </button>
            </div>

            {/* Ders Filtreleri */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'fizik', 'kimya', 'biyoloji', 'matematik', 'turkce'] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setDevSubjectFilter(sub)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    devSubjectFilter === sub
                      ? 'bg-[#F14E13] text-white'
                      : 'bg-[#0F0510] text-[#B5CBC8] hover:text-white'
                  }`}
                >
                  {sub.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Soru Listesi */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 pr-1">
              {filteredDevQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-white/5 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-[#F14E13] font-bold">#{idx + 1}</span>
                      <span className="text-[#B5CBC8] uppercase font-semibold">{q.subject}</span>
                      <span className="text-zinc-500">• {q.type}</span>
                    </div>
                    <div className="text-xs font-medium text-white truncate mt-0.5">
                      {q.prompt}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowDevMenu(false);
                      setForcedQuestions([q]);
                    }}
                    className="btn-primary text-xs py-1.5 px-3 shrink-0 flex items-center gap-1"
                  >
                    <span>Test Et</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
