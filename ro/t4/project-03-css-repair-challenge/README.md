# Project 03 — CSS Repair Challenge

## What you need to do

Fix the supplied page by editing only `student/public/repair.css`. The original CSS has deliberate mistakes: the navigation covers the heading, the layout does not fit narrow screens, the notice is hard to read, cards cut off text, and buttons have no visible focus indicator.

Keep the HTML and `legacy-generated.css` unchanged. Put your corrections in the existing `repair` layer. Read [spec.md](spec.md) for the required appearance and restrictions.

## Before editing

Start the page using `student/README.md`. Inspect it at 390 and 1024 px. For each visible problem, use DevTools to find the CSS declaration that causes it.

During the classroom session, record these findings. Complete the CSS repairs as follow-up work unless you have time remaining.

## Your changes

- Keep navigation above the heading and let its links wrap on narrow screens.
- Show one content column below 48rem, then a sidebar and main column from 48rem onward.
- Make the notice readable, let cards grow to fit their text, and keep buttons large enough for their contents.
- Show a clear outline when a button has keyboard focus.

Ask Codex to change only `public/repair.css`. Do not use `!important`, ID selectors, hidden overflow, fixed card heights, or a replacement copy of the original stylesheet. For each correction, explain which original declaration it overrides and why it wins.

## Check your work

From `student/`, run `npm test` and `npm run test:browser`. The browser check requires Chrome/Chromium; see `student/README.md`.

Inspect both widths again and use Tab to check button focus. Check that navigation does not cover the heading and all card text is visible. Only `public/repair.css` should have changed.

## Follow-up

Temporarily put the `repair` layer before the `legacy` layer in the layer-order stylesheet. Inspect which declarations now win. Explain the effect, restore the original layer order, and rerun the checks. This experiment is separate from the required one-file repair.
