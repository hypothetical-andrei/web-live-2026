import { Sequelize } from "sequelize";
import { defineConferenceModel } from "./conference-model.js";

// Use an in-memory database so relationship behavior is reproducible from a known seed in every run.
export function createDatabase({ logging = false } = {}) {
  const sequelize = new Sequelize({ dialect: "sqlite", storage: ":memory:", logging });
  const models = defineConferenceModel(sequelize);
  return { sequelize, models };
}

export async function initializeDatabase(database) {
  await database.sequelize.sync({ force: true });
  await database.models.Conference.create({ id: 1, slug: "web-systems-2026" });
  await database.models.Session.bulkCreate([
    { id: 1, conferenceId: 1, title: "ORM boundaries", startsAt: new Date("2026-05-10T11:00:00Z") },
    { id: 2, conferenceId: 1, title: "HTTP contracts", startsAt: new Date("2026-05-10T09:00:00Z") },
  ]);
  await database.models.Attendee.bulkCreate([
    { id: 1, email: "ada@example.test" },
    { id: 2, email: "grace@example.test" },
  ]);
  await database.models.Registration.bulkCreate([
    { sessionId: 2, attendeeId: 2, ticketType: "speaker", registeredAt: new Date("2026-04-01T10:00:00Z") },
    { sessionId: 2, attendeeId: 1, ticketType: "student", registeredAt: new Date("2026-04-02T10:00:00Z") },
  ]);
}
