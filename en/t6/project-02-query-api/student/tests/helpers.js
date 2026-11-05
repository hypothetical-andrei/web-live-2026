import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { createDatabase, initializeDatabase } from "../src/database.js";
import { listen } from "../src/server.js";

export async function withDatabase(run) {
  const database = createDatabase();
  await initializeDatabase(database);
  try { await run(database); } finally { await database.sequelize.close(); }
}

export async function withApi(run, options = {}) {
  await withDatabase(async (database) => {
    const server = createServer(createApp({ Note: database.Note, ...options }));
    const baseUrl = await listen(server);
    try { await run(baseUrl, database); } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
}
