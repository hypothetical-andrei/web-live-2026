// Compară instrucțiunile SQL reale pentru parcurgere lazy și încărcare eager. Urmărește
// aserțiunile, rândurile stocate și dovezile SQL, nu doar mesajul final.
import assert from "node:assert/strict";
import { DataTypes, Sequelize } from "sequelize";

const statements = [];
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: (sql) => statements.push(sql),
});
const Conference = sequelize.define(
  "Conference",
  { title: DataTypes.STRING },
  { timestamps: false },
);
const Session = sequelize.define(
  "Session",
  { title: DataTypes.STRING },
  { timestamps: false },
);
Conference.hasMany(Session, { as: "sessions", foreignKey: "conferenceId" });
Session.belongsTo(Conference, { as: "conference", foreignKey: "conferenceId" });
try {
  await sequelize.sync({ force: true });
  for (let number = 1; number <= 3; number += 1) {
    const conference = await Conference.create({ title: `Conferința ${number}` });
    await Session.create({ title: `Sesiunea ${number}`, conferenceId: conference.id });
  }

  statements.length = 0;
  const parents = await Conference.findAll({ order: [["id", "ASC"]] });
  for (const parent of parents) await parent.getSessions();
  const lazyCount = statements.length;

  statements.length = 0;
  const eager = await Conference.findAll({
    include: [{ model: Session, as: "sessions", attributes: ["id", "title"] }],
    order: [["id", "ASC"]],
  });
  const eagerCount = statements.length;
  assert.equal(lazyCount, 4);
  assert.equal(eagerCount, 1);
  assert.equal(eager[0].sessions.length, 1);
  console.table({ lazy: { statements: lazyCount }, eager: { statements: eagerCount } });
} finally {
  await sequelize.close();
}
