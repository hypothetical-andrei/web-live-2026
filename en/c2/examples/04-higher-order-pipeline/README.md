# Lecture Example — Higher-order pipeline and closure

## Concept demonstrated

JavaScript's functional core combines first-class functions, lexical closures, and higher-order collection methods.

## Why this example is in the lecture

It consolidates two previously separate examples while keeping configuration time and per-record execution visible.

## What to observe

- `makeTaskSelector` receives configuration and returns a function value.
- The returned predicate retains `owner` and `minimumEstimate` through a closure.
- `filter`, `map`, and `reduce` receive functions and expose distinct stage shapes.
- The frozen source remains unchanged.

## Run / inspect

```bash
node example.js
```

## Explanation

The pipeline reads as `Task[] → selected Task[] → EstimateView[] → number`. The configured predicate is reusable behavior rather than global state or repeated configuration validation.

## Variations

- Configure a second predicate and show that its captured values are independent.
- Replace the named stages with one dense chain, then compare debuggability.

## Validation

Validated with `node example.js`; selection, projection, reduction, configuration failure, and source preservation are asserted.
