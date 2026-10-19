# Project 01 — Responsive Card/Grid Reconstruction

## Objective

Reconstruct a 1/2/4-column responsive catalog from fixed semantic HTML and `visual-spec.md`.

## Workflow

Inspect your unstyled page at 320, 768, and 1280 px. Identify outer sizing, collection layout, card internals, intrinsic overflow, focus, and motion as separate constraints. Use computed styles and Grid overlays rather than guessing from appearance.

Give Codex the bounded stylesheet task from `spec.md`. Review for fixed widths, overflow hiding, excessive specificity, JavaScript layout, missing focus, and breakpoints that do not match the contract. Compare all three viewports after every meaningful change.

## Success criteria

- Automated checks pass.
- Rendered layouts show 1/2/4 columns at the named widths without horizontal overflow.
- Long content wraps and actions align.
- Keyboard focus remains visible and reduced-motion disables transitions.
- Only `public/styles.css` changes.

## Debugging task

Insert one long unbroken label and reproduce its narrow-screen overflow. Ask Codex for an intrinsic-sizing diagnosis, then verify the repair wraps content rather than hiding it.

## What you should be able to explain

- Cascade and inherited values.
- Content/border box sizing.
- Grid versus Flexbox responsibilities.
- Intrinsic minimum size and responsive breakpoints.
