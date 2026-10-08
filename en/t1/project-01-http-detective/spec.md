# Exercise Specification — HTTP Detective

## Unit
Unit 01 — The Web as a System + AI-Assisted Development

## Learning objective
Inspect real browser and command-line HTTP traffic and produce an evidence-based report that correctly identifies each exchange's request method, resource URL components, response status, content type, and body representation.

## Why this exercise exists
Students need a concrete request/response mental model before they build an HTTP server or use a framework. A small local investigation target makes the traffic deterministic and safe to inspect while requiring students to verify claims in browser DevTools and with `curl` rather than trusting generated explanations.

## Prerequisites
- Ability to run documented npm scripts from a terminal.
- Basic familiarity with JSON objects and arrays.
- A browser with network developer tools.
- `curl` available at the command line.
- No prior server-side JavaScript or Express knowledge is required.

## Starting context
The future reference project must be an intentionally small Node.js ESM project with no runtime dependencies. It must provide:

- a supplied local investigation server that starts on an available loopback port and prints the exact base URL;
- a supplied browser page at `/` with a **Run investigation** control;
- supplied browser code that makes the three requests listed below and displays their response bodies, but does not explain the exchanges;
- a `case-report.json` file containing the investigation report;
- a report-validation script runnable through `npm test`;
- a short README containing start, browser-inspection, `curl`, and test commands, without disclosing the completed observations.

The server and browser request code are baseline infrastructure. Students inspect them and their observable traffic; they do not implement or modify the server in this exercise.

The investigation must use these exchanges, all relative to the printed local base URL:

1. `GET /assets/detective.css` returns CSS with status `200` and a CSS content type.
2. `GET /api/clues?case=missing-cookie` returns JSON with status `200`, an `X-Case-Id` response header, and a JSON body containing the requested case identifier and a small clue list.
3. `POST /api/verdicts` with a JSON body containing `caseId` and `verdict` returns JSON with status `201`, a `Location` response header naming the created verdict resource, and a JSON body that represents the created verdict.

The browser must initiate all three exchanges after the student opens DevTools and activates **Run investigation**, so they appear together in the Network panel. The investigation server may expose only the routes needed for the page, its browser assets, and these exchanges.

## Required behavior
- `case-report.json` contains one entry for each of the three named exchanges: `stylesheet`, `clues`, and `verdict`.
- Each entry records:
  - request method;
  - pathname;
  - query parameters as an object (empty when none);
  - request body media type, or `null` when no request body is sent;
  - response status code;
  - normalized response media type without charset parameters;
  - response body representation as exactly one of `text` or `json`.
- The `clues` entry additionally records the observed `X-Case-Id` value.
- The `verdict` entry additionally records the observed `Location` value.
- Report values must be observations of the running application, not copied constants imported from server code.
- `npm test` starts the investigation target on an ephemeral port, performs equivalent requests, and compares the submitted report with live HTTP observations.
- On a mismatch, validation identifies the exchange and field that disagree without printing a complete correct report.
- The browser page remains usable and all three requests still succeed after the report is completed.

## Constraints
- Use JavaScript, ECMAScript modules, Node.js LTS, native `fetch`, and Node's built-in test runner.
- Use Node's built-in HTTP facilities for the supplied investigation target; Express belongs to a later unit.
- Bind the server to loopback only and support an OS-assigned port for automated checks.
- Do not depend on internet access, third-party APIs, browser extensions, or external services.
- Do not add runtime or test dependencies merely to inspect HTTP.
- Treat header names case-insensitively and compare media types without optional charset parameters.
- Do not require students to edit the supplied server or browser request code.
- Keep the important server, browser-request, report, and validation code paths small enough to inspect during one tutorial.

## Observable completion criteria
- In browser DevTools, activating **Run investigation** visibly produces the stylesheet, clues, and verdict requests with the specified methods and successful status codes.
- Equivalent `curl` commands expose the same statuses, relevant headers, and body representations.
- `case-report.json` has no placeholders and describes all three live exchanges accurately.
- `npm test` exits with status `0` and reports that all baseline, objective, and regression checks pass.
- A student can point to DevTools or `curl` evidence for every value in the report and explain the distinction between a request and its response.

## Validation plan

### Baseline checks
- The project uses ESM and installs reproducibly from its lock file without third-party runtime packages.
- The server can bind to an ephemeral loopback port and serves the investigation page and browser assets.
- Each of the three investigation endpoints is reachable and returns a response; these checks do not depend on `case-report.json`.
- The browser request module contains and invokes all three supplied requests.

### Objective checks
- A validator makes live requests to the ephemeral server and derives the observed method, pathname, query, request media type, status, response media type, body representation, and relevant header values.
- The validator compares those observations field by field with `case-report.json` for `stylesheet`, `clues`, and `verdict`.
- The validator fails for missing entries, placeholder or extra fields, wrong value types, incorrect values, or confusion between request and response properties.
- Failure output names only the mismatching exchange and field plus the submitted value; it does not reveal the expected value.

### Regression checks
- The clues response still associates its JSON payload and `X-Case-Id` header with the requested `case=missing-cookie` query value.
- The verdict response still represents the submitted verdict, returns `201`, and supplies a `Location` that identifies the created resource.
- The stylesheet response remains CSS text and the browser page continues to load it.
- Unknown paths return a non-success status and do not crash the server.

## Intended student work
After the reference has passed validation, create the student version by replacing only the completed observation values in `case-report.json` with explicit placeholders while preserving its three-entry structure and field names. Do not remove or alter the server, browser page, request code, validator, scripts, fixtures, or documentation.

The student's sole implementation responsibility is to inspect the live exchanges and replace every report placeholder with the observed value. Baseline and regression checks must continue to pass in the derived student version; objective checks must fail field by field until the report is accurate. The reference report is the canonical completed artifact, and no duplicate completed report may remain in the student tree.

## Gemini task
The student should first inspect the repository and run the application. They may then give Gemini this bounded task:

> Read the project structure, `case-report.json`, and the validation failure output. Do not edit files yet and do not infer the answers from server source. Give me a concise investigation checklist showing where each required report field can be observed in browser DevTools and in `curl -i` or `curl -v` output. Flag any field that needs evidence from the request rather than the response. Done when I can collect every value independently.

After filling the report, the student asks Gemini to review only the report diff for unsupported assumptions, then runs `npm test` and verifies any proposed correction against the actual traffic before accepting it.

## Debugging / extension task
- Deliberately change the `verdict` response media type in the supplied server to `text/plain` while leaving its JSON-looking body unchanged. Use the failing check, DevTools, and `curl` to diagnose why body appearance does not determine the declared content type. Ask Gemini for a targeted one-line repair, inspect the diff, rerun the checks, and explain the evidence that confirms the repair. Restore the canonical behavior before finishing.

## Out of scope
- Implementing an HTTP server or routes as student work.
- Express, REST CRUD design, persistence, authentication, CORS, proxies, caching, redirects, or deployment.
- Packet capture, TLS internals, HTTP/2 or HTTP/3 framing, and browser automation.
- General JavaScript syntax instruction beyond reading the small supplied project.
- Accepting a Gemini-generated report without independently observing and verifying the traffic.
