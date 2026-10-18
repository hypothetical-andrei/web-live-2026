# Lecture Example — JavaScript language shape

## Concept demonstrated

JavaScript combines C-family surface syntax with dynamic values, an object system, and first-class functions.

## Why this example is in the lecture

It establishes the language model before individual review hazards such as coercion or mutation are introduced.

## What to observe

- Modern JavaScript has seven primitive types and one broad object category.
- Arrays are specialized objects; callable functions also participate in the object system.
- Functions can be stored, passed, and invoked as values.
- Familiar braces, conditions, loops, calls, and returns resemble C-family languages, but the runtime type model differs.

## Run / inspect

```bash
node example.js
```

## Explanation

The table uses `typeof`, an exact `null` check, `Array.isArray`, and a callability check because no single operator provides the complete pedagogical classification. The example is entirely synchronous; scheduled work begins in Lecture 3.

## Variations

- Add a regular expression and a date, then determine where they belong.
- Compare `typeof null`, `typeof []`, and `typeof (() => {})` with their useful runtime categories.

## Validation

Validated with `node example.js`; all seven primitives, the array/object cases, and the passed function call are asserted.
