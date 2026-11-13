const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateEffectiveMMR,
  calculateExpectedScore,
  updateStreak,
  calculateMatchEloUpdate,
  calculateQuestionScore,
} = require('../src/engine/eloMomentum');

test('calculateEffectiveMMR applies zero offset for |S| <= 2 and power offset for |S| > 2', () => {
  assert.equal(calculateEffectiveMMR(1200, 0), 1200);
  assert.equal(calculateEffectiveMMR(1200, 2), 1200);
  assert.equal(calculateEffectiveMMR(1200, -2), 1200);
  const mmrPos5 = calculateEffectiveMMR(1200, 5);
  assert.ok(mmrPos5 >= 1330 && mmrPos5 <= 1332);
  const mmrNeg4 = calculateEffectiveMMR(1200, -4);
  assert.equal(mmrNeg4, 1200 - Math.round(35 * Math.pow(2, 1.2) * 100) / 100);
});

test('calculateMatchEloUpdate accelerates smurfs and dampens farming when deltaR > 250', () => {
  // Smurf (1200 ELO) beats 1350 ELO player -> gains > 22 ELO
  const smurfWin = calculateMatchEloUpdate({ elo: 1200, streak: 5 }, { elo: 1350, streak: 0 }, 'win');
  assert.ok(smurfWin.deltaA >= 22);
  assert.equal(smurfWin.newStreakA, 6);

  // High ELO (1600) beats Low ELO (1200) -> anti-farming caps gain to <= 1
  const farmWin = calculateMatchEloUpdate({ elo: 1600, streak: 2 }, { elo: 1200, streak: 0 }, 'win');
  assert.ok(farmWin.deltaA <= 1);
  assert.equal(farmWin.antiFarmingApplied, true);
});

test('calculateQuestionScore rewards accuracy + speed, returns 0 on wrong answer, and clamps remainingMs', () => {
  assert.equal(calculateQuestionScore(false, 59000, 60000), 0);
  assert.equal(calculateQuestionScore(true, 60000, 60000), 150);
  assert.equal(calculateQuestionScore(true, 30000, 60000), 125);
  assert.equal(calculateQuestionScore(true, 90000, 60000), 150);
  assert.equal(calculateQuestionScore(true, -500, 60000), 100);
});
