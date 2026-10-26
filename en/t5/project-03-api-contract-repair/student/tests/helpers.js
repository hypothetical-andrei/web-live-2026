import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { listen } from "../src/server.js";

export async function withApi(run, options = {}) {
  const server = createServer(createApp(options));
  const baseUrl = await listen(server);
  try {
    await run(baseUrl);
  } finally {
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeAllConnections();
    await closed;
  }
}

// Every probe is bounded, including the deliberately incomplete endpoint.
export function request(baseUrl, path, options = {}) {
  return fetch(`${baseUrl}${path}`, { ...options, signal: AbortSignal.timeout(1000) });
}
