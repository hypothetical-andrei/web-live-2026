import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { listen } from "../src/server.js";

export function createDependencies() {
  const logs = [];
  const calls = { id: 0, clock: 0 };
  return {
    logs,
    calls,
    dependencies: {
      createRequestId() {
        calls.id += 1;
        return `generated-${calls.id}`;
      },
      clock: {
        now() {
          calls.clock += 1;
          return calls.clock * 10;
        },
      },
      logger: { info: (entry) => logs.push(entry) },
    },
  };
}

export async function withApp(run, options = {}) {
  const server = createServer(createApp(options));
  const baseUrl = await listen(server);
  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

export const postJson = (body, headers = {}) => ({
  method: "POST",
  headers: { "content-type": "application/json", ...headers },
  body: JSON.stringify(body),
});
