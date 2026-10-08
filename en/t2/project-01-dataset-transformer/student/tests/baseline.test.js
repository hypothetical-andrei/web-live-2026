import assert from 'node:assert/strict';
import test from 'node:test';
import { demoTasks, run } from '../src/app.js';

test('the simple app starts with an in-memory task array', () => assert.ok(Array.isArray(demoTasks)));
test('the app prints its transformed summary', () => {
  const output = []; const io = { log: (value) => output.push(value) };
  assert.equal(run(io), 0);
  assert.doesNotThrow(() => JSON.parse(output[0]));
});
