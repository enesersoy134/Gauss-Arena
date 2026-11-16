import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { BACKEND_GAME_DATA } from '../data/backendMockData';
import { Question, RevisionDetail } from '../types/game';
import { ResourceRecommendation, getRecommendationsForTopic } from '../utils/resourceRecommendations';

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
  educationLevel?: 'lise' | 'ortaokul';
  gradeLevel?: string;
  allowedExamTypes?: ('TYT' | 'AYT' | 'LGS')[];
  dailyQuestExempt?: boolean;
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
  dailyCompleted?: boolean;
  dailyQuestDone?: boolean;
  completedMiniGames?: ('biyoloji' | 'kimya' | 'fizik' | 'matematik' | 'geometri' | 'turkce')[];
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
  examType: 'TYT' | 'AYT' | 'LGS';
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
  examType: 'TYT' | 'AYT' | 'LGS' | string;
  subjects: string[];
  mode: 'ranked' | 'tournament';
  tournamentId: string | null;
  difficultyMode?: 'adaptive' | 'easy' | 'medium' | 'hard' | string;
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
  const nowIso = new Date().toISOString();

  return [
    {
      id: 'p1',
      name: 'Ahmet Yılmaz (Standart)',
      roleTag: 'Dengeli Oyuncu (12. Sınıf YKS)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmet&backgroundColor=f14e13',
      elo: 1250,
      streak: 0,
      effectiveMmr: 1250,
      educationLevel: 'lise',
      gradeLevel: '12. Sınıf (YKS)',
      allowedExamTypes: ['TYT', 'AYT'],
      dailyQuestExempt: false,
      bracket: { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
      coins: 320,
      islerPoints: 45,
      weeklyMatchesPlayed: 14,
      weeklyRewardClaimed: false,
      dailyCompleted: true,
      dailyQuestDone: true,
      completedMiniGames: ['fizik', 'kimya', 'biyoloji', 'matematik', 'geometri', 'turkce'],
      coupons: [],
      revisionDetails: [
        {
          topic: 'Türev ve Teğet Eğimi',
          subject: 'matematik',
          examType: 'AYT',
          wrongCount: 3,
          totalAttempts: 4,
          errorRatePercent: 75,
          failedQuestionIds: ['q_uc_test_001', 'q_pm_007'],
        },
        {
          topic: 'Dalgalar ve Ses',
          subject: 'fizik',
          examType: 'TYT',
          wrongCount: 2,
          totalAttempts: 4,
          errorRatePercent: 50,
          failedQuestionIds: ['q_uc_tf_002'],
        },
      ],
      revisionTopics: [
        {
          topic: 'Türev ve Teğet Eğimi',
          subject: 'matematik',
          examType: 'AYT',
          mistakeCount: 3,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'q_uc_test_001', text: 'Türev ve Teğet Eğimi Sorusu', explanation: '', difficulty: 'orta', failedCount: 2, failedAt: nowIso },
            { externalId: 'q_pm_007', text: 'Türev Eşleştirme Sorusu', explanation: '', difficulty: 'zor', failedCount: 1, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('matematik', 'Türev ve Teğet Eğimi', 'AYT'),
        },
        {
          topic: 'Dalgalar ve Ses',
          subject: 'fizik',
          examType: 'TYT',
          mistakeCount: 2,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'q_uc_tf_002', text: 'Dalgalar ve Ses Sorusu', explanation: '', difficulty: 'orta', failedCount: 2, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('fizik', 'Dalgalar ve Ses', 'TYT'),
        },
      ],
    },
    {
      id: 'p2',
      name: 'Zeynep Kaya (Smurf / +5 Seri)',
      roleTag: 'Yüksek Momentum (1200 ELO, S=+5)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zeynep&backgroundColor=b6e3f4',
      elo: 1200,
      streak: 5,
      effectiveMmr: 1324,
      educationLevel: 'lise',
      gradeLevel: '12. Sınıf (YKS)',
      allowedExamTypes: ['TYT', 'AYT'],
      dailyQuestExempt: false,
      bracket: { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
      coins: 450,
      islerPoints: 60,
      weeklyMatchesPlayed: 8,
      weeklyRewardClaimed: false,
      dailyCompleted: true,
      dailyQuestDone: true,
      completedMiniGames: ['fizik', 'kimya', 'biyoloji', 'matematik', 'geometri', 'turkce'],
      coupons: [],
      revisionDetails: [
        {
          topic: 'Kimyasal Tepkimeler ve Denge',
          subject: 'kimya',
          examType: 'TYT',
          wrongCount: 3,
          totalAttempts: 5,
          errorRatePercent: 60,
          failedQuestionIds: ['AYT-KIM-E-001', 'AYT-KIM-E-002'],
        },
        {
          topic: 'Üslü ve Köklü Sayılar',
          subject: 'matematik',
          examType: 'TYT',
          wrongCount: 2,
          totalAttempts: 4,
          errorRatePercent: 50,
          failedQuestionIds: ['q_uc_comp_003'],
        },
      ],
      revisionTopics: [
        {
          topic: 'Kimyasal Tepkimeler ve Denge',
          subject: 'kimya',
          examType: 'TYT',
          mistakeCount: 3,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'AYT-KIM-E-001', text: 'Kimyasal Denge Sorusu', explanation: '', difficulty: 'orta', failedCount: 2, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('kimya', 'Kimyasal Tepkimeler ve Denge', 'TYT'),
        },
        {
          topic: 'Üslü ve Köklü Sayılar',
          subject: 'matematik',
          examType: 'TYT',
          mistakeCount: 2,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'q_uc_comp_003', text: 'Üslü ve Köklü Sayılar Sorusu', explanation: '', difficulty: 'orta', failedCount: 2, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('matematik', 'Üslü ve Köklü Sayılar', 'TYT'),
        },
      ],
    },
    {
      id: 'p3',
      name: 'Mehmet Demir (8. Sınıf LGS)',
      roleTag: 'Ortaokul Kademesi (8. Sınıf LGS)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mehmet&backgroundColor=c0aede',
      elo: 1340,
      streak: 1,
      effectiveMmr: 1340,
      educationLevel: 'ortaokul',
      gradeLevel: '8. Sınıf (LGS)',
      allowedExamTypes: ['LGS'],
      dailyQuestExempt: true,
      bracket: { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
      coins: 580,
      islerPoints: 80,
      weeklyMatchesPlayed: 15,
      weeklyRewardClaimed: false,
      dailyCompleted: false,
      dailyQuestDone: false,
      completedMiniGames: [],
      coupons: [],
      revisionDetails: [
        {
          topic: 'Basınç (Katı ve Sıvı Basıncı)',
          subject: 'fen',
          examType: 'LGS',
          wrongCount: 3,
          totalAttempts: 4,
          errorRatePercent: 75,
          failedQuestionIds: ['LGS-FEN-E-001'],
        },
        {
          topic: 'Paragrafta Anlatım Biçimleri',
          subject: 'turkce',
          examType: 'LGS',
          wrongCount: 2,
          totalAttempts: 5,
          errorRatePercent: 40,
          failedQuestionIds: ['q_mb_025'],
        },
      ],
      revisionTopics: [
        {
          topic: 'Basınç (Katı ve Sıvı Basıncı)',
          subject: 'fen',
          examType: 'LGS',
          mistakeCount: 3,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'LGS-FEN-E-001', text: 'Katı ve Sıvı Basıncı Sorusu', explanation: '', difficulty: 'orta', failedCount: 3, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('fen', 'Basınç', 'LGS'),
        },
        {
          topic: 'Paragrafta Anlatım Biçimleri',
          subject: 'turkce',
          examType: 'LGS',
          mistakeCount: 2,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'q_mb_025', text: 'Paragrafta Anlatım Sorusu', explanation: '', difficulty: 'orta', failedCount: 2, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('turkce', 'Paragrafta Anlatım Biçimleri', 'LGS'),
        },
      ],
    },
    {
      id: 'p4',
      name: 'Ayşe Çelik (8. Sınıf LGS)',
      roleTag: 'Ortaokul Kademesi (8. Sınıf LGS)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayse&backgroundColor=ffd5dc',
      elo: 1620,
      streak: 3,
      effectiveMmr: 1634,
      educationLevel: 'ortaokul',
      gradeLevel: '8. Sınıf (LGS)',
      allowedExamTypes: ['LGS'],
      dailyQuestExempt: true,
      bracket: { tierName: 'Platin Lig', minElo: 1600, maxElo: 1799.9, weeklyCoins: 850, badgeColor: '#06b6d4' },
      coins: 940,
      islerPoints: 130,
      weeklyMatchesPlayed: 18,
      weeklyRewardClaimed: false,
      dailyCompleted: false,
      dailyQuestDone: false,
      completedMiniGames: [],
      coupons: [],
      revisionDetails: [
        {
          topic: 'Çarpanlar ve Katlar',
          subject: 'matematik',
          examType: 'LGS',
          wrongCount: 2,
          totalAttempts: 4,
          errorRatePercent: 50,
          failedQuestionIds: ['LGS-MAT-E-001'],
        },
        {
          topic: 'Mevsimlerin Oluşumu',
          subject: 'fen',
          examType: 'LGS',
          wrongCount: 2,
          totalAttempts: 5,
          errorRatePercent: 40,
          failedQuestionIds: ['LGS-FEN-E-002'],
        },
      ],
      revisionTopics: [
        {
          topic: 'Çarpanlar ve Katlar',
          subject: 'matematik',
          examType: 'LGS',
          mistakeCount: 2,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'LGS-MAT-E-001', text: 'Çarpanlar ve Katlar Sorusu', explanation: '', difficulty: 'orta', failedCount: 2, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('matematik', 'Çarpanlar ve Katlar', 'LGS'),
        },
        {
          topic: 'Mevsimlerin Oluşumu',
          subject: 'fen',
          examType: 'LGS',
          mistakeCount: 2,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'LGS-FEN-E-002', text: 'Mevsimlerin Oluşumu Sorusu', explanation: '', difficulty: 'orta', failedCount: 2, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('fen', 'Mevsimlerin Oluşumu', 'LGS'),
        },
      ],
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
      dailyCompleted: false,
      dailyQuestDone: false,
      completedMiniGames: [],
      coupons: [],
      revisionDetails: [
        {
          topic: 'Hücre Organelleri',
          subject: 'biyoloji',
          examType: 'TYT',
          wrongCount: 3,
          totalAttempts: 4,
          errorRatePercent: 75,
          failedQuestionIds: ['q_hs_018'],
        },
      ],
      revisionTopics: [
        {
          topic: 'Hücre Organelleri',
          subject: 'biyoloji',
          examType: 'TYT',
          mistakeCount: 3,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'q_hs_018', text: 'Hücre Organelleri Sorusu', explanation: '', difficulty: 'orta', failedCount: 3, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('biyoloji', 'Hücre Organelleri', 'TYT'),
        },
      ],
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
      dailyCompleted: false,
      dailyQuestDone: false,
      completedMiniGames: [],
      coupons: [],
      revisionDetails: [
        {
          topic: 'Trigonometri',
          subject: 'matematik',
          examType: 'AYT',
          wrongCount: 4,
          totalAttempts: 5,
          errorRatePercent: 80,
          failedQuestionIds: ['q_uc_comp_003'],
        },
      ],
      revisionTopics: [
        {
          topic: 'Trigonometri',
          subject: 'matematik',
          examType: 'AYT',
          mistakeCount: 4,
          lastMistakeAt: nowIso,
          wrongQuestions: [
            { externalId: 'q_uc_comp_003', text: 'Trigonometri Sorusu', explanation: '', difficulty: 'orta', failedCount: 4, failedAt: nowIso },
          ],
          recommendedResources: getRecommendationsForTopic('matematik', 'Trigonometri', 'AYT'),
        },
      ],
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
    const pathMatch = window.location.pathname.match(/^\/?(p\d+)(?:\/|$)/i);
    if (pathMatch) return pathMatch[1].toLowerCase();
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
          prizePoolDesc: '1.ye 1000 Coin + 100 Arena Puanı | 2.ye 600 Coin + 60 Arena Puanı | 3.ye 350 Coin + 35 Arena Puanı',
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
          prizePoolDesc: '1.ye 1500 Coin + 150 Arena Puanı | 2.ye 900 Coin + 90 Arena Puanı | 3.ye 500 Coin + 50 Arena Puanı',
          rewardsDistributed: false,
          participants: [
            { playerId: 'p1', name: 'Ahmet Yılmaz (Standart)', points: 90, wins: 3, losses: 0, elo: 1250 },
          ],
        },
        {
          id: 'tour-lgs-1',
          title: 'Haftalık LGS 8. Sınıf Şampiyonası',
          examType: 'LGS',
          allowedSubjects: ['turkce', 'matematik', 'sosyal', 'fen'],
          status: 'ACTIVE',
          prizePoolDesc: '1.ye 1200 Coin + 120 Arena Puanı | 2.ye 700 Coin + 70 Arena Puanı | 3.ye 400 Coin + 40 Arena Puanı',
          rewardsDistributed: false,
          participants: [
            { playerId: 'p4', name: 'Ayşe Çelik (8. Sınıf LGS)', points: 90, wins: 3, losses: 0, elo: 1620 },
            { playerId: 'p3', name: 'Mehmet Demir (8. Sınıf LGS)', points: 60, wins: 2, losses: 1, elo: 1340 },
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
    // 1. Optimistik yerel state güncellemesi (+30 Coin ve çözülen eksik konuların temizlenmesi)
    const solvedNorm = (solvedTopics || []).map((t) => t.toLowerCase().trim());
    setBackendState((prev) => {
      const updatedPlayers = prev.players.map((p) => {
        if (p.id !== playerId) return p;
        const newCoins = (p.coins || 0) + 30;
        const newDetails = (p.revisionDetails || []).filter(
          (d) => !solvedNorm.includes(d.topic.toLowerCase().trim())
        );
        const newTopics = (p.revisionTopics || []).filter(
          (t) => !solvedNorm.includes(t.topic.toLowerCase().trim())
        );
        return {
          ...p,
          coins: newCoins,
          revisionDetails: newDetails,
          revisionTopics: newTopics,
        };
      });
      return { ...prev, players: updatedPlayers };
    });

    try {
      const res = await fetch('/api/players/complete-revision-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, solvedTopics }),
      });
      return await res.json();
    } catch (err) {
      console.warn('completeRevisionPractice backend fetch failed, kept optimistic update:', err);
      return { ok: true, offline: true };
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
    (opts: {
      examType: 'TYT' | 'AYT' | 'LGS' | string;
      subjects: string[];
      mode: 'ranked' | 'tournament';
      tournamentId?: string | null;
      difficultyMode?: 'adaptive' | 'easy' | 'medium' | 'hard' | string;
    }) => {
      setQueueError(null);
      socketRef.current.emit('queue:join', {
        playerId: currentPlayerId,
        examType: opts.examType,
        subjects: opts.subjects,
        mode: opts.mode,
        tournamentId: opts.tournamentId || null,
        difficultyMode: opts.difficultyMode || 'adaptive',
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
      if (topic) {
        const normTopic = topic.toLowerCase().trim();
        setBackendState((prev) => {
          const updatedPlayers = prev.players.map((p) => {
            if (p.id !== playerId) return p;
            return {
              ...p,
              revisionDetails: (p.revisionDetails || []).filter(
                (d) => d.topic.toLowerCase().trim() !== normTopic
              ),
              revisionTopics: (p.revisionTopics || []).filter(
                (t) => t.topic.toLowerCase().trim() !== normTopic
              ),
            };
          });
          return { ...prev, players: updatedPlayers };
        });
      }

      try {
        const res = await fetch('/api/revision/clear-topic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, topic }),
        });
        return await res.json();
      } catch (err) {
        console.warn('clearRevisionTopic fetch failed, kept optimistic state:', err);
        return { ok: true, offline: true };
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
