/**
 * Ghid didactic
 *
 * Obiectiv: verificarea contractului observabil al țintei pentru anatomia cererii/răspunsului.
 * Motivul structurii: cererile traversează limita HTTP reală în loc să inspecteze detaliile serverului.
 * Urmăriți dovezile: starea, câmpurile și reprezentările parsate trebuie să fie coerente.
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
  assert.deepEqual(await retrieval.json(), { id: "n-7", text: "Citiți diff-ul" });

  const creation = await fetch(`${baseUrl}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "Citiți diff-ul" }),
  });
  assert.equal(creation.status, 201);
  assert.equal(creation.headers.get("location"), "/api/notes/n-7");
  assert.equal(creation.headers.get("example-trace-id"), "trace-create-7");
  assert.deepEqual(await creation.json(), { id: "n-7", text: "Citiți diff-ul" });

  console.log("contractul cerere/răspuns a fost verificat prin HTTP real");
} finally {
  server.closeAllConnections();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
