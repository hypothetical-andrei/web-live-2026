# Project 01 — Persistent Notes API

## What you need to do

Implement the supplied note-store interface using Sequelize and SQLite. Save changes before reporting success, preserve notes across restarts, and close the database when finished.

Work in `student/`. Change only `src/note-store.js`.

## How to work

Inspect the injected store interface, serializer, seed fixture, and lifecycle tests. Draw connection → model → initialize/reset/seed → CRUD → close before editing.

Give Codex the task from `spec.md`. Reject Express coupling, normal-start force sync, unawaited calls, model-instance returns, committed database files, or changes outside the store.

## Check your result

- All categorized checks and audit pass.
- Metadata/defaults/title normalization match the contract.
- CRUD returns detached deterministic results.
- Reset/seed is reproducible and normal initialization does not duplicate/delete.
- A file-backed note survives close/reopen.
- Only `src/note-store.js` changes.

## Debugging task

Remove `await` from one create operation inside a catch boundary. Trigger model validation and identify where the rejection escapes before restoring explicit settlement ownership.

## What you should be able to explain

- Connection/model/store responsibilities.
- Constraints versus route validation.
- Reset, seed, restart, and close lifecycle.
- Why detached results and awaited writes matter.
