# Lecture 06 — Persistence with Sequelize and SQLite

> Planned duration: 100 minutes
>
> Format: three concept blocks, six worked examples, and three retrieval intermezzos

## Learning outcomes

By the end of this lecture, you should be able to explain what an ORM does, define a Sequelize model, choose built-in validators, write custom field and model-wide rules, distinguish validation from SQL constraints, choose a startup policy, compose queries with operator symbols, await CRUD operations, return explicit public data, and classify persistence errors.

## Session map

| Segment | Time | Focus |
| --- | ---: | --- |
| Opening persistence question | 0–5 min | Where do notes live after the process stops? |
| Concept block 1 | 5–35 min | Relational model, ORM, constraints |
| Intermezzo 1 | 35–39 min | Model and validation checks |
| Concept block 2 | 39–63 min | Startup, compound queries, awaited CRUD |
| Intermezzo 2 | 63–67 min | Startup and CRUD checks |
| Concept block 3 | 67–89 min | Queries, failures, separation |
| Intermezzo 3 | 89–93 min | Query and error checks |
| Synthesis | 93–100 min | End-to-end state trace |

> When a command starts a persistent server (`npm start`, `npm run dev`, or `node server.mjs`), leave it running and use another terminal for tests/builds. For an example with an API and Vite, run them in separate terminals; stop servers with Ctrl+C when finished.

Examples 01–03 run as scripts and close themselves. In each directory, `npm ci` installs dependencies, `npm start` runs the demonstration with console explanations, and `npm test` executes its checks. Examples 04–06 start independent servers on the same default port; run one at a time and use another terminal for requests. Install before the demonstration and predict the checks before reading their results.

## Create a note, restart, and read it again

In the previous lecture, your API could store tasks in a JavaScript array. Stop that process and the array disappears. In this lecture, you store notes in SQLite and check this sequence:

```text
create a note → close the application → reopen the database → read the same note
```

**Persistence** means keeping data beyond the process that created it. You need to choose a storage location, define the tables, wait for writes to finish, and close the connection. SQLite handles the database; Sequelize lets your JavaScript code define models and issue database operations.

## Concept block 1 — relational state, ORMs, and constraints

### 1. Persistence outlives one process

Durable state survives beyond one JavaScript heap. This changes startup, testing, cleanup, deployment, and the consequences of incorrect writes.

An array in a module is owned by one process. A database file has a separate lifetime: closing Node does not intentionally delete its committed rows. Test persistence by reopening the same file, not by making a second request against the same in-memory object. Conversely, deleting the file is a data reset even if your JavaScript code did not change.

A successful write is more consequential now. An accidental update can survive the next restart. Keep demonstration databases separate from data you intend to retain.

### 2. SQLite is an embedded relational database

SQLite stores relational tables in one database file or an in-memory database. It needs no separate server process, which makes it useful for small applications and deterministic teaching tests.

“Embedded” means the database engine runs in the application's process through a driver; it does not mean SQLite is a JavaScript array saved as JSON. SQLite executes SQL, maintains indexes, and coordinates access to its file. Another application can open that file too, subject to database locking. SQLite permits multiple readers but serializes writers, so it is not a reason to assume arbitrary write concurrency.

A file-backed connection and a `:memory:` connection can use the same model code. Their lifetimes differ. Use memory to isolate small model tests and a temporary file when the property under test is restart survival. SQLite's usual type affinity is deliberately flexible: declaring `STRING(120)` does not itself enforce a 120-character limit in SQLite. A `len` validator and an actual SQL length constraint are different mechanisms. See [SQLite datatypes](https://www.sqlite.org/datatype3.html).

### 3. Describe the database with a schema

A table stores records as rows and fields as columns. Its **schema** describes column names, types, and rules such as whether a value may be null or must be unique. For a note, a row might contain an ID, a title, and a body. Database constraints reject writes that violate the rules the database enforces; SQLite's flexible typing does not replace application validation.

Keep three descriptions separate: the JavaScript model definition, the schema actually present in the database, and the public JSON returned by the API. Changing one does not automatically update the others. A model can call an attribute `title`, a table can have a corresponding column, and a serializer can expose only selected fields from the stored row.

