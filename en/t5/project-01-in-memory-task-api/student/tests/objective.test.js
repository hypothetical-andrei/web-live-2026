import assert from "node:assert/strict";
import test from "node:test";
import { createTaskRepository } from "../src/task-repository.js";
import { withApi } from "./helpers.js";

const jsonRequest = (method, body) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

test("CRUD lifecycle uses deliberate REST contracts", async () => {
  await withApi(async (baseUrl) => {
    const list = await fetch(`${baseUrl}/api/tasks`);
    assert.equal(list.status, 200);
    assert.equal((await list.json()).data.length, 2);

    const created = await fetch(
      `${baseUrl}/api/tasks`,
      jsonRequest("POST", { title: "  Test the API  " }),
    );
    assert.equal(created.status, 201);
    assert.equal(created.headers.get("location"), "/api/tasks/task-3");
    assert.deepEqual(await created.json(), {
      data: { id: "task-3", title: "Test the API", completed: false },
    });

    const fetched = await fetch(`${baseUrl}/api/tasks/task-3`);
    assert.equal(fetched.status, 200);

    const updated = await fetch(
      `${baseUrl}/api/tasks/task-3`,
      jsonRequest("PATCH", { completed: true }),
    );
    assert.equal(updated.status, 200);
    assert.deepEqual((await updated.json()).data, {
      id: "task-3",
      title: "Test the API",
      completed: true,
    });

    const removed = await fetch(`${baseUrl}/api/tasks/task-3`, { method: "DELETE" });
    assert.equal(removed.status, 204);
    assert.equal(removed.headers.get("content-type"), null);
    assert.equal(await removed.text(), "");

    const missing = await fetch(`${baseUrl}/api/tasks/task-3`);
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), {
      error: { code: "task_not_found", message: "Task not found" },
    });
  });
});

test("write validation rejects bad media, shapes, fields, and values", async () => {
  await withApi(async (baseUrl) => {
    const cases = [
      [
        { method: "POST", body: '{"title":"No media"}' },
        415,
        "json_required",
      ],
      [jsonRequest("POST", []), 400, "validation_failed"],
      [jsonRequest("POST", { title: " " }), 400, "validation_failed"],
      [jsonRequest("POST", { title: "Valid", extra: true }), 400, "validation_failed"],
      [jsonRequest("PATCH", {}), 400, "validation_failed"],
      [jsonRequest("PATCH", { completed: "yes" }), 400, "validation_failed"],
    ];

    for (const [options, status, code] of cases) {
      const path = options.method === "PATCH" ? "/api/tasks/task-1" : "/api/tasks";
      const response = await fetch(`${baseUrl}${path}`, options);
      assert.equal(response.status, status);
      assert.equal((await response.json()).error.code, code);
    }

    const list = await fetch(`${baseUrl}/api/tasks`);
    assert.equal((await list.json()).data.length, 2);
  });
});

test("unexpected repository errors reach safe centralized handling", async () => {
  const repository = createTaskRepository();
  repository.list = async () => {
    throw new Error("database password should never leak");
  };

  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/tasks`);
    assert.equal(response.status, 500);
    const body = await response.json();
    assert.deepEqual(body, {
      error: { code: "internal_error", message: "Internal server error" },
    });
    assert.doesNotMatch(JSON.stringify(body), /password|stack/i);
  }, { repository });
});
