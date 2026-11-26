# Lecture Example — Controlled form transition

## Concept demonstrated

A controlled input renders from state, updates state on change, and normalizes deliberately at submission.

## Why this example is in the lecture

The Vite app uses a real controlled input, submit event, rendered validation error, and keyed result list.

## What to observe

- Typing preserves the user's exact current text.
- Submission trims only at the contract boundary.
- Blank submissions create nothing.
- Successful submission creates one item and clears input state.

## Run / inspect

```bash
npm install
npm run dev
npm run build
```

## Explanation

`value={title}` reflects state and `onChange` updates it. The submit handler prevents navigation, validates normalized input, appends one note, and clears the controlled field.

## Variations

- Add an error value without duplicating whether the input is blank.
- Move trimming into every change and discuss the typing experience.

## Validation

Validated with a clean install and `npm run build`; inspect typing, submission, clearing, and blank rejection in the Vite application.
