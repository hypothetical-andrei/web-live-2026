# Lecture 08 — React with Vite

> Planned duration: 95 minutes  
> Format: three concept blocks, five worked examples, and three retrieval intermezzos

## Learning outcomes

By the end of this lecture, you should be able to read JSX, pass props and callbacks, update local state without mutation, use stable keys and controlled inputs, and set up and clean up effects for external systems.

## Session map

| Segment | Time | Focus |
| --- | ---: | --- |
| Opening comparison | 0–7 min | Imperative mutation vs declarative UI |
| Concept block 1 | 7–29 min | Components, JSX, props, decomposition |
| Intermezzo 1 | 29–33 min | Render/prop checks |
| Concept block 2 | 33–57 min | State, events, forms, collections |
| Intermezzo 2 | 57–61 min | State/identity checks |
| Concept block 3 | 61–82 min | Effects, cleanup, migration, Vite |
| Intermezzo 3 | 82–86 min | Synchronization checks |
| Synthesis | 86–95 min | Trace props, state, events, and effects |

> When a command starts a persistent server (`npm start`, `npm run dev`, or `node server.mjs`), leave it running and use another terminal for tests/builds. For an example with an API and Vite, run them in separate terminals; stop servers with Ctrl+C when finished.

## Describe the page from its current data

In Lecture 03, you created DOM nodes and changed them in event handlers. With React, you write components that describe what to display for the current inputs and state. When those values change, React calls your components again and updates the DOM where needed.

Use a reading queue as a concrete case: a parent component stores the books, a list displays them, and buttons request changes. You will follow data from the parent into the child, then follow a click back to a state update and a new render. **Rendering** means calling components to calculate their element descriptions; **committing** means applying the necessary changes to the DOM.

## Concept block 1 — components, JSX, props, and boundaries

### 1. A component is a function that describes part of the UI

A function component receives an object of inputs called **props** and returns React elements. For example, a `BookTitle` component could receive a title and return an `h2` containing it. Use components to name useful pieces of the page, such as a book row or an add-book form.

### 2. React elements describe the DOM you want

An element describes a type such as `h2`, its props, and its children. It is not itself the browser's DOM node. React compares the new description with the previous one—often called reconciliation—then commits the necessary DOM changes. Your render function describes the result rather than calling `document.createElement` for each update.

### 3. Read JSX as syntax for creating elements

**JSX** is a syntax extension transformed into JavaScript element-creation calls by your build tool. `<h2>{title}</h2>` describes a heading whose content comes from the JavaScript expression `title`. Use braces for expressions, `className` for a CSS class, and capitalized names for your own components. JSX resembles HTML, but the browser does not execute JSX source directly.

### 4. Rendering must remain pure

Given the same props and state, rendering should describe the same UI without starting requests, timers, subscriptions, or storage writes.

### 5. Props flow from parent to child

Props are read-only component inputs. A child should not mutate them or secretly import the parent's data fixtures.

### 6. Pass a callback so the child can request a change

The parent stores the books and passes a book plus `onToggle` to a row. The row's click handler calls `onToggle(book.id)`; the parent updates its state; React renders again with the new values. The child does not need to mutate the parent's array or know where it is stored.

### 7. `children` is a prop

Use children when a component owns surrounding structure while a parent supplies nested content.

### 8. Worked example — component and props render

Run [component and props render](examples/01-component-props-render/):

```bash
cd lectures/08-react-vite/en/examples/01-component-props-render
npm install
npm run dev
npm run build
```

Open the Vite page and inspect the parent and child components. The parent iterates over data; children receive props and nested content through children. You are observing a rendered React page, not only generated HTML text.

### 9. Split components where the parts become easier to understand

Extract a repeated row, a form with its own behavior, or a meaningful page region. Give the component explicit props and callbacks. Do not create a new component for every wrapper element: a useful split lets you understand and test a part without tracing unrelated code.

### 10. Avoid both extremes

One huge component hides responsibilities. Dozens of pass-through components create navigation without clarity. Prefer the smallest tree whose names and props improve inspection.

### 11. State belongs in the nearest common owner

Place state in the lowest component that must coordinate all consumers and transitions. Do not lift every value to the application root by reflex.

### 12. Record existing behavior before splitting components

