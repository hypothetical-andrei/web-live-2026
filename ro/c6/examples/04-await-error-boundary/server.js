// Pornește demonstrația direct; testele aplicației folosesc aceeași funcție de creare.
import { createApplication } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const { app, close } = await createApplication({ log: console.log });
const server = app.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${server.address().port}`);
  console.log("SQLite este în memorie: repornirea resetează acest exemplu.");
  console.log("GET /api/notes");
  console.log('POST /api/notes with JSON {"title":"Example"}');
  console.log('PATCH /api/notes/1 with JSON {"archived":true}');
  console.log("DELETE /api/notes/1");
  console.log("Folosește Ctrl+C pentru a opri serverul și a închide SQLite.");
});

function shutdown() {
  server.close(async () => {
    await close();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
