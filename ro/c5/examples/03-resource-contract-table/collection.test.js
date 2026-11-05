import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "./app.js";
import { selectTasks, toCsv } from "./collection.js";

test("filter, stable ordering and paging select values without mutating storage", () => {
  const tasks = [
    { id: "b", title: "Same" },
    { id: "a", title: "Same" },
    { id: "c", title: "Other" },
  ];
  const before = structuredClone(tasks);
  assert.deepEqual(selectTasks(tasks, { q: "SAME", limit: "1" }).data, [tasks[1]]);
  assert.deepEqual(selectTasks(tasks, { q: "SAME", offset: "1", limit: "1" }).data, [
    tasks[0],
  ]);
  assert.equal(selectTasks(tasks, { q: "absent" }).meta.total, 0);
  assert.deepEqual(tasks, before);
  assert.equal(
    toCsv([{ id: "a", title: 'One, "two"\nthree' }]),
    'id,title\r\n"a","One, ""two""\nthree"\r\n',
  );
});

test("HTTP collection views preserve selection when paging and negotiating format", async () => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const first = await fetch(`${base}/api/tasks`);
    assert.match(first.headers.get("vary"), /Accept/i);
    assert.equal(first.headers.get("cache-control"), "no-store");
    const body = await first.json();
    assert.deepEqual(body.meta, { total: 3, offset: 0, limit: 2 });
    assert.deepEqual(
      body.data.map(({ id }) => id),
      ["t-2", "t-1"],
    );
    const next = first.headers.get("link").match(/^<([^>]+)>; rel="next"$/)[1];
    const last = await fetch(base + next);
    assert.deepEqual(
      (await last.json()).data.map(({ id }) => id),
      ["t-3"],
    );
    assert.equal(last.headers.get("link"), null);
    const selected = await fetch(`${base}/api/tasks?q=Agenda&order=desc&limit=1`);
    assert.deepEqual(
      (await selected.json()).data.map(({ id }) => id),
      ["t-2"],
    );
    const descending = await fetch(`${base}/api/tasks?order=desc&limit=1`);
    const continuation = descending.headers.get("link");
    assert.match(continuation, /order=desc/);
    const follow = await fetch(base + continuation.match(/<([^>]+)>/)[1]);
    assert.deepEqual(
      (await follow.json()).data.map(({ id }) => id),
      ["t-1"],
    );
    const csv = await fetch(`${base}/api/tasks?q=Agenda`, {
      headers: { Accept: "text/csv" },
    });
    assert.match(csv.headers.get("content-type"), /^text\/csv/);
    assert.equal(await csv.text(), 'id,title\r\n"t-2","Agenda"\r\n');
    const preferred = await fetch(`${base}/api/tasks`, {
      headers: { Accept: "application/json;q=0.2, text/csv;q=0.8" },
    });
    assert.match(preferred.headers.get("content-type"), /^text\/csv/);
    assert.equal(
      (await fetch(`${base}/api/tasks`, { headers: { Accept: "application/xml" } }))
        .status,
      406,
    );
    const empty = await fetch(`${base}/api/tasks?offset=99`);
    assert.deepEqual((await empty.json()).data, []);
    assert.equal(empty.status, 200);
    for (const query of [
      "limit=0",
      "limit=21",
      "offset=-1",
      "limit=2.5",
      "offset=9007199254740992",
      "sort=unknown",
      "order=random",
      "limit=1&limit=2",
      "limit[x]=1",
      "q=x&q=y",
    ]) {
      const response = await fetch(`${base}/api/tasks?${query}`);
      assert.equal(response.status, 400, query);
      assert.equal((await response.json()).error.code, "invalid_query");
    }
    assert.deepEqual(
      (await (await fetch(`${base}/api/tasks`)).json()).data.map(({ id }) => id),
      ["t-2", "t-1"],
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
