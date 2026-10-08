import assert from 'node:assert/strict';
import test from 'node:test';
import { read, useServer } from './helpers.js';

const getBaseUrl = useServer();

test('create success retains its public creation contract', async () => {
  const response = await fetch(`${getBaseUrl()}/api/clues`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'thread' }),
  });
  assert.deepEqual(await read(response), {
    status: 201,
    location: '/api/clues/clue-2',
    contentType: 'application/json',
    body: { data: { id: 'clue-2', text: 'thread' } },
  });
});

test('malformed JSON retains the supplied 400 error behavior', async () => {
  const response = await fetch(`${getBaseUrl()}/api/clues`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });
  assert.deepEqual(await read(response), {
    status: 400,
    location: null,
    contentType: 'application/json',
    body: { error: { code: 'invalid_json', message: 'Request body must be valid JSON' } },
  });
});

test('unknown routes retain the supplied 404 error behavior', async () => {
  assert.deepEqual(await read(await fetch(`${getBaseUrl()}/unknown`)), {
    status: 404,
    location: null,
    contentType: 'application/json',
    body: { error: { code: 'not_found', message: 'Route not found' } },
  });
});

test('a failed unknown-route request does not stop health route', async () => {
  await fetch(`${getBaseUrl()}/unknown`);
  assert.equal((await fetch(`${getBaseUrl()}/health`)).status, 200);
});
