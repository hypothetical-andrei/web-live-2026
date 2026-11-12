import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "../src/app.js";
import { listen } from "../src/server.js";

test("supplied HTTP layer works with fake relationship operations", async () => {
  const fakeSession = { get: () => ({ id: 7, attendees: [] }) };
  const app = createApp({
    models: {},
    listSessions: async () => [fakeSession],
    register: async () => ({ sessionId: 7, attendeeId: 9, ticketType: "standard" }),
  });
  const server = createServer(app);
  const baseUrl = await listen(server);
  try {
    const page = await fetch(`${baseUrl}/`);
    assert.match(await page.text(), /Conference Registration API/);
    const list = await fetch(`${baseUrl}/api/conferences/1/sessions`);
    assert.deepEqual(await list.json(), { data: [{ id: 7, attendees: [] }] });
    const created = await fetch(`${baseUrl}/api/sessions/7/registrations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ attendeeId: 9, ticketType: "standard" }),
    });
    assert.equal(created.status, 201);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
