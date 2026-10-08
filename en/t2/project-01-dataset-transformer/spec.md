# Exercise Specification — Dataset Transformer

## Unit

Unit 02 — JavaScript for Reading and Modifying Programs

## Learning objective

Implement and explain a small in-memory JavaScript app that uses functions and higher-order array operations to turn a task list into a deterministic summary without changing the source list.

## Why this exercise exists

Start with JavaScript's everyday feel: values have different types, functions can be passed to array methods, and a readable pipeline can reshape a small dataset. This is a simple in-memory app, so files and command-line options do not distract from expressions, callbacks, `filter`, `map`, `sort`, and `reduce`.

## Prerequisites

- Unit 1 command-line and JSON experience.
- Basic JavaScript expression and function reading ability.

## Starting context

Students receive a dependency-free Node ESM app with a small in-memory task array, output formatting, tests, and an incomplete `transformTasks(tasks, options)` function in `src/transform-tasks.js`.

Each task has `id`, `title`, `owner`, `status`, and numeric `estimate`. Options contain `owner` (string or `null`) and `minimumEstimate` (number).

## Required behavior

- Reject a non-array dataset with `TypeError('tasks must be an array')`.
- Select only tasks whose status is `open`, whose estimate is at least `minimumEstimate`, and whose owner matches when an owner filter is supplied.
- Return a new object containing:
  - `tasks`: new objects with only `id`, trimmed `title`, `owner`, and `estimate`, sorted by descending estimate then ascending id;
  - `count`: selected task count;
  - `totalEstimate`: sum of selected estimates;
  - `owners`: unique selected owners in ascending alphabetical order.
- Do not mutate the input array or its task objects.
- The app prints the returned summary as formatted JSON.

## Constraints

- JavaScript ESM and Node.js LTS; no dependencies.
- The app takes no command-line arguments and reads no files; later projects add those interfaces deliberately.
- Use array operations (`filter`, `map`, `sort`, `reduce`) where they make the pipeline legible.
- Work with the supplied task shape; detailed type and prototype-boundary checks belong to the final audit project.
- Student work is confined to `src/transform-tasks.js`.

## Observable completion criteria

- `npm start` prints the specified summary from the in-memory sample.
- Empty selection produces empty `tasks`/`owners`, `count: 0`, and `totalEstimate: 0`.
- All checks pass and a frozen input remains unchanged.
- The student can describe the value and type at every pipeline stage.

## Validation plan

### Baseline checks

- The app starts and prints valid JSON independently of the incomplete transformation.

### Objective checks

- Default and filtered summaries match exact expected output.
- Tie-breaking, title trimming, projection, uniqueness, and empty selection work.
- Non-array datasets raise the documented error.

### Regression checks

- Deep-frozen input is not mutated.
- Caller option objects remain unchanged.
- App emits valid JSON on success.

## Intended student work

Copy the validated reference, then replace only `transformTasks` in `src/transform-tasks.js` with a TODO implementation that returns an empty summary. Preserve the export and all other files. Baseline and regression checks remain green because the placeholder is non-mutating and still emits valid JSON; objective checks fail until the transformation is implemented.

## Codex task

> First inspect the in-memory sample, app, focused failures, and `src/transform-tasks.js` without editing. Explain how values move through the filter/map/sort/reduce pipeline and identify its input/output shapes and mutation risks. Then implement only the transformation module. Add no dependencies and do not edit tests or app code. Done when all checks pass, the summary matches a hand calculation, and the diff changes one file. Show the diff and explain each callback's role.

The student reviews the diff for mutation, unstable ordering, and changes outside scope before running checks and comparing the app output with a hand calculation.

## Debugging / extension task

- Introduce an in-place sort of the selected input objects, observe the frozen-input failure, and ask Codex for the smallest repair. Explain why cloning the outer array alone may not protect nested objects.

## Out of scope

- File input/output, command-line argument parsing, streams, databases, remote data, interactive prompts, or TypeScript.
