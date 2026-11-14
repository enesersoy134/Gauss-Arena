const { calculateEffectiveMMR } = require('./eloMomentum');
const { getRecommendationsForTopic } = require('./resourceRecommendations');

const WEEKLY_MATCHES_THRESHOLD = 15;

const WEEKLY_BRACKETS = [
  { tierName: 'Bronz Lig', minElo: 0, maxElo: 1199.9, weeklyCoins: 100, badgeColor: '#cd7f32' },
  { tierName: 'Gümüş Lig', minElo: 1200, maxElo: 1399.9, weeklyCoins: 250, badgeColor: '#94a3b8' },
  { tierName: 'Altın Lig', minElo: 1400, maxElo: 1599.9, weeklyCoins: 500, badgeColor: '#eab308' },
  { tierName: 'Platin Lig', minElo: 1600, maxElo: 1799.9, weeklyCoins: 850, badgeColor: '#06b6d4' },
  { tierName: 'Elmas Lig', minElo: 1800, maxElo: Infinity, weeklyCoins: 1250, badgeColor: '#a855f7' },
];

function getWeeklyBracket(elo) {
  const r = Number(elo) || 1200;
  for (const b of WEEKLY_BRACKETS) {
    if (r >= b.minElo && r <= b.maxElo) {
      return b;
    }
  }
  return WEEKLY_BRACKETS[1];
}

function createInitialPlayers() {
  const raw = [
    {
      id: 'p1',
      name: 'Ahmet Yılmaz (Standart)',
      roleTag: 'Dengeli Oyuncu (12. Sınıf YKS)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmet&backgroundColor=f14e13',
      elo: 1250,
      streak: 0,
      educationLevel: 'lise',
      gradeLevel: '12. Sınıf (YKS)',
      allowedExamTypes: ['TYT', 'AYT'],
      dailyQuestExempt: false,
      coins: 320,
      islerPoints: 45,
      weeklyMatchesPlayed: 14,
      weeklyRewardClaimed: false,
      dailyCompleted: true,
      dailyQuestDone: true,
      completedMiniGames: ['fizik', 'kimya', 'biyoloji', 'matematik', 'geometri', 'turkce'],
      coupons: [],
    },
    {
      id: 'p2',
      name: 'Zeynep Kaya (Smurf / +5 Seri)',
      roleTag: 'Yüksek Momentum (1200 ELO, S=+5)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zeynep&backgroundColor=b6e3f4',
      elo: 1200,
      streak: 5,
      educationLevel: 'lise',
      gradeLevel: '12. Sınıf (YKS)',
      allowedExamTypes: ['TYT', 'AYT'],
      dailyQuestExempt: false,
      coins: 450,
      islerPoints: 60,
      weeklyMatchesPlayed: 8,
      weeklyRewardClaimed: false,
      dailyCompleted: true,
      dailyQuestDone: true,
      completedMiniGames: ['fizik', 'kimya', 'biyoloji', 'matematik', 'geometri', 'turkce'],
      coupons: [],
    },
    {
      id: 'p3',
      name: 'Mehmet Demir (8. Sınıf LGS)',
      roleTag: 'Ortaokul Kademesi (8. Sınıf LGS)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mehmet&backgroundColor=c0aede',
      elo: 1340,
      streak: 1,
      educationLevel: 'ortaokul',
      gradeLevel: '8. Sınıf (LGS)',
      allowedExamTypes: ['LGS'],
      dailyQuestExempt: true,
      coins: 580,
      islerPoints: 80,
      weeklyMatchesPlayed: 15,
      weeklyRewardClaimed: false,
      dailyCompleted: false,
      dailyQuestDone: false,
      completedMiniGames: [],
      coupons: [],
    },
    {
      id: 'p4',
      name: 'Ayşe Çelik (8. Sınıf LGS)',
      roleTag: 'Ortaokul Kademesi (8. Sınıf LGS)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ayse&backgroundColor=ffd5dc',
      elo: 1620,
      streak: 3,
      educationLevel: 'ortaokul',
      gradeLevel: '8. Sınıf (LGS)',
      allowedExamTypes: ['LGS'],
      dailyQuestExempt: true,
      coins: 940,
      islerPoints: 130,
      weeklyMatchesPlayed: 18,
      weeklyRewardClaimed: false,
      dailyCompleted: false,
      dailyQuestDone: false,
      completedMiniGames: [],
      coupons: [],
    },
    {
      id: 'p5',
      name: 'Can Özkan (Win-Trade / Cooldown)',
      roleTag: 'Dengeli Rakip (1240 ELO, S=-1)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Can&backgroundColor=d1d4f9',
      elo: 1240,
      streak: -1,
      coins: 210,
      islerPoints: 20,
      weeklyMatchesPlayed: 12,
      weeklyRewardClaimed: false,
      dailyCompleted: false,
      dailyQuestDone: false,
      completedMiniGames: [],
      coupons: [],
    },
    {
      id: 'p6',
      name: 'Selin Arslan (Düşüş Serisi)',
      roleTag: 'Soğuk Seri (1310 ELO, S=-4)',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Selin&backgroundColor=ffdfbf',
      elo: 1310,
      streak: -4,
      coins: 190,
      islerPoints: 25,
      weeklyMatchesPlayed: 6,
      weeklyRewardClaimed: false,
      dailyCompleted: false,
      dailyQuestDone: false,
      completedMiniGames: [],
      coupons: [],
    },
  ];

  return raw.map((p) => ({
    ...p,
    revisionTopics: [],
    revisionDetails: [],
    effectiveMmr: calculateEffectiveMMR(p.elo, p.streak),
    bracket: getWeeklyBracket(p.elo),
  }));
}

