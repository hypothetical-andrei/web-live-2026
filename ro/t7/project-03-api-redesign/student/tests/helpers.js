import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { listen } from "../src/server.js";
export async function withApi(service, run) {
  const server = createServer(createApp({ service })); const baseUrl = await listen(server);
  try { await run(baseUrl); } finally { await new Promise((resolve) => server.close(resolve)); }
}
export const json = (method, body) => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
