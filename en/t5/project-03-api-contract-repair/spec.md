# Exercise Specification — Meeting API Repair

## Learning objective

Repair the meeting API so every request gets the documented response. Correct status codes, response bodies, validation, and error handling without changing the data store.

## Starting context

You have received a small Express 5 meeting-invitation API with an in-memory store, server startup, error handling, and HTTP tests. Three handlers in `src/meeting-router.js` run but contain four defects. There is no legacy adapter or fallback. Meeting records have `id`, `title`, and boolean `accepted`.

## Your task

Repair the meeting API so every request gets the documented response. Correct status codes, response bodies, validation, and error handling without changing the data store.

Work in the supplied `student/` project. Change only `src/meeting-router.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- `GET /api/meetings` returns `200` with `{ data: meetings }`.
- Listing supports `?sort=title&order=asc` and `?sort=title&order=desc`. Defaults are `sort=title` and `order=asc`. Compare titles lexicographically with JavaScript string comparison; reverse that comparison for descending order. Equal titles retain stored order. Sort a copy, never the stored collection.
- Unsupported, repeated, or structured `sort`/`order` parameters return `400` with `{ error: { code: 'invalid_sort', message: 'Use sort=title and order=asc or desc' } }`.
- `GET /api/meetings/:meetingId` returns `200` with `{ data: meeting }` when found, or `404` with `{ error: { code: 'meeting_not_found', message: 'Meeting not found' } }` when absent. Neither branch may leave the request pending.
- `POST /api/meetings/:meetingId/accept` accepts a pending invitation, returning `200` with `{ data: meeting }`. Missing meetings return the same `404` error as retrieval. An already accepted invitation returns `409` with `{ error: { code: 'already_accepted', message: 'Invitation already accepted' } }`, without changing its data. The important distinction is a `4xx` failure rather than a `2xx` success; `409` is the specified response for this conflict.
- Success responses consistently wrap their value in `data`; errors consistently use `{ error: { code, message } }`. JSON responses declare the JSON media type.
- Unexpected store errors reach supplied error middleware, which returns a sanitized `500`. Unknown routes use the supplied `404` response.

## Four starting defects

1. Missing-meeting retrieval has no response or error forwarding, so the request hangs.
2. Accepting an already accepted invitation returns a success status class despite an error body.
3. Successful single-meeting retrieval returns a bare meeting instead of `{ data: meeting }`.
4. Listing validates `order` but does not apply it: descending requests still get ascending results.

## Constraints

Use JavaScript ESM, Express 5, Node LTS, native fetch, and existing dependencies. Add no endpoint, adapter, fallback, framework, or database. Keep sorting and HTTP response handling visible in the ordinary handlers. You must edit only `src/meeting-router.js`.

## Verification

- Baseline: startup, landing page, health, supplied store, and normal retrieval/acceptance operate.
- Objective: a missing retrieval finishes within a bounded timeout; already-accepted responses are in the `4xx` class; list/detail/accept success shapes agree; ascending and descending requests return the specified orders. Each defect has a separate HTTP test.
- Regression: unsupported query values fail before listing, stored order is unchanged, absent acceptance responds, unknown routes work, unexpected errors are sanitized, and the server remains usable after an aborted hanging request.
- Test helpers abort bounded requests and forcibly close leftover connections so the intentionally hanging student endpoint cannot hang the test suite. A timeout is failure evidence, not a server-side repair.
- Reference: all checks pass. Student: baseline and regression pass, all four objective tests fail independently.

## Codex task

> Repair the meeting API so every request gets the documented response. Correct status codes, response bodies, validation, and error handling without changing the data store. Change only `src/meeting-router.js`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension

After repair, request an unsupported ordering and verify that the API reports an input error. Compare the stored order before and after ascending and descending requests to confirm that representation sorting does not mutate storage.

## Authoring note — preparing the starter

Validate the complete reference first, then copy it. Remove the missing-retrieval response, conflict status selection, detail wrapper, and requested-order selection only in meeting-router.js. Keep all tests and supporting files identical. Document these four differences in derivation.md. No completed alternative router may be present in the student tree.

## Out of scope

Creation/deletion, persistence, authentication, generalized sorting abstractions, legacy migration, and production request deadlines.
