# Exercise Specification — CSS Repair Challenge

## Unit

Unit 04 — HTML, CSS, Responsive UI and Accessibility

## Learning objective

Find the CSS rules causing the supplied page to look wrong. Correct them in a small `repair` layer without changing the HTML or original stylesheet.

## Starting context

Work in `student/`. You have the HTML, the deliberately faulty `public/legacy-generated.css`, a stylesheet that declares layer order, a static server, tests, and an unfinished `public/repair.css`. Only the last file is yours to edit.

## Required behavior

- Keep navigation in normal flow, above the main heading. Its links must wrap on narrow screens rather than cover content.
- Show one content column below 48rem. From 48rem onward, show a sidebar and main content column.
- Give `.notice` dark text on a pale background even though the original stylesheet uses the more specific `#app .notice` selector. The required colors are `#172033` for text and `#dce9ff` for the background.
- Keep buttons wide enough for their contents and show a visible keyboard-focus indicator.
- Let cards grow to fit their text. Do not clip the text or force a fixed height.
- Put only the necessary corrections inside the existing `repair` layer.

## Constraints

- Change only `public/repair.css`. Keep the HTML and original CSS unchanged.
- Use the supplied layer order. Do not use `!important`, inline styles, ID selectors, hidden overflow, or a copy of the entire original stylesheet.
- Use one breakpoint, at 48rem.

## Observable completion criteria

- At 390 px, navigation wraps above the heading and the content has one column.
- At 1024 px, the sidebar and main content are side by side and the cards show all their text.
- DevTools shows that the notice colors come from your repair layer.
- Tab navigation shows which button has focus.
- All checks pass, and only `public/repair.css` differs from the starting project.

## Validation plan (for course authors)

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

Fill in the existing `repair` layer in `public/repair.css`. For each problem, inspect the winning declaration in DevTools, identify its effect, and add the correction needed to meet the requirements. Keep the original mistakes in `legacy-generated.css` so you can compare them with your corrections.

## Codex task

> Inspect the page at 390 and 1024 px, the original CSS, and the layer order. Change only `public/repair.css`, inside the existing repair layer. Fix navigation, the one-/two-column layout at 48rem, notice colors, card height, and button sizing/focus as specified above. Do not change HTML or original CSS. Do not use !important, ID selectors, hidden overflow, or fixed card heights. Run the checks and inspect both widths again. Explain which original declaration each correction overrides and why it wins.

## Debugging / extension task

After finishing, temporarily place the repair layer before the legacy layer in the layer-order stylesheet. Inspect which declarations now win and explain why. Restore the original order and rerun the checks. This experiment is separate from the required one-file repair.

## Out of scope

- Rewriting the legacy file, preprocessors, frameworks, JavaScript measurements, or pixel-perfect branding.
