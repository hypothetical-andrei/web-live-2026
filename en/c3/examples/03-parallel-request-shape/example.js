/**
 * Teaching guide
 *
 * Goal: Independent asynchronous operations should be started before any one result is awaited.
 *
 * Why this design: The logged start/finish order demonstrates concurrency without depending on variable internet timing.
 *
 * Follow the evidence:
 * - All three operations start before the first one finishes.
 * - `Promise.all` preserves input order even though completion order differs.
 * - Parallel coordination is a code-shape decision, not merely a stopwatch result.
 */

import assert from "node:assert/strict";

const events = [];
const delays = { profile: 30, tasks: 10, notices: 20 };

function load(name) {
  events.push(`start:${name}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      events.push(`finish:${name}`);
      resolve(name);
    }, delays[name]);
  });
}

const names = ["profile", "tasks", "notices"];
const pending = names.map(load);
const results = await Promise.all(pending);

assert.deepEqual(events.slice(0, 3), names.map((name) => `start:${name}`));
assert.deepEqual(results, names);
assert.deepEqual(events.slice(3), [
  "finish:tasks",
  "finish:notices",
  "finish:profile",
]);

console.log({ events, results });
