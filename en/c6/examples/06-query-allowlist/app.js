// Validate the HTTP boolean syntax, then pass its database value separately to the fixed
// SQL report.
import express from "express";
import { DataTypes, QueryTypes, Sequelize } from "sequelize";

export async function createApplication({ log = () => {} } = {}) {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  const Note = sequelize.define(
    "Note",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { timestamps: false, tableName: "notes" },
  );
  await sequelize.sync();
  await Note.bulkCreate([
    { title: "First active note", archived: false },
    { title: "Second active note", archived: false },
    { title: "Archived note", archived: true },
  ]);

  const app = express();
  app.get("/api/reports/note-summary", async (request, response, next) => {
    try {
      if (!new Set(["true", "false"]).has(request.query.archived)) {
        log("Rejected archived filter before SQL: expected true or false.");
        return response
          .status(400)
          .json({ error: { code: "invalid_archived_filter" } });
      }
      const archived = request.query.archived === "true" ? 1 : 0;
      log(
        "Validated boolean → SQLite value for named replacement :archived:",
        archived,
      );
      const rows = await sequelize.query(
        `SELECT archived, COUNT(*) AS count
         FROM notes
         WHERE archived = :archived
         GROUP BY archived`,
        { replacements: { archived }, type: QueryTypes.SELECT },
      );
      log("Fixed SELECT with COUNT returned:", rows);
      response.json({
        data: {
          archived: request.query.archived === "true",
          count: rows[0]?.count ?? 0,
        },
      });
    } catch (error) {
      next(error);
    }
  });
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    console.error(error);
    response.status(500).json({ error: { code: "internal_error" } });
  });
  return { app, close: () => sequelize.close() };
}
