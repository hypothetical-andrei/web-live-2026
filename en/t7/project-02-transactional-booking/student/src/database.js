import { Sequelize } from "sequelize";
import { defineModels } from "./models.js";

export function createDatabase(options = {}) {
  const sequelize = new Sequelize("sqlite::memory:", { logging: false, ...options });
  return { sequelize, ...defineModels(sequelize) };
}

export async function initializeDatabase(database) {
  await database.sequelize.sync({ force: true });
  await database.Event.create({ id: 1, title: "Web Systems", capacity: 5, availableSeats: 5 });
  return database;
}
