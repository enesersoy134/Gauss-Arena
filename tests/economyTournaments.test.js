const test = require('node:test');
const assert = require('node:assert/strict');
const { GameStore, getWeeklyBracket } = require('../src/engine/economyTournaments');

test('getWeeklyBracket returns correct tier and weekly Coins', () => {
  assert.equal(getWeeklyBracket(1150).weeklyCoins, 100);
  assert.equal(getWeeklyBracket(1250).weeklyCoins, 250);
  assert.equal(getWeeklyBracket(1450).weeklyCoins, 500);
  assert.equal(getWeeklyBracket(1650).weeklyCoins, 850);
  assert.equal(getWeeklyBracket(1850).weeklyCoins, 1250);
});

test('GameStore enforces 15 weekly matches before claiming weekly Coins and converts 5000 Coins = 10 Isler Points', () => {
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
