# Lecture Example — Semantic form relationships

## Concept demonstrated

Native form elements expose names, instructions, grouping, and required state through explicit HTML relationships.

## Why this example is in the lecture

It shows the smallest useful registration form without CSS layout or custom validation obscuring its semantics.

## What to observe

- Each input has a programmatically associated label.
- The email instruction is connected with `aria-describedby`.
- Related radio controls are grouped by `fieldset` and `legend`.
- The button submits the form without a click-only JavaScript path.

## Run / inspect

```bash
node validate.js
```

Open `index.html` in a browser and navigate through it using only Tab, Shift+Tab, arrow keys, and Enter.

## Explanation

The HTML expresses the control relationships directly. CSS or JavaScript can enhance the form later, but neither should replace the native name, grouping, keyboard, and submission contracts.

## Variations

- Remove one `for`/`id` pair and inspect the validator failure.
- Compare placeholder text with persistent instructional text.

## Validation

Validated with `node validate.js`; it checks labels, description linkage, field grouping, input types, and native submit behavior.

## Workshop page

Open [workshop.html](workshop.html), the complete page used throughout the lecture opening. Its HTML and [local image](workshop.svg) are kept in the repository. Inspect the heading hierarchy, links, list, table headers and form. The page has no custom CSS or JavaScript: observe the browser defaults and navigate with your keyboard. Use fictional details; GET submission displays them in the URL without creating a real registration.

Validation (2026-10-18): local image and label/description/navigation targets checked in both locales; English document parsed in headless Chrome. No registration service is required.
