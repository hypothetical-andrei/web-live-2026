# Lecture Example — Automatically fitting card columns

## Concept demonstrated

CSS Grid can choose the number of columns from available space while card height remains driven by content.

## Why this example is in the lecture

Three cards and one layout rule expose responsive wrapping without reproducing the tutorial reconstruction project.

## What to observe

- `auto-fit` creates only columns that fit.
- `minmax(min(100%, 14rem), 1fr)` prevents a minimum track from overflowing a narrow viewport.
- The longer card grows instead of clipping content.

## Run / inspect

Open `index.html` and resize the viewport across 14rem, 28rem, and 42rem widths.

## Explanation

The browser performs the layout from a minimum useful card width and available space. No JavaScript viewport measurement or fixed card height is needed.

## Variations

- Replace `auto-fit` with `auto-fill` and inspect unused-track behavior.
- Add a card with a long unbroken token and decide where wrapping responsibility belongs.

## Validation

Validated with headless Chromium captures at 360 px and 900 px: the grid renders one and three columns respectively, with all card text visible.
