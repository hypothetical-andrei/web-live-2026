import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { useServer } from './helpers.js';

const getBaseUrl = useServer();

test('investigation page and assets are available', async () => {
  for (const path of ['/', '/browser.js', '/assets/detective.css']) {
    const response = await fetch(`${getBaseUrl()}${path}`);
    assert.equal(response.status, 200);
  }
});

test('browser module contains the three investigation requests', async () => {
  const source = await readFile(new URL('../public/browser.js', import.meta.url), 'utf8');
  assert.match(source, /assets\/detective\.css/);
  assert.match(source, /api\/clues\?case=missing-cookie/);
  assert.match(source, /api\/verdicts/);
});
