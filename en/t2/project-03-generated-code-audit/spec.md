# Exercise Specification — Generated-Code Audit

## Unit

Unit 02 — JavaScript for Reading and Modifying Programs

## Learning objective

Audit a plausible generated JavaScript transformation to explain the object model in action: prototype delegation, own versus inherited properties, object identity, mutation, and aliasing. Use the command-line interface to supply a dataset and compare generated behavior with a bounded defensive normalization boundary.

## Why this exercise exists

Generated code often looks concise while hiding object-model behavior: a field may be found on a prototype, sorting may mutate the caller's array, and returned objects may alias the input. Students use runtime evidence to connect property lookup and identity to observable program behavior. The CLI arrives here, after students have worked with in-memory data and file-based input/output.

## Prerequisites

- Values/types/coercion, arrays/objects, functions, error handling, and non-mutation from earlier Unit 2 projects.

## Starting context

Students receive `unsafe-generated.js`, an intentionally preserved generated function; fixtures; a comparison CLI with `--file`; tests; and an incomplete `normalizeEvents(events)` safe boundary. Events have string `id`, ISO `occurredAt`, boolean `active`, and finite numeric `durationMs`.

## Required behavior

- `normalizeEvents` rejects non-array input and invalid records with an index-specific `TypeError`.
- Every required event field must be an own property; inherited values do not satisfy the external data contract.
- It accepts only exact field types; it does not coerce strings to booleans/numbers.
- It returns new event objects ordered ascending by timestamp then id.
- Returned events contain only `id`, `occurredAt`, `active`, and `durationMs`.
- It does not mutate the input array or records.
- `summarizeEvents` returns `{ activeCount, totalDurationMs }` from normalized events.
- The unsafe generated function remains unchanged as audit evidence.
- The CLI accepts an optional `--file path` argument, defaults to the supplied fixture, and offers `--help`.

## Constraints

- JavaScript ESM, Node LTS, no dependencies.
- The supplied comparison CLI uses synchronous file reading so the audit remains within Unit 02's synchronous language model.
- Student edits only `src/safe-normalizer.js`.
- Validate before sorting or aggregating.
- Use own-property checks at the normalization boundary; do not mutate prototypes or accept inherited defaults as submitted data.
- Do not silence invalid input by filtering it out.
- Preserve the unsafe implementation for comparison; do not present it as recommended code.

## Observable completion criteria

- `npm run compare -- --file data/events.json` shows inherited-property acceptance and caller-order mutation.
- Safe normalization passes strict-type, projection, order, and summary checks.
- Frozen-input tests pass.
- The final diff is one file and the student can name evidence for every repair.

## Validation plan

### Baseline checks

- Fixture and comparison CLI load independently.
- Unsafe behavior remains reproducibly incorrect for audit cases.
- A constructed counterexample proves that the unsafe artifact accepts a required field inherited through the prototype chain.

### Objective checks

- Valid records normalize/project/order exactly.
- String booleans/numbers, inherited required fields, invalid dates, and nonfinite durations are rejected.
- Summary uses normalized boolean and numeric values.

### Regression checks

- Deep-frozen input does not throw or change.
- Returned records do not alias input records.
- Equal timestamps use id tie-breaking.

## Intended student work

After validating the reference, copy it and replace only the validation, copy/sort, and summary logic in `safe-normalizer.js` with a TODO passthrough to `unsafeNormalizeEvents`. Preserve exports. Baseline audit evidence remains green; objective and non-mutation checks fail in documented ways.

## Codex task

> Inspect `unsafe-generated.js`, `spec.md`, and focused failures without editing. Run the comparison with the supplied fixture and a second file. Build an evidence table for prototype lookup, an inherited required field, mutation, and aliasing. Then implement only `safe-normalizer.js`; preserve the unsafe file, add no dependencies, require own fields with strict types, and return new records. Done when all checks pass, each repair maps to a demonstrated counterexample, and the diff changes one file. Explain the diff before asking to apply it.

Students verify each claimed defect through the CLI, inspect the diff, and reject cosmetic rewrites that do not address a demonstrated object-model behavior.

## Debugging / extension task

- Add a record with an invalid calendar date that `Date.parse` normalizes unexpectedly. Decide and document whether the contract should accept it, then add a focused test before asking Codex for a repair.

## Out of scope

- Schema-validation packages, time zones beyond ISO ordering, streaming input, or rewriting the preserved unsafe artifact.
