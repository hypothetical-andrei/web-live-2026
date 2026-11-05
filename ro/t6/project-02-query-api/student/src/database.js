import { DataTypes, Sequelize } from "sequelize";

export const seedNotes = Object.freeze([
  Object.freeze({ id: 1, title: "Plan Alfa", owner: "Ada", archived: false, createdAt: new Date("2026-01-01T00:00:00Z"), updatedAt: new Date("2026-03-03T12:00:00Z") }),
  Object.freeze({ id: 2, title: "100% Pregătit", owner: "Grace", archived: false, createdAt: new Date("2026-01-02T00:00:00Z"), updatedAt: new Date("2026-03-03T12:00:00Z") }),
  Object.freeze({ id: 3, title: "ALFA arhivat", owner: "Ada", archived: true, createdAt: new Date("2026-01-03T00:00:00Z"), updatedAt: new Date("2026-02-01T12:00:00Z") }),
  Object.freeze({ id: 4, title: "Notițe Beta", owner: "Linus", archived: false, createdAt: new Date("2026-01-04T00:00:00Z"), updatedAt: new Date("2026-04-01T12:00:00Z") }),
]);

export function createDatabase({ logging = false } = {}) {
  const sequelize = new Sequelize({ dialect: "sqlite", storage: ":memory:", logging });
  const Note = sequelize.define("Note", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    owner: { type: DataTypes.STRING, allowNull: false },
    archived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  });
  return { sequelize, Note };
}

export async function initializeDatabase(database) {
  await database.sequelize.sync({ force: true });
  await database.Note.bulkCreate(seedNotes);
}
