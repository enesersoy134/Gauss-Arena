import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useBackendGame, BackendPlayer } from './services/backendSocket';
import { Question } from './types/game';
import { ALL_INTERACTIVE_QUESTIONS } from './data/allInteractiveQuestions';
import { ALL_QUESTIONS, filterAppQuestions } from './data/allQuestions';
import { getRecommendationsForTopic } from './utils/resourceRecommendations';
import LiveDuelScreen from './components/game/LiveDuelScreen';
import GameScreen from './components/game/GameScreen';
import RevisionPracticeScreen from './components/game/RevisionPracticeScreen';
import PresentationDeck from './components/presentation/PresentationDeck';
import AdminPanel from './components/admin/AdminPanel';
import SmartboardScreen from './components/smartboard/SmartboardScreen';
import KahootPlayerView from './components/smartboard/KahootPlayerView';
import { soundEngine } from './utils/soundEngine';
import DailyMiniGameModal, {
  MiniGameSubjectId,
} from './components/minigames/DailyMiniGameModal';
import {
  Swords,
  Flame,
  Sparkles,
  Trophy,
  Coins,
  Clock,
  AlertCircle,
  ShoppingBag,
  Tag,
  Shield,
  Check,
  BookOpen,
  AlertTriangle,
  Compass,
  Shuffle,
  Target,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Gamepad2,
  ArrowRight,
  Presentation,
  Calendar,
  Users,
} from 'lucide-react';

type ActiveTab = 'matchmaking' | 'economy' | 'tournaments' | 'revision';

const WEEKLY_MATCHES_THRESHOLD = 15;

const ALL_MINI_GAME_SUBJECTS: MiniGameSubjectId[] = [
  'fizik',
  'kimya',
  'biyoloji',
  'matematik',
  'geometri',
  'turkce',
];

interface StoredDailyStatus {
  completedMiniGames: MiniGameSubjectId[];
  isCompetitiveUnlocked: boolean;
}

export function isMiddleSchoolPlayer(
  playerId: string,
  player?: BackendPlayer | null
): boolean {
  if (playerId === 'p3' || playerId === 'p4') return true;
  if (player?.educationLevel === 'ortaokul') return true;
  return false;
}

