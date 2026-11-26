// Repetă PUT și DELETE la URL-ul care identifică perechea sesiune/participant. Urmărește
// aserțiunile, rândurile stocate și dovezile SQL, nu doar mesajul final.
import assert from "node:assert/strict";
import express from "express";
import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});
const Session = sequelize.define(
  "Session",
  { title: DataTypes.STRING },
  { timestamps: false },
);
const Attendee = sequelize.define(
  "Attendee",
  { name: DataTypes.STRING },
  { timestamps: false },
);
const Registration = sequelize.define(
  "Registration",
  { ticketType: { type: DataTypes.STRING, allowNull: false } },
  { timestamps: false },
);
Session.belongsToMany(Attendee, {
  through: Registration,
  foreignKey: "sessionId",
  otherKey: "attendeeId",
});
Attendee.belongsToMany(Session, {
  through: Registration,
  foreignKey: "attendeeId",
  otherKey: "sessionId",
});
let server;
try {
  await sequelize.sync({ force: true });
  await Session.create({ id: 7, title: "Tranzacții" });
  await Attendee.create({ id: 42, name: "Ana" });

  const app = express();
  app.use(express.json());
  app.put(
    "/api/sessions/:sessionId/registrations/:attendeeId",
    async (request, response) => {
      const identity = {
        sessionId: request.params.sessionId,
        attendeeId: request.params.attendeeId,
      };
      let registration = await Registration.findOne({ where: identity });
      const created = registration === null;
      if (created)
        registration = await Registration.create({
          ...identity,
          ticketType: request.body.ticketType,
        });
      else {
        registration.ticketType = request.body.ticketType;
        await registration.save();
      }
      response.status(created ? 201 : 200).json({ data: registration });
    },
  );
  app.delete(
    "/api/sessions/:sessionId/registrations/:attendeeId",
    async (request, response) => {
      await Registration.destroy({
        where: {
          sessionId: request.params.sessionId,
          attendeeId: request.params.attendeeId,
        },
      });
      response.status(204).end();
    },
  );
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/sessions/7/registrations/42`;
  const options = {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ticketType: "student" }),
  };
  assert.equal((await fetch(url, options)).status, 201);
  assert.equal((await fetch(url, options)).status, 200);
  assert.equal(await Registration.count(), 1);
  assert.equal((await Registration.findOne()).ticketType, "student");
  assert.equal((await fetch(url, { method: "DELETE" })).status, 204);
  assert.equal(await Registration.count(), 0);
  assert.equal((await fetch(url, { method: "DELETE" })).status, 204);
  assert.equal(await Registration.count(), 0);
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
  await sequelize.close();
}
console.log("resursa idempotentă de apartenență a fost verificată");
