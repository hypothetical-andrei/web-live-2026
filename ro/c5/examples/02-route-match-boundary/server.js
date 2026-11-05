import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
createApp().listen(port, "127.0.0.1", () =>
  console.log(`Exemplul de rutare ascultă on http://127.0.0.1:${port}`),
);
