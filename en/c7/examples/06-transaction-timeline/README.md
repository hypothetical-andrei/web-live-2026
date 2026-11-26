# Managed transaction timeline

## Concept demonstrated

Verify commit and rollback across inventory, booking and audit rows.

## What to observe

The initial state is three seats, zero bookings and zero audit rows. An injected failure after booking restores that state. Success produces two seats, one booking and one audit row. Invalid seat quantities and insufficient availability are rejected without retaining changes.

## Run / inspect

```bash
npm ci
npm test
```

## Explanation and limits

Every participating read/write receives the same transaction. The outer await resolves with the callback result after commit. Stored state is reread after rollback rather than inferred from a changed JavaScript instance. These are sequential atomicity checks, not a concurrent allocation policy, uniqueness protocol, or file-durability test.

## Variations

Explain why swallowing the injected error inside the callback could commit earlier writes. Identify why an email or terminal log cannot be rolled back with the database.

## Validation

On 2026-10-26, clean npm ci and npm test pass on Node 24.5.0 with locked Sequelize 6.37.8 and sqlite3 6.0.1. Assertions execute real SQLite operations; HTTP examples issue actual loopback requests. Database/server cleanup runs in finally.
