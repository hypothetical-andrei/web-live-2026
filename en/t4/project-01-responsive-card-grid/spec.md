# Exercise Specification — Responsive Card/Grid Reconstruction

## Unit

Unit 04 — HTML, CSS, Responsive UI and Accessibility

## Learning objective

Reconstruct a responsive card interface from explicit visual/layout criteria using the cascade, box model, Grid, Flexbox, and two specified breakpoints.

## Why this exercise exists

CSS is best learned as a system of constraints rather than isolated declarations. Fixed semantic markup lets you reason about available space, intrinsic sizing, alignment, and the cascade while comparing observable layouts at named viewport widths.

## Prerequisites

- Browser developer tools and Unit 3 static browser projects.
- Basic HTML element and selector familiarity.

## Starting context

You have received semantic HTML for a catalog header, filter controls, and four product cards; fixed content; a dependency-free static server; `visual-spec.md`; checks; and an incomplete `public/styles.css`. You must keep the supplied HTML structure unchanged.

## Required behavior

- Global border-box sizing and readable system font; body has no horizontal overflow at 320 px.
- Content is centered with maximum width `72rem`, page padding, and visible background contrast.
- Header uses Flexbox, wraps safely, and keeps the title/filter controls aligned with a consistent gap.
- Card list uses CSS Grid: one column below 40rem, two columns from 40rem, and four columns from 64rem.
- Cards use equal internal padding, border/radius, and a flex column so the action link aligns at the bottom despite different descriptions.
- Card media preserves a 16/9 aspect ratio using CSS, with no fixed pixel height.
- Focus-visible links/controls have a clear outline; hover enhancement does not remove focus.
- At `prefers-reduced-motion: reduce`, transitions are disabled.

## Constraints

- You must edit only `public/styles.css`.
- Use Grid for the card collection and Flexbox inside/header where appropriate.
- No frameworks, preprocessors, JavaScript layout measurements, absolute positioning for primary layout, or fixed card widths.
- Do not hide overflow to mask a sizing defect.
- Use custom properties for at least color, spacing, and radius tokens.

## Observable completion criteria

- At 320 px: one readable column and no horizontal scroll.
- At 768 px: two columns of equal available width.
- At 1280 px: four columns within the centered maximum-width container.
- Long titles wrap without pushing controls outside cards; action links align along the row baseline.
- Keyboard focus is visible, and reduced-motion emulation removes transitions.
- Automated source/structure checks pass.

## Validation plan

### Baseline checks

- Semantic HTML contains header/main/form/list/article hierarchy and all fixed content.
- Static server starts and serves HTML/CSS.

### Objective checks

- Stylesheet declares border-box, token custom properties, centered max-width container, flex header/card internals, grid collection, aspect ratio, and exact 40rem/64rem breakpoints.
- Grid column declarations implement 1/2/4 states.
- Focus-visible and reduced-motion rules exist.

### Regression checks

- Stylesheet contains no `overflow-x: hidden`, primary absolute positioning, or fixed card width.
- HTML is unchanged and contains no inline style.
- CSS braces are balanced and all referenced custom properties are defined.

### Browser checks

- Headless Chrome measures 1/2/4 computed Grid columns at 320/768/1280 px, Flexbox internals, horizontal overflow, and the focused-link outline.

## Your task

You need to implement the missing stylesheet in `public/styles.css`. Your starting file contains minimal custom properties and a TODO. The HTML, visual specification, server, and tests are supplied. The page runs but does not yet meet the layout requirements; complete the CSS and verify it at all three specified widths.

## Codex task

> Read `visual-spec.md`, semantic HTML, and CSS checks. Implement only `public/styles.css` using custom properties, Grid for 1/2/4 columns at the exact breakpoints, Flexbox for alignment, intrinsic sizing, visible focus, and reduced-motion support. Do not change HTML, add dependencies, hide overflow, or use fixed card widths. Done when checks pass and 320/768/1280 px inspection matches the specification. Explain each layout constraint before editing.

## Debugging / extension task

- Add an unusually long unbroken product label, reproduce overflow at 320 px, and ask Codex for a targeted intrinsic-sizing repair. Verify the fix does not hide content or break wide layouts.

## Out of scope

- CSS frameworks, container queries, JavaScript responsiveness, image optimization, dark mode, or content editing.
