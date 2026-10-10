/**
 * Ghid didactic
 *
 * Obiectiv: urmărește patru surprize JavaScript mici în cod plauzibil de aplicație.
 * Motivația structurii: fiecare caz izolează un mecanism—coerciție implicită, o
 * valoare implicită bazată pe falsitate, ascunderea unei metode sau o eroare înlocuită.
 * Urmărește dovezile: prezice rândurile selectate și totalul, limita aleasă și tipul
 * lui `describe` înainte și după atribuirea proprietății pe instanță.
 */

const tasks = [
  { id: "t-1", active: "false", estimate: "3" },
  { id: "t-2", active: true, estimate: 5 },
  { id: "t-3", active: false, estimate: 8 },
];

const activeTasks = tasks.filter((task) => task.active);
const total = activeTasks.reduce((sum, task) => sum + task.estimate, 0);

console.log("coerciție — id-uri selectate:", activeTasks.map((task) => task.id));
console.log("coerciție — total și tip:", total, typeof total);

const configuredLimit = 0;
console.log("valoare implicită — limita cu ||:", configuredLimit || 10);
console.log("valoare implicită — limita cu ??:", configuredLimit ?? 10);

const taskMethods = {
  describe() {
    return `Task ${this.id}`;
  },
};

const task = Object.create(taskMethods);
task.id = "t-4";
console.log("prototip — metodă moștenită:", task.describe());

task.describe = "compact";
console.log("prototip — proprietate proprie:", Object.hasOwn(task, "describe"));
console.log("prototip — valoare ascunsă și tip:", task.describe, typeof task.describe);

const parseEstimate = (text) => {
  try {
    return JSON.parse(text).estimate;
  } catch {
    return 0;
  }
};

console.log("erori — estimare validă zero:", parseEstimate('{"estimate": 0}'));
console.log("erori — intrare greșită înlocuită cu:", parseEstimate("{"));
