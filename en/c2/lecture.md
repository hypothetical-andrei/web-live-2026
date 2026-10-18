# Lecture 02 — JavaScript for Reading and Modifying Programs

> Planned duration: 96 minutes  
> Format: three concept blocks, five worked examples, and three retrieval intermezzos

## Learning outcomes

By the end of the session, students should be able to:

- describe JavaScript as a multi-paradigm, object-centric language with C-family surface syntax;
- distinguish its seven primitive types from object values and recognize arrays and functions as special object-system participants;
- trace own-property lookup, prototype delegation, shadowing, and class methods;
- explain object identity, aliases, mutation, and shallow copying;
- use first-class functions, higher-order operations, and lexical closures;
- read `filter`–`map`–`reduce` pipelines by input/output shape;
- audit unfamiliar generated JavaScript with counterexamples and focused checks.

Asynchronous programming is deliberately out of scope here. Lecture 03 introduces modules, promises, `async`/`await`, browser events, and scheduled execution.

## Session map

| Segment | Time | Focus |
| --- | ---: | --- |
| Opening language map | 0–7 min | What kind of language is JavaScript? |
| Concept block 1 | 7–28 min | Syntax, values, and runtime types |
| Intermezzo 1 | 28–32 min | Classify values and syntax claims |
| Concept block 2 | 32–55 min | Objects, prototypes, identity, and copies |
| Intermezzo 2 | 55–59 min | Trace lookup and shared references |
| Concept block 3 | 59–82 min | Functional core, closures, pipelines, and audit |
| Intermezzo 3 | 82–86 min | Trace functions and counterexamples |
| Synthesis | 86–96 min | One language, several reading lenses |

## Opening language map — familiar punctuation, different runtime

```js
const select = (records, predicate) => {
  const selected = [];
  for (const record of records) {
    if (predicate(record)) selected.push(record);
  }
  return selected;
};
```

The braces, declarations, loop, condition, calls, and `return` look familiar to programmers from C-family languages. The deeper questions are specific to JavaScript: what value does each name refer to right now, what object owns `push`, where is that method found, and how can a function arrive through `predicate`?

## Concept block 1 — syntax, values, and runtime types

### 1. JavaScript is multi-paradigm

JavaScript supports procedural code, object-oriented delegation, and functional composition in the same program. Calling it only object-oriented or only functional conceals useful parts of its design. “Object-centric” describes the reach of its object system without pretending that every value is an object.

### 2. The surface syntax is intentionally C-family

Blocks use braces, calls use parentheses, expressions use familiar arithmetic and comparison operators, and control flow includes `if`, `for`, `while`, and `switch`. This familiarity lowers the cost of reading basic control flow.

### 3. Familiar syntax does not imply C semantics

JavaScript is dynamically typed, garbage-collected, and prototype-based. Variables do not declare fixed value types; objects are not C structs; functions are values; and method lookup can continue through a prototype chain. Read runtime rules rather than guessing from punctuation.

### 4. A name can refer to values of different types

```js
let estimate = 3;
estimate = "three";
```

`estimate` is the name (or identifier) in the source code. Its declaration creates a binding: during execution, that name refers first to the number `3` and then to the string `"three"`. JavaScript does not attach one permanent type to the name; each value has a type. While reading code, you may know the exact value and type, know only the possible type or types, or not know either until runtime. If a `let` declaration has no initializer, its value is `undefined` after initialization; reading it before initialization throws. JavaScript's `Symbol` is a primitive value type, not another word for a variable name.

### 5. Modern JavaScript has seven primitive types

The primitive types are `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`. These are distinct kinds of values with distinct jobs: text, ordinary and large numeric values, truth values, an unassigned value, a unique symbol, and an intentional absence. We need all seven in the model now: for example, `0`, `"0"`, `false`, `null`, and `undefined` are not interchangeable, even when coercion makes some expressions treat them similarly. `===` compares primitive values by value; when it compares objects, it compares identity.

### 6. Primitives are not objects

Primitive values are not objects and cannot hold mutable properties. Yet `"web".toUpperCase()` works: JavaScript temporarily provides the string's wrapper behavior for the property access and method call. This automatic boxing does not change the string into an object, and it does not give the primitive persistent property storage. `null` and `undefined` have no such wrapper behavior, so property access on either throws.

### 7. `typeof` is useful but not a complete classifier

