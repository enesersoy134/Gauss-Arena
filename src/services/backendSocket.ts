import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { BACKEND_GAME_DATA } from '../data/backendMockData';
import { Question, RevisionDetail } from '../types/game';
import { ResourceRecommendation } from '../utils/resourceRecommendations';

export interface RevisionWrongQuestion {
  externalId: string;
  text: string;
  explanation?: string | null;
  difficulty?: string;
  failedCount?: number;
  failedAt?: string;
}

export interface RevisionTopicItem {
  topic: string;
  subject: string;
  examType: string;
  mistakeCount: number;
  lastMistakeAt: string;
  wrongQuestions: RevisionWrongQuestion[];
  recommendedResources?: ResourceRecommendation[];
}

export interface BackendPlayer {
  id: string;
  name: string;
  roleTag?: string;
  avatarUrl: string;
  elo: number;
  streak: number;
  effectiveMmr: number;
  bracket: {
    tierName: string;
    minElo: number;
    maxElo: number;
    weeklyCoins: number;
    badgeColor: string;
  };
  coins: number;
  islerPoints: number;
  weeklyMatchesPlayed: number;
  weeklyRewardClaimed: boolean;
  revisionTopics?: RevisionTopicItem[];
  revisionDetails?: RevisionDetail[];
  coupons: Array<{
    code: string;
    discountPercent: number;
    pointsSpent: number;
    createdAt: string;
    description: string;
  }>;
}

export interface WeeklyBracket {
  tierName: string;
  minElo: number;
  maxElo: number;
  weeklyCoins: number;
  badgeColor: string;
}

export interface TournamentParticipant {
  playerId: string;
  name: string;
  points: number;
  wins: number;
  losses: number;
  elo: number;
}

export interface Tournament {
  id: string;
  title: string;
  examType: 'TYT' | 'AYT';
  allowedSubjects: string[];
  status: 'ACTIVE' | 'FINISHED';
  prizePoolDesc: string;
  rewardsDistributed: boolean;
  participants: TournamentParticipant[];
}

export interface QueueEntry {
  playerId: string;
  name: string;
  elo: number;
  streak: number;
  examType: 'TYT' | 'AYT';
  subjects: string[];
  mode: 'ranked' | 'tournament';
  tournamentId: string | null;
  enqueuedAt: number;
  waitSeconds?: number;
}

export interface PairDiagnostic {
  playerAId: string;
  playerAName: string;
  playerBId: string;
  playerBName: string;
  matched: boolean;
  reason?: string;
  elapsedSeconds?: number;
  deltaRealElo?: number;
  deltaEffectiveMmr?: number;
  streakTolerance?: number;
  commonSubjects?: string[];
  recentMatches?: number;
}

export interface BackendFullState {
  players: BackendPlayer[];
  weeklyBrackets: WeeklyBracket[];
  tournaments: Tournament[];
  matchHistory: any[];
  questionBankStats: {
    totalQuestions: number;
    bySubject: Record<string, number>;
    byDifficulty: Record<string, number>;
    byExamType: Record<string, number>;
  };
  queueSnapshot: QueueEntry[];
  pairDiagnostics: PairDiagnostic[];
  pairwiseMatchesLast24h: any[];
}

export interface DuelPlayerPublic {
  id: string;
  name: string;
  avatarUrl: string;
  elo: number;
  streak: number;
  effectiveMmr: number;
  isGhost: boolean;
  totalScore: number;
  correctCount: number;
  hasAnsweredCurrent: boolean;
}

export interface DuelQuestionPublic {
  externalId: string;
  examType: string;
  subject: string;
  difficulty: string;
  subTopic?: string;
  text: string;
  imageUrl?: string;
  options: string[];
  durationMs: number;
  interactiveQuestion?: Question | null;
  explanation?: string | null;
}

export interface DuelRoundHistoryItem {
  questionIndex: number;
  externalId: string;
  difficulty: string;
  subject: string;
  subTopic?: string;
  text?: string;
  correctOptionIndex: number;
  interactiveQuestion?: Question | null;
  explanation?: string | null;
  answerA: {
    selectedOptionIndex: number;
    remainingMs: number;
    isCorrect: boolean;
    score: number;
    accuracy?: number;
    answerInput?: any;
  };
  answerB: {
    selectedOptionIndex: number;
    remainingMs: number;
    isCorrect: boolean;
    score: number;
    accuracy?: number;
    answerInput?: any;
  };
}

