# Example 5b — Generate OpenAPI and interface artifacts

## Concept demonstrated

Use one Joi request schema for runtime validation and OpenAPI generation. A shared operation definition supplies the method, path, operation ID and response choices. Generate a specification, an interactive Swagger UI page and a small JavaScript client from that description.

## Why this example follows example 05

Example 05 deliberately maintains openapi.json by hand. This optional variant shows what generation can remove and what you still have to declare. It is a companion demonstration, not an additional required topic in the 100-minute lecture.

## Run / inspect

```bash
npm ci
npm run generate
npm test
npm start
```

Open http://127.0.0.1:3000/docs/. Expand POST /api/tasks, choose **Try it out**, edit the JSON title, then **Execute**. Observe the actual response status, Location header and trimmed title. Use `PORT=3001 npm start` for another port. Stop with Ctrl+C.

`npm start` and `npm test` regenerate the artifacts automatically through their pre-scripts. `npm run generate` exports them without starting a server.

| Artifact | Location | Purpose |
| --- | --- | --- |
| Generated OpenAPI | generated/openapi.json, served at /openapi.json | Import into external documentation or API tools. |
| Generated interface page | generated/index.html, served at /docs/ | Swagger UI renders inputs and responses from the generated specification. Its JS/CSS assets are served locally from the locked swagger-ui-dist package. |
| Generated JavaScript client | generated/client.js, served at /client.js | A native-fetch createTask function generated from this operation's method, path and operationId. |

You can also use the generated client from another module:

```js
import { createTask } from "./generated/client.js";
const result = await createTask({ title: "  Review notes  " }, "http://127.0.0.1:3000");
console.log(result.data.title);
```

## Follow the generation

1. schemas.js defines Joi data shapes. The nonblank rule is a regular-expression rule that the converter can represent. Trimming remains explicit server behavior, described in the schema text.
2. operation.js names the POST operation, success status and known failures. app.js uses those same values to register the route and choose statuses.
3. openapi.js uses joi-to-swagger to convert data shapes, then assembles the HTTP metadata. It publishes OpenAPI 3.0.3 because this converter produces 3.0 schemas; example 05's handwritten file uses 3.1.1.
4. generate.js writes the three artifacts. The running /openapi.json endpoint builds the description from the same source definitions rather than reading a manually maintained file.
5. Swagger UI reads that description to render the browser interface. The client template reads the assembled operation instead of repeating its URL in a hand-authored client.

Change a Joi rule, regenerate, and inspect the schema and browser interface. The tests demonstrate a changed title-length rule and an added integer field without editing OpenAPI properties separately. Edit source definitions, not generated files.

## Limits

Generation does not inspect arbitrary Express control flow, discover undocumented statuses, or understand arbitrary Joi custom functions. Route metadata and response schemas still need deliberate declarations. Response schemas describe outputs; no automatic response-validation middleware is installed. Runtime input validation remains Joi's job.

The client generator is intentionally a small template for this one JSON POST operation, not a general OpenAPI SDK generator. It produces JavaScript, not TypeScript interfaces. The Swagger page is a generated HTML entry point whose local vendor assets are supplied by npm; it is not a standalone vendor bundle. Neither the documentation nor client generation implements storage: like example 05, the API returns a demonstration task with a fixed ID and has no follow-up GET.

## Validation

Clean installation, generation and both tests pass on Node 24.5.0. Checks compare generated and published specs, exercise runtime failures, load local interface assets, and call the generated client against a real HTTP server. Browser validation also opens Swagger UI, executes the POST through Try it out and imports the generated client in Chrome. See the unit audit for the dated authoring record.

Generator references: [joi-to-swagger](https://github.com/Twipped/joi-to-swagger), [Swagger UI distribution](https://github.com/swagger-api/swagger-ui/tree/main/swagger-ui-dist-package).
