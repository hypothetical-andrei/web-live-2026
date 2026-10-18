/**
 * Ghid didactic
 *
 * Obiectiv: operațiile asincrone independente trebuie pornite înainte de a aștepta vreun rezultat.
 *
 * Motivul acestei structuri: ordinea pornire/finalizare din jurnal demonstrează concurența fără a depinde de timpii variabili ai internetului.
 *
 * Urmăriți dovezile:
 * - Toate cele trei operații pornesc înainte ca prima să se încheie.
 * - `Promise.all` păstrează ordinea intrărilor chiar dacă ordinea finalizării diferă.
 * - Coordonarea paralelă ține de structura codului, nu doar de un rezultat cronometrat.
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
