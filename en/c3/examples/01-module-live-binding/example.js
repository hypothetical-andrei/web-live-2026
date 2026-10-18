/**
 * Teaching guide
 *
 * Goal: ES modules export selected functions and values; importers of the same module share its state.
 *
 * Why this design: Three tiny modules show imports, exports, encapsulated state, and defensive projection without requiring a browser framework.
 *
 * Follow the evidence:
 * - `summary.js` imports behavior rather than reaching into private state.
 * - Changes made through `addTask` are visible through the same module instance.
 * - Returned arrays and records are projections, so callers cannot mutate module state accidentally.
 */

import assert from "node:assert/strict";
import { addTask } from "./state.js";
import { summarizeTasks } from "./summary.js";

assert.deepEqual(summarizeTasks(), { count: 0, titles: [] });

addTask("Inspect imports");
addTask("Run evidence");

assert.deepEqual(summarizeTasks(), {
  count: 2,
  titles: ["Inspect imports", "Run evidence"],
});

const exposed = summarizeTasks();
exposed.titles.push("Mutate projection");
assert.equal(summarizeTasks().count, 2);

console.log(summarizeTasks());
