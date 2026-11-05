// Classify only errors deliberately created for public display; arbitrary status
// properties are not a trust signal.
import express from "express";

class PublicError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function createApp({ log = () => {} } = {}) {
  const app = express();
  app.use(express.json({ limit: "4kb" }));
  app.get("/api/tasks/:taskId", (_request, _response, next) => {
    return next(new PublicError(404, "task_not_found", "Task not found"));
  });
  app.get("/api/failure", () => {
    throw new Error("database password=secret");
  });
  app.get("/api/async-failure", async () => {
    await Promise.resolve();
    throw new Error("database password=secret");
  });
  app.get("/api/untrusted-error", () => {
    throw Object.assign(new Error("database password=secret"), {
      status: 400,
      code: "secret_code",
    });
  });
  app.get("/api/partial-failure", async (_request, response) => {
    response.write("partial response\n");
    await new Promise((resolve) => setTimeout(resolve, 10));
    throw new Error("failure after headers");
  });
  app.post("/api/tasks", (_request, response) => response.status(201).json({ data: {} }));
  app.use((_request, _response, next) =>
    next(new PublicError(404, "route_not_found", "Route not found")),
  );

  app.use((error, _request, response, next) => {
    log(error);
    // After a partial response, Express must close/delegate; JSON cannot replace the
    // bytes already sent.
    if (response.headersSent) return next(error);
    if (error?.type === "entity.parse.failed") {
      return response
        .status(400)
        .json({
          error: { code: "invalid_json", message: "Request body is not valid JSON" },
        });
    }
    if (error?.type === "entity.too.large") {
      return response
        .status(413)
        .json({
          error: { code: "payload_too_large", message: "Request body is too large" },
        });
    }
    if (error instanceof PublicError) {
      return response
        .status(error.status)
        .json({ error: { code: error.code, message: error.message } });
    }
    return response
      .status(500)
      .json({ error: { code: "internal_error", message: "Internal server error" } });
  });
  return app;
}