function getPlayerDailyStatus(
  playerId: string,
  player?: BackendPlayer | null
): StoredDailyStatus {
  // p3 ve p4 (Ortaokul / LGS): Günlük görev zorunluluğundan muaftır,
  // 1v1 rekabetçi kilidi daima açıktır.
  if (isMiddleSchoolPlayer(playerId, player) || Boolean(player?.dailyQuestExempt)) {
    return {
      completedMiniGames: ALL_MINI_GAME_SUBJECTS,
      isCompetitiveUnlocked: true,
    };
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`isler_daily_status_${playerId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.completedMiniGames)) {
          return {
            completedMiniGames: parsed.completedMiniGames,
            isCompetitiveUnlocked: Boolean(parsed.isCompetitiveUnlocked),
          };
        }
      }
    } catch {}
  }

  // p1 ve p2 profilleri varsayılan olarak günlük görevlerini tamamlamış kabul edilir
  const isCompletedDefault =
    playerId === 'p1' ||
    playerId === 'p2' ||
    Boolean(player?.dailyCompleted) ||
    Boolean(player?.dailyQuestDone);

  if (isCompletedDefault) {
    const list =
      player?.completedMiniGames && player.completedMiniGames.length > 0
        ? (player.completedMiniGames as MiniGameSubjectId[])
        : ALL_MINI_GAME_SUBJECTS;
    return {
      completedMiniGames: list,
      isCompetitiveUnlocked: true,
    };
  }

  return {
    completedMiniGames: [],
    isCompetitiveUnlocked: false,
  };
}

export default function App() {
  const {
    isConnected,
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
    createRandomPlayer,
    completeRevisionPractice,
  } = useBackendGame();

  // URL / Routing Yönetimi (Client-side /admin, /random, /tahta, /katil ve /)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((url: string) => {
    window.history.pushState({}, '', url);
    setCurrentPath(window.location.pathname);
  }, []);

  // URL pathname (/p1, /p2, /p3, /p4 vb.) veya query param (?player=pX) ile profil seçimi kontrolü
  useEffect(() => {
    // 1. URL Pathname kontrolü (örn. /p1, /p2, /p3, /p4...)
    const pathMatch = window.location.pathname.match(/^\/?(p\d+)(?:\/|$)/i);
    const pathPlayerId = pathMatch ? pathMatch[1].toLowerCase() : null;

    // 2. Query param kontrolü (?player=pX)
    const params = new URLSearchParams(window.location.search);
    const queryPlayerId = params.get('player')?.toLowerCase();

    const targetPlayerId = pathPlayerId || queryPlayerId;

    if (targetPlayerId && backendState.players.some((p) => p.id.toLowerCase() === targetPlayerId)) {
      const matched = backendState.players.find((p) => p.id.toLowerCase() === targetPlayerId);
      if (matched && matched.id !== currentPlayerId) {
        selectPlayer(matched.id);
      }
    }
  }, [backendState.players, currentPlayerId, selectPlayer, currentPath]);

  // Bildirim Toast State
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  }, []);

  // Faz 1: /random Route Desteği — Dinamik Rastgele Yeni Öğrenci Hesabı Oluşturma
  const isCreatingRandomRef = useRef<boolean>(false);

  useEffect(() => {
    if (currentPath.startsWith('/random') && !isCreatingRandomRef.current) {
      isCreatingRandomRef.current = true;
      (async () => {
        try {
          const newPlayer = await createRandomPlayer();
          if (newPlayer && newPlayer.id) {
            showToast(`🎲 Yeni öğrenci hesabınız açıldı: ${newPlayer.name} (${newPlayer.elo} ELO)`);
            navigateTo(`/?player=${newPlayer.id}`);
          } else {
            showToast('Rastgele öğrenci oluşturulamadı, varsayılan hesaba yönlendiriliyorsunuz.');
            navigateTo('/');
          }
        } catch (err) {
          console.error('Random player creation failed', err);
          navigateTo('/');
        }
      })();
    }
  }, [currentPath, createRandomPlayer, navigateTo, showToast]);

  // Mute durumu dinleme
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundEngine.getMuted());
  useEffect(() => {
    return soundEngine.subscribe(() => {
      setIsSoundMuted(soundEngine.getMuted());
    });
  }, []);

  // Geliştirici Soru Test Menüsü & Bireysel Eksik Konu Antrenmanı State
  const [forcedQuestions, setForcedQuestions] = useState<Question[] | undefined>(undefined);
  const [revisionPracticeQuestions, setRevisionPracticeQuestions] = useState<Question[] | null>(null);
  const [revisionPracticeTopics, setRevisionPracticeTopics] = useState<string[]>([]);

  // Lobi fon müziği yönetimi (Ana menüdeyken 'lobby' arpeji başlar)
  useEffect(() => {
    const isLobby =
      currentPath === '/' ||
      currentPath === '' ||
      /^\/?p\d+/i.test(currentPath);

    if (
      !activeDuel &&
      !duelSummary &&
      !forcedQuestions &&
      !revisionPracticeQuestions &&
      isLobby
    ) {
      soundEngine.startMusic('lobby');
    }
  }, [activeDuel, duelSummary, forcedQuestions, revisionPracticeQuestions, currentPath]);

  // Sekme yönetimi
  const [activeTab, setActiveTab] = useState<ActiveTab>('matchmaking');
  const [revisionSubjectFilter, setRevisionSubjectFilter] = useState<string>('all');

  // Öğrenci Kademe Tespiti (p3 ve p4 Ortaokul/LGS, p1 ve p2 Lise/YKS)
  const isMiddleSchool = isMiddleSchoolPlayer(currentPlayerId, currentPlayer);

  // Eşleştirme Formu Ayarları (LGS & Soru Seviyesi/Zorluk dahil)
  const [selectedExamType, setSelectedExamType] = useState<'LGS' | 'TYT' | 'AYT'>(() => {
    return isMiddleSchoolPlayer(currentPlayerId, currentPlayer) ? 'LGS' : 'TYT';
  });
  const [selectedDifficultyMode, setSelectedDifficultyMode] = useState<'adaptive' | 'easy' | 'medium' | 'hard'>('adaptive');
  const [selectedMode, setSelectedMode] = useState<'ranked' | 'tournament' | 'practice'>('ranked');
  const [practiceQuestionCount, setPracticeQuestionCount] = useState<number>(5);
  const [isPracticeSession, setIsPracticeSession] = useState<boolean>(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() => {
    return isMiddleSchoolPlayer(currentPlayerId, currentPlayer)
      ? ['turkce', 'matematik', 'sosyal', 'fen']
      : ['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce'];
  });
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(() => {
    return isMiddleSchoolPlayer(currentPlayerId, currentPlayer) ? 'tour-lgs-1' : 'tour-tyt-1';
  });

  // Mod bazlı kuyruk durumu
  const isRankedQueueing = Boolean(myQueueEntry && myQueueEntry.mode === 'ranked');
  const isTournamentQueueing = Boolean(myQueueEntry && myQueueEntry.mode === 'tournament');
  const isSelectedModeQueueing = Boolean(
    myQueueEntry &&
      myQueueEntry.mode === selectedMode &&
      (selectedMode !== 'tournament' || myQueueEntry.tournamentId === selectedTournamentId)
  );

  // Coin Dönüştürme State
  const [coinsToConvert, setCoinsToConvert] = useState<number>(5000);

  // Günlük Öğretici Mini Oyunlar & 1v1 Rekabetçi Mod Kilidi State
  const initialDailyStatus = getPlayerDailyStatus(currentPlayerId, currentPlayer);
  const [isCompetitiveUnlocked, setIsCompetitiveUnlocked] = useState<boolean>(
    initialDailyStatus.isCompetitiveUnlocked
  );
  const [showMiniGameScreen, setShowMiniGameScreen] = useState<boolean>(
    !initialDailyStatus.isCompetitiveUnlocked
  );
  const [completedMiniGames, setCompletedMiniGames] = useState<MiniGameSubjectId[]>(
    initialDailyStatus.completedMiniGames
  );

  // Aktif öğrenci (p1, p2 vb.) değiştiğinde veya sayfa yüklendiğinde günlük görev durumunu güncelle
  useEffect(() => {
    const status = getPlayerDailyStatus(currentPlayerId, currentPlayer);
    setIsCompetitiveUnlocked(status.isCompetitiveUnlocked);
    setCompletedMiniGames(status.completedMiniGames);
    if (status.isCompetitiveUnlocked) {
      setShowMiniGameScreen(false);
    }
  }, [currentPlayerId, currentPlayer?.dailyCompleted, currentPlayer?.dailyQuestDone, currentPlayer?.educationLevel]);

  // Öğrenci profili veya kademesi değiştiğinde sınav kategorisi ve dersleri reaktif senkronize et
  useEffect(() => {
    const isMid = isMiddleSchoolPlayer(currentPlayerId, currentPlayer);
    if (isMid) {
      setSelectedExamType('LGS');
      setSelectedSubjects(['turkce', 'matematik', 'sosyal', 'fen']);
      setSelectedTournamentId('tour-lgs-1');
    } else {
      if (selectedExamType === 'LGS') {
        setSelectedExamType('TYT');
        setSelectedSubjects(['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce']);
        setSelectedTournamentId('tour-tyt-1');
      }
    }
  }, [currentPlayerId, currentPlayer?.educationLevel]);

  const handleCompleteMiniGame = useCallback((subjectId: MiniGameSubjectId) => {
    setCompletedMiniGames((prev) => {
      const next = prev.includes(subjectId) ? prev : [...prev, subjectId];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            `isler_daily_status_${currentPlayerId}`,
            JSON.stringify({
              completedMiniGames: next,
              isCompetitiveUnlocked: true,
            })
          );
        } catch {}
      }
      return next;
    });
    setIsCompetitiveUnlocked(true);
    showToast(
      'Tebrikler! Günlük Öğrenme Görevini Tamamladın — 1v1 Rekabetçi Arena Açıldı!'
    );
  }, [currentPlayerId, showToast]);

  const handleResetLockDemo = useCallback(() => {
    if (isMiddleSchoolPlayer(currentPlayerId, currentPlayer)) {
      showToast('ℹ️ Bu öğrenci Ortaokul (LGS) kademesinde olduğu için günlük görevden muaftır.');
      return;
    }
    setIsCompetitiveUnlocked(false);
    setCompletedMiniGames([]);
    setShowMiniGameScreen(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          `isler_daily_status_${currentPlayerId}`,
          JSON.stringify({
            completedMiniGames: [],
            isCompetitiveUnlocked: false,
          })
        );
      } catch {}
    }
    showToast('🔒 Rekabetçi mod kilidi demo başlangıç durumuna sıfırlandı.');
  }, [currentPlayerId, currentPlayer, showToast]);

  const handleResetAllDemo = useCallback(async () => {
    const res = await resetDemo();
    if (typeof window !== 'undefined') {
      try {
        ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach((id) => {
          localStorage.removeItem(`isler_daily_status_${id}`);
        });
      } catch {}
    }
    const isExemptOrCompleted =
      currentPlayerId === 'p1' ||
      currentPlayerId === 'p2' ||
      currentPlayerId === 'p3' ||
      currentPlayerId === 'p4' ||
      isMiddleSchoolPlayer(currentPlayerId, currentPlayer);
    setIsCompetitiveUnlocked(isExemptOrCompleted);
    setCompletedMiniGames(isExemptOrCompleted ? ALL_MINI_GAME_SUBJECTS : []);
    setShowMiniGameScreen(!isExemptOrCompleted);
    return res;
  }, [resetDemo, currentPlayerId, currentPlayer]);

  // =========================================================================
  // ROUTE GÖRÜNÜMLERİ
  // =========================================================================

  // 0. PROJE SUNUM SLAYTLARI (/sunum veya /slayt)
  if (currentPath.startsWith('/sunum') || currentPath.startsWith('/slayt')) {
    return (
      <PresentationDeck
        onExit={() => {
          navigateTo('/');
        }}
      />
    );
  }

  // 1. /random YÜKLEME EKRANI
  if (currentPath.startsWith('/random')) {
    return (
      <div className="min-h-screen bg-[#150A16] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="p-8 rounded-3xl bg-[#1A0E1C] border border-orange-500/40 shadow-2xl flex flex-col items-center gap-4 text-center max-w-md w-full animate-pulse">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#F14E13] to-amber-500 flex items-center justify-center text-3xl shadow-xl shadow-[#F14E13]/30">
            🎲
          </div>
          <h2 className="text-xl font-black font-poppins text-white">
            Rastgele Öğrenci Hesabı Oluşturuluyor...
          </h2>
          <p className="text-xs font-mono text-[#B5CBC8]">
            Yeni profil, ELO ligi ve avatar atanıyor. Lütfen bekleyin...
          </p>
          <div className="w-8 h-8 rounded-full border-2 border-t-[#F14E13] border-white/10 animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // 2. BİREYSEL EKSİK KONU TELAFİ & ALIŞTIRMA MODU
  if (revisionPracticeQuestions && revisionPracticeQuestions.length > 0) {
    const diffLabel =
      selectedDifficultyMode === 'easy'
        ? 'Kolay'
        : selectedDifficultyMode === 'medium'
        ? 'Orta'
        : selectedDifficultyMode === 'hard'
        ? 'Zor'
        : 'Adaptif';
    const subjLabels = selectedSubjects
      .map((s) => allSubjects.find((as) => as.id === s)?.label || s)
      .join(', ');

    return (
      <RevisionPracticeScreen
        questions={revisionPracticeQuestions}
        topics={revisionPracticeTopics}
        modeTitle={
          isPracticeSession
            ? `🎯 ${selectedExamType} Alıştırması (${subjLabels || 'Seçili Dersler'})`
            : '🎯 Eksik Konu Pekiştirme'
        }
        subtitle={
          isPracticeSession
            ? `${selectedExamType} • ${diffLabel.toUpperCase()} SEVİYE • ${revisionPracticeQuestions.length} SORU`
            : 'BİREYSEL TELAFİ ANTRENMANI'
        }
        exitLabel={isPracticeSession ? 'Ana Sayfaya Dön' : 'Antrenmandan Çık'}
        rewardLabel={isPracticeSession ? '+15 Coin Alıştırma Ödülü' : '+30 Coin Telafi Ödülü'}
        onComplete={async (stats) => {
          if (isPracticeSession) {
            showToast(
              `🎉 Bireysel soru alıştırmasını başarıyla tamamladınız! (${stats.correctCount}/${stats.totalCount} Doğru)`
            );
          } else {
            await completeRevisionPractice(currentPlayerId, stats.solvedTopics);
            showToast(
              `🎉 Eksik konu telafi antrenmanını tamamladınız! +30 Coin kazandınız ve eksiklik yüzdeniz düştü! (${stats.correctCount}/${stats.totalCount} Doğru)`
            );
          }
          setRevisionPracticeQuestions(null);
          setRevisionPracticeTopics([]);
          setIsPracticeSession(false);
        }}
        onExit={() => {
          setRevisionPracticeQuestions(null);
          setRevisionPracticeTopics([]);
          setIsPracticeSession(false);
        }}
      />
    );
  }

  // 3. GELİŞTİRİCİ SORU TEST MODU (Forced Questions ile simülasyon - Admin panelinden test etme)
  if (forcedQuestions && forcedQuestions.length > 0) {
    return (
      <GameScreen
        forcedQuestions={forcedQuestions}
        playerId={currentPlayerId}
        onExit={() => {
          setForcedQuestions(undefined);
        }}
      />
    );
  }

  // 3. YÖNETİCİ & OPERATÖR PANELİ (/admin)
  if (currentPath.startsWith('/admin')) {
    return (
      <AdminPanel
        isConnected={isConnected}
        backendState={backendState}
        currentPlayerId={currentPlayerId}
        selectPlayer={selectPlayer}
        fastForwardQueue={fastForwardQueue}
        simulate15Matches={simulate15Matches}
        distributeTournamentRewards={distributeTournamentRewards}
        updatePlayerDemo={updatePlayerDemo}
        resetDemo={handleResetAllDemo}
        onNavigateToStudent={(playerId?: string) => {
          const targetUrl = playerId ? `/?player=${playerId}` : '/';
          navigateTo(targetUrl);
        }}
        onNavigateToSmartboard={() => navigateTo('/tahta')}
        onOpenWindow={(url: string) => {
          window.open(url, '_blank', 'width=520,height=920,left=650,top=30');
        }}
        onTestQuestion={(q: Question) => {
          setForcedQuestions([q]);
        }}
      />
    );
  }

  // 4. CANLI SINIF YARIŞMASI ÖĞRENCİ TELEFON EKRANI (/katil)
  if (currentPath.startsWith('/katil')) {
    return <KahootPlayerView onExit={() => navigateTo('/')} />;
  }

  // 5. AKILLI TAHTA MODU (/tahta veya /smartboard)
  if (currentPath.startsWith('/tahta') || currentPath.startsWith('/smartboard')) {
    return <SmartboardScreen onExit={() => navigateTo('/')} />;
  }

  // 6. CANLI SOCKET DÜELLO EKRANI
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

  // =========================================================================
  // 7. ÖĞRENCİ ARAYÜZÜ (/) - EdTech Platformu
  // =========================================================================
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

  const allSubjects = selectedExamType === 'LGS' ? lgsSubjects : highSchoolSubjects;

  const availableExamTypes: ('LGS' | 'TYT' | 'AYT')[] = isMiddleSchool
    ? ['LGS']
    : ['TYT', 'AYT'];

  const handleExamTypeChange = (t: 'LGS' | 'TYT' | 'AYT') => {
    if (isMiddleSchool && t !== 'LGS') return;
    if (!isMiddleSchool && t === 'LGS') return;

    soundEngine.playClick();
    setSelectedExamType(t);
    if (t === 'LGS') {
      setSelectedSubjects(['turkce', 'matematik', 'sosyal', 'fen']);
    } else {
      setSelectedSubjects(['matematik', 'fizik', 'kimya', 'biyoloji', 'turkce']);
    }
  };

  const toggleSubject = (subjId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjId) ? prev.filter((s) => s !== subjId) : [...prev, subjId]
    );
  };

  const handleStartQueue = () => {
    if (selectedMode === 'practice') {
      handleStartPracticeFromMatchmaking();
      return;
    }
    if (!isCompetitiveUnlocked) {
      showToast(
        '🔒 1v1 Rekabetçi Düello kilitli! Önce Günün Öğretici Mini Oyununu tamamlamalısın.'
      );
      setShowMiniGameScreen(true);
      return;
    }
    soundEngine.playClick();
    if (selectedSubjects.length === 0) {
      showToast('En az bir ders seçmelisiniz!');
      return;
    }
    joinQueue({
      examType: selectedExamType,
      subjects: selectedSubjects,
      mode: selectedMode,
      tournamentId: selectedMode === 'tournament' ? selectedTournamentId : null,
      difficultyMode: selectedDifficultyMode,
    } as any);
  };

  const handleConvertCoins = async () => {
    soundEngine.playClick();
    if (coinsToConvert < 5000) {
      showToast('En az 5000 Coin dönüştürebilirsiniz!');
      return;
    }
    const res = await convertCoins(coinsToConvert, currentPlayerId);
    if (res?.ok) {
      soundEngine.playCorrect();
      const awardedPoints = res.islerPointsAwarded ?? res.islerPointsAdded ?? Math.floor(coinsToConvert / 500);
      showToast(`Tebrikler! ${coinsToConvert} Coin karşılığında ${awardedPoints} İşler Puanı ve indirim kuponu kazandınız!`);
    } else {
      soundEngine.playWrong();
      showToast(res?.reason || 'Dönüştürme başarısız oldu.');
    }
  };

  const handleClaimWeekly = async () => {
    soundEngine.playClick();
    const res = await claimWeeklyReward(currentPlayerId);
    if (res?.ok) {
      soundEngine.playCorrect();
      const coinsWon = res.coinsAwarded || res.rewardCoins || currentPlayer.bracket.weeklyCoins;
      showToast(`Tebrikler! ${coinsWon} Coin haftalık lig ödülü hesabınıza eklendi!`);
    } else {
      soundEngine.playWrong();
      showToast(res?.reason || 'Haftalık ödül henüz alınamaz.');
    }
  };

  // Faz 3: Eksik Konu Verilerini Hazırla (revisionDetails veya revisionTopics fallback)
  const revisionItems =
    currentPlayer.revisionDetails && currentPlayer.revisionDetails.length > 0
      ? currentPlayer.revisionDetails
      : (currentPlayer.revisionTopics || []).map((t) => {
          const tot = Math.max(3, t.mistakeCount * 2);
          const rate = Math.min(100, Math.round((t.mistakeCount / tot) * 100));
          return {
            topic: t.topic,
            subject: t.subject,
            examType: t.examType || 'TYT',
            totalAttempts: tot,
            wrongCount: t.mistakeCount,
            errorRatePercent: rate,
            failedQuestionIds: t.wrongQuestions.map((wq) => wq.externalId),
            recommendedBooks: (t.recommendedResources || []).map((r) => `${r.bookTitle} (${r.publisher})`),
            lastMistakeAt: t.lastMistakeAt,
          };
        });

  // Ortalama hata yüzdesi
  const avgErrorRate =
    revisionItems.length > 0
      ? Math.round(
          revisionItems.reduce((acc, curr) => acc + (curr.errorRatePercent || 0), 0) /
            revisionItems.length
        )
      : 0;

  // Tüm Eksik Konuları Karışık Çöz
  const handlePracticeAllRevision = () => {
    if (revisionItems.length === 0) {
      showToast('Tekrar edilecek eksik konunuz bulunmuyor!');
      return;
    }

    const allFailedIds = new Set<string>();
    const topicNames: string[] = [];

    revisionItems.forEach((item) => {
      topicNames.push(item.topic);
      (item.failedQuestionIds || []).forEach((id) => allFailedIds.add(id));
    });

    let matchedQuestions = ALL_QUESTIONS.filter((q) =>
      allFailedIds.has(q.id) ||
      topicNames.some(
        (tn) =>
          q.topic.toLowerCase().includes(tn.toLowerCase()) ||
          tn.toLowerCase().includes(q.topic.toLowerCase())
      )
    );

    if (matchedQuestions.length === 0) {
      matchedQuestions = ALL_QUESTIONS.slice(0, 5);
    }

    const shuffled = [...matchedQuestions].sort(() => Math.random() - 0.5);
    setIsPracticeSession(false);
    setRevisionPracticeTopics(topicNames);
    setRevisionPracticeQuestions(shuffled);
  };

  // Tekil Bir Eksik Konuyu Çöz
  const handlePracticeSingleTopic = (topicName: string, failedIds?: string[]) => {
    const idSet = new Set(failedIds || []);
    let matched = ALL_QUESTIONS.filter(
      (q) =>
        idSet.has(q.id) ||
        q.topic.toLowerCase().includes(topicName.toLowerCase()) ||
        topicName.toLowerCase().includes(q.topic.toLowerCase())
    );
    if (matched.length === 0) {
      matched = ALL_QUESTIONS.slice(0, 3);
    }
    const shuffled = [...matched].sort(() => Math.random() - 0.5);
    setIsPracticeSession(false);
    setRevisionPracticeTopics([topicName]);
    setRevisionPracticeQuestions(shuffled);
  };

  // Karşılaşma Seçenekleri altındaki Bireysel Alıştırma Başlatıcı
  const handleStartPracticeFromMatchmaking = () => {
    soundEngine.playClick();
    if (selectedSubjects.length === 0) {
      showToast('Lütfen alıştırma yapmak için en az bir ders seçin!');
      return;
    }

    const picked = filterAppQuestions({
      examType: selectedExamType,
      subjects: selectedSubjects,
      difficultyMode: selectedDifficultyMode,
      count: practiceQuestionCount,
    });

    if (picked.length === 0) {
      showToast('Seçilen filtrelere uygun soru bulunamadı!');
      return;
    }

    const topics = Array.from(new Set(picked.map((q) => q.topic || q.subject)));

    setIsPracticeSession(true);
    setRevisionPracticeTopics(topics);
    setRevisionPracticeQuestions(picked);
  };

  return (
    <div className="min-h-screen bg-[#150A16] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Arka plan parlama efektleri (Orange Glow) */}
      <div className="hero-button-blur -top-24 -left-24 opacity-35 pointer-events-none" />
      <div className="hero-button-blur -bottom-24 -right-24 opacity-25 pointer-events-none" />

      {/* =========================================================================
       * ÖĞRENCİ HEADER
       * ========================================================================= */}
      <header className="border-b border-[rgba(241,78,19,0.25)] bg-[rgba(26,14,28,0.92)] backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
          {/* Sol: Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#F14E13] to-[#D6400D] flex items-center justify-center shadow-lg shadow-[#F14E13]/30 shrink-0">
              <Swords className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-poppins font-black text-sm sm:text-xl tracking-tight text-white whitespace-nowrap">
                  <span className="hidden sm:inline">İŞLER TEKNOLOJİ </span>
                  <span className="sm:hidden inline">İŞLER </span>
                  <span className="text-[#F14E13] text-xs sm:text-sm font-bold">ARENA</span>
                </h1>
              </div>
              <p className="text-xs text-[#B5CBC8] hidden md:block">1v1 Bilgi Düelloları • LGS, TYT & AYT Sınav Hazırlığı</p>
            </div>
          </div>

          {/* Sağ: Akıllı Tahta Butonu + Günlük Görev Butonu + Gerçekçi Öğrenci Profil Hapı (Profile Pill) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Akıllı Tahta Modu (/tahta) */}
            <button
              onClick={() => {
                soundEngine.playClick();
                navigateTo('/tahta');
              }}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:border-cyan-500/50 text-[11px] sm:text-xs font-poppins font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-500/10 group cursor-pointer"
              title="Akıllı Tahta Modu (/tahta)"
              aria-label="Akıllı Tahta Modu (/tahta)"
            >
              <Presentation className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Akıllı Tahta</span>
            </button>

            {/* Sunum Slaytları (/sunum) */}
            <button
              onClick={() => {
                soundEngine.playClick();
                navigateTo('/sunum');
              }}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:border-purple-500/50 text-[11px] sm:text-xs font-poppins font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-purple-500/10 group cursor-pointer"
              title="Proje Sunum Slaytları (/sunum)"
              aria-label="Proje Sunum Slaytları (/sunum)"
            >
              <Presentation className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">📊 Sunum</span>
              <span className="md:hidden">Sunum</span>
            </button>

            <button
              onClick={() => {
                if (isMiddleSchool) {
                  showToast('✨ Ortaokul (LGS) kademesi günlük görev zorunluluğundan muaftır. Dilediğiniz zaman alıştırma yapabilirsiniz.');
                }
                setShowMiniGameScreen(true);
              }}
              className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border text-[11px] sm:text-xs font-poppins font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isMiddleSchool || isCompetitiveUnlocked
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30 animate-pulse'
              }`}
              title={
                isMiddleSchool
                  ? 'Ortaokul (LGS) Kademesi — Günlük Görev Muafiyeti (Kilit Yok)'
                  : '6 Branşta Oynarken Öğreten Günlük Görevler'
              }
            >
              <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden md:inline">Günlük Görev</span>
              <span className="md:hidden">Görev</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-black/30">
                {isMiddleSchool ? 'Muaf' : isCompetitiveUnlocked ? `${completedMiniGames.length}/6` : 'Kilitli'}
              </span>
            </button>

            {/* Sade & Minimalist Öğrenci Profil Bilgi Kartı (Profile Pill) */}
            <div
              className="flex items-center gap-2 sm:gap-3 bg-[#0F0510] border border-white/10 rounded-2xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 shadow-sm"
              title={`${currentPlayer.name} (${isMiddleSchool ? 'Ortaokul / LGS' : 'Lise / YKS'})`}
            >
              <img
                src={currentPlayer.avatarUrl}
                alt={currentPlayer.name.split('(')[0].trim()}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-[#F14E13] object-cover shrink-0"
              />

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-poppins font-bold text-xs sm:text-sm text-white truncate max-w-[95px] sm:max-w-none">
                    {currentPlayer.name.split('(')[0].trim()}
                  </span>
                  <span
                    className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded-full border ${
                      isMiddleSchool
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    }`}
                  >
                    {isMiddleSchool ? 'LGS' : 'YKS'}
                  </span>
                  <span
                    className="hidden sm:inline-flex text-[10px] font-bold font-mono px-2 py-0.2 rounded-full"
                    style={{
                      backgroundColor: `${currentPlayer.bracket.badgeColor}22`,
                      color: currentPlayer.bracket.badgeColor,
                      border: `1px solid ${currentPlayer.bracket.badgeColor}55`,
                    }}
                  >
                    {currentPlayer.bracket.tierName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono mt-0.5 whitespace-nowrap">
                  <span className="text-[#F14E13] font-bold">{currentPlayer.elo} ELO</span>
                  <span className={`flex items-center gap-0.5 font-semibold ${currentPlayer.streak < 0 ? 'text-sky-400' : currentPlayer.streak > 0 ? 'text-amber-400' : 'text-zinc-400'}`}>
                    {currentPlayer.streak < 0 ? (
                      <span>❄️</span>
                    ) : currentPlayer.streak > 0 ? (
                      <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400" />
                    ) : null}
                    <span>{currentPlayer.streak > 0 ? `+${currentPlayer.streak}` : currentPlayer.streak}</span>
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-amber-300 font-bold">{currentPlayer.coins} 🪙</span>
                </div>
              </div>
            </div>

            {/* Ses & Müzik Aç / Kapat Butonu */}
            <button
              onClick={() => {
                soundEngine.toggleMute();
                soundEngine.playClick();
              }}
              className="p-2 sm:px-2.5 sm:py-2 rounded-2xl bg-[#0F0510] border border-white/10 hover:border-orange-500/40 text-zinc-300 hover:text-white transition-all shadow-sm shrink-0 flex items-center justify-center"
              title={isSoundMuted ? 'Sesi Aç (Mute Kaldır)' : 'Sesi Kapat (Mute)'}
            >
              {isSoundMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Öğrenci Sekme Barı */}
        <div className="max-w-7xl mx-auto mt-2 sm:mt-3 grid grid-cols-4 gap-1 sm:flex sm:items-center sm:gap-2 border-t border-white/5 pt-2">
          <button
            onClick={() => {
              setActiveTab('matchmaking');
              soundEngine.playClick();
            }}
            className={`px-1.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-poppins font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all text-center ${
              activeTab === 'matchmaking'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">Karşılaşma</span>
            <span className="hidden sm:inline md:hidden">Düello & Alıştırma</span>
            <span className="hidden md:inline">Karşılaşma & Alıştırma</span>
            {isRankedQueueing && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-300 animate-ping shrink-0" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('economy');
              soundEngine.playClick();
            }}
            className={`px-1.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-poppins font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all text-center ${
              activeTab === 'economy'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">Lig & Mağaza</span>
            <span className="hidden sm:inline md:hidden">Lig & Sadakat</span>
            <span className="hidden md:inline">Haftalık Lig & Sadakat Mağazası</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tournaments');
              soundEngine.playClick();
            }}
            className={`px-1.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-poppins font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all text-center ${
              activeTab === 'tournaments'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">Turnuva</span>
            <span className="hidden sm:inline md:hidden">Turnuvalar</span>
            <span className="hidden md:inline">Turnuvalar & Ödül Havuzu</span>
            {isTournamentQueueing && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-300 animate-ping shrink-0" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('revision');
              soundEngine.playClick();
            }}
            className={`px-1.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-poppins font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all text-center ${
              activeTab === 'revision'
                ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                : 'bg-transparent text-[#B5CBC8] hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">Eksikler</span>
            <span>Eksik Konularım</span>
            {revisionItems.length > 0 && (
              <span
                className={`text-[9px] sm:text-[11px] font-mono font-bold px-1 sm:px-2 py-0.2 sm:py-0.5 rounded-full shrink-0 ${
                  activeTab === 'revision'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                <span className="sm:hidden">{revisionItems.length}</span>
                <span className="hidden sm:inline">{revisionItems.length} Konu</span>
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Bildirim Toast */}
      {actionMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-gradient-to-r from-orange-600 to-[#F14E13] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-white/20">
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

      {/* =========================================================================
       * ANA ÖĞRENCİ İÇERİK ALANI
       * ========================================================================= */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* =========================================================================
         * SEKME 1: 1v1 DÜELLO & KARŞILAŞMA
         * ========================================================================= */}
        {activeTab === 'matchmaking' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SOL KOLON: Öğrenci Kartı & Düello Başlatma Formu (7 Kolon) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Öğrenci Profil & Momentum Kartı */}
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
                          {currentPlayer.name.split('(')[0].trim()}
                        </h2>
                        {isMiddleSchool ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1 font-mono">
                            <span>🏫</span> Ortaokul • LGS (8. Sınıf)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1 font-mono">
                            <span>🎓</span> Lise • YKS (TYT-AYT)
                          </span>
                        )}
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

                      <div className="flex items-center gap-2.5 text-xs font-mono mt-2.5 flex-wrap">
                        <span className="text-[#F14E13] font-bold bg-[#F14E13]/10 px-2.5 py-1 rounded-xl border border-[#F14E13]/25">
                          {currentPlayer.elo} ELO
                        </span>
                        <span className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-xl border ${
                          currentPlayer.streak < 0
                            ? 'text-sky-300 bg-sky-500/10 border-sky-500/25'
                            : currentPlayer.streak > 0
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/25'
                            : 'text-zinc-400 bg-white/5 border-white/10'
                        }`}>
                          {currentPlayer.streak < 0 ? (
                            <span>❄️</span>
                          ) : currentPlayer.streak > 0 ? (
                            <Flame className="w-3.5 h-3.5 fill-amber-400" />
                          ) : null}
                          <span>{currentPlayer.streak > 0 ? `+${currentPlayer.streak}` : currentPlayer.streak} Seri</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pekiştirilemeyen Konu Başlıkları Hızlı Erişim Bandı */}
                {revisionItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-poppins font-bold text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Revize Edilmesi Gereken Konu Başlıkların ({revisionItems.length}):</span>
                      </span>
                      <button
                        onClick={() => setActiveTab('revision')}
                        className="text-[11px] font-mono font-semibold text-[#F14E13] hover:underline"
                      >
                        Tüm Yanlış Yaptığım Soruları & Çözümleri Gör →
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {revisionItems.slice(0, 4).map((rev) => (
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
                            %{rev.errorRatePercent}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Günlük Görev Kartı - Lise için kilit/görev olarak gösterilir, p3 ve p4 (ortaokul) için muafiyet bilgisiyle yer değiştirir */}
              {!isMiddleSchool ? (
                <div
                  className={`game-card p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompetitiveUnlocked
                      ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-[#1A0E1C] to-emerald-950/20'
                      : 'border-[#F14E13]/40 bg-gradient-to-r from-[#F14E13]/10 via-[#1A0E1C] to-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                        isCompetitiveUnlocked
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#F14E13]/20 border-[#F14E13]/40 text-[#F14E13]'
                      }`}
                    >
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-poppins font-bold text-sm sm:text-base text-white">
                          Günlük Görev
                        </h3>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
                          {completedMiniGames.length} / 6 Tamamlandı
                        </span>
                      </div>
                      <p className="text-xs text-[#B5CBC8] mt-0.5">
                        {isCompetitiveUnlocked
                          ? 'Günün görevlerini tamamladın veya diğer branşları deneyimleyebilirsin.'
                          : '1v1 maç kilidini açmak için günün görevini tamamla.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setShowMiniGameScreen(true)}
                      className={`btn-primary !py-2.5 !px-5 text-xs font-bold flex items-center gap-2 whitespace-nowrap shadow-md ${
                        isCompetitiveUnlocked ? '!bg-emerald-600 hover:!bg-emerald-500' : ''
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>Günlük Göreve Git</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="game-card p-4 sm:p-5 border border-sky-500/30 bg-gradient-to-r from-sky-950/30 via-[#1A0E1C] to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border bg-sky-500/20 border-sky-500/40 text-sky-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-poppins font-bold text-sm sm:text-base text-white">
                          Ortaokul Kademesi (8. Sınıf LGS)
                        </h3>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
                          Günlük Görev Muafiyeti
                        </span>
                      </div>
                      <p className="text-xs text-[#B5CBC8] mt-0.5">
                        LGS hazırlık kademesinde günlük görev kilit şartı yoktur; 1v1 düellolar ve alıştırmalar doğrudan açıktır.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        showToast('✨ LGS öğrencileri mini oyunları dilerse serbestçe keşfedebilir.');
                        setShowMiniGameScreen(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40 flex items-center gap-1.5 transition-all"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>Mini Oyunları Keşfet</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Eşleştirme Formu (LGS, TYT, AYT ve Seviye Seçimi) */}
              <div className="game-card p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-poppins font-bold text-base text-white flex items-center gap-2">
                    <Swords className="w-4 h-4 text-[#F14E13]" />
                    <span>Karşılaşma Seçenekleri</span>
                  </h3>
                  {!isCompetitiveUnlocked && selectedMode !== 'practice' && (
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Önce Mini Oyunu Tamamla</span>
                    </span>
                  )}
                </div>

                {/* Mod Seçimi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider">
                    Oyun Modu
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedMode('ranked')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedMode === 'ranked'
                          ? 'border-[#F14E13] bg-[#F14E13]/15 text-white shadow-md shadow-[#F14E13]/20 ring-1 ring-[#F14E13]/40'
                          : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="font-poppins font-bold text-xs sm:text-sm flex items-center justify-between">
                        <span>⚔️ Dereceli Lig</span>
                        {selectedMode === 'ranked' && (
                          <span className="w-2 h-2 rounded-full bg-[#F14E13] shadow-sm shadow-[#F14E13]" />
                        )}
                      </div>
                      <div className="text-[11px] opacity-70 mt-1 leading-snug">Momentum & ELO Puanlı Karşılaşma</div>
                    </button>

                    <button
                      onClick={() => setSelectedMode('tournament')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedMode === 'tournament'
                          ? 'border-[#F14E13] bg-[#F14E13]/15 text-white shadow-md shadow-[#F14E13]/20 ring-1 ring-[#F14E13]/40'
                          : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="font-poppins font-bold text-xs sm:text-sm flex items-center justify-between">
                        <span>🏆 Turnuva Maçı</span>
                        {selectedMode === 'tournament' && (
                          <span className="w-2 h-2 rounded-full bg-[#F14E13] shadow-sm shadow-[#F14E13]" />
                        )}
                      </div>
                      <div className="text-[11px] opacity-70 mt-1 leading-snug">Turnuva Puanı & Büyük Ödül</div>
                    </button>

                    <button
                      onClick={() => setSelectedMode('practice')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedMode === 'practice'
                          ? 'border-[#F14E13] bg-[#F14E13]/15 text-white shadow-md shadow-[#F14E13]/20 ring-1 ring-[#F14E13]/40'
                          : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="font-poppins font-bold text-xs sm:text-sm flex items-center justify-between">
                        <span>🎯 Alıştırma Yap</span>
                        {selectedMode === 'practice' && (
                          <span className="w-2 h-2 rounded-full bg-[#F14E13] shadow-sm shadow-[#F14E13]" />
                        )}
                      </div>
                      <div className="text-[11px] opacity-70 mt-1 leading-snug">Tek Başına Soru Çöz & Pekiştir</div>
                    </button>
                  </div>
                </div>

                {/* Alıştırma Soru Sayısı Seçimi */}
                {selectedMode === 'practice' && (
                  <div className="flex flex-col gap-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider">
                        Alıştırma Soru Sayısı
                      </label>
                      <span className="text-[11px] font-mono text-orange-400 font-bold">
                        {practiceQuestionCount} Soru
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 10, 15].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setPracticeQuestionCount(cnt)}
                          className={`py-2 px-3 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-all ${
                            practiceQuestionCount === cnt
                              ? 'border-[#F14E13] bg-[#F14E13]/20 text-[#F14E13] shadow-sm shadow-[#F14E13]/30'
                              : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20'
                          }`}
                        >
                          {cnt} Soru
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sınav Tipi (LGS, TYT, AYT) - Kademeye Göre Filtrelenmiş */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider">
                      Sınav Kategorisi
                    </label>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {isMiddleSchool ? '8. Sınıf (LGS Hazırlık)' : 'YKS (TYT / AYT)'}
                    </span>
                  </div>
                  <div className={`grid ${availableExamTypes.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                    {availableExamTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleExamTypeChange(t)}
                        className={`py-2 px-3 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-all ${
                          selectedExamType === t
                            ? 'border-[#F14E13] bg-[#F14E13]/20 text-[#F14E13] shadow-sm shadow-[#F14E13]/30'
                            : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20'
                        }`}
                      >
                        {t === 'LGS' ? 'LGS (8. Sınıf)' : t === 'TYT' ? 'TYT (Temel)' : 'AYT (Alan)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soru Seviyesi / Zorluk Seçimi */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#B5CBC8] font-semibold uppercase tracking-wider">
                    Soru Seviyesi / Zorluk
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'adaptive', label: '🎯 Seviyeme Göre (Adaptif)' },
                      { id: 'easy', label: '🟢 Kolay' },
                      { id: 'medium', label: '🟡 Orta' },
                      { id: 'hard', label: '🔴 Zor' },
                    ].map((diff) => (
                      <button
                        key={diff.id}
                        onClick={() => setSelectedDifficultyMode(diff.id as any)}
                        className={`py-2 px-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all text-center ${
                          selectedDifficultyMode === diff.id
                            ? 'border-[#F14E13] bg-[#F14E13]/20 text-white shadow-sm shadow-[#F14E13]/30'
                            : 'border-white/10 bg-[#0F0510] text-[#B5CBC8] hover:border-white/20'
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
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

                {/* Turnuva Seçimi */}
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
                      {backendState.tournaments
                        .filter((t) => (isMiddleSchool ? t.examType === 'LGS' : t.examType !== 'LGS'))
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title} ({t.examType})
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Ana Katılım / Çıkış Butonu */}
                <div className="pt-2">
                  {selectedMode === 'practice' ? (
                    <button
                      onClick={handleStartPracticeFromMatchmaking}
                      className="w-full py-4 rounded-2xl text-white font-poppins font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-2xl transition-all border border-white/20 bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 shadow-[#F14E13]/30 hover:brightness-110 active:scale-[0.99]"
                    >
                      <Target className="w-5 h-5 fill-current" />
                      <span>ALIŞTIRMAYI BAŞLAT (TEK BAŞINA ÇÖZ)</span>
                    </button>
                  ) : isSelectedModeQueueing ? (
                    <button
                      onClick={leaveQueue}
                      className="w-full py-4 rounded-2xl bg-red-600/20 border-2 border-red-500/50 text-red-300 font-poppins font-black text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-red-600/30 transition-all shadow-xl shadow-red-950/40"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping shrink-0" />
                      <span>
                        ⏳ Eşleşme Aranıyor ({Math.floor(myQueueEntry?.waitSeconds ?? 0)}s) — Sıradan Çık
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartQueue}
                      className={`w-full py-4 rounded-2xl text-white font-poppins font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-2xl transition-all border border-white/20 ${
                        !isCompetitiveUnlocked
                          ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 shadow-amber-600/30 hover:brightness-110'
                          : 'bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 shadow-[#F14E13]/30 hover:brightness-110 active:scale-[0.99]'
                      }`}
                    >
                      {!isCompetitiveUnlocked ? (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Günlük Mini Oyunu Tamamla & 1v1 Kilidini Aç</span>
                        </>
                      ) : (
                        <>
                          <Swords className="w-5 h-5 fill-current" />
                          <span>1v1 RAKİP BUL & DÜELLOYU BAŞLAT</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* SAĞ KOLON: Haftalık Lig Sıralaması (5 Kolon) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Haftalık ELO Sıralaması */}
              <div className="game-card p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h3 className="font-poppins font-bold text-sm text-white">Haftalık Arena Liderleri</h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#B5CBC8]">Top 5</span>
                </div>

                <div className="divide-y divide-white/5">
                  {[...backendState.players]
                    .sort((a, b) => b.elo - a.elo || b.streak - a.streak)
                    .slice(0, 5)
                    .map((p, idx) => {
                    const isMe = p.id === currentPlayerId;
                    return (
                      <div
                        key={p.id}
                        className={`py-2.5 px-3 flex items-center justify-between text-xs rounded-xl transition-colors ${
                          isMe ? 'bg-[#F14E13]/15 font-semibold text-white' : 'hover:bg-white/5 text-[#B5CBC8]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-amber-400 text-sm">#{idx + 1}</span>
                          <img
                            src={p.avatarUrl}
                            alt={p.name}
                            className="w-7 h-7 rounded-lg border border-white/15 object-cover bg-black"
                          />
                          <span className="text-white font-medium">{p.name.split('(')[0].trim()}</span>
                        </div>
                        <div className="font-mono text-right">
                          <span className="text-[#F14E13] font-bold">{p.elo} ELO</span>
                          <span className={`text-[10px] ml-1.5 ${p.streak < 0 ? 'text-sky-400' : p.streak > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
                            {p.streak > 0 ? `+${p.streak}🔥` : p.streak < 0 ? `${p.streak}❄️` : `${p.streak}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * SEKME 2: HAFTALIK LİG & SADAKAT MAĞAZASI
         * ========================================================================= */}
        {activeTab === 'economy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SOL: Lig Durumu & Haftalık Ödül (7 Kolon) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Lig Kartı */}
              <div className="game-card p-6 border-orange-500/30 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border"
                      style={{
                        backgroundColor: `${currentPlayer.bracket.badgeColor}22`,
                        borderColor: currentPlayer.bracket.badgeColor,
                        color: currentPlayer.bracket.badgeColor,
                      }}
                    >
                      🏆
                    </div>
                    <div>
                      <span className="text-xs text-[#B5CBC8] font-mono">GÜNCEL KADEME</span>
                      <h2 className="text-xl font-bold font-poppins text-white">
                        {currentPlayer.bracket.tierName}
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#B5CBC8] font-mono">KADEME ARALIĞI</span>
                    <div className="font-mono font-bold text-white text-sm">
                      {currentPlayer.bracket.minElo} -{' '}
                      {currentPlayer.bracket.maxElo === Infinity ? 'Üstü' : currentPlayer.bracket.maxElo} ELO
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#B5CBC8]">Bu Hafta Oynanan Maç:</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold">
                          Hedef: {WEEKLY_MATCHES_THRESHOLD} Maç
                        </span>
                      </div>
                      <div className="font-mono font-bold text-white text-base mt-0.5">
                        {currentPlayer.weeklyMatchesPlayed}{' '}
                        <span className="text-xs text-[#B5CBC8] font-normal">
                          / {WEEKLY_MATCHES_THRESHOLD} (Ödül Eşiği)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleClaimWeekly}
                      disabled={
                        currentPlayer.weeklyRewardClaimed ||
                        currentPlayer.weeklyMatchesPlayed < WEEKLY_MATCHES_THRESHOLD
                      }
                      className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 ${
                        currentPlayer.weeklyRewardClaimed
                          ? 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed'
                          : currentPlayer.weeklyMatchesPlayed >= WEEKLY_MATCHES_THRESHOLD
                          ? 'btn-primary'
                          : 'bg-zinc-850 text-zinc-400 border border-white/10 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {currentPlayer.weeklyRewardClaimed
                        ? '✓ Haftalık Ödül Alındı'
                        : `🎁 Haftalık Lig Ödülünü Al (+${currentPlayer.bracket.weeklyCoins} Coin)`}
                    </button>
                  </div>

                  {/* 15 Maç Ödül İlerleme Çubuğu */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="w-full bg-[#0F0510] h-2.5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-[#F14E13] to-amber-400 transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (currentPlayer.weeklyMatchesPlayed / WEEKLY_MATCHES_THRESHOLD) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#B5CBC8]">
                      <span>
                        {currentPlayer.weeklyMatchesPlayed >= WEEKLY_MATCHES_THRESHOLD
                          ? '✨ 15 maç tamamlandı! Haftalık lig ödülü talep edilebilir.'
                          : `Haftalık ödülü açmak için ${Math.max(
                              0,
                              WEEKLY_MATCHES_THRESHOLD - currentPlayer.weeklyMatchesPlayed
                            )} maç daha tamamlamalısınız.`}
                      </span>
                      <span className="font-bold text-amber-400">
                        %{Math.min(
                          100,
                          Math.round(
                            (currentPlayer.weeklyMatchesPlayed / WEEKLY_MATCHES_THRESHOLD) * 100
                          )
                        )}
                      </span>
                    </div>
                  </div>
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
                  Düellolardan kazandığınız Coin'leri, İşler Kitabevi şubelerinde geçerli indirim kuponlarına dönüştürün!
                  <br />
                  <span className="font-mono text-amber-400 font-bold">5000 Coin = 10 İşler Puanı (%10 İndirim)</span>
                </p>

                <div className="flex items-center gap-2 bg-[#0F0510] p-3 rounded-xl border border-white/10">
                  <Coins className="w-5 h-5 text-amber-400 shrink-0" />
                  <input
                    type="number"
                    step="500"
                    min="5000"
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
                  disabled={currentPlayer.coins < 5000}
                  className="btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>Kupon Üret ({Math.floor(coinsToConvert / 500)} Puan)</span>
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
         * SEKME 3: HAFTALIK TURNUVALAR & ÖDÜL HAVUZU
         * ========================================================================= */}
        {activeTab === 'tournaments' && (
          <div className="flex flex-col gap-6 animate-fade-in font-sans">
            {/* Üst Bilgi Barı */}
            <div className="game-card p-5 border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-[#1C0F22] via-[#220E24] to-[#120713]">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <h2 className="font-poppins font-black text-xl text-white">
                    Haftalık Şampiyonluk Turnuvaları & Ödül Havuzu
                  </h2>
                </div>
                <p className="text-xs text-[#B5CBC8] mt-1 max-w-2xl leading-relaxed">
                  Turnuva maçlarına doğrudan katılıp puan toplayarak haftalık sıralamada yüksel. Katıldığın her düello otomatik olarak turnuva hanene yazılır ve sezon sonunda en yüksek puana sahip şampiyonlar büyük ödül havuzundan ödüllerini alır!
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Toplam 4.000+ Coin Havuzu</span>
                </span>
              </div>
            </div>

            {/* Turnuva Kartları */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {backendState.tournaments.map((t) => (
                <div
                  key={t.id}
                  className="game-card p-6 flex flex-col justify-between gap-5 border border-amber-500/30 bg-gradient-to-b from-[#180C1E] to-[#0F0510] hover:border-amber-500/50 transition-all rounded-2xl shadow-xl"
                >
                  {/* Kart Üst Bilgileri */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                              t.examType === 'LGS'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : t.examType === 'TYT'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            }`}
                          >
                            {t.examType} LİGİ
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Aktif Sezon
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            Haftalık Turnuva
                          </span>
                        </div>
                        <h3 className="font-poppins font-black text-lg text-white tracking-wide">
                          {t.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5 shrink-0">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{t.participants.length} Katılımcı</span>
                      </div>
                    </div>

                    {/* Kapsam Branşlar */}
                    {t.allowedSubjects && t.allowedSubjects.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Kapsam:</span>
                        {t.allowedSubjects.map((sub) => (
                          <span
                            key={sub}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5 capitalize"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Şık Ödül Havuzu Vitrini */}
                    <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span className="font-poppins font-bold uppercase tracking-wider text-[11px]">
                            Ödül Havuzu Dağılımı
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          Dereceye Göre
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {t.prizePoolDesc.split('|').map((tier, idx) => {
                          const medals = ['🥇', '🥈', '🥉'];
                          return (
                            <div
                              key={idx}
                              className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-[11px] text-[#B5CBC8]"
                            >
                              <span className="text-base shrink-0">{medals[idx] || '🎖️'}</span>
                              <span className="font-mono font-medium text-white/90 text-[11px] leading-tight">
                                {tier.trim()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Katılımcı Sıralama Tablosu */}
                    <div className="bg-[#0F0510] rounded-xl border border-white/5 overflow-hidden mt-1">
                      <div className="px-3.5 py-2 border-b border-white/5 flex justify-between text-[11px] font-mono text-[#B5CBC8]">
                        <span className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          Katılımcı Sıralaması
                        </span>
                        <span>Puan • G/M</span>
                      </div>

                      <div className="divide-y divide-white/5 max-h-48 overflow-y-auto">
                        {t.participants.length === 0 ? (
                          <div className="py-4 text-center text-xs text-zinc-500 font-mono">
                            Henüz turnuva maçı oynanmadı. İlk maçı sen yap!
                          </div>
                        ) : (
                          t.participants.map((p, idx) => {
                            const isMe = p.playerId === currentPlayerId;
                            return (
                              <div
                                key={p.playerId}
                                className={`px-3.5 py-2.5 flex items-center justify-between text-xs transition-colors ${
                                  isMe ? 'bg-[#F14E13]/15 text-white font-semibold' : 'text-[#B5CBC8] hover:bg-white/[0.02]'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono text-xs w-5 ${idx === 0 ? 'text-amber-400 font-bold' : idx === 1 ? 'text-slate-300 font-bold' : idx === 2 ? 'text-amber-600 font-bold' : 'text-zinc-500'}`}>
                                    #{idx + 1}
                                  </span>
                                  <span className={isMe ? 'text-white' : 'text-zinc-200'}>{p.name}</span>
                                  {isMe && (
                                    <span className="bg-[#F14E13] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
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
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Turnuva Aksiyonu (Sadece Tek ve Net Maç Arama Butonu - Kaydol Butonu Kaldırıldı) */}
                  <div className="pt-2 border-t border-white/5">
                    {myQueueEntry?.mode === 'tournament' && myQueueEntry?.tournamentId === t.id ? (
                      <button
                        onClick={leaveQueue}
                        className="w-full py-3 px-4 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                        <span>⏳ Turnuva Rakibi Aranıyor ({Math.floor(myQueueEntry.waitSeconds ?? 0)}s) — Sıradan Çık</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (isMiddleSchool && t.examType !== 'LGS') {
                            showToast('⚠️ Ortaokul öğrencileri yalnızca LGS turnuvalarına katılabilir.');
                            return;
                          }
                          if (!isMiddleSchool && t.examType === 'LGS') {
                            showToast('⚠️ Lise öğrencileri yalnızca TYT ve AYT turnuvalarına katılabilir.');
                            return;
                          }
                          if (!isCompetitiveUnlocked) {
                            showToast(
                              '🔒 Turnuva maçına katılmak için önce Günün Öğretici Mini Oyununu tamamlamalısın!'
                            );
                            setShowMiniGameScreen(true);
                            return;
                          }
                          setSelectedMode('tournament');
                          setSelectedTournamentId(t.id);
                          setSelectedExamType(t.examType as any);
                          joinQueue({
                            examType: t.examType,
                            subjects: t.allowedSubjects,
                            mode: 'tournament',
                            tournamentId: t.id,
                          } as any);
                        }}
                        className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F14E13]/25 hover:shadow-[#F14E13]/40 transition-all"
                      >
                        <Swords className="w-4 h-4" />
                        <span>Turnuva Maçı Ara & Puan Kazan</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
         * SEKME 4: FAZ 3 — EKSİK KONULARIM (YÜZDESEL GÖRÜNÜM & KARIŞIK ÇÖZ)
         * ========================================================================= */}
        {activeTab === 'revision' && (
          <div className="flex flex-col gap-6 animate-fade-in font-sans">
            {/* Üst Bilgi ve Yüzdesel Özet & "🔀 Yanlışlarımı Karışık Çöz" Barı */}
            <div className="game-card p-6 border-amber-500/40 flex flex-col gap-5 bg-gradient-to-br from-[#1A0E1C] via-[#220E24] to-[#120713]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#F14E13]" />
                    <h2 className="font-poppins font-black text-xl text-white">
                      Eksik Konularım & Kazanım Analizi
                    </h2>
                  </div>
                  <p className="text-xs text-[#B5CBC8] mt-1 max-w-xl leading-relaxed">
                    Düellolarda yanlış yanıtladığın sorular konu bazında gruplanır ve eksiklik yüzdesi hesaplanır.
                    Eksiklerini tamamladıkça yüzdeler düşer ve ekstra Coin kazanırsın!
                  </p>
                </div>

                {/* Büyük ve Vurgulu: 🔀 Yanlışlarımı Karışık Çöz Butonu */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handlePracticeAllRevision}
                    disabled={revisionItems.length === 0}
                    className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-[#F14E13] to-amber-500 hover:brightness-110 active:scale-[0.99] text-white font-poppins font-black text-sm flex items-center gap-2.5 shadow-xl shadow-[#F14E13]/30 border border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shuffle className="w-5 h-5 text-white" />
                    <span>Yanlışlarımı Karışık Çöz</span>
                  </button>
                </div>
              </div>

              {/* Yüzdesel Özet Göstergeleri */}
              {revisionItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-[#0F0510] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">TOPLAM EKSİK KONU</span>
                      <span className="text-2xl font-black font-poppins text-white">
                        {revisionItems.length} Başlık
                      </span>
                    </div>
                    <span className="text-2xl">📌</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0F0510] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">ORTALAMA EKSİKLİK / HATA</span>
                      <span
                        className={`text-2xl font-black font-poppins ${
                          avgErrorRate >= 65
                            ? 'text-red-400'
                            : avgErrorRate >= 35
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        %{avgErrorRate}
                      </span>
                    </div>
                    <span className="text-2xl">📊</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0F0510] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">ÖDÜL TEŞVİKİ</span>
                      <span className="text-sm font-bold font-mono text-amber-300">
                        Tekrar Tamamla ➔ +30 Coin 🪙
                      </span>
                    </div>
                    <span className="text-2xl">🎁</span>
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
                        ? 'bg-[#F14E13] text-white shadow-md shadow-[#F14E13]/30'
                        : 'bg-[#0F0510] text-[#B5CBC8] border border-white/10 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Konu Kartları & Yüzdesel Hata Oranı Barları */}
            {revisionItems.length === 0 ? (
              <div className="game-card p-10 text-center flex flex-col items-center gap-3 border-emerald-500/30">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-poppins font-bold text-base text-white">
                  Şu Anda Revize Edilmesi Gereken Eksik Konunuz Yok!
                </h3>
                <p className="text-xs text-[#B5CBC8] max-w-md">
                  1v1 Düellolarda yanlış yaptığınız sorular otomatik olarak analiz edilip bu ekrana konu başlığıyla birlikte yansıyacaktır.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {revisionItems
                  .filter((rev) => revisionSubjectFilter === 'all' || rev.subject === revisionSubjectFilter)
                  .map((rev) => {
                    // Yüzdelik renkleri: >= 65 kırmızı, 35-64 kehribar/sarı, < 35 yeşil
                    const errRate = rev.errorRatePercent ?? 50;
                    const barColor =
                      errRate >= 65
                        ? 'bg-gradient-to-r from-red-600 to-rose-600'
                        : errRate >= 35
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400';

                    const badgeColor =
                      errRate >= 65
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : errRate >= 35
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

                    const recs = getRecommendationsForTopic(rev.subject, rev.topic, (rev as any).examType || 'TYT');

                    return (
                      <div
                        key={`card-${rev.subject}-${rev.topic}`}
                        className="game-card p-5 border-amber-500/30 flex flex-col justify-between gap-4 shadow-xl"
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
                                  {(rev as any).examType || 'TYT'}
                                </span>
                              </div>
                              <h3 className="font-poppins font-black text-base text-amber-300 mt-1.5">
                                {rev.topic}
                              </h3>
                            </div>

                            {/* Yüzdesel Hata Rozeti */}
                            <span className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border shrink-0 ${badgeColor}`}>
                              %{errRate} Hata ({rev.wrongCount}/{rev.totalAttempts} Yanlış)
                            </span>
                          </div>

                          {/* Yüzdesel İlerleme Çubuğu (Progress Bar) */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                              <span>Eksiklik Düzeyi:</span>
                              <span className="font-bold text-white">%{errRate}</span>
                            </div>
                            <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                style={{ width: `${Math.min(100, Math.max(8, errRate))}%` }}
                              />
                            </div>
                          </div>

                          {/* İşler Yayın Grubu Kaynak Önerileri */}
                          {recs && recs.length > 0 && (
                            <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                                <BookOpen className="w-3.5 h-3.5 text-[#F14E13]" />
                                <span>Önerilen İşler Yayını:</span>
                              </div>
                              {recs.slice(0, 1).map((rec) => (
                                <div
                                  key={rec.id}
                                  className="p-3 rounded-xl bg-[#0F0510] border border-[#F14E13]/30 text-xs flex flex-col gap-1"
                                >
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <span className="font-poppins font-bold text-white">{rec.bookTitle}</span>
                                    <span className="px-2 py-0.5 rounded bg-[#F14E13]/20 text-[#F14E13] font-mono text-[10px] font-semibold">
                                      {rec.publisher}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-amber-200/90 font-medium">
                                    📖 Bölüm: {rec.recommendedSection}
                                  </div>
                                  <div className="text-[11px] text-[#B5CBC8] leading-relaxed">
                                    🎯 {rec.studyTip}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Aksiyon: 🎯 Bu Konuyu Çöz */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handlePracticeSingleTopic(rev.topic, rev.failedQuestionIds)}
                            className="btn-primary w-full py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#F14E13]/20"
                          >
                            <Target className="w-3.5 h-3.5" />
                            <span>Bu Konuyu Çöz</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Günlük Öğretici Mini Oyunlar Modalı (Keşif & Simülasyon — 6 Branş) */}
      <DailyMiniGameModal
        isOpen={showMiniGameScreen}
        isCompetitiveUnlocked={isCompetitiveUnlocked}
        completedMiniGames={completedMiniGames}
        onCompleteMiniGame={handleCompleteMiniGame}
        onProceedToArena={() => {
          setShowMiniGameScreen(false);
          setActiveTab('matchmaking');
        }}
        onClose={() => setShowMiniGameScreen(false)}
        onResetLockDemo={handleResetLockDemo}
      />
    </div>
  );
}
