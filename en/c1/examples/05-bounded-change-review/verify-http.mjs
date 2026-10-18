/**
 * Teaching guide
 *
 * Goal: demonstrate the small verification script an AI agent may propose for an HTTP contract.
 * Why this design: it observes the live public boundary without importing route implementation.
 * Follow the evidence: creation requires 201, Location, JSON Content-Type, and the expected body.
 */

import assert from "node:assert/strict";
import { startServer } from "./server.mjs";

const server = await startServer();
const { port } = server.address();

try {
  const response = await fetch(`http://127.0.0.1:${port}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "Read diff" }),
  });

  assert.equal(response.status, 201, "creation must report 201 Created");
  assert.equal(response.headers.get("location"), "/api/notes/n-7");
  assert.match(response.headers.get("content-type"), /^application\/json\b/);
  assert.deepEqual(await response.json(), { id: "n-7", text: "Read diff" });
  console.log("focused HTTP creation check passed");
} finally {
  server.closeAllConnections();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
