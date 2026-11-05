# Exercise Specification — Reservation Service Bug Hunt

## Learning objective

Find and fix the reservation model and storage bugs. Enforce the required constraints, wait for database operations, and return safe results without replacing the HTTP routes.

## Starting context

You have received an Express 5 service backed by Sequelize and SQLite. Its ordinary application files define a reservation model, connect to the database, create reservations, and expose list/create endpoints. The service starts and ordinary writes work, but edge cases do not meet the requirements below. There is no separate repair wrapper, unsafe example, or compatibility fallback.

## Your task

Find and fix the reservation model and storage bugs. Enforce the required constraints, wait for database operations, and return safe results without replacing the HTTP routes.

Work in the supplied `student/` project. Change only `src/models/reservation.js`, `src/reservation-store.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Expected behavior

Reservations contain `id`, `code`, `guestName`, `seats`, and timestamps. IDs are generated integers.

- A code is required, unique, and consists of 4–16 uppercase letters, digits, or hyphens. Remove surrounding whitespace before storing it.
- A guest name is required and must not be blank after trimming; store the trimmed name.
- Seats must be an integer from 1 to 8, and cannot be null.
- These rules apply to writes through the model as well as HTTP requests. Invalid and duplicate writes must not insert a row.
- `POST /api/reservations` returns `201`, a `Location` header, and `{ data: reservation }` only after persistence succeeds. `GET /api/reservations` lists stored rows by ascending ID.
- The store returns plain values, not Sequelize instances. They must be independent of the returned ORM object.
- Invalid data produces `400` with code `reservation_invalid`; duplicate codes produce `409` with code `reservation_exists`. Supplied shared error types define their public messages.
- Unexpected database failures keep their original error identity until supplied HTTP handling reports a generic `500`; public responses must not expose SQL, paths, or stack traces.
- The connection is closed on shutdown and after tests. The development server uses an in-memory database that resets on restart; file-backed durability is covered in Project 1.

## Your investigation

Run the service and record expected versus observed behavior for ordinary, invalid, whitespace-containing, and repeated-code submissions. Inspect the stored rows after each attempt. Use direct model checks to determine whether the rules exist below the HTTP layer. Trace a failed database operation to see how its rejection reaches the response.

Repair only `src/models/reservation.js` and `src/reservation-store.js`. The supplied routes, database wiring, shared errors, tests, and dependencies remain unchanged. Do not add wrappers, alternative models, or HTTP-only validation to bypass a model defect. You are not given TODOs marking the repairs.

## Verification

- Baseline: the real database initializes, ordinary rows can be created/listed, the page and health endpoint respond, and resources close cleanly.
- Objective: separate behavior checks cover required fields, code format, seat limits/integer values, normalization, uniqueness, detached results, asynchronous known-error handling, and public validation/conflict responses.
- Regression: malformed JSON, missing routes, generic internal errors, propagation of unexpected failures, and successful requests after a rejected write remain healthy.
- Reference: every check passes. Student: baseline and unrelated regressions pass; objective checks expose the defective behavior without source-text matching or requiring a particular repair syntax.

## Codex task

> Find and fix the reservation model and storage bugs. Enforce the required constraints, wait for database operations, and return safe results without replacing the HTTP routes. Change only `src/models/reservation.js`, `src/reservation-store.js`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension

After repair, repeat a duplicate-code request, then create a different valid reservation. Verify that the duplicate failed without inserting a row and that the connection still supports later writes.

## Authoring note — preparing the starter

Implement and validate the complete reference first. Copy it, then remove model constraints and normalization from the real model file, and replace awaited detached creation with a raw promise return inside the store’s existing error handler. Keep shared error handling operational, and document the two-file delta in derivation.md. Do not mark the defective branches with solution hints.

## Out of scope

Associations, transactions, availability rules, authentication, migrations, production deployment, and file-backed restart persistence.
