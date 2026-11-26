import assert from "node:assert/strict";
import test from "node:test";
import { createApplication } from "./app.js";

test("serializatorul REST expune o reprezentare explicită, nu o instanță a modelului", async () => {
  const application = await createApplication();
  const server = application.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/api/notes/1`,
    );
    assert.deepEqual(await response.json(), {
      data: {
        id: 1,
        title: "Notiță publică",
        archived: false,
        links: { self: "/api/notes/1" },
      },
    });
    const stored = await application.Note.findByPk(1);
    assert.equal(stored.internalReview, "marcaj intern pentru ciornă");
    assert.equal(typeof stored.save, "function");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await application.close();
  }
});
