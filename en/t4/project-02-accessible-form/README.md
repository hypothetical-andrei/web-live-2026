# Project 02 — Accessible Form

## Objective

Implement deterministic form validation that combines semantic controls, inline messages, a focusable summary, and predictable valid submission.

## Workflow

Use the keyboard to inspect the supplied form before editing. Submit empty data and observe the missing behavior. Read how the adapter maps an error object to `aria-invalid`, inline regions, summary links, and focus.

Give Codex the bounded task from `spec.md`. Review normalization, error insertion order, separation of validation from presentation, invalid no-submit behavior, and exactly-one valid submission. Reject changes to markup or adapter that evade the function contract.

## Success criteria

- All checks pass.
- Empty submission focuses a populated error summary.
- Summary links and inline errors identify controls.
- Corrected valid input clears errors and submits once.
- Only `public/form-validation.js` changes.

## Debugging task

Remove invalid-summary focus and complete correction using only the keyboard. Measure the extra navigation, then restore the smallest focus-management call and verify it does not run on success.

## What you should be able to explain

- Accessible names and descriptions.
- Fieldset/legend grouping.
- Inline errors plus summary navigation.
- Focus management after a failed action.