function createInitialTournaments() {
  return [
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
        { playerId: 'p5', name: 'Can Özkan (Win-Trade / Cooldown)', points: 10, wins: 0, losses: 2, elo: 1240 },
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
        { playerId: 'p1', name: 'Ahmet Yılmaz (Standart)', points: 90, wins: 3, losses: 0, elo: 1250 },
        { playerId: 'p6', name: 'Selin Arslan (Düşüş Serisi)', points: 30, wins: 1, losses: 2, elo: 1310 },
      ],
    },
    {
      id: 'tour-lgs-1',
      title: 'Haftalık LGS 8. Sınıf Şampiyonası',
      examType: 'LGS',
      allowedSubjects: ['turkce', 'matematik', 'sosyal', 'fen'],
      status: 'ACTIVE',
      prizePoolDesc: '1.ye 1200 Coin + 120 İşler Puanı | 2.ye 700 Coin + 70 İşler Puanı | 3.ye 400 Coin + 40 İşler Puanı',
      rewardsDistributed: false,
      participants: [
        { playerId: 'p4', name: 'Ayşe Çelik (8. Sınıf LGS)', points: 90, wins: 3, losses: 0, elo: 1620 },
        { playerId: 'p3', name: 'Mehmet Demir (8. Sınıf LGS)', points: 60, wins: 2, losses: 1, elo: 1340 },
      ],
    },
  ];
}

class GameStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.players = new Map();
    for (const p of createInitialPlayers()) {
      this.players.set(p.id, p);
    }
    this.tournaments = new Map();
    for (const t of createInitialTournaments()) {
      this.tournaments.set(t.id, t);
    }
    this.matchHistory = [];
  }

  refreshPlayerComputed(player) {
    if (!player) return null;
    player.elo = Math.round(Number(player.elo) || 1200);
    player.effectiveMmr = calculateEffectiveMMR(player.elo, player.streak);
    player.bracket = getWeeklyBracket(player.elo);
    return player;
  }

  getPlayers() {
    return Array.from(this.players.values()).map((p) => this.refreshPlayerComputed(p));
  }

  getPlayer(playerId) {
    const p = this.players.get(String(playerId));
    return this.refreshPlayerComputed(p);
  }

  simulateCompleteWeeklyMatches(playerId, targetMatches = WEEKLY_MATCHES_THRESHOLD) {
    const p = this.getPlayer(playerId);
    if (!p) return null;
    p.weeklyMatchesPlayed = Math.max(p.weeklyMatchesPlayed, Number(targetMatches) || WEEKLY_MATCHES_THRESHOLD);
    return p;
  }

  claimWeeklyReward(playerId) {
    const p = this.getPlayer(playerId);
    if (!p) {
      return { ok: false, reason: 'Oyuncu bulunamadı' };
    }
    if (p.weeklyMatchesPlayed < WEEKLY_MATCHES_THRESHOLD) {
      return {
        ok: false,
        reason: `Haftalık ELO Coin ödülü için bu hafta en az ${WEEKLY_MATCHES_THRESHOLD} maç tamamlamalısınız (Mevcut: ${p.weeklyMatchesPlayed}/${WEEKLY_MATCHES_THRESHOLD}).`,
      };
    }
    if (p.weeklyRewardClaimed) {
      return {
        ok: false,
        reason: 'Bu haftanın ELO dilimi Coin ödülü zaten talep edildi.',
      };
    }

    const bracket = getWeeklyBracket(p.elo);
    p.coins += bracket.weeklyCoins;
    p.weeklyRewardClaimed = true;

    return {
      ok: true,
      tierName: bracket.tierName,
      coinsAwarded: bracket.weeklyCoins,
      newCoinBalance: p.coins,
    };
  }

  convertCoinsToIslerPoints(playerId, coinsToSpend) {
    const p = this.getPlayer(playerId);
    if (!p) {
      return { ok: false, reason: 'Oyuncu bulunamadı' };
    }
    const coins = Math.floor(Number(coinsToSpend) || 0);
    if (coins < 5000 || coins % 500 !== 0) {
      return { ok: false, reason: 'En az 5000 ve 500\'ün katı Coin dönüştürülebilir (5000 Coin = 10 İşler Sadakat Puanı).' };
    }
    if (p.coins < coins) {
      return { ok: false, reason: `Yetersiz Coin bakiyesi (Mevcut: ${p.coins} Coin).` };
    }

    const islerPointsAdded = Math.floor(coins / 500);
    p.coins -= coins;
    p.islerPoints += islerPointsAdded;

    const randSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const couponCode = `ISLER-${islerPointsAdded}TL-${randSuffix}`;
    p.coupons.unshift({
      code: couponCode,
      description: 'İşler Kitabevi İndirim Kuponu',
      discountPercent: islerPointsAdded,
      pointsSpent: islerPointsAdded,
      islerPointsUsed: islerPointsAdded,
      discountTl: islerPointsAdded,
      createdAt: new Date().toISOString(),
    });

    return {
      ok: true,
      coinsSpent: coins,
      islerPointsAdded,
      islerPointsAwarded: islerPointsAdded,
      couponCode,
      newCoinBalance: p.coins,
      newIslerPoints: p.islerPoints,
    };
  }

  getTournaments() {
    const list = Array.from(this.tournaments.values());
    for (const t of list) {
      t.participants.sort((a, b) => b.points - a.points || b.wins - a.wins || b.elo - a.elo);
    }
    return list;
  }

  joinTournament(tournamentId, playerId) {
    const t = this.tournaments.get(String(tournamentId));
    const p = this.getPlayer(playerId);
    if (!t || !p) return null;

    const existing = t.participants.find((item) => item.playerId === p.id);
    if (!existing) {
      t.participants.push({
        playerId: p.id,
        name: p.name,
        points: 0,
        wins: 0,
        losses: 0,
        elo: p.elo,
      });
    }
    t.participants.sort((a, b) => b.points - a.points || b.wins - a.wins);
    return t;
  }

  distributeTournamentRewards(tournamentId) {
    const t = this.tournaments.get(String(tournamentId));
    if (!t) return { ok: false, reason: 'Turnuva bulunamadı' };

    t.participants.sort((a, b) => b.points - a.points || b.wins - a.wins || b.elo - a.elo);
    const prizeTable =
      t.examType === 'AYT'
        ? [
            { rank: 1, coins: 1500, islerPoints: 150 },
            { rank: 2, coins: 900, islerPoints: 90 },
            { rank: 3, coins: 500, islerPoints: 50 },
          ]
        : [
            { rank: 1, coins: 1000, islerPoints: 100 },
            { rank: 2, coins: 600, islerPoints: 60 },
            { rank: 3, coins: 350, islerPoints: 35 },
          ];

    const payouts = [];
    t.participants.slice(0, 3).forEach((entry, index) => {
      const prize = prizeTable[index];
      const player = this.getPlayer(entry.playerId);
      if (player && prize) {
        player.coins += prize.coins;
        player.islerPoints += prize.islerPoints;
        payouts.push({
          rank: prize.rank,
          playerId: player.id,
          name: player.name,
          points: entry.points,
          coinsAwarded: prize.coins,
          islerPointsAwarded: prize.islerPoints,
        });
      }
    });

    t.rewardsDistributed = true;
    return {
      ok: true,
      tournamentId: t.id,
      title: t.title,
      payouts,
    };
  }

  recordPlayerMistakes(player, roundHistory = [], isPlayerA = true, examType = 'TYT', completedAt = null) {
    if (!player || !Array.isArray(roundHistory)) return;
    player.revisionTopics = Array.isArray(player.revisionTopics) ? player.revisionTopics : [];
    const timestamp = completedAt || new Date().toISOString();

    for (const round of roundHistory) {
      const ans = isPlayerA ? round.answerA : round.answerB;
      if (!ans || ans.isCorrect) continue;

      const subject = String(round.subject || (round.interactiveQuestion && round.interactiveQuestion.subject) || 'genel').toLowerCase();
      const topic = String(
        round.subTopic ||
          (round.interactiveQuestion && round.interactiveQuestion.topic) ||
          subject
      ).trim();
      const questionText =
        round.text ||
        (round.interactiveQuestion && round.interactiveQuestion.prompt) ||
        round.externalId ||
        'Soru';
      const explanation =
        round.explanation ||
        (round.interactiveQuestion && round.interactiveQuestion.explanation) ||
        null;

      let topicEntry = player.revisionTopics.find(
        (item) => item.topic.toLowerCase() === topic.toLowerCase() && item.subject === subject
      );

      if (!topicEntry) {
        topicEntry = {
          topic,
          subject,
          examType: examType || 'TYT',
          mistakeCount: 0,
          lastMistakeAt: timestamp,
          wrongQuestions: [],
          recommendedResources: getRecommendationsForTopic(subject, topic, examType || 'TYT'),
        };
        player.revisionTopics.push(topicEntry);
      } else if (!Array.isArray(topicEntry.recommendedResources) || topicEntry.recommendedResources.length === 0) {
        topicEntry.recommendedResources = getRecommendationsForTopic(subject, topic, examType || 'TYT');
      }

      topicEntry.mistakeCount += 1;
      topicEntry.lastMistakeAt = timestamp;

      const existingQ = topicEntry.wrongQuestions.find((wq) => wq.externalId === round.externalId);
      if (existingQ) {
        existingQ.failedCount = (existingQ.failedCount || 1) + 1;
        existingQ.failedAt = timestamp;
      } else {
        topicEntry.wrongQuestions.unshift({
          externalId: round.externalId,
          text: questionText,
          explanation,
          difficulty: round.difficulty || 'MEDIUM',
          failedCount: 1,
          failedAt: timestamp,
        });
      }

      // revisionDetails güncellemesi (Yüzdesel eksik istatistiği)
      player.revisionDetails = Array.isArray(player.revisionDetails) ? player.revisionDetails : [];
      let det = player.revisionDetails.find(
        (d) => d.topic.toLowerCase() === topic.toLowerCase() && d.subject === subject
      );
      if (!det) {
        det = {
          topic,
          subject,
          wrongCount: 0,
          totalAttempts: 0,
          errorRatePercent: 0,
          failedQuestionIds: [],
        };
        player.revisionDetails.push(det);
      }
      det.wrongCount += 1;
      det.totalAttempts += 1;
      det.errorRatePercent = Math.round((det.wrongCount / Math.max(1, det.totalAttempts)) * 100);
      const qId = round.externalId || (round.interactiveQuestion && round.interactiveQuestion.id);
      if (qId && !det.failedQuestionIds.includes(qId)) {
        det.failedQuestionIds.push(qId);
      }
    }

    player.revisionTopics.sort((a, b) => b.mistakeCount - a.mistakeCount);
    if (Array.isArray(player.revisionDetails)) {
      player.revisionDetails.sort((a, b) => b.errorRatePercent - a.errorRatePercent);
    }
  }

  markTopicReviewed(playerId, topic) {
    const p = this.getPlayer(playerId);
    if (!p) return { ok: false, reason: 'Oyuncu bulunamadı' };
    p.revisionTopics = Array.isArray(p.revisionTopics) ? p.revisionTopics : [];
    p.revisionDetails = Array.isArray(p.revisionDetails) ? p.revisionDetails : [];
    if (!topic) {
      p.revisionTopics = [];
      p.revisionDetails = [];
      return { ok: true, revisionTopics: p.revisionTopics, revisionDetails: p.revisionDetails };
    }
    const normTopic = String(topic).trim().toLowerCase();
    p.revisionTopics = p.revisionTopics.filter((item) => item.topic.toLowerCase() !== normTopic);
    p.revisionDetails = p.revisionDetails.filter((item) => item.topic.toLowerCase() !== normTopic);
    return { ok: true, revisionTopics: p.revisionTopics, revisionDetails: p.revisionDetails };
  }

  completeRevisionPractice(playerId, solvedTopics = []) {
    const p = this.getPlayer(playerId);
    if (!p) return { ok: false, reason: 'Oyuncu bulunamadı' };
    p.revisionTopics = Array.isArray(p.revisionTopics) ? p.revisionTopics : [];
    p.revisionDetails = Array.isArray(p.revisionDetails) ? p.revisionDetails : [];

    const solvedNorm = Array.isArray(solvedTopics)
      ? solvedTopics.map((t) => String(t).trim().toLowerCase())
      : [];

    if (solvedNorm.length === 0) {
      p.revisionTopics = [];
      p.revisionDetails = [];
    } else {
      p.revisionTopics = p.revisionTopics.filter((item) => !solvedNorm.includes(item.topic.toLowerCase()));
      p.revisionDetails = p.revisionDetails.filter((item) => !solvedNorm.includes(item.topic.toLowerCase()));
    }

    p.coins = (p.coins || 0) + 30; // +30 Coin ödülü
    return {
      ok: true,
      coinsAwarded: 30,
      newCoins: p.coins,
      revisionTopics: p.revisionTopics,
      revisionDetails: p.revisionDetails,
    };
  }

  initDefaultRevisions() {
    const defaultData = {
      p1: {
        topics: [
          { topic: 'Türev ve Teğet Eğimi', subject: 'matematik', examType: 'AYT', mistakeCount: 3, failedIds: ['q_uc_test_001', 'q_pm_007'], attempts: 4 },
          { topic: 'Dalgalar ve Ses', subject: 'fizik', examType: 'TYT', mistakeCount: 2, failedIds: ['q_uc_tf_002'], attempts: 4 },
        ],
      },
      p2: {
        topics: [
          { topic: 'Kimyasal Tepkimeler ve Denge', subject: 'kimya', examType: 'TYT', mistakeCount: 3, failedIds: ['q_sb_018', 'q_tc_016'], attempts: 5 },
          { topic: 'Üslü ve Köklü Sayılar', subject: 'matematik', examType: 'TYT', mistakeCount: 2, failedIds: ['q_uc_comp_003', 'q_nc_021'], attempts: 4 },
        ],
      },
      p3: {
        topics: [
          { topic: 'Basınç (Katı ve Sıvı Basıncı)', subject: 'fen', examType: 'LGS', mistakeCount: 3, failedIds: ['LGS-FEN-E-001'], attempts: 4 },
          { topic: 'Paragrafta Anlatım Biçimleri', subject: 'turkce', examType: 'LGS', mistakeCount: 2, failedIds: ['q_mb_025'], attempts: 5 },
        ],
      },
      p4: {
        topics: [
          { topic: 'Çarpanlar ve Katlar', subject: 'matematik', examType: 'LGS', mistakeCount: 2, failedIds: ['LGS-MAT-E-001'], attempts: 4 },
          { topic: 'Mevsimlerin Oluşumu', subject: 'fen', examType: 'LGS', mistakeCount: 2, failedIds: ['LGS-FEN-E-002'], attempts: 5 },
        ],
      },
      p5: {
        topics: [
          { topic: 'Hücre Organelleri', subject: 'biyoloji', examType: 'TYT', mistakeCount: 3, failedIds: ['q_hs_018', 'q_of_004'], attempts: 4 },
        ],
      },
      p6: {
        topics: [
          { topic: 'Trigonometri', subject: 'matematik', examType: 'AYT', mistakeCount: 4, failedIds: ['q_uc_comp_003', 'q_nc_021'], attempts: 5 },
        ],
      },
    };

    const nowIso = new Date().toISOString();
    for (const [pId, conf] of Object.entries(defaultData)) {
      const p = this.getPlayer(pId);
      if (!p) continue;
      p.revisionTopics = conf.topics.map((t) => ({
        topic: t.topic,
        subject: t.subject,
        examType: t.examType,
        mistakeCount: t.mistakeCount,
        lastMistakeAt: nowIso,
        wrongQuestions: t.failedIds.map((id) => ({
          externalId: id,
          text: `${t.topic} Sorusu`,
          explanation: '',
          difficulty: 'MEDIUM',
          failedCount: 1,
          failedAt: nowIso,
        })),
        recommendedResources: getRecommendationsForTopic(t.subject, t.topic, t.examType),
      }));
      p.revisionDetails = conf.topics.map((t) => ({
        topic: t.topic,
        subject: t.subject,
        wrongCount: t.mistakeCount,
        totalAttempts: t.attempts,
        errorRatePercent: Math.round((t.mistakeCount / t.attempts) * 100),
        failedQuestionIds: t.failedIds,
      }));
    }
  }

  recordMatchOutcome(summary) {
    const pA = this.getPlayer(summary.playerA.id);
    const pB = !summary.playerB.isGhost ? this.getPlayer(summary.playerB.id) : null;

    if (pA) {
      pA.elo = summary.eloUpdate.newEloA;
      pA.streak = summary.eloUpdate.newStreakA;
      pA.weeklyMatchesPlayed += 1;
      pA.coins += summary.coinsAwardedA || 0;
      this.recordPlayerMistakes(pA, summary.roundHistory, true, summary.examType, summary.completedAt);
      this.refreshPlayerComputed(pA);
    }

    if (pB) {
      pB.elo = summary.eloUpdate.newEloB;
      pB.streak = summary.eloUpdate.newStreakB;
      pB.weeklyMatchesPlayed += 1;
      pB.coins += summary.coinsAwardedB || 0;
      this.recordPlayerMistakes(pB, summary.roundHistory, false, summary.examType, summary.completedAt);
      this.refreshPlayerComputed(pB);
    }

    if (summary.mode === 'tournament' && summary.tournamentId) {
      const t = this.tournaments.get(summary.tournamentId);
      if (t) {
        this.joinTournament(t.id, summary.playerA.id);
        if (!summary.playerB.isGhost) {
          this.joinTournament(t.id, summary.playerB.id);
        }
        const entryA = t.participants.find((x) => x.playerId === summary.playerA.id);
        const entryB = !summary.playerB.isGhost
          ? t.participants.find((x) => x.playerId === summary.playerB.id)
          : null;

        if (entryA) {
          entryA.elo = pA ? pA.elo : entryA.elo;
          if (summary.winnerId === summary.playerA.id) {
            entryA.points += 30;
            entryA.wins += 1;
          } else if (summary.winnerId === null) {
            entryA.points += 15;
          } else {
            entryA.points += 5;
            entryA.losses += 1;
          }
        }
        if (entryB) {
          entryB.elo = pB ? pB.elo : entryB.elo;
          if (summary.winnerId === summary.playerB.id) {
            entryB.points += 30;
            entryB.wins += 1;
          } else if (summary.winnerId === null) {
            entryB.points += 15;
          } else {
            entryB.points += 5;
            entryB.losses += 1;
          }
        }
      }
    }

    this.matchHistory.unshift(summary);
    if (this.matchHistory.length > 25) {
      this.matchHistory.pop();
    }
  }
}

module.exports = {
  WEEKLY_BRACKETS,
  WEEKLY_MATCHES_THRESHOLD,
  getWeeklyBracket,
  GameStore,
};
