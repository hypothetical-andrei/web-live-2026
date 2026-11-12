import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createRegistrationService } from "../src/registration-service.js";
import { withApi } from "./helpers.js";

test("health, static, unknown route, and malformed JSON remain healthy", async () => {
  await withApi(createRegistrationService(), async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/health`)).status, 200); assert.equal((await fetch(`${baseUrl}/`)).status, 200); assert.equal((await fetch(`${baseUrl}/register`)).status, 404);
    const malformed = await fetch(`${baseUrl}/api/sessions/1/registrations/10`, { method: "PUT", headers: { "content-type": "application/json" }, body: "{" }); assert.equal(malformed.status, 400);
  });
});

test("naive evidence is unmounted and objective router contains no actions or ORM", async () => {
  const app = await readFile(new URL("../src/app.js", import.meta.url), "utf8"); const router = await readFile(new URL("../src/registration-router.js", import.meta.url), "utf8");
  assert.doesNotMatch(app, /naive-action-router|register|unregister/); assert.doesNotMatch(router, /sequelize|RegistrationModel|SELECT\s|\/register|\/unregister/i);
});
