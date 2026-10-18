/**
 * Ghid didactic
 *
 * Obiectiv: `fetch` se îndeplinește când sosește un răspuns HTTP, inclusiv pentru `404`; codul aplicației trebuie să clasifice explicit starea răspunsului.
 *
 * Motivul acestei structuri: un fetch determinist injectat separă stabilirea la nivel de rețea de rezultatul HTTP fără dependență de server sau de timpul internetului.
 *
 * Urmăriți dovezile:
 * - Răspunsul `404` simulat este livrat de o promisiune îndeplinită.
 * - `loadJson` transformă un răspuns HTTP fără succes într-o eroare a aplicației.
 * - Parsarea JSON are loc numai după ce politica de stare acceptă răspunsul.
 */

import assert from "node:assert/strict";

const loadJson = async (url, fetchImpl) => {
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`request failed: ${url} (${response.status})`);
  }

  return response.json();
};

const fakeFetch = async (url) => {
  if (url === "/api/tasks") {
    return {
      ok: true,
      status: 200,
      json: async () => [{ id: "t-1", title: "Inspectați starea" }],
    };
  }

  return {
    ok: false,
    status: 404,
    json: async () => ({ error: "not_found" }),
  };
};

assert.deepEqual(await loadJson("/api/tasks", fakeFetch), [
  { id: "t-1", title: "Inspectați starea" },
]);
await assert.rejects(
  loadJson("/api/missing", fakeFetch),
  /request failed: \/api\/missing \(404\)/,
);

const fulfilled404 = await fakeFetch("/api/missing");
assert.equal(fulfilled404.status, 404);

console.log({ fulfilled404: true, status: fulfilled404.status });
