// Artefact de audit intenționat nesigur. Nu îl folosi drept cod recomandat.
export function unsafeNormalizeEvents(events) {
  return events.sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt)).map((event) => ({
    id: String(event.id), occurredAt: event.occurredAt, active: Boolean(event.active), durationMs: Number(event.durationMs)
  }));
}
