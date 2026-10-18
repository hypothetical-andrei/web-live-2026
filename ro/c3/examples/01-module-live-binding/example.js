/**
 * Ghid didactic
 *
 * Obiectiv: modulele ES exportă funcții și valori selectate; importatorii aceluiași modul partajează starea sa.
 *
 * Motivul acestei structuri: trei module mici arată importuri, exporturi, stare încapsulată și proiecție defensivă fără un framework pentru browser.
 *
 * Urmăriți dovezile:
 * - `summary.js` importă comportament în loc să acceseze direct starea privată.
 * - Schimbările făcute prin `addTask` sunt vizibile prin aceeași instanță a modulului.
 * - Array-urile și înregistrările returnate sunt proiecții, deci apelanții nu pot modifica accidental starea modulului.
 */

import assert from "node:assert/strict";
import { addTask } from "./state.js";
import { summarizeTasks } from "./summary.js";

assert.deepEqual(summarizeTasks(), { count: 0, titles: [] });

addTask("Inspectați importurile");
addTask("Rulați verificările");

assert.deepEqual(summarizeTasks(), {
  count: 2,
  titles: ["Inspectați importurile", "Rulați verificările"],
});

const exposed = summarizeTasks();
exposed.titles.push("Modificați proiecția");
assert.equal(summarizeTasks().count, 2);

console.log(summarizeTasks());
