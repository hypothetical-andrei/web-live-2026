import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { run } from '../src/run-scenario.js';

test('forma scenariului și runnerul fix pe fișiere funcționează', () => {
  const value = JSON.parse(
    readFileSync(new URL('../data/scenario.json', import.meta.url)),
  );

  assert.ok(Array.isArray(value.records));

  const lines = [];
  assert.equal(run({ log: (value) => lines.push(value), error: () => {} }), 0);
  assert.match(lines[0], /data\/result.json/);
  assert.doesNotThrow(() => JSON.parse(readFileSync(new URL('../data/result.json', import.meta.url), 'utf8')));
});
