# Lecture Example — Response contract check

## Concept demonstrated

Runtime checks turn HTTP-contract claims into evidence: creation, validation failure, and unexpected failure need different statuses and response shapes.

## Why this example is in the lecture

It models the verification step used after an AI agent proposes response descriptors, without building another HTTP server.

## What to observe

- A creation result uses `201` and identifies the created resource.
- A client error uses a 4xx status and a stable machine-readable code.
- A check can reject a plausible-looking but semantically incorrect `200` response.

## Run / inspect

```bash
node check.js
```

## Explanation

`responses.js` contains small response descriptors. `check.js` independently asserts their public contract. This separation mirrors reviewing behavior rather than trusting the implementation that produced it.

## Variations

- Change the creation status to `200` and inspect the focused failure.
- Add a `500` descriptor without exposing an internal stack trace.

## Validation

Validated with `node check.js`; all contract assertions pass and the script prints `3 response contracts verified`.
