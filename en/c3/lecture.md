# Lecture 03 — Modules, Asynchrony, Events and the Browser

> Planned duration: 95 minutes  
> Format: three concept blocks, five worked examples, and three retrieval intermezzos

## Learning outcomes

Students should be able to explain ESM boundaries, trace promise continuations, choose sequential or parallel coordination, classify `fetch` outcomes, render explicit UI states, manipulate the DOM safely, reason about event propagation, and diagnose stale or unhandled asynchronous behavior.

## Session map

| Segment | Time | Focus |
| --- | ---: | --- |
| Opening timeline | 0–7 min | Why browser code is not one top-to-bottom run |
| Concept block 1 | 7–28 min | Modules, callbacks, and promises |
| Intermezzo 1 | 28–32 min | Module and event-loop checks |
| Concept block 2 | 32–56 min | Promise coordination, fetch, failure |
| Intermezzo 2 | 56–60 min | Async outcome checks |
| Concept block 3 | 60–81 min | DOM state and propagated events |
| Intermezzo 3 | 81–85 min | DOM and delegation checks |
| Synthesis | 85–95 min | Timeline-driven review |

## Opening timeline — one page, many triggers

When a page loads, its JavaScript sets up the interface and registers functions to handle events. Those functions run when something happens: the user clicks, a timer expires, or requested data becomes available.

```text
page loads → setup code runs → setup finishes
later: user clicks → click handler runs → handler finishes
later: data arrives → code using the data runs
```

We will trace these steps to answer two questions: what runs now, and what runs later?

## Concept block 1 — modules, callbacks, and promises

### 1. Modules let files share selected functions and values

A module is a JavaScript file with its own scope. Use `export` to make a function or value available to other modules, and `import` to use it:

```js
// render.js
export function showUser(user) {
  console.log(user.name);
}

// main.js
import { showUser } from "./render.js";
showUser({ name: "Ana" });
```

`showUser` is the exported function. `"./render.js"` tells the browser where to load its module. The function's parameters and behavior describe how to use it; the import path locates the file.

### 2. Tell the browser to load a module

```html
<script type="module" src="./main.js"></script>
```

This loads `main.js` and its imports. Without `async`, a module script runs after the HTML has been parsed. Modules use strict mode, and their top-level declarations stay in module scope rather than becoming global variables.

### 3. Relative imports use the importing module's URL

If `main.js` is at `/scripts/main.js`, its import of `"./render.js"` refers to `/scripts/render.js`. It is relative to the module, not to the HTML page. Browser-native imports use URLs; write the extension rather than expecting the browser to add it. Build tools can support additional import rules, which we will study later.

### 4. Importing the same module shares its state

Within the same JavaScript environment, imports referring to the same module URL use the same module instance. Its top-level code runs once. If it stores a variable, functions importing that module can observe changes to that variable through its exports.

### 5. Worked example — functions sharing module state

Run [module boundary and shared instance](examples/01-module-live-binding/):

```bash
node lectures/03-browser-async-events/en/examples/01-module-live-binding/example.js
```

Follow `addTask` into `state.js`, then follow `summarizeTasks` into `summary.js`. Both use the same stored tasks. The returned summary contains copies of the data, so changing that summary does not change the stored tasks. Ask: which file stores the data, and which exported function changes it?

### 6. Ordinary calls return before the next statement runs

```js
const user = getUser();
showUser(user);
```

For an ordinary synchronous function, `getUser()` runs and returns a value before `showUser(user)` starts. The call stack tracks active function calls. On the browser's main JavaScript thread, another event handler does not interrupt this synchronous sequence.

Some computations need values that are not available yet. Displaying a user’s name requires the user data, but obtaining that data may involve a network request. The step that uses the data must wait until the data is available; unrelated code can continue.

A network response may take seconds. Keeping the browser’s JavaScript thread busy waiting would prevent it from handling clicks. Instead, we start the request now and describe what should happen when its result becomes available. A continuation describes the computation that follows; a promise gives us an object through which we can receive the result or handle failure.

### 7. A callback can describe the next step

Suppose an API named `getUserWithCallback` starts loading user data and calls a supplied function when the data is available:

```js
getUserWithCallback((user) => {
  showUser(user);
});
console.log("Request started");
```

The arrow function is passed as an argument; it is not called at this line. In this hypothetical asynchronous API, `getUserWithCallback` returns before the data arrives. The log runs first; later, the API calls the callback with the user. This timing comes from the API's behavior: accepting a callback does not automatically make a function asynchronous.

### 8. A continuation expresses what to do next

