import assert from 'node:assert/strict';
import test from 'node:test';
import { read, useServer } from './helpers.js';

const getBaseUrl = useServer();

test('crearea reușită păstrează contractul public de creare', async () => {
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

test('JSON-ul invalid păstrează comportamentul furnizat pentru eroarea 400', async () => {
  const response = await fetch(`${getBaseUrl()}/api/clues`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });
  assert.deepEqual(await read(response), {
    status: 400,
    location: null,
    contentType: 'application/json',
    body: {
      error: {
        code: 'invalid_json',
        message: 'Corpul cererii trebuie să fie JSON valid',
      },
    },
  });
});

test('rutele necunoscute păstrează comportamentul furnizat pentru eroarea 404', async () => {
  assert.deepEqual(await read(await fetch(`${getBaseUrl()}/unknown`)), {
    status: 404,
    location: null,
    contentType: 'application/json',
    body: {
      error: {
        code: 'not_found',
        message: 'Ruta nu a fost găsită',
      },
    },
  });
});

test('un eșec pe o rută necunoscută nu oprește ruta de stare', async () => {
  await fetch(`${getBaseUrl()}/unknown`);
  assert.equal((await fetch(`${getBaseUrl()}/health`)).status, 200);
});
