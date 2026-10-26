# Project 03 — Meeting API Repair

## What you need to do

Repair the meeting API so every request gets the documented response. Correct status codes, response bodies, validation, and error handling without changing the data store.

Work in `student/`. Change only `src/meeting-router.js`.

## Goal

Repair four observable defects in ordinary Express handlers. You have received a runnable API, not an empty router. Edit only `student/src/meeting-router.js`.

## Inspect the starting behavior

Start the student project with `npm start` and use the printed base URL. The in-memory store resets on restart. `m1` is pending; `m2` is already accepted.

| Request | What to inspect |
| --- | --- |
| `GET /api/meetings/absent` | Does every branch finish the response? Use `curl --max-time 2` so your investigation does not wait indefinitely. |
| `POST /api/meetings/m2/accept` | Does the status class agree with the failed operation, or does it tell a client the operation succeeded? |
| `GET /api/meetings/m1` | Compare the outer JSON structure with listing and successful acceptance. |
| `GET /api/meetings?sort=title&order=desc` | Compare the requested direction with the returned titles, then repeat with `order=asc`. |

Quote URLs containing `&` in shell commands. Inspect both status and body, using `curl -i` or native fetch. A timeout does not prove that the API returned an error response: it means the client stopped waiting.

## Diagnose, then repair

Build a table with request, expected behavior, observed behavior, and responsible execution path. Read the supplied store and app to understand what they already do. Give Codex the focused task in `spec.md`, together with your HTTP evidence. Review the proposed diff; keep the changes in the router and preserve the tests.

Run baseline, regression, and objective checks. The starter has four failing objective tests; each should pass after its corresponding defect is repaired. Verify the endpoints yourself as well. Accepting `m1` changes its state, so restart before repeating that experiment.

## Done when

- An absent meeting produces a response rather than leaving a request pending.
- An already accepted invitation returns a client-error status class.
- Successful list, detail, and acceptance responses consistently use `data`.
- Ascending and descending requests produce the specified ordering without changing stored order.
- All checks pass, and only `src/meeting-router.js` differs from your starting project.

## Explain afterward

Trace the missing-meeting branch, explain why a failure body with a success status misleads a client, describe the response shape expected by callers, and show where query parameters affect the returned representation.
