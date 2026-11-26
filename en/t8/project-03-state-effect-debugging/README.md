# Project 03 — State and Effect Debugging

## What you need to do

Repair the React search panel. Make searches use the current input, prevent old responses from replacing newer results, and clean up requests when the component no longer needs them.

Work in `student/`. Change only `src/SearchPanel.jsx`.

## How to work

Run the weak baseline and draw the old/new request timeline. Inspect the deferred fake, timer controls, error callback, accessible states, and source checks before requesting a repair.

Give Codex the task from `spec.md`. Reject edits to evidence/tests, mirrored result state, unstable options, omitted dependencies, lint suppression, missing cleanup, abort-only race assumptions, raw error display, or extra libraries.

## Check your result

- All categorized project checks, build, audit, and browser smoke pass.
- Rapid input starts only the final eligible debounced request.
- Query change/shortening/unmount clears or aborts owned work.
- Old resolve-after-abort settlements cannot publish.
- Idle/loading/empty/results/sanitized-error states and error callback identity are exact.

## Debugging task

Remove the latest-request identity check but retain abort. Resolve an aborted fake after the newer request, observe the stale publication, and restore both independent protections.

## What you should be able to explain

- Render state versus effect synchronization.
- Dependency, setup, cleanup, and settlement ownership.
- Why abort does not by itself prove latest-only UI.
- How deterministic timers/deferred promises make races testable.
