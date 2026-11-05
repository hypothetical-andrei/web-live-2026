# Lecture 05 — Server-Side JavaScript and REST APIs

> Planned duration: 100 minutes
>
> Format: three concept blocks, six worked examples, an optional 5b variant, and three retrieval intermezzos

## Learning outcomes

By the end of this lecture, you should be able to explain why you use Express, trace its ordered middleware, choose resource routes and HTTP responses, distinguish parsing from validation, compare manual checks with Joi, read an OpenAPI operation, select and negotiate collection representations, explain REST constraints and maturity levels, and forward errors without sending a second response.

## Session map

| Segment | Time | Focus |
| --- | ---: | --- |
| Opening request trace | 0–5 min | Follow a task creation request |
| Concept block 1 | 5–28 min | Node, Express, routing, middleware |
| Intermezzo 1 | 28–32 min | Flow and route checks |
| Concept block 2 | 32–64 min | REST, collection views, formats, Joi, OpenAPI |
| Intermezzo 2 | 64–68 min | Status and boundary checks |
| Concept block 3 | 68–89 min | Errors, observability, verification |
| Intermezzo 3 | 89–93 min | Errors and REST review |
| Synthesis | 93–100 min | Request-to-response sequence |

> When a command starts a persistent server (`npm start`, `npm run dev`, or `node server.mjs`), leave it running and use another terminal for tests/builds. For an example with an API and Vite, run them in separate terminals; stop servers with Ctrl+C when finished.

The examples are independent applications; their standalone servers use the same default port. Install dependencies before class, run one server at a time, and predict each request’s result before checking it. Example 05 adds Joi and a machine-readable description after the manual checks; example 06 then isolates error handling.

## Start with a request to create a task

You already know how to receive a request with Node's HTTP module. Express is a library that helps you choose which function handles a request and lets you reuse steps such as JSON parsing.

Follow a `POST /api/tasks` request through this lecture:

1. Node receives the HTTP request.
2. Express runs the matching functions in the order you registered them.
3. Your route checks the input and asks a repository—the object that reads and writes task data—to create a task.
4. The route sends a status, headers, and body, or passes a failure to error-handling code.

You still decide which input is valid and what each response means. Document the accepted methods and inputs, the possible responses, and the resulting changes to data. Clients need this information to use your API; OpenAPI can make it readable by external tools as well.

## Concept block 1 — Node, Express, routes, and middleware

### 1. Node runs JavaScript outside the browser

Node supplies process, filesystem, networking, streams, and HTTP APIs. Server programs are long-lived processes that accept concurrent work and must handle failures without corrupting later requests.

Node uses the same language you used in the browser, but the environment is different. There is no page DOM unless you add one. You can read configuration from `process.env`, open a listening socket, and access files permitted to the process. A request handler runs inside that process; it is not a new program launched for each request.

While one handler awaits I/O, Node can begin handling another request. This does not make CPU-heavy JavaScript run in parallel on the same event-loop thread. A long synchronous calculation delays other requests. Keep that distinction in mind when reading an `async` route.

### 2. Node receives the request; Express handles it

The Node HTTP server accepts network connections and creates request and response objects. You pass the Express application to that server as its request listener. Express uses the same response: sending it through one route does not create another response for later middleware.

With `node:http`, you can inspect `request.method`, parse the URL, collect body chunks, select a handler, serialize a response, and catch failures yourself. That is useful for understanding HTTP. As an application grows, doing it repeatedly means maintaining your own routing and middleware framework: matching rules, parser limits, error forwarding, and response handling all need consistent behavior and tests.

Express supplies those recurring mechanisms. Your application still chooses its routes, validates input, and maps results to HTTP. Using Express lets you spend this lecture on those decisions while keeping the request flow visible.

