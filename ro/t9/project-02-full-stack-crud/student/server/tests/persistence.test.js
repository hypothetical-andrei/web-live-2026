import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createNotesServer } from "../app.js";
import { listen } from "../server.js";

async function withApi(options, run) {
  const app = await createNotesServer(options);
  const server = createServer(app);
  try {
    const base = await listen(server);
    await run((path, options = {}) => fetch(`${base}${path}`, { ...options, signal: AbortSignal.timeout(2000) }));
  } finally {
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeAllConnections();
    try { await closed; } finally { await app.locals.closeDatabase(); }
  }
}
const write = (method, body) => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

test("CRUD în fișier supraviețuiește redeschiderii fără resetare", async () => {
  const directory = await mkdtemp(join(tmpdir(), "notes-crud-"));
  const storage = join(directory, "notes.sqlite");
  try {
    await withApi({ storage }, async (request) => {
      const created = await request("/api/notes", write("POST", { title: " Keep ", body: " Body " }));
      assert.equal(created.status, 201);
      assert.equal(created.headers.get("location"), "/api/notes/2");
      assert.deepEqual(await created.json(), { data: { id: "2", title: "Keep", body: "Body" } });
      assert.equal((await request("/api/notes/1", { method: "DELETE" })).status, 204);
    });
    await withApi({ storage }, async (request) => {
      const list = await request("/api/notes");
      assert.deepEqual(await list.json(), { data: [{ id: "2", title: "Keep", body: "Body" }] });
      const updated = await request("/api/notes/2", write("PUT", { title: "Updated", body: "Saved" }));
      assert.equal(updated.status, 200);
    });
    await withApi({ storage }, async (request) => {
      assert.deepEqual(await (await request("/api/notes/2")).json(), { data: { id: "2", title: "Updated", body: "Saved" } });
      assert.equal((await request("/api/notes/2", { method: "DELETE" })).status, 204);
    });
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("scrierile invalide păstrează rândurile și ID-urile invalide nu identifică alte rânduri", async () => {
  await withApi({}, async (request) => {
    for (const input of [{ title: " ", body: "" }, { title: "X", body: 3 }, { title: "X", body: "", id: "9" }, null]) {
      assert.equal((await request("/api/notes", write("POST", input))).status, 400);
    }
    assert.equal((await request("/api/notes/1junk")).status, 404);
    assert.equal((await request("/api/notes/1junk", { method: "DELETE" })).status, 404);
    assert.equal((await request("/api/notes/1", write("PUT", { title: " ", body: "" }))).status, 400);
    const notes = (await (await request("/api/notes")).json()).data;
    assert.equal(notes.length, 1);
    assert.equal(notes[0].id, "1");
    assert.equal((await request("/api/notes/99", { method: "DELETE" })).status, 404);
    assert.equal((await request("/api/notes", { method: "POST", headers: { "content-type": "application/json" }, body: '{"title":' })).status, 400);
  });
});

test("bazele sunt izolate și resetarea este doar pentru teste", async () => {
  await withApi({}, async (request) => {
    assert.equal((await request("/api/testing/reset", { method: "POST" })).status, 404);
  });
  await withApi({ testing: true }, async (request) => {
    await request("/api/notes", write("POST", { title: "Second", body: "" }));
    assert.equal((await request("/api/testing/reset", { method: "POST" })).status, 204);
    const list = await request("/api/notes");
    assert.deepEqual((await list.json()).data.map((note) => note.id), ["1"]);
  });
  await withApi({}, async (request) => {
    assert.equal((await (await request("/api/notes")).json()).data.length, 1);
  });
});
