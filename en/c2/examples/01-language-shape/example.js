/**
 * Teaching guide
 *
 * Goal: make JavaScript's language shape visible: C-family control syntax,
 * primitive values, object values, and first-class callable functions.
 *
 * Why this design: one small synchronous program shows the language categories
 * without mixing them with browser APIs or asynchronous execution.
 *
 * Follow the evidence:
 * - declarations, blocks, conditions, loops, calls, and returns use C-family forms;
 * - primitive values are not objects;
 * - arrays and functions participate in the object system;
 * - a function can be stored, passed, and called like any other value.
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
