/**
 * Ghid didactic
 *
 * Obiectiv: un URL are componente observabile separat, iar fragmentul este un detaliu de navigare al browserului, nu o parte a țintei cererii HTTP.
 *
 * Motivul structurii: afișarea câmpurilor parsate înlocuiește ideea vagă de „URL” cu o structură de date inspectabilă.
 *
 * Urmăriți dovezile:
 * - `pathname` și `searchParams` selectează și parametrizează o resursă a serverului.
 * - `hash` este disponibil codului clientului, dar este omis din ținta derivată.
 * - Decodificarea query-ului transformă `%20` în spațiu fără să schimbe URL-ul original.
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
