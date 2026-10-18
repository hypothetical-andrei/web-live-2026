# Lecture Example — Async continuation order

## Concept demonstrated

`await` suspends the current async function while the calling code continues.

## Why this example is in the lecture

Five log entries make the scheduling model observable without network or UI concerns.

## What to observe

- The async function starts synchronously.
- Code after `await` runs only after the current stack clears.
- In this example, the returned promise fulfills when the async function finishes.

## Run / inspect

```bash
node example.js
```

## Explanation

Calling `run()` records `function start`, reaches `await`, and returns a promise. The calling code records `script end`. After the current synchronous code finishes, `run()` resumes and records `after await`. Finishing `run()` fulfills its promise; the `.then()` callback then records `promise fulfilled`.

## Variations

- Add a second `await` and predict its place in the log.
- Replace the resolved promise with a rejected one and add a targeted `try`/`catch`.

## Validation

Validated with `node example.js`; an assertion verifies the exact five-entry order.