A **continuation** represents the remaining computation after a particular point. Here, after obtaining the user, the remaining step is `showUser(user)`. It can be expressed as the callback above. Continuations are useful for explaining synchronous code too; they do not inherently require waiting.

In **continuation-passing style (CPS)**, a function receives an explicit continuation and passes its result to that continuation instead of returning the result normally:

```js
function addWithContinuation(a, b, next) {
  next(a + b);
}

addWithContinuation(2, 3, (sum) => console.log(sum));
```

This small CPS example is synchronous. Callback-based asynchronous APIs use the same idea of passing the next step, but not every callback is a continuation: a sorting comparator, for example, computes a comparison rather than expressing the rest of the program.

### 9. A promise lets the caller handle a result or failure

A promise represents a result that may become available later. The promise object itself is available immediately; its eventual result may not be. JavaScript does not automatically wait when you use a promise in an expression or pass it to a function:

```js
const userPromise = getUserPromise();
showUser(userPromise); // runs now, receiving the promise object, not the user
```

Our `showUser` function needs user data, so this call does not provide what it needs. We must explicitly arrange for that step to run when the value is available. With `.then()`, we register the continuation on the promise:

```js
const userPromise = getUserPromise();
const displayPromise = userPromise.then((user) => {
  showUser(user);
});
displayPromise.catch((error) => {
  console.error("Could not display the user:", error);
});
```

These API names are illustrative: `getUserWithCallback` accepts a callback, while `getUserPromise` returns a promise.

| Promise state | Meaning |
| --- | --- |
| Pending | No final outcome yet |
| Fulfilled | A value is available |
| Rejected | A failure reason is available, usually an error |

A promise starts pending and can become fulfilled or rejected once. **Settled** means either fulfilled or rejected. By the time you receive a promise, it may already have reached a final state.

`.then()` registers a function to use the fulfilled value and returns a new promise. In this example, that new promise also captures an error thrown by `showUser`. `.catch()` registers failure handling. Registering these handlers does not wait for them to run. A promise is an object, not a thread; the API and browser arrange the underlying work.

### 10. `async` and `await` express the same steps in statement order

```js
async function displayUser() {
  try {
    const user = await getUserPromise();
    showUser(user);
  } catch (error) {
    console.error("Could not display the user:", error);
  }
}
```

Calling an `async` function starts executing its body immediately and returns a promise. At `await`, this function suspends and returns control to its caller. When the awaited promise fulfills, the function resumes and `user` receives the value. If it rejects, the `await` expression throws the reason, which the `catch` handles here. Failure does not supply a user value: execution moves to the error handler, skipping `showUser(user)`.

The statements after `await` form the continuation. The browser's JavaScript thread is free to run other work while this function waits. An `async` function's returned promise fulfills when the function finishes normally, or rejects if an error escapes it. Adding `async` alone does not move computation onto another thread.

### 11. Worked example — predict what runs before and after `await`

Run [async continuation order](examples/02-async-continuation-order/):

```bash
node lectures/03-browser-async-events/en/examples/02-async-continuation-order/example.js
```

Read the code and predict the five entries before running it:

```text
script start → function start → script end → after await → promise fulfilled
```

`run()` begins immediately. At `await`, it suspends, allowing the calling code to record `script end`. Later it resumes and records `after await`. Finishing `run()` fulfills its returned promise, so the attached `.then()` callback records `promise fulfilled` afterward.

### 12. Promise handlers and resumed functions run as microtasks

Why does the example log `script end` first even though it awaits an already fulfilled promise? Promise handlers and execution resumed after `await` run through the **microtask queue**. They do not interrupt the current synchronous code.

The browser finishes the current synchronous work, then processes queued microtasks before moving on to another task, such as a timer callback. Microtasks added while processing that queue are also processed before the next task. If an awaited promise is still pending, the function's continuation waits for its outcome before it can run.

Use the example to separate three moments: calling the function, obtaining the promise's outcome, and running the code that uses that outcome. They need not happen together.

## Intermezzo 1 — modules and scheduling

Use questions prefixed `u03-i1-` in [intermezzo.gift](intermezzo.gift). Allow four minutes and have students draw where the continuation is scheduled.

## Concept block 2 — coordination, fetch, and failure

### 13. Sequential work expresses dependency

```js
const user = await loadUser();
const tasks = await loadTasks(user.id);
```

The second operation needs the first result, so sequential waiting matches the data dependency.

### 14. Parallel work starts before waiting

```js
const profilePromise = loadProfile();
const tasksPromise = loadTasks();
const [profile, tasks] = await Promise.all([profilePromise, tasksPromise]);
```

