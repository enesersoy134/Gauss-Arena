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

test('GameStore enforces 15 weekly matches before claiming weekly Coins and converts 10 Coins = 1 Isler Point', () => {
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

  const conv = store.convertCoinsToIslerPoints('p1', 100);
  assert.equal(conv.ok, true);
  assert.equal(conv.islerPointsAdded, 10);
  assert.match(conv.couponCode, /^ISLER-/);
});
