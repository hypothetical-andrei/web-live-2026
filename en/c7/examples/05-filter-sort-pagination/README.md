# Filtering, sorting, and offset pagination

## Concept demonstrated

Query child sessions through their conference join, combining where, order, limit and offset.

## What to observe

GET /api/conferences/:conferenceId/sessions returns only that conference’s sessions. Tests traverse both sort modes, check time ties, combine the advanced filter with offset, check empty pages, and reject invalid/repeated query parameters. A seventh session belongs to another conference and must never enter these pages.

## Run / inspect

```bash
npm ci
npm test
```

## Explanation and limits

Session.findAll is the root query: each returned row is a child session. include joins its conference with required: true and a parent-ID condition. level filters sessions, fixed order arrays sort them, and limit/offset page them. The belongsTo join adds at most one conference per session, so it does not multiply the paged rows. This avoids placing a global limit on a hasMany include. Pages are deterministic for unchanged data; earlier insertions can shift offsets. An unknown conference produces an empty collection in this small contract. The script starts and closes its own HTTP server.

## Variations

Predict limit=1&offset=1 with level=advanced and sort=title_asc, then inspect the assertion. Explain why ID breaks equal-time ties.

## Validation

On 2026-11-11, clean offline npm ci and npm test passed on Node 24.5.0 with the locked dependencies. Checks use real SQLite; HTTP examples send real loopback requests.
