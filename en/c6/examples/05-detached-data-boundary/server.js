// Start the demonstration directly; application tests use the same factory.
import { createApplication } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const { app, close } = await createApplication({ log: console.log });
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${server.address().port}`);
  console.log("SQLite is in memory: restarting resets this example.");
  console.log("GET /api/notes/1");
  console.log("Use Ctrl+C to stop and close SQLite.");
});

function shutdown() {
  server.close(async () => {
    await close();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
