// Filter and page child sessions while joining their conference with include.
// Fixed order mappings and an ID tie-breaker make the offset pages inspectable;
// follow HTTP assertions for scope, filters, both sorts, and invalid input.
import assert from "node:assert/strict";
import express from "express";
import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});
const Conference = sequelize.define("Conference", { title: DataTypes.STRING }, { timestamps: false });
const Session = sequelize.define(
  "Session",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.ENUM("beginner", "advanced"), allowNull: false },
    startsAt: { type: DataTypes.DATE, allowNull: false },
  },
  { timestamps: false },
);
Conference.hasMany(Session, { as: "sessions", foreignKey: "conferenceId" });
Session.belongsTo(Conference, { as: "conference", foreignKey: "conferenceId" });
let server;
try {
  await sequelize.sync({ force: true });
  const conference = await Conference.create({ title: "Web" });
  const other = await Conference.create({ title: "Other" });
  await Session.bulkCreate([
    { title: "CSS", level: "beginner", startsAt: "2026-10-01T09:00:00Z" },
    { title: "HTTP", level: "beginner", startsAt: "2026-10-01T09:00:00Z" },
    { title: "SQL", level: "advanced", startsAt: "2026-10-01T10:00:00Z" },
    { title: "Transactions", level: "advanced", startsAt: "2026-10-01T11:00:00Z" },
  ]);
  await Session.bulkCreate([
    { title: "Zero early", level: "beginner", startsAt: "2026-10-01T08:00:00Z" },
    { title: "A later", level: "beginner", startsAt: "2026-10-01T12:00:00Z" },
  ]);
  await Session.update({ conferenceId: conference.id }, { where: {} });
  await Session.create({ title: "Excluded", level: "advanced", startsAt: "2026-10-01T07:00:00Z", conferenceId: other.id });
  const sortMap = {
    starts_asc: [
      ["startsAt", "ASC"],
      ["id", "ASC"],
    ],
    title_asc: [
      ["title", "ASC"],
      ["id", "ASC"],
    ],
  };
  const app = express();
  app.get("/api/conferences/:conferenceId/sessions", async (request, response, next) => {
    const query = request.query;
    const { sort = "starts_asc", level = "", limit: limitText = "2", offset: offsetText = "0" } = query;
    const invalid = () => response.status(400).json({ error: { code: "invalid_query" } });
    if (
      Object.keys(query).some(
        (key) => !["sort", "level", "limit", "offset"].includes(key),
      ) ||
      Object.values(query).some((value) => typeof value !== "string") ||
      !/^\d+$/.test(request.params.conferenceId) ||
      !/^(0|[1-9]\d*)$/.test(offsetText) ||
      !Object.hasOwn(sortMap, sort) ||
      !["", "beginner", "advanced"].includes(level) ||
      !/^[1-9]\d*$/.test(limitText)
    )
      return invalid();
    const limit = Number(limitText);
    if (!Number.isSafeInteger(limit) || limit > 20) return invalid();
    const offset = Number(offsetText);
    if (!Number.isSafeInteger(offset)) return invalid();
    try {
      const rows = await Session.findAll({
        where: level ? { level } : {},
        include: [{ association: "conference", required: true,
          where: { id: request.params.conferenceId }, attributes: ["id", "title"] }],
        order: sortMap[sort],
        limit,
        offset,
      });
      response.json({ data: rows, page: { limit, offset } });
    } catch (error) {
      next(error);
    }
  });
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    return response.status(500).json({ error: { code: "internal_error" } });
  });
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/conferences/${conference.id}/sessions`;
  const filtered = await (
    await fetch(`${base}?level=advanced&sort=title_asc&limit=2`)
  ).json();
  assert.deepEqual(
    filtered.data.map(({ title }) => title),
    ["SQL", "Transactions"],
  );
  const page = await (await fetch(`${base}?sort=starts_asc&limit=2`)).json();
  assert.deepEqual(
    page.data.map(({ id }) => id),
    [5, 1],
  );
  assert.deepEqual(page.page, { limit: 2, offset: 0 });
  assert.ok(page.data.every(row => row.conference.id === conference.id));
  assert.equal((await fetch(`${base}?sort=title%20DESC`)).status, 400);
  for (const [sort, expected] of [
    ["starts_asc", [5, 1, 2, 3, 4, 6]],
    ["title_asc", [6, 1, 2, 3, 4, 5]],
  ]) {
    const ids = [];
    for (let offset = 0; offset < 6; offset += 2) {
      const response = await fetch(`${base}?sort=${sort}&limit=2&offset=${offset}`);
      assert.equal(response.status, 200);
      const result = await response.json();
      ids.push(...result.data.map(({ id }) => id));
    }
    assert.deepEqual(ids, expected);
    assert.equal(new Set(ids).size, ids.length);
  }
  for (const query of [
    "limit=0",
    "limit=21",
    "limit=2&limit=3",
    "sort=__proto__",
    "offset=-1",
    "offset=1.5",
    "offset=2&offset=3",
    "offset=9007199254740992",
    "afterId=2",
    "level=other",
  ]) {
    assert.equal((await fetch(`${base}?${query}`)).status, 400, query);
  }
  const secondFiltered = await (await fetch(`${base}?level=advanced&sort=title_asc&limit=1&offset=1`)).json();
  assert.deepEqual(secondFiltered.data.map(row => row.title), ["Transactions"]);
  const beyond = await (await fetch(`${base}?offset=6`)).json();
  assert.deepEqual(beyond.data, []);
  const absent = await (await fetch(base.replace(`/conferences/${conference.id}/`, "/conferences/999/"))).json();
  assert.deepEqual(absent.data, []);
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  await sequelize.close();
}
console.log("filtering, sorting, and pagination verified");
