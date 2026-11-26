# Exercise Specification — State and Effect Debugging

## Unit

Unit 08 — React with Vite

## Learning objective

Repair the React search panel. Make searches use the current input, prevent old responses from replacing newer results, and clean up requests when the component no longer needs them.

## Why this exercise exists

Generated components frequently appear correct in a happy-path demo while effects rerun unnecessarily, old requests overwrite new results, derived state drifts, and timers survive unmount. You need deterministic evidence tied to React's render/effect lifecycle rather than broad “optimize re-renders” advice.

## Prerequisites

- Project 1 or equivalent lecture knowledge of state, controlled inputs, events, effects, props, and values calculated during rendering. Completing optional Project 2 is not required.
- Promises, `AbortController`, timers, and cleanup.

## Starting context

You have received a Vite React project with:

- `evidence/GeneratedSearchPanel.jsx`, preserved weak code that mirrors `filteredResults` in state, recreates options in render, omits cleanup, and allows stale responses;
- a deterministic injected `search(query, { signal })` fake, deferred-response controls, timer harness, fixtures, entry/CSS/error boundary, and baseline evidence checks;
- incomplete `src/SearchPanel.jsx`, receiving `search`, `debounceMs`, `minimumLength`, and `onUnexpectedError` props.

## Your task

Repair the React search panel. Make searches use the current input, prevent old responses from replacing newer results, and clean up requests when the component no longer needs them.

Work in the supplied `student/` project. Change only `src/SearchPanel.jsx`. The detailed requirements specify the cases, data shapes, and restrictions you must preserve. Use the supplied tests and startup instructions to check your work.

## Required behavior

- Keep only user-owned `query` and request-owned `{ status, results, error }` state; derive visible result count/content during render.
- A controlled input updates immediately; trimmed queries shorter than `minimumLength` reset to idle with an empty result array without calling `search`.
- Debounce eligible searches by `debounceMs`; changing query or unmounting clears the prior timer.
- For each started request, create an `AbortController`, pass its signal, and abort it during effect cleanup.
- Ignore settlement from stale/aborted requests even when the injected fake resolves after abort; only the latest eligible query may update visible state.
- Show exact idle, loading, empty, results, and sanitized error states with accessible status semantics.
- Pass unexpected error objects unchanged to `onUnexpectedError`; never render internal messages. Abort-related rejections are expected cleanup and are not logged.
- Include every reactive value used by the effect in its dependencies. The supplied search/error callbacks are stable; do not omit a dependency, suppress linting, or memoize an arbitrary options object just to hide repeated execution.


A controlled input gets its displayed value from React state and updates that state through onChange. Debounce means waiting for a pause in typing before starting a search; replacing the timer postpones that search. Cleanup runs before an effect is replaced and when its component unmounts. An empty result message describes a completed search with zero matches; idle means the query is too short to search. These are visible states, not a requirement for five separate status values in code.

## Constraints

- JavaScript JSX, React + Vite, ESM, supplied deterministic tests/fake timers/search adapter, pinned lock file.
- Implement only `src/SearchPanel.jsx`; preserve weak evidence, entry, styling, tests, dependencies, and harness.
- Use one effect for the debounced request lifecycle; no data-fetching library, reducer, global state, custom hook extraction, or render-count optimization library.
- Do not modify the injected search function or assume abort prevents promise settlement.

## Observable completion criteria

- Fast typing triggers only the final debounced call.
- Slow older responses cannot replace newer results, including resolve-after-abort behavior.
- Query shortening and unmount clear timers/abort requests and produce no later state update.
- Idle/loading/empty/results/error transitions and accessible status text are exact.
- No mirrored filtered/count state, unstable dependency object, stale closure, or leaked timer remains.
- Build, categorized checks, audit, and browser smoke pass; only `src/SearchPanel.jsx` changes.

## Validation plan (for course authors)

### Baseline checks

- Supplied search fake, deferred controls, timer environment, app shell/error boundary, and preserved weak evidence reproduce stale-response and cleanup defects independently.

### Objective checks

- Controlled input plus minimum-length reset behavior.
- Debounce timing/call arguments, timer replacement, and exact call count.
- Out-of-order and resolve-after-abort settlements expose only latest results.
- Cleanup on query change/shortening/unmount aborts correct signals and prevents updates.
- Idle/loading/empty/results/sanitized-error accessibility states.
- Source inspection for one effect, dependency ownership, no mirrored derived state, and no lint suppression.

### Regression checks

- Vite production build succeeds.
- Separate panel instances do not share timers, controllers, results, or query state.
- Repeated same visible query does not trigger because of recreated option objects.
- The completed component does not render the weak evidence. The starter deliberately wraps that evidence so its defects remain reproducible; the evidence file itself stays unchanged.

## Authoring note — preparing the starter

After reference validation, copy the reference and replace only `src/SearchPanel.jsx` with a small adapter around the preserved generated evidence plus focused TODOs. The app remains runnable and baseline evidence remains observable; lifecycle/objective checks fail for the documented stale/cleanup reasons.

The evidence intentionally exposes defects but contains no repaired debounce/abort/latest-request pattern. Tests describe observable timing without duplicating the completed component.

## Codex task

> Repair the React search panel. Make searches use the current input, prevent old responses from replacing newer results, and clean up requests when the component no longer needs them. Change only `src/SearchPanel.jsx`. Read this specification and the supplied code before editing. Follow the required behavior, exact inputs/outputs, and restrictions here. Keep the tests and supplied infrastructure unchanged. Run the documented checks and report what passes, what fails, and why. Explain your changes so I can inspect them.

## Debugging / extension task

- Remove the latest-request guard while retaining abort. Resolve an aborted fake request after the newer request and explain why cleanup signaling alone is insufficient before restoring both protections.

## Out of scope

- Server caching, Suspense, React Query, transitions, server components, routing, pagination, global state, or production search ranking.
