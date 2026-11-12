import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { createDatabase, initializeDatabase } from "../src/database.js";
import { listen } from "../src/server.js";

export async function withDatabase(run) {
  const database = await initializeDatabase(createDatabase());
  try { await run(database); } finally { await database.sequelize.close(); }
}
export async function withApi(database, run, options = {}) {
  const server = createServer(createApp({ database, ...options }));
  const baseUrl = await listen(server);
  try { await run(baseUrl); } finally { await new Promise((resolve) => server.close(resolve)); }
}
export const postJson = (body) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
export async function state(database) {
  const event = await database.Event.findByPk(1);
  return { availableSeats: event.availableSeats, bookings: await database.Booking.count(), audits: await database.BookingAudit.count() };
}
