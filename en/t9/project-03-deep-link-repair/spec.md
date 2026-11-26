# Exercise Specification — Deep-Link Failure Repair

## Unit

Unit 09 — Routing, Forms and Full-Stack React

## Learning objective

Repair the production server so opening a React route directly loads the application. Preserve API errors and genuine missing-file responses instead of returning HTML for every request.

## Why this exercise exists

Client-side navigation can appear correct during Vite development yet fail after refresh or direct navigation in production. A catch-all that always sends `index.html` can hide missing assets and API errors. You need to reason across browser request, server routing order, static files, and client route resolution.

## Prerequisites

- Project 1 client routes, Vite builds, Express middleware order, static files, and HTTP statuses.
- Ability to inspect request/response content types and route traces.

## Starting context

You have received:

- a complete built React Router client fixture with `/notes`, `/notes/:noteId`, and catch-all UI, plus hashed asset and icon files;
- a supplied Express API router at `/api`, health endpoint, centralized API/fallback errors, request log, server/listen harness, and checks;
- `evidence/broken-server.js`, preserving two common failures: static-only deep-link 404 and universal HTML fallback that masks `/api`/missing assets;
- incomplete `server/create-production-app.js`, exporting `createProductionApp({ clientDirectory, apiRouter, requestLog })`.

## Your task

Repair the production server so opening a React route directly loads the application. Preserve API errors and genuine missing-file responses instead of returning HTML for every request.

Work in the supplied `student/` project. Change only `server/create-production-app.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- Create an Express app whose order is: health/API boundary, static file middleware, SPA navigation fallback, final non-navigation 404/error handling.
- Serve existing hashed assets/icons with exact file content type/body and cache behavior supplied by static middleware.
- For `GET`/`HEAD` requests that accept HTML and are outside `/api`, send the built `index.html` so direct `/notes/42` can boot the client router.
- Do not apply SPA fallback to non-GET/HEAD methods, `/api` or `/api/*`, missing asset-like paths containing a file extension, or requests that do not accept HTML.
- Preserve API router statuses/envelopes; unknown API routes return JSON `404`, never HTML `200`.
- Missing assets/non-navigation paths return a stable plain/JSON `404` with correct status and never the index body.
- Missing `index.html` or static read failures reach centralized sanitized `500` handling without leaking paths/stacks.
- Await/forward asynchronous send errors under Express 5 behavior and avoid double responses.
- Append supplied request-log entries in actual middleware order for diagnostic checks.

## Constraints

- JavaScript ESM, Express 5.1.0, supplied built client/API/tests, native fetch, pinned lock file.
- Implement only `server/create-production-app.js`; preserve broken evidence, client build fixture, API router, harness, tests, and dependencies.
- Use Express static/sendFile/routing primitives; no dev server, proxy, wildcard rewrite package, regex that accidentally captures API/assets, or rebuilding client output.
- The fallback is server delivery policy, not a replacement for client catch-all UI.

## Observable completion criteria

- Live traces prove `/`, `/notes/42`, and another extensionless client route return index HTML and boot route state.
- Existing assets return exact asset content; missing asset returns non-HTML `404`.
- Unknown API remains JSON `404`; POST client path and JSON-accept navigation do not receive index.
- Request-log order explains which boundary handled every representative request.
- Checks/audit pass and only `server/create-production-app.js` changes.

## Validation plan (for course authors)

### Baseline checks

- Supplied client build fixture/router marker, API router, server/listen harness, request logger, and both broken evidence modes reproduce their distinct failures independently.

### Objective checks

- Middleware inventory/order and exact logged traces.
- Root/direct nested client GET/HEAD with HTML acceptance.
- Existing/missing assets, extension-like paths, and content types/bodies.
- Known/unknown API outcomes and non-HTML/non-idempotent exclusions.
- Missing index/static error sanitization, forwarding, and no double send.
- Rejected requests do not poison a later eligible navigation.
- Objective source has no dev proxy, universal `200` fallback, path leak, API import mutation, or raw file-read shortcut.

### Regression checks

- Server starts/stops cleanly and health remains independent.
- Client catch-all marker remains present and built artifacts remain byte-identical.
- Rejected deep-link requests do not poison later health/API/asset requests.
- API router, client source/build, broken evidence, and server harness stay supplied and runnable.

## Authoring note — preparing the starter

After reference validation, copy the reference and replace only `server/create-production-app.js` with the supplied static-only broken evidence adapter plus focused TODOs. The server starts, health/API/assets work, and baseline failure is observable; direct client deep links return `404` until repaired.

The universal-fallback counterexample remains unmounted evidence. No correct fallback predicate/order is duplicated in comments, tests, fixtures, or generated files.

## Codex task

> Repair the production server so opening a React route directly loads the application. Preserve API errors and genuine missing-file responses instead of returning HTML for every request. Change only `server/create-production-app.js`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Remove the file-extension exclusion and request `/assets/missing.js` with `Accept: text/html`. Explain why a `200` index response corrupts asset/debug/cache semantics, then restore the narrow fallback.

## Out of scope

- SSR, framework hosting adapters, CDN configuration, authentication, service workers, source maps, compression, or production cache tuning beyond supplied static behavior.
