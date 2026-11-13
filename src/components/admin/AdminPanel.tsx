import React, { useState } from 'react';
import {
  BackendFullState,
  BackendPlayer,
} from '../../services/backendSocket';
import { Question } from '../../types/game';
import { ALL_INTERACTIVE_QUESTIONS } from '../../data/allInteractiveQuestions';
import {
  Swords,
  Flame,
  Sparkles,
  Code2,
  Trophy,
  Coins,
  Clock,
  RotateCcw,
  ExternalLink,
  FastForward,
  BarChart3,
  Shield,
  BookOpen,
  Users,
  Play,
  Edit3,
  ArrowRight,
  Layers,
  HelpCircle,
  Eye,
  X,
  GraduationCap,
  Smartphone,
} from 'lucide-react';

export interface AdminPanelProps {
  isConnected: boolean;
  backendState: BackendFullState;
  currentPlayerId: string;
  selectPlayer: (playerId: string) => void;
  fastForwardQueue: (bonusSeconds?: number) => void;
  simulate15Matches: (playerId?: string) => Promise<any>;
  distributeTournamentRewards: (tournamentId: string) => Promise<any>;
  updatePlayerDemo: (opts: { playerId?: string; elo?: number; streak?: number }) => Promise<any>;
  resetDemo: () => Promise<any>;
  onNavigateToStudent: (playerId?: string) => void;
  onNavigateToSmartboard?: () => void;
  onOpenWindow: (url: string) => void;
  onTestQuestion: (question: Question) => void;
}

