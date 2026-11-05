// Clasifică doar erorile create explicit pentru afișare publică; proprietățile status
// arbitrare nu sunt un semnal de încredere.
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
    return next(new PublicError(404, "task_not_found", "Sarcina nu a fost găsită"));
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
    next(new PublicError(404, "route_not_found", "Rută inexistentă")),
  );

  app.use((error, _request, response, next) => {
    log(error);
    // După un răspuns parțial, Express trebuie să închidă/delege; JSON nu poate înlocui
    // octeții deja trimiși.
    if (response.headersSent) return next(error);
    if (error?.type === "entity.parse.failed") {
      return response
        .status(400)
        .json({
          error: { code: "invalid_json", message: "Corpul cererii nu este JSON valid" },
        });
    }
    if (error?.type === "entity.too.large") {
      return response
        .status(413)
        .json({
          error: { code: "payload_too_large", message: "Corpul cererii este prea mare" },
        });
    }
    if (error instanceof PublicError) {
      return response
        .status(error.status)
        .json({ error: { code: error.code, message: error.message } });
    }
    return response
      .status(500)
      .json({
        error: { code: "internal_error", message: "Eroare internă a serverului" },
      });
  });
  return app;
}
