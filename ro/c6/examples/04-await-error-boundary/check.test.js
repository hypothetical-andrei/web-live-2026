import assert from "node:assert/strict";
import test from "node:test";
import { createApplication } from "./app.js";

test("CRUD Express așteaptă Sequelize și clasifică erorile de persistență", async () => {
  const application = await createApplication();
  const server = application.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const created = await fetch(`${base}/api/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Notiță stocată" }),
    });
    assert.equal(created.status, 201);
    assert.equal(created.headers.get("location"), "/api/notes/1");
    const conflict = await fetch(`${base}/api/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Notiță stocată" }),
    });
    assert.equal(conflict.status, 409);
    const invalid = await fetch(`${base}/api/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: null }),
    });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error.code, "invalid_note");
    const malformed = await fetch(`${base}/api/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error.code, "invalid_json");
    const updated = await fetch(`${base}/api/notes/1`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    assert.equal((await updated.json()).data.archived, true);
    const unarchived = await fetch(`${base}/api/notes/1`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ archived: false }),
    });
    assert.equal(unarchived.status, 200);
    const restored = (await unarchived.json()).data;
    assert.equal(restored.archived, false);
    assert.equal(restored.title, "Notiță stocată");
    const listed = await fetch(`${base}/api/notes`);
    assert.equal(listed.status, 200);
    assert.deepEqual(
      (await listed.json()).data.map(({ id, title, archived }) => ({
        id,
        title,
        archived,
      })),
      [{ id: 1, title: "Notiță stocată", archived: false }],
    );
    assert.equal(
      (await fetch(`${base}/api/notes/1`, { method: "DELETE" })).status,
      204,
    );
    assert.equal(
      (await fetch(`${base}/api/notes/1`, { method: "DELETE" })).status,
      404,
    );
    const missing = await fetch(`${base}/api/notes/1`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).error.code, "note_not_found");
    assert.deepEqual(
      (await (await fetch(`${base}/api/notes`)).json()).data,
      [],
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await application.close();
  }
});
