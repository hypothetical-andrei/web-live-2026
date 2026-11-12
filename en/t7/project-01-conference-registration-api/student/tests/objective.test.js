import assert from "node:assert/strict";
import test from "node:test";
import { ValidationError } from "sequelize";
import {
  listSessionsWithRegistrations,
  registerAttendee,
} from "../src/conference-model.js";
import {
  ConferenceEntityNotFoundError,
  RegistrationExistsError,
} from "../src/errors.js";
import { postJson, withApi, withDatabase } from "./helpers.js";

test("association metadata and junction constraints match the model", async () => {
  await withDatabase(async ({ models }) => {
    assert.equal(models.Conference.associations.sessions.associationType, "HasMany");
    assert.equal(models.Session.associations.conference.associationType, "BelongsTo");
    assert.equal(models.Session.associations.attendees.associationType, "BelongsToMany");
    assert.equal(models.Session.associations.attendees.foreignKey, "sessionId");
    assert.equal(models.Session.associations.attendees.otherKey, "attendeeId");
    assert.equal(models.Attendee.associations.sessions.foreignKey, "attendeeId");
    assert.equal(models.Registration.rawAttributes.sessionId.allowNull, false);
    assert.equal(models.Registration.rawAttributes.attendeeId.allowNull, false);
    assert.equal(models.Session.rawAttributes.conferenceId.allowNull, false);
    await assert.rejects(
      models.Registration.create({ sessionId: 1, attendeeId: 1, ticketType: "vip" }),
      ValidationError,
    );
  });
});

test("eager query returns deterministic sessions, attendees, and through data", async () => {
  const sql = [];
  await withDatabase(async ({ models }) => {
    sql.length = 0;
    const sessions = await listSessionsWithRegistrations(models, { conferenceId: 1 });
    assert.deepEqual(sessions.map(({ id }) => id), [2, 1]);
    assert.deepEqual(sessions[0].attendees.map(({ id }) => id), [1, 2]);
    assert.equal(sessions[0].attendees[0].Registration.ticketType, "student");
    assert.equal(sessions[0].attendees[1].Registration.ticketType, "speaker");
    assert.equal(sql.filter((statement) => /^Executing .*SELECT/i.test(statement)).length, 1);
  }, { logging: (statement) => sql.push(statement) });
});

test("registration handles success, duplicates, missing parents, and detached data", async () => {
  await withDatabase(async ({ models }) => {
    const created = await registerAttendee(models, { sessionId: 1, attendeeId: 1, ticketType: "standard" });
    assert.equal(created.ticketType, "standard");
    assert.equal(typeof created.get, "undefined");
    await assert.rejects(
      registerAttendee(models, { sessionId: 1, attendeeId: 1, ticketType: "standard" }),
      RegistrationExistsError,
    );
    await assert.rejects(
      registerAttendee(models, { sessionId: 99, attendeeId: 1, ticketType: "standard" }),
      (error) => error instanceof ConferenceEntityNotFoundError && error.code === "session_not_found",
    );
    await assert.rejects(
      registerAttendee(models, { sessionId: 1, attendeeId: 99, ticketType: "standard" }),
      (error) => error instanceof ConferenceEntityNotFoundError && error.code === "attendee_not_found",
    );
  });
});

test("cascade deletion removes sessions and junction rows", async () => {
  await withDatabase(async ({ models }) => {
    assert.equal(await models.Registration.count(), 2);
    await models.Conference.destroy({ where: { id: 1 } });
    assert.equal(await models.Session.count(), 0);
    assert.equal(await models.Registration.count(), 0);
  });
});

test("live API exposes eager data and registration statuses", async () => {
  await withDatabase(async (database) => {
    await withApi(database, async (baseUrl) => {
      const list = await fetch(`${baseUrl}/api/conferences/1/sessions`);
      const body = await list.json();
      assert.deepEqual(body.data.map(({ id }) => id), [2, 1]);
      const created = await fetch(`${baseUrl}/api/sessions/1/registrations`, postJson({ attendeeId: 1, ticketType: "standard" }));
      assert.equal(created.status, 201);
      assert.equal(created.headers.get("location"), "/api/sessions/1/registrations/1");
      const duplicate = await fetch(`${baseUrl}/api/sessions/1/registrations`, postJson({ attendeeId: 1, ticketType: "standard" }));
      assert.equal(duplicate.status, 409);
    });
  });
});
