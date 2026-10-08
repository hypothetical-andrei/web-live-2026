# Exercise Specification — Tiny HTTP Server

## Unit

Unit 01 — The Web as a System + AI-Assisted Development

## Learning objective

Trace how a tiny Node HTTP server serves files and processing endpoints, then implement one missing path-based route that turns request input into a deliberate JSON response.

## Why this exercise exists

HTTP Detective showed the protocol from the outside. This project exposes the server-side structure behind that traffic: some requests read files, some compute a response from query or body input, and one missing route asks the student to add pathname-based processing without framework abstractions.

## Prerequisites

- Completed HTTP Detective or equivalent request/response inspection experience.
- Basic JavaScript functions, conditionals, strings, objects, and `async`/`await` reading ability.
- Node.js LTS, `curl`, and a browser or HTTP client such as Thunder Client.

## Starting context

The project is a dependency-free JavaScript ESM application. Students receive:

- a working server shell with loopback/ephemeral-port support;
- supplied `GET /health`, `GET /`, and `GET /assets/site.css` routes;
- a working query-based processing route at `GET /api/greetings?name=<value>`;
- a working body-based processing route at `POST /api/echo`;
- centralized `404` and `500` fallbacks, start scripts, and tests.

The student version removes only the path-based processing branch from `handleApplicationRequest(request, response, url)`. Students study the working file/query/body examples and add the missing `GET /api/greetings/<name>` behavior.

## Required behavior

The completed project provides exactly these observable routes:

- `GET /` reads `public/index.html` from disk and returns it with `200` and an HTML content type.
- `GET /assets/site.css` reads `public/site.css` from disk and returns it with `200` and a CSS content type.
- `GET /api/greetings?name=<value>` returns `200`, declares `application/json`, and returns `{ "message": "Hello, <value>!", "source": "query" }`.
- If the `name` query value is missing or becomes empty after trimming, `GET /api/greetings` returns `400` with `{ "error": "name_required" }`.
- `GET /api/greetings/<name>` returns `200`, declares `application/json`, and returns `{ "message": "Hello, <value>!", "source": "path" }`, where `<value>` is the decoded final path segment after trimming.
- If the decoded path segment is empty after trimming, `GET /api/greetings/<name>` returns `400` with `{ "error": "name_required" }`.
- `POST /api/echo` accepts a JSON request body, returns `201`, declares `application/json`, adds `X-Echoed-Method: POST`, and returns the submitted JSON value unchanged.
- If the `POST /api/echo` content type is not `application/json`, it returns `415` with `{ "error": "json_required" }` without attempting to parse the body.
- If the JSON body is malformed, it returns `400` with `{ "error": "invalid_json" }`.
- The handler returns a boolean indicating whether it handled the request; the supplied shell owns the fallback response.

## Constraints

- Use JavaScript ESM, Node.js LTS, and built-in Node APIs only.
- Use `node:http`; do not use Express or a routing dependency.
- Read files directly from disk for the supplied file routes.
- Read the request body asynchronously for the JSON echo route.
- Bind only to loopback; automated tests use an OS-assigned port.
- Set response status and content type explicitly.
- Do not modify the supplied server shell, static files, baseline route, fallback handling, or tests as student work.

## Observable completion criteria

- The documented server command prints a usable loopback URL.
- A browser request to `/` loads the supplied page and stylesheet from disk.
- `curl` or Thunder Client demonstrates one file response, one query-based response, one path-based response, and one body-based response.
- Response status, relevant headers, and JSON bodies match the contract.
- `npm test` passes all baseline, objective, and regression checks.
- The student can explain which requests read a file, which process query input, which process a path segment, and which process a request body.

## Validation plan

### Baseline checks

- A server instance starts and stops cleanly on an ephemeral loopback port.
- `GET /health` returns `200` and `{ "status": "ok" }` independently of the objective handler.
- `GET /` and `GET /assets/site.css` serve text from disk with the expected content types.

### Objective checks

- The missing path-based greeting route returns the documented success payload and JSON content type.
- The path-based route decodes `%20`-escaped spaces, trims the resulting value, and returns the trimmed name.
- An empty decoded path segment produces the specified `400` client error.

### Regression checks

- The query-based greeting route still validates and uses the query value.
- The echo route still returns `201`, the submitted JSON value, JSON content type, and `X-Echoed-Method`.
- Unsupported media type and malformed JSON still produce the specified client errors.
- Unknown paths and unsupported methods still return the supplied `404` JSON response.
- A failed request does not prevent a subsequent health request.

## Intended student work

After reference validation, copy the validated reference and remove only the branch in `handleApplicationRequest` that handles `GET /api/greetings/<name>`. Keep the query-based greeting route, the body-based echo route, file-serving behavior, tests, and all other infrastructure intact.

The student's objective-specific responsibility is to reintroduce the missing path-based processing route in `student/src/application-handler.js`. Baseline and regression checks must pass in the derived student version. Objective checks must fail because the missing path route falls through to the supplied `404` response.

## Codex task

> Inspect `src/server.js`, `src/application-handler.js`, and the objective tests. Implement only the missing `GET /api/greetings/<name>` branch in `handleApplicationRequest`; do not change the server shell, static files, tests, or dependencies. Decode the final path segment, trim it, return the exact documented JSON contract, and preserve the existing query/body routes. Done when all npm checks pass and the diff stays inside the allowed file. Show me the diff and identify where the path route becomes a handled response instead of falling through to `404`.

The student must inspect the proposed diff, reject changes outside the named file, run each test category, manually inspect a file response plus one query, path, and body request with `curl` or Thunder Client, and explain the handler's boolean contract.

## Debugging / extension task

- Deliberately remove the `return` after sending one greeting error response. Reproduce the resulting double-response failure, ask Codex to diagnose the smallest cause from the stack trace, repair it, and verify both the error and subsequent health request.

## Out of scope

- Express, persistence, authentication, CORS, templates beyond the supplied static file, or production deployment.
- A general routing framework or abstraction layer.
- Request-body size-limit handling, streaming large bodies, or media types other than JSON for processing endpoints.
