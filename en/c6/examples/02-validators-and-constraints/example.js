// Contrast JavaScript validators with SQLite constraints. Follow SQL logging to see which
// rejected writes reach the database; run bypass checks only in this disposable database.
import assert from "node:assert/strict";
import {
  DataTypes,
  Sequelize,
  ValidationError,
  UniqueConstraintError,
} from "sequelize";

const sql = [];
const nullableValues = [];
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: (statement) => sql.push(statement),
});
const Note = sequelize.define(
  "Note",
  {
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
      set(value) {
        this.setDataValue(
          "title",
          typeof value === "string" ? value.trim() : value,
        );
      },
      validate: {
        notEmpty: true,
        len: { args: [3, 120], msg: "Use a meaningful title" },
        meaningfulTitle(value) {
          if (typeof value !== "string" || value.toLowerCase() === "untitled")
            throw new Error("Use a meaningful title");
        },
      },
    },
    slug: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: { is: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "general",
      validate: { isIn: [["general", "work"]] },
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { isInt: true, min: 0, max: 5 },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    archiveReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      validate: {
        optionalReason(value) {
          nullableValues.push(value);
          if (value !== null && typeof value !== "string")
            throw new Error("Optional reason must be a string");
        },
      },
    },
  },
  {
    tableName: "validated_notes",
    timestamps: false,
    validate: {
      archiveNeedsReason() {
        if (
          this.archived &&
          (typeof this.archiveReason !== "string" ||
            this.archiveReason.trim() === "")
        ) {
          throw new Error("Archived notes need a reason");
        }
      },
    },
  },
);

try {
  await sequelize.sync();
  // Invalid model writes are rejected before SQL; validate() alone does not save.
  for (const [changes, field] of [
    [{ title: null }, "title"],
    [{ title: "   " }, "title"],
    [{ title: "untitled" }, "title"],
    [{ slug: "Bad Slug" }, "slug"],
    [{ category: "other" }, "category"],
    [{ priority: -1 }, "priority"],
    [{ priority: 6 }, "priority"],
    [{ priority: 2.5 }, "priority"],
    [{ email: "not-an-email" }, "email"],
    [{ archived: true, archiveReason: null }, "archiveNeedsReason"],
  ]) {
    sql.length = 0;
    await assert.rejects(
      Note.create({ title: "Valid title", slug: "valid-title", ...changes }),
      (error) => {
        assert.ok(error instanceof ValidationError);
        assert.ok(
          error.errors.some((item) => item.path === field),
          field,
        );
        return true;
      },
    );
    assert.equal(sql.length, 0);
    console.log("Rejected field/rule before SQL:", field, changes);
  }
  console.log(
    "build() creates an instance; validate() checks it without writing SQL.",
  );
  const draft = Note.build({
    title: "  Review notes  ",
    slug: "review-notes",
    email: null,
    archiveReason: null,
  });
  sql.length = 0;
  await draft.validate();
  assert.equal(sql.length, 0);
  assert.equal(draft.title, "Review notes");
  assert.ok(nullableValues.includes(null));
  console.log("save() now issues INSERT; the category default is general.");
  await draft.save();
  assert.ok(sql.some((statement) => statement.includes("INSERT")));
  assert.equal(draft.category, "general");

  console.log(
    "Archiving without a reason fails; adding the reason makes save() succeed.",
  );
  draft.archived = true;
  await assert.rejects(draft.save(), ValidationError);
  draft.archiveReason = "Reviewed";
  await draft.save();
  assert.equal((await Note.findByPk(draft.id)).archived, true);

  console.log(
    "A duplicate slug reaches INSERT, then SQLite rejects its UNIQUE constraint.",
  );
  sql.length = 0;
  await assert.rejects(
    Note.create({ title: "Different title", slug: "review-notes" }),
    UniqueConstraintError,
  );
  assert.ok(sql.some((statement) => statement.includes("INSERT")));

  // Raw SQL bypasses model validators, but not the actual NOT NULL and UNIQUE
  // constraints.
  console.log(
    "Raw SQL can insert a blank title, but cannot bypass NOT NULL or UNIQUE.",
  );
  await sequelize.query(
    "INSERT INTO validated_notes (title, slug) VALUES (:title, :slug)",
    { replacements: { title: "", slug: "raw-write" } },
  );
  assert.equal(
    (await Note.findOne({ where: { slug: "raw-write" } })).title,
    "",
  );
  await assert.rejects(
    sequelize.query(
      "INSERT INTO validated_notes (title, slug) VALUES (NULL, :slug)",
      {
        replacements: { slug: "null-write" },
      },
    ),
  );
  await assert.rejects(
    sequelize.query(
      "INSERT INTO validated_notes (title, slug) VALUES (:title, :slug)",
      {
        replacements: { title: "Another", slug: "review-notes" },
      },
    ),
  );

  // bulkCreate skips per-row validators by default; opt in explicitly.
  console.log(
    "bulkCreate skips validators by default; validate: true rejects the same reserved title.",
  );
  await Note.bulkCreate([{ title: "untitled", slug: "bulk-bypass" }]);
  await assert.rejects(
    Note.bulkCreate([{ title: "untitled", slug: "bulk-checked" }], {
      validate: true,
    }),
  );
  assert.equal(await Note.count({ where: { slug: "bulk-checked" } }), 0);
} finally {
  await sequelize.close();
}
console.log("validators, SQL constraints, and bypass paths verified");
