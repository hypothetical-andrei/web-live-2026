# Exercise Specification — Component Decomposition

## Unit

Unit 08 — React with Vite

## Learning objective

Split the supplied large dashboard into the required smaller components. Pass data and callbacks through props and preserve the page's existing behavior.

## Why this exercise exists

AI-generated React often works while concentrating data shaping, UI sections, event handlers, and repeated markup in one component. You need to identify responsibilities and seams, then prove that decomposition improves reviewability without silently changing the product.

## Prerequisites

- Project 1 components, props, local state, events, collections, and controlled input.
- Array/object transformations and semantic HTML.

## Starting context

You have received a Vite React project containing:

- `evidence/OversizedWorkshopDashboard.jsx`, a preserved, runnable generated component with workshop filter, selection, capacity summary, registration form, attendee list, and remove behavior;
- deterministic fixture/ID helpers, supplied CSS, app entry, accessibility names, and characterization checks;
- a reference target composed from `src/WorkshopDashboard.jsx` plus components under `src/components/`.

The preserved evidence is never edited. The starter wraps it to provide working initial behavior; after decomposition, only the comparison harness renders it. The target owns canonical behavior and receives `initialWorkshops` and `createRegistrationId` props.

## Your task

Split the supplied large dashboard into the required smaller components. Pass data and callbacks through props and preserve the page's existing behavior.

Work in the supplied `student/` project. Change only `src/WorkshopDashboard.jsx`, `src/components/*.jsx`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- Decompose the target into `WorkshopToolbar`, `CapacitySummary`, `RegistrationForm`, `AttendeeList`, and `AttendeeRow` components plus the state-owning `WorkshopDashboard`.
- Keep workshop selection, registrations, and controlled form fields in the nearest common state owner; compute selected workshop, visible attendees, used seats, and remaining seats during render rather than duplicating them in state/effects.
- Pass minimal explicit props and callbacks; child components must not import fixtures or reach into parent state.
- Preserve exact characterization behavior: workshop filter/selection, remaining-capacity display, valid registration, blank/over-capacity rejection, form clearing on success, attendee ordering, and removal.
- Preserve semantic headings, labels, table/list relationships, status/error announcement, button names, and keyboard operation.
- Use immutable updates and stable registration IDs/keys.
- Avoid prop spreading, context, external state, custom hooks, memoization, or generic design-system wrappers for this intentionally small tree.

## Constraints

- JavaScript JSX, React + Vite, ESM, supplied styling/tests/fixtures, pinned lock file.
- Preserve `evidence/OversizedWorkshopDashboard.jsx` byte-for-byte.
- Objective changes are limited to `src/WorkshopDashboard.jsx` and `src/components/*.jsx`; do not change entry, fixtures, CSS, tests, package files, or evidence.
- Components may remain intentionally small; one-purpose wrappers that add no semantic or state boundary are not required.

## Observable completion criteria

- Characterization flows produce the same public DOM and state transitions for oversized evidence and decomposed target.
- Component inventory and imports show the five named children and one clear state owner.
- Derived capacity/selection data is not synchronized through effects or duplicate state.
- Invalid submissions do not mutate registrations; successful add/remove updates exact counts and rows.
- Build, categorized checks, audit, and browser smoke pass; the documented objective files are the complete delta.

## Validation plan (for course authors)

### Baseline checks

- Preserved oversized evidence passes characterization checks with fixtures, CSS, ID helper, Vite shell, and test environment.

### Objective checks

- Inspect component inventory/import graph and explicit prop responsibilities.
- Run filter/select/capacity/form/add/remove flows against the target and evidence and compare normalized observable DOM.
- Verify state ownership, derived render values, controlled fields, immutable updates, stable keys, and error/status behavior.
- Verify children work from props/callbacks with focused render checks.

### Regression checks

- Vite production build succeeds and both comparison harnesses render.
- Switching workshops after add/remove preserves per-workshop registrations and recomputes capacity.
- Objective code contains no context/reducer/effect/memo/custom-hook usage, fixture imports in children, prop spreading, mutation, or copied oversized component.
- Preserved evidence checksum remains unchanged.

## Authoring note — preparing the starter

After reference validation, copy the reference, remove the five objective component files, and replace `src/WorkshopDashboard.jsx` with a small adapter that renders the preserved oversized evidence. The starter remains fully runnable and behaviorally characterized, but the target component inventory/decomposition checks fail.

`derivation.md` documents the removed files and adapter change. The oversized evidence is an explicit input to refactor, not a leaked decomposed solution; no removed component implementation remains elsewhere.

## Codex task

> Split the supplied large dashboard into the required smaller components. Pass data and callbacks through props and preserve the page's existing behavior. Change only `src/WorkshopDashboard.jsx`, `src/components/*.jsx`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Move `remainingSeats` into state and synchronize it with an effect. Trigger add/remove/workshop-switch flows, identify the redundant source of truth, and return it to a render-time calculation.

## Out of scope

- Network persistence, routes, global state, performance tuning, reusable design systems, authentication, or new dashboard features.
