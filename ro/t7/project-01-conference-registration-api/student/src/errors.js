export class ConferenceEntityNotFoundError extends Error {
  constructor(entity) {
    super(`${entity} nu a fost găsit`);
    this.name = "ConferenceEntityNotFoundError";
    this.code = `${entity}_not_found`;
  }
}

export class RegistrationExistsError extends Error {
  constructor() {
    super("Înscrierea există deja");
    this.name = "RegistrationExistsError";
    this.code = "registration_exists";
  }
}