`sequelize.define(...)` registers metadata in JavaScript. Synchronizing or applying a migration changes database structure. Creating a note changes row data. These are three different operations; defining a model does not prove its table already exists.

### 4. Primary keys identify rows

An auto-increment integer is convenient for these exercises. The API may expose it as a resource identifier, while persistence owns generation.

A primary key identifies one row uniquely and cannot be null. A title can change while its ID stays the same. Do not use the current array position as an ID: sorting or deleting another row would change its position without changing the resource's identity. Sequelize supplies an integer `id` by default unless you define the primary key yourself. The explicit declaration in example 01 makes that choice visible.

### 5. Use Sequelize to work with rows from JavaScript

**SQL** is the language used to define and query relational data. An **ORM**, or Object-Relational Mapper, provides code objects and methods for working with those tables. In Sequelize, a model such as `Note` describes a table; an instance represents a loaded row; a query asks the database to read or change data. Sequelize translates calls such as `Note.findAll()` into SQL.

Compare the levels of abstraction:

```js
const note = await Note.findByPk(7);
```

The model call expresses a lookup. Sequelize generates a SELECT for the configured dialect and returns a model instance or `null`. SQLite executes the statement against its tables. An instance lets you read values and call methods such as `save()`; it is not the table itself, and editing its JavaScript property does not immediately update the row.

### 6. ORM benefits have costs

Benefits include consistent model metadata, parameterized queries, validation, and portable patterns. Costs include abstraction leakage, generated-query surprises, instance lifecycle, and performance that still requires SQL understanding.

Use an ORM to avoid repeating table mapping, parameter handling, and common query construction in every route. You can express ordinary operations in JavaScript and inspect their SQL when necessary. This saves recurring work; it does not remove the relational model or make an inefficient query efficient.

Portability also has limits. Data types, SQL functions, locking behavior, and error details differ across databases. A working SQLite example is evidence about this database and version, not a guarantee that switching the dialect requires no changes. Keep the generated query and its result in view.

### 7. Choose the connection's storage and logging

```js
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging,
});
```

`dialect` selects the database type. `storage` is the SQLite file path or `":memory:"` for a database that disappears when closed. `logging` controls whether and how generated SQL is reported. Use a temporary file or memory in tests and a deliberate file location for data you want to keep.

Choose an absolute path, or resolve a relative path from a known application directory. Otherwise starting the same command from a different working directory can create a second database file and look like data loss. The file must remain available and writable in the environment where the application runs.

One Sequelize instance manages database access for this application; do not construct a fresh instance in every request. `await sequelize.authenticate()` checks connectivity; it does not create tables. Await initialization before opening the HTTP listener so a client cannot reach a half-initialized app.

### 8. Define a model's attributes

A Sequelize model specifies attributes such as `title` and `body`, their types, defaults, and validation rules. You use that definition to create the table and to validate model operations. Defining a model is not the same as inserting a row; `Note.create(...)` performs that later operation.

Read an attribute definition as a set of independent choices:

```js
title: {
  type: DataTypes.STRING(120),
  allowNull: false,
  validate: { notEmpty: true, len: [3, 120] }
}
```

`type` describes the model/database mapping. `allowNull` controls nullability. `validate` contains JavaScript checks. Options such as `tableName` and `timestamps` belong to the model options object: by default Sequelize adds createdAt and updatedAt. Set `timestamps: false` deliberately when the example does not use them.

### 9. Distinguish validation from database constraints

The important distinction is **where a rule is enforced**:

| Rule | Enforcement and consequence |
| --- | --- |
| `validate: { notEmpty: true, len: [3, 120] }` | Sequelize checks the value in JavaScript before an ordinary validated write. Raw SQL does not execute these functions. |
| Custom field/model validator | Sequelize runs your function before the write; you must arrange SQL enforcement separately if every writer must obey the same invariant. |
| `unique: true` | Defines a database uniqueness rule when the schema is created. A conflicting INSERT reaches SQLite and can fail there. |
| `allowNull: false` | A special combination: Sequelize checks null before a write, and synchronization creates a SQL NOT NULL constraint. |
| `defaultValue` | Supplies an omitted value. It is neither a nonblank check nor a uniqueness guarantee. |

`null`, `""`, and `"   "` are different values. “Required” must therefore mean something precise: not null, nonempty, nonblank after normalization, and possibly a minimum length. A duplicate slug is a cross-row issue, not a malformed string.

