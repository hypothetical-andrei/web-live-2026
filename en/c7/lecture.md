# Lecture 07 — Relationships, Transactions and API Design

> Planned duration: 100 minutes
>
> Format: three concept blocks, six worked examples, and three retrieval intermezzos

## Learning outcomes

By the end of this lecture, you should be able to choose relationship keys and constraints, define association directions and aliases, reason about eager-loading costs, design membership resources, load multiple and nested associations and filter, sort and page joined child rows, and explain transaction atomicity, isolation and rollback limits.

## Session map

| Segment | Time | Focus |
| --- | ---: | --- |
| Opening domain sketch | 0–5 min | Objects become rows and keys |
| Concept block 1 | 5–29 min | Relationships, junctions, associations |
| Intermezzo 1 | 29–33 min | Relational-shape checks |
| Concept block 2 | 33–61 min | Eager loading, resources, includes, child pagination |
| Intermezzo 2 | 61–65 min | Query/API checks |
| Concept block 3 | 65–89 min | Transactions and consistency |
| Intermezzo 3 | 89–93 min | Atomicity checks |
| Synthesis | 93–100 min | Trace data, transaction, and response |

> When a command starts a persistent server (`npm start`, `npm run dev`, or `node server.mjs`), leave it running and use another terminal for tests/builds. For an example with an API and Vite, run them in separate terminals; stop servers with Ctrl+C when finished.

All six examples are self-contained scripts. npm test performs the checks and exits; the two Express examples create temporary servers for their own requests. Install before class and predict selected checks rather than reading every assertion aloud.

## Model a conference and its registrations

A conference has several sessions. An attendee can register for several sessions, and each session can have several attendees. The ticket type belongs to one registration, not to the attendee or session alone.

```text
Conference 1 ─── * Session
Session    * ─── * Attendee, through Registration
```

Read `1` as one and `*` as many. Start by identifying which table stores each fact. Then follow how you load related rows, expose them through URLs, and change several rows together without leaving a half-finished booking.

## Concept block 1 — rows, foreign keys, and associations

### 1. Use a foreign key and uniqueness for one-to-one data

A **foreign key** is a column referencing another table's key. For one profile per attendee, the profile row can reference an attendee ID and require that reference to be unique. This allows at most one profile for an attendee; it does not by itself require every attendee to have a profile.

Describe both directions before choosing the association call. An attendee may have zero or one profile; a profile belongs to exactly one attendee. The profile's attendeeId therefore needs a foreign key, NOT NULL if the link is mandatory, and UNIQUE to prevent two profiles for one attendee. A foreign key alone allows several profiles to reference the same person.

Cardinality says how many related rows are allowed. Optionality says whether the relationship can be absent. Neither a JavaScript object property nor a singular association name proves these database rules are enforced. Example 01 attempts a second profile and checks the rejection.

### 2. One-to-many places the key on the many side

Each `Session` row stores one `conferenceId`; many session rows may reference one conference. The database foreign key protects the reference.

For conference 7 with sessions 10 and 11, store conferenceId 7 on both session rows. Do not add session1Id, session2Id and session3Id columns to the conference: that imposes an arbitrary number of children and complicates queries. The foreign key references a real conference; a NOT NULL constraint makes that reference mandatory.

A foreign-key constraint can reject an orphan session. It does not mean every conference must already have a session, nor does it decide whether deleting a conference should delete its sessions. Those are separate rules.

### 3. Use a junction table for many-to-many data

A **junction table** stores a row for each link between two tables. `Registration(sessionId, attendeeId)` links one attendee to one session. Several rows can share a session ID or attendee ID, which represents many registrations in either direction.

Represent two attendees registered for one session as two Registration rows. The same attendee ID can then appear in a row for another session. Do not duplicate the attendee's name and contact data for every registration; that would make an attendee change inconsistent across copied records.

The junction has two foreign keys, one to each parent. To retrieve registrations you join those matching keys. Arrays of IDs or comma-separated text inside a parent row lose the straightforward foreign-key and uniqueness rules you can apply to ordinary rows.

### 4. Junction rows are often domain records

Ticket type, role, quantity, status, and registration time belong to a particular membership, not either parent independently.

