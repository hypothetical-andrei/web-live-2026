# Exercise Specification — Routed Notes Application

## Unit

Unit 09 — Routing, Forms and Full-Stack React

## Learning objective

Build the notes list, detail, create, and edit screens using React Router. Use the URL to identify the selected note, validate forms, and handle missing notes and unknown routes.

## Why this exercise exists

An SPA is not one screen hidden behind local booleans. URLs let users navigate, bookmark, refresh, share, and use browser history. You need to decide which state belongs in the URL and which remains temporary form/UI state before adding server synchronization.

## Prerequisites

- Unit 08 components, props, local state, controlled forms, collections, and Vite.
- Unit 05 resource identity/status concepts.

## Starting context

You have received a React/Vite/React Router project with:

- supplied immutable `notesStore` methods `list`, `get`, `create`, and `update`, seeded fixtures, deterministic IDs, CSS, entry/browser router, and categorized checks;
- incomplete `src/NotesApp.jsx`, receiving `store` and rendering inside the supplied router;
- tests using `MemoryRouter` to prove URL/history behavior without a server.

Public routes are `/notes`, `/notes/new`, `/notes/:noteId`, and `/notes/:noteId/edit`. A note contains `{ id, title, body }`.

## Your task

Build the notes list, detail, create, and edit screens using React Router. Use the URL to identify the selected note, validate forms, and handle missing notes and unknown routes.

Work in the supplied `student/` project. Change only `src/NotesApp.jsx`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- Define routes for the four public states plus a catch-all page; `/` redirects to `/notes` with history replacement.
- The list route renders notes as semantic links, an empty state, and a `New note` link.
- The detail route derives `noteId` from `useParams`; it renders title/body plus `Edit note` and `Back to notes` links, or a stable in-app note-not-found view without throwing.
- New/edit routes share one controlled `NoteForm` component; new starts blank, edit initializes from the path note, and missing edit targets show the same not-found view.
- Trim title/body on submit; require non-empty title; display an accessible validation error without calling the store or navigating.
- Successful create navigates with replacement to the new detail URL; successful edit navigates with replacement to the existing detail URL.
- Cancel uses declarative navigation to the appropriate list/detail state and does not write.
- Browser back/forward and direct `MemoryRouter` initialization reproduce route state; do not mirror route or note ID in local state.
- Preserve note identity in path parameters; forms/bodies cannot override IDs.

## Constraints

- JavaScript JSX, React 19, React Router, Vite, ESM, supplied store/styles/tests, pinned lock file.
- Implement only `src/NotesApp.jsx`; do not edit store, entry, fixtures, tests, package files, or CSS.
- Use React Router components/hooks rather than `window.location`, manual history calls, route regexes, or a routing dependency.
- Keep note data synchronous/local in this exercise; server state is Project 2.
- No context, Redux, loader/action API, or nested layout abstraction is required for this first router.

## Observable completion criteria

- Direct starts at every route render exact state, including missing note and unknown path.
- Link clicks plus back/forward produce exact URLs and content.
- Create/edit validation and successful navigation/store outcomes are deterministic.
- URL is the canonical route/note identity; form fields are local controlled state.
- Vite build, categorized checks, audit, and browser smoke pass; only `src/NotesApp.jsx` changes.

## Validation plan (for course authors)

### Baseline checks

- Supplied store/fixtures, browser entry, CSS, Vite/React Router test environment, and a known fake child render work independently of `NotesApp.jsx`.

### Objective checks

- Route inventory and root replacement.
- Direct list/detail/new/edit/missing/catch-all renders.
- Semantic links, params, history navigation, and URL-derived identity.
- Shared controlled form validation, no-call invalid paths, exact create/update inputs, replace navigation, and cancel behavior.
- Source checks for router APIs and bans.

### Regression checks

- Production build succeeds.
- Multiple router/store instances do not share location, notes, or form state.
- Editing after navigating between note IDs reinitializes the form for the route target.
- Objective source contains no window/history/document routing, route-ID state mirror, global state, or unsafe HTML.

## Authoring note — preparing the starter

After reference validation, copy the reference and replace only `src/NotesApp.jsx` with an unavailable route boundary retaining React Router imports, prop signature, and focused TODOs. Vite/store infrastructure and baseline pass; route/objective checks fail at the documented unavailable UI.

No alternate route tree, page implementation, snapshots, or generated bundle remains in the student tree.

## Codex task

> Build the notes list, detail, create, and edit screens using React Router. Use the URL to identify the selected note, validate forms, and handle missing notes and unknown routes. Change only `src/NotesApp.jsx`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Mirror `noteId` in component state and navigate directly between two detail/edit URLs. Diagnose the stale identity, then return route params to the single source of truth.

## Out of scope

- Server fetch, authentication, optimistic updates, data routers, nested outlets, global state, deletion, or deployment fallback.
