let tasks = [];

export const getTasks = () => tasks.map((task) => ({ ...task }));

export const addTask = (title) => {
  const task = { id: `t-${tasks.length + 1}`, title };
  tasks = [...tasks, task];
  return { ...task };
};

export const taskCount = () => tasks.length;
