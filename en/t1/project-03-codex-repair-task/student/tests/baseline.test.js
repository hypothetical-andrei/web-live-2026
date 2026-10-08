import assert from 'node:assert/strict';
import test from 'node:test';
import { produceLegacyResult } from '../src/legacy-result.js';
import { read, useServer } from './helpers.js';

const getBaseUrl = useServer();

test('health route works independently', async () => {
  assert.deepEqual(await read(await fetch(`${getBaseUrl()}/health`)), {
    status: 200,
    location: null,
    contentType: 'application/json',
    body: { status: 'ok' },
  });
});

test('legacy producer retains the deliberately naïve behavior', () => {
  assert.equal(
    produceLegacyResult('list').headers['content-type'],
    'text/plain; charset=utf-8',
  );
  assert.equal(produceLegacyResult('missing').status, 200);
  assert.deepEqual(produceLegacyResult('missing').body, {
    clue: null,
    message: 'Missing clue',
  });
});
