# Lecture 01 — The Web as a System + AI-Assisted Development

> Planned duration: 96 minutes  
> Format: three concept blocks, five worked examples, and three retrieval intermezzos

## Learning outcomes

By the end of the session, students should be able to:

- trace a user action through client, network, and server boundaries;
- decompose a URL and distinguish browser-only fragments from request targets;
- separate request facts from response facts;
- interpret methods, statuses, headers, and representations as one contract;
- explain how optional headers extend an HTTP message while preserving a simpler fallback;
- collect runtime evidence with DevTools, `curl`, and focused checks;
- use an AI agent to clarify unfamiliar tooling and propose a small verification script;
- inspect a repository before requesting a change;
- write a bounded Gemini task and verify its result independently.

## Session map

| Segment | Time | Focus |
| --- | ---: | --- |
| Opening system trace | 0–7 min | One click crosses several boundaries |
| Concept block 1 | 7–29 min | Clients, servers, URLs, messages |
| Intermezzo 1 | 29–33 min | Locate protocol facts |
| Concept block 2 | 33–56 min | Methods, statuses, media types, REST |
| Intermezzo 2 | 56–60 min | Interpret response contracts |
| Concept block 3 | 60–82 min | Evidence and AI-assisted workflow |
| Intermezzo 3 | 82–86 min | Scope and verification |
| Synthesis | 86–96 min | End-to-end review method |

## Opening system trace — follow one click

A user presses **Save**. The visible button does not save anything by itself. Browser code constructs a request, the network transfers bytes, server code interprets them, and the browser interprets the response.

```text
browser event
→ request construction
→ HTTP exchange
→ server processing
→ response interpretation
→ visible UI state
```

At every arrow, ask what crossed the boundary, who owns the next decision, and what evidence can confirm it.

## Concept block 1 — clients, servers, resources, and messages

### 1. A web application is a communicating system

The client and server are separate programs with separate state and failure modes. They may run on one laptop during development, but communication still happens through an explicit protocol boundary.

### 2. Client and server are roles

A browser is commonly the client, but `curl`, a test, another server, and a mobile application can also be clients. “Client” means initiator of this exchange; “server” means the program accepting and answering it.

### 3. A resource is not a file

A resource is something identified through the web: a document, image, note collection, individual note, generated report, or operation result. Its current representation may be computed rather than stored as a file.

### 4. One resource can have representations

HTML, CSS, JavaScript, images, plain text, and JSON are representations. A representation is the body format exchanged at a moment in time, not the resource itself.

### 5. A URL has named components

```text
https://course.example/api/notes?owner=Ada#details
└scheme┘ └──authority──┘└──path───┘└─query─┘└fragment┘
```

The scheme selects a protocol family, authority identifies the network endpoint, path identifies within that authority, query parameterizes selection, and fragment selects client-side context.

### 6. The fragment does not cross the HTTP boundary

Browsers retain `#details` for client-side navigation. The server receives the path and query request target, not the fragment.

### 7. Worked example — URL boundaries

Run [URL boundaries](examples/01-url-boundaries/):

```bash
node lectures/01-web-system-ai-development/en/examples/01-url-boundaries/example.js
```

Observe decoded query values while the original encoded address remains intact, and confirm that the derived request target excludes the fragment.

### 8. Query and request body have different positions

The query is part of the URL. A request body is a separate optional message section. Either can carry input, but they are not interchangeable evidence in DevTools or server code.

### 9. HTTP is an exchange of two messages

The request has a request line, headers, a blank line, and sometimes a body. The response has a status line, headers, a blank line, and sometimes a body. Do not attribute a response status to the request or a request method to the response.

### 10. Worked example — request/response anatomy

Read [request/response anatomy](examples/02-request-response-anatomy/) from each start line toward its body. Classify method, request media type, status, `Location`, and both JSON bodies as client input or server output.

### 11. Headers are directional metadata

Request headers describe the request or client preferences. Response headers describe the response. Some names appear in both directions, so direction matters as much as spelling.

### 12. Headers extend messages without changing their shape

HTTP keeps the same request/response structure while fields add metadata. A newer server can add an optional response field, and a client that does not recognize that field can still use the status, `Content-Type`, and body it already understands. A newer client may use the extra field without requiring a different message format.

This compatibility is conditional, not magic. A recipient can ignore an unrecognized optional field, but a sender must not make correct interpretation depend on a field the recipient does not understand. Fields that control representation selection, authentication, caching, or message handling are not safely optional merely because they are fields.

In [request/response anatomy](examples/02-request-response-anatomy/), both clients can read the note representation; only the newer client uses `Example-Trace-Id`. The field extends the exchange without redefining the simpler contract.

### 13. Evidence has a location

In DevTools, URL and method appear in request details; payload shows request input; response headers show server metadata; response or preview shows the returned representation; timing shows when phases occurred.

## Intermezzo 1 — locate protocol facts

