# Lecture Example — URL boundaries

## Concept demonstrated

A URL has separately observable components, and its fragment is a browser-side navigation detail rather than part of an HTTP request target.

## Why this example is in the lecture

Printing parsed fields replaces the vague idea of “the URL” with an inspectable data structure.

## What to observe

- `pathname` and `searchParams` select and parameterize a server resource.
- `hash` is available to client code but is omitted from the derived request target.
- Query decoding turns `%20` into a space without changing the original URL string.

## Run / inspect

```bash
node example.js
```

## Explanation

The built-in `URL` class parses the address without a dependency. The example then constructs the portion an HTTP client sends from the path and query only.

## Variations

- Add a second `tag` parameter and inspect `searchParams.getAll("tag")`.
- Remove the query or fragment and observe which fields become empty strings.

## Validation

Validated with `node example.js`; its assertions pass and the printed request target excludes `#details`.
