import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { run } from '../src/run-scenario.js';
import { compileRule, evaluateRecords } from '../src/rule-engine.js';

test('frozen inputs are unchanged', () => {
  const record = Object.freeze({ id: '1', x: 1 });
  const records = Object.freeze([record]);
  const rule = Object.freeze({ field: 'x', operator: 'equals', value: 1 });

  const result = evaluateRecords(records, rule);

  assert.deepEqual(records, [record]);
  assert.deepEqual(rule, { field: 'x', operator: 'equals', value: 1 });
  assert.equal(
    Array.isArray(result.matchedIds) && Array.isArray(result.rejectedIds),
    true,
  );
});

test('composites short circuit', () => {
  const record = {
    x: 0,
    get danger() {
      throw new Error('evaluated');
    },
  };
  const predicate = compileRule({
    all: [
      { field: 'x', operator: 'equals', value: 1 },
      { field: 'danger', operator: 'equals', value: true },
    ],
  });

  assert.equal(predicate(record), false);
});

test('fixed file runner writes valid JSON', () => {
  assert.equal(run({ log: () => {}, error: () => {} }), 0);
  assert.doesNotThrow(() => JSON.parse(readFileSync(new URL('../data/result.json', import.meta.url), 'utf8')));
});
