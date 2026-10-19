# Exercise Specification — CSS Repair Challenge

## Unit

Unit 04 — HTML, CSS, Responsive UI and Accessibility

## Learning objective

Diagnose layout and cascade defects in a preserved generated stylesheet and repair them with a small higher-priority cascade layer rather than specificity escalation or markup rewrites.

## Starting context

You have received fixed semantic HTML, `legacy-generated.css` with documented defects, a layer-order stylesheet, an incomplete `repair.css`, static server, visual criteria, and checks.

## Required behavior

- Navigation remains in normal flow, wraps at narrow widths, and never covers the main heading.
- Main content uses a sidebar/content Grid above 48rem and one column below it.
- `.notice` uses the accessible dark-on-pale palette despite the legacy `#app .notice` rule.
- Buttons preserve visible focus and do not shrink below their content.
- Cards use content-driven height; no clipping or forced fixed height.
- Repair file contains only targeted overrides in the declared `repair` layer.

## Constraints

- You must edit only `public/repair.css`; preserve legacy CSS and HTML.
- Use cascade layers and appropriate selectors; no `!important`, inline styles, IDs added for specificity, overflow hiding, or duplicate full stylesheet.
- One breakpoint at 48rem.

## Observable completion criteria

- At 390 px navigation wraps above the heading and content is one column.
- At 1024 px sidebar/content proportions are stable and cards expand with content.
- Computed notice colors come from the repair layer.
- Keyboard focus is visible; all checks pass; diff is one file.

## Validation plan

### Baseline checks

- Legacy artifact reproducibly contains fixed nav, high-specificity notice, and fixed-height cards.
- HTML/server/layer order are intact.

### Objective checks

- Repair layer restores normal-flow wrapping nav, one/two-column layout, notice palette, content height, and focus.
- Exact 48rem breakpoint exists.

### Regression checks

- No `!important`, ID selector, overflow hiding, fixed card height, or HTML/legacy changes.
- Repair remains substantially smaller than legacy CSS.

### Browser checks

- Headless Chrome measures normal flow, 1/2 computed Grid columns, repaired notice colors, unclipped cards, and the focused-button outline at 390/1024 px.

## Your task

You need to add targeted repairs to `public/repair.css`. Your starting file contains the `repair` layer declaration and a TODO. The original stylesheet remains deliberately defective so you can inspect each problem. Diagnose the winning declarations and layout causes, then add only the overrides needed to meet the requirements.

## Codex task

> Inspect computed styles, `legacy-generated.css`, layer order, and failing checks. Repair only `repair.css` inside the existing repair layer. Restore normal flow, responsive Grid, notice colors, intrinsic card height, and focus at the exact breakpoint. Do not edit HTML/legacy CSS or use `!important`, IDs, overflow hiding, or fixed heights. Done when checks and 390/1024 px inspection pass. Explain which cascade/layout cause each override addresses.

## Debugging / extension task

- Move the repair layer before the legacy layer, observe computed styles, and ask Codex to explain why lower-specificity repair rules lose or win differently across layers.

## Out of scope

- Rewriting the legacy file, preprocessors, frameworks, JavaScript measurements, or pixel-perfect branding.