type AdminTab = 'students' | 'matchmaking' | 'tournaments' | 'questions';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isConnected,
  backendState,
  currentPlayerId,
  selectPlayer,
  fastForwardQueue,
  simulate15Matches,
  distributeTournamentRewards,
  updatePlayerDemo,
  resetDemo,
  onNavigateToStudent,
  onNavigateToSmartboard,
  onOpenWindow,
  onTestQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('students');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // ELO & Seri Düzenleme Modalı
  const [editingPlayer, setEditingPlayer] = useState<BackendPlayer | null>(null);
  const [editElo, setEditElo] = useState<number>(1200);
  const [editStreak, setEditStreak] = useState<number>(0);

  // Soru Test Menüsü & Filtreleri
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleOpenEditModal = (player: BackendPlayer) => {
    setEditingPlayer(player);
    setEditElo(player.elo);
    setEditStreak(player.streak);
  };

  const handleSaveElo = async () => {
    if (!editingPlayer) return;
    await updatePlayerDemo({
      playerId: editingPlayer.id,
      elo: Number(editElo),
      streak: Number(editStreak),
    });
    showToast(`${editingPlayer.name} verileri güncellendi! ELO: ${editElo}, Seri: ${editStreak}`);
    setEditingPlayer(null);
  };

  const handleSimulate15 = async (playerId: string, playerName: string) => {
    const res = await simulate15Matches(playerId);
    if (res?.ok) {
      showToast(`⚡ ${playerName} için 15 maç başarıyla simüle edildi!`);
    } else {
      showToast(res?.reason || '15 maç simülasyonu başarısız.');
    }
  };

  const handleLoginAsStudent = (playerId: string) => {
    localStorage.setItem('isler_selected_player_id', playerId);
    selectPlayer(playerId);
    onNavigateToStudent(playerId);
  };

  const handleOpenSideBySideWindows = () => {
    // 2 Pencereyi yan yana otomatik açar
    const win1Url = `/?window=1&player=p2`;
    const win2Url = `/?window=2&player=p3`;
    window.open(win1Url, 'studentWin1', 'width=520,height=920,left=60,top=30');
    window.open(win2Url, 'studentWin2', 'width=520,height=920,left=600,top=30');
    showToast('Yan yana iki öğrenci penceresi açıldı (p2: Zeynep vs p3: Mert)!');
  };

  const handleDistributeRewards = async (tournamentId: string) => {
    const res = await distributeTournamentRewards(tournamentId);
    if (res?.ok) {
      showToast('🏆 Turnuva ödülleri dereceye girenlere başarıyla dağıtıldı!');
    } else {
      showToast(res?.reason || 'Ödüller dağıtılamadı.');
    }
  };

  const handleResetDemoState = async () => {
    await resetDemo();
    showToast('🔄 Tüm demo durumu, kuyruklar ve maçlar sıfırlandı.');
  };

  // 32 Soruluk Havuz Filtreleme
  const filteredQuestions = ALL_INTERACTIVE_QUESTIONS.filter((q) => {
    const matchSub = subjectFilter === 'all' || q.subject === subjectFilter;
    const matchType = typeFilter === 'all' || q.type === typeFilter;
    const matchQuery =
      searchQuery.trim() === '' ||
      q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSub && matchType && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#110712] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Arka Plan Glow */}
      <div className="hero-button-blur -top-24 -left-24 opacity-30 pointer-events-none" />
      <div className="hero-button-blur -bottom-24 -right-24 opacity-25 pointer-events-none" />

      {/* =========================================================================
       * ÜST OPERATÖR & YÖNETİCİ HEADER
       * ========================================================================= */}
      <header className="border-b border-orange-500/30 bg-[rgba(24,12,26,0.95)] backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          {/* Sol: Admin Rozeti & Socket */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-600 to-[#F14E13] flex items-center justify-center shadow-lg shadow-[#F14E13]/30 shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="font-poppins font-black text-xs sm:text-base tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
                    <span>🛠️ <span className="hidden sm:inline">YÖNETİCİ & </span>DEMO PANELİ</span>
                    <span className="font-mono text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                      /admin
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-[#B5CBC8] font-mono mt-0.5 hidden md:block">
                  İşler Teknoloji Operatör Arayüzü • Canlı Eşleştirme & Oyuncu Yönetimi
                </p>
              </div>
            </div>

            <span
              className={`flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                isConnected
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-500/15 border-red-500/40 text-red-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
              <span>{isConnected ? 'Canlı Socket' : 'Bağlantı Kesildi'}</span>
            </span>
          </div>

          {/* Sağ: Hızlı Demo Aksiyonları (Yatay kaydırılabilir kompakt tek satır) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 flex-nowrap shrink-0">
            {/* Rastgele Öğrenci Aç (/random) */}
            <button
              onClick={() => window.open('/random', '_blank')}
              className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-orange-500/40 bg-orange-500/15 text-orange-300 hover:bg-orange-500/25 flex items-center gap-1.5 transition-all shadow-sm shadow-orange-500/10 shrink-0 whitespace-nowrap"
              title="Yeni rastgele isim, ELO ve avatarla öğrenci hesabı açar (/random)"
            >
              <span className="text-sm">🎲</span>
              <span className="sm:hidden">Rastgele</span>
              <span className="hidden sm:inline">Rastgele Öğrenci Aç (/random)</span>
            </button>

            {/* Akıllı Tahta Modu (/tahta) */}
            <button
              onClick={() => (onNavigateToSmartboard ? onNavigateToSmartboard() : onNavigateToStudent())}
              className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-500/10 shrink-0 whitespace-nowrap"
              title="Sınıf içi düello için Akıllı Tahta Modunu (/tahta) açar"
            >
              <span className="text-sm">🖥️</span>
              <span className="sm:hidden">Tahta</span>
              <span className="hidden sm:inline">Akıllı Tahta Modu (/tahta)</span>
            </button>

            {/* Öğrenci Katılım Ekranı (/katil - Kahoot Oyuncu Testi) */}
            <button
              onClick={() => onOpenWindow('/katil')}
              className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 flex items-center gap-1.5 transition-all shadow-sm shadow-amber-500/10 shrink-0 whitespace-nowrap"
              title="Mobil canlı sınıf yarışması öğrenci ekranını (/katil) açar"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="sm:hidden">Katıl</span>
              <span className="hidden sm:inline">Öğrenci Katılım (/katil)</span>
            </button>

            {/* Yan Yana Çift Öğrenci Aç */}
            <button
              onClick={handleOpenSideBySideWindows}
              className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-blue-500/40 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 flex items-center gap-1.5 transition-all shadow-sm shadow-blue-500/10 shrink-0 whitespace-nowrap"
              title="Öğrenci 1 (p2: Zeynep) ve Öğrenci 2 (p3: Mert) pencerelerini yan yana açar"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="sm:hidden">Yan Yana</span>
              <span className="hidden sm:inline">Yan Yana 2. Pencere Aç</span>
            </button>

            {/* Soru Test Menüsü (32 Soru) */}
            <button
              onClick={() => setShowQuestionModal(true)}
              className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-purple-500/40 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="sm:hidden">32 Soru Test</span>
              <span className="hidden sm:inline">Soru Test Menüsü (32 Soru)</span>
            </button>

            {/* Demo Sıfırla */}
            <button
              onClick={handleResetDemoState}
              className="text-[11px] sm:text-xs font-mono px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:text-red-400 hover:border-red-500/40 flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap"
              title="Kuyrukları, maçları ve oyuncu durumlarını ilk haline sıfırlar"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">Sıfırla</span>
              <span className="hidden sm:inline">Demo Sıfırla</span>
            </button>

            {/* Öğrenci Ekranına Git (/) */}
            <button
              onClick={() => onNavigateToStudent()}
              className="btn-primary text-[11px] sm:text-xs font-bold !px-2.5 sm:!px-3.5 !py-1.5 sm:!py-2 flex items-center gap-1.5 shadow-md shadow-[#F14E13]/30 shrink-0 whitespace-nowrap"
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="sm:hidden">Öğrenci</span>
              <span className="hidden sm:inline">Öğrenci Ekranına Git (/)</span>
            </button>
          </div>
        </div>

        {/* Admin 4 Sekme Barı (Mobil: 4 eşit sütunlu kompakt bar, Masaüstü: flex) */}
        <div className="max-w-7xl mx-auto mt-2 sm:mt-3 grid grid-cols-4 gap-1 sm:flex sm:items-center sm:gap-2 border-t border-white/5 pt-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-1.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-poppins font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all text-center ${
              activeTab === 'students'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">Profiller ({backendState.players.length})</span>
            <span className="hidden sm:inline">Hazır Öğrenci Profilleri (p1..p6)</span>
            <span className="hidden sm:inline text-[11px] font-mono opacity-80">({backendState.players.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matchmaking')}
            className={`px-1.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-poppins font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all text-center ${
              activeTab === 'matchmaking'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">Kuyruk</span>
            <span className="hidden sm:inline">Canlı Kuyruk & Momentum Teşhis Tablosu</span>
            {backendState.queueSnapshot.length > 0 && (
              <span className="text-[9px] sm:text-[11px] font-mono px-1 sm:px-2 py-0.2 sm:py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                <span className="sm:hidden">{backendState.queueSnapshot.length}</span>
                <span className="hidden sm:inline">{backendState.queueSnapshot.length} Bekleyen</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tournaments')}
            className={`px-1.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-poppins font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all text-center ${
              activeTab === 'tournaments'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">Turnuva</span>
            <span className="hidden sm:inline">Turnuva Yönetimi & Maç Geçmişi</span>
            <span className="hidden lg:inline text-[11px] font-mono opacity-80">
              ({backendState.tournaments.length} Turnuva)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-1.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-poppins font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all text-center ${
              activeTab === 'questions'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">32 Soru</span>
            <span className="hidden sm:inline">32 İnteraktif Soru Laboratuvarı</span>
          </button>
        </div>
      </header>

      {/* Bildirim Toast */}
      {actionMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-gradient-to-r from-orange-600 to-[#F14E13] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-white/20">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-200" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* =========================================================================
       * ANA İÇERİK ALANI
       * ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col gap-4 sm:gap-6">
        {/* =========================================================================
         * SEKME 1: HAZIR ÖĞRENCİ PROFİLLERİ (p1 .. p6)
         * ========================================================================= */}
        {activeTab === 'students' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-poppins font-bold text-lg text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#F14E13]" />
                  <span>Hazır Öğrenci Profilleri & Hızlı Yönetim Kontrolleri</span>
                </h2>
                <p className="text-xs text-[#B5CBC8] mt-1">
                  Hackathon şartnamesindeki 6 farklı oyuncu karakteri (Smurf, High ELO, Cold Streak vb.).
                  İstediğiniz öğrenci olarak tek tıkla oturum açabilir veya ELO/seri parametrelerini anında değiştirebilirsiniz.
                </p>
              </div>

              <button
                onClick={handleOpenSideBySideWindows}
                className="text-xs font-semibold px-4 py-2 rounded-xl border border-blue-500/40 bg-blue-500/15 text-blue-200 hover:bg-blue-500/25 flex items-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Yan Yana 2 Pencere Aç (p2 vs p3)</span>
              </button>
            </div>

            {/* 6 Öğrenci Kartı Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {backendState.players.map((p) => {
                const isCurrentActive = p.id === currentPlayerId;
                const revisionCount = (p.revisionTopics || []).length;
                return (
                  <div
                    key={p.id}
                    className={`game-card p-5 flex flex-col justify-between gap-4 border transition-all ${
                      isCurrentActive
                        ? 'border-orange-500 shadow-lg shadow-orange-500/10 bg-[#1A0E1C]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      {/* Üst: Avatar, İsim, Rol Rozeti */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="relative shrink-0">
                          <img
                            src={p.avatarUrl}
                            alt={p.name}
                            className="w-14 h-14 rounded-2xl border-2 border-orange-500/40 bg-[#0F0510] object-cover"
                          />
                          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-[#0F0510] border border-white/10 text-[10px] font-mono font-bold text-orange-400">
                            {p.id.toUpperCase()}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-poppins font-bold text-sm text-white truncate" title={p.name}>
                              {p.name}
                            </h3>
                            {isCurrentActive && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#F14E13] text-white shrink-0">
                                AKTİF
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#B5CBC8] font-mono mt-0.5 truncate">
                            {p.roleTag || 'Standart Öğrenci'}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${p.bracket.badgeColor}22`,
                                color: p.bracket.badgeColor,
                                border: `1px solid ${p.bracket.badgeColor}55`,
                              }}
                            >
                              {p.bracket.tierName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* İstatistik Rozetleri */}
                      <div className="grid grid-cols-3 gap-2 bg-[#0F0510] p-2.5 rounded-xl border border-white/5 text-center font-mono text-xs mb-3">
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase">Gerçek ELO</div>
                          <div className="font-bold text-[#F14E13] mt-0.5">{p.elo}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase">MMR<sub>eff</sub></div>
                          <div className="font-bold text-purple-400 mt-0.5">{p.effectiveMmr}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase">Seri</div>
                          <div className="font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-0.5">
                            <Flame className="w-3 h-3 fill-amber-400" />
                            <span>{p.streak > 0 ? `+${p.streak}` : p.streak}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ekonomi & İlerleme Çizelgesi */}
                      <div className="flex flex-col gap-2 text-xs font-mono text-[#B5CBC8]">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-amber-400" />
                            <span>Bakiye:</span>
                          </span>
                          <span className="text-white font-bold">
                            {p.coins} Coin • {p.islerPoints} İşler Puanı
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Haftalık Maç:</span>
                          <span className="text-orange-400 font-bold">
                            {p.weeklyMatchesPlayed} / 15 {p.weeklyRewardClaimed ? '(Ödül Alındı ✓)' : ''}
                          </span>
                        </div>

                        {/* 15 Maç Mini Bar */}
                        <div className="w-full bg-[#0F0510] h-1.5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                            style={{ width: `${Math.min(100, (p.weeklyMatchesPlayed / 15) * 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span>Revize Konuları:</span>
                          </span>
                          <span className={`font-bold ${revisionCount > 0 ? 'text-amber-300' : 'text-zinc-500'}`}>
                            {revisionCount} Başlık
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Bu Sekmede Öğrenci Olarak Aç */}
                        <button
                          onClick={() => handleLoginAsStudent(p.id)}
                          className="btn-primary py-2 px-2.5 text-[11px] font-bold flex items-center justify-center gap-1"
                          title="Bu sekmede doğrudan öğrenci görünümüne geçer"
                        >
                          <Play className="w-3 h-3" />
                          <span>Bu Sekmede Aç</span>
                        </button>

                        {/* Yeni Pencerede Aç */}
                        <button
                          onClick={() => onOpenWindow(`/?player=${p.id}&window=2`)}
                          className="py-2 px-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                          title="Yeni tarayıcı penceresinde öğrenciyi başlatır"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Yeni Pencerede Aç</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* ELO & Seri Düzenle */}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="py-1.5 px-2.5 rounded-xl border border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:text-white hover:border-orange-500 text-[11px] font-mono flex items-center justify-center gap-1 transition-all"
                        >
                          <Edit3 className="w-3 h-3 text-orange-400" />
                          <span>ELO / Seri Düzenle</span>
                        </button>

                        {/* +15 Maç Simüle Et */}
                        <button
                          onClick={() => handleSimulate15(p.id, p.name)}
                          className="py-1.5 px-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-[11px] font-mono flex items-center justify-center gap-1 transition-all"
                          title="Öğrencinin haftalık 15 maç kotasını anında doldurur"
                        >
                          <FastForward className="w-3 h-3 text-amber-400" />
                          <span>+15 Maç Simüle Et</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
         * SEKME 2: CANLI KUYRUK & MOMENTUM TEŞHİS TABLOSU
         * ========================================================================= */}
        {activeTab === 'matchmaking' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SOL: Canlı Kuyruk Listesi (5 Kolon) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="game-card p-5 border-orange-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#F14E13]" />
                    <h3 className="font-poppins font-bold text-sm sm:text-base text-white">
                      Canlı Kuyruk ({backendState.queueSnapshot.length} Oyuncu)
                    </h3>
                  </div>

                  {/* ⏱️ Kuyruğu +5sn İlerlet Butonu */}
                  <button
                    onClick={() => fastForwardQueue(5)}
                    className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    title="Kuyruk bekleme süresini 5 saniye ileri alarak tolerans genişlemesi ve Ghost Bot eşleşmesini tetikleyin"
                  >
                    <FastForward className="w-3.5 h-3.5 text-amber-400" />
                    <span>⏱️ +5sn İlerlet</span>
                  </button>
                </div>

                <p className="text-xs text-[#B5CBC8]">
                  Öğrenci pencerelerinden kuyruğa girildiğinde anlık olarak burada listelenir.
                </p>

                {backendState.queueSnapshot.length === 0 ? (
                  <div className="text-center py-10 px-4 text-xs text-[#B5CBC8]/60 font-mono bg-[#0F0510]/70 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                    <Clock className="w-8 h-8 text-zinc-600 mb-1" />
                    <span>Şu anda kuyrukta bekleyen öğrenci yok.</span>
                    <button
                      onClick={handleOpenSideBySideWindows}
                      className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Yan Yana 2 Pencere Açıp Eşleştirmeyi Başlat</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {backendState.queueSnapshot.map((q) => {
                      const waitSec = q.waitSeconds ?? 0;
                      let phaseBadge = { text: '0-5s: Sıkı Bant (±50)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
                      if (waitSec >= 30) {
                        phaseBadge = { text: '30s+: Ghost Bot Eşleşmesi', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
                      } else if (waitSec >= 15) {
                        phaseBadge = { text: '15-30s: Esnek Bant (±200)', color: 'bg-red-500/20 text-red-300 border-red-500/40' };
                      } else if (waitSec >= 5) {
                        phaseBadge = { text: '5-15s: Genişleyen (±100)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
                      }

                      return (
                        <div
                          key={q.playerId}
                          className="p-3.5 rounded-xl bg-[#0F0510] border border-white/10 flex flex-col gap-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-poppins font-bold text-white">{q.name}</span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F14E13]/20 text-[#F14E13] border border-[#F14E13]/30">
                                {q.examType}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-amber-400 text-sm">
                              {waitSec}s
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap font-mono text-[11px] text-[#B5CBC8]">
                            <span>Gerçek: {q.elo} ELO</span>
                            <span>•</span>
                            <span>Seri: {q.streak > 0 ? `+${q.streak}` : q.streak}</span>
                            <span>•</span>
                            <span className="text-orange-400">Dersler: {q.subjects.join(', ')}</span>
                          </div>

                          <div className="pt-1 flex items-center justify-between">
                            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${phaseBadge.color}`}>
                              {phaseBadge.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* SAĞ: Momentum Eşleştirme Teşhis Tablosu (7 Kolon) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="game-card p-5 border-purple-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    <h3 className="font-poppins font-bold text-sm sm:text-base text-white">
                      Momentum Eşleştirme Teşhis Tablosu (pairDiagnostics)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                    Kural Motoru Canlı Analiz
                  </span>
                </div>

                <p className="text-xs text-[#B5CBC8]">
                  Kuyruktaki aday çiftlerinin gerçek ELO farkı, momentum (MMR<sub>eff</sub>) farkı, tolerans penceresi ve ortak ders koşulları aşağıda anlık olarak teşhis edilir.
                </p>

                {backendState.pairDiagnostics.length === 0 ? (
                  <div className="text-center py-10 px-4 text-xs text-[#B5CBC8]/60 font-mono bg-[#0F0510]/70 rounded-xl border border-white/5">
                    Kuyrukta en az 2 oyuncu olduğunda ikili matematiksel teşhis burada gerçek zamanlı hesaplanır.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                    {backendState.pairDiagnostics.map((diag, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border flex flex-col gap-2 text-xs transition-all ${
                          diag.matched
                            ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                            : 'bg-[#0F0510] border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold flex-wrap gap-2">
                          <div className="text-sm text-white flex items-center gap-2">
                            <span>{diag.playerAName}</span>
                            <span className="text-zinc-500 text-xs">VS</span>
                            <span>{diag.playerBName}</span>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                              diag.matched
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            {diag.matched ? 'EŞLEŞEBİLİR ✓' : 'BEKLİYOR (Tolerans Dışı)'}
                          </span>
                        </div>

                        {/* Metrikler Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] bg-black/30 p-2.5 rounded-lg border border-white/5">
                          <div>
                            <span className="text-zinc-500 block">ΔGerçek ELO:</span>
                            <span className="text-white font-bold">{diag.deltaRealElo ?? '-'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">ΔMMR<sub>eff</sub>:</span>
                            <span className="text-purple-300 font-bold">{diag.deltaEffectiveMmr ?? '-'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">Tolerans Sınırı:</span>
                            <span className="text-amber-300 font-bold">±{diag.streakTolerance ?? '-'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">24s Maç Sayısı:</span>
                            <span className="text-white font-bold">{diag.recentMatches ?? 0}</span>
                          </div>
                        </div>

                        {/* Ortak Dersler ve Sebep */}
                        <div className="flex flex-col gap-1 text-[11px]">
                          {diag.commonSubjects && (
                            <div className="text-[#B5CBC8]">
                              <span className="text-orange-400 font-semibold">Ortak Dersler: </span>
                              <span>{diag.commonSubjects.length > 0 ? diag.commonSubjects.join(', ') : 'Ortak ders yok!'}</span>
                            </div>
                          )}
                          {diag.reason && (
                            <div className="text-amber-200/90 italic">
                              <span className="font-semibold text-zinc-400">Teşhis Notu: </span>
                              {diag.reason}
                            </div>
                          )}
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
         * SEKME 3: TURNUVA YÖNETİMİ, ÖDÜL DAĞITIMI & MAÇ GEÇMİŞİ
         * ========================================================================= */}
        {activeTab === 'tournaments' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-poppins font-bold text-lg text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Turnuva Yönetimi & Tamamlanan Düello Geçmişi</span>
                </h2>
                <p className="text-xs text-[#B5CBC8] mt-1">
                  Aktif turnuvaların katılımcı puan durumları, anlık ödül dağıtımı ve sunucuda tamamlanan maçların logları.
                </p>
              </div>
            </div>

            {/* Turnuvalar Listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {backendState.tournaments.map((t) => (
                <div key={t.id} className="game-card p-5 border-amber-500/30 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-poppins font-bold text-base text-white">{t.title}</h3>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            {t.examType}
                          </span>
                        </div>
                        <p className="text-xs text-amber-300 font-mono mt-1">{t.prizePoolDesc}</p>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                          t.rewardsDistributed
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {t.rewardsDistributed ? 'Ödüller Dağıtıldı' : 'Aktif'}
                      </span>
                    </div>

                    {/* Katılımcı Sıralama Tablosu */}
                    <div className="bg-[#0F0510] rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-3.5 py-2 border-b border-white/5 flex justify-between text-[11px] font-mono text-[#B5CBC8]">
                        <span>Katılımcı / Sıra</span>
                        <span>Puan • G/M</span>
                      </div>

                      <div className="divide-y divide-white/5 max-h-48 overflow-y-auto">
                        {t.participants.length === 0 ? (
                          <div className="py-4 text-center text-xs text-zinc-500 font-mono">
                            Henüz katılımcı kayıt olmadı.
                          </div>
                        ) : (
                          t.participants.map((p, idx) => (
                            <div key={p.playerId} className="px-3.5 py-2 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-zinc-500 font-bold">#{idx + 1}</span>
                                <span className="text-white font-medium">{p.name}</span>
                              </div>
                              <div className="font-mono text-right">
                                <span className="text-amber-400 font-bold">{p.points} Puan</span>
                                <span className="text-[10px] text-zinc-500 ml-2">
                                  ({p.wins}G / {p.losses}M)
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ödül Dağıt Butonu */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-end">
                    <button
                      onClick={() => handleDistributeRewards(t.id)}
                      disabled={t.rewardsDistributed}
                      className={`text-xs font-mono font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                        t.rewardsDistributed
                          ? 'bg-white/5 text-zinc-500 border border-white/5 cursor-not-allowed'
                          : 'btn-primary shadow-sm'
                      }`}
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{t.rewardsDistributed ? '✓ Ödüller Dağıtıldı' : '🏆 Turnuva Ödüllerini Dağıt'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Canlı Maç Geçmişi */}
            <div className="game-card p-5 border-white/10 flex flex-col gap-3">
              <h3 className="font-poppins font-bold text-sm text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-[#F14E13]" />
                <span>Tamamlanan Düellolar ({backendState.matchHistory.length} Karşılaşma)</span>
              </h3>

              {backendState.matchHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#B5CBC8]/60 font-mono bg-[#0F0510] rounded-xl border border-white/5">
                  Henüz tamamlanmış maç yok. Düello oturumu bittiğinde detaylı skor ve ELO değişimleri burada arşivlenir.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {backendState.matchHistory.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0F0510] border border-white/10 flex items-center justify-between text-xs flex-wrap gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">
                            {m.playerA.name} ({m.playerA.totalScore}p) vs {m.playerB.name} ({m.playerB.totalScore}p)
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F14E13]/20 text-[#F14E13]">
                            {m.examType}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#B5CBC8] mt-0.5">
                          Kazanan: <span className="text-amber-400 font-bold">{m.winnerName || 'Beraberlik'}</span>
                        </div>
                      </div>

                      <div className="font-mono text-right text-[11px]">
                        <div className="text-emerald-400 font-bold">
                          ΔELO: A: {m.eloUpdate?.deltaA >= 0 ? `+${m.eloUpdate?.deltaA}` : m.eloUpdate?.deltaA} | B:{' '}
                          {m.eloUpdate?.deltaB >= 0 ? `+${m.eloUpdate?.deltaB}` : m.eloUpdate?.deltaB}
                        </div>
                        <div className="text-zinc-500 text-[10px]">
                          {m.completedAt ? new Date(m.completedAt).toLocaleTimeString() : 'Tamamlandı'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
         * SEKME 4: 32 İNTERAKTİF SORU LABORATUVARI
         * ========================================================================= */}
        {activeTab === 'questions' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-poppins font-bold text-lg text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-purple-400" />
                  <span>32 İnteraktif Soru Laboratuvarı & Canlı Simülasyon</span>
                </h2>
                <p className="text-xs text-[#B5CBC8] mt-1">
                  14 farklı soru mekaniğini (numpad, swipe, stepper, formula builder vb.) içeren 32 zengin TYT/AYT sorusu.
                  Her soruyu doğrudan interaktif motorla test edebilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-[#B5CBC8]">
                <span className="px-3 py-1.5 rounded-xl bg-[#0F0510] border border-white/10 font-bold text-purple-300">
                  {filteredQuestions.length} / {ALL_INTERACTIVE_QUESTIONS.length} Soru
                </span>
              </div>
            </div>

            {/* Filtre ve Arama Barı */}
            <div className="game-card p-4 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Konu, metin veya soru ID ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:flex-1 bg-[#0F0510] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />

              {/* Ders Filtresi */}
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#0F0510] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none"
              >
                <option value="all">TÜM DERSLER</option>
                <option value="matematik">Matematik</option>
                <option value="fizik">Fizik</option>
                <option value="kimya">Kimya</option>
                <option value="biyoloji">Biyoloji</option>
                <option value="turkce">Türkçe</option>
              </select>

              {/* Tip Filtresi */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-auto bg-[#0F0510] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none"
              >
                <option value="all">TÜM MEKANİKLER (14 Tip)</option>
                <option value="universal_choice">Universal Choice</option>
                <option value="ordering_and_formula">Ordering & Formula</option>
                <option value="pair_matching">Pair Matching</option>
                <option value="swipe_grouping">Swipe Grouping</option>
                <option value="numpad_closest">Numpad Closest</option>
                <option value="multi_select_bubble">Multi-Select Bubble</option>
                <option value="stepper_balance">Stepper Balance</option>
                <option value="spot_the_bug">Spot The Bug</option>
                <option value="progressive_clues">Progressive Clues</option>
                <option value="target_combination">Target Combination</option>
                <option value="chain_conversion">Chain Conversion</option>
                <option value="matrix_toggle">Matrix Toggle</option>
                <option value="slider">Slider</option>
                <option value="hotspot">Hotspot</option>
              </select>
            </div>

            {/* Soru Listesi Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="game-card p-4 border-white/10 hover:border-purple-500/40 flex flex-col justify-between gap-3 transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-[#F14E13] font-bold">#{idx + 1}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 uppercase text-white font-semibold">
                          {q.subject}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 font-mono text-[10px]">
                          {q.type}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{q.id}</span>
                    </div>

                    <div className="text-xs font-poppins font-bold text-amber-300">{q.topic}</div>

                    <p className="text-xs text-white/90 leading-relaxed line-clamp-2">{q.prompt}</p>

                    {q.explanation && (
                      <p className="text-[11px] text-[#B5CBC8] italic line-clamp-1 border-t border-white/5 pt-1.5">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="px-3 py-1.5 rounded-xl border border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:text-white text-xs font-mono flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>İncele</span>
                    </button>

                    <button
                      onClick={() => onTestQuestion(q)}
                      className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Test Et (Oyna)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
       * MODAL 1: ELO & SERİ DÜZENLEME MODALI
       * ========================================================================= */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="game-card max-w-sm w-full p-6 flex flex-col gap-4 border-orange-500/50 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-poppins font-bold text-base text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-400" />
                <span>ELO & Seri Düzenle</span>
              </h3>
              <button
                onClick={() => setEditingPlayer(null)}
                className="text-xs text-[#B5CBC8] hover:text-white font-mono"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={editingPlayer.avatarUrl}
                alt={editingPlayer.name}
                className="w-12 h-12 rounded-xl border border-orange-500/40"
              />
              <div>
                <div className="font-poppins font-bold text-sm text-white">{editingPlayer.name}</div>
                <div className="text-xs text-[#B5CBC8] font-mono">{editingPlayer.id.toUpperCase()}</div>
              </div>
            </div>

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
              <label className="text-xs text-[#B5CBC8] font-mono">Kazanma Serisi (Streak, Örn: +5 veya -4)</label>
              <input
                type="number"
                value={editStreak}
                onChange={(e) => setEditStreak(Number(e.target.value))}
                className="bg-[#0F0510] border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setEditingPlayer(null)}
                className="px-4 py-2 text-xs font-semibold text-[#B5CBC8] hover:text-white"
              >
                İptal
              </button>
              <button onClick={handleSaveElo} className="btn-primary px-5 py-2 text-xs font-bold">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * MODAL 2: 32 SORULUK HIZLI SORU TEST MENÜSÜ MODALI (Header'dan tetiklenir)
       * ========================================================================= */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="game-card max-w-4xl w-full p-6 flex flex-col gap-4 border-purple-500/40 max-h-[88vh] overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                <h3 className="font-poppins font-bold text-base text-white">
                  Soru Test Menüsü (14 Mekanik • {ALL_INTERACTIVE_QUESTIONS.length} Soru)
                </h3>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-xs text-[#B5CBC8] hover:text-white font-mono px-2 py-1 rounded hover:bg-white/5"
              >
                ✕ Kapat
              </button>
            </div>

            {/* Filtreler */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'fizik', 'kimya', 'biyoloji', 'matematik', 'turkce'] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubjectFilter(sub)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    subjectFilter === sub
                      ? 'bg-[#F14E13] text-white shadow-sm shadow-[#F14E13]/30'
                      : 'bg-[#0F0510] text-[#B5CBC8] hover:text-white border border-white/5'
                  }`}
                >
                  {sub.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Soru Listesi */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 pr-1">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-white/5 px-2.5 rounded-xl transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-[#F14E13] font-bold">#{idx + 1}</span>
                      <span className="text-white uppercase font-bold">{q.subject}</span>
                      <span className="text-purple-300 font-semibold">• {q.type}</span>
                      <span className="text-zinc-500">• {q.topic}</span>
                    </div>
                    <div className="text-xs font-medium text-white truncate mt-1">{q.prompt}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:text-white text-xs font-mono"
                    >
                      İncele
                    </button>
                    <button
                      onClick={() => {
                        setShowQuestionModal(false);
                        onTestQuestion(q);
                      }}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Test Et</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * MODAL 3: SORU DETAY İNCELEME MODALI
       * ========================================================================= */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="game-card max-w-2xl w-full p-6 flex flex-col gap-4 border-orange-500/40 animate-fade-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-400" />
                <h3 className="font-poppins font-bold text-base text-white">
                  Soru Detayı ({previewQuestion.id})
                </h3>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="text-xs text-[#B5CBC8] hover:text-white font-mono"
              >
                ✕ Kapat
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-[#F14E13]/20 text-[#F14E13] font-bold uppercase">
                {previewQuestion.subject}
              </span>
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-semibold">
                Tip: {previewQuestion.type}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 text-[#B5CBC8]">
                Süre: {previewQuestion.timeLimitSeconds}s • Puan: {previewQuestion.points}
              </span>
            </div>

            <div className="bg-[#0F0510] p-4 rounded-xl border border-white/10">
              <div className="text-xs text-zinc-500 font-mono uppercase mb-1">Yönerge / Soru Metni:</div>
              <div className="text-sm font-semibold text-white leading-relaxed">
                {previewQuestion.prompt}
              </div>
            </div>

            {previewQuestion.explanation && (
              <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30">
                <div className="text-xs text-emerald-400 font-bold uppercase mb-1">
                  💡 Çözüm & Açıklama:
                </div>
                <div className="text-xs text-emerald-200 leading-relaxed font-sans">
                  {previewQuestion.explanation}
                </div>
              </div>
            )}

            <div className="bg-[#0F0510] p-4 rounded-xl border border-white/10">
              <div className="text-xs text-zinc-500 font-mono uppercase mb-2">Payload Yapısı (JSON):</div>
              <pre className="text-[11px] font-mono text-amber-200/90 overflow-x-auto max-h-48 p-2 rounded bg-black/40">
                {JSON.stringify(previewQuestion.payload, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setPreviewQuestion(null)}
                className="px-4 py-2 text-xs font-semibold text-[#B5CBC8] hover:text-white"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  const q = previewQuestion;
                  setPreviewQuestion(null);
                  onTestQuestion(q);
                }}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Bu Soruyu Test Et</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
