import { BookingExistsError, BookingValidationError, EventNotFoundError, SoldOutError } from "./errors.js";
import { unsafeBookSeats } from "./unsafe-book-seats.js";

// TODO: replace this supplied unsafe comparison with one managed transaction.
// Keep these imports: the completed service must classify each domain outcome.
void [BookingExistsError, BookingValidationError, EventNotFoundError, SoldOutError];

export async function bookSeats(database, request) {
  return unsafeBookSeats(database, request);
}
