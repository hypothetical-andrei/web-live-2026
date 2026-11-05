import { createApp } from "./app.js";
const port = Number(process.env.PORT ?? 3000);
createApp({ log: (error) => console.error(error.message) }).listen(
  port,
  "127.0.0.1",
  () => console.log(`Error example listening on http://127.0.0.1:${port}`),
);
