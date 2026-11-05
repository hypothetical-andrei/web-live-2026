# Lecture Example — REST resource contracts in Express

## Concept demonstrated

A real REST service coordinates method, resource state, status, headers, and body: creation returns `201` with `Location`, missing resources return `404`, and successful deletion returns `204` without a body.

## Run and inspect with a REST client

```bash
npm install
npm start
curl -i 'http://127.0.0.1:3000/api/tasks'
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: application/json' -d '{"title":"Test the API"}'
curl -i -X DELETE 'http://127.0.0.1:3000/api/tasks/t-1'
npm test
```

Read the status line, `Location`, `Content-Type`, and body as one contract. A plausible JSON body with the wrong status is still incorrect.

## Validation

`npm test` performs real HTTP requests against an ephemeral Express server and verifies list, create, follow-up read, missing-resource, and bodyless-delete semantics.


Revalidated on 2026-10-26: clean install and real HTTP checks pass on Node 24.5.0.

This example assumes a valid title to isolate HTTP semantics. The in-memory Map resets at restart; input validation is demonstrated separately in examples 04 and 05.

## Collection views and response formats

The GET collection handler now demonstrates filter → stable sort → page → encode. Run these with the server already running:

```bash
curl -i 'http://127.0.0.1:3000/api/tasks?sort=title&order=desc&limit=1'
curl -i 'http://127.0.0.1:3000/api/tasks?q=Agenda&limit=2' -H 'Accept: application/json'
curl -i 'http://127.0.0.1:3000/api/tasks?q=Agenda&limit=2' -H 'Accept: text/csv'
curl -i 'http://127.0.0.1:3000/api/tasks' -H 'Accept: application/xml'
```

Filtering uses a case-insensitive title substring. Only title sorting is supported, with asc/desc direction and an ascending ID tie-breaker. Default offset is 0 and limit is 2; limit must be 1–20. Numeric parameters must be decimal integers within JavaScript's safe-integer range. Unknown or repeated parameters are rejected with 400. Sorting uses JavaScript string comparison, not a locale-sensitive alphabetical collation. It never changes the stored Map.

JSON includes data and meta (total matching members, offset, limit). CSV includes the same selected members with quoted fields and doubled embedded quotes. A Link header supplies the next-page URI while retaining query selections; carry Accept when following it. Missing Accept or a wildcard defaults to JSON. The example honors media preferences, sends Vary: Accept, and chooses 406 when no supported format is acceptable. Diagnostic errors use JSON. Cache-Control: no-store deliberately disables response storage for this mutable demonstration; Vary alone does not enable caching.

Compare request Content-Type with Accept: the former describes a request body, while the latter negotiates the response. No custom filter headers or format query parameter are implemented. Offset paging can shift under concurrent changes; it does not provide snapshot isolation. The next link demonstrates navigation, not full level-3 REST compliance.

Revalidated on 2026-10-26: the existing create/read/delete checks and new collection checks pass. New checks cover filtering, deterministic ties, ordering without mutation, paging and continuation, empty pages, input rejection, JSON/CSV, quality preferences, 406, Vary, and CSV quoting.

Additional checks on 2026-10-30: `check.test.js` demonstrates filtering and descending sorting before paging, following the next link without losing selection, and successful empty results as JSON or header-only CSV. All five checks pass with `npm test`.
