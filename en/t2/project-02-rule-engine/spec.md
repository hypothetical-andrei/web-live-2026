# Exercise Specification — Rule Engine

## Unit

Unit 02 — JavaScript for Reading and Modifying Programs

## Learning objective

Build composable predicates from declarative rules using closures and higher-order functions, then partition records without mutating inputs.

## Why this exercise exists

Rules make functions-as-values concrete: a configuration is compiled once into a predicate reused across records. Recursive `all`, `any`, and `not` composition exposes closure capture and short-circuit behavior.

## Prerequisites

- Dataset Transformer concepts: arrays, objects, callbacks, non-mutation, and validation.

## Starting context

Students receive a dependency-free Node ESM project with scenario fixtures, a supplied file reader/writer shell, and an incomplete `src/rule-engine.js`. Records describe tasks with `owner`, `status`, `priority`, and `estimate`.

## Required behavior

- `compileRule(definition)` returns a predicate closure.
- Leaf rules are `{ field, operator, value }`; supported operators are `equals`, `atLeast`, and `includes`.
- Composite rules are `{ all: [...] }`, `{ any: [...] }`, or `{ not: rule }` and recursively combine compiled predicates with short-circuit semantics.
- Invalid/ambiguous definitions, empty `all`/`any`, unsupported operators, and missing fields throw descriptive `TypeError`s during compilation.
- `evaluateRecords(records, definition)` returns `{ matchedIds, rejectedIds }` in input order and does not mutate inputs.
- `includes` accepts only an array-valued record field; `atLeast` accepts numeric field and comparison values without coercion.

## Constraints

- JavaScript ESM, Node LTS, no dependencies.
- The supplied shell uses synchronous file reading and writing; asynchronous rules and I/O belong to Unit 03.
- Student changes only `src/rule-engine.js`.
- Compile children once; do not recompile inside the returned predicate.
- Use `every`, `some`, and a negating closure for composite behavior.

## Observable completion criteria

- The supplied review scenario writes exactly the expected task IDs.
- Nested composition and all leaf operators pass focused checks.
- Invalid definitions fail before record evaluation.
- Frozen definitions and records remain unchanged.
- The student can draw the predicate tree and explain closure-captured values.

## Validation plan

### Baseline checks

- Scenario JSON loads and the fixed file runner writes syntactically valid JSON with the supplied student placeholder.

### Objective checks

- Leaf operators return correct predicates with strict type behavior.
- Nested `all`/`any`/`not` composition selects exact records.
- Invalid definitions and operators throw during compilation.
- Evaluation partitions IDs in source order.

### Regression checks

- Deep-frozen rules and records are not mutated.
- A composite short-circuits before a deliberately throwing later predicate.
- The file runner writes valid JSON for a valid scenario.

## Intended student work

After reference validation, copy the reference and remove only the validation, recursive compilation, and evaluation bodies in `src/rule-engine.js`, retaining exported signatures and TODOs. Baseline remains green. Objective and engine-dependent regression checks fail in the documented way.

## Codex task

> Inspect the rule shapes, tests, and `src/rule-engine.js` without editing. Explain what each compiled closure captures and where short-circuiting occurs. Then implement only `src/rule-engine.js`. Compile validated leaf and composite rules into reusable predicates, preserve strict types and input order, and mutate nothing. Do not edit fixtures, the file runner, or tests and add no dependency. Done when all checks pass and the diff changes one file. Show the recursive cases and explain how a compiled predicate is reused.

Review the diff for recompilation inside predicates, truthiness-based coercion, missing validation, and changes beyond the named module.

## Debugging / extension task

- Replace an `every` with `forEach`, observe the incorrect boolean behavior, and use a focused Codex diagnosis to repair it. Explain why iteration and predicate aggregation are different operations.

## Out of scope

- Parsing a rule language, dynamic JavaScript evaluation, persistence, async rules, or user authorization.