Arrays are objects, so `typeof []` is `"object"`; callable functions report `"function"`. The historical `typeof null === "object"` result is the misleading exception. Use `value === null` for null and `Array.isArray(value)` for arrays. `value instanceof SomeClass` asks whether `SomeClass.prototype` occurs in that value's prototype chain; it can distinguish instances of a class, but it is not a universal type test (for example, it can fail across separate JavaScript realms). Choose the check that answers the actual question.

### 8. Objects are referenced collections of properties

An object is a value with identity and properties: each property associates a string or symbol key with a value. A variable holding an object holds a reference to it, so assigning that value to another variable creates another way to reach the same object. Property values can be any JavaScript values, including functions. JavaScript has first-class functions, so a function stored on an object is commonly called a method. Arrays, dates, maps, and other built-in objects add specialized behavior to this same object model.

### 9. Functions are callable values

A function can be assigned to a binding, stored in an object, placed in an array, passed as an argument, and returned from another function. Callability is an additional capability, not a separate universe disconnected from objects.

### 10. Worked example — JavaScript language shape

Run [JavaScript language shape](examples/01-language-shape/):

```bash
node lectures/02-javascript/en/examples/01-language-shape/example.js
```

Use the table to distinguish the language's actual primitive/object model from the incomplete output of `typeof`. Then identify the function passed through `apply`.

### 11. `const` and `let` control bindings

`const` prevents rebinding; it does not freeze an object. Use `let` for a binding that genuinely changes and keep its scope narrow. Avoid `var` in new course code because its function scope and hoisting rules add no value to the standard baseline.

### 12. Coercion is a runtime rule, not validation

Conversion changes a value from one type to another, such as `Number("12")` producing `12`. Coercion is conversion JavaScript performs as part of another operation. JavaScript is notably willing to coerce implicitly: `0 == false` is true, and `"5" + 1` produces the string `"51"`. `Boolean("false")` also produces `true` because every non-empty string is truthy. Use explicit conversion when that is the intended operation, and choose deliberately whether an operation should allow implicit coercion.

## Intermezzo 1 — language shape and values

Use questions prefixed `u02-i1-` from [intermezzo.gift](intermezzo.gift). Allow four minutes, then correct the statement “everything in JavaScript is an object.”

## Concept block 2 — objects, prototypes, identity, and copies

### 13. Objects associate property keys with values

Property keys are strings or symbols. Dot syntax is convenient for fixed identifier-like names; bracket syntax evaluates a key expression. Reading a property and owning that property are different claims.

### 14. Lookup begins with own properties

`Object.hasOwn(value, key)` asks whether the receiver itself contains a property. It does not report inherited properties. This distinction matters for defaults, serialization, untrusted input, and review of generated object traversal.

### 15. Missing lookup delegates to a prototype

When an own property is absent, JavaScript follows the object's internal prototype link and repeats the lookup. The process continues until a property is found or the chain ends at `null`, producing `undefined`.

### 16. Prototypical inheritance is delegation

An object does not need a class declaration to inherit behavior. It can delegate lookup to another object. This differs from the class-first inheritance model common in Java, C#, and similar mainstream languages.

### 17. Worked example — prototype property lookup

Run [prototype property lookup](examples/02-prototype-lookup/):

```bash
node lectures/02-javascript/en/examples/02-prototype-lookup/example.js
```

Trace `id`, `priority`, `describe`, and `missing` from the receiver outward. Use `Object.hasOwn` and `Object.getPrototypeOf` as evidence rather than relying on the returned value alone.

### 18. Assignment can shadow an inherited property

Assigning `task.priority = "urgent"` normally creates or updates an own property. It does not rewrite the prototype's `priority`. Deleting the own property reveals the inherited value again.

### 19. Method calls bind a receiver

In `task.describe()`, lookup finds a function and the call supplies `task` as `this`. Extracting the function and calling it separately can lose that receiver. Arrow functions do not create their own dynamic `this`; choose them for lexical capture, not as a universal method syntax.

### 20. `class` syntax uses prototypes

Methods declared in a class body are normally stored on `Constructor.prototype` and shared by instances. Classes add useful construction and inheritance syntax, but they do not replace JavaScript's prototype lookup mechanism.

### 21. Do not mutate built-in prototypes

Understanding prototypes is required for reading the language. Extending `Array.prototype` changes behavior for every array in the current realm; another library may use the same property name or rely on the standard behavior. Changing an object's prototype at runtime also makes lookup harder to follow. Avoid these changes in ordinary application code unless you are deliberately implementing and testing something like a polyfill; this is a general maintainability rule, not a special course convention.

### 22. Object assignment creates an alias

