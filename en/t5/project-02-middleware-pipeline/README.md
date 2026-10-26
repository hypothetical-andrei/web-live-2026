# Project 02 — Middleware Pipeline

## What you need to do

Build an ordered list of Express middleware for report requests. Assign a request ID, measure duration, validate input, and record one completion log without running later handlers after rejection.

Work in `student/`. Change only `src/report-pipeline.js`.

## How to work

Run your starting app and draw the supplied parser → pipeline → report handler → error middleware sequence. Mark where headers commit and where `finish` or `close` occurs.

Give Codex the task from `spec.md`. Inspect listener registration before `next`, exact dependency call counts, one-log guarantees, short-circuit returns, and whether invalid requests can reach the handler.

## Check your result

- All categorized checks pass.
- Supplied or generated request identity reaches response and one log.
- Response-time header uses the injected commit-boundary duration.
- Valid input is trimmed/frozen; invalid media/fields never reach the handler.
- Finish and premature close produce exactly one classified log.
- Only `src/report-pipeline.js` changes.

## Debugging task

Move completion-listener registration after delegation and use the synchronous handler check. Explain the missed-event race, then restore listener ownership before `next()`.

## What you should be able to explain

- Downstream `next()` flow and later response lifecycle events.
- Short-circuit behavior and response completion ownership.
- Deterministic injection of clocks, IDs, and logs.
- Why a response-time header cannot know a future finish timestamp.
