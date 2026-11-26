import { Sequelize, DataTypes } from "sequelize";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export async function createDatabase({ storage = ":memory:", logging = false } = {}) {
  if (storage !== ":memory:") await mkdir(dirname(storage), { recursive: true });
  const sequelize = new Sequelize({ dialect: "sqlite", storage, logging });
  const Note = sequelize.define("Note", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    body: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
  }, { timestamps: false });
  const seed = async () => {
    if (await Note.count() === 0) {
      await Note.create({ title: "Server state", body: "The API is authoritative." });
    }
  };
  try {
    await sequelize.sync();
    await seed();
  } catch (error) {
    await sequelize.close();
    throw error;
  }
  return {
    Note,
    close: () => sequelize.close(),
    reset: async () => { await sequelize.sync({ force: true }); await seed(); },
  };
}

export const serializeNote = (note) => ({ id: String(note.id), title: note.title, body: note.body });
