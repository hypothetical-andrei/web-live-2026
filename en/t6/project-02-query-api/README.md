# Project 02 — Query API

## What you need to do

Validate the API query parameters and translate the accepted values into Sequelize query options. Support the specified filtering, search, sorting, selected fields, and result limits.

Work in `student/`. Change only `src/note-query.js`.

## How to work

Inspect seeded rows and write expected result IDs for each filter/sort before editing. Separate validation from option construction and use the supplied error boundary.

Give Codex the task from `spec.md`. Review for raw SQL, arbitrary fields/directions, truthy boolean conversion, wildcard interpretation, missing ID tie-breakers, query mutation, or in-memory post-processing.

## Check your result

- All categorized checks and audit pass.
- Owner/archived/search filters combine with AND semantics.
- Sort modes are allowlisted and deterministic.
- Projection always includes ID and rejects invalid/duplicate fields.
- Invalid input executes no query and returns `400 invalid_query`.
- Only `src/note-query.js` changes.

## Debugging task

Remove the ID tie-breaker for equal `updatedAt` values. Explain why primary sort alone is contract-incomplete, then restore explicit deterministic order.

## What you should be able to explain

- Public query language versus ORM options.
- Safe operator/expression construction.
- Projection and deterministic order.
- Why rejection must happen before database execution.
