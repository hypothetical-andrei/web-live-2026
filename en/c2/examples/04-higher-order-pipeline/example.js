/**
 * Teaching guide
 *
 * Goal: combine first-class functions, a closure, and higher-order collection methods.
 * Why this design: one configured predicate feeds named filter, map, and reduce stages.
 * Follow the evidence: configuration happens once; the same predicate is called for each record;
 * each pipeline stage has a visible input/output shape; the source remains unchanged.
 */

import assert from "node:assert/strict";

const makeTaskSelector = ({ owner, minimumEstimate = 0 }) => {
  if (typeof owner !== "string" || owner.length === 0) {
    throw new TypeError("owner must be a non-empty string");
  }
  if (!Number.isFinite(minimumEstimate)) {
    throw new TypeError("minimumEstimate must be finite");
  }

  return (task) =>
    task.owner === owner && task.status === "open" && task.estimate >= minimumEstimate;
};

const tasks = Object.freeze([
  Object.freeze({ id: "t-1", owner: "Ada", status: "open", estimate: 2 }),
  Object.freeze({ id: "t-2", owner: "Ada", status: "done", estimate: 8 }),
  Object.freeze({ id: "t-3", owner: "Lin", status: "open", estimate: 5 }),
  Object.freeze({ id: "t-4", owner: "Ada", status: "open", estimate: 6 }),
]);

const selectLargeAdaTasks = makeTaskSelector({ owner: "Ada", minimumEstimate: 4 });
const selected = tasks.filter(selectLargeAdaTasks);
const estimates = selected.map(({ id, estimate }) => ({ id, estimate }));
const totalEstimate = estimates.reduce((total, task) => total + task.estimate, 0);

assert.deepEqual(estimates, [{ id: "t-4", estimate: 6 }]);
assert.equal(totalEstimate, 6);
assert.throws(() => makeTaskSelector({ owner: "" }), TypeError);
assert.equal(tasks.length, 4);

console.log({ selected, estimates, totalEstimate });
