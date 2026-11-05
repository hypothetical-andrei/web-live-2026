// Parametrii selectează membrii; Accept alege JSON sau CSV. Urmărește ordinea
// filtrare, sortare, paginare, codificare și compară status/antete/corp pentru CRUD.
// Observă statusul, Location și ștergerea fără corp folosind un Map în memorie. Crearea
// presupune date valide; validarea urmează în exemplele următoare.
import express from "express";
import { selectTasks, nextPageLink, toCsv } from "./collection.js";

export function createApp() {
  const app = express();
  const tasks = new Map([["t-1", { id: "t-1", title: "Examinează semantica HTTP" }]]);
  tasks.set("t-2", { id: "t-2", title: "Agenda" });
  tasks.set("t-3", { id: "t-3", title: "Zile de curs" });
  let nextId = 4;
  app.use(express.json());

  app.get("/api/tasks", (request, response) => {
    response.vary("Accept");
    response.set("Cache-Control", "no-store");

    // Selectează pagina filtrată și ordonată înainte să codifici reprezentarea.
    const result = selectTasks([...tasks.values()], request.query);
    if (!result) {
      return response.status(400).json({ error: { code: "invalid_query" } });
    }

    // Negociază JSON sau CSV pentru aceleași sarcini selectate.
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
      : response.status(404).json({
          error: { code: "task_not_found", message: "Sarcina nu a fost găsită" },
        });
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
        .json({ error: { code: "task_not_found", message: "Sarcina nu a fost găsită" } });
    response.status(204).end();
  });
  return app;
}
