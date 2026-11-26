// Inspectează metadatele modelului, schema SQLite efectivă și o inserare normalizată.
import assert from "node:assert/strict";
import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});
const Note = sequelize.define(
  "Note",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
      set(value) {
        this.setDataValue(
          "title",
          typeof value === "string" ? value.trim() : value,
        );
      },
      validate: { notEmpty: true, len: [3, 120] },
    },
    slug: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { timestamps: true, tableName: "notes" },
);

try {
  console.log("1. sync() creează tabelul SQLite din model.");
  await sequelize.sync();

  // getAttributes() expune metadatele modelului printr-un getter public.
  const attributes = Note.getAttributes();
  assert.equal(attributes.title.allowNull, false);
  assert.equal(attributes.archived.defaultValue, false);
  assert.equal(attributes.slug.unique, true);

  // describeTable() inspectează schema creată efectiv în SQLite.
  console.log(
    "2. Metadatele modelului: title este obligatoriu, slug este unic, archived are valoarea implicită false.",
  );
  const columns = await sequelize.getQueryInterface().describeTable("notes");
  console.table(columns);
  assert.equal(columns.id.primaryKey, true);
  assert.equal(columns.title.allowNull, false);
  assert.equal(columns.archived.defaultValue, false);

  const note = await Note.create({
    title: "  Inspectează schema  ",
    slug: "inspect-schema",
  });
  assert.equal(note.title, "Inspectează schema");
  assert.equal(note.archived, false);
  console.log(
    "3. Rând salvat: setterul a eliminat spațiile de la capetele titlului; au fost adăugate valorile implicite și marcajele temporale.",
    note.get({ plain: true }),
  );
  console.log("4. Un titlu gol trebuie respins de validarea modelului.");
  await assert.rejects(Note.create({ title: "  ", slug: "blank" }), {
    name: "SequelizeValidationError",
  });
} finally {
  await sequelize.close();
}
console.log(
  "metadatele modelului, schema SQLite și validarea au fost verificate",
);
