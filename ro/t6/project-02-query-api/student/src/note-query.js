export class QueryValidationError extends Error {
  constructor(parameter) {
    super(`Parametru de interogare invalid: ${parameter}`);
    this.name = "QueryValidationError";
    this.code = "invalid_query";
  }
}

export function buildNoteQuery(_query) {
  // TODO: validează și traduce limbajul închis de interogare în opțiuni Sequelize.
  return { order: [["updatedAt", "DESC"], ["id", "ASC"]] };
}
