import assert from 'node:assert/strict';
import test from 'node:test';
import { transformTasks } from '../src/transform-tasks.js';

const tasks = [
  { id: 'B', title: ' beta ', owner: 'Lin', status: 'open', estimate: 3 },
  { id: 'A', title: ' alpha ', owner: 'Ada', status: 'open', estimate: 3 },
  { id: 'C', title: 'closed', owner: 'Ada', status: 'done', estimate: 9 }
];

test('pipeline filters, projects, sorts, and summarizes', () => assert.deepEqual(transformTasks(tasks), {
  tasks: [{ id: 'A', title: 'alpha', owner: 'Ada', estimate: 3 }, { id: 'B', title: 'beta', owner: 'Lin', estimate: 3 }], count: 2, totalEstimate: 6, owners: ['Ada', 'Lin']
}));
test('options filter and empty result is explicit', () => {
  assert.equal(transformTasks(tasks, { owner: 'Ada', minimumEstimate: 3 }).count, 1);
  assert.deepEqual(transformTasks(tasks, { owner: 'Nobody', minimumEstimate: 0 }), { tasks: [], count: 0, totalEstimate: 0, owners: [] });
});
test('a non-array dataset is rejected', () => {
  assert.throws(() => transformTasks({}), { name: 'TypeError', message: 'tasks must be an array' });
});
