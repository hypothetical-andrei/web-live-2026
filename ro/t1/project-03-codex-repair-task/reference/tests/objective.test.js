import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeContract } from '../src/normalize-contract.js';
import { read, useServer } from './helpers.js';

const getBaseUrl = useServer();

test('listarea păstrează datele, dar corectează tipul public de conținut', async () => {
  assert.deepEqual(await read(await fetch(`${getBaseUrl()}/api/clues`)), {
    status: 200,
    location: null,
    contentType: 'application/json',
    body: { data: [{ id: 'clue-1', text: 'crumbs' }] },
  });
});

test('validarea la creare întoarce un singur răspuns 422 și lasă ruta de stare funcțională', async () => {
  const response = await fetch(`${getBaseUrl()}/api/clues`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: '   ' }),
  });
  assert.deepEqual(await read(response), {
    status: 422,
    location: null,
    contentType: 'application/json',
    body: {
      error: {
        code: 'text_required',
        message: 'Textul este obligatoriu',
      },
    },
  });
  assert.equal((await fetch(`${getBaseUrl()}/health`)).status, 200);
});

test('indiciul inexistent respectă contractul public de eroare', async () => {
  assert.deepEqual(await read(await fetch(`${getBaseUrl()}/api/clues/missing`)), {
    status: 404,
    location: null,
    contentType: 'application/json',
    body: {
      error: {
        code: 'clue_not_found',
        message: 'Indiciul nu a fost găsit',
      },
    },
  });
});

test('normalizarea nu modifică intrarea veche', () => {
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
