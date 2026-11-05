import express from "express";
import { fileURLToPath } from "node:url";
import { buildNoteQuery, QueryValidationError } from "./note-query.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const sendError = (response, status, code, message) =>
  response.status(status).json({ error: { code, message } });

export function createApp({ Note, queryBuilder = buildNoteQuery }) {
  const app = express();
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.use(express.static(publicDirectory));
  app.get("/api/notes", async (request, response) => {
    const notes = await Note.findAll(queryBuilder(request.query));
    response.json({ data: notes.map((note) => note.get({ plain: true })) });
  });
  app.use((_request, response) => sendError(response, 404, "not_found", "Resource not found"));
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error instanceof QueryValidationError) {
      return sendError(response, 400, error.code, error.message);
    }
    return sendError(response, 500, "internal_error", "Internal server error");
  });
  return app;
}
