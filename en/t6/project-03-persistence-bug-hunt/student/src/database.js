import { Sequelize } from "sequelize";
import { defineReservation } from "./models/reservation.js";

export function createDatabase({ logging = false } = {}) {
  const sequelize = new Sequelize({ dialect: "sqlite", storage: ":memory:", logging });
  const Reservation = defineReservation(sequelize);
  return { sequelize, Reservation };
}

export async function initializeDatabase(database) {
  await database.sequelize.sync({ force: true });
}
