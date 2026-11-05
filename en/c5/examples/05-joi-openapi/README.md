# Lecture example — Joi validation and an OpenAPI operation

## Concept demonstrated

You can express the same input rules as manual checks, a Joi schema, and an OpenAPI description. Each serves a different purpose: runtime checks accept or reject a value; the description tells external tools how the HTTP operation works.

## Why this example is in the lecture

Compare the two small validators before introducing a schema library into a larger API. One title field keeps type checking, normalization, and unknown-field policy visible. The HTTP route returns a demonstration task with a fixed ID; it does not store it or offer a follow-up GET. Use example 03 for the creation/read/delete sequence.

## What to observe

- `convert: false` prevents automatic conversion. Normalization happens explicitly after checking the type.
- `required()` applies to both the object and its title. `unknown(false)` rejects extra fields.
- A whitespace-only string needs an explicit check after trimming; the Joi type check alone is insufficient.
- `openapi.json` describes POST, its input schema, success body, Location header, and possible errors. Publishing the file does not install validation.
- OpenAPI documents the non-whitespace rule and trimming. It does not make a generated client trim strings automatically.

## Run / inspect

From this example directory:

```bash
npm ci
npm test
npm start
```

Leave the server running. In another terminal:

```bash
curl -i -X POST http://127.0.0.1:3000/api/tasks -H 'Content-Type: application/json' -d '{"title":"  Review notes  "}'
curl -i -X POST http://127.0.0.1:3000/api/tasks -H 'Content-Type: application/json' -d '{"title":12}'
curl http://127.0.0.1:3000/openapi.json
```

Open the local `openapi.json` in an OpenAPI-capable editor or import it into a REST client. Find `operationId`, the required title, unknown-field policy, and 201 response. If you change PORT, update the description's server URL when trying requests from an external tool. Stop the server with Ctrl+C.

## Explanation

The media check runs before the JSON parser. The parser distinguishes invalid JSON and excessive size. The route checks the Joi result and builds a fresh application value. Only accepted values reach response construction. The manual validator is a comparison, not a second runtime gate.

## Variations

Predict what would happen if you changed `unknown(false)` to `unknown(true)` or normalized before checking the type. Change a rule and identify the corresponding OpenAPI description and test that must change.

## Validation

On 2026-10-26, clean `npm ci --offline --no-audit --no-fund` and `npm test` passed on Node 24.5.0. Tests compare both validators, check input non-mutation, then issue real HTTP requests for success, malformed JSON, invalid fields, unsupported media and excessive size. They also read the published description and check the relevant documented outcomes. These are focused consistency checks, not a general OpenAPI conformance suite.

For generated documentation and interface artifacts, continue with optional [example 5b](../05b-generated-openapi/).
