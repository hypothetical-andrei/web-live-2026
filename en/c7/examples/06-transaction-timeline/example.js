// Verify commit and rollback across inventory, booking and audit rows. Follow the
// assertions, stored rows and SQL evidence, not just the final message.
import assert from "node:assert/strict";
import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});
const Session = sequelize.define(
  "Session",
  { availableSeats: { type: DataTypes.INTEGER, allowNull: false } },
  { timestamps: false },
);
const Booking = sequelize.define(
  "Booking",
  { seats: { type: DataTypes.INTEGER, allowNull: false } },
  { timestamps: false },
);
const Audit = sequelize.define(
  "Audit",
  { action: { type: DataTypes.STRING, allowNull: false } },
  { timestamps: false },
);
try {
  await sequelize.sync({ force: true });
  const session = await Session.create({ availableSeats: 3 });

  async function book({ seats = 1, failAudit = false } = {}) {
    if (!Number.isInteger(seats) || seats <= 0) throw new Error("invalid_seats");
    return sequelize.transaction(async (transaction) => {
      const current = await Session.findByPk(session.id, { transaction });
      if (current.availableSeats < seats) throw new Error("insufficient_seats");
      current.availableSeats -= seats;
      await current.save({ transaction });
      const booking = await Booking.create({ seats }, { transaction });
      if (failAudit) throw new Error("audit unavailable");
      await Audit.create({ action: `booking:${booking.id}:created` }, { transaction });
      return { bookingId: booking.id, seats };
    });
  }
  await assert.rejects(book({ failAudit: true }), /audit unavailable/);
  assert.equal((await Session.findByPk(session.id)).availableSeats, 3);
  assert.equal(await Booking.count(), 0);
  assert.equal(await Audit.count(), 0);
  const result = await book();
  assert.equal(result.seats, 1);
  assert.equal((await Session.findByPk(session.id)).availableSeats, 2);
  assert.equal(await Booking.count(), 1);
  assert.equal(await Audit.count(), 1);
  for (const seats of [0, -1, 1.5, "1"])
    await assert.rejects(book({ seats }), /invalid_seats/);
  await assert.rejects(book({ seats: 3 }), /insufficient_seats/);
  assert.equal((await Session.findByPk(session.id)).availableSeats, 2);
  assert.equal(await Booking.count(), 1);
  assert.equal(await Audit.count(), 1);
} finally {
  await sequelize.close();
}
console.log("rollback and commit verified with a managed Sequelize transaction");
