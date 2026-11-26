import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { htmlHeaders, productionFixture, withApp } from "./helpers.js";

test("health, API, and assets remain healthy after a rejected navigation", async () => {
  const { app } = productionFixture();
  await withApp(app, async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/assets/missing.js`, { headers: htmlHeaders })).status, 404);
    const health = await fetch(`${baseUrl}/health`);
    assert.deepEqual(await health.json(), { data: { status: "ok" } });
    assert.equal((await fetch(`${baseUrl}/api/status`)).status, 200);
    assert.equal((await fetch(`${baseUrl}/assets/app-a1b2c3.js`)).status, 200);
  });
});

test("client marker and constrained production source remain intact", async () => {
  const index = await readFile("client-dist/index.html", "utf8");
  const asset = await readFile("client-dist/assets/app-a1b2c3.js", "utf8");
  assert.match(index, /<div id="root"><\/div>/);
  assert.match(asset, /Note detail route/);
});
