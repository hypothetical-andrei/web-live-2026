import { createApp } from "./app.js";

// Afișează direct fiecare eveniment; spre deosebire de teste, runnerul nu păstrează un
// tablou de evenimente în continuă creștere.
const events = {
  push(event) {
    console.log(event);
  },
};
const port = Number(process.env.PORT ?? 3000);
createApp(events).listen(port, "127.0.0.1", () => {
  console.log(`Exemplul fluxului cererii ascultă la http://127.0.0.1:${port}`);
});
