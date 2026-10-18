import { getTasks, taskCount } from "./state.js";

export const summarizeTasks = () => ({
  count: taskCount(),
  titles: getTasks().map(({ title }) => title),
});
