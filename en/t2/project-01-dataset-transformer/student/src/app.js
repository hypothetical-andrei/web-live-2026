import { transformTasks } from './transform-tasks.js';

// The first project starts with familiar values in memory so students can focus on JavaScript expressions and array operations.
export const demoTasks = [
  { id: 'T-3', title: '  Add tests  ', owner: 'Ada', status: 'open', estimate: 3 },
  { id: 'T-1', title: 'Fix header', owner: 'Lin', status: 'done', estimate: 2 },
  { id: 'T-2', title: 'Inspect API', owner: 'Ada', status: 'open', estimate: 5 },
  { id: 'T-4', title: 'Write notes', owner: 'Lin', status: 'open', estimate: 3 }
];

export function run(io = console) {
  io.log(JSON.stringify(transformTasks(demoTasks), null, 2));
  return 0;
}

if (process.argv[1] === new URL(import.meta.url).pathname) run();
