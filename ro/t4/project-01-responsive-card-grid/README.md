# Project 01 — Responsive Card/Grid Reconstruction

## What you need to do

Style the supplied product catalog. Show one column at 320 px, two at 768 px, and four at 1280 px. Keep the text readable and the controls usable at each width.

Work in `student/`. Change only `public/styles.css`. You already have the HTML, product content, server, tests, and `visual-spec.md`, which describes the required appearance. Read [spec.md](spec.md) for the full requirements.

## Before editing

Start the page using the instructions in `student/README.md`. Open DevTools and inspect it at the three required widths. Find the header, filter controls, card list, images, and action links in the HTML.

## Your changes

- Use Grid for the card columns and Flexbox to align the header and card contents.
- Let long text wrap and let cards grow with their content.
- Keep image proportions, visible keyboard focus, and reduced-motion support.
- Keep the supplied HTML and use the breakpoints specified in `visual-spec.md`.

Ask Codex for the scoped task in `spec.md`. Check its changes before running them. For each CSS rule, explain what it changes on the page.

## Check your work

From `student/`, run `npm test` and `npm run test:browser`. The browser check requires Chrome/Chromium; see `student/README.md`.

Inspect the page at 320, 768, and 1280 px. Confirm that the column counts are correct, text is not cut off, and there is no horizontal scrolling. Use Tab to check focus, and emulate reduced motion in DevTools. Check your diff: only `public/styles.css` should have changed.

## Follow-up

Try a long unbroken product label at 320 px. Explain why it overflows and fix the wrapping without hiding the text. Restore the supplied content when finished.
