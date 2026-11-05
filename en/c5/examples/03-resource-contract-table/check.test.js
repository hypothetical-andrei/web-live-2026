import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "./app.js";

test("Express exposes coherent REST status, header, body, and state contracts", async () => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const created = await fetch(`${base}/api/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Test the API" }),
    });
    assert.equal(created.status, 201);
    const location = created.headers.get("location");
    assert.match(location, /^\/api\/tasks\/t-\d+$/);
    assert.equal(
      (await (await fetch(`${base}${location}`)).json()).data.title,
      "Test the API",
    );
    const deleted = await fetch(`${base}/api/tasks/t-1`, { method: "DELETE" });
    assert.equal(deleted.status, 204);
    assert.equal(await deleted.text(), "");
    assert.equal((await fetch(`${base}/api/tasks/missing`)).status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("collection GET filters and sorts before paging and preserves the next selection", async () => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;

  try {
    for (const title of ["Demo gamma", "Demo alpha", "Demo beta"]) {
      const created = await fetch(`${base}/api/tasks`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title }),
      });
      assert.equal(created.status, 201);
    }

    const page = await fetch(`${base}/api/tasks?q=Demo%20&order=desc&offset=1&limit=1`);
    assert.equal(page.status, 200);
    const body = await page.json();
    assert.deepEqual(body.meta, { total: 3, offset: 1, limit: 1 });
    assert.deepEqual(
      body.data.map(({ title }) => title),
      ["Demo beta"],
    );

    const nextPath = page.headers.get("link").match(/^<([^>]+)>; rel="next"$/)[1];
    const nextUrl = new URL(nextPath, base);
    assert.equal(nextUrl.searchParams.get("q"), "Demo ");
    assert.equal(nextUrl.searchParams.get("order"), "desc");
    assert.equal(nextUrl.searchParams.get("offset"), "2");
    assert.equal(nextUrl.searchParams.get("limit"), "1");

    const last = await fetch(nextUrl);
    assert.deepEqual(
      (await last.json()).data.map(({ title }) => title),
      ["Demo alpha"],
    );
    assert.equal(last.headers.get("link"), null);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("an empty filtered collection is successful in both JSON and CSV", async () => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/tasks?q=no-such-title`;

  try {
    const json = await fetch(url, { headers: { Accept: "application/json" } });
    assert.equal(json.status, 200);
    assert.deepEqual(await json.json(), {
      data: [],
      meta: { total: 0, offset: 0, limit: 2 },
    });
    assert.equal(json.headers.get("link"), null);

    const csv = await fetch(url, { headers: { Accept: "text/csv" } });
    assert.equal(csv.status, 200);
    assert.match(csv.headers.get("content-type"), /^text\/csv/);
    assert.match(csv.headers.get("vary"), /Accept/i);
    assert.equal(await csv.text(), "id,title\r\n");
    assert.equal(csv.headers.get("link"), null);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