Suppose Ana has a student ticket for HTTP and a standard ticket for SQLite. ticketType cannot be one property on Ana because its value depends on which session you mean. It cannot be one property on HTTP because different attendees may have different tickets. The registration row answers the complete question: this attendee, this session, this ticket.

An explicit through model is useful whenever the link has data or behavior of its own. A purely linking table can be generated by Sequelize, but naming Registration makes the domain fact and its constraints inspectable.

### 5. Prevent the same membership from being inserted twice

A **composite unique constraint** checks a combination of columns: `(sessionId, attendeeId)` must be unique as a pair. A separate generated registration ID, sometimes called a surrogate key, identifies the row but does not stop another row from repeating the same pair. Choose the pair constraint when duplicate membership is forbidden.

Compare two possible keys:

```text
id=100, sessionId=7, attendeeId=42
id=101, sessionId=7, attendeeId=42
```

The generated IDs differ, so a primary key on id accepts both rows. The membership pair is identical, so a unique rule on (sessionId, attendeeId) rejects the second. You can also choose that pair as a composite primary key. The identity you expose in a URL and the keys used internally do not have to be the same representation, but both must identify the intended membership.

### 6. Decide what happens when a referenced row is deleted

For a session's conference reference, `RESTRICT` prevents deleting a conference that still has referencing sessions. `CASCADE` deletes the referencing sessions too. `SET NULL` clears their reference, which requires a nullable column. Choose the behavior from what should happen to the data, not from which option makes a test easiest.

Choose the delete action for each relationship rather than one global policy. A historical conference might be protected with RESTRICT, while a profile that makes no sense without its attendee might be deleted with CASCADE. Deleting a registration should not delete the attendee or session it references.

