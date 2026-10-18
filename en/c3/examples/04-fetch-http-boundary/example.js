/**
 * Teaching guide
 *
 * Goal: `fetch` fulfills when an HTTP response arrives, including for `404`; application code must classify the response status explicitly.
 *
 * Why this design: An injected deterministic fetch separates network settlement from HTTP outcome without depending on a server or internet timing.
 *
 * Follow the evidence:
 * - The fake `404` response is delivered by a fulfilled promise.
 * - `loadJson` converts a non-success HTTP response into an application error.
 * - JSON parsing occurs only after the status policy accepts the response.
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
      json: async () => [{ id: "t-1", title: "Inspect status" }],
    };
  }

  return {
    ok: false,
    status: 404,
    json: async () => ({ error: "not_found" }),
  };
};

assert.deepEqual(await loadJson("/api/tasks", fakeFetch), [
  { id: "t-1", title: "Inspect status" },
]);
await assert.rejects(
  loadJson("/api/missing", fakeFetch),
  /request failed: \/api\/missing \(404\)/,
);

const fulfilled404 = await fakeFetch("/api/missing");
assert.equal(fulfilled404.status, 404);

console.log({ fulfilled404: true, status: fulfilled404.status });
