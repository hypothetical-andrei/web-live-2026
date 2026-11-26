import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { createNotesServer } from "./app.js";

export async function listen(server, port = 0) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const storage = process.env.SQLITE_STORAGE ?? fileURLToPath(new URL("../data/notes.sqlite", import.meta.url));
  const app = await createNotesServer({ storage });
  const server = createServer(app);
  try {
    console.log(`API-ul de notițe ascultă la ${await listen(server, Number(process.env.PORT ?? 3000))}`);
  } catch (error) {
    await app.locals.closeDatabase();
    throw error;
  }
  let shuttingDown = false;
  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    try { await new Promise((resolve) => server.close(resolve)); }
    finally { await app.locals.closeDatabase(); }
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
