import { AttendeeNotFoundError, SessionNotFoundError } from "./errors.js";

const key = (sessionId, attendeeId) => `${sessionId}:${attendeeId}`;
export function createRegistrationService() {
  const sessions = new Set(["1", "2"]);
  const attendees = new Set(["10", "11", "12"]);
  const records = new Map([[key("1", "10"), { sessionId: "1", attendeeId: "10", ticketType: "standard", registeredAt: "2026-08-10T09:00:00.000Z" }]]);
  const requireSession = (id) => { if (!sessions.has(String(id))) throw new SessionNotFoundError(); };
  const requireAttendee = (id) => { if (!attendees.has(String(id))) throw new AttendeeNotFoundError(); };
  return {
    async list({ sessionId, ticketType, limit, offset }) {
      requireSession(sessionId);
      const all = [...records.values()].filter((item) => item.sessionId === String(sessionId) && (!ticketType || item.ticketType === ticketType));
      return { data: all.slice(offset, offset + limit), count: all.length };
    },
    async put({ sessionId, attendeeId, ticketType }) {
      requireSession(sessionId); requireAttendee(attendeeId);
      const identity = key(sessionId, attendeeId); const existing = records.get(identity);
      if (existing?.ticketType === ticketType) return { outcome: "existing", registration: { ...existing } };
      const registration = { sessionId: String(sessionId), attendeeId: String(attendeeId), ticketType, registeredAt: existing?.registeredAt ?? "2026-08-10T10:00:00.000Z" };
      records.set(identity, registration);
      return { outcome: existing ? "updated" : "created", registration: { ...registration } };
    },
    async remove({ sessionId, attendeeId }) {
      requireSession(sessionId); requireAttendee(attendeeId);
      return { outcome: records.delete(key(sessionId, attendeeId)) ? "removed" : "absent" };
    },
    snapshot: () => [...records.values()].map((item) => ({ ...item })),
  };
}
