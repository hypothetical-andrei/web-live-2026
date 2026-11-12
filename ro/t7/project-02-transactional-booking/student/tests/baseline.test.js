import assert from "node:assert/strict";
import test from "node:test";
import { unsafeBookSeats } from "../src/unsafe-book-seats.js";
import { postJson, state, withApi, withDatabase } from "./helpers.js";

test("modelele și limita HTTP furnizate funcționează cu un serviciu fake", async () => {
  await withDatabase(async (database) => {
    assert.equal(database.Event.associations.bookings.associationType, "HasMany");
    await withApi(database, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/events/1/bookings`, postJson({ attendeeId: 4, seats: 2 }));
      assert.equal(response.status, 201);
    }, { book: async () => ({ booking: { id: 9 }, event: { availableSeats: 3 } }) });
  });
});

test("comparația nesigură furnizată face observabile scrierile parțiale", async () => {
  await withDatabase(async (database) => {
    await assert.rejects(unsafeBookSeats(database, { eventId: 1, attendeeId: 7, seats: 2, afterBookingCreated: async () => { throw new Error("eroare ulterioară"); } }));
    assert.deepEqual(await state(database), { availableSeats: 3, bookings: 1, audits: 0 });
  });
});
