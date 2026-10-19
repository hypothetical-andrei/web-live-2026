# Exercise Specification — Accessible Form

## Unit

Unit 04 — HTML, CSS, Responsive UI and Accessibility

## Learning objective

Implement accessible client-side form validation that preserves semantic labeling, associates inline errors, provides a focusable error summary, and supports keyboard correction.

## Starting context

You have received a styled enrollment form with semantic labels, fieldset/legend, appropriate input types, stable error containers, error summary, app adapter, server, and tests. `validateEnrollment(values)` and `handleSubmission(values, ui)` are incomplete.

## Required behavior

- Trim name/email; name is required; email must match a small documented `local@domain.tld` shape; track must be `frontend` or `backend`; terms must be boolean `true`.
- Return `{ values, errors }`, with normalized values and field error strings keyed by `name`, `email`, `track`, `terms`.
- Submission with errors calls `ui.setErrors(errors)`, calls `ui.focusSummary()`, does not call `ui.submit`, and returns `{ ok:false, errors }`.
- Valid submission clears errors, calls `ui.submit(values)` once, does not focus the summary, and returns `{ ok:true, values }`.
- The supplied adapter maps errors to inline containers, `aria-invalid`, summary links, and focus.

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

## Validation plan

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

You need to implement `validateEnrollment` and `handleSubmission` in `public/form-validation.js`. Both functions currently return placeholder results. The form, server, and code that displays errors are supplied. Read how that code uses your validation results, then implement the field rules and the invalid/valid submission paths.

## Codex task

> Implement only `public/form-validation.js`. Normalize and validate the four fields, preserve deterministic error order, and orchestrate invalid versus valid UI callbacks exactly as specified. Do not edit HTML, adapter, tests, or dependencies. Done when checks pass and keyboard testing confirms summary focus and correction. Explain why inline errors and a summary are both useful.

## Debugging / extension task

- Remove summary focus after invalid submit. Complete the form using only the keyboard, record the navigation cost, then ask Codex for the smallest focus-management repair.

## Out of scope

- Server submission, production email validation, localization, custom widgets, or replacing native constraint semantics.
