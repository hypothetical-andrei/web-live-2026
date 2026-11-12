# Exercise Specification — Conference Registration API

## Unit

Unit 07 — Relationships, Transactions and API Design

## Learning objective

Define the conference, session, attendee, and registration relationships in Sequelize. Implement the required reads while keeping foreign keys, registration fields, and query counts correct.

## Why this exercise exists

Independent tables do not explain how an ORM represents domain relationships. You need to see foreign keys, association direction, junction-table identity, and eager-loaded result shape together—while retaining enough SQL awareness to verify what the ORM creates.

## Prerequisites

- Unit 06 Sequelize/SQLite models, constraints, queries, lifecycle, and error handling.
- Unit 05 resource-oriented Express APIs.
- Basic primary-key/foreign-key vocabulary.

## Starting context

You have received an Express 5 ESM conference API with pinned/audit-clean Sequelize 6 + SQLite dependencies, deterministic database harness, request/error middleware, serializers, routes, fixtures, and tests. All objective work is confined to `src/conference-model.js`, exporting:

- `defineConferenceModel(sequelize)`, returning `{ Conference, Session, Attendee, Registration }`;
- `listSessionsWithRegistrations(models, { conferenceId })`;
- `registerAttendee(models, { sessionId, attendeeId, ticketType })`.

Supplied routes expose:

- `GET /api/conferences/:conferenceId/sessions`;
- `POST /api/sessions/:sessionId/registrations` with `{ attendeeId, ticketType }`.

The database harness owns `sync`, reset/seed, and close. Serializers own public JSON; the objective module owns only relational metadata and ORM operations.

## Your task

Define the conference, session, attendee, and registration relationships in Sequelize. Implement the required reads while keeping foreign keys, registration fields, and query counts correct.

Work in the supplied `student/` project. Change only `src/conference-model.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- `Conference`: integer primary key and non-null unique `slug`.
- `Session`: integer primary key, non-null `title`, non-null `startsAt`, and non-null `conferenceId` foreign key with cascade delete.
- `Attendee`: integer primary key and non-null unique `email`.
- `Registration`: explicit junction model with composite uniqueness over `sessionId` + `attendeeId`, non-null `ticketType` restricted to `standard|student|speaker`, and `registeredAt` defaulting to current time.
- Configure `Conference.hasMany(Session)` / `Session.belongsTo(Conference)` with aliases `sessions` / `conference`.
- Configure `Session.belongsToMany(Attendee)` / `Attendee.belongsToMany(Session)` through `Registration`, with aliases `attendees` / `sessions` and matching foreign/other keys.
- Configure direct `Session.hasMany(Registration)` and `Attendee.hasMany(Registration)` associations so junction attributes can be queried explicitly.
- `listSessionsWithRegistrations` filters by `conferenceId`, orders sessions by `startsAt ASC, id ASC`, and eager-loads attendees ordered deterministically by attendee ID through registrations.
- Each eager-loaded attendee exposes junction `ticketType` and `registeredAt`; unrelated model attributes are not selected by the objective query.
- `registerAttendee` verifies both parent records exist, creates exactly one junction row, returns a detached registration, and classifies missing session/attendee and duplicate registration through supplied domain error classes.
- Every association/model query is awaited and unexpected database errors propagate unchanged.

## Constraints

- JavaScript ESM, Sequelize 6.37.8, sqlite3 6.0.1, Express 5 supplied code, native `fetch`, and Node's test runner; retain the audited `uuid` override.
- Implement only `src/conference-model.js`; preserve app/routes/serializers/fixtures/tests/package files.
- Use Sequelize associations and eager loading, not manual in-memory joins, N+1 per-session queries, raw SQL, or duplicate denormalized attendee arrays.
- Do not add transactions to this exercise; atomic multi-step work is Project 2.
- Tests use isolated in-memory databases and close every connection.

## Observable completion criteria

- Metadata checks prove all foreign keys, aliases, through model, uniqueness, delete behavior, and junction validators.
- Seeded API output contains sessions with deterministic attendee/junction data and no N+1 query pattern.
- Creating a registration returns `201` and a nested `Location`; repeating it returns the supplied `409 registration_exists` error.
- Missing session/attendee paths return their stable `404` errors.
- Cascade deletion removes dependent sessions/registrations as verified at the database layer.
- Only `src/conference-model.js` changes and all checks/audit pass.

