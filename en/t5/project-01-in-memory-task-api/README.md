# Project 01 — In-memory Task API

## What you need to do

Implement the task API routes for listing, creating, reading, updating, and deleting tasks. Validate requests and use the supplied repository to store the data.

Work in `student/`. Change only `src/task-router.js`.

## How to work

Start your starting app and inspect `/`, `/health`, the app mounting order, repository methods, and categorized tests. Write a method/path/status table before editing.

Give Codex the task from `spec.md`. Review its diff for edits outside the router, truthiness validation, unknown-field acceptance, missing returns after responses, accidental JSON with `204`, or locally swallowed unexpected errors.

## Check your result

- All categorized checks pass.
- List, create, fetch, update, and delete match their exact contracts.
- Invalid media/body and missing-resource errors use the standard envelope.
- A live create exchange shows `201` and `Location`; deletion has no body.
- Only `src/task-router.js` changes.

## Debugging task

Remove one return after a validation response, reproduce the unintended continuation, and trace whether a second response or repository call occurs. Restore the smallest control-flow repair.

## What you should be able to explain

- Express router mounting and method/path matching.
- Boundary validation versus repository ownership.
- Status, `Location`, success envelopes, and `204` semantics.
- Forwarding unexpected failures to centralized handling.
