// Distinge rutarea după metodă și cale de extragerea parametrilor și verificarea
// explicită a valorilor din interogare.
import express from "express";

const tasks = [
  { id: "t-1", title: "Învață rutarea Express", completed: true },
  { id: "t-2", title: "Examinează un răspuns REST", completed: false },
];

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/api/tasks", (request, response) => {
    const completed = request.query.completed;
    if (completed !== undefined && completed !== "true" && completed !== "false") {
      return response.status(400).json({ error: { code: "invalid_completed" } });
    }
    const data =
      completed === undefined
        ? tasks
        : tasks.filter((task) => task.completed === (completed === "true"));
    response.json({ data });
  });

  app.post("/api/tasks", (_request, response) =>
    response
      .status(501)
      .json({
        error: {
          code: "not_implemented",
          message: "Crearea este introdusă în exemplul următor",
        },
      }),
  );

  app.get("/api/tasks/:taskId", (request, response) => {
    const task = tasks.find(({ id }) => id === request.params.taskId);
    if (!task)
      return response
        .status(404)
        .json({ error: { code: "task_not_found", message: "Sarcina nu a fost găsită" } });
    response.json({ data: task });
  });

  app.use((_request, response) =>
    response
      .status(404)
      .json({ error: { code: "route_not_found", message: "Ruta nu a fost găsită" } }),
  );
  return app;
}
