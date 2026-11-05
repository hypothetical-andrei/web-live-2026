import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { createServer } from "node:http";
import { listen } from "../src/server.js";

test("supplied HTTP application works with an injected fake store", async () => {
  const now = new Date("2026-01-01T00:00:00.000Z");
  const fakeStore = {
    list: async () => [{ id: 1, title: "Fake", body: "", archived: false, createdAt: now, updatedAt: now }],
  };
  const server = createServer(createApp({ store: fakeStore }));
  const baseUrl = await listen(server);
  try {
    const page = await fetch(`${baseUrl}/`);
    assert.match(await page.text(), /Persistent Notes API/);
    const health = await fetch(`${baseUrl}/health`);
    assert.deepEqual(await health.json(), { status: "ok" });
    const list = await fetch(`${baseUrl}/api/notes`);
    assert.equal((await list.json()).data[0].createdAt, now.toISOString());
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
