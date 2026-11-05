// O operație leagă verificarea tipului media, parsarea, Joi și o descriere API pentru
// instrumente externe. Exemplul nu demonstrează persistența.
import express from "express";
import { readFileSync } from "node:fs";
import { validateWithJoi } from "./validation.js";

export function createApp() {
  const app = express();
  const description = JSON.parse(
    readFileSync(new URL("./openapi.json", import.meta.url), "utf8"),
  );
  app.get("/openapi.json", (_request, response) => response.json(description));
  app.post(
    "/api/tasks",
    (request, response, next) => {
      if (!request.is("application/json"))
        return response.status(415).json({ error: { code: "unsupported_media_type" } });
      return next();
    },
    express.json({ limit: "4kb", strict: false }),
    (request, response) => {
      const result = validateWithJoi(request.body);
      if (!result.ok)
        return response.status(400).json({ error: { code: "validation_failed" } });
      return response
        .status(201)
        .location("/api/tasks/t-1")
        .json({ data: { id: "t-1", ...result.value } });
    },
  );
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    const code =
      error.type === "entity.parse.failed"
        ? "invalid_json"
        : error.type === "entity.too.large"
          ? "payload_too_large"
          : "internal_error";
    const status =
      code === "invalid_json" ? 400 : code === "payload_too_large" ? 413 : 500;
    return response.status(status).json({ error: { code } });
  });
  return app;
}
