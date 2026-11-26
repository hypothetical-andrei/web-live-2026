# Project 02 — Component Decomposition

## What you need to do

Split the supplied large dashboard into the required smaller components. Pass data and callbacks through props and preserve the page's existing behavior.

Work in `student/`. Change only `src/WorkshopDashboard.jsx`, `src/components/*.jsx`.

## How to work

Run characterization checks against the monolith and inventory its responsibilities before editing. Decide which component owns workshop/registration/form state, which values are derived, and what minimal props/callbacks each child needs.

Give Codex the task from `spec.md`. Reject changes to evidence/tests/CSS, copied behavior drift, context/reducers/effects for derived values, prop spreading, generic wrappers, or new features.

## Check your result

- The monolith evidence remains byte-identical and all characterization flows match.
- `WorkshopToolbar`, `CapacitySummary`, `RegistrationForm`, `AttendeeList`, and `AttendeeRow` exist with explicit props.
- One nearest-common owner holds canonical state; capacity/selection views are calculated during render.
- Validation, add/remove, switching, semantic table/form relationships, build, and browser render pass.

## Debugging task

Mirror `remainingSeats` in state and update it with an effect. Exercise add/remove/switch flows, identify the redundant truth and timing edge, then derive it from registrations and capacity again.

## What you should be able to explain

- Why each component boundary improves inspection.
- Why each state value lives in its owner.
- Which values must remain derived.
- How characterization prevents refactoring from changing features.
