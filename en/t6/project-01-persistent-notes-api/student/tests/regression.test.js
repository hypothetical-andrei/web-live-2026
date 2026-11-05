import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { withApi } from "./helpers.js";

test("malformed JSON, unknown routes, and health stay independent from persistence", async () => {
  await withApi({}, async (baseUrl) => {
    const malformed = await fetch(`${baseUrl}/api/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"title":',
    });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error.code, "invalid_json");
    const unknown = await fetch(`${baseUrl}/api/unknown`);
    assert.equal(unknown.status, 404);
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
  });
});

test("store remains independent from Express and HTTP contracts", async () => {
  const source = await readFile(new URL("../src/note-store.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from ["']express["']|\.status\(|\.json\(|internal_error/);
});
