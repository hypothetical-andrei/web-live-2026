export class BookingValidationError extends Error {
  constructor() { super("Numărul de locuri trebuie să fie un întreg pozitiv"); this.code = "booking_invalid"; }
}
export class EventNotFoundError extends Error {
  constructor() { super("Evenimentul nu a fost găsit"); this.code = "event_not_found"; }
}
export class SoldOutError extends Error {
  constructor() { super("Nu sunt disponibile suficiente locuri"); this.code = "sold_out"; }
}
export class BookingExistsError extends Error {
  constructor() { super("Participantul are deja o rezervare"); this.code = "booking_exists"; }
}

export const knownBookingErrors = [
  BookingValidationError,
  EventNotFoundError,
  SoldOutError,
  BookingExistsError,
];