### 10. Choose built-in validators for the value's rule

Put field validators inside that attribute's `validate` object. These are common Sequelize 6 validator families; consult the [version-6 validation reference](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/) for the full API and options.

| Purpose | Available examples |
| --- | --- |
| Text length and presence | `notEmpty: true`, `len: [3, 120]` |
| Pattern or forbidden pattern | `is: /^[a-z0-9-]+$/`, `not: /temporary/` |
| Email, URL, address syntax | `isEmail`, `isUrl`, `isIP`, `isIPv4`, `isIPv6` |
| Character categories/case | `isAlpha`, `isAlphanumeric`, `isLowercase`, `isUppercase` |
| Numeric syntax and bounds | `isNumeric`, `isInt`, `isFloat`, `isDecimal`, `min`, `max` |
| Allowed or forbidden values | `isIn: [["general", "work"]]`, `notIn: [["reserved"]]`, `equals` |
| Substrings | `contains`, `notContains` |
| Identifiers and dates | `isUUID: 4`, `isDate`, `isAfter`, `isBefore` |

Use `true` for a check without arguments. Use the expected value or argument list for a parameterized check. `isIn` needs the nested array because its argument is itself a list of choices. To customize a message, use `len: { args: [3, 120], msg: "Use 3–120 characters" }`. Choose messages that are safe to expose if your API includes selected validation details.

For nullability, prefer `allowNull`. You can customize its failure message with `validate: { notNull: { msg: "A title is required" } }` alongside `allowNull: false`. The `isNull` check is also available for a null-only rule; it does not override an attribute that forbids null.

These validators mostly check format or content, not the complete meaning of a value. An email validator does not prove that the mailbox exists. Numeric validators are not a substitute for strict HTTP type checking: some checks operate on a string representation, and Sequelize types can normalize values. Do not infer a no-coercion policy from `isInt: true` alone.

### 11. Normalize deliberately

A setter can trim a string before validation/persistence. It should not coerce unrelated types into strings unless the contract explicitly allows that.

A setter runs when the value is assigned to the instance. Call `this.setDataValue("title", value)` to store the result rather than assigning `this.title` again and recursively invoking the setter. Check `typeof value === "string"` before trimming. Normalization should not turn arbitrary numbers or objects into plausible titles.

Validation should normally inspect and reject, not quietly rewrite data. Separating assignment/normalization from validation makes it easier to predict which value is checked and eventually saved.

### 12. Write custom field and model-wide validators

A custom attribute validator is a named function in the attribute's `validate` object. It receives the value and rejects it by throwing an Error. Returning `false` is not the failure convention. For example:

```js
validate: {
  meaningfulTitle(value) {
    if (typeof value !== "string" || value.toLowerCase() === "untitled") {
      throw new Error("Use a meaningful title");
    }
  }
}
```

A **model-wide validator** belongs in the model options, not in one field. Use it for a relationship between values, such as requiring an archive reason when a note is archived:

```js
validate: {
  archiveNeedsReason() {
    if (this.archived &&
        (typeof this.archiveReason !== "string" || this.archiveReason.trim() === "")) {
      throw new Error("Archived notes need a reason");
    }
  }
}
```

Here `this` is the instance being validated. Use a regular method when you need that binding; an arrow function captures a different `this`. For a synchronous rule, throw on failure. A promise-returning or async custom validator can reject on failure; you must return/await its asynchronous work, and the caller must await the model operation. A promise that you start and discard cannot delay the write correctly.

Nullable fields need care. With `allowNull: false`, a null value fails the null check and other validators for that field are skipped. With `allowNull: true`, built-in checks are skipped for null, but custom validators still run. Handle null explicitly when your rule allows it. Example 02 records the values received by a nullable custom validator so you can observe that distinction.

A custom validator that checks for an existing slug is not a replacement for UNIQUE: two writers can both pass an earlier lookup. Let a database constraint arbitrate the conflicting writes. Use custom checks for domain rules, not as a claim of concurrency-safe cross-row integrity.

### 13. Worked example — schema and model definition

Run [schema and model definition](examples/01-model-metadata/):

```bash
cd lectures/06-persistence-sequelize/en/examples/01-model-metadata
npm install
npm test
```

