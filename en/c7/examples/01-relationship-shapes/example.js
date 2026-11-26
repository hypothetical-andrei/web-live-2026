// Model cardinality with keys and constraints, then navigate with Sequelize associations.
// Follow the assertions, stored rows and SQL evidence, not just the final message.
import assert from "node:assert/strict";
import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "simple.db",
  logging: false,
});
const Conference = sequelize.define(
  "Conference",
  { title: { type: DataTypes.STRING, allowNull: false } },
  { timestamps: false },
);
const Session = sequelize.define(
  "Session",
  { title: { type: DataTypes.STRING, allowNull: false } },
  { timestamps: false },
);
const Attendee = sequelize.define(
  "Attendee",
  { name: { type: DataTypes.STRING, allowNull: false } },
  { timestamps: false },
);
const Registration = sequelize.define(
  "Registration",
  {
    ticketType: {
      type: DataTypes.ENUM("student", "speaker", "standard"),
      allowNull: false,
    },
  },
  { timestamps: false, indexes: [{ unique: true, fields: ["sessionId", "attendeeId"] }] },
);

const Profile = sequelize.define(
  "Profile",
  {
    bio: DataTypes.TEXT,
    attendeeId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  },
  { timestamps: false },
);
Attendee.hasOne(Profile, {
  as: "profile",
  foreignKey: "attendeeId",
  onDelete: "CASCADE",
});
Profile.belongsTo(Attendee, {
  as: "attendee",
  foreignKey: "attendeeId",
  onDelete: "CASCADE",
});

Conference.hasMany(Session, {
  as: "sessions",
  foreignKey: { name: "conferenceId", allowNull: false },
  onDelete: "RESTRICT",
});
Session.belongsTo(Conference, {
  as: "conference",
  foreignKey: "conferenceId",
  onDelete: "RESTRICT",
});
Session.belongsToMany(Attendee, {
  through: Registration,
  as: "attendees",
  foreignKey: "sessionId",
  otherKey: "attendeeId",
});
Attendee.belongsToMany(Session, {
  through: Registration,
  as: "sessions",
  foreignKey: "attendeeId",
  otherKey: "sessionId",
});

try {
  await sequelize.sync({ force: true });
  const conference = await Conference.create({ title: "Web Week" });
  const session = await Session.create({ title: "HTTP", conferenceId: conference.id });
  const attendee = await Attendee.create({ name: "Ana" });
  await Registration.create({
    sessionId: session.id,
    attendeeId: attendee.id,
    ticketType: "student",
  });

  await Profile.create({ attendeeId: attendee.id, bio: "Web student" });
  assert.equal((await attendee.getProfile()).attendeeId, attendee.id);
  await assert.rejects(Profile.create({ attendeeId: attendee.id }), {
    name: "SequelizeUniqueConstraintError",
  });
  await assert.rejects(Session.create({ title: "Orphan", conferenceId: 99999 }), {
    name: "SequelizeForeignKeyConstraintError",
  });
  await assert.rejects(conference.destroy(), {
    name: "SequelizeForeignKeyConstraintError",
  });

  const secondSession = await Session.create({
    title: "SQLite",
    conferenceId: conference.id,
  });
  await Registration.create({
    sessionId: secondSession.id,
    attendeeId: attendee.id,
    ticketType: "standard",
  });
  assert.equal(await Attendee.count(), 1);

  const graph = await Conference.findByPk(conference.id, {
    order: [[{ model: Session, as: "sessions" }, "id", "ASC"]],
    include: [
      {
        model: Session,
        as: "sessions",
        include: [
          { model: Attendee, as: "attendees", through: { attributes: ["ticketType"] } },
        ],
      },
    ],
  });
  assert.equal(graph.sessions.length, 2);
  assert.equal(graph.sessions[0].conferenceId, conference.id);
  assert.equal(graph.sessions[1].attendees[0].Registration.ticketType, "standard");
  assert.equal(graph.sessions[0].attendees[0].Registration.ticketType, "student");
  await assert.rejects(
    Registration.create({
      sessionId: session.id,
      attendeeId: attendee.id,
      ticketType: "speaker",
    }),
    { name: "SequelizeUniqueConstraintError" },
  );
  console.log(JSON.stringify(graph, null, 2));
  await attendee.destroy();
  assert.equal(await Profile.count(), 0);
  assert.equal(await Registration.count(), 0);
  assert.equal(await Session.count(), 2);
} finally {
  await sequelize.close();
}
