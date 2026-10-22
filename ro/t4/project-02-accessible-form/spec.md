# Exercise Specification — Accessible Form

## Unit

Unit 04 — HTML, CSS, Responsive UI and Accessibility

## Learning objective

Validate the enrollment form and help the user find and correct errors with the keyboard.

## Starting context

Work in `student/`. You have the form HTML, styling, server, tests, and display code in `public/app.js`. That code already shows errors beside fields, builds an error summary, and moves focus when requested. Complete only `validateEnrollment(values)` and `handleSubmission(values, ui)` in `public/form-validation.js`.

## Required behavior

Validate these four fields:

| Field | Rule |
| --- | --- |
| `name` | Remove surrounding spaces; require a nonempty value. |
| `email` | Remove surrounding spaces; require the documented `local@domain.tld` shape. This is a simplified exercise check. |
| `track` | Accept only `frontend` or `backend`. |
| `terms` | Accept only boolean `true`. |

`validateEnrollment` returns `{ values, errors }`. `values` contains the trimmed name/email and the other field values. `errors` contains messages only for invalid fields, in the order `name`, `email`, `track`, `terms`. The supplied tests specify the exact messages.

For invalid input, `handleSubmission` displays errors with `ui.setErrors(errors)`, focuses their summary with `ui.focusSummary()`, and returns `{ ok:false, errors }`. It must not call `ui.submit`.

For valid input, it clears the errors, calls `ui.submit(values)` once, and returns `{ ok:true, values }`. It must not focus the error summary.

The supplied display code handles inline messages, `aria-invalid`, and summary links. You do not need to implement those again.

## Constraints

- Browser ESM/DOM, Node LTS tests/server, no dependencies.
- You must edit only `public/form-validation.js`.
- Do not use only color to indicate errors; do not replace native labels or fieldset semantics.
- Do not validate on every keystroke or disable native keyboard behavior.

## Observable completion criteria

- Empty submit shows summary plus inline errors and moves focus to the summary.
- Error links target their controls; corrected valid submit shows success.
- Tab order follows document order and every control has an accessible name.
- All checks pass and only the validation module changes.

## Validation plan (for course authors)

### Baseline checks

- HTML contains label/control pairs, fieldset/legend, required/type/autocomplete attributes, summary, and live success region.
- Adapter source manages `aria-invalid`, inline text, summary links, and focus.

### Objective checks

- Normalization and all field rules return exact errors.
- Invalid submission follows error/focus/no-submit path.
- Valid submission follows clear/submit/no-focus path.

### Regression checks

- Inputs and UI object are not mutated by validation.
- Submission callback occurs at most once.
- Error ordering remains name, email, track, terms.

### Browser checks

- The real form performs invalid and corrected submissions, exposes associated labels and four errors, focuses the summary, and renders success.

## Your task

Implement the two unfinished functions in `public/form-validation.js`. Read how `public/app.js` calls them, then implement the field checks and the two submission outcomes described above.

## Codex task

> Change only `public/form-validation.js`. Implement the field rules and return values in this specification. Keep errors in name/email/track/terms order. On failure, display errors and focus their summary without submitting. On success, clear errors and submit the trimmed values once without focusing the summary. Do not change HTML, display code, tests, or dependencies. Run the checks and try invalid and corrected input using only the keyboard.

## Debugging / extension task

- Remove summary focus after invalid submit. Complete the form using only the keyboard, record the navigation cost, then ask Codex for the smallest focus-management repair.

## Out of scope

- Server submission, production email validation, localization, custom widgets, or replacing native constraint semantics.
