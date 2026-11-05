import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "./app.js";

test("Express distinge colecția, membrul, query-ul și rutele fără corespondent", async () => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const list = await fetch(`${base}/api/tasks?completed=true`);
    assert.equal(list.status, 200);
    assert.deepEqual(
      (await list.json()).data.map(({ id }) => id),
      ["t-1"],
    );
    assert.equal((await fetch(`${base}/api/tasks?completed=maybe`)).status, 400);
    const incomplete = await fetch(`${base}/api/tasks?completed=false`);
    assert.deepEqual(
      (await incomplete.json()).data.map(({ id }) => id),
      ["t-2"],
    );
    const member = await fetch(`${base}/api/tasks/t-1`);
    assert.equal((await member.json()).data.id, "t-1");
    const create = await fetch(`${base}/api/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    assert.equal(create.status, 501);
    assert.equal((await create.json()).error.code, "not_implemented");
    assert.equal((await fetch(`${base}/api/tasks`, { method: "DELETE" })).status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