Two bindings can refer to one object. Mutating through either reference changes that shared object. By contrast, two separately created equal-looking object literals have distinct identities.

### 23. Spread, freezing, sealing, and deep copying do different jobs

Array or object spread creates one new container level. Nested objects remain shared unless the changed path is copied too. Destructuring selects local values; it does not copy them.

`Object.freeze(value)` prevents adding or removing own properties and changing the values of existing own data properties. `Object.seal(value)` prevents adding or removing own properties and changing their descriptors, but existing writable data properties can still be assigned new values. Both operations are shallow: a nested object can still be changed. Neither creates a copy, so every alias to that object sees the same restrictions.

A deep copy creates new objects throughout a nested structure, so changes to copied nested objects do not affect the original. It must account for cycles and shared references, and what it can copy depends on the chosen method. `structuredClone(value)` handles many built-in data types and cycles, but cannot clone functions and does not preserve custom class behavior. Choose copying when independent data is needed; choose `freeze` or `seal` when restricting changes to the existing object is the goal.

### 24. Worked example — identity, aliases, and shallow copies

Run [identity, aliases, and shallow copies](examples/03-identity-shallow-copy/):

```bash
node lectures/02-javascript/en/examples/03-identity-shallow-copy/example.js
```

Draw the referenced containers before reading the assertions. This identity model prepares later immutable React state updates without introducing React early.

## Intermezzo 2 — prototype and identity traces

Use questions prefixed `u02-i2-` from [intermezzo.gift](intermezzo.gift). Allow four minutes, then draw both the prototype lookup chain and the nested-object reference graph.

## Concept block 3 — functional core, closures, pipelines, and audit

### 25. Functions are values: this is what “first-class” means

JavaScript functions are callable objects, and the language lets us use them as values: assign one to a variable, store one in an object, pass one to another function, or return one from a function. Calling functions “first-class” means they can be used in these ordinary value positions. A higher-order function is a function that accepts another function, returns one, or both. Array methods, event registration, middleware, and many web APIs use this ability.

### 26. Arrow and regular functions overlap but differ

Both forms create function values. In a regular function, `this` is usually determined by how the function is called: `task.describe()` calls it with `task` as `this`, while extracting `task.describe` and calling the extracted function does not preserve `task` as its receiver. This call-dependent `this` is the dynamic method receiver. Arrow functions instead capture `this` from the surrounding scope and cannot be constructors. Select the form whose `this` and construction behavior matches the job.

### 27. Lexical scope enables closures

A function resolves surrounding names where it was created. If it uses a name from that surrounding scope, the function retains access to the needed lexical environment even after the outer function call has finished. That function together with its retained environment is a closure; it can keep behavior and state together.

### 28. A closure keeps behavior together with captured state

A closure is a language mechanism, not a workaround for a missing feature. For example, a function can create a counter and return a function that increments it. The returned function still has access to the counter after the creating function has finished, while other code cannot access that local variable directly. Closures are useful for keeping behavior and state together; when the captured state can change, be clear about its lifetime and who can change it.

### 29. Collection methods are higher-order functions

- `filter` selects zero or more original elements;
- `map` produces one output for each input;
- `reduce` combines a collection into an accumulator;
- `some` and `every` reduce a collection to a boolean.

Their callbacks are ordinary function values supplied by the caller.

### 30. Follow what each pipeline stage receives and returns

For each stage, ask what goes in, what operation happens, and what comes out. In `Task[] → selected Task[] → EstimateView[] → number`, `filter` keeps tasks that pass a test, `map` turns each selected task into an estimate view, and `reduce` combines those views into one number. Naming an intermediate result, such as `selectedTasks`, makes it easier to inspect the data at that point. Destructuring shows which properties a stage reads; rest and spread collect or copy properties. These are practical ways to follow data, not a demand to add explicit types everywhere.

### 31. `reduce` needs a starting value and a next-value expression

`reduce` starts with an initial accumulator value. For each element, its callback computes the next accumulator from the current accumulator and that element, just as `map` uses an expression to compute an output for each input. For example, summing prices starts at `0`; on each step the next accumulator is `sum + price`. The initial value also gives an empty array a defined result. If the data contains a string instead of a number, `+` may concatenate rather than add, so inspect or convert the input deliberately.

### 32. Worked example — higher-order pipeline and closure

Run [higher-order pipeline and closure](examples/04-higher-order-pipeline/):

```bash
node lectures/02-javascript/en/examples/04-higher-order-pipeline/example.js
```

Separate configuration time from evaluation time, then name the input and output shape of every collection stage.