export interface DuelPublicState {
  matchId: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  mode: string;
  tournamentId: string | null;
  examType: string;
  commonSubjects: string[];
  diagnostics?: any;
  playerA: DuelPlayerPublic;
  playerB: DuelPlayerPublic;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionStartedAt: number;
  durationMs: number;
  remainingMs: number;
  currentQuestion: DuelQuestionPublic | null;
  roundHistory: DuelRoundHistoryItem[];
}

export interface DuelRoundResultEvent {
  matchId: string;
  roundResult: DuelRoundHistoryItem;
  publicState: DuelPublicState;
}

export interface DuelSummary {
  matchId: string;
  completedAt: string;
  mode: string;
  tournamentId: string | null;
  examType: string;
  commonSubjects: string[];
  winnerId: string | null;
  winnerName: string;
  tieBreakerUsed: boolean;
  playerA: DuelPlayerPublic & {
    newElo: number;
    deltaElo: number;
    newStreak: number;
    newEffectiveMmr: number;
  };
  playerB: DuelPlayerPublic & {
    newElo: number;
    deltaElo: number;
    newStreak: number;
    newEffectiveMmr: number;
  };
  eloUpdate: {
    deltaA: number;
    deltaB: number;
    newEloA: number;
    newEloB: number;
    newStreakA: number;
    newStreakB: number;
    smurfBoostA?: boolean;
    smurfBoostB?: boolean;
    antiFarmDamped?: boolean;
    deltaR?: number;
  };
  coinsAwardedA: number;
  coinsAwardedB: number;
  roundHistory: DuelRoundHistoryItem[];
}

/**
 * Singleton Socket.io instance
 */
let sharedSocket: Socket | null = null;

