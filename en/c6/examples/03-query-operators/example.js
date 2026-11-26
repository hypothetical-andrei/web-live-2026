// Build compound predicates with Sequelize operator symbols, then inspect real SQL
// and matching rows. Fixtures include archived, low-priority, and tied-priority rows.
import assert from "node:assert/strict";
import { DataTypes, Op, Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});
const Note = sequelize.define(
  "Note",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    priority: { type: DataTypes.INTEGER, allowNull: false },
    archived: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { tableName: "notes", timestamps: false },
);

try {
  await sequelize.sync();
  await Note.bulkCreate([
    {
      id: 1,
      title: "Plan work",
      category: "work",
      priority: 4,
      archived: false,
    },
    {
      id: 2,
      title: "Review notes",
      category: "study",
      priority: 4,
      archived: false,
    },
    {
      id: 3,
      title: "Archived work",
      category: "work",
      priority: 5,
      archived: true,
    },
    {
      id: 4,
      title: "Read SQL",
      category: "study",
      priority: 2,
      archived: false,
    },
    {
      id: 5,
      title: "Send update",
      category: "work",
      priority: 1,
      archived: false,
    },
    {
      id: 6,
      title: "Release notes",
      category: "work",
      priority: 3,
      archived: false,
    },
    {
      id: 7,
      title: "Private memo",
      category: "personal",
      priority: 4,
      archived: false,
    },
  ]);

  const comparison = { [Op.gt]: 2 };
  console.log(
    "Op.gt is a symbol; [Op.gt] uses its value as an object key.",
    typeof Op.gt,
  );
  assert.equal(typeof Op.gt, "symbol");
  console.log(
    "Object.keys omits symbol keys; Reflect.ownKeys includes them.",
    Object.keys(comparison),
    Reflect.ownKeys(comparison),
  );
  assert.deepEqual(Object.keys(comparison), []);
  assert.deepEqual(Reflect.ownKeys(comparison), [Op.gt]);
  console.log(
    "JSON.stringify loses operator keys: do not serialize query objects as JSON.",
    JSON.stringify(comparison),
  );
  assert.equal(JSON.stringify(comparison), "{}");

  console.log(
    "All fixture rows: predict the matching IDs before running the query.",
  );
  console.table(await Note.findAll({ order: [["id", "ASC"]], raw: true }));
  // Sibling conditions are ANDed implicitly; explicit nesting fixes the OR group.
  const where = {
    [Op.and]: [
      { archived: false },
      { priority: { [Op.between]: [2, 5] } },
      { [Op.or]: [{ category: "work" }, { title: { [Op.like]: "%notes%" } }] },
    ],
  };
  const options = {
    where,
    attributes: ["id", "title", "priority"],
    order: [
      ["priority", "DESC"],
      ["id", "ASC"],
    ],
    raw: true,
    logging: (sql) => console.log("SQL:", sql),
  };
  console.log(
    "Active AND priority between 2 and 5 AND (work category OR title containing notes).",
  );
  console.dir(where, { depth: null });
  const matches = await Note.findAll(options);
  assert.deepEqual(
    matches.map(({ id }) => id),
    [1, 2, 6],
  );
  console.log("Matches, ordered by priority DESC then id ASC:");
  console.table(matches);

  const page = await Note.findAndCountAll({ ...options, limit: 2, offset: 1 });
  assert.equal(page.count, 3);
  assert.deepEqual(
    page.rows.map(({ id }) => id),
    [2, 6],
  );
  assert.deepEqual(Object.keys(page.rows[0]), ["id", "title", "priority"]);
  console.log(
    "Page: skip one match, take two; count is the total before pagination.",
    page.count,
  );
  console.table(page.rows);

  console.log("Second query: active AND category IN (work, study) AND id > 2.");
  const later = await Note.findAll({
    where: {
      archived: false,
      category: { [Op.in]: ["work", "study"] },
      id: comparison,
    },
    attributes: ["id", "title"],
    order: [["id", "ASC"]],
    raw: true,
    logging: options.logging,
  });
  assert.deepEqual(
    later.map(({ id }) => id),
    [4, 5, 6],
  );
  console.table(later);
} finally {
  await sequelize.close();
}
console.log(
  "Verified symbol keys, nested predicates, projection, ordering, and pagination.",
);
