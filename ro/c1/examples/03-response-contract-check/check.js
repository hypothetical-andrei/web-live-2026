/**
 * Ghid didactic
 *
 * Obiectiv: verificările din execuție transformă afirmațiile despre contractul HTTP în dovezi; crearea, validarea eșuată și eroarea neașteptată cer stări și forme diferite.
 *
 * Motivul structurii: modelează verificarea făcută după propunerea descriptorilor de către un agent AI, fără alt server HTTP.
 *
 * Urmăriți dovezile:
 * - Crearea folosește `201` și identifică resursa creată.
 * - Eroarea clientului folosește o stare 4xx și un cod stabil, citibil de program.
 * - Verificarea respinge un răspuns `200` plauzibil vizual, dar incorect semantic.
 */

import assert from "node:assert/strict";
import { responses } from "./responses.js";

assert.equal(responses.created.status, 201);
assert.equal(responses.created.headers.location, "/api/notes/n-7");
assert.deepEqual(responses.created.body.data, {
  id: "n-7",
  text: "Citiți diff-ul",
});

assert.equal(responses.invalid.status, 400);
assert.equal(responses.invalid.body.error.code, "text_required");

assert.equal(responses.missing.status, 404);
assert.equal(responses.missing.body.error.code, "note_not_found");

for (const response of Object.values(responses)) {
  assert.equal(response.headers["content-type"], "application/json");
}

console.log(`${Object.keys(responses).length} contracte de răspuns verificate`);
