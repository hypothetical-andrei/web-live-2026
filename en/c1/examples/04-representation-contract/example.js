/**
 * Teaching guide
 *
 * Goal: The declared media type determines how a response body should be interpreted; JSON-looking text is not automatically a JSON representation.
 *
 * Why this design: It separates resource, representation, declaration, and valid serialization without introducing a server framework.
 *
 * Follow the evidence:
 * - Media-type parameters such as `charset` do not change the base type.
 * - A JSON-looking body declared as `text/plain` remains text.
 * - Declaring `application/json` does not make malformed bytes valid JSON.
 */

import assert from "node:assert/strict";

const mediaType = (headerValue) =>
  headerValue?.split(";", 1)[0].trim().toLowerCase() ?? null;

const inspectRepresentation = ({ headers, body }) => {
  const declaredType = mediaType(headers["content-type"]);

  if (declaredType === "application/json") {
    try {
      return { declaredType, representation: "json", value: JSON.parse(body) };
    } catch {
      return { declaredType, representation: "invalid-json" };
    }
  }

  return { declaredType, representation: "text", value: body };
};

const responses = [
  {
    headers: { "content-type": "application/json; charset=utf-8" },
    body: '{"status":"ok"}',
  },
  {
    headers: { "content-type": "text/plain" },
    body: '{"status":"ok"}',
  },
  {
    headers: { "content-type": "application/json" },
    body: "not json",
  },
];

const observations = responses.map(inspectRepresentation);

assert.equal(observations[0].representation, "json");
assert.equal(observations[1].representation, "text");
assert.equal(observations[2].representation, "invalid-json");

console.table(observations);
