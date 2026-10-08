import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeContract } from '../src/normalize-contract.js';
import { read, useServer } from './helpers.js';

const getBaseUrl = useServer();

test('list keeps the clue data but corrects the public content type', async () => {
  assert.deepEqual(await read(await fetch(`${getBaseUrl()}/api/clues`)), {
    status: 200,
    location: null,
    contentType: 'application/json',
    body: { data: [{ id: 'clue-1', text: 'crumbs' }] },
  });
});

test('create validation failure returns one clean 422 response and leaves health working', async () => {
  const response = await fetch(`${getBaseUrl()}/api/clues`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: '   ' }),
  });
  assert.deepEqual(await read(response), {
    status: 422,
    location: null,
    contentType: 'application/json',
    body: { error: { code: 'text_required', message: 'Text is required' } },
  });
  assert.equal((await fetch(`${getBaseUrl()}/health`)).status, 200);
});

test('missing clue follows the public error contract', async () => {
  assert.deepEqual(await read(await fetch(`${getBaseUrl()}/api/clues/missing`)), {
    status: 404,
    location: null,
    contentType: 'application/json',
    body: { error: { code: 'clue_not_found', message: 'Clue not found' } },
  });
});

test('normalization does not mutate legacy input', () => {
  const input = Object.freeze({
    status: 200,
    headers: Object.freeze({ 'content-type': 'text/plain; charset=utf-8' }),
    body: Object.freeze({
      data: Object.freeze([{ id: 'clue-1', text: 'crumbs' }]),
    }),
  });
  const snapshot = JSON.stringify(input);
  normalizeContract('list', input);
  assert.equal(JSON.stringify(input), snapshot);
});
