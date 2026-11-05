import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "./app.js";

test("central Express middleware preserves public errors and sanitizes unexpected failures", async () => {
  const logged = [];
  const server = createApp({ log: (error) => logged.push(error.message) }).listen(
    0,
    "127.0.0.1",
  );
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const missing = await fetch(`${base}/api/tasks/missing`);
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).error.code, "task_not_found");
    const failure = await fetch(`${base}/api/failure`);
    const body = await failure.json();
    assert.deepEqual(body, {
      error: { code: "internal_error", message: "Internal server error" },
    });
    assert.doesNotMatch(JSON.stringify(body), /password|secret|database/);
    const malformed = await fetch(`${base}/api/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    assert.equal((await malformed.json()).error.code, "invalid_json");
    for (const path of ["/api/async-failure", "/api/untrusted-error"]) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 500);
      assert.equal((await response.json()).error.code, "internal_error");
    }
    assert.equal((await fetch(`${base}/missing`)).status, 404);
    assert.equal(
      (
        await fetch(`${base}/api/tasks`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ title: "a".repeat(5000) }),
        })
      ).status,
      413,
    );
    // The client observes an incomplete response, not a second JSON response.
    await assert.rejects(async () => {
      const response = await fetch(`${base}/api/partial-failure`);
      await response.text();
    });
    assert.ok(logged.includes("failure after headers"));
    const healthy = await fetch(`${base}/api/tasks`, { method: "POST" });
    assert.equal(healthy.status, 201);
    assert.match(logged.join(" "), /password=secret/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
