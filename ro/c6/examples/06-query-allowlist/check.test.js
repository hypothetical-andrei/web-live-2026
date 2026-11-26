import assert from "node:assert/strict";
import test from "node:test";
import { createApplication } from "./app.js";

test("o interogare raw parametrizată produce un raport REST", async () => {
  const application = await createApplication();
  const server = application.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.deepEqual(
      await (
        await fetch(`${base}/api/reports/note-summary?archived=false`)
      ).json(),
      { data: { archived: false, count: 2 } },
    );
    const archived = await fetch(
      `${base}/api/reports/note-summary?archived=true`,
    );
    assert.equal(archived.status, 200);
    assert.deepEqual(await archived.json(), {
      data: { archived: true, count: 1 },
    });
    for (const query of [
      "",
      "?archived=",
      "?archived=1",
      "?archived=TRUE",
      "?archived=false&archived=true",
    ]) {
      const invalid = await fetch(`${base}/api/reports/note-summary${query}`);
      assert.equal(invalid.status, 400, query);
      assert.equal(
        (await invalid.json()).error.code,
        "invalid_archived_filter",
      );
    }
    const injection = await fetch(
      `${base}/api/reports/note-summary?archived=${encodeURIComponent("false OR 1=1")}`,
    );
    assert.equal(injection.status, 400);
    assert.equal(
      (await injection.json()).error.code,
      "invalid_archived_filter",
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await application.close();
  }
});
