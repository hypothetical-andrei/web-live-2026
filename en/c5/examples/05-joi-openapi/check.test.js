import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "./app.js";
import { validateManually, validateWithJoi } from "./validation.js";

test("Joi preserves the manual type, unknown-field, and normalization rules", () => {
  for (const input of [
    undefined,
    null,
    [],
    "text",
    42,
    {},
    { title: 7 },
    { title: false },
    { title: "" },
    { title: "   " },
    { title: "Task", admin: true },
    { title: "  Task  " },
  ]) {
    const before = JSON.stringify(input);
    assert.deepEqual(validateWithJoi(input), validateManually(input));
    assert.equal(JSON.stringify(input), before);
  }
  assert.deepEqual(validateWithJoi({ title: "  Task  " }), {
    ok: true,
    value: { title: "Task" },
  });
});

test("the described operation distinguishes parsing, validation, size and media failures", async () => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, type = "application/json") =>
    fetch(`${base}/api/tasks`, {
      method: "POST",
      headers: { "content-type": type },
      body,
    });
  try {
    const spec = await (await fetch(`${base}/openapi.json`)).json();
    assert.equal(spec.openapi, "3.1.1");
    const operation = spec.paths["/api/tasks"].post;
    assert.equal(
      operation.requestBody.content["application/json"].schema.additionalProperties,
      false,
    );
    for (const [body, type, status, code] of [
      ["{}", "text/plain", 415, "unsupported_media_type"],
      ["{", "application/json", 400, "invalid_json"],
      ["[]", "application/json", 400, "validation_failed"],
      ["null", "application/json", 400, "validation_failed"],
      ['{"title":12}', "application/json", 400, "validation_failed"],
      ['{"title":"   "}', "application/json", 400, "validation_failed"],
      ['{"title":"Task","admin":true}', "application/json", 400, "validation_failed"],
      [
        JSON.stringify({ title: "a".repeat(5000) }),
        "application/json",
        413,
        "payload_too_large",
      ],
    ]) {
      const response = await post(body, type);
      assert.equal(response.status, status);
      assert.deepEqual(await response.json(), { error: { code } });
      assert.ok(operation.responses[status]);
    }
    const created = await post('{"title":"  Task  "}');
    assert.equal(created.status, 201);
    assert.equal(created.headers.get("location"), "/api/tasks/t-1");
    assert.deepEqual(await created.json(), { data: { id: "t-1", title: "Task" } });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