We choose Express over Fastify here because the ordered list of ordinary functions is easier to reason about at this stage. Fastify adds useful lifecycle hooks, plugin encapsulation, and schema-based validation/serialization. Learning those mechanisms would add concepts before you have traced a small server. This is a teaching choice, not a claim that Express is always simpler for every application or faster. See [Fastify encapsulation](https://fastify.dev/docs/latest/Reference/Encapsulation/) and [validation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/).

### 3. Middleware functions run in registration order

A **middleware** is a function that Express calls with `(request, response, next)`. It can inspect the request, attach a value such as a request ID, send a response, or call `next()` to continue. Register middleware with `app.use(...)`; register a method-specific route with calls such as `app.get(...)` or `app.post(...)`. Only matching functions run.

Think of `next` as the continuation supplied by Express. A function that neither sends a response nor calls `next` leaves the request waiting. A function that sends a response and then calls `next` may let later code try to send a second response. The middleware does not need to know which handler comes next; registration order and matching determine that.

```js
app.use((request, response, next) => {
  response.set("X-Course-Example", "routing");
  return next();
});
app.get("/api/ping", (_request, response) => {
  return response.json({ data: "pong" });
});
```

Here `app.use` has no path restriction, so it runs for every request that reaches it. The route runs only for its matching method and path.

### 4. Middleware order is behavior

JSON parsing must run before code that consumes `request.body`; static content must be mounted before a fallback that would hide it; error middleware belongs after normal routes. Reordering is not cosmetic.

Trace an invalid JSON request as well as a valid one. If the parser is before the route, parsing can fail before any route validation runs. Express then searches forward for error middleware. An error handler placed above the parser cannot catch a later parser failure by “going back” through the list.

`app.use("/api", router)` mounts a router under a common prefix. Inside that router, `router.get("/tasks", ...)` handles `/api/tasks`. This groups related routes without inventing a new execution model.

### 5. Send a response or continue to the next function

If you call `response.json(...)`, you send the response. If you call `next()`, Express looks for the next matching function. Neither call is a JavaScript `return`: statements below it can still execute. Use `return response.json(...)`, `return next()`, or mutually exclusive branches when the current function must stop. Do not send a response and then continue into another handler that may send again.

### 6. Observe when the response finishes

Record the start time, register the response lifecycle listeners, and only then call `next()`. Registering first avoids missing a response completed by later code. `finish` means Node has handed the response data to the underlying system; it does not prove that the client received it. `close` can follow normal completion or an interrupted connection. Check whether the response finished and guard your logging so you record the outcome once.

### 7. Worked example — Express request flow

Run [Express request flow](examples/01-express-request-flow/):

```bash
cd lectures/05-server-rest-api/en/examples/01-express-request-flow
npm ci
npm test
npm start
```

The event sequence shows one observer around both a static resource and an API route. Predict the array before running the test: the static request has no API-route event, but both requests finish. This example isolates execution order; it does not implement a complete logger.

### 8. Serve files and API routes from the same application

`express.static` serves files such as HTML, CSS, and images from a directory. Your `/api/...` routes calculate responses from application data. Register both deliberately, then put the final not-found handler after them so it does not intercept valid requests.

A static directory is a filesystem location, not a URL prefix by itself. For example, `app.use("/assets", express.static(publicDirectory))` makes `/assets/logo.svg` refer to `logo.svg` under that directory. Keep source files and secrets outside the served directory. Serving static files does not turn a JSON API response into a page; the client chooses what to request and how to display it.

### 9. Routes match method and pathname

`GET /api/tasks` and `POST /api/tasks` are different operations. A pathname-only mental model incorrectly treats unsupported methods as matches.

A route definition describes what this application handles, rather than every legal HTTP request. An unmatched request usually reaches your final 404 handler. Express does not automatically build a complete 405 response listing allowed methods for each resource; add that deliberately if your API promises it. One framework detail to remember is that Express can use a GET handler for HEAD when you have not registered a separate HEAD handler.

### 10. Path parameters identify members

`/api/tasks/:taskId` names a route pattern; `request.params.taskId` contains the matched identifier. Validate and interpret it at the appropriate boundary.

In `/api/tasks/t-7`, the matched parameter is the string `"t-7"`. Matching a route does not prove that the task exists. First check whether the identifier has an acceptable form; then ask the repository whether a corresponding resource exists. The pattern is not a database query.

### 11. Query parameters refine a representation

`GET /api/tasks?completed=true` requests a filtered collection view. The query is part of the URI: this URI and `/api/tasks?completed=false` can identify different collection views, even though both use the same Express route. Query values need explicit parsing.

For `?completed=false`, `Boolean(request.query.completed)` is a mistake: the nonempty string `"false"` is truthy. Compare against the accepted strings explicitly and reject other values if the API requires a boolean. Query input may also have repeated keys or a shape determined by the configured parser, so do not assume every value is one string.

### 12. Worked example — Express route matching

Run [Express route matching](examples/02-route-match-boundary/):

```bash
cd lectures/05-server-rest-api/en/examples/02-route-match-boundary
npm install
npm test
```

The test and documented `curl` requests exercise method/path selection, member extraction, query refinement, and the unmatched-route fallback through Express.

## Intermezzo 1 — request flow and routing

Answer the `u05-i1-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Explain why you use Express, how routes match, and what happens when middleware responds or continues.

## Concept block 2 — resource routes, parsing, and validation

### 13. Name resources in URLs

A **resource** is something your API identifies, such as the task collection at `/api/tasks` or one task at `/api/tasks/t-7`. A **representation** is the data you send about it, such as a JSON object. Use the HTTP method to distinguish reading, creating, updating, and deleting instead of inventing an unrelated action URL for each operation.


### 14. Select a collection view: filter, sort, then page

For a collection request such as `GET /api/tasks?q=notes&sort=title&order=asc&offset=0&limit=2`, decide these operations separately:

| Operation | Question | Parameters in example 03 |
| --- | --- | --- |
| Filtering | Which members match? | `q` is a case-insensitive substring of the title. |
| Sorting | In what order do matching members appear? | `sort=title`, `order=asc` or `desc`; ID breaks equal-title ties. |
| Paging | Which bounded part of that ordered result is returned? | `offset` skips members; `limit` bounds the page size. |

Apply them in that order. Paging first could discard matching members before filtering; sorting only a selected page would not produce a globally ordered result. Sort a copy rather than changing storage just to display a different order. Use a deterministic tie-breaker so equal titles do not arbitrarily cross page boundaries.

The example defaults to offset 0 and limit 2, caps limit at 20, rejects invalid/repeated/unknown parameters, and returns `meta: { total, offset, limit }`. Here `total` counts matches before paging. A page beyond the end is a successful empty list, not a missing-resource 404. The response can include a `Link` header with `rel="next"`; follow that URI rather than rebuilding it and accidentally dropping a filter.

Offset paging is easy to inspect, but inserts or deletes between requests can shift items across pages. Cursor paging instead asks for the portion after a supplied continuation value in a stable order. A cursor is not an automatic snapshot: concurrent updates still need a documented consistency policy. You will use offset paging in the demonstrator and discuss the cursor trade-off without implementing another paging system.

These parameter names and limits are application choices, not rules imposed by REST.

### 15. REST describes constraints on an API's design

**REST** means Representational State Transfer. It describes an architectural style using identified resources, representations, standard method semantics, and stateless requests, among other constraints. Stateless means each request carries the information needed to interpret it; it does not forbid a database or stored resource state. Returning JSON alone does not make an API RESTful. Here you apply the resource and HTTP conventions to small APIs.

Distinguish resource state from conversational state. A task remains in storage between requests. Stateless handling means that a new request does not depend on a previous request having prepared hidden conversational context for this client. Authentication, when added later, must also supply the credentials needed for that request.

HTTP methods have semantics beyond their names. GET is intended for retrieval without changing resource state. PUT describes replacement and is idempotent: repeating the same request has the same intended effect. PATCH describes a partial change and is not automatically idempotent. Deleting an already deleted task may return a different status while DELETE still has an idempotent intended effect.


The architectural constraints explain more than a resource naming convention:

| Constraint | What you should be able to explain |
| --- | --- |
| Client–server | The client presents and requests information; the server manages resources. Their implementations can evolve separately through the interface. |
| Stateless interaction | Each request carries the information needed to interpret it; resource data can remain in storage. |
| Cacheability | A response communicates whether/how it can be reused. Correct cache metadata can avoid another server request; private or changing data needs deliberate policy. |
| Uniform interface | Identify resources, manipulate them through representations, make messages self-descriptive, and expose available transitions through hypermedia. |
| Layered system | A client can talk through intermediaries such as proxies or gateways without depending on hidden implementation layers. |
| Code on demand, optional | A server can supply executable client code, as a browser receives JavaScript. An API need not use this optional constraint. |

A representation is not necessarily a database row. A task may be encoded as JSON, rendered as HTML, or included in a CSV collection export. Its identifier and meaning are separate from those encodings. The URI query participates in identifying the requested collection view; headers can then select a representation for that target. See [Fielding’s REST constraints](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm).

### 16. Use the Richardson model to compare HTTP APIs

The **Richardson maturity model** is a teaching model, not a REST standard or a certificate of correctness:

| Level | What changes? | Task API sketch |
| --- | --- | --- |
| 0: HTTP as transport | One service endpoint carries operation names in its messages. | `POST /taskService` with an action in the body. |
| 1: resources | Operations address individual resources, but methods may still be used indiscriminately. | `/tasks/t-7`, with POST for both reads and changes. |
| 2: HTTP semantics | Methods, statuses, and headers express the operation and outcome. | GET retrieves; POST creation returns 201 and Location; DELETE can return 204. |
| 3: hypermedia controls | Representations describe meaningful available next actions and their targets. | A response gives a next-page link or a permitted transition the client can follow. |

**HATEOAS** means **Hypermedia as the Engine of Application State**. The client follows controls whose relation and media-type semantics it understands, rather than inventing every URL from undocumented rules. A read-only next-page link illustrates navigation; it is not sufficient by itself to establish that an entire API meets level 3 or all REST constraints. Action controls also need enough information to carry out the operation.

Our examples mainly demonstrate level-2 techniques, with a small navigation control in the collection example. JSON plus CRUD is not a complete definition of REST; publishing OpenAPI also does not add hypermedia. Use [Richardson’s model as explained by Fowler](https://martinfowler.com/articles/richardsonMaturityModel.html) to describe concrete differences, not rank an API by its framework.

### 17. Map CRUD operations to methods and responses

**CRUD** means Create, Read, Update, Delete. For a task API, a common mapping is:

| Operation | Request | Typical successful response |
| --- | --- | --- |
| List/read | `GET /api/tasks` or `/api/tasks/:id` | `200` with data |
| Create | `POST /api/tasks` | `201` with data and `Location` |
| Update | `PATCH /api/tasks/:id` | `200` with data, or `204` without a body |
| Delete | `DELETE /api/tasks/:id` | `204` without a body |

Document the actual choices for your API. CRUD names alone do not determine every status or error.

### 18. Status, headers, and body agree

A creation response should not use `201` while returning an unrelated error body. A `204` response must not send JSON. Clients rely on the whole response.

Read `response.status(201).location("/api/tasks/t-7").json({ data: task })` as one response construction. The status reports creation, the header identifies the new resource, and the JSON is its representation. `response.status(204).end()` finishes without a body. Returning `{ success: true }` with 204 is contradictory even if a framework suppresses the bytes for you.


### 19. Select an encoding with content negotiation

The client’s **Accept** header states which response media types it can use. The response’s **Content-Type** states the media type actually sent. On a request carrying a body, its Content-Type describes that request body; it does not choose the response format.

```http
GET /api/tasks?sort=title&limit=2 HTTP/1.1
Accept: text/csv
```

The same target can return CSV here and JSON for `Accept: application/json`. Example 03 calls `request.accepts(["application/json", "text/csv"])`, then uses the corresponding serializer and response Content-Type. Missing Accept or a wildcard permits the default JSON choice. A preference such as `text/csv;q=0.8, application/json;q=0.2` favors CSV; a `q` value of zero means unacceptable. When neither supported type is acceptable, this example chooses 406. HTTP permits a server to disregard preferences in some circumstances; document your policy rather than silently promising strict negotiation everywhere.

Could selection use query parameters or headers? Yes, when your API documents it, but the choices have different consequences:

| Choice | Consequence |
| --- | --- |
| `?q=notes&offset=2&limit=2` | Selection is visible in the URI, so the view can be bookmarked, linked and distinguished by a normal URI-based cache key. |
| Custom filtering/paging headers | Possible, but a URI alone no longer preserves the selection. Cacheable responses need the relevant request-header names in `Vary`, and navigation must preserve those preferences separately. There is no general standard header equivalent for every query option. |
| `Accept: text/csv` | Standard HTTP negotiation for response media type. `Vary: Accept` tells caches that the header participates in selecting the response. |
| `?format=csv` or a `.csv` path | An explicit format-specific URI is also possible. Define its relationship to Accept and what happens if they disagree. |

`Vary` does not make a response cacheable by itself. Example 03 emits `Cache-Control: no-store` to keep live in-memory changes out of caches; it still exposes `Vary: Accept` to make the selection rule visible. It negotiates successful collection responses; its diagnostic errors use JSON. JSON metadata and CSV rows need not have identical structures: both carry the selected members, while the shared Link header provides continuation. See [HTTP content negotiation](https://www.rfc-editor.org/rfc/rfc9110.html#section-12) and [Vary](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.5).

### 20. Use a consistent error object

An **envelope** is an outer object that gives responses a predictable structure. For example:

```json
{ "error": { "code": "task_not_found", "message": "Task not found" } }
```

Client code can inspect `code`; a user can read `message`. Keep the message suitable for public display and keep diagnostic details in server logs.

### 21. Worked example — HTTP responses for resources in Express

Run [HTTP responses for resources](examples/03-resource-contract-table/):

```bash
cd lectures/05-server-rest-api/en/examples/03-resource-contract-table
npm install
npm test
```

Use the documented `curl` requests to inspect creation, follow-up read, missing resource, and bodyless deletion. Then compare the same collection selection as JSON and CSV, follow its next-page link, and change one filter or sort option at a time. Read method, status, headers, body, and resulting state together. This example isolates HTTP semantics: its minimal create handler assumes a valid title, and its Map resets when the application restarts. It is not the validated API from examples 04 and 05.

### 22. Parsing and validation are separate

`express.json()` establishes whether bytes form JSON and produces a JavaScript value. It does not prove the value is an object, has allowed fields, or satisfies domain rules.

There are three separate questions: is the media type supported, is the body syntactically valid JSON, and is the resulting value valid for this operation? `{"title":7}` passes JSON syntax but fails a string-title rule. `{"title":` fails before you have an object to inspect. Keep those failures distinguishable when debugging.

`express.json()` also has a size limit and a `strict` option. Its default strict mode accepts JSON objects and arrays, rather than every JSON value. Example 04 uses `strict: false` so you can observe the validator itself reject `null` and primitive values. A size-limit failure normally maps to 413, not to an invalid-title message.

### 23. Check media type before body semantics

A route expecting JSON should reject an unsupported content type deliberately, commonly with `415`. Do not interpret arbitrary bytes as JSON merely because the route needs an object.

### 24. “Object” requires a precise definition

In JavaScript, `typeof null` and `typeof []` are `"object"`. A plain-object boundary normally excludes both.

### 25. Accept only the fields your route documents

If creation accepts only `title`, decide what happens to an extra field such as `admin`. In these exercises, reject unknown fields rather than passing the entire body into storage code. After checking types, create a new object containing only the accepted values.

This is a policy choice, not a universal requirement of REST. Some APIs deliberately ignore extra fields for compatibility. Here the accepted shape is closed so that a spelling mistake or an unexpected property is visible. Rejecting an unknown property also avoids accidentally forwarding fields the client was never allowed to set. Validation still does not replace authorization.

### 26. Validate type before normalization

Trimming a string can be valid normalization. Converting arbitrary values with `String(value)` changes the contract and can turn invalid input into plausible data.

Choose normalization separately from coercion. Trimming `"  Review notes  "` to `"Review notes"` preserves the intended string value. Turning `42` into `"42"` accepts a different input type. A validation library may enable conversions by default; inspect its options instead of assuming it follows your policy.

### 27. Describe input rules with Joi

After validation, pass a new normalized object into application code. Freezing it can expose unexpected downstream mutation during tests.

For a larger input, a schema library can express repeated checks in one place. **Joi** lets you describe required fields, types, bounds, and unknown-field handling in JavaScript. It returns a result containing `value` and, on failure, `error`. Only use `value` after checking `error`.

```js
const schema = Joi.object({ title: Joi.string().required() })
  .unknown(false).required();
const { error, value } = schema.validate(request.body, {
  convert: false, abortEarly: false
});
```

`required()` on the field rejects a missing title; on the object it rejects an absent body. `unknown(false)` rejects extra keys. `convert: false` disables automatic conversion; `abortEarly: false` asks for multiple validation failures where available. A schema does not know whether a user may create this task or whether a database constraint will succeed. See the [Joi API](https://joi.dev/api/18.x.x) for these options; the runnable example pins Joi 17.13.8.

### 28. Worked example — request body boundary

Run [request body boundary](examples/04-request-body-boundary/):

```bash
cd lectures/05-server-rest-api/en/examples/04-request-body-boundary
npm install
npm test
```

The Express route distinguishes media type, JSON parsing, valid normalized input, arrays, unknown fields, and blank titles. Its README provides equivalent `curl` requests.

### 29. Describe the API for people and tools

Routes translate HTTP input into application calls and translate application outcomes back to HTTP. Repositories should not need Express request/response objects.

You can describe the same HTTP interface in **OpenAPI**, a machine-readable document written as JSON or YAML. `paths` groups URLs and methods; an operation describes parameters, request media types and schemas, responses, and headers. External tools can use this description to render documentation, prepare requests, generate client code, or check HTTP interactions.

For example, `/api/tasks` with `post` describes the creation operation; `requestBody.content.application/json.schema` describes its JSON input. `required: [title]` requires the field, while `additionalProperties: false` rejects fields not listed in `properties`. Under `responses`, the string key `"201"` describes a successful creation and its body and Location header. A member path would use `/api/tasks/{taskId}` and an explicit path-parameter declaration.

OpenAPI is not an Express router or a Joi schema. Merely publishing the file does not validate requests, implement routes, or prove that the server matches it. Joi uses JavaScript methods; OpenAPI uses its own document structure and JSON Schema vocabulary. Keep their rules aligned and test actual responses. See [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html).

Open [Joi and OpenAPI](examples/05-joi-openapi/) after the manual validator. Compare `validateManually` and `validateWithJoi`: both reject numbers, arrays, missing titles, blank titles, and unknown fields, and trim accepted strings without mutating the input. In the Joi version, whitespace-only strings are rejected after explicit normalization. Then inspect `/openapi.json` in a REST client or documentation tool. The description includes a non-whitespace rule and notes trimming; a client generator does not automatically reproduce that normalization. The endpoint returns a demonstration task and does not store it.

Optional comparison: [example 5b — generated OpenAPI and interface artifacts](examples/05b-generated-openapi/) converts the Joi schemas and shared HTTP metadata into a generated specification, a Swagger UI page with Try it out, and a small JavaScript fetch client. Compare schemas.js, operation.js and generated/openapi.json: types and validation rules are converted, while method/path/status choices remain explicit declarations. This reduces duplicated descriptions without discovering arbitrary server behavior. The optional variant is follow-up material; keep the six core demonstrations in the planned session.

## Intermezzo 2 — responses and validation

Answer the `u05-i2-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Trace filter → sort → page, distinguish parsing from Joi validation, and explain Accept and the role of OpenAPI.

## Concept block 3 — error boundaries, observability, and tests

### 30. Expected outcomes are not all exceptions

A missing task may be a normal service outcome represented as `404`. Unexpected repository failures should reach centralized error handling. Choose one consistent service-to-route protocol.

Do not turn “missing task” into “database broken.” A repository can return `null` for an absent record and reject its promise for a connection failure. The route maps the first to 404 and lets the second reach the error handler. If you use deliberately constructed public errors instead, make that choice explicit and consistent.

### 31. Pass failures to error-handling middleware

Call `next(error)` to skip the remaining normal handlers and look for an error handler registered later. In Express 5, a thrown error or rejected promise returned by an async handler is forwarded automatically. An unrelated timer callback or a promise you neither return nor await is not automatically part of that handler's promise.

Register the error handler after your routes and keep all four parameters so Express recognizes it:

```js
app.use((error, request, response, next) => {
  // Classify the error, send one response, or delegate with next(error).
});
```

Error middleware has **four** parameters: `(error, request, response, next)`. Express uses this signature to distinguish it from ordinary middleware, even if a parameter is unused. `next()` continues normal processing; `next(error)` switches to the error path. A 404 is not automatically an exception: if nothing matched, a final ordinary middleware can send the not-found response or construct a known public error.

```js
app.get("/api/tasks/:taskId", async (request, response) => {
  const task = await repository.find(request.params.taskId);
  if (!task) return response.status(404).json({ error: { code: "task_not_found" } });
  return response.json({ data: task });
});
```

If `repository.find` rejects, the promise returned by this Express 5 handler rejects and Express forwards it. A callback API needs explicit forwarding, for example `if (error) return next(error)` inside its callback. A `try/catch` around the call that schedules a timer cannot catch an exception thrown later inside the timer. Follow the [Express 5 error-handling rules](https://expressjs.com/en/5x/guide/error-handling/) rather than assuming every async operation is captured.

### 32. Known client failures can be precise

Malformed JSON, failed validation, conflicts, and missing resources can receive stable 4xx codes when they are safely classified.

Classify failures you recognize. Parser failures can become `invalid_json` or `payload_too_large`; a deliberately constructed application error can expose a stable code. Do not trust any thrown object's `status` or `message` merely because those properties exist. An internal library can attach them too. Example 06 uses a small `PublicError` class to mark errors the application deliberately permits in a response.

### 33. Unexpected failures must be sanitized

Log diagnostic detail internally, but return a stable generic `500` body. Database messages, stack traces, file paths, credentials, and raw request data do not belong in public output.

Central handling makes this choice once. After handling recognized client failures, fall back to status 500 and a generic body. Logging receives the original exception so you can diagnose it; the client receives information it can act on. The synthetic password text in example 06 is a leakage-test fixture, not a real credential. Real logs also need care: do not log entire requests, bearer tokens, or passwords.

### 34. Worked example — centralized error boundary

Run [centralized error boundary](examples/06-error-boundary/):

```bash
cd lectures/05-server-rest-api/en/examples/06-error-boundary
npm install
npm test
```

Predict the responses for a known 404, malformed JSON, a synchronous failure, and a rejected async handler. The checks also verify that an arbitrary error carrying status 400 stays private, a partial response is aborted instead of replaced, and a later healthy request succeeds. This demonstrates the control flow of error handling, not production logging infrastructure.

### 35. Do not send a second response after headers are sent

`response.headersSent` tells you whether the headers have already been sent. Once they have, you cannot replace the status and start a new JSON error response. In error middleware, delegate with `return next(error)` so Express can finish or close the existing response as appropriate.

The beginning of the handler should make this decision visible:

```js
app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  // Map recognized failures; otherwise send one generic 500 response.
});
```

If a streaming route has already sent part of a response, a later failure cannot change its initial status into a clean JSON 500. Delegating lets Express's remaining/default error handling terminate the failed response. The client may observe truncated data or a connection error. That is different from a complete, intentionally generated error response.

### 36. Request identity connects evidence

A request ID in response headers and structured logs lets a client report connect to server-side timing and errors. Accept trusted incoming IDs deliberately or generate one.

### 37. Log completion, not merely a handler's return

Returning from a handler does not necessarily mean that its response has finished. Use response events to record the status and duration. If you listen to both `finish` and `close`, keep a flag so normal completion followed by close does not create two log entries.

### 38. Test through the actual HTTP boundary

Unit tests for validators are useful, but integration checks should start the app on an ephemeral loopback port and use a real HTTP client. This verifies parsing, middleware order, routing, headers, serialization, and error mapping together.

Export `createApp()` separately from `server.js`. A test can create a fresh application, listen on port `0` so the operating system chooses a free port, issue requests with `fetch`, and close the server in `finally`. The normal start script can use a configured stable port. Keeping startup separate avoids importing a module that unexpectedly opens a permanent listening socket.

### 39. Verify success and failure pairs

For creation, test valid and invalid media types. For retrieval, test found and missing. For errors, test sanitized output and a subsequent healthy request. Paired cases expose boundary mistakes.

### 40. Review generated server changes for control flow

Inspect every response path for a return or exclusive branch, every async failure for delegation, every input for exact validation, and every public error for leakage. Reject unrelated framework or dependency changes.

## Intermezzo 3 — errors and REST review

Answer the `u05-i3-` questions in [intermezzo.gift](intermezzo.gift). Take four minutes. Explain async error forwarding and the headers-sent case, then distinguish level-2 techniques from full REST conformance.

## Synthesis — trace one request

```text
Node server
→ ordered Express middleware
→ method + pathname route
→ media parsing
→ input validation/normalization
→ application/repository operation
→ outcome-to-HTTP mapping
→ response finish
↘ centralized error boundary
```

At each step, identify whether the current function responds, calls the next function, or forwards an error.

## Common failure modes

- Middleware mounted in the wrong order.
- Matching path while ignoring method.
- Treating query strings as already typed.
- Returning `200` for every outcome.
- Sending a body with `204`.
- Confusing JSON parsing with application validation.
- Accepting arrays or unknown fields as valid objects.
- Sending a response and continuing execution.
- Catching every error locally with inconsistent shapes.
- Exposing internal details in `500`.
- Testing helpers without testing the HTTP boundary.

## Relation to the tutorial

In-memory Task API builds a full resource router. Middleware Pipeline isolates identity, timing, validation, short-circuiting, and completion. Meeting API Repair diagnoses a missing response path, a wrong status class, inconsistent JSON, and ignored sort direction in ordinary handlers.

## AI-assisted development considerations

Constrain changes to one boundary and provide route tables, envelopes, mounting order, and observable checks. Inspect for app-wide rewrites, new dependencies, missing returns, hidden coercion, local catch-all handlers, and internal-detail leakage. Verify with a live client in addition to reading code.

## References

- Course migration map, Unit 05.
- `webtech-2025-course/c6/` and `webTechTutorials-main/S07/`.
- Express 5 routing, middleware, static, JSON parsing, and error documentation.
- Node.js HTTP server and native `fetch` documentation.
- HTTP Semantics specification.

- [Express 5 error handling](https://expressjs.com/en/5x/guide/error-handling/).
- [Node HTTP response events](https://nodejs.org/api/http.html).
