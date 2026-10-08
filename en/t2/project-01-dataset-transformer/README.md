# Project 01 — Dataset Transformer

## Purpose

Explore JavaScript's everyday style through a small app that transforms an in-memory task list with functions and array methods. This first example keeps file handling and command-line options out of view so students can focus on values, expressions, callbacks, and the pipeline itself.

## Trace the pipeline

Work in `student/`. Run `npm start` to see the app's starting output, then inspect `demoTasks` and the `transformTasks` signature. Track how each array callback receives a value and how each stage changes the collection.

Use the staged AI instructions inside the TODO. First request a no-edit explanation of the pipeline and verify it. Only then request the bounded implementation from `spec.md`. Review for in-place sorting, aliases, incorrect tie-breaking, and edits outside `src/transform-tasks.js`.

## Success criteria

- Baseline, objective, and regression checks pass.
- The app emits the deterministic summary from its in-memory sample.
- The diff changes only the transformation module.
- You can explain each array operation and why the input stays unchanged.

## Debugging task

Temporarily introduce an in-place operation on frozen input. Use the failure to locate the mutation and ask Codex for the smallest repair. Verify the resulting diff rather than accepting a regenerated pipeline.

## What you should be able to explain

- Values, expressions, and callbacks in ordinary JavaScript.
- The roles of `filter`, `map`, `sort`, and `reduce`.
- How a pipeline composes into a useful app result.
- Why transformation should leave the input list intact.
