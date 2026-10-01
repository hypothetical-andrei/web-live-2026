/**
 * Ghid didactic
 *
 * Obiectiv: tipul media declarat determină interpretarea corpului; textul care seamănă cu JSON nu devine automat o reprezentare JSON.
 *
 * Motivul structurii: separă resursa, reprezentarea, declarația și serializarea validă fără un framework de server.
 *
 * Urmăriți dovezile:
 * - Parametrii tipului media, precum `charset`, nu schimbă tipul de bază.
 * - Un corp care seamănă cu JSON, declarat `text/plain`, rămâne text.
 * - Declararea `application/json` nu transformă octeții incorecți în JSON valid.
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
