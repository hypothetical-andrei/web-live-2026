import express from "express";
import { fileURLToPath } from "node:url";
import { ValidationError } from "sequelize";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const sendError = (response, status, code, message) =>
  response.status(status).json({ error: { code, message } });

// HTTP validation stays here so the store can focus on persistence rules and record shaping.
function validateWrite(request, response, partial = false) {
  if (!request.is("application/json")) {
    sendError(response, 415, "json_required", "Content-Type must be application/json");
    return null;
  }
  const body = request.body;
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    sendError(response, 400, "validation_failed", "Body must be a JSON object");
    return null;
  }
  const allowed = ["title", "body", "archived"];
  const entries = Object.entries(body);
  if (entries.some(([key]) => !allowed.includes(key)) || (partial && entries.length === 0)) {
    sendError(response, 400, "validation_failed", "Body contains invalid fields");
    return null;
  }
  if (!partial && !Object.hasOwn(body, "title")) {
    sendError(response, 400, "validation_failed", "title is required");
    return null;
  }
  if (Object.hasOwn(body, "title") && typeof body.title !== "string") {
    sendError(response, 400, "validation_failed", "title must be a string");
    return null;
  }
  if (Object.hasOwn(body, "body") && typeof body.body !== "string") {
    sendError(response, 400, "validation_failed", "body must be a string");
    return null;
  }
  if (Object.hasOwn(body, "archived") && typeof body.archived !== "boolean") {
    sendError(response, 400, "validation_failed", "archived must be a boolean");
    return null;
  }
  return body;
}

const serialize = (note) => ({
  ...note,
  createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
  updatedAt: note.updatedAt instanceof Date ? note.updatedAt.toISOString() : note.updatedAt,
});

export function createApp({ store }) {
  const app = express();
  app.use(express.json());
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.use(express.static(publicDirectory));

  app.get("/api/notes", async (_request, response) => {
    response.json({ data: (await store.list()).map(serialize) });
  });
  app.get("/api/notes/:noteId", async (request, response) => {
    const note = await store.findById(request.params.noteId);
    if (!note) return sendError(response, 404, "note_not_found", "Note not found");
    return response.json({ data: serialize(note) });
  });
  app.post("/api/notes", async (request, response) => {
    const values = validateWrite(request, response);
    if (!values) return;
    const note = await store.create(values);
    return response.status(201).location(`/api/notes/${note.id}`).json({ data: serialize(note) });
  });
  app.patch("/api/notes/:noteId", async (request, response) => {
    const changes = validateWrite(request, response, true);
    if (!changes) return;
    const note = await store.update(request.params.noteId, changes);
    if (!note) return sendError(response, 404, "note_not_found", "Note not found");
    return response.json({ data: serialize(note) });
  });
  app.delete("/api/notes/:noteId", async (request, response) => {
    if (!(await store.remove(request.params.noteId))) {
      return sendError(response, 404, "note_not_found", "Note not found");
    }
    return response.status(204).end();
  });

  app.use((_request, response) => sendError(response, 404, "not_found", "Resource not found"));
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error instanceof SyntaxError && error.type === "entity.parse.failed") {
      return sendError(response, 400, "invalid_json", "Request body is not valid JSON");
    }
    if (error instanceof ValidationError) {
      return sendError(response, 400, "note_invalid", "Note violates persistence constraints");
    }
    return sendError(response, 500, "internal_error", "Internal server error");
  });
  return app;
}
