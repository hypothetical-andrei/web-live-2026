# Reservation Service

## Your task

Find and fix the reservation model and storage bugs. Enforce the required constraints, wait for database operations, and return safe results without replacing the HTTP routes.

Change only `src/models/reservation.js`, `src/reservation-store.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

Run `npm ci` and `npm start`; open the printed loopback URL. The development SQLite database is in memory and resets on restart. Use `/api/reservations` to list rows or submit JSON with `code`, `guestName`, and `seats`.

Run `npm run test:baseline`, `npm run test:regression`, and `npm run test:objective`. Baseline and regression pass in the starter, while objective tests expose incorrect persistence behavior. All checks pass in the reference.

Investigate using spec.md and your own requests. Repair only `src/models/reservation.js` and `src/reservation-store.js`; preserve the supplied HTTP code, tests, shared errors, and database setup.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
