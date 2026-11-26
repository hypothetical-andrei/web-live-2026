// Inspect model metadata, the actual SQLite schema, and a normalized insert.
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
  console.log("1. sync() creates the SQLite table from the model.");
  await sequelize.sync();

  // getAttributes() exposes model metadata through a public getter.
  const attributes = Note.getAttributes();
  assert.equal(attributes.title.allowNull, false);
  assert.equal(attributes.archived.defaultValue, false);
  assert.equal(attributes.slug.unique, true);

  // describeTable() inspects the schema that was actually created in SQLite.
  console.log(
    "2. Model metadata: title is required, slug is unique, archived defaults to false.",
  );
  const columns = await sequelize.getQueryInterface().describeTable("notes");
  console.table(columns);
  assert.equal(columns.id.primaryKey, true);
  assert.equal(columns.title.allowNull, false);
  assert.equal(columns.archived.defaultValue, false);

  const note = await Note.create({
    title: "  Inspect the schema  ",
    slug: "inspect-schema",
  });
  assert.equal(note.title, "Inspect the schema");
  assert.equal(note.archived, false);
  console.log(
    "3. Saved row: the setter trimmed the title; defaults and timestamps were added.",
    note.get({ plain: true }),
  );
  console.log("4. A blank title must fail model validation.");
  await assert.rejects(Note.create({ title: "  ", slug: "blank" }), {
    name: "SequelizeValidationError",
  });
} finally {
  await sequelize.close();
}
console.log("model metadata, SQLite schema, and validation verified");
