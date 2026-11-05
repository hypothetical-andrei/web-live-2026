import { UniqueConstraintError, ValidationError } from "sequelize";
import { PersistenceConflictError, PersistenceValidationError } from "./errors.js";

export function createReservation(Reservation, input) {
  try {
    return Reservation.create(input);
  } catch (error) {
    if (error instanceof UniqueConstraintError) throw new PersistenceConflictError();
    if (error instanceof ValidationError) throw new PersistenceValidationError();
    throw error;
  }
}