An association declaration and an enforced database constraint are related but not interchangeable evidence. SQLite foreign-key enforcement is a connection setting; test an invalid insert and the intended delete action in the environment you actually use. Example 01 proves orphan rejection, restricted conference deletion and cascading dependent profile/registration deletion. See [SQLite foreign keys](https://www.sqlite.org/foreignkeys.html).

### 7. Worked example — relationship shapes

Run [relationship shapes](examples/01-relationship-shapes/):

```bash
cd lectures/07-relationships-transactions/en/examples/01-relationship-shapes
npm install
npm test
```

Inspect the synchronized associations, eager-loaded graph, through attribute, and duplicate-registration constraint.

Predict the counts before running it: one attendee appears in two sessions, with a different ticket type on each registration, and has one profile. A duplicate profile and a duplicate membership fail for different unique rules. A nonexistent conference ID fails its foreign key. The printed graph is a loaded view before the final cascade checks, not a second permanent copy of the tables.

### 8. Sequelize associations encode navigation metadata

`hasOne`, `hasMany`, `belongsTo`, and `belongsToMany` describe directions, aliases, keys, and generated access/query behavior. They do not create a good model automatically.

Read each association from its source model:

| Declaration | Where is the foreign key? | What navigation is added to the source? |
| --- | --- | --- |
| Attendee.hasOne(Profile) | Profile | One related profile |
| Profile.belongsTo(Attendee) | Profile | Its attendee |
| Conference.hasMany(Session) | Session | A collection of sessions |
| Session.belongsTo(Conference) | Session | Its conference |
| Session.belongsToMany(Attendee, through Registration) | Registration has both keys | A collection of attendees through links |

A method such as conference.getSessions() is a database operation returning a promise, not access to an already loaded array. Defining an association prepares query/navigation behavior; creating or changing the schema is still an initialization/migration task. See [Sequelize 6 associations](https://sequelize.org/docs/v6/core-concepts/assocs/).

### 9. Define both useful directions

`Conference.hasMany(Session)` pairs with `Session.belongsTo(Conference)`. Many-to-many directions must agree on through model and foreign/other keys.

Defining Conference.hasMany(Session) teaches Conference how to navigate to sessions. It does not independently teach Session how to navigate back. The paired belongsTo adds the reverse metadata while referring to the same foreign-key column; it should not create a second conference relationship.

For the reverse belongsToMany call, swap foreignKey and otherKey: from Session, sessionId is the source key in Registration; from Attendee, attendeeId is. State those meanings before copying an options object in the opposite direction.

### 10. Use the same association alias when loading related rows

An **alias** is the name you assign an association, such as `sessions`. If you define the association with that name, use the same name in the query's `include`. Sequelize needs the alias to identify which relationship to load; it is not merely a label for formatting the result.

Use singular aliases for one related record and plural aliases for collections. Multiple relationships to the same model require distinct meanings: for example, a session's speaker and reviewer can both reference an attendee but must use different foreign-key columns and aliases. An include must select the intended association, not guess from the target model alone.

### 11. SQL remains the underlying model

Associations produce joins over foreign keys. Inspect model metadata and generated SQL when the object graph is surprising.

A flattened join result can repeat conference columns for each session and attendee. Sequelize reconstructs those rows into nested instances using identities and association metadata. The nested shape is convenient, but the database did not store one giant JSON conference object.

When the result is wrong, check the actual foreign-key values, alias, join and selected columns. Changing serialization cannot repair a join that linked the wrong rows.

### 12. Keep database constraints even when the application checks first

An application check can give a helpful error before a write. Another request can still change the data between that check and the write. Foreign keys and unique constraints let the database enforce the relationship for every writer, including scripts that bypass the HTTP route.

A check-then-insert sequence has a gap: request A sees no registration, request B sees no registration, then both try to insert. The database's pair uniqueness decides which insert can succeed. Catch and classify that known failure; do not remove the constraint merely because the application already checked.

Constraints are the final protection for the rules they actually express. A foreign key does not validate ticket policy, and membership uniqueness does not count remaining seats.

## Intermezzo 1 — relationship shape

Answer the `u07-i1-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Locate the foreign keys, pair uniqueness, one-to-one uniqueness and ticket type.

## Concept block 2 — eager loading, resources, and pagination

Within minutes 33–61: query-count comparison 4 min, resource contract 6 min, multiple/deep includes 6 min, filtering/sorting/pagination 12 min.

### 13. Count the queries when loading related data

**Lazy loading** reads related rows later, when you ask for them. One query for three sessions followed by a separate attendee query for each session makes four queries: `1 + N`, with `N = 3`. This **N+1 problem** becomes expensive as the number of parent rows grows. Count actual SQL statements rather than judging the JavaScript loop alone.

For three conferences, a loop calling getSessions() performs four statements: the initial conference read plus three session reads. Moving that loop into Promise.all may overlap some work, but it still issues the same number of statements. N+1 is about the growing request pattern, not whether a loop is synchronous.

Lazy loading is useful when you truly need one related collection after a later decision. It becomes costly when serializing every parent predictably triggers another query. Clear SQL logs after setup so schema creation and seed inserts do not contaminate the measurement.

### 14. Request related rows together with include

**Eager loading** asks Sequelize for related data as part of the requested result, using `include`. The example retrieves parents and related rows with a join—a SQL operation that combines matching rows through their keys. Select the fields you need and retain useful registration fields such as ticket type. Other query options can affect the SQL, so inspect the statements actually issued.

For example:

```js
const conferences = await Conference.findAll({
  include: [{ model: Session, as: "sessions", attributes: ["id", "title"] }],
  order: [["id", "ASC"]]
});
```

The include names the relationship and the needed child fields. For many-to-many data, through: { attributes: ["ticketType"] } retains meaningful registration data while excluding other junction columns. Do not hide ticketType just because it sits in a linking table.

An optional include normally preserves parents without matching children. required: true asks for parents that have a match. A where inside an include can change the join behavior and which parents survive; decide whether you are filtering parents or only which children you show. See [Sequelize eager loading](https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/).

### 15. Worked example — eager-loading query count

Run [eager-loading query count](examples/02-eager-loading-query-count/):

```bash
cd lectures/07-relationships-transactions/en/examples/02-eager-loading-query-count
npm install
npm test
```

Sequelize logging measures `1 + N` real statements against one eager query.

### 16. One query is not automatically cheaper

Multiple collection joins can multiply rows. Bound the parent collection, inspect SQL, measure result size, and choose separate queries when they better fit.

Suppose one conference has three sessions and four sponsors. Joining both collections can produce 3 × 4 intermediate rows for that conference. The ORM may collapse repeated parent objects, but it still had to retrieve and process the multiplied SQL result.

Choose the data a screen or API operation needs, not the largest graph your associations can express. A small set of bounded queries can be better than one huge join. Some hasMany loads can use separate queries deliberately; “more than one statement” is not automatically the N+1 problem.

### 17. Ordering nested results is explicit

Parent order and child order are separate contracts. Add deterministic tie-breakers rather than relying on incidental database order.

Ordering conferences by ID does not also order their session arrays. Specify child ordering through the appropriate association path or separate-query option. If you page parents while joining children, a raw SQL LIMIT applies to SQL rows, not automatically to the number of distinct parent objects you intended. Sequelize may generate subqueries to preserve parent limits; inspect the actual result and count rather than assuming every include/limit combination has identical semantics.

### 18. The API model need not mirror tables

Clients need domain resources, not Sequelize model or junction names. `/api/sessions/:sessionId/registrations/:attendeeId` can expose membership identity without leaking `Registration` internals.

A client can identify a registration by the session/attendee pair even if your database gives that row an extra generated ID. Serialize the fields the client needs, such as attendeeId and ticketType, without exposing implementation-only columns or ORM methods. A new table name should not force every client URL to change.

The URL is also not authorization: knowing an attendee ID does not grant permission to edit that attendee's registration. Authentication and permission checks are introduced later; the small example demonstrates resource behavior, not an access-control system.

### 19. Nested resources express scope

Nesting is useful when clients view registrations within a session and the parent scope is meaningful. Deep nesting or independent access may justify a top-level resource.

Read `/api/sessions/7/registrations/42` as attendee 42's registration within session 7, not necessarily the registration row whose primary key is 42. Apply both identifiers to the database lookup. Looking up attendeeId alone could modify the same person's registration for a different session.

Use nesting when that scope helps the client. A separately managed registration with its own public ID can instead have a top-level URL. Model identity and the questions clients ask should drive that decision, not a rule that every foreign key adds another URL segment.

### 20. Make repeated PUT requests describe the same membership

An operation is **idempotent** when repeating the same request has the same intended effect as applying it once. A `PUT` to a known registration URL can establish that membership and its representation. Its first response may differ from a repeated response; idempotency concerns the effect on data, not identical status codes.

At a known membership URL, PUT can create the membership when absent and replace its documented writable representation when present. Here the complete small representation is ticketType. The first request returns 201, a repeat returns 200, and the stored membership count remains one. Different response statuses are compatible with the same intended resulting state.

If the representation later gains more fields, define whether omitted values reset; treating arbitrary partial changes as PUT blurs replacement semantics. Use PATCH for an explicitly partial update. Repeating the same request is the idempotency comparison, not applying two different ticket types.

### 21. DELETE can ensure absence

Returning `204` for both removed and already-absent membership supports an idempotent target-state contract.

DELETE acts on the membership resource: the attendee remains available for other sessions. This example chooses 204 even if the membership was already absent. Another API could return 404 on a repeat and still have an idempotent effect; identical responses are not the defining requirement. In either case, a 204 response has no JSON body.

### 22. Worked example — resource contract

Run [resource contract](examples/03-resource-contract/):

```bash
cd lectures/07-relationships-transactions/en/examples/03-resource-contract
npm install
npm test
```

The script sends PUT and DELETE requests through a real temporary HTTP server. Follow each repeated request and the stored membership checks. Compare the resulting state as well as status codes.

The script starts a temporary loopback server, sends its own requests, checks stored row counts and ticket values, and closes both server and database. It is not a server left running for curl after npm test exits. The check-then-create code illustrates sequential retries; the database pair constraint still matters for concurrent requests, and a production API must classify the resulting conflict deliberately.

### Worked example — multiple and nested includes

Run [multiple and nested includes](examples/04-multiple-deep-includes/):

```bash
cd lectures/07-relationships-transactions/en/examples/04-multiple-deep-includes
npm ci
npm test
```

Load conference and attendees as sibling associations, then load each attendee’s profile inside the attendee include.

```js
include: [
  { association: "conference" },
  { association: "attendees", through: { attributes: [] },
    include: [{ association: "profile" }] },
]
```

The HTTP session has Ana with a profile and Dan without one; CSS has no attendees. Assertions check both loaded data and the null/empty optional relationships.

An include array loads several relationships from the current model. An include inside one array entry goes one level deeper. Aliases must match the associations at each level. through.attributes hides junction fields from this view; it does not remove the junction or its constraints. The deliberately small graph is suitable for inspection; adding collections can multiply SQL rows.

### 23. Filtering is an allowlisted public language

Map documented filter values to Sequelize `where` options. Reject unknown fields and values rather than passing request query objects into the ORM.

A query string is not a Sequelize options object. Translate level=advanced into the allowed level condition, reject repeated or unsupported values, and decide how absent filters behave. Never let a client inject include, attributes or an arbitrary where tree merely by passing a query object into findAll. Those options can expose extra data or make an unbounded query.

### 24. Sorting uses fixed mappings and tie-breakers

Map public names such as `starts_asc` to fixed `order` arrays. A stable ID criterion resolves equal primary sort values.

For starts_asc, use order: [["startsAt", "ASC"], ["id", "ASC"]]. If two sessions start at 09:00, their IDs decide the order within that tie. For title_asc, title is the primary key of the ordering and ID again breaks ties. The ID resolves ties in each ordered page; offset then skips rows in that complete order.

### 25. Define page size and ordering before pagination

**Pagination** returns part of a collection at a time. `limit` sets the maximum rows in one result; `offset` skips a number of rows in the ordered collection. Sort by documented fields and add an ID tie-breaker so equal sort values do not leave order unspecified. Insertions before an offset can shift positions, so even a stable sort does not make separate page requests a fixed snapshot.

Offset paging is suitable for a small, inspectable list and can support explicit page numbers. Its costs include skipping preceding rows and shifting positions when earlier rows change. A stable sort makes ties deterministic within a query; it cannot freeze the database across several unrelated requests. Ask whether a client needs a live traversal, a numbered page, or a consistent snapshot before choosing the mechanism.

### 26. Page child rows through their parent join

Use Session.findAll with include: [{ association: "conference", required: true, where: { id: conferenceId } }]. The join scopes sessions to one conference. Apply the level condition to Session.where and put order, limit and offset on the root session query. Each page contains sessions, and each session includes its conference. A belongsTo join contributes at most one parent per session.

Do not place a global limit on Conference.findAll and expect it to page sessions inside a hasMany include. First identify which entity the page counts. Here it counts child sessions; no collection join multiplies those rows.

### 27. Worked example — filtering, sorting, and pagination

Run [filtering, sorting, and pagination](examples/05-filter-sort-pagination/):

```bash
cd lectures/07-relationships-transactions/en/examples/05-filter-sort-pagination
npm ci
npm test
```

Follow GET /api/conferences/:conferenceId/sessions?level=advanced&sort=title_asc&limit=1&offset=1. The parent join selects the conference, where selects advanced sessions, order sorts by title then ID, offset skips the first matching session, and limit returns at most one. Predict Transactions before running the check.

The seed has six sessions in one conference and an earlier seventh session in another. Tests check parent isolation, both complete sort sequences, tied start times, combined filtering/pagination, empty pages and invalid parameters. The two sessions starting at 09:00 retain ID order. These checks use unchanged data; discuss how an insertion before a later offset could repeat a previously seen row. This is not a snapshot guarantee.

## Intermezzo 2 — query and API shape

Answer the `u07-i2-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Explain N+1, repeated DELETE, offset shifts and paging child rows through a parent join.

## Concept block 3 — transactions and consistency boundaries

### 28. Several awaits do not make several writes atomic

Suppose you await the seat update, then the booking insert, then the audit insert. Without a transaction, an audit failure can leave the first two writes stored. `await` controls the sequence; it does not undo earlier successful operations. Use a transaction when those writes must succeed or fail together.

Think of a failure after each step: after decrementing inventory, after creating a booking, and before finishing the audit. If these are separate committed statements, try/catch cannot restore the previous state automatically. The transaction is the database mechanism that groups their effects; JavaScript exception handling decides whether the group is allowed to finish.

### 29. State which writes must succeed together

An **invariant** is a rule that must remain true after the operation. For the small booking demonstrator, one successful operation decreases availability and creates a booking plus its matching audit entry. If any step fails, none of those changes should remain. This defines which writes belong in the transaction. The demonstrator checks commit and rollback; duplicate-booking prevention and concurrent seat allocation require additional rules.

Write the intended before/after state before coding:

| Outcome | Available seats | Booking rows | Audit rows |
| --- | --- | --- | --- |
| Initial | 3 | 0 | 0 |
| Failure after booking insert | 3 | 0 | 0 |
| One successful one-seat booking | 2 | 1 | 1 |

An invariant gives the test something stronger than “the promise rejected.” Check every participating table. The audit row in this example is part of the same SQLite database; a log line printed to the terminal would not be undone by rollback.

### 30. Commit all changes or roll them back

A **transaction** groups database operations. **Commit** confirms the group's changes; **rollback** discards them after failure. The all-or-nothing property is **atomicity**. If the audit insertion fails after the booking insertion, rollback must remove the booking and undo the seat change too.

Rollback restores the database changes in the transaction. It does not undo arbitrary JavaScript assignments, HTTP responses, file writes or messages already sent to another service. If you changed a loaded instance's availableSeats property, discard or reload that instance after rollback instead of treating its in-memory value as proof of stored state. The example reads the session again when checking the result.

### 31. Separate the four ACID properties

| Property | Question to ask |
| --- | --- |
| Atomicity | Do all participating database changes commit, or none? |
| Consistency | Do the declared constraints and correctly implemented application rules hold after the operation? |
| Isolation | What can concurrent operations observe, and can their interleaving violate the rule? |
| Durability | After a successful commit, are changes retained under the database's storage and recovery guarantees? |

A transaction does not invent missing domain rules. It can atomically commit an incorrect negative seat count if neither the query logic nor constraints prevent it. Our in-memory transaction test proves rollback/commit behavior, not survival of a machine failure; Lecture 06's file-backed example tests a different persistence property.

### 32. Managed transactions tie outcome to callback settlement

`sequelize.transaction(async transaction => { ... })` commits when the callback fulfills and rolls back when it rejects.

The value returned by the callback becomes the result only after the managed transaction commits. Throwing or rejecting signals failure and causes rollback. Do not call commit or rollback manually inside this managed form.

Be careful with a catch inside the callback: logging an error and returning normally turns the callback into a success, so earlier changes may commit. Catch outside the awaited transaction when you want to translate a failed operation; rethrow inside if the transaction must still fail. See [managed transactions](https://sequelize.org/docs/v6/other-topics/transactions/).

### 33. Pass the same transaction to every participating query

In this explicit transaction model, calls such as `Booking.create(values, { transaction })` must receive the transaction created by the managed callback. Do the same for reads, inventory updates, and audit inserts that belong to the operation. If a write executes outside the transaction, rolling back that transaction does not undo the escaped write.

The transaction object is not merely a tag added to the final insert. Reads that determine a write, the inventory update, the booking insert and the audit insert all belong to the same operation. Pass it to each call and await each result. An async task started without returning or awaiting it may outlive the callback and run after commit.

These examples propagate the option explicitly. Automatic context propagation is a separate configuration choice and is not assumed. On SQLite, connection and locking behavior can make an omitted option produce different failures or unexpected connection reuse; never rely on that accident to establish membership in the transaction.

### 34. Worked example — managed Sequelize transaction

Run [transaction timeline](examples/06-transaction-timeline/):

```bash
cd lectures/07-relationships-transactions/en/examples/06-transaction-timeline
npm install
npm test
```

Inject a failure after booking creation and check that inventory, booking, and audit writes roll back. On success, check that they commit together. This small example demonstrates atomic writes, not a complete concurrent seat-allocation policy.

First predict the three stored values after the injected failure. Then run the success path and compare them again. The example also rejects invalid seat counts before transaction work and insufficient availability during the transaction. These checks cover sequential requests; they are not a load test or a complete cross-database concurrency design.

### 35. Validate cheap input before opening

Reject non-integer or non-positive seat counts before starting a transaction. Database-dependent checks remain inside the consistency boundary.

Validate types, bounds and required syntax before holding database resources. Keep checks that depend on current database state, such as available seats, within the operation that makes the change. Do not perform a slow network request while unnecessarily holding a write transaction; it lengthens contention and still cannot make the remote side effect roll back with SQLite.

### 36. Enforce rules when two requests overlap

Two requests can both check that a registration is absent before either inserts it. A unique constraint on the membership pair makes the database reject one duplicate insert. Seat availability needs its own correctly checked update/transaction strategy; a uniqueness constraint alone does not prevent overselling.

For shared inventory, “read 1, then write 0” in two overlapping operations needs more reasoning than merely wrapping each in transaction syntax. One approach is a conditional database update that decrements only where availableSeats >= requested, then checks the affected-row count inside the transaction. Other engines may use row locking or version checks. The correct choice depends on database behavior, and rejected/contended operations need an explicit policy.

Keep two rules separate: a unique session/attendee pair prevents duplicate membership; inventory accounting prevents overselling. Satisfying either one does not prove the other.

### 37. Isolation and locking still matter

Transaction syntax does not define every concurrent observation. SQLite and production database engines have different locking and isolation behavior.

SQLite normally serializes writes so only one writer can change a database at a time. Lock contention can reject or delay an operation; it does not mean your JavaScript handler is the only active request. Journal mode also affects how readers and writers interact. Other databases may allow several transactions to write different rows at once.

Do not copy a row-lock option from another dialect and assume SQLite provides the same behavior. Test the database you deploy, keep transactions short, and retry only failures you understand with a bounded policy. See [SQLite isolation](https://www.sqlite.org/isolation.html).

### 38. Preserve error identity

Known domain errors should remain known; a recognized unique race may become a conflict. Unexpected errors should roll back and propagate to centralized handling.

Let a known domain failure, such as insufficient seats, remain distinguishable from a disk or SQL failure. Catch specific classes or stable application error codes after rollback, not arbitrary message fragments. Mapping every exception to 409 would mislead clients and hide failures they cannot resolve by changing a request.

### 39. Return after commit

Do not expose a detached success result before the managed transaction settles. The public success boundary follows commit.

In an HTTP route, await the whole application operation that owns the transaction, then send the public result. Sending response.json from inside the managed callback is too early: the callback can still fail or commit can fail after those bytes are sent. Commit also does not prove that the client received the response, so a disconnected client may retry an operation that already committed. Resource identity and idempotency policy matter at that boundary.

### 40. Compensating writes are not equivalent

Trying to “undo” an escaped write can fail too and may be observed between operations. Put the invariant inside one database transaction.

Sending an email and then deleting its database record on failure does not unsend the email. Similarly, an “undo” SQL write is a new operation that can fail or be observed separately. Use one database transaction for changes that must be atomic in that database. Coordinating external services requires a different design, addressed later with asynchronous work; do not claim a local transaction covers them.

## Intermezzo 3 — transaction integrity

Answer the `u07-i3-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Distinguish await from atomicity, explain transaction propagation and commit timing, and identify effects rollback cannot undo.

## Synthesis — trace data, changes, and HTTP

```text
relational: keys → constraints → associations → joins
change: invariant → participants → commit or rollback
HTTP: identity → input grammar → method → response
```

Routes should not expose SQL errors or junction model names. Persistence should not choose HTTP status. Serializers should not depend accidentally on ORM instances.

## Common failure modes

- Swapped association keys or incomplete directions.
- Hiding meaningful junction attributes.
- N+1 related queries.
- Unbounded eager graphs or multiplied joins.
- Missing deterministic order.
- Raw query names passed to ORM fields.
- Treating sequential awaits as a transaction.
- Missing transaction option on one operation.
- Broadly converting every database error to conflict.
- Returning before commit.
- Assuming nested URLs are always better.

## Relation to the tutorial

Conference Registration API defines explicit associations and bounded eager loading. Transactional Booking enforces one all-or-nothing invariant. API Redesign replaces action routes with idempotent nested membership resources.

## AI-assisted development considerations

Before editing, require the agent to state row identities, keys, junction attributes, query count, invariant, transaction participants, and resource contract. Review for implicit keys, N+1 loops, unbounded includes, missing transaction options, broad catches, and identity accepted from request bodies.

## References

- Course migration map, Unit 07.
- `webtech-2025-course/c7/`, `c8/`, and `webTechTutorials-main/S09/`.
- Sequelize association, eager-loading, constraint, and managed-transaction documentation.
- SQLite transaction and foreign-key documentation.
