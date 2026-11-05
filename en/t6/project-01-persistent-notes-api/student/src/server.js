import { createServer } from "node:http";
import { createApp } from "./app.js";
import { createNoteStore } from "./note-store.js";
import { seedNotes } from "./seed.js";

export async function listen(server, port = 0) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const store = createNoteStore({ storage: process.env.NOTES_STORAGE ?? "notes.sqlite" });
  await store.initialize({ reset: process.env.RESET_DB === "true", seed: seedNotes });
  const server = createServer(createApp({ store }));
  console.log(`Persistent Notes API: ${await listen(server, Number(process.env.PORT ?? 0))}`);

  const shutdown = async () => {
    await new Promise((resolve) => server.close(resolve));
    await store.close();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
