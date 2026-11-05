# Project 03 — Reservation Service Bug Hunt

## What you need to do

Find and fix the reservation model and storage bugs. Enforce the required constraints, wait for database operations, and return safe results without replacing the HTTP routes.

Work in `student/`. Change only `src/models/reservation.js`, `src/reservation-store.js`.

## Goal

Investigate a reservation service that runs but does not reliably enforce its requirements. You have received ordinary application code; locate the defects through behavior and repair the model and store.

## Investigation

Read `spec.md`, start the service, and compare expected and observed results. Record each request, response status/body, and the rows left in the database. Include ordinary inputs, invalid values, surrounding whitespace, and repeated reservation codes. The in-memory database resets when you restart the server.

Check the model directly as well as the HTTP endpoints: a route is not the only possible source of database writes. Trace the call from the route through creation to the returned value or error. Distinguish invalid data from a duplicate code and from an unexpected database failure.

Build an evidence table before requesting changes. You may use the tests to narrow the investigation, but explain the observed behavior yourself. Give Codex the task in `spec.md` and your evidence; review its proposed changes rather than accepting its diagnosis as authoritative.

## Repair and verify

Edit only `src/models/reservation.js` and `src/reservation-store.js`. Keep the supplied HTTP handling, database setup, shared errors, dependencies, and tests. Repair the actual application code; do not add an alternate model or a fallback.

Run the baseline, regression, and objective checks. Repeat your API probes and inspect stored rows. Confirm that a rejected write inserts nothing and that a later valid write still succeeds. Explain why the changed code produces the required behavior.

## Done when

All checks pass; reservations satisfy the documented rules; stored strings are normalized; success means the row was created; invalid and duplicate requests receive the documented errors; callers receive ordinary data rather than ORM instances. Your diff is confined to the two application files.
