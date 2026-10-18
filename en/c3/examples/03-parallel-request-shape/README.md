# Lecture Example — Parallel request shape

## Concept demonstrated

Independent asynchronous operations should be started before any one result is awaited.

## Why this example is in the lecture

The logged start/finish order demonstrates concurrency without depending on variable internet timing.

## What to observe

- All three operations start before the first one finishes.
- `Promise.all` preserves input order even though completion order differs.
- Parallel coordination is a code-shape decision, not merely a stopwatch result.

## Run / inspect

```bash
node example.js
```

## Explanation

Mapping creates all three promises immediately. `Promise.all` waits for their combined settlement and returns results in the same order as the promise array.

## Variations

- Replace the map with three sequential `await` expressions and compare the event order.
- Reject one operation and handle the combined failure explicitly.

## Validation

Validated with `node example.js`; assertions prove all starts precede all finishes and result order remains `profile, tasks, notices`.
