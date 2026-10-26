import express from "express";
import { fileURLToPath } from "node:url";
import { createMeetingRouter } from "./meeting-router.js";
import { createMeetingStore } from "./meeting-store.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));

export function createApp({ store = createMeetingStore() } = {}) {
  const app = express();
  app.set("query parser", "extended");
  app.use(express.json());
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.use(express.static(publicDirectory));
  app.use("/api/meetings", createMeetingRouter({ store }));
  app.use((_request, response) => {
    response.status(404).json({ error: { code: "not_found", message: "Resource not found" } });
  });
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error.type === "entity.parse.failed") {
      return response.status(400).json({ error: { code: "invalid_json", message: "Invalid JSON" } });
    }
    return response.status(500).json({ error: { code: "internal_error", message: "Internal server error" } });
  });
  return app;
}
