import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import Joi from "joi";
import { buildOpenApi } from "./openapi.js";
import { operation } from "./operation.js";
import { createApp } from "./app.js";
import { createTask } from "./generated/client.js";

test("OpenAPI schemas follow Joi declarations rather than a second hard-coded shape", () => {
  const schema =
    buildOpenApi().paths[operation.path][operation.method].requestBody.content[
      "application/json"
    ].schema;
  assert.deepEqual(schema.required, ["title"]);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.title.type, "string");
  assert.equal(schema.properties.title.pattern, "\\S");
  const changed = buildOpenApi({
    ...operation,
    requestSchema: Joi.object({
      title: Joi.string().min(3).max(80).required(),
      priority: Joi.number().integer().min(0).max(5),
    })
      .unknown(false)
      .required(),
  });
  const updated =
    changed.paths[operation.path].post.requestBody.content["application/json"].schema;
  assert.equal(updated.properties.title.minLength, 3);
  assert.equal(updated.properties.title.maxLength, 80);
  assert.equal(updated.properties.priority.type, "integer");
  assert.equal(updated.properties.priority.maximum, 5);
});

test("generated specification, UI assets and client match a real HTTP operation", async () => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const published = await (await fetch(`${base}/openapi.json`)).json();
    const artifact = JSON.parse(
      await readFile(new URL("./generated/openapi.json", import.meta.url), "utf8"),
    );
    assert.deepEqual(published, artifact);
    assert.equal(published.openapi, "3.0.3");
    assert.deepEqual(published.servers, [{ url: "/" }]);
    const page = await (await fetch(`${base}/docs/`)).text();
    assert.match(page, /SwaggerUIBundle/);
    assert.match(page, /url: "\/openapi.json"/);
    assert.match(page, /href="\/client.js"/);
    for (const path of [
      "/docs/assets/swagger-ui.css",
      "/docs/assets/swagger-ui-bundle.js",
      "/client.js",
    ]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      assert.ok((await response.text()).length > 0);
    }
    assert.deepEqual(await createTask({ title: "  Generated client  " }, base), {
      data: { id: "t-1", title: "Generated client" },
    });
    for (const body of [{ title: 7 }, { title: "   " }, { title: "Task", admin: true }]) {
      await assert.rejects(
        createTask(body, base),
        (error) => error.status === 400 && error.message === "validation_failed",
      );
    }
    for (const [body, type, status, code] of [
      ["{", "application/json", 400, "invalid_json"],
      ["{}", "text/plain", 415, "unsupported_media_type"],
      [
        JSON.stringify({ title: "a".repeat(5000) }),
        "application/json",
        413,
        "payload_too_large",
      ],
    ]) {
      const response = await fetch(base + operation.path, {
        method: operation.method,
        headers: { "Content-Type": type },
        body,
      });
      assert.equal(response.status, status);
      assert.deepEqual(await response.json(), { error: { code } });
      assert.ok(published.paths[operation.path].post.responses[status]);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
