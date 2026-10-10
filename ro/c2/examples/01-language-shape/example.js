/**
 * Ghid didactic
 *
 * Obiectiv: evidențiază structura limbajului JavaScript: sintaxă de control din
 * familia C, valori primitive, valori-obiect și funcții apelabile de ordin întâi.
 *
 * Motivația structurii: un program sincron mic prezintă categoriile limbajului
 * fără să le amestece cu API-uri de browser sau execuție asincronă.
 *
 * Urmărește dovezile:
 * - declarațiile, blocurile, condițiile, buclele, apelurile și revenirile folosesc forme din familia C;
 * - valorile primitive nu sunt obiecte;
 * - tablourile și funcțiile participă la sistemul de obiecte;
 * - o funcție poate fi stocată, transmisă și apelată ca orice altă valoare.
 */

import assert from "node:assert/strict";

const samples = [
  ["string", "web"],
  ["number", 42],
  ["boolean", true],
  ["undefined", undefined],
  ["symbol", Symbol("course")],
  ["bigint", 42n],
  ["null", null],
  ["array", [1, 2]],
  ["object", { topic: "JavaScript" }],
  ["function", (value) => value * 2],
];

const classify = ([label, value]) => ({
  label,
  typeofResult: typeof value,
  primitive: value === null || (typeof value !== "object" && typeof value !== "function"),
  callable: typeof value === "function",
});

const rows = samples.map(classify);
const apply = (operation, value) => operation(value);

assert.equal(rows.filter(({ primitive }) => primitive).length, 7);
assert.equal(Array.isArray(samples[7][1]), true);
assert.equal(typeof samples[9][1], "function");
assert.equal(apply(samples[9][1], 3), 6);

console.table(rows);
