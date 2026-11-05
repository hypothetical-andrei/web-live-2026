export class PersistenceValidationError extends Error {
  constructor() {
    super("Rezervarea încalcă restricțiile de persistență");
    this.name = "PersistenceValidationError";
    this.code = "reservation_invalid";
  }
}

export class PersistenceConflictError extends Error {
  constructor() {
    super("Codul rezervării există deja");
    this.name = "PersistenceConflictError";
    this.code = "reservation_exists";
  }
}
