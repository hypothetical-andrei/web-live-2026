/**
 * Ghid didactic
 *
 * Obiectiv: `await` suspendă funcția async curentă, în timp ce codul apelant continuă.
 *
 * Motivul acestei structuri: cinci intrări în jurnal fac modelul de planificare observabil fără rețea sau interfață.
 *
 * Urmăriți dovezile:
 * - Funcția async pornește sincron.
 * - Codul de după `await` rulează numai după golirea stivei curente.
 * - În acest exemplu, promisiunea returnată este îndeplinită când funcția async se termină.
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
