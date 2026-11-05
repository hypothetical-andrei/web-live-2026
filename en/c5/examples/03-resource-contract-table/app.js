// Collection queries select members; Accept chooses JSON or CSV. Follow the order
// filter, sort, page, then encode, and compare status/headers/body for CRUD.
// Observe status, Location, and bodyless deletion over an in-memory Map. Creation assumes
// valid input; validation is introduced next.
import express from "express";
import { selectTasks, nextPageLink, toCsv } from "./collection.js";

export function createApp() {
  const app = express();
  const tasks = new Map([["t-1", { id: "t-1", title: "Inspect HTTP semantics" }]]);
  tasks.set("t-2", { id: "t-2", title: "Agenda" });
  tasks.set("t-3", { id: "t-3", title: "Zoom notes" });
  let nextId = 4;
  app.use(express.json());

  app.get("/api/tasks", (request, response) => {
    response.vary("Accept");
    response.set("Cache-Control", "no-store");

    // Select the matching, ordered page before encoding its representation.
    const result = selectTasks([...tasks.values()], request.query);
    if (!result) {
      return response.status(400).json({ error: { code: "invalid_query" } });
    }

    // Negotiate JSON or CSV for the same selected tasks.
    const format = request.accepts(["application/json", "text/csv"]);
    if (!format) {
      return response.status(406).json({ error: { code: "not_acceptable" } });
    }

    const next = nextPageLink(request.originalUrl, result.meta);
    if (next) {
      response.set("Link", next);
    }

    if (format === "text/csv") {
      return response.type("text/csv").send(toCsv(result.data));
    }

    return response.json(result);
  });

  app.get("/api/tasks/:taskId", (request, response) => {
    const task = tasks.get(request.params.taskId);
    return task
      ? response.json({ data: task })
      : response
          .status(404)
          .json({ error: { code: "task_not_found", message: "Task not found" } });
  });
  app.post("/api/tasks", (request, response) => {
    const task = { id: `t-${nextId++}`, title: request.body.title };
    tasks.set(task.id, task);
    response.location(`/api/tasks/${task.id}`).status(201).json({ data: task });
  });
  app.delete("/api/tasks/:taskId", (request, response) => {
    if (!tasks.delete(request.params.taskId))
      return response
        .status(404)
        .json({ error: { code: "task_not_found", message: "Task not found" } });
    response.status(204).end();
  });
  return app;
}
