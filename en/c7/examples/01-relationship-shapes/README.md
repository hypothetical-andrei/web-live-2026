# Relationship shapes

## Concept demonstrated

Model cardinality with keys and constraints, then navigate with Sequelize associations.

## What to observe

One attendee has one profile and attends two sessions. Different ticket types belong to the two registration rows. The SQLite checks reject a duplicate profile, duplicate membership, orphan session, and restricted conference deletion. Deleting the attendee cascades to its profile and registrations while retaining the sessions.

## Run / inspect

```bash
npm ci
npm test
```

## Explanation and limits

Inspect the explicit attendeeId uniqueness, both association directions and the generated nested graph. The graph is printed before the final deletion checks. Foreign-key enforcement and deletion actions are tested, not inferred from names.

## Variations

Change one association alias and predict which include must change. Explain why a generated registration ID would not replace pair uniqueness.

## Validation

On 2026-10-26, clean npm ci and npm test pass on Node 24.5.0 with locked Sequelize 6.37.8 and sqlite3 6.0.1. Assertions execute real SQLite operations; HTTP examples issue actual loopback requests. Database/server cleanup runs in finally.
