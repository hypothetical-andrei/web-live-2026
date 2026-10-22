# Project 02 — Accessible Form

## What you need to do

Finish the validation of the supplied enrollment form. When the input is invalid, show the errors and move keyboard focus to their summary. When it is valid, clear the errors and submit the values once.

Work in `student/`. Change only `public/form-validation.js`. The HTML, styling, server, and code that displays errors are supplied. Read [spec.md](spec.md) for the field rules and required return values.

## Before editing

Start the page using `student/README.md`. Navigate with Tab and submit the empty form. Inspect the two unfinished functions and read how `public/app.js` uses them.

## Your changes

- In `validateEnrollment`, remove surrounding spaces from the name and email, check all four fields, and return the values and errors.
- In `handleSubmission`, use the validation result to choose between showing errors or submitting valid values.
- Keep errors in the order `name`, `email`, `track`, `terms`.
- Use the supplied functions for displaying errors and moving focus. Do not rewrite the form or its display code.

Give Codex the task in `spec.md`. Inspect its handling of invalid input, corrected input, and repeated submissions.

## Check your work

From `student/`, run `npm test` and `npm run test:browser`. The browser check requires Chrome/Chromium; see `student/README.md`.

Using only the keyboard, submit empty input, follow a summary link to its field, correct the errors, and submit valid input. Confirm that the summary receives focus only on failure and that valid input is submitted once. Only `public/form-validation.js` should have changed.

## Follow-up

Temporarily remove the call that focuses the error summary. Try correcting the form with the keyboard. Explain what became harder, then restore the call and rerun the checks.
