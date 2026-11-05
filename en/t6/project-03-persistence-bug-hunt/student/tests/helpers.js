import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { createDatabase, initializeDatabase } from "../src/database.js";
import { listen } from "../src/server.js";

export async function withDatabase(run) {
  const database = createDatabase();
  try {
    await initializeDatabase(database);
    await run(database);
  } finally {
    await database.sequelize.close();
  }
}

export async function withApi(database, run, options = {}) {
  const server = createServer(createApp({ Reservation: database.Reservation, ...options }));
  const baseUrl = await listen(server);
  try { await run(baseUrl); }
  finally {
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeAllConnections();
    await closed;
  }
}

export const postJson = (body) => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export function request(base, path, options = {}) {
  return fetch(`${base}${path}`, { ...options, signal: AbortSignal.timeout(2000) });
}
