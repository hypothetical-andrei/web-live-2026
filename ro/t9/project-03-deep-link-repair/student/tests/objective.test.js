import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { htmlHeaders, productionFixture, withApp } from "./helpers.js";

test("navigările la rădăcină, GET imbricate și HEAD primesc indexul după etapa statică", async () => {
  const { app, requestLog } = productionFixture();
  await withApp(app, async (baseUrl) => {
    for (const path of ["/", "/notes/42", "/settings/profile"]) {
      const response = await fetch(`${baseUrl}${path}`, { headers: htmlHeaders });
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), /text\/html/);
      assert.match(await response.text(), /Compilarea notițelor rutate/);
    }
    const head = await fetch(`${baseUrl}/notes/42`, { method: "HEAD", headers: htmlHeaders });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
  });
  assert.deepEqual(requestLog.slice(0, 3), ["request:GET /", "static", "spa-fallback"]);
});

test("resursele reale își păstrează corpurile, tipurile și cache-ul imuabil exacte", async () => {
  const { app } = productionFixture();
  await withApp(app, async (baseUrl) => {
    const script = await fetch(`${baseUrl}/assets/app-a1b2c3.js`, { headers: htmlHeaders });
    assert.equal(script.status, 200);
    assert.match(script.headers.get("content-type"), /javascript/);
    assert.match(script.headers.get("cache-control"), /immutable/);
    assert.match(await script.text(), /Rută de detaliu a notiței/);
    const icon = await fetch(`${baseUrl}/icon.svg`);
    assert.equal(icon.status, 200);
    assert.match(icon.headers.get("content-type"), /image\/svg\+xml/);
  });
});

test("cererile API, asemănătoare resurselor, cu alte metode și non-HTML nu primesc niciodată indexul", async () => {
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
      assert.doesNotMatch(await response.text(), /Compilarea notițelor rutate/);
    }
    assert.equal((await fetch(`${baseUrl}/notes/recovered`, { headers: htmlHeaders })).status, 200);
  });
});

test("indexul lipsă este redirecționat către un singur răspuns 500 neutralizat", async () => {
  const directory = await mkdtemp(join(tmpdir(), "deep-link-missing-index-"));
  await writeFile(join(directory, "asset.txt"), "still here");
  const { app, requestLog } = productionFixture(directory);
  await withApp(app, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/notes/42`, { headers: htmlHeaders });
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: { code: "delivery_failed", message: "Livrarea clientului a eșuat" } });
  });
  assert.equal(requestLog.filter((entry) => entry === "error-500").length, 1);
  assert.ok(!requestLog.join("\n").includes(directory));
});

test("etapele înregistrate identifică limitele API, statică, fallback și finală", async () => {
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

test("sursa obiectivului folosește primitive Express restrânse pentru livrare", async () => {
  const source = await readFile("server/create-production-app.js", "utf8");
  assert.match(source, /express\.static/);
  assert.match(source, /sendFile/);
  assert.match(source, /GET.*HEAD/s);
  assert.doesNotMatch(source, /vite|proxy|readFile|api-router|status\(200\).*sendFile/si);
});