Before refactoring the dashboard, record its labels, counts, ordering, validation, focus, and capacity rules in tests or manual checks. These are **characterization checks**: they describe what the current application does. Run them after extraction so a tidier component tree does not silently change the page's behavior.

## Intermezzo 1 — rendering and props

Answer the `u08-i1-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Identify the props passed to a child and the callback used to request a change.

## Concept block 2 — state, events, controlled forms, and lists

### 13. Use a Hook to keep state between renders

A **Hook** is a React function such as `useState` or `useEffect` that you call at the top level of a component or another Hook, not inside a condition or loop. `useState(initial)` returns the current value and a setter. Calling the setter requests another render; it does not change the state value captured by the current render. A local variable is recreated on the next call and is not a replacement for state.

### 14. Replace state immutably

Create new arrays/objects for changes rather than mutating current state. Identity then communicates which values changed.

### 15. Use functional updates for prior-state transitions

```js
setItems(current =>
  current.map(item => item.id === id ? { ...item, done: !item.done } : item)
);
```

This transition uses the state React supplies at update time.

### 16. Derived values are calculations

Filtered items, counts, selected records, and remaining capacity should usually be computed during render from their real inputs.

### 17. Worked example — immutable state and derived view

Run [immutable state and derived view](examples/02-immutable-state-view/):

```bash
cd lectures/08-react-vite/en/examples/02-immutable-state-view
npm install
npm run dev
npm run build
```

Toggle tasks and change the filter. Inspect the stored task array, then the visible list and remaining count calculated from it during rendering. The count is not a second state value you must synchronize.

### 18. Event props receive functions

`onClick={remove}` passes a handler. `onClick={remove()}` invokes during render and passes its result.

### 19. Preserve browser semantics

Buttons still need appropriate types; labels still need controls; locally handled form submission may call `preventDefault`. React does not supply accessibility automatically.

### 20. Controlled inputs render from state

```jsx
<input value={title} onChange={event => setTitle(event.target.value)} />
```

State is the current UI source of truth.

### 21. Normalize at a deliberate boundary

Preserve what the user types, then trim/validate on submission unless the product explicitly requires live normalization.

### 22. Worked example — controlled form transition

Run [controlled form transition](examples/03-controlled-form-transition/):

```bash
cd lectures/08-react-vite/en/examples/03-controlled-form-transition
npm install
npm run dev
npm run build
```

Type a title and submit it. Check validation, saving of the trimmed value, list update, and field clearing after success. Submit blank input too: the page should display its accessible validation error rather than silently ignore the attempt.

### 23. Collections use `map`

Each item becomes an element subtree. Empty, loading, and error states are part of the collection contract.

### 24. Give each item a stable key

**Siblings** are elements in the same returned list. React uses their `key` values to match an item between renders, so use a stable record ID rather than its current array position. If a row holds a draft and you insert a new book before it, its ID key lets the draft stay with that book. React consumes `key`; pass the ID separately if the child needs it as a prop.

### 25. Index is position, not identity

Index keys are unsafe when items insert, delete, or reorder because component-local state may follow a position rather than a domain record.

### 26. Worked example — stable key identity

Run [stable key identity](examples/04-stable-key-identity/):

```bash
cd lectures/08-react-vite/en/examples/04-stable-key-identity
npm install
npm run dev
npm run build
```

Edit a row's local input, then insert a new first item. Compare index keys with stable ID keys: with a stable key, the row's draft stays associated with its record instead of following an array position.

## Intermezzo 2 — state and identity

Answer the `u08-i2-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Explain what happens to row state when a list gets a new first item.

## Concept block 3 — effects, cleanup, migration, and Vite

### 27. Use an effect to connect rendering to an external system

`useEffect(setup, dependencies)` lets you start synchronization after a render is committed: for example, subscribing to events, starting a request, or writing to storage. The setup function may return a cleanup function. Calculate filtered lists and counts during rendering instead; they do not require an external system or an effect.

### 28. List the reactive values used by the effect

A **reactive value** here is a prop, state value, or value/function declared in the component body that the effect reads. List the relevant dependencies so React can restart synchronization when they change. React compares dependencies with `Object.is`. Do not omit a used value merely to force a preferred schedule; restructure the code if synchronization should depend on fewer values.

### 29. Check why an effect restarts on every render

