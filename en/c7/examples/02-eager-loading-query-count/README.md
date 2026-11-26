# Eager-loading query count

## Concept demonstrated

Compare the actual SQL statements for lazy traversal and eager loading.

## What to observe

Three conferences each have one session. After clearing setup SQL from the log, lazy traversal issues four statements and the eager include issues one. Both load related data from SQLite.

## Run / inspect

```bash
npm ci
npm test
```

## Explanation and limits

The small fixture bounds the graph; the query is not a general page-size limiter. One statement is not automatically optimal when several joined collections multiply rows. SQL logging counts statements rather than benchmarking elapsed time.

## Variations

Increase the number of parent fixtures and predict N+1 growth. Discuss how a second included collection changes intermediate row counts.

## Validation

On 2026-10-26, clean npm ci and npm test pass on Node 24.5.0 with locked Sequelize 6.37.8 and sqlite3 6.0.1. Assertions execute real SQLite operations; HTTP examples issue actual loopback requests. Database/server cleanup runs in finally.
