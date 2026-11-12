import assert from "node:assert/strict";
import test from "node:test";
import { createRegistrationRouter } from "../src/registration-router.js";
import { createRegistrationService } from "../src/registration-service.js";
import { json, withApi } from "./helpers.js";

test("router inventory contains only the three nested resource operations", () => {
  const router = createRegistrationRouter({ service: {} });
  assert.deepEqual(router.stack.map((layer) => [layer.route.path, Object.keys(layer.route.methods)]), [["/", ["get"]], ["/:attendeeId", ["put"]], ["/:attendeeId", ["delete"]]]);
});

test("GET translates defaults, filter, and pagination", async () => {
  const calls = []; const service = { list: async (input) => { calls.push(input); return { data: [{ ticketType: "student" }], count: 7 }; } };
  await withApi(service, async (baseUrl) => {
    let response = await fetch(`${baseUrl}/api/sessions/8/registrations`); assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).page, { limit: 20, offset: 0, count: 7 });
    response = await fetch(`${baseUrl}/api/sessions/8/registrations?ticketType=student&limit=5&offset=10`); assert.equal(response.status, 200);
    assert.deepEqual(calls[1], { sessionId: "8", ticketType: "student", limit: 5, offset: 10 });
  });
});

test("GET rejects the closed query language before service calls", async () => {
  const invalid = ["x=1", "ticketType=", "ticketType=vip", "limit=0", "limit=51", "limit=01", "limit=2.0", "offset=-1", "offset=", "limit=2&limit=3"];
  let calls = 0; const service = { list: async () => { calls += 1; } };
  await withApi(service, async (baseUrl) => {
    for (const query of invalid) { const response = await fetch(`${baseUrl}/api/sessions/1/registrations?${query}`); assert.equal(response.status, 400, query); assert.equal((await response.json()).error.code, "invalid_query"); }
  });
  assert.equal(calls, 0);
});

test("PUT derives identity from paths and maps create, repeat, and update", async () => {
  const service = createRegistrationService();
  await withApi(service, async (baseUrl) => {
    const url = `${baseUrl}/api/sessions/1/registrations/11`;
    let response = await fetch(url, json("PUT", { ticketType: "student" })); assert.equal(response.status, 201); assert.equal(response.headers.get("location"), "/api/sessions/1/registrations/11");
    assert.deepEqual((await response.json()).data, { sessionId: "1", attendeeId: "11", ticketType: "student", registeredAt: "2026-08-10T10:00:00.000Z" });
    response = await fetch(url, json("PUT", { ticketType: "student" })); assert.equal(response.status, 200);
    response = await fetch(url, json("PUT", { ticketType: "speaker" })); assert.equal(response.status, 200); assert.equal((await response.json()).data.ticketType, "speaker");
  });
});

test("PUT validation, DELETE idempotency, domain errors, and sanitized failures are stable", async () => {
  const service = createRegistrationService();
  await withApi(service, async (baseUrl) => {
    const member = `${baseUrl}/api/sessions/1/registrations/10`;
    assert.equal((await fetch(member, { method: "PUT", body: "x" })).status, 415);
    assert.equal((await fetch(member, json("PUT", { ticketType: "vip" }))).status, 400);
    assert.equal((await fetch(member, json("PUT", { ticketType: "student", attendeeId: "12" }))).status, 400);
    assert.equal((await fetch(`${baseUrl}/api/sessions/99/registrations/10`, json("PUT", { ticketType: "student" }))).status, 404);
    assert.equal((await fetch(`${baseUrl}/api/sessions/1/registrations/99`, json("PUT", { ticketType: "student" }))).status, 404);
    let response = await fetch(member, { method: "DELETE" }); assert.equal(response.status, 204); assert.equal(await response.text(), "");
    response = await fetch(member, { method: "DELETE" }); assert.equal(response.status, 204); assert.equal(response.headers.get("content-type"), null);
  });
  await withApi({ list: async () => { throw new Error("secret"); } }, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/sessions/1/registrations`); assert.equal(response.status, 500); assert.doesNotMatch(await response.text(), /secret/);
  });
});
