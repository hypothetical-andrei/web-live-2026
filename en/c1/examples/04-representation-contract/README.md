# Lecture Example — Representation contract

## Concept demonstrated

The declared media type determines how a response body should be interpreted; JSON-looking text is not automatically a JSON representation.

## Why this example is in the lecture

It separates resource, representation, declaration, and valid serialization without introducing a server framework.

## What to observe

- Media-type parameters such as `charset` do not change the base type.
- A JSON-looking body declared as `text/plain` remains text.
- Declaring `application/json` does not make malformed bytes valid JSON.

## Run / inspect

```bash
node example.js
```

## Explanation

The inspector reads the header before choosing a parser. The body and header must agree; neither should be guessed from the other.

## Variations

- Remove `Content-Type` and decide whether the client should guess.
- Add `application/problem+json` and discuss explicit support for structured suffixes.

## Validation

Validated with `node example.js`; the JSON, text, and invalid-JSON outcomes are asserted.
