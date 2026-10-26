import assert from "node:assert/strict";
import test from "node:test";
import { withApi } from "./helpers.js";

test("malformed JSON and unknown routes keep standard errors", async () => {
  await withApi(async (baseUrl) => {
    const malformed = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"title":',
    });
    assert.equal(malformed.status, 400);
    assert.deepEqual(await malformed.json(), {
      error: { code: "invalid_json", message: "Request body is not valid JSON" },
    });

    const unknown = await fetch(`${baseUrl}/api/unknown`);
    assert.equal(unknown.status, 404);
    assert.equal((await unknown.json()).error.code, "not_found");

    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "ok" });
  });
});

test("methods are matched with resource paths", async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/tasks/task-1`, { method: "POST" });
    assert.equal(response.status, 404);
    assert.equal((await response.json()).error.code, "not_found");
  });
});