export function getBackendSocket(): Socket {
  if (!sharedSocket) {
    sharedSocket = io({
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return sharedSocket;
}

/**
 * Initial fallback players list from backendMockData & specs
 */
function createFallbackPlayers(): BackendPlayer[] {
  return [
    {
      id: 'p1',
      name: 'Ahmet Yılmaz (Standart)',
      roleTag: 'Dengeli Oyuncu',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmet&backgroundColor=f14e13',
      elo: 1250,
      streak: 0,
      effectiveMmr: 1250,
      bracket: { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
      coins: 320,
      islerPoints: 45,
      weeklyMatchesPlayed: 14,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p2',
      name: 'Zeynep Kaya (Smurf / +5 Seri)',
      roleTag: 'Yüksek Momentum (1200 ELO, S=+5)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zeynep&backgroundColor=b6e3f4',
      elo: 1200,
      streak: 5,
      effectiveMmr: 1324,
      bracket: { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
      coins: 450,
      islerPoints: 60,
      weeklyMatchesPlayed: 8,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p3',
      name: 'Mert Demir (Üst Orta Bant)',
      roleTag: 'Sağlam Rakip (1340 ELO, S=+1)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mert&backgroundColor=c0aede',
      elo: 1340,
      streak: 1,
      effectiveMmr: 1340,
      bracket: { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
      coins: 580,
      islerPoints: 80,
      weeklyMatchesPlayed: 15,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p4',
      name: 'Elif Şahin (Üst Lig / Anti-Farm)',
      roleTag: 'Yüksek ELO (1620 ELO, S=+3)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elif&backgroundColor=ffd5dc',
      elo: 1620,
      streak: 3,
      effectiveMmr: 1634,
      bracket: { tierName: 'Platin Lig', minElo: 1600, maxElo: 1799.9, weeklyCoins: 850, badgeColor: '#06b6d4' },
      coins: 940,
      islerPoints: 130,
      weeklyMatchesPlayed: 18,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p5',
      name: 'Can Özkan (Win-Trade / Cooldown)',
      roleTag: 'Dengeli Rakip (1240 ELO, S=-1)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Can&backgroundColor=d1d4f9',
      elo: 1240,
      streak: -1,
      effectiveMmr: 1240,
      bracket: { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
      coins: 210,
      islerPoints: 20,
      weeklyMatchesPlayed: 12,
      weeklyRewardClaimed: false,
      coupons: [],
    },
    {
      id: 'p6',
      name: 'Selin Arslan (Düşüş Serisi)',
      roleTag: 'Soğuk Seri (1310 ELO, S=-4)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Selin&backgroundColor=ffdfbf',
      elo: 1310,
      streak: -4,
      effectiveMmr: 1251,
      bracket: { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
      coins: 190,
      islerPoints: 25,
      weeklyMatchesPlayed: 6,
      weeklyRewardClaimed: false,
      coupons: [],
    },
  ];
}

export function useBackendGame() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // URL'den başlangıç pencere numarası ve oyuncu kimliğini oku
  const [windowNum] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    const params = new URLSearchParams(window.location.search);
    const win = params.get('window');
    return win ? Number(win) : 1;
  });

  const [currentPlayerId, setCurrentPlayerIdState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'p2';
    const params = new URLSearchParams(window.location.search);
    const playerParam = params.get('player');
    if (playerParam) return playerParam;
    try {
      const stored = sessionStorage.getItem('isler_active_player_id');
      if (stored) return stored;
    } catch {}
    const win = params.get('window');
    return win === '2' ? 'p3' : 'p2';
  });

  const [backendState, setBackendState] = useState<BackendFullState>(() => {
    return {
      players: createFallbackPlayers(),
      weeklyBrackets: [
        { tierName: 'Bronz Lig', minElo: 0, maxElo: 1199.9, weeklyCoins: 100, badgeColor: '#cd7f32' },
        { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
        { tierName: 'Altın Lig', minElo: 1400, maxElo: 1599.9, weeklyCoins: 500, badgeColor: '#eab308' },
        { tierName: 'Platin Lig', minElo: 1600, maxElo: 1799.9, weeklyCoins: 850, badgeColor: '#06b6d4' },
        { tierName: 'Elmas Lig', minElo: 1800, maxElo: Infinity, weeklyCoins: 1250, badgeColor: '#a855f7' },
      ],
      tournaments: [
        {
          id: 'tour-tyt-1',
          title: 'Haftalık TYT Büyük Bilgi Turnuvası',
          examType: 'TYT',
          allowedSubjects: ['matematik', 'fizik', 'kimya', 'turkce'],
          status: 'ACTIVE',
          prizePoolDesc: '1.ye 1000 Coin + 100 İşler Puanı | 2.ye 600 Coin + 60 İşler Puanı | 3.ye 350 Coin + 35 İşler Puanı',
          rewardsDistributed: false,
          participants: [
            { playerId: 'p1', name: 'Ahmet Yılmaz (Standart)', points: 60, wins: 2, losses: 0, elo: 1250 },
            { playerId: 'p2', name: 'Zeynep Kaya (Smurf / +5 Seri)', points: 60, wins: 2, losses: 0, elo: 1200 },
          ],
        },
        {
          id: 'tour-ayt-1',
          title: 'Haftalık AYT Sayısal & Edebiyat Kupası',
          examType: 'AYT',
          allowedSubjects: ['matematik', 'fizik', 'kimya', 'turkce'],
          status: 'ACTIVE',
          prizePoolDesc: '1.ye 1500 Coin + 150 İşler Puanı | 2.ye 900 Coin + 90 İşler Puanı | 3.ye 500 Coin + 50 İşler Puanı',
          rewardsDistributed: false,
          participants: [
            { playerId: 'p4', name: 'Elif Şahin (Üst Lig / Anti-Farm)', points: 90, wins: 3, losses: 0, elo: 1620 },
          ],
        },
      ],
      matchHistory: [],
      questionBankStats: {
        totalQuestions: 18,
        bySubject: { matematik: 5, fizik: 5, kimya: 4, biyoloji: 4 },
        byDifficulty: { EASY: 6, MEDIUM: 6, HARD: 6 },
        byExamType: { TYT: 10, AYT: 8 },
      },
      queueSnapshot: [],
      pairDiagnostics: [],
      pairwiseMatchesLast24h: [],
    };
  });

  const [activeDuel, setActiveDuel] = useState<DuelPublicState | null>(null);
  const [roundResultEvent, setRoundResultEvent] = useState<DuelRoundResultEvent | null>(null);
  const [duelSummary, setDuelSummary] = useState<DuelSummary | null>(null);
  const [queueError, setQueueError] = useState<string | null>(null);

  const socketRef = useRef<Socket>(getBackendSocket());

  // Oyuncu değiştirme
  const selectPlayer = useCallback((newPlayerId: string) => {
    setCurrentPlayerIdState(newPlayerId);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('isler_active_player_id', newPlayerId);
      } catch {}
    }
    socketRef.current.emit('player:select', { playerId: newPlayerId });
  }, []);

  // Dinamik Rastgele Yeni Öğrenci Hesabı Oluşturma (/random)
  const createRandomPlayer = useCallback(async (): Promise<BackendPlayer | null> => {
    try {
      const res = await fetch('/api/players/random', { method: 'POST' });
      const data = await res.json();
      if (data && data.ok && data.player) {
        selectPlayer(data.player.id);
        return data.player;
      }
    } catch (err) {
      console.error('createRandomPlayer error:', err);
    }
    return null;
  }, [selectPlayer]);

  // Yanlış Soruları Tekrar Çözme Antrenmanını Tamamlama (+30 Coin)
  const completeRevisionPractice = useCallback(async (playerId: string, solvedTopics?: string[]) => {
    try {
      const res = await fetch('/api/players/complete-revision-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, solvedTopics }),
      });
      return await res.json();
    } catch (err) {
      console.error('completeRevisionPractice error:', err);
      return { ok: false, reason: 'Bağlantı hatası' };
    }
  }, []);

  useEffect(() => {
    const socket = socketRef.current;

    const onConnect = () => {
      setIsConnected(true);
      // Başlangıçta aktif oyuncuyu backend'e bildir
      socket.emit('player:select', { playerId: currentPlayerId });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onStateUpdate = (fullState: BackendFullState) => {
      if (fullState) {
        setBackendState(fullState);
      }
    };

    const onQueueTick = (data: { queueSnapshot: QueueEntry[]; pairDiagnostics: PairDiagnostic[] }) => {
      setBackendState((prev) => ({
        ...prev,
        queueSnapshot: data.queueSnapshot || [],
        pairDiagnostics: data.pairDiagnostics || [],
      }));
    };

    const onQueueError = (err: { message: string }) => {
      setQueueError(err.message || 'Kuyruk hatası');
      setTimeout(() => setQueueError(null), 4000);
    };

    const onDuelStarted = (state: DuelPublicState) => {
      setActiveDuel(state);
      setRoundResultEvent(null);
      setDuelSummary(null);
    };

    const onDuelState = (state: DuelPublicState) => {
      setActiveDuel(state);
    };

    const onDuelRoundResult = (data: DuelRoundResultEvent) => {
      setRoundResultEvent(data);
      if (data.publicState) {
        setActiveDuel(data.publicState);
      }
    };

    const onDuelQuestion = (state: DuelPublicState) => {
      setRoundResultEvent(null);
      setActiveDuel(state);
    };

    const onDuelFinished = (summary: DuelSummary) => {
      setRoundResultEvent(null);
      setActiveDuel(null);
      setDuelSummary(summary);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('state:update', onStateUpdate);
    socket.on('queue:tick', onQueueTick);
    socket.on('queue:error', onQueueError);
    socket.on('duel:started', onDuelStarted);
    socket.on('duel:state', onDuelState);
    socket.on('duel:roundResult', onDuelRoundResult);
    socket.on('duel:question', onDuelQuestion);
    socket.on('duel:finished', onDuelFinished);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('state:update', onStateUpdate);
      socket.off('queue:tick', onQueueTick);
      socket.off('queue:error', onQueueError);
      socket.off('duel:started', onDuelStarted);
      socket.off('duel:state', onDuelState);
      socket.off('duel:roundResult', onDuelRoundResult);
      socket.off('duel:question', onDuelQuestion);
      socket.off('duel:finished', onDuelFinished);
    };
  }, [currentPlayerId]);

  // Kuyruk aksiyonları
  const joinQueue = useCallback(
    (opts: { examType: 'TYT' | 'AYT'; subjects: string[]; mode: 'ranked' | 'tournament'; tournamentId?: string | null }) => {
      setQueueError(null);
      socketRef.current.emit('queue:join', {
        playerId: currentPlayerId,
        examType: opts.examType,
        subjects: opts.subjects,
        mode: opts.mode,
        tournamentId: opts.tournamentId || null,
      });
    },
    [currentPlayerId]
  );

  const leaveQueue = useCallback(() => {
    socketRef.current.emit('queue:leave', { playerId: currentPlayerId });
  }, [currentPlayerId]);

  const fastForwardQueue = useCallback((bonusSeconds: number = 5) => {
    socketRef.current.emit('queue:fastForward', { bonusSeconds });
  }, []);

  // Düello aksiyonları
  const submitDuelAnswer = useCallback(
    (matchId: string, questionIndex: number, answerResult: any, selectedOptionIndex?: number) => {
      socketRef.current.emit('duel:answer', {
        matchId,
        playerId: currentPlayerId,
        questionIndex,
        answerResult,
        selectedOptionIndex,
      });
    },
    [currentPlayerId]
  );

  const readyForNextRound = useCallback(
    (matchId: string) => {
      socketRef.current.emit('duel:roundReady', {
        matchId,
        playerId: currentPlayerId,
      });
    },
    [currentPlayerId]
  );

  const exitDuel = useCallback(() => {
    setActiveDuel(null);
    setRoundResultEvent(null);
    setDuelSummary(null);
  }, []);

  // REST API çağrıları
  const claimWeeklyReward = useCallback(async (playerId: string = currentPlayerId) => {
    try {
      const res = await fetch('/api/economy/claim-weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
      return await res.json();
    } catch (err) {
      console.error('claimWeeklyReward failed', err);
      return { ok: false };
    }
  }, [currentPlayerId]);

  const convertCoins = useCallback(async (coins: number, playerId: string = currentPlayerId) => {
    try {
      const res = await fetch('/api/economy/convert-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, coins }),
      });
      return await res.json();
    } catch (err) {
      console.error('convertCoins failed', err);
      return { ok: false };
    }
  }, [currentPlayerId]);

  const simulate15Matches = useCallback(async (playerId: string = currentPlayerId) => {
    try {
      const res = await fetch('/api/economy/simulate-15-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId }),
      });
      return await res.json();
    } catch (err) {
      console.error('simulate15Matches failed', err);
      return { ok: false };
    }
  }, [currentPlayerId]);

  const joinTournament = useCallback(async (tournamentId: string, playerId: string = currentPlayerId) => {
    try {
      const res = await fetch('/api/tournaments/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, playerId }),
      });
      return await res.json();
    } catch (err) {
      console.error('joinTournament failed', err);
      return { ok: false };
    }
  }, [currentPlayerId]);

  const distributeTournamentRewards = useCallback(async (tournamentId: string) => {
    try {
      const res = await fetch('/api/tournaments/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId }),
      });
      return await res.json();
    } catch (err) {
      console.error('distributeTournamentRewards failed', err);
      return { ok: false };
    }
  }, []);

  const updatePlayerDemo = useCallback(async (opts: { playerId?: string; elo?: number; streak?: number }) => {
    try {
      const res = await fetch('/api/demo/update-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: opts.playerId || currentPlayerId,
          elo: opts.elo,
          streak: opts.streak,
        }),
      });
      return await res.json();
    } catch (err) {
      console.error('updatePlayerDemo failed', err);
      return { ok: false };
    }
  }, [currentPlayerId]);

  const resetDemo = useCallback(async () => {
    try {
      const res = await fetch('/api/demo/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      setActiveDuel(null);
      setRoundResultEvent(null);
      setDuelSummary(null);
      return await res.json();
    } catch (err) {
      console.error('resetDemo failed', err);
      return { ok: false };
    }
  }, []);

  const clearRevisionTopic = useCallback(
    async (topic?: string, playerId: string = currentPlayerId) => {
      try {
        const res = await fetch('/api/revision/clear-topic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, topic }),
        });
        return await res.json();
      } catch (err) {
        console.error('clearRevisionTopic failed', err);
        return { ok: false };
      }
    },
    [currentPlayerId]
  );

  // Aktif oyuncu nesnesi
  const currentPlayer =
    backendState.players.find((p) => p.id === currentPlayerId) ||
    backendState.players[0] ||
    createFallbackPlayers()[0];

  // Aktif oyuncunun kuyrukta olup olmadığı
  const myQueueEntry = backendState.queueSnapshot.find((q) => q.playerId === currentPlayerId) || null;
  const isQueueing = Boolean(myQueueEntry);

  return {
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
    createRandomPlayer,
    completeRevisionPractice,
  };
}
