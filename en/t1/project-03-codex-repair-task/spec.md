# Exercise Specification — Codex Repair Task

## Unit

Unit 01 — The Web as a System + AI-Assisted Development

## Learning objective

Diagnose three bounded HTTP defects from failing runtime checks and repair them
without rewriting unrelated working code: one response has the right data but
the wrong content type, one validation branch commits an error response and
then crashes because processing continues after headers were sent, and one
legacy response must be normalized into the public contract.

## Why this exercise exists

AI-assisted development is most useful when students can constrain a repair,
inspect its scope, and prove its behavior. This exercise starts from a small
service with three distinct but realistic bugs. The student must separate the
cases, keep the repair bounded, and verify each fix with tests and live HTTP
evidence.

## Prerequisites

- HTTP request/response vocabulary from Projects 1 and 2.
- Ability to read small JavaScript modules and test failures.
- Familiarity with running targeted npm scripts, inspecting diffs, and checking
  responses with `curl`.

## Starting context

The project is a dependency-free Node ESM service for a fixed set of clue
records. The server shell, URL/body parsing, health route, fallback behavior,
and `legacy-result.js` are supplied. Students must not rewrite the legacy
producer. The bounded repair surface in the student version is `src/server.js`
plus `src/normalize-contract.js`, where the validation control-flow and the
legacy-to-public contract adaptation live.

Supported operations are:

- list clues with `GET /api/clues`;
- create a clue with `POST /api/clues` and a JSON `{ "text": "..." }` body;
- fetch a missing clue with `GET /api/clues/missing`.

## Required behavior

- List returns `200`, JSON content type, and
  `{ "data": [{ "id": "clue-1", "text": "crumbs" }] }`.
- The underlying list data is already correct, but the public response must not
  leak the legacy `text/plain` content type.
- Create success returns `201`, JSON content type,
  `Location: /api/clues/clue-2`, and
  `{ "data": { "id": "clue-2", "text": <submitted> } }`.
- Create validation failure for a missing or blank `text` field returns `422`,
  JSON content type, and
  `{ "error": { "code": "text_required", "message": "Text is required" } }`.
- The create validation branch must complete exactly one response; it must not
  continue into a headers-sent crash after the error response is committed.
- Missing lookup returns `404`, JSON content type, and
  `{ "error": { "code": "clue_not_found", "message": "Clue not found" } }`.
- `normalizeContract` maps only the known legacy operations to these public
  descriptors and does not mutate the legacy result.
- Invalid JSON continues to return the supplied `400 invalid_json` error, and
  unknown routes continue to return the supplied `404 not_found` fallback.

## Constraints

- JavaScript ESM, Node.js LTS, and built-in APIs only.
- Do not edit `legacy-result.js`, tests, dependencies, or the route set as
  student work.
- Keep the repair bounded to `src/server.js` and `src/normalize-contract.js`.
- Do not rewrite the service architecture or replace the legacy producer.
- Preserve the course JSON error shape
  `{ "error": { "code", "message" } }` for repaired failures.
- Bind to loopback and support ephemeral ports.

## Observable completion criteria

- Initial objective checks demonstrate the wrong list content type, the
  invalid-create double-send failure, and the unnormalized missing response
  while baseline and regression checks remain green.
- The final diff is confined to `src/server.js` and
  `src/normalize-contract.js`.
- All automated checks pass after the repair.
- `curl -i` shows JSON content type for list, `422` for missing-text create,
  and `404` plus the structured error for a missing clue.
- The student can explain which bug was a header problem, which bug was a
  control-flow problem, and which bug was a normalization problem.

## Validation plan

### Baseline checks

- Server startup and `GET /health` work independently of the repair.
- The legacy producer remains deliberately unchanged and still exposes its
  documented naive values:
  list has the wrong content type and missing still reports the wrong outcome.

### Objective checks

- List keeps the correct clue data while the public response uses JSON content
  type.
- Create validation failure returns the `422 text_required` contract and does
  not break a subsequent health request.
- Missing lookup uses `404` and the standard structured error.
- Normalization does not mutate a frozen legacy input.

### Regression checks

- Create success still uses `201`, the required `Location`, and the data
  envelope.
- Malformed create JSON returns the supplied `400 invalid_json` error.
- Unknown routes return the supplied `404 not_found` error.
- A failed unknown-route request does not prevent a subsequent health request.

## Intended student work

After validating the reference, copy it and remove only the bounded repair
implementation in `src/server.js` and `src/normalize-contract.js`. Replace the
real list/missing normalization logic with a TODO passthrough that returns the
unmodified legacy result, and remove the safe completion of the `422`
validation branch so it keeps going after headers were sent.

The incomplete student service remains runnable: baseline and regression tests
pass, while objective checks expose the content-type defect, the invalid-create
double-send defect, and the missing-response normalization defect.

## Codex task

> Diagnose the failing objective checks and inspect `src/legacy-result.js`,
> `src/server.js`, `src/normalize-contract.js`, and the server send path.
> Repair only `src/server.js` and `src/normalize-contract.js`; do not edit the
> legacy producer, tests, or route set. Keep the list data intact while fixing
> its public content type, stop the invalid-create branch after its `422`
> response is committed, and normalize the missing clue response to the
> documented error contract. Done when the focused objective checks and the
> full suite pass, and the diff touches only those two files. Explain each
> header, control-flow, and body-shape correction before changing code.

Students first write their own diagnosis from test and `curl` evidence, compare
it with Codex's diagnosis, inspect the proposed diff, and independently rerun
both success and failure paths.

## Debugging / extension task

- Add a new failing test requiring a `204 No Content` delete response, then ask
  Codex to propose the smallest extension to the server and normalization
  contracts. Reject any proposal that sends a JSON body with `204`, and explain
  why.

## Out of scope

- Persistence, user-supplied identifiers, a complete CRUD API, Express,
  authentication, or generalized middleware.
- Rewriting the deliberately naive legacy producer.
- Broad refactoring or regenerating the service.
