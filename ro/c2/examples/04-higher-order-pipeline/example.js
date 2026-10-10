/**
 * Ghid didactic
 *
 * Obiectiv: combină funcții de ordin întâi, o închidere și metode de ordin superior pentru colecții.
 * Motivația structurii: un predicat configurat alimentează etapele denumite filter, map și reduce.
 * Urmărește dovezile: configurarea are loc o dată; același predicat este apelat pentru fiecare
 * înregistrare; fiecare etapă are o formă vizibilă a intrării/ieșirii; sursa rămâne neschimbată.
 */

import assert from "node:assert/strict";

const makeTaskSelector = ({ owner, minimumEstimate = 0 }) => {
  if (typeof owner !== "string" || owner.length === 0) {
    throw new TypeError("owner trebuie să fie un șir nevid");
  }
  if (!Number.isFinite(minimumEstimate)) {
    throw new TypeError("minimumEstimate trebuie să fie finit");
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
