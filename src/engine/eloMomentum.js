function round2(val) {
  return Math.round(val * 100) / 100;
}

function round1(val) {
  return Math.round(val * 10) / 10;
}

/**
 * MMR_eff = R_mevcut + sgn(S) * alpha * (max(0, |S| - 2))^beta
 */
function calculateEffectiveMMR(realElo, streak = 0, alpha = 35, beta = 1.2) {
  const s = Number(streak) || 0;
  const absExcess = Math.max(0, Math.abs(s) - 2);
  if (absExcess === 0) {
    return round2(realElo);
  }
  const sign = Math.sign(s);
  const momentumOffset = sign * alpha * Math.pow(absExcess, beta);
  return round2(realElo + momentumOffset);
}

/**
 * E_A = 1 / (1 + 10^((R_B - R_A) / 400))
 */
function calculateExpectedScore(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/**
 * Updates signed streak counter S based on match outcome ('win' | 'loss' | 'draw')
 */
function updateStreak(currentStreak = 0, outcome) {
  const s = Number(currentStreak) || 0;
  if (outcome === 'win') {
    return s >= 0 ? s + 1 : 1;
  }
  if (outcome === 'loss') {
    return s <= 0 ? s - 1 : -1;
  }
  return s;
}

/**
 * Post-match ELO update using REAL ELO (R_A, R_B), with Anti-Farming dampening when |R_A - R_B| > 250.
 */
function calculateMatchEloUpdate(playerA, playerB, outcomeA, K = 32) {
  const eloA = Number(playerA.elo);
  const eloB = Number(playerB.elo);
  const streakA = Number(playerA.streak) || 0;
  const streakB = Number(playerB.streak) || 0;

  const expectedA = calculateExpectedScore(eloA, eloB);
  const expectedB = 1 - expectedA;

  let scoreA = 0.5;
  let outcomeB = 'draw';
  if (outcomeA === 'win') {
    scoreA = 1;
    outcomeB = 'loss';
  } else if (outcomeA === 'loss') {
    scoreA = 0;
    outcomeB = 'win';
  }
  const scoreB = 1 - scoreA;

  let rawDeltaA = K * (scoreA - expectedA);
  let rawDeltaB = K * (scoreB - expectedB);
  let antiFarmingApplied = false;

  const eloDiffAB = eloA - eloB;
  if (scoreA === 1 && eloDiffAB > 250) {
    antiFarmingApplied = true;
    const cap = eloDiffAB >= 300 ? 0 : 1;
    rawDeltaA = Math.min(rawDeltaA, cap);
    rawDeltaB = Math.max(rawDeltaB, -cap);
  } else if (scoreB === 1 && -eloDiffAB > 250) {
    antiFarmingApplied = true;
    const cap = -eloDiffAB >= 300 ? 0 : 1;
    rawDeltaB = Math.min(rawDeltaB, cap);
    rawDeltaA = Math.max(rawDeltaA, -cap);
  }

  const deltaA = round1(rawDeltaA);
  const deltaB = round1(rawDeltaB);
  const newEloA = round1(Math.max(100, eloA + deltaA));
  const newEloB = round1(Math.max(100, eloB + deltaB));

  return {
    newEloA,
    newEloB,
    deltaA,
    deltaB,
    newStreakA: updateStreak(streakA, outcomeA),
    newStreakB: updateStreak(streakB, outcomeB),
    expectedA: round2(expectedA),
    expectedB: round2(expectedB),
    antiFarmingApplied,
  };
}

/**
 * Question Score = isCorrect * (100 + 50 * (remainingMs / totalMs))
 */
function calculateQuestionScore(isCorrect, remainingMs, totalMs = 60000) {
  if (!isCorrect) {
    return 0;
  }
  const safeTotal = totalMs > 0 ? totalMs : 60000;
  const clampedRemaining = Math.max(0, Math.min(safeTotal, Number(remainingMs) || 0));
  const score = 100 + 50 * (clampedRemaining / safeTotal);
  return round2(score);
}

module.exports = {
  calculateEffectiveMMR,
  calculateExpectedScore,
  updateStreak,
  calculateMatchEloUpdate,
  calculateQuestionScore,
};
