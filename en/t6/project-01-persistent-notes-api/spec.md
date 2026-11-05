# Exercise Specification — Persistent Notes API

## Unit

Unit 06 — Persistence with Sequelize and SQLite

## Learning objective

Implement the supplied note-store interface using Sequelize and SQLite. Save changes before reporting success, preserve notes across restarts, and close the database when finished.

## Why this exercise exists

The previous unit's repository was intentionally in memory. This project keeps the familiar API boundary fixed so you can observe what persistence changes: connection/model setup, asynchronous queries, validation failures, reset/seed ownership, and data surviving a server restart.

## Prerequisites

- Unit 05 Express routing, injected repositories, validation, and centralized errors.
- JavaScript `async`/`await`, objects, and HTTP integration tests.
- Node.js LTS, npm, and basic relational table vocabulary.

## Starting context

You have received an Express 5 ESM notes API whose routes, request validation, response envelopes, not-found/error middleware, static page, server lifecycle, and tests are complete. The application accepts an injected store with `initialize`, `list`, `findById`, `create`, `update`, `remove`, and `close` methods.

The incomplete `src/note-store.js` exports `createNoteStore({ storage, logging = false })`. It must create its own Sequelize connection and `Note` model, but it must not know about Express. Production startup supplies a writable SQLite file path; tests supply either a temporary file or `:memory:`. A supplied seed array is passed only to `initialize({ reset, seed })`.

Notes have public fields `id`, `title`, `body`, `archived`, `createdAt`, and `updatedAt`. IDs are database-generated positive integers. Timestamps are ISO strings at the HTTP boundary; the store may return plain objects with `Date` values for the supplied serializer.

## Your task

Implement the supplied note-store interface using Sequelize and SQLite. Save changes before reporting success, preserve notes across restarts, and close the database when finished.

Work in the supplied `student/` project. Change only `src/note-store.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- Define `Note` with integer auto-increment primary key; non-null `title` string; non-null `body` text with default `""`; non-null boolean `archived` with default `false`; and Sequelize timestamps.
- Model validation rejects a title that becomes empty after trimming and trims valid titles before persistence.
- `initialize({ reset: true, seed })` drops/recreates the schema and inserts the exact deterministic seed once.
- `initialize({ reset: false, seed })` creates missing schema without deleting rows and seeds only when the table is empty.
- `list()` returns notes ordered by ascending `id` as detached plain objects.
- `findById(id)` returns one detached object or `null`.
- `create({ title, body = "", archived = false })` persists and returns the created note.
- `update(id, changes)` updates only supplied `title`, `body`, and `archived` fields, returns the updated note, and returns `null` for a missing ID.
- `remove(id)` returns `true` only when one row is deleted.
- Every method awaits its Sequelize operation; rejected model/database work propagates to supplied centralized handling.
- `close()` awaits connection closure and is safe after successful initialization.
- With a file-backed storage path, a created note remains visible after closing one store and creating/initializing another store against the same file with `reset: false`.

## Constraints

- JavaScript ESM, Node.js LTS, Express 5 in supplied code, Sequelize stable 6.x, SQLite via `sqlite3`, native `fetch`, and Node's test runner.
- Implement only `src/note-store.js`; preserve routes, serializers, fixtures, tests, manifests, and app/server lifecycle.
- Do not use raw SQL, migrations, associations, hooks unrelated to title normalization, or an additional repository/ORM package.
- Tests must never depend on a committed database file; temporary files are created per test and removed by the harness.
- Do not call `sync({ force: true })` unless `reset` is explicitly true.

## Observable completion criteria

- All categorized checks pass from the committed lock file.
- A live create/read/update/delete sequence retains the Unit 05 JSON/status contract.
- A file-backed restart check proves a created note survives connection closure and application recreation.
- Reset/seed checks produce identical IDs and rows across repeated test runs.
- Invalid model data reaches the supplied stable validation error without a partial row.
- The final student diff touches only `src/note-store.js`.

## Validation plan (for course authors)

### Baseline checks

- The supplied Express app, routes, serializer, health/static resources, and an injected fake store work independently of Sequelize.
- Temporary-directory and server lifecycle helpers clean up deterministically.

### Objective checks

- Model metadata and runtime validation match all field constraints/defaults.
- Reset/seed, ordered list, find, create, partial update, missing update, remove, and missing remove match the store contract.
- Returned values are detached from Sequelize instances.
- File-backed data survives close/reopen without reset.
- An injected logging flag is passed to Sequelize without changing behavior.

### Regression checks

- Malformed JSON, unknown routes, and HTTP validation remain owned by supplied Unit 05-style middleware.
- A rejected model validation creates no row and a later health/list request succeeds.
- Closing stores releases temporary SQLite files for cleanup.
- The store module imports no Express code and contains no HTTP statuses/envelopes.

## Authoring note — preparing the starter

After reference validation, copy the reference and remove only the Sequelize connection/model definition and method bodies from `src/note-store.js`, preserving the exported factory and method signatures with focused TODOs. The student version may use a supplied `createUnavailableStore()` fallback in the same module so baseline tests using an injected fake store remain healthy. Its real `initialize` is unavailable: normal server startup requires you to finish the store. No completed persistence operation remains.

Baseline and HTTP-only regression checks pass. Objective persistence checks fail with the documented unavailable-store error until you define the model, lifecycle, and CRUD methods. No model definition or completed query may be duplicated in tests, prose, fixtures, or generated database artifacts.

## Codex task

> Implement the supplied note-store interface using Sequelize and SQLite. Save changes before reporting success, preserve notes across restarts, and close the database when finished. Change only `src/note-store.js`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Remove `await` from one create call inside a `try`/`catch`. Trigger a model validation error, observe where the rejection escapes, and restore the smallest asynchronous ownership repair.

## Out of scope

- Associations, transactions, migrations, pagination/filtering, authentication, production connection pools, or deployment backups.
