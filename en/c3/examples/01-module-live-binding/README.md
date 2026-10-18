# Lecture Example — Module boundary and shared instance

## Concept demonstrated

ES modules export selected functions and values; importers of the same module share its state.

## Why this example is in the lecture

Three tiny modules show imports, exports, encapsulated state, and defensive projection without requiring a browser framework.

## What to observe

- `summary.js` imports behavior rather than reaching into private state.
- Changes made through `addTask` are visible through the same module instance.
- Returned arrays and records are projections, so callers cannot mutate module state accidentally.

## Run / inspect

```bash
node example.js
```

## Explanation

Module evaluation creates the private `tasks` binding once for this resolved module. Exported functions form the public boundary; the raw binding is not exported.

## Variations

- Export the array directly and demonstrate the larger mutation surface.
- Import `taskCount` from a second module and confirm it observes the same state.

## Validation

Validated with `node example.js`; initial state, shared updates, and projection isolation are asserted.
