# Lecture Example — Fetch HTTP boundary

## Concept demonstrated

`fetch` fulfills when an HTTP response arrives, including for `404`; application code must classify the response status explicitly.

## Why this example is in the lecture

An injected deterministic fetch separates network settlement from HTTP outcome without depending on a server or internet timing.

## What to observe

- The fake `404` response is delivered by a fulfilled promise.
- `loadJson` converts a non-success HTTP response into an application error.
- JSON parsing occurs only after the status policy accepts the response.

## Run / inspect

```bash
node example.js
```

## Explanation

Promise fulfillment means a response was obtained, not that its status represents success. Checking `response.ok` creates the boundary required by the application's contract.

## Variations

- Make `fakeFetch` reject to model a network failure and compare the path.
- Return malformed JSON from a successful response and identify the parsing failure boundary.

## Validation

Validated with `node example.js`; successful parsing, rejected `404` policy, and underlying promise fulfillment are asserted.
