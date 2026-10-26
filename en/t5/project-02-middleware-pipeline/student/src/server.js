import { createServer } from "node:http";
import { createApp } from "./app.js";

export async function listen(server, port = 0) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const server = createServer(createApp());
  console.log(`Report pipeline: ${await listen(server, Number(process.env.PORT ?? 0))}`);
}
