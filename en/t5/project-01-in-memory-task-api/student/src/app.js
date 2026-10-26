import express from "express";
import { fileURLToPath } from "node:url";
import { createTaskRepository } from "./task-repository.js";
import { createTaskRouter } from "./task-router.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));

// Keep app assembly separate from route logic so the exercise can focus on one CRUD boundary at a time.
export function createApp({ repository = createTaskRepository() } = {}) {
  const app = express();

  app.use(express.json());
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.use(express.static(publicDirectory));
  app.use("/api/tasks", createTaskRouter({ repository }));

  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "not_found", message: "Resource not found" },
    });
  });

  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error instanceof SyntaxError && error.type === "entity.parse.failed") {
      return response.status(400).json({
        error: { code: "invalid_json", message: "Request body is not valid JSON" },
      });
    }
    return response.status(500).json({
      error: { code: "internal_error", message: "Internal server error" },
    });
  });

  return app;
}
