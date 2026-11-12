import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { withApi } from "./helpers.js";

test("parserul, ruta necunoscută, sănătatea și erorile sigure rămân funcționale", async () => {
  await withApi({ models: {} }, async (baseUrl) => {
    const malformed = await fetch(`${baseUrl}/api/sessions/1/registrations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"attendeeId":',
    });
    assert.equal(malformed.status, 400);
    const unknown = await fetch(`${baseUrl}/api/nope`);
    assert.equal(unknown.status, 404);
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
  }, { listSessions: async () => { throw new Error("cale sqlite secretă"); } });
});

test("modulul obiectivului rămâne dedicat persistenței și evită buclele join manuale", async () => {
  const source = await readFile(new URL("../src/conference-model.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from ["']express["']|\.status\(|\.json\(|SELECT\s|for\s*\(|forEach\s*\(/i);
});
