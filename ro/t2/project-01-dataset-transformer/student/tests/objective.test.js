import assert from 'node:assert/strict';
import test from 'node:test';
import { transformTasks } from '../src/transform-tasks.js';

const tasks = [
  { id: 'B', title: ' beta ', owner: 'Lin', status: 'open', estimate: 3 },
  { id: 'A', title: ' alfa ', owner: 'Ada', status: 'open', estimate: 3 },
  { id: 'C', title: 'închis', owner: 'Ada', status: 'done', estimate: 9 }
];

test('fluxul filtrează, proiectează, sortează și sumarizează', () => assert.deepEqual(transformTasks(tasks), {
  tasks: [{ id: 'A', title: 'alfa', owner: 'Ada', estimate: 3 }, { id: 'B', title: 'beta', owner: 'Lin', estimate: 3 }], count: 2, totalEstimate: 6, owners: ['Ada', 'Lin']
}));
test('opțiunile filtrează, iar rezultatul gol este explicit', () => {
  assert.equal(transformTasks(tasks, { owner: 'Ada', minimumEstimate: 3 }).count, 1);
  assert.deepEqual(transformTasks(tasks, { owner: 'Nimeni', minimumEstimate: 0 }), { tasks: [], count: 0, totalEstimate: 0, owners: [] });
});
test('un set de date care nu este tablou este respins', () => {
  assert.throws(() => transformTasks({}), { name: 'TypeError', message: 'tasks trebuie să fie un tablou' });
});
