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
  } finally {
    await close();
  }
});

test('isAuthorizedSocketPlayer rejects mismatched socket playerId', () => {
  const map = new Map([['sock-1', 'p1']]);
  assert.equal(isAuthorizedSocketPlayer(map, 'sock-1', 'p1'), true);
  assert.equal(isAuthorizedSocketPlayer(map, 'sock-1', 'p2'), false);
});
