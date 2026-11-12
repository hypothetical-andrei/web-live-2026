# Exercise Specification — Registration API Redesign

## Unit

Unit 07 — Relationships, Transactions and API Design

## Learning objective

Replace the action-based registration routes with the specified resource URLs. Validate filters and pagination, and make repeated membership requests produce the required stable result.

## Why this exercise exists

An ORM association does not automatically produce a good public API. Generated code often exposes `/register`, `/unregister`, or database-shaped junction operations. You must evaluate resource identity, method semantics, URL state, and client observability rather than accepting a larger refactor because it looks more RESTful.

## Prerequisites

- Unit 07 lecture relationship/junction concepts. The service is supplied; completing Project 1 is not required.
- Unit 05 routing/status/error contracts and Unit 06 closed query validation.

## Starting context

You have received an Express 5 ESM application with:

- a supplied in-memory `registrationService` whose methods are `list({ sessionId, ticketType, limit, offset })`, `put({ sessionId, attendeeId, ticketType })`, and `remove({ sessionId, attendeeId })`;
- fixed service outcomes/domain errors, static comparison page, app assembly, fallback/error middleware, tests, and a preserved `naive-action-router.js` exposing flawed POST action endpoints for audit only;
- an incomplete `createRegistrationRouter({ service })` in `src/registration-router.js`, mounted at `/api/sessions/:sessionId/registrations` with `mergeParams: true`.

Registration identity is the pair `(sessionId, attendeeId)`. Public representations contain `sessionId`, `attendeeId`, `ticketType`, and `registeredAt`.

## Your task

Replace the action-based registration routes with the specified resource URLs. Validate filters and pagination, and make repeated membership requests produce the required stable result.

Work in the supplied `student/` project. Change only `src/registration-router.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- The paths below are relative to `/api/sessions/:sessionId/registrations`. `GET /` lists registrations for that session and returns `{ data, page: { limit, offset, count } }`. `count` is the total matching registrations before pagination, not just the returned page size.
- Optional `ticketType=standard|student|speaker` filters exactly.
- Optional `limit` is a base-10 integer `1..50`, default `20`; `offset` is a base-10 integer `>=0`, default `0`.
- Reject unknown, repeated, blank, coerced, or out-of-range query parameters with `400 invalid_query` before calling the service.
- `PUT /:attendeeId` accepts JSON exactly `{ ticketType }`; it is idempotent: service outcome `created` returns `201`, `Location` for the nested registration, and `{ data }`, while `existing` or `updated` returns `200` with `{ data }`.
- `DELETE /:attendeeId` returns `204` with no body when removed and also when the registration is already absent (idempotent target state).
- Missing parent session or attendee errors become stable `404` envelopes; invalid ticket/body/media errors become stable `400`/`415` envelopes through supplied classes/middleware.
- The router never exposes action paths, database/junction model names, or service-internal outcome fields.
- Every service call uses IDs from path parameters; body/query cannot override identity.
- Unexpected service failures are forwarded to centralized sanitized `500` handling.


Idempotent means that repeating the same request has the same intended effect on resource state as making it once. Responses can differ: the first PUT can return 201 and a repeat 200. DELETE concerns an absent registration when its parent session and attendee exist; missing parents still produce 404. `mergeParams: true` makes the parent router's sessionId available in this nested router.

## Constraints

- JavaScript ESM, Express 5.1.0, native `fetch`, and Node's test runner; no database dependency is needed because service behavior is supplied.
- Implement only `src/registration-router.js`; preserve naive evidence, service, app, tests, and dependencies.
- Use `Router({ mergeParams: true })`; do not remount the app, mutate service results, add `/register|/unregister` aliases, or move identity into request bodies.
- Parse the closed query language explicitly; do not use a validation package for this small contract.
- Keep pagination offset-based for this exercise; cursor design may be discussed as a variation.

## Observable completion criteria

- Browser/`curl` traces demonstrate list/filter/page, create `201`+`Location`, repeat/update `200`, and repeated delete `204`.
- Invalid queries/media/bodies call no service method and return exact stable errors.
- A route inventory contains only nested resource paths and deliberate methods.
- Comparison prose explains why the redesigned API improves identity/idempotency without claiming every nested URL is universally superior.
- All checks pass and the final diff touches only `src/registration-router.js`.