Use questions prefixed `u01-i1-` in [intermezzo.gift](intermezzo.gift). Allow four minutes, then reconstruct the two-message boundary on the board.

## Concept block 2 — methods, statuses, representations, and REST

### 14. Methods communicate intent

Methods state the intent of a request. They do not describe whether the request eventually succeeded.

| Intent | Typical method | Principle |
| --- | --- | --- |
| Retrieve a representation | `GET` | Should not request a state change |
| Submit data or create a subordinate resource | `POST` | The target resource decides how to process it |
| Replace a resource at a known target | `PUT` | Repetition has the same intended effect |
| Apply a partial change | `PATCH` | The patch representation defines the change |
| Remove a resource | `DELETE` | Requests that the target cease to exist |

Later units design complete resource APIs. For now, method and path together select the intended operation.

### 15. Method names are not behavior by themselves

A handler can incorrectly mutate state during `GET` or ignore a `POST` body. The method expresses a protocol contract that implementation and tests must honor.

### 16. Status codes summarize the outcome

- 2xx: successful handling;
- 3xx: further action or another location;
- 4xx: the request cannot be fulfilled as submitted;
- 5xx: the server failed to fulfill an otherwise meaningful request.

Transport success and application success are different. `fetch` can receive a normal HTTP response whose status is `404`.

### 17. Specific statuses carry useful meaning

| Outcome | Typical status |
| --- | ---: |
| Successful retrieval with a representation | `200 OK` |
| Resource created | `201 Created`, normally with `Location` |
| Successful handling with no response body | `204 No Content` |
| Request input is invalid | `400 Bad Request` |
| Target resource is absent | `404 Not Found` |
| Request representation is unsupported | `415 Unsupported Media Type` |
| Server failed unexpectedly | `500 Internal Server Error` |

These statuses are not interchangeable decorations. They allow a client to classify an outcome without first parsing explanatory prose. The method expresses requested intent; the response status reports the observed outcome.

### 18. Status, headers, and body form one contract

A creation response can use `201`, identify the new resource with `Location`, and return its representation. A validation failure can use `400` with a stable machine-readable error code. Each piece reinforces the same outcome.

### 19. Worked example — response contract check

Run [response contract check](examples/03-response-contract-check/):

```bash
node lectures/01-web-system-ai-development/en/examples/03-response-contract-check/check.js
```

Change the creation status to `200` temporarily and observe that a focused semantic assertion rejects plausible-looking output.

### 20. `Content-Type` declares the body representation

`Content-Type: application/json` says the body is JSON. `text/plain` says it is text, even when its characters resemble JSON. Charset parameters refine a media type without changing its base type.

### 21. Declaration and bytes must agree

A JSON declaration does not repair malformed JSON, and JSON-looking bytes do not override a text declaration. Clients should select parsers from the contract rather than guess from appearance.

### 22. Worked example — representation contract

Run [representation contract](examples/04-representation-contract/):

```bash
node lectures/01-web-system-ai-development/en/examples/04-representation-contract/example.js
```

Compare valid declared JSON, JSON-looking plain text, and malformed declared JSON.

### 23. JSON is syntax; REST is a design style

JSON describes a representation format. REST encourages resource identification, standard protocol semantics, and representations transferred between components. An endpoint returning JSON is not automatically well-designed or RESTful.

### 24. Resource-oriented URLs name nouns

`/api/notes` can identify a collection and `/api/notes/n-7` one member. Method plus resource expresses operations without embedding every verb in the path.

### 25. Conventions need observable contracts

Teams may choose response envelopes such as `{ "data": ... }` and stable errors such as `{ "error": { "code", "message" } }`. Consistency matters because clients and tests depend on these shapes.

## Intermezzo 2 — interpret response contracts

Use questions prefixed `u01-i2-` in [intermezzo.gift](intermezzo.gift). Allow four minutes and require each answer to cite status, header, or representation evidence.

## Concept block 3 — evidence and AI-assisted development

### 26. Source code is a claim about runtime behavior

Reading a handler is useful, but the running program may use different configuration, call another path, or fail at a boundary. Combine source inspection with observation.

### 27. Inspect one exchange with browser DevTools

Use a repeatable sequence rather than clicking through panels until something looks relevant:

1. Start the supplied local application and open its printed URL.
2. Open browser developer tools and select **Network** before triggering the action.
3. Clear earlier entries. Enable **Preserve log** only when navigation or reload would otherwise remove evidence.
4. Trigger exactly one action, then select the corresponding network entry.
5. Record the request URL and method. Inspect request headers, query parameters, and any request payload separately.
6. Record the response status and response headers.
7. Read `Content-Type` before classifying the response body; then inspect **Response** or **Preview**.
8. Inspect **Timing** only after confirming that this is the intended exchange.
9. Repeat the request with `curl -i` as a smaller independent client.

Run [request/response anatomy](examples/02-request-response-anatomy/) for a local target designed for this sequence.

### 28. `curl` is an independent small client

