import assert from "node:assert/strict";
import test from "node:test";
import { withApp, postJson } from "./helpers.js";

test("supplied app and handler work with a passthrough pipeline", async () => {
  const created = [];
  await withApp(async (baseUrl) => {
    const health = await fetch(`${baseUrl}/health`);
    assert.deepEqual(await health.json(), { status: "ok" });

    const response = await fetch(
      `${baseUrl}/api/reports`,
      postJson({ summary: "baseline", severity: "low" }),
    );
    assert.equal(response.status, 201);
    assert.deepEqual((await response.json()).data, {
      id: "report-1",
      summary: "baseline",
      severity: "low",
    });
  }, { pipeline: [], onCreate: (body) => created.push(body) });
  assert.equal(created.length, 1);
});
