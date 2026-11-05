# Exercise Specification — Query API

## Unit

Unit 06 — Persistence with Sequelize and SQLite

## Learning objective

Validate the API query parameters and translate the accepted values into Sequelize query options. Support the specified filtering, search, sorting, selected fields, and result limits.

## Why this exercise exists

CRUD alone hides much of persistence work. Query parameters become useful only when their types, allowed values, ORM operators, projection rules, and stable ordering are explicit. A dedicated translator keeps the API contract inspectable and testable independently of Express and SQLite.

## Prerequisites

- Persistent Notes API and Sequelize model/query basics.
- URL query parameters, strict validation, array/object transformations, and API envelopes.

## Starting context

You have received a complete Express/Sequelize notes application with deterministic in-memory test database, seeded `Note` model, app/store lifecycle, serializer, static page, and `GET /api/notes` route. The route passes `request.query` to an incomplete `buildNoteQuery(query)` in `src/note-query.js`, then calls `Note.findAll(options)` and returns `{ data }`.

The accepted query parameters are `owner`, `archived`, `search`, `sort`, and `fields`. Each may appear at most once. Unknown or repeated parameters must be rejected before Sequelize executes.

## Your task

Validate the API query parameters and translate the accepted values into Sequelize query options. Support the specified filtering, search, sorting, selected fields, and result limits.

Work in the supplied `student/` project. Change only `src/note-query.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- With no parameters, return all notes ordered by `updatedAt` descending and `id` ascending as a deterministic tie-breaker.
- `owner=<nonblank>` filters exact owner after trimming.
- `archived=true|false` filters the exact boolean; no other spelling or coercion is accepted.
- The supplied checks also inspect the Sequelize options structure, including combined conditions under `where[Op.and]` and the order of selected attributes. Read those expectations before implementing the query builder.
- `search=<nonblank>` performs a case-insensitive substring match against title using a SQLite-compatible Sequelize expression; wildcard characters are treated as literal search text rather than raw SQL.
- `sort=updated_desc|updated_asc|title_asc` maps only to documented attribute/direction pairs and always adds ascending `id` as a final tie-breaker.
- `fields` is a comma-separated subset of `title`, `owner`, `archived`, and `updatedAt`; trim entries, reject empty/unknown/duplicate names, and always include `id`.
- Combine filters with AND semantics in one `where` option.
- Omit `where` or `attributes` when no corresponding constraint was supplied.
- Return a new options object and never mutate `query`.
- Invalid input throws `QueryValidationError` with stable public `code: 'invalid_query'` and a message naming only the invalid parameter, not generated SQL.
- The supplied error middleware maps that error to `400` and the standard error envelope; other database errors remain sanitized `500` responses.

## Constraints

- JavaScript ESM, Sequelize stable 6.x, SQLite, Express 5 supplied code, native `fetch`, and Node's test runner.
- Implement only `src/note-query.js`; do not edit route/model/seed/error middleware or tests.
- Use Sequelize operators/functions, not raw SQL strings or post-query in-memory filtering/sorting/projection.
- Do not accept arbitrary column names or sort directions from the request.
- Keep the query language deliberately small; no pagination or associations in this unit.

## Observable completion criteria

- Focused translator and integration checks pass.
- Browser/`curl` requests demonstrate one combined filter, each sort mode, and one projection.
- Invalid/repeated/unknown parameters return `400 invalid_query` and execute no model query.
- Equal primary sort values always return ascending IDs.
- The generated SQL can be inspected in a debugging variation, but SQL text is not part of public errors.
- Only `src/note-query.js` changes.

## Validation plan (for course authors)

### Baseline checks

- Supplied Sequelize connection, model, seed, route, serializer, and error middleware work with a known fixed options object.
- Seed data makes every filter/sort/projection result deterministic.

### Objective checks

- Unit checks inspect exact `where`, `order`, and `attributes` option structure for every accepted parameter and combination.
- Integration checks prove returned rows for owner/archived/search filters, all sort modes, tie-breaking, and projections.
- Invalid booleans, blanks, sort modes, fields, duplicates, repeats, and unknown parameters throw before `findAll`.
- Frozen query input remains unchanged.

### Regression checks

- Default listing and supplied health/static/error behavior remain healthy.
- Query values cannot inject attribute names, directions, SQL fragments, or response internals.
- A failed query is followed successfully by a valid list request.
- Database instances are closed after every test.

## Authoring note — preparing the starter

After validating the reference, copy it and replace only the query validation/translation bodies in `src/note-query.js` with the exported `QueryValidationError` shell and a TODO translator returning the supplied deterministic default order. Preserve every other file.

Your starting app remains runnable and the unfiltered default list works, so baseline/regression checks unrelated to query features pass. Objective filter/sort/projection and invalid-query checks fail in the documented way. The default alone does not reveal how accepted parameters map to Sequelize.

## Codex task

> Validate the API query parameters and translate the accepted values into Sequelize query options. Support the specified filtering, search, sorting, selected fields, and result limits. Change only `src/note-query.js`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Remove the ID tie-breaker from one sort mode and use equal seeded values. Reproduce nondeterministic/contract-incomplete ordering, then restore explicit deterministic order.

## Out of scope

- Pagination, full-text search, ranking, associations, transactions, raw SQL, database-specific production search, or client UI controls.
