import { createServer } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../src/app.js";
import { createNoteStore } from "../src/note-store.js";
import { listen } from "../src/server.js";

export async function withTempStorage(run) {
  const directory = await mkdtemp(join(tmpdir(), "persistent-notes-"));
  const storage = join(directory, "notes.sqlite");
  try {
    await run(storage);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

export async function withStore(run, options = {}) {
  const store = createNoteStore({ storage: options.storage ?? ":memory:" });
  await store.initialize({ reset: options.reset ?? true, seed: options.seed ?? [] });
  try {
    await run(store);
  } finally {
    await store.close();
  }
}

export async function withApi(store, run) {
  const server = createServer(createApp({ store }));
  const baseUrl = await listen(server);
  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

export const jsonRequest = (method, body) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
