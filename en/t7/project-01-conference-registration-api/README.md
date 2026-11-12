# Project 01 — Conference Registration API

## What you need to do

Define the conference, session, attendee, and registration relationships in Sequelize. Implement the required reads while keeping foreign keys, registration fields, and query counts correct.

Work in `student/`. Change only `src/conference-model.js`.

## How to work

Inspect the seed rows, serializer shape, supplied errors, and categorized checks. Draw tables, keys, cardinalities, aliases, and junction attributes before editing. Then trace one list request from association metadata to generated SELECT and public JSON.

Give Codex the task from `spec.md`. Reject guessed association defaults, swapped through keys, manual joins, N+1 loops, raw SQL, route coupling, or changes outside the objective file.

## Check your result

- All categorized project checks and the dependency audit pass.
- Foreign keys, aliases, through model, uniqueness, validation, and cascades match the contract.
- One bounded eager query returns deterministic sessions, attendees, and junction data.
- Registration returns detached data and classifies missing/duplicate outcomes exactly.
- Only `src/conference-model.js` differs from the starter.

## Debugging task

Swap the many-to-many `foreignKey` and `otherKey` on one direction. Inspect metadata or generated SQL, explain why both directions must agree, then restore the symmetric mapping.

## What you should be able to explain

- Which table owns each foreign key and why.
- Why registration attributes belong to the junction.
- How eager include aliases, selected attributes, order, and statement count interact.
- Why persistence errors remain separate from HTTP statuses.
