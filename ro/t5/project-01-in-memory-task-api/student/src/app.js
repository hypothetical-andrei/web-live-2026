import express from "express";
import { fileURLToPath } from "node:url";
import { createTaskRepository } from "./task-repository.js";
import { createTaskRouter } from "./task-router.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));

// Ținem asamblarea aplicației separată de logica rutelor pentru ca exercițiul să se concentreze pe un singur boundary CRUD.
export function createApp({ repository = createTaskRepository() } = {}) {
  const app = express();

  app.use(express.json());
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.use(express.static(publicDirectory));
  app.use("/api/tasks", createTaskRouter({ repository }));

  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "not_found", message: "Resursa nu a fost găsită" },
    });
  });

  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error instanceof SyntaxError && error.type === "entity.parse.failed") {
      return response.status(400).json({
        error: { code: "invalid_json", message: "Corpul cererii nu este JSON valid" },
      });
    }
    return response.status(500).json({
      error: { code: "internal_error", message: "Eroare internă a serverului" },
    });
  });

  return app;
}
