import { createServer } from "node:http";
import { createApp } from "./app.js";
import { createDatabase, initializeDatabase } from "./database.js";

export async function listen(server, port = 0) {
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", resolve); });
  return `http://127.0.0.1:${server.address().port}`;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const database = await initializeDatabase(createDatabase());
  const server = createServer(createApp({ database }));
  const baseUrl = await listen(server, Number(process.env.PORT ?? 3000));
  console.log(`Transactional booking listening at ${baseUrl}`);
  const close = () => server.close(() => database.sequelize.close().finally(() => process.exit(0)));
  process.once("SIGINT", close); process.once("SIGTERM", close);
}
