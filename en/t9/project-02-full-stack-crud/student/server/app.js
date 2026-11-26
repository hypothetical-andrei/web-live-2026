import express from "express";
import { createDatabase, serializeNote } from "./database.js";

const error = (res, status, code, message) => res.status(status).json({ error: { code, message } });
const validBody = (body) => body && !Array.isArray(body)
  && Object.keys(body).length === 2 && typeof body.title === "string"
  && body.title.trim().length > 0 && typeof body.body === "string";
const databaseId = (id) => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) ? Number(id) : null;

export async function createNotesServer({ storage = ":memory:", testing = false } = {}) {
  const database = await createDatabase({ storage });
  const { Note } = database;
  const app = express();
  app.locals.closeDatabase = database.close;
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/notes", async (_req, res) => {
    const notes = await Note.findAll({ order: [["id", "ASC"]] });
    return res.json({ data: notes.map(serializeNote) });
  });
  app.get("/api/notes/:id", async (req, res) => {
    const note = await Note.findByPk(databaseId(req.params.id));
    if (!note) return error(res, 404, "note_not_found", "Note not found");
    return res.json({ data: serializeNote(note) });
  });
  app.post("/api/notes", async (req, res) => {
    if (!validBody(req.body)) return error(res, 400, "validation_failed", "Invalid note");
    const note = await Note.create({ title: req.body.title.trim(), body: req.body.body.trim() });
    return res.status(201).location(`/api/notes/${note.id}`).json({ data: serializeNote(note) });
  });
  app.put("/api/notes/:id", async (req, res) => {
    const note = await Note.findByPk(databaseId(req.params.id));
    if (!note) return error(res, 404, "note_not_found", "Note not found");
    if (!validBody(req.body)) return error(res, 400, "validation_failed", "Invalid note");
    await note.update({ title: req.body.title.trim(), body: req.body.body.trim() });
    return res.json({ data: serializeNote(note) });
  });
  app.delete("/api/notes/:id", async (req, res) => {
    const id = databaseId(req.params.id);
    const removed = id === null ? 0 : await Note.destroy({ where: { id } });
    if (!removed) return error(res, 404, "note_not_found", "Note not found");
    return res.status(204).end();
  });
  if (testing) app.post("/api/testing/reset", async (_req, res) => {
    await database.reset();
    return res.status(204).end();
  });
  app.use("/api", (_req, res) => error(res, 404, "not_found", "Resource not found"));
  app.use((err, _req, res, next) => {
    if (res.headersSent) return next(err);
    if (err instanceof SyntaxError && err.type === "entity.parse.failed") {
      return error(res, 400, "invalid_json", "Request body is not valid JSON");
    }
    return error(res, 500, "internal_error", "Internal server error");
  });
  return app;
}
