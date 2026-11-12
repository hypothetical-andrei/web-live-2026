import { DataTypes } from "sequelize";

export function defineModels(sequelize) {
  const Event = sequelize.define("Event", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    availableSeats: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
  }, { timestamps: false });
  const Booking = sequelize.define("Booking", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    eventId: { type: DataTypes.INTEGER, allowNull: false },
    attendeeId: { type: DataTypes.INTEGER, allowNull: false },
    seats: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  }, { timestamps: false, indexes: [{ unique: true, fields: ["eventId", "attendeeId"] }] });
  const BookingAudit = sequelize.define("BookingAudit", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER, allowNull: false },
    eventId: { type: DataTypes.INTEGER, allowNull: false },
    attendeeId: { type: DataTypes.INTEGER, allowNull: false },
    seats: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false, validate: { isIn: [["created"]] } },
  }, { timestamps: false });
  Event.hasMany(Booking, { as: "bookings", foreignKey: "eventId", onDelete: "CASCADE" });
  Booking.belongsTo(Event, { as: "event", foreignKey: "eventId" });
  Booking.hasMany(BookingAudit, { as: "auditEntries", foreignKey: "bookingId", onDelete: "CASCADE" });
  BookingAudit.belongsTo(Booking, { as: "booking", foreignKey: "bookingId" });
  return { Event, Booking, BookingAudit };
}
