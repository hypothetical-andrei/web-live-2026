# Lecture Example — Focus and motion preferences

## Concept demonstrated

Keyboard focus needs an observable indicator, while nonessential motion should respect the user's reduced-motion preference.

## Why this example is in the lecture

One native button shows that hover enhancement, focus indication, and motion preference are separate interaction contracts.

## What to observe

- The native button is focusable without scripting a keyboard role.
- `:focus-visible` supplies a high-contrast outline without removing the browser interaction model.
- The reduced-motion query disables the transition while preserving the action.

## Run / inspect

Open `index.html`, navigate with Tab, and toggle reduced motion in browser/OS emulation. The output reports focus and computed preference state.

## Explanation

Accessibility adaptations preserve functionality. Reduced motion removes a transition, not the button; focus styling adds evidence, not a pointer-only replacement.

## Variations

- Remove the custom focus rule and inspect the user-agent default.
- Emulate reduced motion and confirm the transition duration becomes zero.

## Validation

Validated in headless Chromium; the native button becomes the active element and computed output reports a visible outline. Manual preference emulation confirms the reduced-motion override.