Compare `Note.getAttributes()` with `describeTable("notes")`, then observe validation, normalization, and a real inserted row. Use the public getAttributes() getter shown in the example.

### 14. Validate at multiple boundaries

HTTP validation gives precise client feedback. Model validators protect writes that invoke them, including direct model calls from scripts or jobs. Actual database constraints also protect writers that bypass the model. These mechanisms are complementary.

Call `await instance.validate()` to inspect model validation without saving. `build()` constructs an unsaved instance; `create()` combines building, validation, and insertion; an ordinary instance `save()` validates before writing. Validation failure is a rejected promise containing a Sequelize ValidationError with individual entries in `error.errors`. Entries can identify a path, validator key, and message; choose what belongs in the public response instead of serializing the whole error.

Automatic validation is not universal. `bulkCreate()` skips per-row model validators by default; use `{ validate: true }` when you need them. Raw SQL and writes using validation-disabled options also bypass JavaScript checks. SQL constraints still apply. A model-wide rule needs the relevant values: loading an instance, assigning allowed changes, and saving makes its existing state visible; a bulk update of partial values is not a reliable substitute for validating every full row.

Run the worked comparison [validators and constraints](examples/02-validators-and-constraints/) with `npm ci` and `npm test`. Predict which cases generate an INSERT. The checks contrast built-in rules, a reserved-title validator, the archive/reason rule, manual validation, a duplicate slug, direct SQL, and bulk creation. Invalid raw writes are deliberate probes against a disposable database, not recommended application operations.

## Intermezzo 1 — models and constraints

Answer the `u06-i1-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Distinguish nullability from uniqueness, explain layered validation, and describe how a model-wide rule rejects invalid state.

## Concept block 2 — startup, CRUD, and awaiting operations

### 15. Choose whether startup preserves or resets rows

On normal startup, create missing tables without deleting stored rows. A reset deliberately deletes and recreates data. A migration changes an existing schema while managing its data. Keep these operations separate so restarting the server does not silently erase notes.

Initialization must finish before requests begin. Opening a connection is not evidence that the expected schema exists, and defining models does not create persistent tables. Make the startup function explicit about storage, synchronization, and seed policy. If initialization fails, do not announce a healthy listening server.

`sync()` creates a missing table; it does not generally migrate an existing table to every revised model definition. `sync({ alter: true })` is not a substitute for reviewed migration steps on data you care about. In these examples, synchronization is a small teaching setup; schema evolution requires deliberate operations.

### 16. Force synchronization is destructive

`sync({ force: true })` drops and recreates tables. It can be appropriate for an explicit isolated reset, but it must not be a default used against durable state.

### 17. Insert initial rows only when intended

**Seeding** means inserting initial data, such as the demonstration note used in an exercise. You can seed an empty database or seed after an explicit reset. Check that a second normal startup neither deletes the existing rows nor inserts the same initial rows again.

“If the table is empty, insert one demonstration row” is an inspectable policy for one local teaching process. It is not a general concurrent seeding algorithm: two initializers can both observe an empty table. Use a controlled deployment/migration step and database constraints for shared environments. Keep this teaching policy limited to one sequential initializer.

### 18. Worked example — symbols and compound queries

A `where` object describes conditions that Sequelize translates into SQL. `{ archived: false }` requests equality. Sibling conditions combine implicitly with AND. For other comparisons and grouping, import `Op` from Sequelize:

```js
import { Op } from "sequelize";

