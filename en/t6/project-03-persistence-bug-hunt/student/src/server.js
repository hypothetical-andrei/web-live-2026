import { createServer } from "node:http";
import { createApp } from "./app.js";
import { createDatabase, initializeDatabase } from "./database.js";

export async function listen(server, port = 0) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const database = createDatabase();
  await initializeDatabase(database);
  const server = createServer(createApp({ Reservation: database.Reservation }));
  console.log(`Persistence Bug Hunt: ${await listen(server, Number(process.env.PORT ?? 0))}`);
  const shutdown = async () => {
    await new Promise((resolve) => server.close(resolve));
    await database.sequelize.close();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
