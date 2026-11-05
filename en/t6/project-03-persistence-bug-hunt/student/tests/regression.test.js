import assert from "node:assert/strict";
import test from "node:test";
import { createReservation } from "../src/reservation-store.js";
import { withApi, withDatabase, request, postJson } from "./helpers.js";

test("parser, missing routes and internal-error responses remain safe", async () => {
  const database = { Reservation: { findAll: async () => { throw new Error("sqlite private path"); } } };
  await withApi(database, async (base) => {
    const malformed = await request(base, "/api/reservations", {
      method: "POST", headers: { "content-type": "application/json" }, body: '{"code":',
    });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error.code, "invalid_json");
    assert.equal((await request(base, "/api/nope")).status, 404);
    const failed = await request(base, "/api/reservations");
    assert.equal(failed.status, 500);
    assert.doesNotMatch(await failed.text(), /sqlite|private|path|stack/i);
    assert.equal((await request(base, "/health")).status, 200);
  });
});

test("unexpected asynchronous errors retain their identity", async () => {
  const sentinel = new Error("driver disconnected");
  await assert.rejects(createReservation({ create: async () => { throw sentinel; } }, {}), (error) => error === sentinel);
});

test("a rejected write does not prevent a later valid write", async () => {
  await withDatabase(async (database) => {
    await withApi(database, async (base) => {
      const bad = await request(base, "/api/reservations", {
        method: "POST", headers: { "content-type": "application/json" }, body: '{"code":',
      });
      assert.equal(bad.status, 400);
      const good = await request(base, "/api/reservations", postJson({ code: "NEXT-1", guestName: "Ada", seats: 1 }));
      assert.equal(good.status, 201);
      assert.equal(await database.Reservation.count(), 1);
    });
  });
});
