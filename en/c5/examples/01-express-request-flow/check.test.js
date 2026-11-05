import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "./app.js";

test("static and API resources traverse the observer", async () => {
  const events = [];
  const server = createServer(createApp(events));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(`${baseUrl}/`);
    assert.match(await page.text(), /Static course page/);
    const api = await fetch(`${baseUrl}/api/ping`);
    assert.deepEqual(await api.json(), { data: { message: "pong" } });
    assert.deepEqual(events, [
      "before:/",
      "finish:/",
      "before:/api/ping",
      "route:/api/ping",
      "finish:/api/ping",
    ]);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
