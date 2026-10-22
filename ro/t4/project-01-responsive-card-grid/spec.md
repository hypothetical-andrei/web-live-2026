# Exercise Specification — Responsive Card/Grid Reconstruction

## Unit

Unit 04 — HTML, CSS, Responsive UI and Accessibility

## Learning objective

Style a supplied catalog so its cards fit narrow and wide screens. Use the box model, Grid, Flexbox, and the two required breakpoints.

## Why this exercise exists

You keep the HTML unchanged and work on CSS. Compare the page at three widths to see how sizing, wrapping, and alignment affect the result.

## Prerequisites

- Browser developer tools and Unit 3 static browser projects.
- Basic HTML element and selector familiarity.

## Starting context

Work in `student/`. You have the catalog HTML, four product cards, a static server, tests, `visual-spec.md`, and an unfinished `public/styles.css`. Keep the supplied HTML and content.

## Required behavior

- Use border-box sizing and a readable system font. The page must not scroll horizontally at 320 px.
- Content is centered with maximum width `72rem`, page padding, and visible background contrast.
- Use Flexbox for the header. Let the title and filters wrap when needed and keep consistent spacing between them.
- Card list uses CSS Grid: one column below 40rem, two columns from 40rem, and four columns from 64rem.
- Give cards equal padding, a border, rounded corners, and a Flexbox column layout. Align action links at the bottom even when descriptions have different lengths.
- Card media preserves a 16/9 aspect ratio using CSS, with no fixed pixel height.
- Focus-visible links/controls have a clear outline; hover enhancement does not remove focus.
- At `prefers-reduced-motion: reduce`, transitions are disabled.

## Constraints

- You must edit only `public/styles.css`.
- Use Grid for the card collection and Flexbox inside/header where appropriate.
- No frameworks, preprocessors, JavaScript layout measurements, absolute positioning for primary layout, or fixed card widths.
- Do not hide overflow to mask a sizing defect.
- Use CSS custom properties for at least colors, spacing, and corner radius.

## Observable completion criteria

- At 320 px: one readable column and no horizontal scroll.
- At 768 px: two columns of equal available width.
- At 1280 px: four columns within the centered maximum-width container.
- Long titles wrap without pushing controls outside cards; action links align along the row baseline.
- Keyboard focus is visible, and reduced-motion emulation removes transitions.
- Automated source/structure checks pass.

## Validation plan (for course authors)

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

Complete `public/styles.css`. Start with the narrow layout, then check the two wider layouts. The server and HTML already work; your job is to write the CSS that meets the requirements above.

## Codex task

> Read `visual-spec.md`, the HTML, and this specification. Change only `public/styles.css`. Build the required one-, two-, and four-column layouts using Grid, and use Flexbox for the header and card contents. Keep long text visible, preserve image proportions, and add visible focus and reduced-motion support. Do not change HTML, add dependencies, hide overflow, or set fixed card widths. Run the checks and inspect 320, 768, and 1280 px. Explain what each group of CSS rules does.

## Debugging / extension task

Try a long unbroken product label at 320 px. Find why it overflows and ask Codex for a fix that wraps the text rather than hiding it. Check the wider layouts too, then restore the supplied content.

## Out of scope

- CSS frameworks, container queries, JavaScript responsiveness, image optimization, dark mode, or content editing.