const where = {
  [Op.and]: [
    { archived: false },
    { priority: { [Op.between]: [2, 5] } },
    {
      [Op.or]: [
        { category: "work" },
        { title: { [Op.like]: "%notes%" } }
      ]
    }
  ]
};
```

Read the predicate: the note is active AND priority is between 2 and 5 inclusive AND (category is work OR title contains notes). Grouping matters: moving archived into the OR group would admit different rows. `Op.in` checks membership in a list; `Op.gt`, `Op.gte`, `Op.lt`, and `Op.lte` express numeric comparisons.

**The operators in `Op` are JavaScript symbols.** In `[Op.between]`, square brackets evaluate the expression and use its symbol value as the property key. The key `"Op.between"` would just be a string and does not express the same operation. Do not create a new symbol with `Symbol("between")`: use the symbol exported by Sequelize.

`Object.keys` omits symbol keys, and `JSON.stringify` loses these conditions. Inspect the object with `console.dir` or `Reflect.ownKeys`; do not serialize a `where` object as JSON to reconstruct later. Translate validated HTTP parameters into application-chosen operators and fields.

Run [operators and compound queries](examples/03-query-operators/):

```bash
cd lectures/06-persistence-sequelize/en/examples/03-query-operators
npm ci
npm start
npm test
```

Predict the matches from the seven fixture rows, then compare them with the printed SQL. The filter returns IDs 1, 2, 6. `attributes` selects columns, `order` sorts priority descending then ID ascending, and `raw: true` requests plain objects instead of instances. With `offset: 1` and `limit: 2`, the page contains 2 and 6. `findAndCountAll` also issues a separate COUNT query: the total is 3, not the page length. Section 21 revisits query options.

The application chooses the pattern `%notes%`: in LIKE, `%` matches any number of characters and `_` one character. Do not assume search text containing these characters is a literal pattern. Fixture titles are identical in both editions so the filter selects the same rows. Relationships and transactions follow in Lecture 07.

### 19. CRUD methods are asynchronous

`findAll`, `findByPk`, `create`, `save`, `destroy`, `sync`, and `close` return promises. A caller must know when each operation settles.

An async database call returns a promise immediately. `await` suspends this function's continuation until the result is available, while other requests can proceed. It does not turn SQLite into synchronous JavaScript or freeze the whole server. A success response sent before awaiting the write can be followed by a database failure that the client never sees.

### 20. Create returns a model instance

`Model.create(values)` validates, inserts, and resolves to an instance after successful persistence. Do not respond before the promise settles.

The returned instance has generated values such as its ID and timestamps. Construct Location from the stored ID, not a guessed next number. If the write rejects, there is no successful creation to report. The database's normal statement handling provides persistence for that operation; coordinating multiple writes atomically is the transaction topic in Lecture 07.

### 21. Read methods need deterministic order

Databases do not promise incidental row order. Add an explicit `order`, often including an ID tie-breaker.

Move the collection work from Lecture 05 into the query rather than loading every row first:

```js
const notes = await Note.findAll({
  where: { archived: false },
  attributes: ["id", "title"],
  order: [["title", "ASC"], ["id", "ASC"]],
  limit: 20,
  offset: 0
});
```

`where` filters rows; `attributes` selects columns; `order` determines sequence; `limit` and `offset` bound the returned portion. Translate validated query parameters into this object; never let a client choose arbitrary SQL fragments or unrestricted column names. A model instance is still returned unless you request raw data or serialize it. Relationships and more advanced paging follow in Lecture 07.

### 22. Update only supplied fields

For patch-like behavior, distinguish an absent field from a field supplied with a falsy value. Assign allowed changes, validate, then await `save()`.

For example, `if (changes.archived)` ignores a requested `false`, while `Object.hasOwn(changes, "archived")` detects that it was supplied. Read the row first, handle `null` as missing, assign only accepted attributes, then await save. This also lets a model-wide validator inspect the proposed new state together with unchanged values. Do not pass the whole request body to a bulk update and assume that validation also decides which fields a client may change.

### 23. Delete reports affected state

Instance `destroy()` and model-level deletion have different return shapes. Translate the result into the store contract, such as `true` only when one row was deleted.

`await Note.destroy({ where: { id } })` resolves to an affected-row count. A count of zero can mean the resource did not exist; one means one matching row was deleted. An instance's destroy method instead operates on that instance and does not return the same count protocol. Check the API you actually called before mapping the result to 204 or 404.

### 24. Await a promise when the local catch must handle its rejection

Inside an async function, `return operation()` passes the promise to the caller without waiting inside the current `try`. If it rejects later, this function's catch does not handle that rejection. `return await operation()` waits inside the `try`, so its catch can classify the failure. Use that form when the current function must translate the error; otherwise you can let the caller handle the returned promise.

The distinction is local error handling, not whether async functions return promises:

```js
try {
  return await Note.create(values);
} catch (error) {
  // This catch can classify a rejection from create().
  throw error;
}
```

Without await in this try, the function returns the pending promise and exits that try before its later rejection. The caller can still await and catch the rejection; it simply is not caught here. Do not add catch blocks that pretend to handle errors but respond successfully after a rejected write.

### 25. Worked example — Sequelize CRUD through Express

Run [Sequelize CRUD through Express](examples/04-await-error-boundary/):

```bash
cd lectures/06-persistence-sequelize/en/examples/04-await-error-boundary
npm install
npm test
npm start
```

Create, list, patch, and delete notes with `curl` or a REST client. The routes await real Sequelize operations, while centralized Express middleware maps validation and uniqueness errors to stable HTTP responses.

The examples define independent models. Example 04 does not include the archived/archiveReason rule from example 02: here we follow CRUD operations and HTTP responses. To keep the demonstration short, routes call models directly; section 38 explains moving database operations into a repository. Example 05 replaces automatic instance serialization with explicit public field selection.

### 26. Close what you open

Tests and application shutdown should await `sequelize.close()`. Owned connections and temporary files need cleanup even after failed setup or operations.

Use try/finally for the lifetime you opened. In an HTTP test, stop accepting/finish requests and close the server before closing its database. Close the database before removing its temporary directory. A connection leak can leave tests hanging; deleting a file before all users have closed it is not a reliable cleanup strategy.

### 27. Return plain data instead of an ORM instance

A Sequelize instance has row values, methods such as `save()`, and internal bookkeeping. `instance.get({ plain: true })` gives you plain data rather than those model methods. This does not automatically freeze the result or guarantee a deep independent copy of every nested value. For an API response, explicitly choose its public fields before converting them to JSON.

A plain object is not automatically a public object. It may still contain internalReview, timestamps, or columns added later. An explicit serializer such as `{ id: note.id, title: note.title, archived: note.archived }` defines what the client receives. Changing a plain JavaScript copy does not call save; changing an instance also needs a persistence operation to affect storage. Keep those lifetimes distinct.

### 28. Worked example — serialization at the REST boundary

Run [serialization at the REST boundary](examples/05-detached-data-boundary/):

```bash
cd lectures/06-persistence-sequelize/en/examples/05-detached-data-boundary
npm install
npm test
npm start
```

Request the seeded resource and compare its explicit public representation with the stored model. Internal fields, timestamps, and instance methods do not cross the HTTP boundary.

## Intermezzo 2 — lifecycle and awaited operations

Answer the `u06-i2-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Explain startup policy, write completion, operator symbol keys, and explicit public data.

