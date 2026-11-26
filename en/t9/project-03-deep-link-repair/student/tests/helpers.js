import { createServer } from "node:http";
import { resolve } from "node:path";
import { createApiRouter } from "../server/api-router.js";
import { createProductionApp } from "../server/create-production-app.js";
import { listen } from "../server/server.js";

export const clientDirectory = resolve("client-dist");

export async function withApp(app, run) {
  const server = createServer(app);
  const baseUrl = await listen(server);
  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
}

export function productionFixture(directory = clientDirectory) {
  const requestLog = [];
  const apiRouter = createApiRouter(requestLog);
  return { requestLog, app: createProductionApp({ clientDirectory: directory, apiRouter, requestLog }) };
}

export const htmlHeaders = { accept: "text/html" };
