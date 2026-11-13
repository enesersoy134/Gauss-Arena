const test = require('node:test');
const assert = require('node:assert/strict');
const { createAppServer, isAuthorizedSocketPlayer } = require('../src/server');

test('Server boots, serves /api/state with seeded players and question bank, and processes Coin to Isler Point conversion', async () => {
  const { httpServer, close } = await createAppServer(0);
  const address = httpServer.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const res = await fetch(`${baseUrl}/api/state`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.players.length >= 6);
    assert.ok(data.questionBankStats.totalQuestions >= 100);

    await fetch(`${baseUrl}/api/economy/simulate-15-matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: 'p1' }),
    });
    const claimRes = await fetch(`${baseUrl}/api/economy/claim-weekly`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: 'p1' }),
    });
    const claimJson = await claimRes.json();
    assert.equal(claimJson.ok, true);

    // POST /api/players/random testi
    const randRes = await fetch(`${baseUrl}/api/players/random`, { method: 'POST' });
    assert.equal(randRes.status, 200);
    const randJson = await randRes.json();
    assert.equal(randJson.ok, true);
    assert.ok(randJson.player.id.startsWith('p_rand_'));
    assert.ok(randJson.player.elo >= 1150 && randJson.player.elo <= 1350);
    assert.equal(randJson.player.coins, 250);
    assert.equal(randJson.player.islerPoints, 50);
    assert.ok(Array.isArray(randJson.player.revisionDetails));
    assert.ok(randJson.player.revisionDetails.length >= 1);

    // POST /api/players/complete-revision-practice testi
    const revPracticeRes = await fetch(`${baseUrl}/api/players/complete-revision-practice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: randJson.player.id }),
    });
    const revPracticeJson = await revPracticeRes.json();
    assert.equal(revPracticeJson.ok, true);
    assert.equal(revPracticeJson.coinsAwarded, 30);
    assert.equal(revPracticeJson.newCoins, 280); // 250 + 30
    assert.equal(revPracticeJson.revisionTopics.length, 0);
  } finally {
    await close();
  }
});

test('isAuthorizedSocketPlayer rejects mismatched socket playerId', () => {
  const map = new Map([['sock-1', 'p1']]);
  assert.equal(isAuthorizedSocketPlayer(map, 'sock-1', 'p1'), true);
  assert.equal(isAuthorizedSocketPlayer(map, 'sock-1', 'p2'), false);
});
