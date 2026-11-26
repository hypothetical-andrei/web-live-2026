// Compară validatorii JavaScript cu restricțiile SQLite. Urmărește jurnalul SQL pentru a
// vedea ce scrieri respinse ajung în bază; rulează verificările care ocolesc validarea
// doar în această bază temporară.
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
        len: { args: [3, 120], msg: "Folosește un titlu semnificativ" },
        meaningfulTitle(value) {
          if (typeof value !== "string" || value.toLowerCase() === "untitled")
            throw new Error("Folosește un titlu semnificativ");
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
            throw new Error("Motivul opțional trebuie să fie șir");
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
          throw new Error("Notele arhivate au nevoie de un motiv");
        }
      },
    },
  },
);

try {
  await sequelize.sync();
  // Scrierile invalide prin model sunt respinse înainte de SQL; validate() singur nu
  // salvează.
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
    console.log("Câmp/regulă respinsă înainte de SQL:", field, changes);
  }
  console.log(
    "build() creează o instanță; validate() o verifică fără a scrie SQL.",
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
  console.log(
    "save() execută acum INSERT; valoarea implicită pentru category este general.",
  );
  await draft.save();
  assert.ok(sql.some((statement) => statement.includes("INSERT")));
  assert.equal(draft.category, "general");

  console.log(
    "Arhivarea fără motiv eșuează; adăugarea motivului permite salvarea.",
  );
  draft.archived = true;
  await assert.rejects(draft.save(), ValidationError);
  draft.archiveReason = "Reviewed";
  await draft.save();
  assert.equal((await Note.findByPk(draft.id)).archived, true);

  console.log(
    "Un slug duplicat ajunge la INSERT, apoi SQLite respinge încălcarea constrângerii UNIQUE.",
  );
  sql.length = 0;
  await assert.rejects(
    Note.create({ title: "Different title", slug: "review-notes" }),
    UniqueConstraintError,
  );
  assert.ok(sql.some((statement) => statement.includes("INSERT")));

  // SQL direct ocolește validatorii modelului, dar nu constrângerile NOT NULL și UNIQUE
  // efective.
  console.log(
    "SQL direct poate insera un titlu gol, dar nu poate ocoli NOT NULL sau UNIQUE.",
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

  // bulkCreate omite implicit validatorii pe fiecare rând; activează-i explicit.
  console.log(
    "bulkCreate omite implicit validatorii; validate: true respinge același titlu rezervat.",
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
console.log(
  "validatorii, constrângerile SQL și căile care ocolesc validarea au fost verificate",
);
