import assert from "node:assert/strict";
import test from "node:test";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { createReservation } from "../src/reservation-store.js";
import { PersistenceConflictError, PersistenceValidationError } from "../src/errors.js";
import { withDatabase, withApi, request, postJson } from "./helpers.js";

const valid = { code: "GOOD-1", guestName: "Ada", seats: 2 };

test("câmpurile obligatorii sunt verificate la scrieri directe prin model", async () => {
  await withDatabase(async ({ Reservation }) => {
    for (const field of ["code", "guestName", "seats"]) {
      await assert.rejects(Reservation.create({ ...valid, [field]: null }));
    }
    await assert.rejects(Reservation.create({ ...valid, guestName: "   " }));
    assert.equal(await Reservation.count(), 0);
  });
});

test("formatul codului este verificat sub stratul HTTP", async () => {
  await withDatabase(async ({ Reservation }) => {
    for (const code of ["bad", "AB", "BAD!CODE", "A".repeat(17)]) {
      await assert.rejects(Reservation.create({ ...valid, code }));
    }
    assert.equal(await Reservation.count(), 0);
  });
});

test("locurile trebuie să fie un întreg în intervalul acceptat", async () => {
  await withDatabase(async ({ Reservation }) => {
    for (const seats of [0, 9, 1.5]) {
      await assert.rejects(Reservation.create({ ...valid, seats }));
    }
    assert.equal(await Reservation.count(), 0);
  });
});

test("normalizarea afectează valorile stocate", async () => {
  await withDatabase(async ({ Reservation }) => {
    const created = await createReservation(Reservation, { code: "  GOOD-1  ", guestName: "  Ada  ", seats: 2 });
    const stored = await Reservation.findByPk(created.id);
    assert.equal(stored.code, "GOOD-1");
    assert.equal(stored.guestName, "Ada");
  });
});

test("codurile duplicate sunt respinse fără inserarea altui rând", async () => {
  await withDatabase(async ({ Reservation }) => {
    await Reservation.create(valid);
    await assert.rejects(Reservation.create({ ...valid, guestName: "Grace" }));
    assert.equal(await Reservation.count(), 1);
  });
});

test("stocarea returnează date simple independente după finalizarea scrierii", async () => {
  await withDatabase(async ({ Reservation }) => {
    const created = await createReservation(Reservation, valid);
    assert.equal(Object.getPrototypeOf(created), Object.prototype);
    assert.equal(typeof created.get, "undefined");
    assert.equal((await Reservation.findByPk(created.id)).code, "GOOD-1");
    created.guestName = "Changed return value";
    assert.equal((await Reservation.findByPk(created.id)).guestName, "Ada");
  });
});

test("respingerile ulterioare devin erorile cunoscute ale aplicației", async () => {
  for (const [failure, expected] of [
    [new UniqueConstraintError({ message: "duplicate" }), PersistenceConflictError],
    [new ValidationError("invalid"), PersistenceValidationError],
  ]) {
    const model = { create: () => new Promise((_resolve, reject) => queueMicrotask(() => reject(failure))) };
    await assert.rejects(createReservation(model, valid), (error) => error instanceof expected);
  }
});

test("scrierile HTTP invalide și duplicate folosesc erorile publice documentate", async () => {
  await withDatabase(async (database) => {
    await withApi(database, async (base) => {
      const invalid = await request(base, "/api/reservations", postJson({ code: "x", guestName: "", seats: 0 }));
      assert.equal(invalid.status, 400);
      assert.equal((await invalid.json()).error.code, "reservation_invalid");
      assert.equal(await database.Reservation.count(), 0);
      assert.equal((await request(base, "/api/reservations", postJson(valid))).status, 201);
      const duplicate = await request(base, "/api/reservations", postJson(valid));
      assert.equal(duplicate.status, 409);
      assert.equal((await duplicate.json()).error.code, "reservation_exists");
      assert.equal(await database.Reservation.count(), 1);
    });
  });
});
