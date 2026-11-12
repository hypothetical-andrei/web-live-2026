export class ApiError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
export class InvalidQueryError extends ApiError {
  constructor() { super(400, "invalid_query", "Query parameters are invalid"); }
}
export class RegistrationBodyError extends ApiError {
  constructor() { super(400, "invalid_registration", "Body must contain exactly one valid ticketType"); }
}
export class JsonRequiredError extends ApiError {
  constructor() { super(415, "json_required", "Content-Type must be application/json"); }
}
export class SessionNotFoundError extends ApiError {
  constructor() { super(404, "session_not_found", "Session not found"); }
}
export class AttendeeNotFoundError extends ApiError {
  constructor() { super(404, "attendee_not_found", "Attendee not found"); }
}
