import assert from 'node:assert/strict';
import test from 'node:test';
import { demoTasks, run } from '../src/app.js';

test('aplicația simplă pornește cu un tablou de sarcini în memorie', () => assert.ok(Array.isArray(demoTasks)));
test('aplicația afișează sumarul transformat', () => {
  const output = []; const io = { log: (value) => output.push(value) };
  assert.equal(run(io), 0);
  assert.doesNotThrow(() => JSON.parse(output[0]));
});
