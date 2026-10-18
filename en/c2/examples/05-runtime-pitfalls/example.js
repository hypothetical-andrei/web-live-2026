/**
 * Teaching guide
 *
 * Goal: trace four small JavaScript surprises in plausible application code.
 * Why this design: each case isolates one mechanism—implicit coercion, a falsy
 * default, own-property shadowing, or an error replaced by a plausible result.
 * Follow the evidence: predict the selected rows and total, the chosen limit,
 * and the type of `describe` before and after the instance property is assigned.
 */

const tasks = [
  { id: "t-1", active: "false", estimate: "3" },
  { id: "t-2", active: true, estimate: 5 },
  { id: "t-3", active: false, estimate: 8 },
];

const activeTasks = tasks.filter((task) => task.active);
const total = activeTasks.reduce((sum, task) => sum + task.estimate, 0);

console.log("coercion — selected task ids:", activeTasks.map((task) => task.id));
console.log("coercion — total and type:", total, typeof total);

const configuredLimit = 0;
console.log("defaulting — limit with ||:", configuredLimit || 10);
console.log("defaulting — limit with ??:", configuredLimit ?? 10);

const taskMethods = {
  describe() {
    return `Task ${this.id}`;
  },
};

const task = Object.create(taskMethods);
task.id = "t-4";
console.log("prototype — inherited method:", task.describe());

task.describe = "compact";
console.log("prototype — own property:", Object.hasOwn(task, "describe"));
console.log("prototype — masked value and type:", task.describe, typeof task.describe);

const parseEstimate = (text) => {
  try {
    return JSON.parse(text).estimate;
  } catch {
    return 0;
  }
};

console.log("errors — valid zero estimate:", parseEstimate('{"estimate": 0}'));
console.log("errors — malformed input replaced with:", parseEstimate("{"));
