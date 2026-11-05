import assert from "node:assert/strict";
import test from "node:test";
import { createReservation } from "../src/reservation-store.js";
import { withDatabase, withApi, request, postJson } from "./helpers.js";

test("baza reală se inițializează și permite scrieri obișnuite", async () => {
  await withDatabase(async ({ Reservation }) => {
    const created = await createReservation(Reservation, { code: "GOOD-1", guestName: "Ada", seats: 2 });
    assert.equal(created.id, 1);
    assert.equal(await Reservation.count(), 1);
  });
});

test("serverul servește health, pagina, crearea și listarea obișnuită", async () => {
  await withDatabase(async (database) => {
    await withApi(database, async (base) => {
      assert.equal((await request(base, "/health")).status, 200);
      assert.equal((await request(base, "/")).status, 200);
      const response = await request(base, "/api/reservations", postJson({ code: "LIVE-1", guestName: "Ada", seats: 2 }));
      assert.equal(response.status, 201);
      assert.equal(response.headers.get("location"), "/api/reservations/1");
      assert.equal((await response.json()).data.code, "LIVE-1");
      const list = await request(base, "/api/reservations");
      assert.equal((await list.json()).data.length, 1);
    });
  });
});
