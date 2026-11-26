# Project 01 — Vanilla-to-React Reading Queue

## What you need to do

Rebuild the supplied reading queue in React. Preserve its add, filter, and update behavior, keep state in the right component, and synchronize the required data with storage.

Work in `student/`. Change only `src/App.jsx`.

## How to work

Run and inspect the vanilla evidence first. Record state that survives events, every user action, accessible name, rendered state, and persistence point. Then inspect fixtures, the safe storage adapter, prop contract, and categorized checks.

Give Codex the task from `spec.md`. Reject manual DOM APIs, mutation, index keys, duplicated filtered state, filter-triggered storage writes, new dependencies, or edits outside `src/App.jsx`.

## Check your result

- All categorized project checks, build, audit, and browser smoke pass.
- Valid storage initializes once; invalid shapes safely fall back.
- Add/toggle/remove/filter/count/empty behavior matches the vanilla application.
- Controlled input, stable IDs/keys, and immutable replacements are visible in the diff.
- One effect synchronizes complete items, not filter-derived UI.

## Debugging task

Add `filter` to the persistence effect dependencies. Change only the filter, observe the unnecessary write, explain why the effect owns items rather than views, and restore the minimal dependency.

## What you should be able to explain

- How each vanilla variable/listener/render operation maps to React.
- Props, state, derived values, and effects as distinct ownership categories.
- Why immutable replacement and stable keys matter.
- Why Vite build and browser behavior are separate evidence.
