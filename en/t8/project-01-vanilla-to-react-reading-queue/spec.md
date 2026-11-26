# Exercise Specification — Vanilla-to-React Reading Queue

## Unit

Unit 08 — React with Vite

## Learning objective

Rebuild the supplied reading queue in React. Preserve its add, filter, and update behavior, keep state in the right component, and synchronize the required data with storage.

## Why this exercise exists

React syntax is easier to understand when you can compare two implementations of the same UI. The task is not to redesign the domain: it is to map imperative DOM ownership to declarative rendering and state transitions while verifying behavioral parity.

## Prerequisites

- Unit 03 DOM/events/modules and Unit 04 semantic UI.
- JavaScript arrays, immutable updates, async/effect vocabulary.
- Basic Vite development commands.

## Starting context

You have received a Vite React ESM project with:

- a complete runnable vanilla reading queue under `vanilla/`, supporting add, toggle-read, remove, visible-count filtering, and local-storage persistence;
- supplied semantic CSS, storage adapter, stable IDs, fixture data, entry point, test harness, and accessible names;
- an incomplete `src/App.jsx`, whose component tree must provide the same observable behavior without querying or manually mutating DOM nodes.

The React app receives `storage`, `initialItems`, and `createItemId` props for deterministic tests. Stored data, when present and valid, wins over `initialItems` during initial state construction. Valid stored data is an array whose entries have a non-empty string `id`, non-empty string `title`, and boolean `read`; any other parsed shape falls back as a whole.

## Your task

Rebuild the supplied reading queue in React. Preserve its add, filter, and update behavior, keep state in the right component, and synchronize the required data with storage.

Work in the supplied `student/` project. Change only `src/App.jsx`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- Render a `ReadingQueue` application composed from at least `QueueForm`, `QueueFilter`, `QueueList`, and `QueueItem` components; pass data/callbacks through explicit props.
- Initialize items once from `storage.getItem("reading-queue")`, falling back to `initialItems` for absent or invalid stored JSON.
- Use a controlled title input; trim on submit; ignore blank titles; add `{ id, title, read: false }` through `createItemId`; clear the input after success.
- Render all/remaining/read filters with exact visible counts and an active-state indication.
- Toggle one item immutably, remove one item, and render stable keys from IDs.
- Show a useful empty state when the selected filter has no items.
- Synchronize the complete item array to `storage.setItem("reading-queue", JSON.stringify(items))` in an effect after initial mounting and when items change; filter changes alone must not write storage. The supplied storage prop keeps a stable identity.
- Preserve supplied semantic elements, labels, buttons, status text, and keyboard behavior.
- Do not call `document.querySelector`, `innerHTML`, manual listener APIs, or mutate item/state arrays.

## Constraints

- JavaScript JSX, React with Vite, ESM, supplied CSS/storage/ID/test setup, and pinned lock file.
- Implement only `src/App.jsx`; do not edit vanilla evidence, entry point, CSS, fixtures, tests, or dependencies.
- Use React local state/effects; do not add a state library, router, server, reducer framework, or component dependency.
- Keep persistence synchronous and local; server synchronization is introduced later.

## Observable completion criteria

- Vanilla and React behavior traces agree for add/toggle/remove/filter/count/empty-state flows.
- Reload initialization uses valid stored data and safely falls back for invalid storage.
- Storage writes contain exact complete items and do not occur solely because a filter changes.
- Component inventory/props, immutable updates, controlled input, and stable keys are inspectable.
- Vite build, categorized checks, audit, and a browser smoke check pass; only `src/App.jsx` changes.

## Validation plan (for course authors)

### Baseline checks

- Supplied vanilla application behavior, fixtures, storage adapter, React entry/Vite configuration, CSS, and test environment work independently of `App.jsx`.

### Objective checks

- Render initial/valid stored/invalid stored states and exact counts.
- Submit trimmed/blank input and verify controlled clearing plus supplied ID use.
- Toggle/remove/filter flows preserve source identity and produce exact visible/empty states.
- Spy on storage initialization and effect writes, including no filter-only write.
- Inspect rendered component/semantic relationships and source bans.

### Regression checks

- Vite production build succeeds.
- Multiple app instances with separate storage do not share state/listeners.
- Invalid stored shapes do not crash and storage failures are surfaced through the supplied safe adapter policy.
- No manual DOM APIs, array mutation methods, or unstable index keys appear in objective source.

## Authoring note — preparing the starter

After reference validation, copy the reference and remove only the React component tree/state/event/effect implementation from `src/App.jsx`. Preserve imports, prop contract, a focused unavailable component, and TODOs naming behaviors but not code structure.

The Vite shell/build, vanilla evidence, fixtures, and router-independent baseline remain healthy. React objective checks fail at the documented unavailable UI boundary. No completed component implementation remains in comments, snapshots, generated output, or alternate files.

## Codex task

> Rebuild the supplied reading queue in React. Preserve its add, filter, and update behavior, keep state in the right component, and synchronize the required data with storage. Change only `src/App.jsx`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Add `filter` to the persistence effect dependencies while writing only items. Observe or spy on the unnecessary storage write, explain dependency ownership, and restore the minimal dependency.

## Out of scope

- Network APIs, routing, authentication, global state, reducers, drag-and-drop, optimistic updates, or visual redesign.
