import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { createReportPipeline } from "../src/report-pipeline.js";
import { createDependencies, postJson, withApp } from "./helpers.js";

test("datele valide primesc identitate, timp, normalizare și un singur log", async () => {
  const harness = createDependencies();
  const created = [];
  await withApp(async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/reports`,
      postJson(
        { summary: "  Inspectează middleware-ul  ", severity: "high" },
        { "x-request-id": " caller-7 " },
      ),
    );
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("x-request-id"), "caller-7");
    assert.equal(response.headers.get("x-response-time-ms"), "10");
    assert.deepEqual((await response.json()).data, {
      id: "report-1",
      summary: "Inspectează middleware-ul",
      severity: "high",
    });
  }, { dependencies: harness.dependencies, onCreate: (body) => created.push(body) });

  assert.equal(harness.calls.id, 0);
  assert.equal(harness.calls.clock, 2);
  assert.equal(created.length, 1);
  assert.equal(Object.isFrozen(created[0]), true);
  assert.deepEqual(harness.logs, [{
    requestId: "caller-7",
    method: "POST",
    path: "/api/reports",
    status: 201,
    durationMs: 10,
    outcome: "completed",
  }]);
});

test("identitatea lipsă este generată o singură dată", async () => {
  const harness = createDependencies();
  await withApp(async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/api/reports`,
      postJson({ summary: "Identitate generată", severity: "medium" }),
    );
    assert.equal(response.headers.get("x-request-id"), "generated-1");
  }, { dependencies: harness.dependencies });
  assert.equal(harness.calls.id, 1);
  assert.equal(harness.logs[0].requestId, "generated-1");
});

test("erorile tipului media și câmpurilor opresc fluxul, dar sunt înregistrate", async () => {
  const harness = createDependencies();
  let handlerCalls = 0;
  await withApp(async (baseUrl) => {
    const wrongMedia = await fetch(`${baseUrl}/api/reports`, {
      method: "POST",
      body: '{"summary":"x","severity":"low"}',
    });
    assert.equal(wrongMedia.status, 415);
    assert.equal((await wrongMedia.json()).error.code, "json_required");

    const invalid = await fetch(
      `${baseUrl}/api/reports`,
      postJson({ summary: " ", severity: "urgent" }),
    );
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error.code, "validation_failed");
  }, {
    dependencies: harness.dependencies,
    onCreate: () => { handlerCalls += 1; },
  });

  assert.equal(handlerCalls, 0);
  assert.deepEqual(harness.logs.map(({ status }) => status), [415, 400]);
  assert.deepEqual(harness.logs.map(({ outcome }) => outcome), ["completed", "completed"]);
});

test("close înainte de finish înregistrează o singură întrerupere", () => {
  const harness = createDependencies();
  const [observe] = createReportPipeline(harness.dependencies);
  const response = new EventEmitter();
  response.statusCode = 200;
  response.writableFinished = false;
  response.setHeader = () => {};
  response.writeHead = () => response;
  const request = {
    method: "POST",
    path: "/api/reports",
    get: () => undefined,
  };

  let delegated = false;
  observe(request, response, () => { delegated = true; });
  response.emit("close");
  response.emit("finish");

  assert.equal(delegated, true);
  assert.equal(harness.logs.length, 1);
  assert.equal(harness.logs[0].outcome, "aborted");
  assert.equal(harness.calls.id, 1);
  assert.equal(harness.calls.clock, 2);
});
