import assert from "node:assert/strict";
import test from "node:test";
import { createTaskRepository } from "../src/task-repository.js";
import { withApi } from "./helpers.js";

test("app serves its static resource and health route", async () => {
  await withApi(async (baseUrl) => {
    const page = await fetch(`${baseUrl}/`);
    assert.equal(page.status, 200);
    assert.match(page.headers.get("content-type"), /^text\/html/);
    assert.match(await page.text(), /In-memory Task API/);

    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "ok" });
  });
});

test("repository starts from deterministic copied data", async () => {
  const repository = createTaskRepository();
  const first = await repository.list();
  first[0].title = "mutated copy";
  const second = await repository.list();
  assert.equal(second[0].title, "Inspect the request");
  assert.deepEqual(second.map(({ id }) => id), ["task-1", "task-2"]);
});
