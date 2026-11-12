import assert from "node:assert/strict";
import test from "node:test";
import { UniqueConstraintError } from "sequelize";
import { bookSeats } from "../src/book-seats.js";
import { BookingExistsError, BookingValidationError, EventNotFoundError, SoldOutError } from "../src/errors.js";
import { postJson, state, withApi, withDatabase } from "./helpers.js";

test("success commits inventory, booking, audit, detached data, and HTTP response", async () => {
  await withDatabase(async (database) => {
    let callbackTransaction;
    const result = await bookSeats(database, { eventId: 1, attendeeId: 10, seats: 2, afterBookingCreated: async ({ transaction }) => { callbackTransaction = transaction; } });
    assert.ok(callbackTransaction);
    assert.deepEqual(await state(database), { availableSeats: 3, bookings: 1, audits: 1 });
    assert.equal(result.event.availableSeats, 3); assert.equal(result.booking.get, undefined);
    await withApi(database, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/events/1/bookings`, postJson({ attendeeId: 11, seats: 1 }));
      assert.equal(response.status, 201); assert.equal(response.headers.get("location"), "/api/bookings/2");
      assert.equal((await response.json()).data.event.availableSeats, 2);
    });
  });
});

test("invalid, missing, sold-out, and duplicate outcomes preserve state", async () => {
  await withDatabase(async (database) => {
    const before = await state(database);
    await assert.rejects(bookSeats(database, { eventId: 1, attendeeId: 1, seats: 0 }), BookingValidationError);
    await assert.rejects(bookSeats(database, { eventId: 99, attendeeId: 1, seats: 1 }), EventNotFoundError);
    await assert.rejects(bookSeats(database, { eventId: 1, attendeeId: 1, seats: 6 }), SoldOutError);
    assert.deepEqual(await state(database), before);
    await bookSeats(database, { eventId: 1, attendeeId: 1, seats: 1 });
    const committed = await state(database);
    await assert.rejects(bookSeats(database, { eventId: 1, attendeeId: 1, seats: 1 }), BookingExistsError);
    assert.deepEqual(await state(database), committed);
  });
});

test("callback and audit failures roll back every intermediate write", async () => {
  await withDatabase(async (database) => {
    const callbackError = new Error("callback failed");
    await assert.rejects(bookSeats(database, { eventId: 1, attendeeId: 2, seats: 2, afterBookingCreated: async () => { throw callbackError; } }), (error) => error === callbackError);
    assert.deepEqual(await state(database), { availableSeats: 5, bookings: 0, audits: 0 });
    const originalCreate = database.BookingAudit.create;
    const auditError = new Error("audit failed");
    database.BookingAudit.create = async () => { throw auditError; };
    await assert.rejects(bookSeats(database, { eventId: 1, attendeeId: 2, seats: 2 }), (error) => error === auditError);
    database.BookingAudit.create = originalCreate;
    assert.deepEqual(await state(database), { availableSeats: 5, bookings: 0, audits: 0 });
  });
});

test("every database operation receives the one managed transaction", async () => {
  await withDatabase(async (database) => {
    const seen = [];
    for (const [target, name] of [[database.Event, "findByPk"], [database.Booking, "findOne"], [database.Booking, "create"], [database.BookingAudit, "create"]]) {
      const original = target[name];
      target[name] = function (...args) { seen.push(args.at(-1)?.transaction); return original.apply(this, args); };
    }
    let callbackTransaction;
    await bookSeats(database, { eventId: 1, attendeeId: 3, seats: 1, afterBookingCreated: async ({ transaction }) => { callbackTransaction = transaction; } });
    assert.equal(seen.length, 4); assert.ok(seen.every((transaction) => transaction === callbackTransaction));
  });
});

test("only unique races are translated", async () => {
  const unique = new UniqueConstraintError({ errors: [] });
  const other = new Error("database offline");
  for (const [error, Expected] of [[unique, BookingExistsError], [other, Error]]) {
    const database = { sequelize: { transaction: async (run) => run({}) }, Event: { findByPk: async () => ({ availableSeats: 2, save: async () => {}, get: () => ({}) }) }, Booking: { findOne: async () => null, create: async () => { throw error; } }, BookingAudit: {} };
    await assert.rejects(bookSeats(database, { eventId: 1, attendeeId: 1, seats: 1 }), (caught) => Expected === Error ? caught === other : caught instanceof Expected);
  }
});
