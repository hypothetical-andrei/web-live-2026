// Încarcă asocieri alăturate și o asociere imbricată într-un graf mic.
// Urmărește conference și attendees la același nivel, apoi attendee.profile;
// aserțiunile arată că relațiile opționale absente rămân null sau goale.
import assert from "node:assert/strict";
import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({ dialect: "sqlite", storage: "my.db", logging: true });
const Conference = sequelize.define("Conference", { title: DataTypes.STRING }, { timestamps: false });
const Session = sequelize.define("Session", { title: DataTypes.STRING }, { timestamps: false });
const Attendee = sequelize.define("Attendee", { name: DataTypes.STRING }, { timestamps: false });
const Profile = sequelize.define("Profile", { bio: DataTypes.STRING }, { timestamps: false });
Conference.hasMany(Session, { as: "sessions", foreignKey: "conferenceId" });
Session.belongsTo(Conference, { as: "conference", foreignKey: "conferenceId" });
Session.belongsToMany(Attendee, { as: "attendees", through: "Registration" });
Attendee.belongsToMany(Session, { as: "sessions", through: "Registration" });
Attendee.hasOne(Profile, { as: "profile", foreignKey: { name: "attendeeId", unique: true } });
Profile.belongsTo(Attendee, { as: "attendee", foreignKey: "attendeeId" });
try {
  await sequelize.sync({ force: true });
  const conference = await Conference.create({ title: "Web" });
  const session = await Session.create({ title: "HTTP", conferenceId: conference.id });
  const empty = await Session.create({ title: "CSS", conferenceId: conference.id });
  const ana = await Attendee.create({ name: "Ana" });
  const dan = await Attendee.create({ name: "Dan" });
  await Profile.create({ bio: "Web", attendeeId: ana.id });
  await session.addAttendees([ana, dan]);
  const rows = await Session.findAll({
    include: [
      { association: "conference" },
      { association: "attendees", through: { attributes: [] },
        include: [{ association: "profile" }] },
    ],
    order: [["id", "ASC"]],
  });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].conference.title, "Web");
  assert.deepEqual(rows[0].attendees.map(a => a.name).sort(), ["Ana", "Dan"]);
  assert.equal(rows[0].attendees.find(a => a.name === "Ana").profile.bio, "Web");
  assert.equal(rows[0].attendees.find(a => a.name === "Dan").profile, null);
  assert.equal(rows[1].id, empty.id);
  assert.deepEqual(rows[1].attendees, []);
  console.log(JSON.stringify(rows.map(row => row.toJSON()), null, 2));
} finally {
  await sequelize.close();
}
