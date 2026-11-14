const test = require('node:test');
const assert = require('node:assert/strict');
const { GameStore, getWeeklyBracket, WEEKLY_MATCHES_THRESHOLD } = require('../src/engine/economyTournaments');

test('getWeeklyBracket returns correct tier and weekly Coins', () => {
  assert.equal(getWeeklyBracket(1150).weeklyCoins, 100);
  assert.equal(getWeeklyBracket(1250).weeklyCoins, 250);
  assert.equal(getWeeklyBracket(1450).weeklyCoins, 500);
  assert.equal(getWeeklyBracket(1650).weeklyCoins, 850);
  assert.equal(getWeeklyBracket(1850).weeklyCoins, 1250);
});

test('GameStore enforces 15 weekly matches before claiming weekly Coins and converts 5000 Coins = 10 Isler Points', () => {
  assert.equal(WEEKLY_MATCHES_THRESHOLD, 15);
  const store = new GameStore();
  const p = store.getPlayer('p1');
  p.weeklyMatchesPlayed = 10;
  p.weeklyRewardClaimed = false;

  const denied = store.claimWeeklyReward('p1');
  assert.equal(denied.ok, false);

  store.simulateCompleteWeeklyMatches('p1', 15);
  const claimed = store.claimWeeklyReward('p1');
  assert.equal(claimed.ok, true);
  assert.ok(claimed.coinsAwarded >= 100);

  p.coins = 5000;
  const conv = store.convertCoinsToIslerPoints('p1', 5000);
  assert.equal(conv.ok, true);
  assert.equal(conv.islerPointsAdded, 10);
  assert.match(conv.couponCode, /^ISLER-/);
});

test('GameStore distinguishes wrong answers and groups them under revisionTopics by topic heading', () => {
  const store = new GameStore();
  store.recordMatchOutcome({
    matchId: 'm-rev-1',
    completedAt: '2026-11-13T17:40:00.000Z',
    mode: 'ranked',
    examType: 'TYT',
    winnerId: 'p1',
    playerA: { id: 'p1', name: 'Ahmet', isGhost: false },
    playerB: { id: 'p2', name: 'Zeynep', isGhost: false },
    eloUpdate: {
      newEloA: 1265,
      newStreakA: 1,
      newEloB: 1185,
      newStreakB: -1,
    },
    coinsAwardedA: 15,
    coinsAwardedB: 0,
    roundHistory: [
      {
        questionIndex: 0,
        externalId: 'TYT-MAT-E-004',
        subject: 'matematik',
        subTopic: 'Üslü Sayılar',
        difficulty: 'EASY',
        text: '2⁵ + 2⁵ işleminin sonucu aşağıdakilerden hangisine eşittir?',
        explanation: '2·2⁵ = 2⁶ olur.',
        answerA: { isCorrect: false, score: 0 },
        answerB: { isCorrect: true, score: 130 },
      },
      {
        questionIndex: 1,
        externalId: 'TYT-FIZ-M-002',
        subject: 'fizik',
        subTopic: 'Basınç',
        difficulty: 'MEDIUM',
        text: 'Özkütlesi 2 g/cm³ olan sıvının 5 m derinliğinde oluşturduğu sıvı basıncı kaç kPa olur?',
        explanation: 'P = h·d·g formülüyle hesaplanır.',
        answerA: { isCorrect: true, score: 140 },
        answerB: { isCorrect: false, score: 0 },
      },
      {
        questionIndex: 2,
        externalId: 'TYT-MAT-E-099',
        subject: 'matematik',
        subTopic: 'Üslü Sayılar',
        difficulty: 'MEDIUM',
        text: '3⁴ · 3² işleminin sonucu kaçtır?',
        explanation: 'Tabanlar aynıysa üsler toplanır: 3⁶.',
        answerA: { isCorrect: false, score: 0 },
        answerB: { isCorrect: false, score: 0 },
      },
    ],
  });

  const p1 = store.getPlayer('p1');
  const p2 = store.getPlayer('p2');

  assert.equal(p1.revisionTopics.length, 1);
  assert.equal(p1.revisionTopics[0].topic, 'Üslü Sayılar');
  assert.equal(p1.revisionTopics[0].subject, 'matematik');
  assert.equal(p1.revisionTopics[0].mistakeCount, 2);
  assert.equal(p1.revisionTopics[0].wrongQuestions.length, 2);
  assert.ok(Array.isArray(p1.revisionTopics[0].recommendedResources));
  assert.ok(p1.revisionTopics[0].recommendedResources.length >= 1);
  assert.ok(p1.revisionTopics[0].recommendedResources[0].bookTitle.length > 0);

  assert.equal(p2.revisionTopics.length, 2);
  const p2Topics = p2.revisionTopics.map((t) => t.topic);
  assert.ok(p2Topics.includes('Basınç'));
  assert.ok(p2Topics.includes('Üslü Sayılar'));

  const cleared = store.markTopicReviewed('p1', 'Üslü Sayılar');
  assert.equal(cleared.ok, true);
  assert.equal(store.getPlayer('p1').revisionTopics.length, 0);
});

test('p1 and p2 have completed daily quests and mini games by default', () => {
  const store = new GameStore();
  const p1 = store.getPlayer('p1');
  const p2 = store.getPlayer('p2');
  const p3 = store.getPlayer('p3');

  assert.equal(p1.dailyCompleted, true);
  assert.equal(p1.dailyQuestDone, true);
  assert.equal(p1.completedMiniGames.length, 6);

  assert.equal(p2.dailyCompleted, true);
  assert.equal(p2.dailyQuestDone, true);
  assert.equal(p2.completedMiniGames.length, 6);

  assert.equal(p3.dailyCompleted, false);
  assert.equal(p3.dailyQuestDone, false);
  assert.equal(p3.completedMiniGames.length, 0);
});

test('p1 and p2 are High School (YKS / TYT-AYT) while p3 and p4 are Middle School (LGS) and exempt from daily quest', () => {
  const store = new GameStore();
  const p1 = store.getPlayer('p1');
  const p2 = store.getPlayer('p2');
  const p3 = store.getPlayer('p3');
  const p4 = store.getPlayer('p4');

  // p1 and p2: High School (Lise)
  assert.equal(p1.educationLevel, 'lise');
  assert.deepEqual(p1.allowedExamTypes, ['TYT', 'AYT']);
  assert.equal(p1.allowedExamTypes.includes('LGS'), false);

  assert.equal(p2.educationLevel, 'lise');
  assert.deepEqual(p2.allowedExamTypes, ['TYT', 'AYT']);
  assert.equal(p2.allowedExamTypes.includes('LGS'), false);

  // p3 and p4: Middle School (Ortaokul / LGS)
  assert.equal(p3.educationLevel, 'ortaokul');
  assert.deepEqual(p3.allowedExamTypes, ['LGS']);
  assert.equal(p3.allowedExamTypes.includes('TYT'), false);
  assert.equal(p3.allowedExamTypes.includes('AYT'), false);
  assert.equal(p3.dailyQuestExempt, true);

  assert.equal(p4.educationLevel, 'ortaokul');
  assert.deepEqual(p4.allowedExamTypes, ['LGS']);
  assert.equal(p4.allowedExamTypes.includes('TYT'), false);
  assert.equal(p4.allowedExamTypes.includes('AYT'), false);
  assert.equal(p4.dailyQuestExempt, true);
});
