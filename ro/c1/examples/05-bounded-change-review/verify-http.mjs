/**
 * Ghid didactic
 *
 * Obiectiv: demonstrarea scriptului mic de verificare pe care un agent AI îl poate propune pentru un contract HTTP.
 * Motivul structurii: observă limita publică reală fără a importa implementarea rutei.
 * Urmăriți dovezile: crearea cere 201, Location, Content-Type JSON și corpul așteptat.
 */

import assert from "node:assert/strict";
import { startServer } from "./server.mjs";

const server = await startServer();
const { port } = server.address();

try {
  const response = await fetch(`http://127.0.0.1:${port}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "Citiți diff-ul" }),
  });

  assert.equal(response.status, 201, "crearea trebuie să raporteze 201 Created");
  assert.equal(response.headers.get("location"), "/api/notes/n-7");
  assert.match(response.headers.get("content-type"), /^application\/json\b/);
  assert.deepEqual(await response.json(), { id: "n-7", text: "Citiți diff-ul" });
  console.log("verificarea HTTP focalizată pentru creare a trecut");
} finally {
  server.closeAllConnections();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
