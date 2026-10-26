import test from "node:test";
import assert from "node:assert/strict";
import { withApi, request } from "./helpers.js";
import { createMeetingStore } from "../src/meeting-store.js";

test("invalid ordering is rejected before calling the store", async () => {
  await withApi(async (base) => {
    for (const query of ["sort=id", "order=random", "order=asc&order=desc", "sort[0]=title"]) {
      const response = await request(base, `/api/meetings?${query}`);
      assert.equal(response.status, 400);
      assert.equal((await response.json()).error.code, "invalid_sort");
    }
  }, { store: { list() { throw new Error("Must not list invalid queries"); } } });
});

test("listing does not mutate stored order or equal-title order", async () => {
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

test("missing acceptance and unknown routes respond; conflicts preserve data", async () => {
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

test("unexpected store failures produce sanitized errors", async () => {
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

test("server stays usable after an absent retrieval is completed or aborted", async () => {
  await withApi(async (base) => {
    try { await request(base, "/api/meetings/absent"); }
    catch (error) { assert.equal(error.name, "TimeoutError"); }
    const health = await request(base, "/health");
    assert.equal(health.status, 200);
  });
});
