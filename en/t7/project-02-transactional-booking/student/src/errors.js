export class BookingValidationError extends Error {
  constructor() { super("Seats must be a positive integer"); this.code = "booking_invalid"; }
}
export class EventNotFoundError extends Error {
  constructor() { super("Event not found"); this.code = "event_not_found"; }
}
export class SoldOutError extends Error {
  constructor() { super("Not enough seats available"); this.code = "sold_out"; }
}
export class BookingExistsError extends Error {
  constructor() { super("Attendee already has a booking"); this.code = "booking_exists"; }
}

export const knownBookingErrors = [
  BookingValidationError,
  EventNotFoundError,
  SoldOutError,
  BookingExistsError,
];
