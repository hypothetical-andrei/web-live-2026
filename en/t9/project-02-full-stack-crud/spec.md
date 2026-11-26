# Exercise Specification — Full-Stack Notes CRUD

## Unit

Unit 09 — Routing, Forms and Full-Stack React

## Learning objective

Build the React interface for the supplied notes API. Load, create, edit, delete, and refresh notes; update displayed server data only after the API confirms the result.

## Why this exercise exists

Local React state updates immediately and belongs to one running UI. Server state is asynchronous, shared, failure-prone, and authoritative. You need a small full-stack boundary where requests, statuses, refreshes, and UI state are observable without introducing a data-fetching library or global state.

## Prerequisites

- Project 1 routed forms and Unit 08 effect cleanup/state ownership.
- Units 5–6 JSON APIs, status/error envelopes, fetch, and CRUD.

## Starting context

You have received one workspace with:

- a supplied Express notes API backed by Sequelize and SQLite, mounted at `/api/notes`, exact list/get/create/update/delete contracts, deterministic reset endpoint for tests, centralized errors, and loopback harness;
- a supplied `src/notes-api.js` fetch adapter that accepts `baseUrl` and optional `signal`, validates HTTP/envelope outcomes, and returns detached note data;
- Vite proxy configuration, entry/CSS, fixtures, accessible names, and tests;
- incomplete `src/NotesWorkspace.jsx`, receiving `api` and owning the client lifecycle.

The canonical UI is intentionally one workspace rather than repeating Project 1 routes. It lists notes, selects one for editing, creates, updates, deletes, and refreshes from the server.

The supplied backend stores notes in a SQLite file during normal startup, creates missing tables without deleting data, and seeds the initial note only in an empty database. It awaits database operations and closes the connection on shutdown. Tests use isolated in-memory or temporary-file databases. Public note IDs remain strings and public representations remain `{ id, title, body }`; ORM metadata is not exposed. The testing reset route is enabled only when the app is explicitly created with testing enabled. Persistence is supplied infrastructure, not additional student implementation work.

## Your task

Build the React interface for the supplied notes API. Load, create, edit, delete, and refresh notes; update displayed server data only after the API confirms the result.

Work in the supplied `student/` project. Change only `client/src/NotesWorkspace.jsx`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- On mount, request `api.list({ signal })`; render exact loading, loaded-list/empty, and sanitized load-error states; cleanup aborts the request.
- Keep server notes only from successful API results. Keep local UI state separately: selected ID, controlled title/body, mode, submission state, and user-facing error.
- Selecting a note fills the controlled edit form from current server data; `New note` resets selection/form.
- Trim submitted values and reject blank title locally without an API call.
- Create calls `api.create({ title, body })`; update calls `api.update(selectedId, { title, body })`; during either, disable submit and expose a submitting status.
- On successful create/update, use the returned authoritative note to immutably update the list, select it, and clear submission errors without an unnecessary full reload.
- Delete asks the API for the selected ID, removes it only after success, and returns the UI to new/empty selection state.
- A `Refresh notes` action reruns list, replaces server data, preserves selection only if that ID still exists, and cannot let an older refresh overwrite a newer one.
- Abort/unmount outcomes are silent; unexpected/network/API failures render stable messages, retain existing server data, and permit retry.
- Never infer success from local intent, expose internal messages, send IDs in bodies, or update server data before the API confirms.

## Constraints

- JavaScript JSX, React 19 + Vite, native fetch through the supplied adapter, Express 5 + Sequelize/SQLite supplied server, ESM, pinned lock file.
- Implement only `client/src/NotesWorkspace.jsx`; preserve API adapter/server/proxy/fixtures/tests/dependencies.
- Use local state and effects only; no React Router requirement here, Redux/context, React Query/SWR, optimistic update, cache library, or form package.
- Use one owned load/refresh lifecycle with cleanup/latest protection; CRUD submissions may be explicit event handlers.

## Observable completion criteria

- Real client/server smoke proves initial list, create, update, delete, refresh, and sanitized failure states.
- Deferred tests prove cleanup and newer-refresh-wins behavior.
- API spy tests distinguish UI state from authoritative returned server values.
- Loading/empty/error/submitting/success states and disabled controls are accessible and exact.
- Client/server builds/checks/audits pass; only `client/src/NotesWorkspace.jsx` changes.

## Validation plan (for course authors)

### Baseline checks

- Supplied Express API contract/error/reset/cleanup, fetch adapter, Vite proxy/build shell, fixtures, and deterministic deferred API work independently.

### Objective checks

- Mount loading/success/empty/error and abort cleanup.
- Select/new controlled form ownership and local validation with zero API calls.
- Create/update inputs, submitting state, authoritative result replacement, identity, and failure retention/retry.
- Delete confirmation boundary and post-success selection/list state.
- Refresh replacement, missing-selection reset, out-of-order settlement guard, and retained data on failure.
- Multiple workspace/API instances remain isolated.
- Source checks for one owned load effect, latest/abort protection, and HTTP-knowledge bans.

### Regression checks

- Client production build and server start/health work.
- Real loopback CRUD sequence plus malformed/unknown/sanitized errors pass.
- The application entry injects the supplied API adapter into the workspace.
- No direct fetch/HTTP status knowledge exists in the objective component and no UI code exists in the API adapter/server.

## Authoring note — preparing the starter

After reference validation, copy the complete workspace and replace only `client/src/NotesWorkspace.jsx` with a runnable unavailable panel retaining React imports, prop signature, and focused TODOs. The server, adapter, proxy, build, baseline API checks, and static shell remain healthy; lifecycle/CRUD objectives fail at the unavailable boundary.

No completed workspace lifecycle remains in tests, comments, generated output, alternate components, or server files.

## Codex task

> Build the React interface for the supplied notes API. Load, create, edit, delete, and refresh notes; update displayed server data only after the API confirms the result. Change only `client/src/NotesWorkspace.jsx`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Remove the refresh identity guard, start two deferred refreshes, resolve the newer then older request, observe stale server data, and restore latest-only publication alongside abort cleanup.

## Out of scope

- Routing integration, authentication, pagination, optimistic UI, offline caches, conflict resolution, implementing the supplied database layer, or global state.
