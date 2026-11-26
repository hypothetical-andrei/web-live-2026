// Validează sintaxa booleană HTTP, apoi transmite separat valoarea bazei către raportul
// SQL fix.
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
    { title: "Prima notiță activă", archived: false },
    { title: "A doua notiță activă", archived: false },
    { title: "Notiță arhivată", archived: true },
  ]);

  const app = express();
  app.get("/api/reports/note-summary", async (request, response, next) => {
    try {
      if (!new Set(["true", "false"]).has(request.query.archived)) {
        log(
          "Filtrul archived a fost respins înainte de SQL: se așteaptă true sau false.",
        );
        return response
          .status(400)
          .json({ error: { code: "invalid_archived_filter" } });
      }
      const archived = request.query.archived === "true" ? 1 : 0;
      log(
        "Valoare booleană validată → valoare SQLite pentru parametrul :archived:",
        archived,
      );
      const rows = await sequelize.query(
        `SELECT archived, COUNT(*) AS count
         FROM notes
         WHERE archived = :archived
         GROUP BY archived`,
        { replacements: { archived }, type: QueryTypes.SELECT },
      );
      log("SELECT fix cu COUNT a returnat:", rows);
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
