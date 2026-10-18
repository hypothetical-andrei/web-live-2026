# Lecture Example — Identity, aliases, and shallow copies

## Concept demonstrated

Object variables hold references, and array/object spread creates only a shallow container copy.

## Why this example is in the lecture

It connects JavaScript's object model to the mutation defects students will encounter in generated code and later React state.

## What to observe

- Assignment creates an alias to the same array.
- Copying the array does not copy its task object.
- Copying a task does not copy its nested `meta` object.
- A non-mutating update copies every container along the changed path.

## Run / inspect

```bash
node example.js
```

## Explanation

Equality of object values tests identity. Spread is useful syntax for selected shallow copies, not proof that all nested state is independent.

## Variations

- Freeze each input level and compare mutating and non-mutating updates.
- Draw the object graph before and after every copy.

## Validation

Validated with `node example.js`; alias, shallow-copy, nested-identity, and non-mutation assertions pass.
