export class QueryValidationError extends Error {
  constructor(parameter) {
    super(`Invalid query parameter: ${parameter}`);
    this.name = "QueryValidationError";
    this.code = "invalid_query";
  }
}

export function buildNoteQuery(_query) {
  // TODO: validate and translate the closed query language into Sequelize options.
  return { order: [["updatedAt", "DESC"], ["id", "ASC"]] };
}
