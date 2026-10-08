# Project 01 — HTTP Detective

## Objective

Build an evidence-based description of three real HTTP exchanges. You will distinguish what the client sends from what the server returns, and verify every claim with browser DevTools or `curl`.

Work in `student/`. The application is already complete; only `case-report.json` is incomplete.

## Mental model

An HTTP exchange has two directions:

```text
client -- method, URL, headers, optional body --> server
client <-- status, headers, optional body ------- server
```

The URL contains a pathname and may contain a query string. A content type is declared by a header; it is not established merely because a body looks like JSON or CSS.

## Investigate in the browser

1. In `student/`, run `npm install` and `npm start`.
2. Open the printed loopback URL.
3. Open the browser Network panel and clear earlier traffic.
4. Select **Run investigation**.
5. Inspect `detective.css`, `clues`, and `verdict` individually. Use the Headers, Payload, Preview, and Response views as evidence.
6. Fill the existing fields in `case-report.json`. Preserve the entry and field names.

Do not treat the page's rendered output as a substitute for the Network panel: it does not show every request and response property.

## Cross-check with curl

Use `curl -i` when response headers are enough. Use `curl -v` when you also need to see request headers. For the POST request, send the same JSON and content type that the browser module sends. Replace `<base-url>` with the URL printed by the server.

Compare the command-line evidence with the browser evidence before running `npm test`.

## Use Gemini as an investigation partner

Ask Gemini to inspect the project and validation output without editing files or deriving answers from server source. Request a checklist mapping each report field to its location in DevTools and `curl` output. After completing the report, ask it to review only your diff for assumptions that lack observed evidence.

You remain responsible for observing each value, reviewing the diff, and running the checks.

## Success criteria

- `npm run test:baseline` and `npm run test:regression` continue to pass.
- `npm run test:objective` and `npm test` pass after the report is complete.
- You can identify which side of the exchange supplies every recorded field.
- You can explain why declared content type and body representation are related but distinct.

## Debugging task

Temporarily change the verdict response's declared media type to `text/plain` without changing its JSON-looking body. Observe the mismatch, run the checks, and ask Gemini for a targeted one-line repair. Inspect that diff and verify the repaired header with both DevTools and `curl`. Restore canonical behavior before finishing.

## What you should be able to explain

- How method, pathname, query parameters, headers, status, and body combine into an HTTP exchange.
- Which properties belong to a request and which belong to a response.
- Why a successful transport response does not by itself prove an application is correct.
- Why an AI-generated claim about traffic needs independent runtime evidence.
