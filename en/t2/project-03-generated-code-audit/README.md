# Project 03 — Generated-Code Audit

## Purpose

Make the JavaScript object model visible through prototype lookup, own versus inherited properties, identity, mutation, and aliasing. This is the final project and the only one with a command-line interface; `--file` selects the dataset for comparison.

## Objective

Diagnose prototype lookup, inherited-property acceptance, mutation, and aliasing in plausible generated code, then implement a strict defensive boundary without rewriting the audit artifact.

## Audit before editing

Run `npm run compare -- --file data/events.json` and all focused checks in `student/`. For each object-model defect, record a concrete input, actual result, required result, and relevant JavaScript rule. Include a record whose required field exists only on its prototype alongside mutation, aliasing, and ordering behavior.

Use the evidence-first TODOs: ask Codex for a defect table, not a rewrite; reproduce its claims; then constrain implementation to `src/safe-normalizer.js`. Inspect the diff and ensure the unsafe file, tests, fixtures, and dependencies remain unchanged.

## Success criteria

- All checks pass.
- Valid output is projected, copied, and deterministically ordered.
- Invalid types fail instead of being coerced.
- Frozen input works and output records do not alias it.
- Every accepted repair corresponds to demonstrated evidence.

## Extension task

Add a date string whose calendar semantics are ambiguous despite being accepted by `Date.parse`. Specify the intended rule in a test before changing implementation. Use Codex to critique the contract and propose a focused repair.

## What you should be able to explain

- Readable inherited properties versus required own input data.
- Prototype delegation and own-property checks.
- Array and nested-object aliasing.
- Why readable generated code can still be semantically unsafe.
- Why tests and diffs matter in AI-assisted review.
