import test from "node:test";
import assert from "node:assert/strict";
import { withApi, request } from "./helpers.js";
import { createMeetingStore } from "../src/meeting-store.js";

test("ordonarea invalidă este respinsă înainte de apelarea stocării", async () => {
  await withApi(async (base) => {
    for (const query of ["sort=id", "order=random", "order=asc&order=desc", "sort[0]=title"]) {
      const response = await request(base, `/api/meetings?${query}`);
      assert.equal(response.status, 400);
      assert.equal((await response.json()).error.code, "invalid_sort");
    }
  }, { store: { list() { throw new Error("Nu trebuie listate cereri cu query invalid"); } } });
});

test("listarea nu modifică ordinea stocată sau ordinea titlurilor egale", async () => {
  const records = Object.freeze([
    Object.freeze({ id: "b", title: "Same", accepted: false }),
    Object.freeze({ id: "a", title: "Same", accepted: false }),
    Object.freeze({ id: "z", title: "Zebra", accepted: false }),
  ]);
  await withApi(async (base) => {
    for (const order of ["asc", "desc"]) {
      const response = await request(base, `/api/meetings?order=${order}`);
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.deepEqual(body.data.filter((item) => item.title === "Same").map((item) => item.id), ["b", "a"]);
      assert.deepEqual(records.map((item) => item.id), ["b", "a", "z"]);
    }
  }, { store: { list: () => records } });
});

test("acceptarea lipsă și rutele necunoscute răspund; conflictele păstrează datele", async () => {
  const store = createMeetingStore();
  const before = store.find("m2");
  await withApi(async (base) => {
    const missing = await request(base, "/api/meetings/absent/accept", { method: "POST" });
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).error.code, "meeting_not_found");
    assert.equal((await request(base, "/not-an-endpoint")).status, 404);
    await request(base, "/api/meetings/m2/accept", { method: "POST" });
    assert.deepEqual(store.find("m2"), before);
  }, { store });
});

test("erorile neașteptate ale stocării nu expun detalii interne", async () => {
  await withApi(async (base) => {
    for (const [path, options] of [["/api/meetings", {}], ["/api/meetings/m1", {}], ["/api/meetings/m1/accept", { method: "POST" }]]) {
      const response = await request(base, path, options);
      assert.equal(response.status, 500);
      assert.deepEqual(await response.json(), { error: { code: "internal_error", message: "Internal server error" } });
    }
  }, { store: {
    list() { throw new Error("private database detail"); },
    find() { throw new Error("private database detail"); },
  } });
});

test("serverul rămâne utilizabil după finalizarea sau anularea citirii lipsă", async () => {
  await withApi(async (base) => {
    try { await request(base, "/api/meetings/absent"); }
    catch (error) { assert.equal(error.name, "TimeoutError"); }
    const health = await request(base, "/health");
    assert.equal(health.status, 200);
  });
});