An object or function created in the component body has a new reference on each render. If it is an effect dependency, React sees a changed value even when its contents look the same. First check whether you can move that construction into the effect or use simpler dependencies. Do not hide a real dependency merely to stop reruns.

### 30. A closure can retain an old render's values

A **closure** is a function together with access to the variables from where it was created. Each render creates functions that can retain that render's props and state. If a search effect reads `query` but does not list it as a dependency, its later callback may still use an old query. Check the values captured by each request rather than assuming a callback sees the latest state.

### 31. Follow setup and cleanup in order

For an effect with changing dependencies, follow this sequence:

1. React commits the render and runs setup.
2. A dependency changes and React commits a new render.
3. React runs the previous cleanup, then the new setup.
4. When the component is removed, React runs its remaining cleanup.

Use cleanup to remove listeners, clear timers, or abort requests. In development, Strict Mode may deliberately run an extra setup/cleanup cycle to check that your code handles it.

### 32. Ignore results from requests you no longer need

An abort signal asks a supporting API to cancel work; it is not a guarantee that every adapter or already-completed callback stops. Also keep a request ID or an active flag so an old callback can return without calling the state setter. Test a slow old request arriving after a faster new one.

### 33. Worked example — effect cleanup timeline

Run [effect cleanup timeline](examples/05-effect-cleanup-timeline/):

```bash
cd lectures/08-react-vite/en/examples/05-effect-cleanup-timeline
npm install
npm run dev
npm run build
```

Start the slow synchronization, then the fast one. Follow the previous effect cleanup and the new setup. Check that only the currently relevant operation can update the displayed state.

### 34. Do not mirror render-derived state in effects

An effect copying `items + filter` into `visibleItems` creates a second source of truth and an extra stale render. Calculate it directly.

### 35. List what the vanilla application does before migrating it

Find the persistent variables, values calculated from them, event handlers, DOM-building functions, and storage or network operations. For each, name the React component, state value, handler, or effect that will replace it. Keep a list of visible behaviors to check before and after the migration.

### 36. Translate responsibilities, not syntax line-by-line

Persistent variables become state; DOM construction becomes rendering; listeners become event props; manual class/text changes become expressions; external synchronization may become effects.

### 37. Vite is tooling, not architecture

Vite provides the ESM dev server, JSX transformation, hot updates, assets, and production build. Use it instead of Create React App or custom Webpack/Babel in this course.

### 38. Build success is limited evidence

`npm run build` proves module/transformation health. It does not prove event behavior, accessibility, effect cleanup, or state ownership. Pair it with tests and browser inspection.

## Intermezzo 3 — effects and migration

Answer the `u08-i3-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Separate calculations during rendering from effects and their cleanup.

## Synthesis — distinguish the parts of a component

```text
props: parent-owned inputs
state: component-owned values across renders
derived values: calculations from props/state
events: requested transitions
effects: synchronization with external systems
cleanup: reversal/invalidation of synchronization
```

## Common failure modes

- Invoking handlers during render.
- Mutating props or state.
- Index keys for changing lists.
- Duplicating filtered lists/counts in state.
- Moving all state to context/global ownership.
- Children importing parent fixtures.
- Effects for pure calculations.
- Unstable or missing dependencies.
- Missing timer/request/subscription cleanup.
- Assuming abort prevents every stale settlement.
- Treating Vite build success as UI verification.

## Relation to the tutorial

Vanilla-to-React Migration maps a known UI to components, state, controlled input, and one storage effect. Component Decomposition preserves behavior while extracting explicit responsibilities. State/Effect Debugging exposes stale state, races, dependency mistakes, and missing cleanup.

## AI-assisted development considerations

Ask an agent to list behavior, state ownership, derived values, props, effects, cleanup, and evidence before editing. Review for mutation, index keys, duplicate state, unnecessary context, unstable dependencies, missing cleanup, accessibility drift, and changed characterization checks.

## References

- Course migration map, Unit 08.
- `webtech-2025-course/c9/`, `webTechTutorials-main/S10/`, and mapped React examples.
- React documentation for components, JSX, state, events, lists, forms, and effects.
- Vite React documentation.

- [React useEffect: setup, dependencies, and cleanup](https://react.dev/reference/react/useEffect).
- [React rendering and effects](https://react.dev/learn/synchronizing-with-effects).
