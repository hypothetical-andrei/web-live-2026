import { DataTypes } from "sequelize";

export function defineReservation(sequelize) {
  return sequelize.define("Reservation", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: DataTypes.STRING,
    guestName: DataTypes.STRING,
    seats: DataTypes.INTEGER,
  });
}
