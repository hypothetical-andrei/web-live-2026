/**
 * Ghid didactic
 *
 * Obiectiv: arată că variabilele-obiect păstrează referințe, iar spread copiază un singur nivel.
 * Motivația structurii: verificările identității fac observabilă partajarea altfel invizibilă.
 * Urmărește dovezile: identitățile tabloului, înregistrării și obiectului imbricat se verifică separat.
 */

import assert from "node:assert/strict";

const tasks = [{ id: "t-1", meta: { priority: 1 } }];
const alias = tasks;
const copiedArray = [...tasks];
const copiedTask = { ...tasks[0] };

assert.equal(alias, tasks);
assert.notEqual(copiedArray, tasks);
assert.equal(copiedArray[0], tasks[0]);
assert.equal(copiedTask.meta, tasks[0].meta);

const updated = tasks.map((task) =>
  task.id === "t-1" ? { ...task, meta: { ...task.meta, priority: 2 } } : task,
);

assert.equal(tasks[0].meta.priority, 1);
assert.equal(updated[0].meta.priority, 2);
assert.notEqual(updated[0].meta, tasks[0].meta);

console.log({ original: tasks[0], updated: updated[0] });
