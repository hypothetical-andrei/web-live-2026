import assert from "node:assert/strict";
import test from "node:test";
import { createTaskRepository } from "../src/task-repository.js";
import { withApi } from "./helpers.js";

test("aplicația servește resursa statică și ruta de stare", async () => {
  await withApi(async (baseUrl) => {
    const page = await fetch(`${baseUrl}/`);
    assert.equal(page.status, 200);
    assert.match(page.headers.get("content-type"), /^text\/html/);
    assert.match(await page.text(), /API pentru sarcini în memorie/);

    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "ok" });
  });
});

test("repository-ul pornește din date determinate copiate", async () => {
  const repository = createTaskRepository();
  const first = await repository.list();
  first[0].title = "mutated copy";
  const second = await repository.list();
  assert.equal(second[0].title, "Examinează cererea");
  assert.deepEqual(second.map(({ id }) => id), ["task-1", "task-2"]);
});
