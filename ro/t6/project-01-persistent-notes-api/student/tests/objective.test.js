import assert from "node:assert/strict";
import test from "node:test";
import { createNoteStore } from "../src/note-store.js";
import { seedNotes } from "../src/seed.js";
import { withApi, withStore, withTempStorage, jsonRequest } from "./helpers.js";

test("metadatele, valorile implicite, normalizarea și CRUD respectă contractul", async () => {
  await withStore(async (store) => {
    const attributes = store.Note.getAttributes();
    assert.equal(attributes.id.primaryKey, true);
    assert.equal(attributes.id.autoIncrement, true);
    assert.equal(attributes.title.allowNull, false);
    assert.equal(attributes.body.allowNull, false);
    assert.equal(attributes.body.defaultValue, "");
    assert.equal(attributes.archived.allowNull, false);
    assert.equal(attributes.archived.defaultValue, false);

    await store.initialize({ reset: true, seed: seedNotes });
    const seeded = await store.list();
    assert.deepEqual(seeded.map(({ id }) => id), [1, 2]);

    const created = await store.create({ title: "  Păstrează-mă  " });
    assert.equal(created.title, "Păstrează-mă");
    assert.equal(created.body, "");
    assert.equal(created.archived, false);
    assert.equal(typeof created.get, "undefined");

    const updated = await store.update(created.id, { archived: true });
    assert.equal(updated.title, "Păstrează-mă");
    assert.equal(updated.archived, true);
    assert.equal(await store.update(999, { title: "missing" }), null);
    assert.equal(await store.remove(created.id), true);
    assert.equal(await store.remove(created.id), false);
    assert.equal(await store.findById(created.id), null);
  });
});

test("rândurile din fișier supraviețuiesc închiderii și inițializării fără resetare", async () => {
  await withTempStorage(async (storage) => {
    const first = createNoteStore({ storage });
    await first.initialize({ reset: true, seed: seedNotes });
    const created = await first.create({ title: "Supraviețuiește repornirii", body: "disc" });
    await first.close();

    const second = createNoteStore({ storage });
    await second.initialize({ reset: false, seed: seedNotes });
    const found = await second.findById(created.id);
    assert.equal(found.title, "Supraviețuiește repornirii");
    assert.equal((await second.list()).length, 3);
    await second.close();
  });
});

test("CRUD HTTP real folosește rezultatele depozitului persistent", async () => {
  await withStore(async (store) => {
    await withApi(store, async (baseUrl) => {
      const created = await fetch(`${baseUrl}/api/notes`, jsonRequest("POST", { title: "Notiță API" }));
      assert.equal(created.status, 201);
      assert.equal(created.headers.get("location"), "/api/notes/1");
      const body = await created.json();
      assert.equal(body.data.title, "Notiță API");

      const updated = await fetch(`${baseUrl}/api/notes/1`, jsonRequest("PATCH", { archived: true }));
      assert.equal((await updated.json()).data.archived, true);
      const removed = await fetch(`${baseUrl}/api/notes/1`, { method: "DELETE" });
      assert.equal(removed.status, 204);
    });
  });
});

test("datele invalide nu inserează nimic, iar operația ulterioară reușește", async () => {
  await withStore(async (store) => {
    await assert.rejects(store.create({ title: "   " }), { name: "SequelizeValidationError" });
    assert.equal((await store.list()).length, 0);
    const created = await store.create({ title: "Valid după eșec" });
    assert.equal(created.title, "Valid după eșec");
  }, { seed: [] });
});

test("inițializarea normală nu duplică datele inițiale", async () => {
  await withStore(async (store) => {
    await store.initialize({ reset: true, seed: seedNotes });
    await store.initialize({ reset: false, seed: seedNotes });
    assert.equal((await store.list()).length, 2);
  });
});