Use `curl -i` to include response headers and `curl -v` when request diagnostics matter. Reproducing a browser observation with a smaller client helps isolate UI code from HTTP behavior.

### 29. Automated checks make claims repeatable

Baseline checks prove the environment works, objective checks distinguish the requested behavior, and regression checks protect unrelated behavior. A passing check is evidence only for the claim it actually tests.

### 30. Ask for tooling clarification before code

An agent can first help locate the documented start command, explain what a DevTools panel or command flag exposes, and turn a required observation into a checklist. Ask it to cite project files or tool output and prohibit edits at this stage. Clarification should make independent inspection easier, not replace it with inferred answers.

### 31. Inspect a repository before modifying it

Locate entry points, scripts, relevant modules, tests, conventions, and current failures. Do not ask an agent to regenerate a system whose boundaries you have not identified.

### 32. Write a bounded task

State:

- **Goal:** requested behavior;
- **Context:** relevant files and current failure;
- **Constraints:** allowed scope, APIs, dependencies, and invariants;
- **Done when:** observable checks and behavior.

This structure makes both the proposed change and its acceptance criteria reviewable.

### 33. Ask for one focused verification script

State the public behavior to observe, the permitted tools and files, and the failure the script must detect. Prefer built-in tooling for a small check. Inspect whether the proposed script exercises the public boundary instead of copying constants or implementation logic. Before trusting a green result, make the relevant behavior wrong temporarily and confirm that the check fails for the intended reason.

### 34. The diff answers “what changed?”

Inspect every changed file. Look for scope creep, deleted checks, hidden dependency additions, unrelated formatting, weakened validation, and implementation outside the named boundary.

### 35. Runtime evidence answers “does it work?”

A narrow diff can still be wrong. A passing test can coexist with unauthorized changes. Scope review and behavioral verification are independent gates.

### 36. Worked example — AI-assisted verification workflow

Follow [AI-assisted verification workflow](examples/05-bounded-change-review/) and run its focused HTTP check:

```bash
node lectures/01-web-system-ai-development/en/examples/05-bounded-change-review/verify-http.mjs
```

The example makes the sequence explicit: inspect, clarify tooling, state the contract, request a focused check, inspect and challenge that check, request a bounded repair, inspect the diff, rerun checks, and verify independently. The supplied script demonstrates the small public-boundary check an agent may propose; changing the creation status to `200` proves that its status assertion is sensitive.

### 37. Repair from a diagnosis

Reproduce the failure, state the observed and expected contract, locate the responsible boundary, request the smallest repair, inspect the diff, rerun focused and regression checks, and explain the result.

### 38. Agents accelerate work; they do not own correctness

An agent can explore, propose tests, implement, and explain. It cannot supply independent evidence merely by asserting that its own output is correct. The student or engineer remains accountable for acceptance.

## Intermezzo 3 — scope and verification

Use questions prefixed `u01-i3-` in [intermezzo.gift](intermezzo.gift). Allow four minutes, then compare “small diff” with “verified behavior.”

## Synthesis — one end-to-end investigation

```text
user action
→ identify request URL, method, headers, and body
→ identify response status, headers, and body
→ compare the exchange with the intended resource contract
→ locate the responsible code boundary
→ request a bounded change
→ inspect the diff
→ verify with DevTools, curl, and focused checks
→ explain the important path
```

## Common failure modes

- Mixing request and response facts.
- Sending fragments as though the server receives them.
- Treating query parameters and request bodies as interchangeable.
- Guessing media type from body appearance.
- Treating every non-200 response as a network failure.
- Assuming every unrecognized header is either fatal or safely optional without checking its semantics.
- Calling every JSON endpoint RESTful.
- Reading only source and assuming runtime behavior matches.
- Asking an agent to edit before using it to clarify the available tools and evidence locations.
- Asking for a broad rewrite before reproducing the failure.
- Trusting a narrow diff without running checks.
- Trusting passing checks while ignoring unrelated changes.

## Relation to the tutorial

HTTP Detective collects browser and command-line evidence. Tiny HTTP Server exposes the server decisions behind that evidence. Gemini Repair Task applies diagnose–scope–repair–diff–verify to an incorrect contract. The lecture examples remain smaller and do not disclose tutorial implementations.

## AI-assisted development checklist

Before a change: inspect, reproduce, clarify unfamiliar tools, state the public contract, and define “done.” Ask for the smallest check that can observe the contract, inspect it, and prove that it detects the intended defect. During a change: constrain files and invariants. After a change: inspect the diff, run focused and regression checks, exercise a failure path, verify independently, and explain why method, status, headers, and body agree.

## References

- Course migration map, Unit 01.
- `webtech-2025-course/c6/`.
- `tehnologii-web/http/`, `path-parameter/`, `query-string/`, and `forwarder-proxy/`.
- MDN HTTP overview, messages, methods, status codes, and media types.
- Node.js HTTP and native `fetch` documentation.
- Browser Network developer-tools documentation.