Independent operations should usually be started together.

### 15. Worked example — parallel request shape

Run [parallel request shape](examples/03-parallel-request-shape/):

```bash
node lectures/03-browser-async-events/en/examples/03-parallel-request-shape/example.js
```

All starts precede all finishes. Completion order differs, while `Promise.all` preserves input order in its result.

### 16. `Promise.all` rejects if any input promise rejects

`Promise.all` returns one promise for the supplied promises. It fulfills with their values in input order when all fulfill. If any input rejects, the combined promise rejects with that reason without waiting for the others to finish. The remaining requests keep running; `Promise.all` does not cancel them. In the dashboard, we need all three results to display the combined summary. If a feature can use partial results, it needs separate handling for those results.

### 17. Receiving an HTTP response is different from HTTP success

`fetch` normally fulfills with a `Response` when the server sends status and headers, including for `404` and `500`. Check `response.ok`: it is true for statuses 200–299. A network failure or cancellation can instead reject the promise. Thus `catch` alone will not detect an HTTP error status; the code must check the response and throw if that status is unacceptable.

### 18. Worked example — checking an HTTP error response

Run [fetch HTTP boundary](examples/04-fetch-http-boundary/):

```bash
node lectures/03-browser-async-events/en/examples/04-fetch-http-boundary/example.js
```

The fake `404` fulfills. `loadJson` checks `response.ok` and deliberately turns the unacceptable response into an application error.

### 19. Reading the response body takes another asynchronous step

`await fetch(url)` provides a `Response` once the status and headers are available; the body may still be arriving. A response body is a stream: bytes can arrive in chunks over time. This matters especially for large downloads or responses generated gradually by a server.

`await response.json()` waits for the complete body, decodes it as text, and parses that text as JSON. It returns a promise because reading the body can require waiting for more bytes, even for a small response. This does not mean JSON parsing runs on another thread: `JSON.parse(text)` itself is synchronous, and parsing a large value can still take substantial time.

Choose how to read the body according to its format:

| Method | Result and typical use |
| --- | --- |
| `response.json()` | A JavaScript value parsed from JSON, such as API data |
| `response.text()` | A string, such as plain text, HTML, XML, or CSV; further parsing is separate |
| `response.blob()` | A `Blob`, useful for images or downloadable files |
| `response.arrayBuffer()` | An `ArrayBuffer` containing bytes for binary processing |
| `response.formData()` | A `FormData` object parsed from multipart or URL-encoded form data |

All these methods return promises and consume the complete body. They are alternative ways of reading it, not steps to call consecutively on the same response: normally a body can be consumed only once. For XML or HTML, read text and parse it with `DOMParser`; CSV needs its own parser. Neither `text()` nor the binary methods interpret the body as structured application data.

For incremental processing, read `response.body`, a `ReadableStream`, rather than waiting for one complete value. Chunks do not necessarily coincide with lines or JSON records; the application must handle those divisions. Streaming can avoid collecting an entire large response before processing it. `json()` does not provide incremental JSON results.

Body reading can fail if the connection breaks or the request is aborted. JSON parsing can fail if the received text is invalid JSON. Even valid JSON may have the wrong fields or types, so a successful HTTP status does not guarantee usable application data.

See [MDN: reading and streaming response bodies](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body).

### 20. Show what is happening while data loads

Here, rendering means updating the displayed page from application data. While a request is pending, show a loading indicator. After it finishes, show the result, an empty-result message, or an error. For example, a task search can show “Loading…”, matching tasks, “No tasks found”, or “Could not load tasks”. Replace the previous display when appropriate so an old result is not mistaken for the current one.

```text
idle → loading → success
              ↘ empty
              ↘ error
```

### 21. Catch loading errors where you update the page

A function that loads data can report failure by throwing an error. The function that calls it can catch that error and decide what to show the user:

```js
async function loadUser() {
  const response = await fetch("/user.json");
  if (!response.ok) {
    throw new Error(`Could not load user: HTTP ${response.status}`);
  }
  return response.json();
}

async function displayUser() {
  showLoading();
  try {
    const user = await loadUser();
    showUser(user);
  } catch (error) {
    showError(error.message);
  }
}
```

The display functions stand for page updates; their DOM implementation comes in the next block. `loadUser()` reports the failure; `displayUser()` handles it. Its `await` lets the `catch` handle request, status-check, and JSON-reading failures. If the loading function cannot recover, let its promise reject rather than catching the error and silently returning as though loading succeeded.

### 22. Use `finally` for work required after success or failure

