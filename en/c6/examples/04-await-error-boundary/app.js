// Await real CRUD outcomes before sending HTTP success; classify unique conflicts before
// general validation errors.
import express from "express";
import {
  DataTypes,
  Sequelize,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";

export async function createApplication({ log = () => {} } = {}) {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "my.db",
    logging: false,
  });
  const Note = sequelize.define(
    "Note",
    {
      title: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },
      archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { timestamps: true, tableName: "notes" },
  );
  await sequelize.sync();
  const app = express();
  app.use(express.json());

  app.get("/api/notes", async (_request, response, next) => {
    try {
      const notes = await Note.findAll({ order: [["id", "ASC"]] });
      log("SELECT completed; returning rows:", notes.length);
      response.json({ data: notes });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/notes", async (request, response, next) => {
    try {
      const note = await Note.create({ title: request.body?.title });
      log("INSERT completed; returning 201 for id:", note.id);
      response
        .status(201)
        .location(`/api/notes/${note.id}`)
        .json({ data: note });
    } catch (error) {
      next(error);
    }
  });
  app.patch("/api/notes/:noteId", async (request, response, next) => {
    try {
      const note = await Note.findByPk(request.params.noteId);
      if (!note) {
        log("No row with this id; returning 404.");
        return response.status(404).json({ error: { code: "note_not_found" } });
      }
      if (Object.hasOwn(request.body, "title")) note.title = request.body.title;
      if (Object.hasOwn(request.body, "archived"))
        note.archived = request.body.archived;
      await note.save();
      log("save() completed; returning updated id:", note.id);
      response.json({ data: note });
    } catch (error) {
      next(error);
    }
  });
  app.delete("/api/notes/:noteId", async (request, response, next) => {
    try {
      const deleted = await Note.destroy({
        where: { id: request.params.noteId },
      });
      log("DELETE affected rows (1 → 204, 0 → 404):", deleted);
      response.status(deleted === 1 ? 204 : 404).end();
    } catch (error) {
      next(error);
    }
  });
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    log(
      "Error middleware classifies the failure:",
      error.name,
      error.type ?? "",
    );
    if (error.type === "entity.parse.failed")
      return response.status(400).json({ error: { code: "invalid_json" } });
    if (error instanceof UniqueConstraintError)
      return response.status(409).json({ error: { code: "title_conflict" } });
    if (error instanceof ValidationError)
      return response.status(400).json({ error: { code: "invalid_note" } });
    console.error(error);
    response.status(500).json({ error: { code: "internal_error" } });
  });
  return { app, close: () => sequelize.close() };
}
