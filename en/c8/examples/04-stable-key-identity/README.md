# Lecture Example — Stable key identity

## Concept demonstrated

React keys identify siblings across renders; array indexes describe positions and misidentify rows after insertion.

## Why this example is in the lecture

Editable rendered rows own local draft state, making identity preservation directly observable after an insertion.

## What to observe

- Inserting at index zero shifts every positional identity.
- Stable IDs preserve identity for existing items.
- The new record correctly has no prior identity under ID keys.

## Run / inspect

```bash
npm install
npm run dev
npm run build
```

## Explanation

Keys are consumed by React during sibling reconciliation and are not passed automatically as props. Use stable domain identity when lists can change.

## Variations

- Remove the first item instead of inserting one.
- Model local input state attached to each prior identity.

## Validation

Validated with a clean install and `npm run build`; edit a draft and prepend an item to inspect stable identity.
