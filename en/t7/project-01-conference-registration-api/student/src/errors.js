export class ConferenceEntityNotFoundError extends Error {
  constructor(entity) {
    super(`${entity} not found`);
    this.name = "ConferenceEntityNotFoundError";
    this.code = `${entity}_not_found`;
  }
}

export class RegistrationExistsError extends Error {
  constructor() {
    super("Registration already exists");
    this.name = "RegistrationExistsError";
    this.code = "registration_exists";
  }
}
