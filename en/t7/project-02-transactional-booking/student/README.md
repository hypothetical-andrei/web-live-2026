# Transactional Booking

## Your task

Book seats in one database transaction. Update availability, create the booking, and record the audit entry together; undo all three if any step fails.

Change only `src/book-seats.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

Install with `npm install`, run checks with `npm test`, and start the seeded API with `npm start` (default port `3000`). `POST /api/events/1/bookings` accepts `{ "attendeeId": 42, "seats": 2 }`.

`src/book-seats.js` is the booking module you complete. `src/unsafe-book-seats.js` is a deliberately unsafe, supplied comparison used to make partial writes observable; it is not production guidance.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
