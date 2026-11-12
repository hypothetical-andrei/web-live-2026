export class ApiError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
export class InvalidQueryError extends ApiError {
  constructor() { super(400, "invalid_query", "Parametrii interogării sunt invalizi"); }
}
export class RegistrationBodyError extends ApiError {
  constructor() { super(400, "invalid_registration", "Body-ul trebuie să conțină exact un ticketType valid"); }
}
export class JsonRequiredError extends ApiError {
  constructor() { super(415, "json_required", "Content-Type trebuie să fie application/json"); }
}
export class SessionNotFoundError extends ApiError {
  constructor() { super(404, "session_not_found", "Sesiunea nu a fost găsită"); }
}
export class AttendeeNotFoundError extends ApiError {
  constructor() { super(404, "attendee_not_found", "Participantul nu a fost găsit"); }
}
