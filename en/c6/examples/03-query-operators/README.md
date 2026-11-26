# Lecture example — Operators and compound queries

Build Sequelize predicates and follow their generated SQL and matching rows.

## Run

```bash
npm ci
npm start
npm test
```

## What to observe

- `Op.gt` is a JavaScript symbol. `[Op.gt]` is a computed property key, not the string `"Op.gt"`.
- `Object.keys` and `JSON.stringify` omit symbol keys. `Reflect.ownKeys` and `console.dir` let you inspect them. Do not send a `where` object through JSON.
- `Op.and` and `Op.or` group conditions; `Op.between`, `Op.like`, `Op.in`, and `Op.gt` express comparisons.
- The first query selects active notes with priority between 2 and 5 inclusive, and either category work or a title containing notes. Matching IDs are 1, 2, 6.
- `attributes` selects columns; `raw: true` requests plain objects. `order` sorts priority descending, then ID ascending to resolve ties.
- `offset: 1, limit: 2` returns IDs 2 and 6; `findAndCountAll` also returns the total 3 before pagination through a separate COUNT query.
- The second query implicitly ANDs three conditions and returns IDs 4, 5, 6.

Fixture titles and categories are identical in both editions so `%notes%` has the same meaning. In LIKE, `%` matches any number of characters and `_` one character; this pattern is application-chosen. Do not accept arbitrary client JSON as Sequelize options. Translate validated parameters into application-chosen fields and operators.

SQLite is in memory and closes in `finally`. This example does not include relationships or transactions; those follow in Lecture 07.

[Sequelize 6: model querying](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/).

Validated 2026-11-04: npm start and npm test pass on Node 24.5.0 with real SQLite; assertions check exact IDs, columns, and total count.
