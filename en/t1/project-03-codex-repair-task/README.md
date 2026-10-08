# Project 03 — Codex Repair Task

## Objective

Inspect three different HTTP defect categories while repairing two bounded
files. The service is deliberately runnable but wrong in specific ways:

- one endpoint returns the right clue data but the wrong `Content-Type`;
- one validation branch starts an error response and then crashes because it
  keeps going after headers were sent;
- one endpoint returns the wrong missing-resource contract and must be
  normalized.

Your job is diagnosis, targeted repair, and independent verification.

## Read before changing

Run baseline, objective, and regression checks separately in `student/`. Then
inspect:

- `legacy-result.js`, which intentionally preserves naive legacy descriptors;
- `normalize-contract.js`, which should adapt bounded legacy cases;
- `server.js`, where the invalid-create branch must stop after one send;
- focused test failures and live responses.

Write down the observed status, content type, relevant headers, and body shape
for list, invalid create, create success, and missing lookup. Compare those
observations with `spec.md` before involving Codex.

## Use Codex for a bounded repair

Give Codex the goal, named files, two-file constraint, and observable “done
when” from `spec.md`. Ask it to classify the defects before editing:

- header/content-type defect;
- control-flow-after-send defect;
- normalization/body-shape defect.

Reject changes to the legacy producer, tests, or route set and reject a broad
rewrite.

Inspect the resulting diff. A small repair is easier to defend than a
regenerated service, but small does not automatically mean correct: run focused
and aggregate checks and verify the list, invalid-create, and missing responses
with `curl -i`.

## Why these boundaries are useful

Not every bug belongs in the same place. Sometimes the data is already right
and only the public header is wrong. Sometimes the contract needs normalization
at the boundary. Sometimes the problem is control flow after a response has
already been sent. This project is about identifying those boundaries instead
of treating every failure as “rewrite the endpoint.”

## Success criteria

- Baseline and regression checks remain green before the repair.
- All four objective checks pass.
- The diff touches only `src/server.js` and `src/normalize-contract.js`.
- List returns JSON content type without changing the clue payload.
- Invalid create returns `422` and does not break a subsequent health request.
- Missing lookup returns `404` and the course error envelope.
- You can explain which fix belongs to headers, control flow, and normalization.

## Extension task

Write a failing test for a delete operation that must return `204 No Content`.
Ask Codex for the smallest consistent extension. Review it carefully: a `204`
response must not include a JSON body. Keep this experiment separate from the
canonical completed exercise.

## What you should be able to explain

- Why correct data can still be part of a broken HTTP response.
- Why sending a response is also a control-flow boundary.
- How a public error envelope differs from a legacy internal result.
- Why contract tests are stronger evidence than code appearance.
- How constraints prevent an AI repair from becoming an uncontrolled rewrite.
