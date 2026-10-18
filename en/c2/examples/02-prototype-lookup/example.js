/**
 * Teaching guide
 *
 * Goal: expose JavaScript inheritance as property lookup through a prototype chain.
 *
 * Why this design: Object.create and own-property checks show delegation directly,
 * while a small class shows that class methods still live on a prototype.
 *
 * Follow the evidence:
 * - own properties are checked before prototype properties;
 * - an own property can shadow an inherited property;
 * - missing lookup continues through the chain and produces undefined;
 * - class syntax does not replace the prototype mechanism.
 */

import assert from "node:assert/strict";

const taskBehavior = {
  priority: "normal",
  describe() {
    return `${this.id}:${this.priority}`;
  },
};

const task = Object.create(taskBehavior);
task.id = "t-1";

assert.equal(Object.hasOwn(task, "id"), true);
assert.equal(Object.hasOwn(task, "priority"), false);
assert.equal(task.priority, "normal");
assert.equal(task.describe(), "t-1:normal");
assert.equal(Object.getPrototypeOf(task), taskBehavior);

task.priority = "urgent";
assert.equal(Object.hasOwn(task, "priority"), true);
assert.equal(task.priority, "urgent");
assert.equal(taskBehavior.priority, "normal");
assert.equal(task.missing, undefined);

class ReviewTask {
  describe() {
    return this.id;
  }
}

const review = new ReviewTask();
review.id = "r-1";
assert.equal(Object.hasOwn(review, "describe"), false);
assert.equal(Object.getPrototypeOf(review).describe, ReviewTask.prototype.describe);

console.log({ own: Object.keys(task), inheritedPriority: taskBehavior.priority, review: review.describe() });
