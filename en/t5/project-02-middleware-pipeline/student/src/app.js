import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import express from "express";
import { createReportPipeline } from "./report-pipeline.js";

const defaultDependencies = {
  clock: { now: () => Math.round(performance.now()) },
  createRequestId: randomUUID,
  logger: { info: (entry) => console.log(JSON.stringify(entry)) },
};

// The app stays small on purpose so the middleware chain remains the main teaching surface.
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
