/**
 * Ghid didactic
 *
 * Obiectiv: prezintă moștenirea JavaScript drept căutare a proprietăților într-un lanț de prototipuri.
 *
 * Motivația structurii: Object.create și verificările proprietăților proprii arată
 * direct delegarea, iar o clasă mică arată că metodele clasei rămân pe un prototip.
 *
 * Urmărește dovezile:
 * - proprietățile proprii sunt verificate înaintea celor din prototip;
 * - o proprietate proprie poate ascunde una moștenită;
 * - căutarea unei proprietăți absente continuă prin lanț și produce undefined;
 * - sintaxa claselor nu înlocuiește mecanismul prototipurilor.
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
