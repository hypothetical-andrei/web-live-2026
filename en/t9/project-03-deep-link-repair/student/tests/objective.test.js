import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { htmlHeaders, productionFixture, withApp } from "./helpers.js";

test("root, nested GET, and HEAD navigations receive index after static stage", async () => {
  const { app, requestLog } = productionFixture();
  await withApp(app, async (baseUrl) => {
    for (const path of ["/", "/notes/42", "/settings/profile"]) {
      const response = await fetch(`${baseUrl}${path}`, { headers: htmlHeaders });
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /text\/html/);
      assert.match(await response.text(), /Routed notes build/);
    }
    const head = await fetch(`${baseUrl}/notes/42`, { method: "HEAD", headers: htmlHeaders });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
  });
  assert.deepEqual(requestLog.slice(0, 3), ["request:GET /", "static", "spa-fallback"]);
});

test("real assets retain exact bodies, types, and immutable asset caching", async () => {
  const { app } = productionFixture();
  await withApp(app, async (baseUrl) => {
    const script = await fetch(`${baseUrl}/assets/app-a1b2c3.js`, { headers: htmlHeaders });
    assert.equal(script.status, 200);
    assert.match(script.headers.get("content-type"), /javascript/);
    assert.match(script.headers.get("cache-control"), /immutable/);
    assert.match(await script.text(), /Note detail route/);
    const icon = await fetch(`${baseUrl}/icon.svg`);
    assert.equal(icon.status, 200);
    assert.match(icon.headers.get("content-type"), /image\/svg\+xml/);
  });
});

test("API, asset-like, method, and non-HTML requests never receive index", async () => {
  const { app } = productionFixture();
  await withApp(app, async (baseUrl) => {
    const known = await fetch(`${baseUrl}/api/status`);
    assert.equal(known.status, 200);
    assert.deepEqual(await known.json(), { data: { service: "notes", ready: true } });
    const unknown = await fetch(`${baseUrl}/api/missing`, { headers: htmlHeaders });
    assert.equal(unknown.status, 404);
    assert.match(unknown.headers.get("content-type"), /application\/json/);
    assert.equal((await unknown.json()).error.code, "api_not_found");
    for (const [path, options] of [
      ["/assets/missing.js", { headers: htmlHeaders }],
      ["/release.v2", { headers: htmlHeaders }],
      ["/notes/42", { method: "POST", headers: htmlHeaders }],
      ["/notes/42", { headers: { accept: "application/json" } }]
    ]) {
      const response = await fetch(`${baseUrl}${path}`, options);
      assert.equal(response.status, 404);
      assert.doesNotMatch(await response.text(), /Routed notes build/);
    }
    assert.equal((await fetch(`${baseUrl}/notes/recovered`, { headers: htmlHeaders })).status, 200);
  });
});

test("missing index is forwarded to one sanitized 500 response", async () => {
  const directory = await mkdtemp(join(tmpdir(), "deep-link-missing-index-"));
  await writeFile(join(directory, "asset.txt"), "still here");
  const { app, requestLog } = productionFixture(directory);
  await withApp(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/notes/42`, { headers: htmlHeaders });
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: { code: "delivery_failed", message: "Client delivery failed" } });
  });
  assert.equal(requestLog.filter((entry) => entry === "error-500").length, 1);
  assert.ok(!requestLog.join("\n").includes(directory));
});

test("logged stages identify API, static, fallback, and final boundaries", async () => {
  const { app, requestLog } = productionFixture();
  await withApp(app, async (baseUrl) => {
    await fetch(`${baseUrl}/api/missing`);
    await fetch(`${baseUrl}/assets/missing.js`, { headers: htmlHeaders });
    await fetch(`${baseUrl}/notes/9`, { headers: htmlHeaders });
  });
  assert.deepEqual(requestLog, [
    "request:GET /api/missing", "api-boundary", "api:GET /missing",
    "request:GET /assets/missing.js", "static", "final-404",
    "request:GET /notes/9", "static", "spa-fallback"
  ]);
});

test("objective source uses constrained Express delivery primitives", async () => {
  const source = await readFile("server/create-production-app.js", "utf8");
  assert.match(source, /express\.static/);
  assert.match(source, /sendFile/);
  assert.match(source, /GET.*HEAD/s);
  assert.doesNotMatch(source, /vite|proxy|readFile|api-router|status\(200\).*sendFile/si);
});
