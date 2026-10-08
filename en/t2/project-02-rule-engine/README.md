# Project 02 — Rule Engine

## Purpose

Focus on functions and closures. A rule description is compiled into a reusable predicate, while the supplied shell reads a scenario file and writes the result file so students can concentrate on captured values and composition.

## Objective

Compile declarative rules into reusable predicate closures, then partition records without mutating inputs.

## Mental model

A leaf rule captures a field, operator, and comparison value. A composite captures already-compiled child predicates:

```text
definition tree → compile once → predicate tree → evaluate many records
```

Work in `student/`. Draw the supplied scenario tree before coding. Mark the data captured by each leaf and composite function. Identify where `every`, `some`, and logical negation provide aggregation and short-circuit behavior.

Follow the two staged TODOs. Ask Codex first for a no-edit tree, closure-capture, and short-circuit analysis. After checking it, permit changes only in `src/rule-engine.js`. Reject ambiguous shapes, repeated child compilation, coercion, mutation, or test edits.

Run `npm run evaluate`. The supplied runner reads `data/scenario.json` and writes `data/result.json`; students do not configure paths or parse command-line arguments.

## Success criteria

- All focused and aggregate checks pass.
- The written scenario result selects only `T-1`.
- Invalid definitions fail during compilation.
- The final diff is confined to the engine module.
- You can explain what every returned closure captures.

## Debugging task

Temporarily replace `every` with `forEach`. Diagnose why iteration does not produce the composite boolean and why it cannot short-circuit in the required way. Ask Codex for a targeted repair and inspect the one-line semantic change.

## What you should be able to explain

- Functions as returned values.
- Closure capture and compile-once reuse.
- Recursive composition.
- Short-circuit evaluation.
- Strict comparison versus coercion.
