# Lecture Example — Express route matching

## Concept demonstrated

Express selects a route from the HTTP method and pathname. Path parameters identify one resource; query parameters refine a collection representation.

## What to observe

- `GET` and `POST` on `/api/tasks` reach different handlers.
- `GET /api/tasks?completed=true` still matches the collection route.
- `GET /api/tasks/:taskId` exposes `request.params.taskId`.
- An unsupported method reaches the final `404 route_not_found` handler.

## Run and inspect with a REST client

```bash
npm install
npm start
curl -i 'http://127.0.0.1:3000/api/tasks?completed=true'
curl -i 'http://127.0.0.1:3000/api/tasks/t-1'
curl -i -X DELETE 'http://127.0.0.1:3000/api/tasks'
npm test
```

In VS Code, the same requests can be saved in a REST Client `.http` file. Inspect method, URL, status, and JSON—not only the body.

## Explanation

The service keeps routing concrete: Express parses the URL, chooses one method-specific handler, and exposes path and query data separately. Storage and validation are intentionally minimal here.

## Validation

`npm test` starts the Express app on an ephemeral loopback port and verifies collection, member, query, and unmatched-route behavior.


Revalidated on 2026-10-26: clean install and real HTTP checks pass on Node 24.5.0.
