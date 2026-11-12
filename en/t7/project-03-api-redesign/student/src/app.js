import express from "express";
import { fileURLToPath } from "node:url";
import { ApiError } from "./errors.js";
import { createRegistrationRouter } from "./registration-router.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const sendError = (res, status, code, message) => res.status(status).json({ error: { code, message } });
export function createApp({ service }) {
  const app = express(); app.use(express.json());
  app.get("/health", (_req, res) => res.json({ status: "ok" })); app.use(express.static(publicDirectory));
  app.use("/api/sessions/:sessionId/registrations", createRegistrationRouter({ service }));
  app.use((_req, res) => sendError(res, 404, "not_found", "Resource not found"));
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof SyntaxError && error.type === "entity.parse.failed") return sendError(res, 400, "invalid_json", "Request body is not valid JSON");
    if (error instanceof ApiError) return sendError(res, error.status, error.code, error.message);
    return sendError(res, 500, "internal_error", "Internal server error");
  });
  return app;
}
