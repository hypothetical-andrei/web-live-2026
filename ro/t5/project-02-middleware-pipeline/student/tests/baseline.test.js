import assert from "node:assert/strict";
import test from "node:test";
import { withApp, postJson } from "./helpers.js";

test("aplicația și handlerul furnizate funcționează cu un pipeline passthrough", async () => {
  const created = [];
  await withApp(async (baseUrl) => {
    const health = await fetch(`${baseUrl}/health`);
    assert.deepEqual(await health.json(), { status: "ok" });

    const response = await fetch(
      `${baseUrl}/api/reports`,
      postJson({ summary: "referință", severity: "low" }),
    );
    assert.equal(response.status, 201);
    assert.deepEqual((await response.json()).data, {
      id: "report-1",
      summary: "referință",
      severity: "low",
    });
  }, { pipeline: [], onCreate: (body) => created.push(body) });
  assert.equal(created.length, 1);
});