## Concept block 3 — query languages, failures, and separation

### 29. ORM queries are not the only option

Model methods are useful for common reads and writes. Reporting, aggregation, database-specific features, or performance-sensitive queries can be clearer when expressed directly in SQL.

### 30. Raw SQL still belongs to the persistence layer

Use `sequelize.query()` inside the store or persistence service, not in presentation code. The route owns HTTP input and output; the persistence layer owns SQL and database result shapes.

### 31. Pass SQL values separately from the SQL statement

A placeholder marks where a value belongs. For a query containing `WHERE archived = :archived`, pass the accepted value through Sequelize's named `replacements` option rather than concatenating it into the SQL text. Bound parameters provide another supported way to keep values separate. Parameters stand for values, not arbitrary table or column names; select identifiers from names your application allows.

For a named replacement, the SQL text contains `:archived` and the replacements object supplies its value. Sequelize escapes/replaces it appropriately for the dialect. Bind parameters instead keep values separate for database binding; they are a related mechanism, not the same option name. Neither mechanism lets an untrusted value stand for the name of an ORDER BY column. Choose that column and direction from an application allowlist.

### 32. Declare the result shape

`QueryTypes.SELECT` makes the expected result explicit and returns rows directly. Raw-query column names and aggregate values still need deliberate translation into the public API representation.

### 33. Accept only the documented query values

For `archived`, accept exactly the strings `"true"` and `"false"` if that is your API's documented choice. Reject other values, translate the accepted string into the value expected by the database, and pass it as a parameter. Input validation and SQL parameterization do different jobs; you need both.

### 34. Worked example — parameterized raw SQL report

Run [parameterized raw SQL report](examples/06-query-allowlist/):

```bash
cd lectures/06-persistence-sequelize/en/examples/06-query-allowlist
npm install
npm test
npm start
```

