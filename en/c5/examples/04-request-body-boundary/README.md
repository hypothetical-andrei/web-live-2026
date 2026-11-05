# Lecture Example — Express request validation boundary

## Concept demonstrated

JSON parsing and application validation are different steps. A REST endpoint must check media type, exact object shape, allowed fields, types, values, and normalization before using input.

## Run and inspect with a REST client

```bash
npm install
npm start
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: application/json' -d '{"title":"  Review boundary  "}'
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: application/json' -d '{"title":"Task","admin":true}'
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: text/plain' -d '{}'
npm test
```

Compare `415 unsupported_media_type` with `400 validation_failed`: both reject the request, but at different boundaries.

## Validation

`npm test` sends real HTTP requests and verifies media type, closed fields, object shape, normalization, and creation behavior.


Revalidated on 2026-10-26: clean install and real HTTP checks pass on Node 24.5.0.
