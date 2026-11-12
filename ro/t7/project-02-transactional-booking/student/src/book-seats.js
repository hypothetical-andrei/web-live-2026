import { BookingExistsError, BookingValidationError, EventNotFoundError, SoldOutError } from "./errors.js";
import { unsafeBookSeats } from "./unsafe-book-seats.js";

// TODO: înlocuiește comparația nesigură furnizată cu o tranzacție gestionată.
// Păstrează importurile: serviciul final trebuie să clasifice fiecare rezultat de domeniu.
void [BookingExistsError, BookingValidationError, EventNotFoundError, SoldOutError];

export async function bookSeats(database, request) {
  return unsafeBookSeats(database, request);
}
