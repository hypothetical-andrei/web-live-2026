import assert from "node:assert/strict";
import test from "node:test";
import { withApp } from "./helpers.js";

test("malformed JSON and unrelated routes retain supplied behavior", async () => {
  await withApp(async (baseUrl) => {
    const malformed = await fetch(`${baseUrl}/api/reports`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"summary":',
    });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error.code, "invalid_json");

    const unknown = await fetch(`${baseUrl}/api/unknown`);
    assert.equal(unknown.status, 404);
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
  });
});
