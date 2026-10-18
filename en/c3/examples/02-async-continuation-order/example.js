/**
 * Teaching guide
 *
 * Goal: `await` suspends the current async function while the calling code continues.
 *
 * Why this design: Five log entries make the scheduling model observable without network or UI concerns.
 *
 * Follow the evidence:
 * - The async function starts synchronously.
 * - Code after `await` runs only after the current stack clears.
 * - In this example, the returned promise fulfills when the async function finishes.
 */

import assert from "node:assert/strict";

const events = [];
const record = (event) => events.push(event);

async function run() {
  record("function start");
  await Promise.resolve();
  record("after await");
}

record("script start");
const completion = run().then(() => record("promise fulfilled"));
record("script end");
await completion;

assert.deepEqual(events, [
  "script start",
  "function start",
  "script end",
  "after await",
  "promise fulfilled",
]);

console.log(events.join(" → "));
