import { transformTasks } from './transform-tasks.js';

// Primul proiect pornește de la valori familiare din memorie, pentru ca studenții să se concentreze pe expresii JavaScript și operații pe tablouri.
export const demoTasks = [
  { id: 'T-3', title: '  Adaugă teste  ', owner: 'Ada', status: 'open', estimate: 3 },
  { id: 'T-1', title: 'Corectează antetul', owner: 'Lin', status: 'done', estimate: 2 },
  { id: 'T-2', title: 'Examinează API-ul', owner: 'Ada', status: 'open', estimate: 5 },
  { id: 'T-4', title: 'Scrie notițe', owner: 'Lin', status: 'open', estimate: 3 }
];

export function run(io = console) {
  io.log(JSON.stringify(transformTasks(demoTasks), null, 2));
  return 0;
}

if (process.argv[1] === new URL(import.meta.url).pathname) run();
