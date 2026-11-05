import assert from "node:assert/strict";
import test from "node:test";
import { Op } from "sequelize";
import { buildNoteQuery, QueryValidationError } from "../src/note-query.js";
import { withApi } from "./helpers.js";

test("translator builds default, filters, orders, and projection without mutation", () => {
  const input = Object.freeze({ owner: " Ada ", archived: "false", sort: "title_asc", fields: "title, owner" });
  const options = buildNoteQuery(input);
  assert.deepEqual(options.order, [["title", "ASC"], ["id", "ASC"]]);
  assert.deepEqual(options.attributes, ["id", "title", "owner"]);
  assert.deepEqual(options.where[Op.and].slice(0, 2), [{ owner: "Ada" }, { archived: false }]);
  assert.deepEqual(input, { owner: " Ada ", archived: "false", sort: "title_asc", fields: "title, owner" });
  assert.deepEqual(buildNoteQuery({}), { order: [["updatedAt", "DESC"], ["id", "ASC"]] });
});

test("integration filters, searches literals, sorts deterministically, and projects", async () => {
  await withApi(async (baseUrl) => {
    const filtered = await fetch(`${baseUrl}/api/notes?owner=Ada&archived=false`);
    assert.deepEqual((await filtered.json()).data.map(({ id }) => id), [1]);

    const searched = await fetch(`${baseUrl}/api/notes?search=alpha&sort=title_asc`);
    assert.deepEqual((await searched.json()).data.map(({ id }) => id), [1, 3]);

    const literal = await fetch(`${baseUrl}/api/notes?search=%25`);
    assert.deepEqual((await literal.json()).data.map(({ id }) => id), [2]);

    const tied = await fetch(`${baseUrl}/api/notes?sort=updated_desc`);
    assert.deepEqual((await tied.json()).data.map(({ id }) => id), [4, 1, 2, 3]);

    const projected = await fetch(`${baseUrl}/api/notes?fields=title,owner&sort=title_asc`);
    const row = (await projected.json()).data[0];
    assert.deepEqual(Object.keys(row).sort(), ["id", "owner", "title"]);
  });
});

test("invalid closed-language inputs throw stable errors before querying", async () => {
  const invalid = [
    [{ unknown: "x" }, "unknown"],
    [{ owner: " " }, "owner"],
    [{ archived: "yes" }, "archived"],
    [{ search: "" }, "search"],
    [{ sort: "DROP TABLE" }, "sort"],
    [{ fields: "title,id" }, "fields"],
    [{ fields: "title,title" }, "fields"],
    [{ owner: ["Ada", "Grace"] }, "owner"],
  ];
  for (const [query, parameter] of invalid) {
    assert.throws(() => buildNoteQuery(query), (error) => {
      assert.equal(error instanceof QueryValidationError, true);
      assert.equal(error.code, "invalid_query");
      assert.match(error.message, new RegExp(`${parameter}$`));
      return true;
    });
  }

  await withApi(async (baseUrl, database) => {
    let calls = 0;
    const original = database.Note.findAll.bind(database.Note);
    database.Note.findAll = (...args) => { calls += 1; return original(...args); };
    for (const query of ["sort=unsafe", "fields=title,sqlite_version()", "sort=title%20DESC", "owner=Ada&owner=Grace"]) {
      const response = await fetch(`${baseUrl}/api/notes?${query}`);
      assert.equal(response.status, 400);
      const text = await response.text();
      assert.equal(JSON.parse(text).error.code, "invalid_query");
      assert.doesNotMatch(text, /SELECT|sqlite_version|stack/i);
    }
    assert.equal(calls, 0);
  });
});
