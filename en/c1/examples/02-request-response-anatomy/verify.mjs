/**
 * Teaching guide
 *
 * Goal: verify the observable contract of the request/response anatomy target.
 * Why this design: requests cross the live HTTP boundary instead of inspecting server internals.
 * Follow the evidence: status, fields, and parsed representations must agree.
 */

import assert from "node:assert/strict";
import { startServer } from "./server.mjs";

const server = await startServer();
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

try {
  const retrieval = await fetch(`${baseUrl}/api/notes/n-7`);
  assert.equal(retrieval.status, 200);
  assert.match(retrieval.headers.get("content-type"), /^application\/json\b/);
  assert.equal(retrieval.headers.get("example-trace-id"), "trace-read-7");
  assert.deepEqual(await retrieval.json(), { id: "n-7", text: "Read diff" });

  const creation = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "Read diff" }),
  });
  assert.equal(creation.status, 201);
  assert.equal(creation.headers.get("location"), "/api/notes/n-7");
  assert.equal(creation.headers.get("example-trace-id"), "trace-create-7");
  assert.deepEqual(await creation.json(), { id: "n-7", text: "Read diff" });

  console.log("request/response contract verified through live HTTP");
} finally {
  server.closeAllConnections();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
