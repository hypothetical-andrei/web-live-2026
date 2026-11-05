import { createApp } from "./app.js";

// Print each observer event directly; unlike the tests, the runner does not retain an
// ever-growing event array.
const events = {
  push(event) {
    console.log(event);
  },
};
const port = Number(process.env.PORT ?? 3000);
createApp(events).listen(port, "127.0.0.1", () => {
  console.log(`Request-flow example listening on http://127.0.0.1:${port}`);
});
