const test = require('node:test');
const assert = require('node:assert/strict');
const { MatchmakingQueue, getQueueWindowLimits } = require('../src/engine/matchmakingQueue');

test('getQueueWindowLimits enforces 0-5s, 5-15s, and 15-30s tolerances', () => {
  assert.deepEqual(getQueueWindowLimits(3), {
    maxMmrDiff: 50,
    maxStreakDiff: 1,
    maxRealEloDiff: 100,
    stageLabel: '0-5s (Dar Pencere)',
  });
  assert.deepEqual(getQueueWindowLimits(10), {
    maxMmrDiff: 100,
    maxStreakDiff: 3,
    maxRealEloDiff: 175,
    stageLabel: '5-15s (Orta Pencere)',
  });
  assert.deepEqual(getQueueWindowLimits(20), {
    maxMmrDiff: 175,
    maxStreakDiff: Infinity,
    maxRealEloDiff: 250,
    stageLabel: '15-30s (Geniş Pencere - Sert Sınır)',
  });
});

test('MatchmakingQueue matches high-momentum 1200 ELO (S=5) with 1340 ELO (S=0) once streak window opens', () => {
  const q = new MatchmakingQueue();
  const t0 = 1_000_000;
  q.enqueue({ playerId: 'p1', name: 'Smurf', elo: 1200, streak: 5, examType: 'TYT', subjects: ['matematik', 'fizik'], mode: 'ranked', enqueuedAt: t0 });
  q.enqueue({ playerId: 'p2', name: 'Solid', elo: 1340, streak: 0, examType: 'TYT', subjects: ['fizik', 'kimya'], mode: 'ranked', enqueuedAt: t0 });

  // At t = 2s, streak diff is 5 (> 1), so no match yet
  let res = q.tick(t0 + 2000);
  assert.equal(res.matches.length, 0);

  // At t = 16s, streak restriction lifts, real ELO diff is 140 (<= 250), MMR_eff is ~1331 vs 1340 (diff ~9 <= 175) -> match!
  res = q.tick(t0 + 16000);
  assert.equal(res.matches.length, 1);
  assert.deepEqual(res.matches[0].commonSubjects, ['fizik']);
});

test('MatchmakingQueue allows unlimited pairwise matches (günlük eşleşme sınırı kaldırıldı), and enforces limit only if explicitly configured', () => {
  const q = new MatchmakingQueue();
  const t0 = 2_000_000;
  q.recordRankedMatch('a', 'b', t0 - 3600_000);
  q.recordRankedMatch('a', 'b', t0 - 1800_000);

  q.enqueue({ playerId: 'a', name: 'A', elo: 1200, streak: 0, examType: 'TYT', subjects: ['matematik'], mode: 'ranked', enqueuedAt: t0 });
  q.enqueue({ playerId: 'b', name: 'B', elo: 1200, streak: 0, examType: 'TYT', subjects: ['matematik'], mode: 'ranked', enqueuedAt: t0 });

  // Günlük eşleşme sınırı kaldırıldı: Önceden 2 maç yapılmış olsa bile eşleşme serbesttir
  const res1 = q.tick(t0 + 2000);
  assert.equal(res1.matches.length, 1);
  assert.equal(res1.matches[0].playerA.playerId, 'a');
  assert.equal(res1.matches[0].playerB.playerId, 'b');

  // dailyMatchLimit parametresi verilirse opsiyonel sınır devreye girer
  const qLimited = new MatchmakingQueue({ dailyMatchLimit: 2 });
  qLimited.recordRankedMatch('c', 'd', t0 - 3600_000);
  qLimited.recordRankedMatch('c', 'd', t0 - 1800_000);
  qLimited.enqueue({ playerId: 'c', name: 'C', elo: 1200, streak: 0, examType: 'TYT', subjects: ['matematik'], mode: 'ranked', enqueuedAt: t0 });
  qLimited.enqueue({ playerId: 'd', name: 'D', elo: 1200, streak: 0, examType: 'TYT', subjects: ['matematik'], mode: 'ranked', enqueuedAt: t0 });
  const resLimited = qLimited.tick(t0 + 2000);
  assert.equal(resLimited.matches.length, 0);

  // 31s'de limitli kuyrukta ghost eşleşmesi tetiklenir
  const resGhost = qLimited.tick(t0 + 31000);
  assert.equal(resGhost.ghostMatches.length, 2);
});

test('MatchmakingQueue preserves empty subjects [] and rejects disjoint subjects and >250 ELO diff at 25s', () => {
  const q = new MatchmakingQueue();
  const t0 = 3_000_000;
  q.enqueue({ playerId: 'emptySub', name: 'Empty', elo: 1200, streak: 0, examType: 'TYT', subjects: [], mode: 'ranked', enqueuedAt: t0 });
  q.enqueue({ playerId: 'matSub', name: 'Mat', elo: 1200, streak: 0, examType: 'TYT', subjects: ['matematik'], mode: 'ranked', enqueuedAt: t0 });
  q.enqueue({ playerId: 'kimyaSub', name: 'Kimya', elo: 1200, streak: 0, examType: 'TYT', subjects: ['kimya'], mode: 'ranked', enqueuedAt: t0 });
  q.enqueue({ playerId: 'highElo', name: 'High', elo: 1480, streak: 0, examType: 'TYT', subjects: ['matematik'], mode: 'ranked', enqueuedAt: t0 });

  const res = q.tick(t0 + 25000);
  assert.equal(res.matches.length, 0);
});
