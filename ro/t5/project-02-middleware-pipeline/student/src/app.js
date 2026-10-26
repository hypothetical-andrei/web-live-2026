import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import express from "express";
import { createReportPipeline } from "./report-pipeline.js";

const defaultDependencies = {
  clock: { now: () => Math.round(performance.now()) },
  createRequestId: randomUUID,
  logger: { info: (entry) => console.log(JSON.stringify(entry)) },
};

// Aplicația rămâne intenționat mică pentru ca lanțul de middleware să fie suprafața principală de studiu.
export function createApp({
  dependencies = defaultDependencies,
  pipeline,
  onCreate = () => {},
} = {}) {
  const app = express();
  let nextId = 1;
  const reportPipeline = pipeline ?? createReportPipeline(dependencies);

  app.use(express.json());
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.post("/api/reports", ...reportPipeline, (request, response) => {
    onCreate(request.body);
    response.status(201).json({
      data: { id: `report-${nextId++}`, ...request.body },
    });
  });

  app.use((_request, response) => {
    response.status(404).json({
      error: { code: "not_found", message: "Resursa nu a fost găsită" },
    });
  });

  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error instanceof SyntaxError && error.type === "entity.parse.failed") {
      return response.status(400).json({
        error: { code: "invalid_json", message: "Body-ul cererii nu este JSON valid" },
      });
    }
    return response.status(500).json({
      error: { code: "internal_error", message: "Eroare internă a serverului" },
    });
  });

  return app;
}
