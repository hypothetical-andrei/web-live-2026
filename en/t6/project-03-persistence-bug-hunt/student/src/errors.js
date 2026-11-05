export class PersistenceValidationError extends Error {
  constructor() {
    super("Reservation violates persistence constraints");
    this.name = "PersistenceValidationError";
    this.code = "reservation_invalid";
  }
}

export class PersistenceConflictError extends Error {
  constructor() {
    super("Reservation code already exists");
    this.name = "PersistenceConflictError";
    this.code = "reservation_exists";
  }
}
