# Lecture Example — Flex container and positioned child

## Concept demonstrated

Flexbox distributes and aligns items inside a container, while CSS positioning can anchor an overlapping child to an explicit containing block.

## Why this example is in the lecture

It makes two fundamental layout responsibilities visible: Flexbox controls the toolbar's normal-flow items, and `position: relative` gives an absolutely positioned badge a local reference frame.

## What to observe

- `.toolbar` is the flex container; its direct children are flex items.
- `justify-content` distributes space on the main axis, while `align-items` aligns items on the cross axis.
- `gap` creates spacing without child margins, and `flex-wrap` preserves the controls when space narrows.
- `.card` remains in normal flow and establishes the badge's containing block with `position: relative`.
- `.badge` uses `position: absolute`, is removed from normal flow, and is offset from the card's block-start and inline-end edges.

## Run / inspect

```bash
node validate.js
```

Open `index.html`, resize the viewport, and inspect the toolbar, card, and badge in DevTools. The page reports the relevant computed layout and containing-block relationship.

## Explanation

Flexbox should position related items that still participate in layout. Absolute positioning is appropriate for intentional overlap when the containing block is explicit. It should not replace Flexbox, Grid, or normal flow for the page structure. `fixed` normally uses the viewport; `sticky` participates in flow until a scroll threshold is crossed.

## Variations

- Remove `position: relative` from the card and inspect where the badge is anchored.
- Change `justify-content` and `align-items` independently to identify their axes.
- Remove `flex-wrap` and inspect narrow-container overflow.

## Validation

Validated with `node validate.js`; it checks the flex-container controls, the relative containing block, the absolute child offsets, and the parent-child relationship.
