import assert from 'node:assert/strict';
import test from 'node:test';
import { useServer } from './helpers.js';

const getBaseUrl = useServer();

test('clues preserve query identity in payload and header', async () => {
  const response = await fetch(`${getBaseUrl()}/api/clues?case=missing-cookie`);
  assert.equal(response.headers.get('x-case-id'), 'missing-cookie');
  assert.equal((await response.json()).caseId, 'missing-cookie');
});

test('verdict represents the submission and created resource', async () => {
  const submitted = { caseId: 'missing-cookie', verdict: 'cookie-jar' };
  const response = await fetch(`${getBaseUrl()}/api/verdicts`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(submitted) });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get('location'), '/api/verdicts/verdict-1');
  assert.deepEqual(await response.json(), { id: 'verdict-1', ...submitted });
});

test('unknown paths fail without stopping the server', async () => {
  assert.equal((await fetch(`${getBaseUrl()}/unknown`)).status, 404);
  assert.equal((await fetch(`${getBaseUrl()}/api/clues?case=still-running`)).status, 200);
});
