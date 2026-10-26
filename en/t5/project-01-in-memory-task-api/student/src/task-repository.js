const initialTasks = [
  { id: "task-1", title: "Inspect the request", completed: true },
  { id: "task-2", title: "Review the response", completed: false },
];

// Return fresh objects so the HTTP layer cannot accidentally mutate repository state by reference.
const copyTask = (task) => ({ ...task });

export function createTaskRepository(seed = initialTasks) {
  let tasks = seed.map(copyTask);
  let nextId = tasks.length + 1;

  return {
    async list() {
      return tasks.map(copyTask);
    },

    async findById(id) {
      const task = tasks.find((candidate) => candidate.id === id);
      return task ? copyTask(task) : null;
    },

    async create(values) {
      const task = { id: `task-${nextId++}`, ...values };
      tasks.push(task);
      return copyTask(task);
    },

    async update(id, changes) {
      const index = tasks.findIndex((candidate) => candidate.id === id);
      if (index === -1) return null;
      tasks[index] = { ...tasks[index], ...changes };
      return copyTask(tasks[index]);
    },

    async remove(id) {
      const index = tasks.findIndex((candidate) => candidate.id === id);
      if (index === -1) return false;
      tasks.splice(index, 1);
      return true;
    },
  };
}
