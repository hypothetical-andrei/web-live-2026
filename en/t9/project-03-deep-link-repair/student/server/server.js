import { createServer } from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createApiRouter } from "./api-router.js";
import { createProductionApp } from "./create-production-app.js";

export function listen(server, port = 0) {
  return new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", reject);
      const address = server.address();
      resolveListen(`http://127.0.0.1:${address.port}`);
    });
  });
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const requestLog = [];
  const clientDirectory = process.env.CLIENT_DIRECTORY ?? resolve("client-dist");
  const app = createProductionApp({ clientDirectory, apiRouter: createApiRouter(requestLog), requestLog });
  const server = createServer(app);
  const baseUrl = await listen(server, Number(process.env.PORT ?? 3000));
  console.log(`Deep-link server listening at ${baseUrl}`);
}