A `finally` block runs when execution leaves the corresponding `try`/`catch`, whether the operation succeeded or failed. Put shared cleanup there: for example, hide a busy indicator or clear a timeout timer. `finally` does not itself handle an error; an uncaught error still propagates afterward. Avoid returning from `finally`, because that can replace the intended result or suppress an error.

### 23. Cancel a request with `AbortController`

An `AbortController` is an object through which your code can request cancellation. Its `.signal` property is an `AbortSignal`: an object passed to the operation so it can observe that cancellation request. Calling `controller.abort()` marks the signal as aborted and notifies operations using it. This is a browser API, not a thread or an operating-system signal.

```js
async function loadWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}
```

Here the timer requests cancellation after one second. With `abort()` called without a custom reason, cancellation rejects an unfinished fetch or body read with an error named `AbortError`; the caller must handle it. `return await` keeps the timeout active until JSON reading finishes. `finally` clears the timer even if the operation finishes early or fails. An aborted signal stays aborted, so a new attempt needs a new controller. Cancelling the client request does not undo work the server may already have performed.

See [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

### 24. Limit retries and choose which failures to retry

A retry is another attempt after a failure. A temporary connection problem or an overloaded server may succeed on a later attempt; requesting the same missing file again usually will not. Decide which failures merit another attempt, set a maximum, and wait between attempts so repeated requests do not add to the server’s load.

The tutorial chooses these exercise rules: retry network failures, timeouts, and `5xx` responses; do not retry `4xx` responses or invalid JSON. It permits two retries, meaning at most three attempts. The delays are 50 ms and then 100 ms. Increasing the delay between retries is called **backoff**; doubling it is **exponential backoff**. These choices are specific to the exercise, not universal rules for every service.

Clear each attempt’s timer before waiting for the next attempt, and retain the last error if all attempts fail. Retrying a request that changes data can repeat the change if the server processed the first request but its response was lost. For such requests, retry only when the API provides a way to avoid duplicate effects.

### 25. Keep an older request from replacing a newer result

Suppose a user searches for “cat”, then immediately searches for “car”. The “car” response may arrive first. If the older “cat” response arrives later and updates the page, the displayed results no longer match the current search.

Give each search a sequence number and compare it with the latest number before displaying its result or error. Ignore completions belonging to older searches. Cancelling the earlier request can reduce wasted work, but checking which search is current also protects against work that already completed or cannot be cancelled.

## Intermezzo 2 — asynchronous outcomes

Use questions prefixed `u03-i2-` in [intermezzo.gift](intermezzo.gift). Allow four minutes and distinguish network rejection, HTTP error, and parsing rejection.

## Concept block 3 — DOM state and propagated events

### 26. The DOM represents the page as connected objects

The **Document Object Model (DOM)** represents the HTML document as a tree of nodes. Elements are nodes, and text is represented by text nodes. An element can contain child nodes and have a parent node. Browser JavaScript uses these objects to read and change the page; changing an element’s text or children changes what the browser can display.

### 27. Find the elements you need and check that they exist

A **CSS selector** is an expression that describes which elements to match in the DOM. CSS uses selectors to choose elements for styling; JavaScript can use the same syntax to search for elements:

| Selector | Matches |
| --- | --- |
| `form` | Elements with the tag name `form` |
| `#tasks` | The element with `id="tasks"` |
| `.completed` | Elements whose class list includes `completed` |
| `[data-action="delete"]` | Elements with a `data-action` attribute equal to `delete` |
| `#tasks button` | Buttons anywhere inside the element with `id="tasks"` |

The selector is a string describing the search, not the element itself. `document.querySelectorAll("#tasks button")` returns a `NodeList` of all matching buttons; `querySelector` returns only the first match.

`document.querySelector("#tasks")` finds the first element matching the CSS selector, or returns `null` if there is no match. During setup, find the form and list that the application needs. Check for missing elements before using them so a wrong selector produces a useful error. Pass the found elements to rendering and event-handling functions rather than searching the whole document repeatedly.

### 28. Build a list item with DOM methods

`document.createElement("li")` creates an element. Set its properties, assign its text with `textContent`, and attach it with `append`. `replaceChildren` replaces an element’s current children, which is useful when redrawing a list. These methods let us build the desired structure directly, without constructing an HTML string.

### 29. Use `textContent` to display data as text

A task title might contain `<strong>hello</strong>`. Assigning it to `textContent` displays those characters literally. Assigning it to `innerHTML` instead parses it as markup. Text supplied by users or external services must not be treated as executable markup; use `textContent` for these values. Use HTML parsing only when inserting markup deliberately and with appropriate safeguards.

### 30. Update the data, then redraw the relevant elements

Keep task titles and completion flags in the task data. When a task changes, update that data and call a rendering function to display it. This makes the data the place to inspect the current task state. If unrelated handlers independently change checkbox appearance, row classes, and task data, these representations can disagree.

### 31. A click can reach listeners on containing elements

An **event listener** is a function registered with `addEventListener` to run when an event is dispatched. For a click on a button inside a list, the event path includes the button and its ancestors, such as the list.

During **capture**, listeners on ancestors can run on the way toward the target. At the **target**, listeners on the clicked element run. During **bubbling**, listeners on ancestors can run on the way back out. `addEventListener("click", handler)` listens at the target or during bubbling; `{ capture: true }` selects capture. Clicks bubble, but not every event type does.

See [MDN: event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling).

### 32. Distinguish the clicked element from the element handling the click

For a click on a span inside a button, `event.target` identifies the span in our example. If the listener is registered on the surrounding list, `event.currentTarget` identifies that list while its listener runs. The clicked element and the element handling the click need not be the same.

### 33. Handle row clicks with one listener on the list

**Event delegation** means putting a listener on a containing element and using bubbling to handle events from its children. One list listener can handle rows added later, so each row does not need its own listener.

Starting from the clicked element, `closest("[data-action]")` checks that element and then its ancestors to find a matching action control. Find its containing task row to obtain the task id. Check that the control and row belong to the list you are handling. Clicking a span inside a delete button must still identify the button and the correct row.

### 34. Worked example — tracing a delegated click

Open [delegated event boundary](examples/05-delegated-event-boundary/) and click the nested label. The output identifies the clicked element, the element with the listener, the action, and the task separately.

### 35. Preventing a default action does not stop bubbling

Submitting a form normally triggers a browser action, such as navigation. `event.preventDefault()` cancels that action when the event is cancelable, allowing JavaScript to handle the submission. `event.stopPropagation()` instead prevents the event from continuing to other elements along its path. Preventing navigation does not stop bubbling, and stopping bubbling does not prevent navigation.

### 36. Remove listeners when their handling is no longer needed

If setup runs again and registers new handler functions without removing the previous ones, one click can trigger duplicate actions. Keep references to the registered functions so cleanup can call `removeEventListener` with the same event type, function reference, and capture setting. A setup function can return an `unbind()` function that performs these removals before replacing the interface or setting it up again.

See [MDN: removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener).

## Intermezzo 3 — DOM and event boundaries

Use questions prefixed `u03-i3-` in [intermezzo.gift](intermezzo.gift). Allow four minutes, then trace a click on a nested span through the delegated list listener.

## Synthesis — trace two timelines together

```text
event target → delegated handler → state transition → render loading
                                                ↓
                                      start async work
                                                ↓
                        fulfillment/rejection → is this result still current?
                                                ↓
                                      render final state → cleanup
```

Review module imports and shared state, promise success and failure paths, fetch's separate network and HTTP outcomes, safe DOM rendering, and the difference between an event's origin and the element handling it.

## Common failure modes

- Import cycles that make dependencies hard to follow.
- Forgotten `await` or unobserved rejection.
- Sequential waits for independent operations.
- Treating `404` as a rejected `fetch`.
- Reading the body before checking whether the HTTP status is acceptable.
- Leaving loading visible after failure.
- Reusing an aborted controller.
- Stale completion overwriting newer state.
- Rendering untrusted data with `innerHTML`.
- Reading delegated row data from `currentTarget`.
- Binding duplicate listeners without cleanup.

## Relation to the tutorial

Multi-source Dashboard combines parallel data loading and explicit render states. Interactive Task List combines modules, DOM creation, and delegated events. Resilient Fetch makes timeout, retry, cleanup, and error classification explicit. Lecture examples remain smaller diagnostic models.

## AI-assisted development considerations

Ask an agent to draw the event/promise timeline and identify which code handles each result and removes each listener or timer. Inspect generated diffs for unhandled rejections, accidental serialization, swallowed failures, unsafe HTML, controller reuse, and stale writes. Verify timing with controlled dependencies rather than unreliable internet speed.

## References

- Course migration map, Unit 03.
- `webtech-2025-course/c3/async/`, `events/`, `dom/`, and `exceptions/`.
- `webTechTutorials-main/S03/` and `S04/`.
- MDN modules, promises, Fetch API, DOM, and event propagation.
- WHATWG Fetch and DOM standards.
