# Lecture Example — Three JavaScript runtime pitfalls

## Concept demonstrated

This compact walkthrough separates three mechanisms that can make plausible code behave unexpectedly:

- truthiness and implicit coercion in a filter and reduction;
- `||` treating the valid number `0` as a request for a default;
- an own property hiding an inherited method with the same name.
- a broad `catch` making malformed JSON look like a valid zero estimate.

## What to predict

Before running the code, predict which rows pass and what type the total has. Then predict both limit results. Follow `describe` from the prototype to the task, and predict what assigning a string to `task.describe` changes. Finally, compare the result for a valid zero estimate with the result for malformed JSON: what information does the catch remove?

## Run

```bash
node example.js
```

## Explanation

`"false"` is a non-empty string, so it passes the truthiness filter. Adding the selected string estimate changes `+` from numeric addition to concatenation, producing the string `"035"`. `configuredLimit || 10` produces `10` because `0` is falsy; `configuredLimit ?? 10` keeps `0` because it only uses the default for `null` or `undefined`. The task first finds `describe` on its prototype. Assigning its own `describe` property hides that function, so the property is now a string and cannot be called as a function. The broad `catch` also turns malformed JSON into the same `0` result as a valid zero estimate, hiding the parse failure.

## Classroom use

Pause after each prediction and ask students to trace the operation that determines the output. The program shows the evidence but does not audit, validate, or repair the inputs.
