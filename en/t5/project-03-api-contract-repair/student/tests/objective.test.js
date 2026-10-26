import test from "node:test";
import assert from "node:assert/strict";
import { withApi, request } from "./helpers.js";

test("missing retrieval finishes with an HTTP error instead of hanging", async () => {
  await withApi(async (base) => {
    let response;
    try {
      response = await request(base, "/api/meetings/absent");
    } catch (error) {
      assert.fail(`Missing retrieval never responded within 1000 ms: ${error.name}`);
    }
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), {
      error: { code: "meeting_not_found", message: "Meeting not found" },
    });
  });
});

test("already-accepted invitation reports a client-error status class", async () => {
  await withApi(async (base) => {
    const response = await request(base, "/api/meetings/m2/accept", { method: "POST" });
    assert.equal(Math.floor(response.status / 100), 4, "An unsuccessful acceptance must not be 2xx");
    assert.equal(response.status, 409);
    assert.equal((await response.json()).error.code, "already_accepted");
  });
});

test("list, detail, and acceptance use the same success wrapper", async () => {
  await withApi(async (base) => {
    for (const [path, options] of [
      ["/api/meetings", {}],
      ["/api/meetings/m1", {}],
      ["/api/meetings/m1/accept", { method: "POST" }],
    ]) {
      const response = await request(base, path, options);
      assert.match(response.headers.get("content-type"), /application\/json/);
      const body = await response.json();
      assert.deepEqual(Object.keys(body), ["data"], `Inconsistent JSON shape for ${path}`);
      if (path === "/api/meetings") assert.ok(Array.isArray(body.data));
      else assert.equal(body.data.id, "m1");
    }
  });
});

test("collection representation follows the requested sort order", async () => {
  await withApi(async (base) => {
    for (const [query, expected] of [
      ["", ["m2", "m3", "m1"]],
      ["?sort=title&order=asc", ["m2", "m3", "m1"]],
      ["?sort=title&order=desc", ["m1", "m3", "m2"]],
    ]) {
      const response = await request(base, `/api/meetings${query}`);
      assert.equal(response.status, 200);
      assert.deepEqual((await response.json()).data.map((item) => item.id), expected);
    }
  });
});
