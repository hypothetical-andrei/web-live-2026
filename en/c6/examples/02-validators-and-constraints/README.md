# Lecture example — Validators and database constraints

## Concept demonstrated

Follow the same note through JavaScript validation and SQLite constraint enforcement. Built-in, custom field, and model-wide validators run in Sequelize; actual NOT NULL and UNIQUE constraints also protect direct SQL writes.

## Why this example is in the lecture

The schema example shows metadata. This comparison makes enforcement observable: the SQL log remains empty for rejected model validation but records an INSERT attempted for a duplicate slug. One disposable in-memory database lets you test invalid direct writes without affecting retained notes.

## What to observe

- notEmpty, len with args/msg, a slug pattern, isIn, numeric bounds, and isEmail reject their respective invalid values.
- meaningfulTitle throws for a reserved title; archiveNeedsReason uses this to inspect two attributes together.
- A nullable custom validator receives null; the built-in email validator permits null because allowNull is true.
- build constructs an instance, validate checks it without SQL, and save writes it.
- A duplicate slug reaches SQLite and fails with UniqueConstraintError.
- Direct SQL can insert a blank title because the JavaScript nonblank rule is not a SQL constraint. It still cannot insert a null title or duplicate slug.
- bulkCreate skips per-row validators by default; validate:true enables them.

## Run / inspect

```bash
npm ci
npm test
```

Read the assertions alongside the model. For each failure, name the rule, whether SQL was attempted, and which writer could bypass it. The script closes the database in finally and leaves no database file.

## Explanation

Validation errors identify the affected field or model-wide rule through error.errors. Checking that path prevents an unrelated validation failure from accidentally satisfying the test. A default supplies an omitted value but does not replace validation. The optional archive reason defaults to null explicitly.

## Variations

Change one built-in rule and its invalid input together. Predict why adding a JavaScript validator does not change direct SQL behavior. Explain why a pre-insert uniqueness lookup cannot replace the database constraint when two writers run concurrently. Do not turn these intentional bypass checks into application write paths.

## Validation

On 2026-10-26, clean npm ci and npm test passed on Node 24.5.0 with Sequelize 6.37.8 and SQLite through sqlite3 6.0.1. Checks execute real SQLite statements; no database mocks are used. They cover built-in and custom rejection, nullable behavior, manual validation without insertion, save/update, database uniqueness/nullability, and default versus opted-in bulk validation.

### Direct execution and console output

Run `npm start` after `npm ci`. The console explains the steps and observed results. The script exits after its checks and closes the database.
