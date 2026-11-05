# Lecture Example — Centralized Express error middleware

## Concept demonstrated

Routes and parsers forward failures to one four-parameter Express error middleware. Known public errors keep precise status and codes; unexpected failures become a generic `500 internal_error` without leaking internals.

## Run and inspect with a REST client

```bash
npm install
npm start
curl -i 'http://127.0.0.1:3000/api/tasks/missing'
curl -i 'http://127.0.0.1:3000/api/failure'
curl -i -X POST 'http://127.0.0.1:3000/api/tasks' -H 'Content-Type: application/json' -d '{'
npm test
```

The server may log private diagnostic details, but the response contract must remain safe. Inspect status, content type, error code, and public message.

## Validation

`npm test` exercises known, unexpected, and malformed-JSON failures through a real Express server and confirms secret-bearing text is absent from responses.


## Additional observations

Compare `/api/failure` with `/api/async-failure`: both reach the same error middleware in Express 5. `/api/untrusted-error` carries status 400 but remains an internal failure because it is not a deliberately created PublicError. `/api/partial-failure` sends bytes before failing: the client observes an incomplete response, and Express's default error handler may print a diagnostic to the terminal. A later POST still succeeds. That POST is only a healthy-response probe; it does not validate or store tasks.

Revalidated on 2026-10-26: clean install and real HTTP tests pass on Node 24.5.0, including oversized JSON, missing routes, async rejection, sanitized output, partial-response failure, and a subsequent healthy request.
