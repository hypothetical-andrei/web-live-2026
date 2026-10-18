/**
 * Teaching guide
 *
 * Goal: Runtime checks turn HTTP-contract claims into evidence: creation, validation failure, and unexpected failure need different statuses and response shapes.
 *
 * Why this design: It models the verification step used after an AI agent proposes response descriptors, without building another HTTP server.
 *
 * Follow the evidence:
 * - A creation result uses `201` and identifies the created resource.
 * - A client error uses a 4xx status and a stable machine-readable code.
 * - A check can reject a plausible-looking but semantically incorrect `200` response.
 */

import assert from "node:assert/strict";
import { responses } from "./responses.js";

assert.equal(responses.created.status, 201);
assert.equal(responses.created.headers.location, "/api/notes/n-7");
assert.deepEqual(responses.created.body.data, {
  id: "n-7",
  text: "Read diff",
});

assert.equal(responses.invalid.status, 400);
assert.equal(responses.invalid.body.error.code, "text_required");

assert.equal(responses.missing.status, 404);
assert.equal(responses.missing.body.error.code, "note_not_found");

for (const response of Object.values(responses)) {
  assert.equal(response.headers["content-type"], "application/json");
}

console.log(`${Object.keys(responses).length} response contracts verified`);
