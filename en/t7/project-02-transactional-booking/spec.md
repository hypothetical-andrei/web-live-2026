# Exercise Specification — Transactional Booking

## Unit

Unit 07 — Relationships, Transactions and API Design

## Learning objective

Book seats in one database transaction. Update availability, create the booking, and record the audit entry together; undo all three if any step fails.

## Why this exercise exists

Awaiting three database statements is not the same as making them atomic. A booking is valid only when capacity decrement, unique reservation, and audit event succeed together. You need observable commit/rollback behavior rather than transaction syntax in isolation.

## Prerequisites

- Unit 07 lecture associations and Unit 06 persistence/error handling. The models are supplied; completing Project 1 is not required.
- Promise rejection, centralized errors, and relational uniqueness.

## Starting context

You have received a supplied Sequelize/SQLite model set and Express booking endpoint:

- `Event` has `capacity` and `availableSeats` non-null integers;
- `Booking` has unique `(eventId, attendeeId)` and positive `seats`;
- `BookingAudit` records `bookingId`, `eventId`, `attendeeId`, `seats`, and action `created`;
- foreign keys/associations, schema lifecycle, route parsing, serializers, domain errors, and tests are complete.

The incomplete `src/book-seats.js` exports `bookSeats({ sequelize, Event, Booking, BookingAudit }, { eventId, attendeeId, seats, afterBookingCreated })`. The optional injected callback defaults to a no-op and exists only for deterministic failure injection after booking creation.

## Your task

Book seats in one database transaction. Update availability, create the booking, and record the audit entry together; undo all three if any step fails.

Work in the supplied `student/` project. Change only `src/book-seats.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- Reject non-integer or non-positive `seats` with supplied `BookingValidationError` before opening a transaction.
- Execute all database reads/writes inside one managed `sequelize.transaction(async transaction => ...)` callback and pass the transaction option to every call.
- Load the event inside the transaction; missing event throws supplied `EventNotFoundError`.
- If `availableSeats < seats`, throw supplied `SoldOutError` without changing rows.
- Detect an existing `(eventId, attendeeId)` booking and throw supplied `BookingExistsError`.
- Decrement `availableSeats` by exactly `seats` and await persistence.
- Create one Booking, invoke/await `afterBookingCreated({ booking, transaction })`, then create one matching BookingAudit in the same transaction.
- Return detached `{ booking, event }` only after the managed transaction commits.
- Unique constraint races map to `BookingExistsError`; known domain errors preserve identity; unexpected callback/database errors propagate unchanged after rollback.
- Any failure after any intermediate step leaves available seats, Booking count, and BookingAudit count exactly as before the call.
- A successful second booking observes the committed seat count from the first.

## Constraints

- JavaScript ESM, Sequelize 6.37.8, sqlite3 6.0.1, supplied Express 5 code, native `fetch`, and Node's test runner; retain audit-clean pins/override.
- Implement only `src/book-seats.js`; do not edit models, routes, error middleware, tests, or dependencies.
- Use one managed transaction; no manual SQL `BEGIN/COMMIT`, nested transaction, compensating write, or process-local mutex.
- Do not catch and replace unexpected errors.
- SQLite tests demonstrate atomic rollback; production-grade high-concurrency locking differences are explained but out of scope.

## Observable completion criteria

- Successful HTTP booking returns `201`, booking/event data, and reduced availability only after commit.
- Missing/sold-out/duplicate/invalid cases return stable errors and change no rows.
- Injected failure after booking creation proves seat update and booking are rolled back and no audit remains.
- Injected audit create failure proves the same full rollback and preserves original error identity.
- Captured query options show the same transaction object on every operation.
- All checks/audit pass and only `src/book-seats.js` changes.

