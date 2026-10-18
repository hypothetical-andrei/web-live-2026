# Lecture Example — Prototype property lookup

## Concept demonstrated

JavaScript objects delegate missing property lookup through a prototype chain; `class` syntax uses that same mechanism.

## Why this example is in the lecture

Prototype delegation is a defining part of JavaScript that class-centric terminology can otherwise conceal.

## What to observe

- `id` begins as an own property while `priority` and `describe` are inherited.
- Assigning `task.priority` creates an own property that shadows the prototype value.
- A missing property resolves to `undefined` after lookup reaches the end of the chain.
- A class method is found on `ReviewTask.prototype`, not copied onto each instance.

## Run / inspect

```bash
node example.js
```

## Explanation

Property access first checks the receiver and then follows its prototype links. The example observes existing links; it does not recommend modifying built-in prototypes or changing prototypes dynamically in application code.

## Variations

- Delete the own `priority` and observe the inherited value become visible again.
- Add one intermediate prototype and draw the complete lookup path.

## Validation

Validated with `node example.js`; own, inherited, shadowed, missing, and class-method lookups are asserted.
