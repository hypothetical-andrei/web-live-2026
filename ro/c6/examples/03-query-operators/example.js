// Construiește condiții compuse cu simbolurile Sequelize, apoi inspectează SQL-ul real
// și rândurile. Datele includ arhivare, prioritate mică și priorități egale.
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
    "Op.gt este un simbol; [Op.gt] folosește valoarea sa drept cheie de obiect.",
    typeof Op.gt,
  );
  assert.equal(typeof Op.gt, "symbol");
  console.log(
    "Object.keys omite cheile simbol; Reflect.ownKeys le include.",
    Object.keys(comparison),
    Reflect.ownKeys(comparison),
  );
  assert.deepEqual(Object.keys(comparison), []);
  assert.deepEqual(Reflect.ownKeys(comparison), [Op.gt]);
  console.log(
    "JSON.stringify pierde cheile operatorilor: nu serializa obiectele de interogare ca JSON.",
    JSON.stringify(comparison),
  );
  assert.equal(JSON.stringify(comparison), "{}");

  console.log(
    "Toate rândurile: prezice ID-urile care corespund înainte de interogare.",
  );
  console.table(await Note.findAll({ order: [["id", "ASC"]], raw: true }));
  // Condițiile alăturate se combină implicit cu AND; imbricarea delimitează grupul OR.
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
    "Active ȘI prioritate între 2 și 5 ȘI (categoria work SAU titlul conține notes).",
  );
  console.dir(where, { depth: null });
  const matches = await Note.findAll(options);
  assert.deepEqual(
    matches.map(({ id }) => id),
    [1, 2, 6],
  );
  console.log("Rezultate ordonate după priority DESC, apoi id ASC:");
  console.table(matches);

  const page = await Note.findAndCountAll({ ...options, limit: 2, offset: 1 });
  assert.equal(page.count, 3);
  assert.deepEqual(
    page.rows.map(({ id }) => id),
    [2, 6],
  );
  assert.deepEqual(Object.keys(page.rows[0]), ["id", "title", "priority"]);
  console.log(
    "Pagină: omite un rezultat, ia două; count este totalul înainte de paginare.",
    page.count,
  );
  console.table(page.rows);

  console.log(
    "A doua interogare: active ȘI category IN (work, study) ȘI id > 2.",
  );
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
  "Am verificat cheile simbol, condițiile imbricate, proiecția, ordonarea și paginarea.",
);
