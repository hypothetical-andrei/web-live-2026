/**
 * Teaching guide
 *
 * Goal: A URL has separately observable components, and its fragment is a browser-side navigation detail rather than part of an HTTP request target.
 *
 * Why this design: Printing parsed fields replaces the vague idea of “the URL” with an inspectable data structure.
 *
 * Follow the evidence:
 * - `pathname` and `searchParams` select and parameterize a server resource.
 * - `hash` is available to client code but is omitted from the derived request target.
 * - Query decoding turns `%20` into a space without changing the original URL string.
 */

import assert from "node:assert/strict";

const address = new URL(
  "https://course.example/api/notes?owner=Ada%20Lovelace&limit=2#details",
);

const requestTarget = `${address.pathname}${address.search}`;

const parts = {
  scheme: address.protocol.slice(0, -1),
  authority: address.host,
  pathname: address.pathname,
  owner: address.searchParams.get("owner"),
  limit: Number(address.searchParams.get("limit")),
  fragment: address.hash,
  requestTarget,
};

assert.equal(parts.owner, "Ada Lovelace");
assert.equal(parts.limit, 2);
assert.equal(requestTarget, "/api/notes?owner=Ada%20Lovelace&limit=2");
assert.ok(!requestTarget.includes("#details"));

console.log(parts);
