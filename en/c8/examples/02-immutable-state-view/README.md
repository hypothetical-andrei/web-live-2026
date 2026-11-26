# Lecture Example — Immutable State and Derived View

## Concept demonstrated

Events replace owned state immutably; filtered collections and counts are derived during rendering rather than synchronized as duplicate state.

## Why this example is in the lecture

The Vite app lets students toggle and filter a rendered task list while inspecting actual `useState` and JSX.

## What to observe

- `toggle` returns a new array and a new changed item.
- The original fixture stays unchanged.
- `visible` is a calculation, not another source of truth.
- A filter event need not rewrite the items.

## Run / inspect

```bash
npm install
npm run dev
npm run build
```

## Explanation

The functional state update replaces the changed task immutably. Visible tasks and the remaining count are calculated during render, avoiding duplicate synchronized state.

## Variations

- Add a count derived with `filter(...).length`.
- Mutate `initial[0]` and explain why identity-based rendering becomes harder to reason about.

## Validation

Validated with a clean install and `npm run build`; inspect toggle and filter behavior in the Vite application.
