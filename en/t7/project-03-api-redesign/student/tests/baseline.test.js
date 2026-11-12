import assert from "node:assert/strict";
import test from "node:test";
import { createNaiveActionRouter } from "../src/naive-action-router.js";
import { createRegistrationService } from "../src/registration-service.js";
import { withApi } from "./helpers.js";

test("supplied service, naive evidence, and app infrastructure work independently", async () => {
  const service = createRegistrationService();
  assert.equal((await service.list({ sessionId: "1", limit: 20, offset: 0 })).count, 1);
  assert.deepEqual(createNaiveActionRouter({ service }).stack.map((layer) => layer.route.path), ["/register", "/unregister"]);
  await withApi(service, async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/health`)).status, 200); assert.equal((await fetch(`${baseUrl}/`)).status, 200);
  });
});
