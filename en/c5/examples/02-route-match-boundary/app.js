// Distinguish method/path routing from parameter extraction and explicit query-value
// checks.
import express from "express";

const tasks = [
  { id: "t-1", title: "Learn Express routing", completed: true },
  { id: "t-2", title: "Inspect a REST response", completed: false },
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
          message: "Creation is introduced in the next example",
        },
      }),
  );

  app.get("/api/tasks/:taskId", (request, response) => {
    const task = tasks.find(({ id }) => id === request.params.taskId);
    if (!task)
      return response
        .status(404)
        .json({ error: { code: "task_not_found", message: "Task not found" } });
    response.json({ data: task });
  });

  app.use((_request, response) =>
    response
      .status(404)
      .json({ error: { code: "route_not_found", message: "Route not found" } }),
  );
  return app;
}
