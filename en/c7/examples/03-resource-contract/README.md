# Membership resource

## Concept demonstrated

Repeat PUT and DELETE at a URL identifying a session/attendee membership.

## What to observe

The first PUT returns 201, the repeat returns 200, and there is still one stored registration with the requested ticket type. Two DELETE requests return 204 and leave no registration. Parent rows are not the deletion target.

## Run / inspect

```bash
npm ci
npm test
```

## Explanation and limits

The script starts its own ephemeral HTTP server, sends fetch requests, checks SQLite and exits. It does not expose a persistent curl server. This is a sequential retry demonstration with fixed valid fixtures, not a complete validation, authorization or concurrent upsert implementation.

## Variations

Compare this pair identity with a top-level registration ID. Explain why changing the ticket type is a different request, while repeating an identical request is the idempotency test.

## Validation

On 2026-10-26, clean npm ci and npm test pass on Node 24.5.0 with locked Sequelize 6.37.8 and sqlite3 6.0.1. Assertions execute real SQLite operations; HTTP examples issue actual loopback requests. Database/server cleanup runs in finally.
