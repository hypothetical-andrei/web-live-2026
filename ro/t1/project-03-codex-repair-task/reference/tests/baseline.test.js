import assert from 'node:assert/strict';
import test from 'node:test';
import { produceLegacyResult } from '../src/legacy-result.js';
import { read, useServer } from './helpers.js';

const getBaseUrl = useServer();

test('ruta de stare funcționează independent', async () => {
  assert.deepEqual(await read(await fetch(`${getBaseUrl()}/health`)), {
    status: 200,
    location: null,
    contentType: 'application/json',
    body: { status: 'ok' },
  });
});

test('producătorul vechi păstrează valorile naive documentate', () => {
  assert.deepEqual(produceLegacyResult('list'), {
    status: 200,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
    body: { data: [{ id: 'clue-1', text: 'crumbs' }] },
  });
  assert.deepEqual(produceLegacyResult('missing'), {
    status: 200,
    headers: {},
    body: { clue: null, message: 'Indiciu lipsă' },
  });
});
