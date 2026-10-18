# Lecture Example — Request/response anatomy and header extension

## Concept demonstrated

An HTTP exchange contains two distinct messages, and optional headers can extend their metadata without changing the simpler status-and-representation contract.

## Why this example is in the lecture

The compact trace makes the client/server boundary visible. The runnable page then exposes the same facts in browser DevTools and compares a client that ignores an optional field with one that uses it.

## What to observe

- The method and request `Content-Type` belong to the request.
- The status and `Location` belong to the response.
- Both clients use the response body; only the newer client uses `Example-Trace-Id`.
- Ignoring an optional unknown field preserves the simpler exchange, but required semantics cannot safely depend on an unknown field.
- Both messages can carry JSON, but the bodies have different roles.

## Run / inspect

First read [`exchange.http`](exchange.http) from each start line toward its body. Then start the local target:

```bash
node server.mjs
```

Open the printed URL, open DevTools **Network**, clear existing entries, and select **Run exchanges**. Inspect the `GET` and `POST` entries using the sequence in the lecture. The page deliberately shows the body-only client and the header-aware client separately.

Run the automated observable check with:

```bash
node verify.mjs
```

## Explanation

The client submits a JSON representation to the collection resource. The server reports successful creation with `201 Created`, identifies the new resource with `Location`, and returns its representation. `Example-Trace-Id` adds optional correlation metadata. A client that knows only the status, media type, and body still completes its simpler job.

## Variations

- Change the request to `GET` and identify which body-related fields would disappear.
- Replace `201` with `200` and discuss what meaning is lost.
- Remove the trace field and confirm that the body-only client continues to work.
- Pretend the body cannot be interpreted without the trace field and explain why the field is no longer a compatible optional extension.

## Validation

Validated with `node verify.mjs`: retrieval and creation statuses, media types, locations, trace fields, and JSON representations are checked through the live HTTP boundary. The static trace was also checked for internally consistent message syntax and body lengths.
