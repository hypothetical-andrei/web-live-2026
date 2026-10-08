# Project 02 — Tiny HTTP Server

## Objective

Study the structure of a tiny raw Node HTTP server, then add one missing
path-based processing route in `student/src/application-handler.js`.

The supplied project already shows four request patterns:

- a file request that reads and returns HTML;
- a file request that reads and returns CSS;
- a processing route that reads query parameters;
- a processing route that reads a JSON body.

Your task is to complete the missing path-based route so the server also handles
`GET /api/greetings/<name>`.

## Mental model

Different requests can lead to different server responsibilities:

```text
request for file → read file from disk → send text response
request for query endpoint → read search params → send JSON response
request for path endpoint → read pathname segment → send JSON response
request for body endpoint → read JSON body → send JSON response
```

The supplied server shell already owns startup, `/health`, static file
delivery, unknown-route fallback, and unexpected errors. Your handler returns
`true` when it sends a response and `false` when the shell should keep its
fallback behavior.

## Work with the student project

1. Run `npm install` in `student/`.
2. Run `npm run test:baseline`, `npm run test:objective`, and
   `npm run test:regression` once before editing.
3. Read `src/server.js` before editing the handler. Identify which requests
   read files and which requests delegate to `handleApplicationRequest`.
4. Read `src/application-handler.js`, `src/http-utils.js`, and the objective
   tests. Compare the working query and body routes with the missing path route.
5. Ask Codex for the bounded task from `spec.md`. Reject edits outside
   `student/src/application-handler.js` and any new dependency.
6. Inspect control flow carefully: every handled branch must send exactly one
   response and return `true`.
7. Run all checks again and manually inspect the routes below with `curl` or
   Thunder Client.

## Test the server manually

Run `npm start`, then replace `<base-url>` with the printed loopback URL.

### With curl

Inspect the file response:

```sh
curl -i "<base-url>/"
```

Inspect the working query route:

```sh
curl -i "<base-url>/api/greetings?name=Ada"
```

Inspect the missing path route after you implement it:

```sh
curl -i "<base-url>/api/greetings/Ada%20Lovelace"
```

Inspect the body route:

```sh
curl -i -X POST \
  -H 'content-type: application/json' \
  -d '{"clue":"crumbs","count":2}' \
  "<base-url>/api/echo"
```

### With Thunder Client

1. Create a `GET` request to `<base-url>/` and confirm that the response is
   HTML from a file.
2. Create a `GET` request to `<base-url>/api/greetings?name=Ada` and inspect
   the JSON response generated from the query string.
3. Create a `GET` request to `<base-url>/api/greetings/Ada%20Lovelace` and
   verify the JSON response generated from the path segment after your change.
4. Create a `POST` request to `<base-url>/api/echo`, set the body type to
   JSON, send `{"clue":"crumbs","count":2}`, and confirm the echoed JSON plus
   the `X-Echoed-Method` response header.

## Important details

Match method and pathname together. For the missing path route, decode the
final path segment, trim it, and reject an empty value with
`{ "error": "name_required" }`. For the echo route, normalize only the media
type portion of `Content-Type`, because parameters such as `charset` may
follow it. Do not parse a body before rejecting an unsupported content type.

## Success criteria

- Baseline and regression checks remain green throughout.
- Every objective check passes.
- `npm start` plus the documented `curl` or Thunder Client requests expose one
  file response, one query-based response, one path-based response, and one
  body-based response.
- The final diff changes only the missing route in the objective handler.

## Debugging task

After reaching green, temporarily remove a `return` that follows a greeting
error response. Reproduce and read the failure before asking Codex for a
diagnosis. Accept only a focused repair, rerun the failing case, then confirm
`/health` still succeeds.

## What you should be able to explain

- Which requests read files from disk and which are computed dynamically.
- Why route matching includes both method and pathname.
- How query input differs from path input and JSON body input.
- Why validation happens before successful response creation.
- Why a handler must not attempt to send two responses.
- How you verified generated code independently.
