# Exercise Specification — In-memory Task API

## Unit

Unit 05 — Server-Side JavaScript and REST APIs

## Learning objective

Implement the task API routes for listing, creating, reading, updating, and deleting tasks. Validate requests and use the supplied repository to store the data.

## Why this exercise exists

You have already inspected and built raw HTTP handlers. Express should now reduce transport boilerplate without hiding the request/response contract. A supplied in-memory repository keeps routing, parsing, validation, and REST semantics visible before persistence is introduced.

## Prerequisites

- Units 1–4, especially HTTP messages, JavaScript modules, async error paths, and native `fetch`.
- Node.js LTS and npm.
- Ability to read small Express middleware and repository modules.

## Starting context

You have received a JavaScript ESM project using Express 5 with:

- `src/app.js`, which creates an app, enables `express.json`, mounts a task router at `/api/tasks`, and installs supplied not-found and error middleware;
- a complete injected in-memory repository with deterministic reset data and methods `list`, `findById`, `create`, `update`, and `remove`;
- a static page at `/` that identifies the API and links to its documentation;
- tests that start the app on an ephemeral loopback port and use native `fetch`;
- an incomplete `createTaskRouter({ repository })` in `src/task-router.js`.

Tasks have exactly `id`, `title`, and `completed`. IDs are opaque strings assigned by the repository. The router owns HTTP parsing and validation; the repository owns collection state.

## Your task

Implement the task API routes for listing, creating, reading, updating, and deleting tasks. Validate requests and use the supplied repository to store the data.

Work in the supplied `student/` project. Change only `src/task-router.js`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- `GET /api/tasks` returns `200` and `{ "data": [ ... ] }` in repository order.
- `GET /api/tasks/:taskId` returns `200` and `{ "data": task }` when found.
- A missing task returns `404` and `{ "error": { "code": "task_not_found", "message": "Task not found" } }`.
- `POST /api/tasks` accepts JSON containing only `title`; it trims the title, creates `{ completed: false }`, and returns `201`, `Location: /api/tasks/<id>`, and `{ "data": task }`.
- `PATCH /api/tasks/:taskId` accepts one or both of `title` and `completed`, returns `200` and the updated task, and preserves unspecified fields.
- `DELETE /api/tasks/:taskId` removes an existing task and returns `204` with no body or content type.
- A create/update body that is not a plain JSON object, contains unknown fields, has an empty/blank title, or has a non-boolean `completed` returns `400` with `{ "error": { "code": "validation_failed", "message": <stable message> } }`.
- A create/update request without `application/json` returns `415` with `{ "error": { "code": "json_required", "message": "Content-Type must be application/json" } }`.
- Malformed JSON is handled by the supplied centralized error middleware as `400 invalid_json`.
- Router handlers pass unexpected repository errors to centralized error handling rather than exposing stack traces.

## Constraints

- Use JavaScript, ESM, Node.js LTS, Express 5, native `fetch`, and Node's built-in test runner.
- Use `express.json`; do not add `body-parser`, Axios, a validation package, a database, or a second HTTP framework.
- Implement application routes only in `src/task-router.js`; do not change the supplied repository, app assembly, error middleware, fixtures, or tests as student work.
- Match method and route deliberately; do not treat action verbs as resource paths.
- Send no body with `204`.
- Bind the validation server to loopback and support an OS-assigned port.

## Observable completion criteria

- The documented start command prints a usable loopback URL and serves the static landing page.
- A `curl` or native-fetch sequence can list, create, fetch, update, and delete one task using the specified status/header/body contracts.
- At least one invalid body, unsupported media type, missing task, malformed JSON, and unknown route produce their documented errors.
- `npm test` reports all baseline, objective, and regression checks passing.
- You can trace one request through Express parsing, router validation, repository invocation, and centralized error handling.

## Validation plan (for course authors)

### Baseline checks

- The Express app starts/stops on an ephemeral loopback port and serves `/`.
- JSON parsing, not-found middleware, error middleware, and the repository's deterministic reset behavior work independently of the objective router.
- The project uses ESM, the committed lock file, and only justified dependencies.

### Objective checks

- List/fetch/create/update/delete success paths match exact methods, statuses, `Location`, wrappers, and no-body semantics.
- Create/update validation rejects every documented invalid type and unknown field without mutating repository state.
- Missing-resource and unsupported-media responses use the standard error shape.
- An injected repository failure reaches the supplied `500 internal_error` handler without leaking its message or stack.

### Regression checks

- Malformed JSON remains `400 invalid_json` and does not create a task.
- Unknown API routes remain `404 not_found`.
- A failed request does not prevent a later health/list request.
- Repository-returned task objects are represented without transport-only fields or mutation.

## Authoring note — preparing the starter

After reference validation, copy the reference and replace only the route registration, request validation, and repository-to-response logic inside `src/task-router.js` with the exported router shell and a TODO. Preserve every other file and dependency.

The derived application still starts and serves baseline/static/not-found behavior. Baseline and router-independent regressions pass; objective route checks fail as `404` until you implement the router. You must not receive a duplicate completed router in tests, fixtures, documentation, or generated output.

## Codex task

> Implement the task API routes for listing, creating, reading, updating, and deleting tasks. Validate requests and use the supplied repository to store the data. Change only `src/task-router.js`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Deliberately remove the return after one validation response. Reproduce the double-send or unintended repository call, diagnose the control-flow path, and make the smallest repair before rerunning a later health request.

## Out of scope

- Persistence, Sequelize, relationships, authentication, pagination, filtering, CORS configuration, templates, deployment, and production concurrency.
- General-purpose router/validation abstractions or a complete frontend client.