### 33. A functional core makes transitions inspectable

Small functions that return results from explicit inputs are easy to compose and test. JavaScript does not enforce purity: functions can mutate objects, close over state, perform I/O, or depend on time. Treat purity as a useful design property, not a language guarantee.

### 34. Audit generated code with counterexamples

Start from accepted input types and output shape. Supply values such as `"false"` beside `false`, a string beside a number, empty collections, shared nested objects, and missing properties. A familiar method chain is not evidence that its contracts hold.

### 35. Preserve precise failures until policy is known

Low-level code can throw when it cannot satisfy its contract. Catch at the boundary that knows whether to retry, skip, report, or stop. A broad catch returning a plausible default destroys the distinction between invalid data and a valid result.

### 36. Worked example — three JavaScript runtime pitfalls

Run [three JavaScript runtime pitfalls](examples/05-runtime-pitfalls/):

```bash
node lectures/02-javascript/en/examples/05-runtime-pitfalls/example.js
```

Before running it, predict the coercion result, both defaulting results, and what happens when an own `describe` property hides the inherited method. Finally, compare malformed JSON with a valid zero estimate and explain what the `catch` hides.

### 37. Read unfamiliar code from boundaries inward

```text
entry point
→ accepted value types and shapes
→ property lookup and shared identities
→ callbacks and captured bindings
→ mutations and other effects
→ output shape
→ failure ownership
```

Do not read every helper in file order before locating the observable path.

### 38. Turn assumptions into focused checks

Use counterexamples that can disprove the implementation: mixed primitive types for coercion, own versus inherited properties for lookup, identity assertions for copies, empty arrays for reducers, invalid closure configuration, and distinct failures for catch boundaries. Inspect generated diffs semantically and run the evidence yourself.

## Intermezzo 3 — functions, closures, and audit

Use questions prefixed `u02-i3-` from [intermezzo.gift](intermezzo.gift). Allow four minutes, then trace one function from creation through capture, passage as an argument, and invocation.

## Synthesis — one language, several reading lenses

| Lens | Question |
| --- | --- |
| Value | Which primitive or object values can reach this expression? |
| Property | Is the value own, inherited, shadowed, or missing? |
| Identity | Which bindings share an object? |
| Function | Where was it created, passed, and called, and what does it capture? |
| Shape | What collection or record shape enters and leaves each stage? |
| Effect | What can mutate, throw, or otherwise escape the function? |

JavaScript's C-family appearance helps with initial parsing. Its dynamic values, prototype delegation, object identity, and first-class functions determine what the program actually does.

## Common failure modes

- Saying “everything is an object” and then mishandling primitives or `null`.
- Treating `typeof` as a complete runtime classifier.
- Assuming class syntax replaces prototypes.
- Confusing an inherited property with an own property.
- Modifying built-in prototypes because prototype delegation exists.
- Assuming `const` freezes an object or spread deep-copies it.
- Losing a method receiver when extracting a regular function.
- Treating truthiness or conversion as validation.
- Omitting a reducer's initial value for possibly empty input.
- Trusting a compact generated pipeline without counterexamples.
- Catching every exception and returning a misleading default.

## Relation to the tutorial

Dataset Transformer applies runtime boundary checks and named higher-order pipeline stages. Rule Engine builds composable predicates and transformations from first-class functions and closures. Generated-Code Audit uses type, property, identity, function, shape, and effect lenses to find coercion and mutation defects. Prototype lookup remains a lecture foundation rather than becoming a prototype-modification tutorial.

## Relation to adjacent lectures

Lecture 01 supplied JSON representations and small verification scripts whose JavaScript can now be read more deliberately. Lecture 03 adds modules and asynchronous scheduling to this synchronous language foundation. It owns promises, `async`/`await`, events, `fetch`, and failure across asynchronous boundaries; none of those mechanisms is required here.

## AI-assisted development considerations

Ask an agent to classify values, trace prototype lookup, draw object identities, and name callback inputs/outputs before modifying unfamiliar code. Request counterexamples capable of disproving its interpretation. After a change, inspect the diff, run the checks, and explain the relevant runtime mechanism without relying on the prompt.

## References

- Course migration map, Unit 02.
- `webtech-2025-course/c2/`.
- `webTechTutorials-main/S01/` and `S02/`.
- MDN JavaScript Guide: grammar, types, objects, prototype inheritance, functions, closures, arrays, and error handling.
- ECMAScript language specification sections on types, objects, and ordinary property lookup.
- Node.js assertion and test-runner documentation.
