import assert from "node:assert/strict";
import { test } from "node:test";
import { createApiRouter } from "../server/api-router.js";
import { createBrokenServer } from "../evidence/broken-server.js";
import { clientDirectory, htmlHeaders, withApp } from "./helpers.js";

test("static-only evidence serves assets but reproduces deep-link 404", async () => {
  const log = [];
  const app = createBrokenServer({ clientDirectory, mode: "static-only", apiRouter: createApiRouter(log), requestLog: log });
  await withApp(app, async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/assets/app-a1b2c3.js`)).status, 200);
    const deepLink = await fetch(`${baseUrl}/notes/42`, { headers: htmlHeaders });
    assert.equal(deepLink.status, 404);
    assert.doesNotMatch(await deepLink.text(), /Routed notes build/);
  });
});

test("universal evidence reproduces masked missing-resource failure", async () => {
  const log = [];
  const app = createBrokenServer({ clientDirectory, mode: "universal", apiRouter: createApiRouter(log), requestLog: log });
  await withApp(app, async (baseUrl) => {
    const missingAsset = await fetch(`${baseUrl}/assets/missing.js`, { headers: htmlHeaders });
    assert.equal(missingAsset.status, 200);
    assert.match(missingAsset.headers.get("content-type"), /text\/html/);
    assert.match(await missingAsset.text(), /Routed notes build/);
  });
});
