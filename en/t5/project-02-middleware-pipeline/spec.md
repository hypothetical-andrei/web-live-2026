# Exercise Specification — Middleware Pipeline

## Unit

Unit 05 — Server-Side JavaScript and REST APIs

## Learning objective

Build an ordered list of Express middleware for report requests. Assign a request ID, measure duration, validate input, and record one completion log without running later handlers after rejection.

## Why this exercise exists

Middleware is a control-flow protocol, not a list of unrelated callbacks. You need to see which middleware runs before a handler, which work resumes afterward, how rejection stops the pipeline, and who owns response-level observability.

## Prerequisites

- Completed In-memory Task API or equivalent Express routing experience.
- JavaScript closures, `try`/`catch`/`finally`, and HTTP header/status knowledge.

## Starting context

You have received a small Express 5 ESM application with:

- a complete `POST /api/reports` handler that assumes a validated body and returns `201` with an in-memory report representation;
- supplied app assembly, JSON parsing, not-found/error handling, server startup, and deterministic tests;
- injected dependencies `clock.now()`, `createRequestId()`, and `logger.info(entry)`;
- an incomplete `createReportPipeline(dependencies)` in `src/report-pipeline.js`, which must return an ordered array of Express middleware mounted before the handler.

A valid report body is a plain JSON object with exactly `summary` and `severity`; `summary` is a nonblank string after trimming and `severity` is one of `low`, `medium`, or `high`.

## Your task

Build an ordered list of Express middleware for report requests. Assign a request ID, measure duration, validate input, and record one completion log without running later handlers after rejection.

Work in the supplied `student/` project. Change only `src/report-pipeline.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- The pipeline uses a nonblank incoming `X-Request-Id` header when present; otherwise it calls the injected ID factory exactly once.
- It exposes the chosen ID as `request.requestId`, returns it in `X-Request-Id`, and includes it in every pipeline-produced error and completion log.
- Timing begins before validation/handler work and is captured immediately before response headers are committed.
- `X-Response-Time-Ms` is set at that commit boundary using the nonnegative difference between injected clock readings; completion logging reuses the captured duration rather than pretending to measure after an already-sent header.
- Exactly one structured log is emitted per request with `{ requestId, method, path, status, durationMs, outcome }`, where outcome is `completed` for `finish` and `aborted` for `close` before finish.
- A request without `application/json` short-circuits with `415` and the standard `json_required` error.
- Invalid report fields short-circuit with `400` and `{ "error": { "code": "validation_failed", "message": <stable message>, "requestId": <id> } }`.
- Validation replaces `request.body` with a normalized frozen object containing trimmed `summary` and the accepted `severity` before the route handler runs.
- A rejected request never invokes the route handler and still receives identity, timing, and one completion log.
- Unexpected synchronous middleware/dependency errors are forwarded to supplied centralized error handling.

## Constraints

- JavaScript ESM, Express 5, Node.js LTS, native `fetch`, and Node's test runner.
- Implement only `src/report-pipeline.js`; preserve route, app assembly, logger/factory fakes, tests, and error middleware.
- Add no logging, request-ID, validation, or timing packages.
- Do not patch `response.end`, log twice, or rely on wall-clock delays in tests.
- Register response lifecycle listeners before calling `next`.
- Keep middleware responsibilities separate and return them in an explicit order.

## Observable completion criteria

- Valid report creation returns `201`, normalized data, `X-Request-Id`, and a nonnegative response-time header.
- Invalid type/media requests return their documented errors without creating a report.
- Captured logs show exactly one completion record for successful, rejected, error, and aborted requests.
- Focused tests prove pipeline order and deterministic duration from injected dependencies.
- You can draw the request's downward middleware path and response completion path.

## Validation plan (for course authors)

### Baseline checks

- App/server startup, JSON parsing, the supplied handler, and centralized fallback behavior work with a known passthrough pipeline.
- Dependency injection records ID-factory, clock, logger, and handler calls deterministically.

### Objective checks

- Incoming/generated identity behavior, propagation, and call counts match the contract.
- Valid input is trimmed, frozen, and reaches the handler once.
- Media-type and field validation short-circuit before the handler with exact errors.
- Timing header and structured log contain the injected duration, final status, method/path, request ID, and correct outcome.
- A simulated close-before-finish path logs `aborted` once.

### Regression checks

- Malformed JSON remains owned by centralized parsing/error middleware but still receives pipeline-independent standard handling.
- Unknown routes and unrelated health behavior remain unchanged.
- Injected ID and clock dependencies are invoked only at their documented boundaries; a completion event never generates a second ID or duration.
- No response event listener remains active after its mutually exclusive completion event.

## Authoring note — preparing the starter

After validating the reference, copy it and replace only the middleware construction in `src/report-pipeline.js` with an exported function returning an empty array plus a focused TODO. Preserve dependencies and all other trees.

Your starting application remains runnable and the supplied handler can still create a report, so baseline checks pass. Objective identity, validation, timing, and logging checks fail in the documented way. Router/error behavior unrelated to the missing pipeline remains green.

## Codex task

> Build an ordered list of Express middleware for report requests. Assign a request ID, measure duration, validate input, and record one completion log without running later handlers after rejection. Change only `src/report-pipeline.js`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Move response-listener registration after `next()` and use a synchronously completing test handler. Observe the missing completion event, explain the ordering race, then restore registration before delegation.

## Out of scope

- Distributed tracing standards, external log transports, authentication, rate limiting, persistence, production proxy trust, or performance benchmarking.
