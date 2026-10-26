# Lecture Example — Box model sizing

## Concept demonstrated

`box-sizing` determines whether a declared width covers only content or includes padding and border.

## Why this example is in the lecture

Two otherwise identical boxes turn the sizing equation into an observable browser measurement.

## What to observe

- The content-box element renders at 242 pixels: 200 content + 40 padding + 2 border.
- The border-box element renders at the declared 200 pixels.
- Margins remain outside either width calculation.

## Run / inspect

Open `index.html`, inspect both computed box models, or use the documented headless check.

## Explanation

Global `border-box` sizing makes component constraints easier to reason about, but intrinsic content can still impose minimum pressure.

## Variations

- Add a long unbroken token and inspect overflow pressure.
- Replace physical padding with logical `padding-inline` and change writing direction.

## Validation

Validated in headless Chromium; `#result` reports `content-box=242; border-box=200`.
