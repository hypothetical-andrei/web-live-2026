import assert from "node:assert/strict";
import test from "node:test";
import { withApi } from "./helpers.js";

test("default listing, unknown route, health, and recovery remain healthy", async () => {
  await withApi(async (baseUrl) => {
    const list = await fetch(`${baseUrl}/api/notes`);
    assert.deepEqual((await list.json()).data.map(({ id }) => id), [4, 1, 2, 3]);
    const unknown = await fetch(`${baseUrl}/api/nope`);
    assert.equal(unknown.status, 404);
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    const second = await fetch(`${baseUrl}/api/notes`);
    assert.equal(second.status, 200);
  });
});