Call the aggregate report with `curl` or a REST client. The route rejects invalid boolean syntax, and the fixed SQL statement receives the accepted value through a named replacement.

### 35. Let the database perform relational work

Loading every row and aggregating in JavaScript wastes memory and ignores database capabilities. Express filtering, sorting, joining, and aggregation through ORM queries or parameterized SQL as appropriate.

For a count, ask the database to count matching rows instead of retrieving all row data just to read an array's length. For a projection, select only needed columns. These decisions reduce transferred data and often let indexes help. Logging SQL is useful evidence, but timing one tiny in-memory test is not a meaningful production benchmark.

### 36. Persistence errors need classification

Validation failures and unique conflicts can map to stable application errors. Unexpected I/O or database failures should propagate to sanitized centralized handling.

A ValidationError normally indicates a model check failed. A UniqueConstraintError indicates a database uniqueness conflict. In Sequelize 6 the latter is also a subclass of ValidationError, so classify the more specific type first; otherwise your generic validation branch can hide a conflict as an ordinary invalid field. An unreadable database file or unexpected SQL failure belongs to the sanitized 500 path, not a message copied to the client.

### 37. Classify by error type, not secret-bearing text

Use Sequelize error classes and structured properties where available. Matching raw message strings couples behavior to dialect wording and risks leaking internals.

Inspect structured properties such as `error.errors` only to build an approved public error. Do not return `error.sql`, stack traces, raw parameters, or storage paths. A safe field message can help the client correct input; a complete database diagnostic can disclose implementation details or data. Keep the error-mapping policy consistent with Lecture 05.

### 38. Keep HTTP handling separate from database operations

The route reads HTTP input and chooses the status, headers, and response body. An application function applies a use-case rule; a store reads or writes models and returns data. A store method should not need an Express response object to report a missing row or database failure.

### 39. Test below and across HTTP

Direct store tests prove constraints, queries, restart survival, and cleanup. HTTP integration tests prove those outcomes are mapped to the intended public contract.

A direct model test can ask a precise question: did a blank title fail before SQL, did a duplicate reach a database constraint, or did a saved row survive reopening? An HTTP test asks a different question: did that outcome become the correct public status and body? Passing one level does not establish the other. Use temporary storage so deliberately invalid test writes cannot damage retained data.

### 40. Inspect generated SQL when diagnosing

ORM code is not evidence of the exact query. Enable controlled logging or inspect SQL during diagnosis, then keep tests focused on results, ordering, and bounded query behavior.

## Intermezzo 3 — queries and persistence errors

Answer the `u06-i3-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Explain SQL parameters, deterministic pagination and total counts, error subclass classification, and sanitized failures.

## Synthesis — trace durable state

```text
HTTP input
→ transport validation
→ application/store method
→ awaited Sequelize query
→ model + database constraints
→ committed row or classified rejection
→ detached plain data
→ HTTP response
```

Add lifecycle around it: open, initialize intentionally, seed deterministically, serve, close, reopen, and prove survival.

## Common failure modes

- Force-sync on normal startup.
- Unconditional seeding that duplicates rows.
- Relying only on route validation.
- Forgetting to await writes or close.
- Expecting synchronous catch to handle later rejection.
- Returning ORM instances through HTTP.
- Interpolating request data into raw SQL.
- Omitting deterministic tie-breakers.
- Filtering all rows in memory.
- Matching secret-bearing database messages.
- Mixing Express response objects into the store.

## Relation to the tutorial

Persistent Notes API replaces an in-memory repository and proves restart survival. Query API translates a closed HTTP language into Sequelize operations. Reservation Service Bug Hunt investigates incorrect stored values and error responses, then repairs the actual model and store.

## AI-assisted development considerations

Ask Codex to state model rules, startup policy, public fields, SQL parameters, and where failures are handled before editing. Inspect for deprecated metadata access, forced resets, route/ORM coupling, interpolated SQL, unawaited calls, message matching, and instance leakage. Verify through schema inspection, invalid direct writes, HTTP checks, generated SQL during diagnosis, and restart tests.

## References

- Course migration map, Unit 06.
- `webtech-2025-course/c7/` and `webTechTutorials-main/S08/`.
- Sequelize 6 models, validation, querying, and lifecycle documentation.
- SQLite documentation for types, constraints, files, and in-memory databases.
