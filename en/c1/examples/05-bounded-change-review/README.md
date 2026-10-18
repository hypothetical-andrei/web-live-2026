# Lecture Example — AI-assisted verification workflow

## Concept demonstrated

An AI agent can clarify unfamiliar tooling, propose a focused HTTP verification script, and implement a bounded repair, while the student remains responsible for inspecting and challenging every artifact.

## Why this example is in the lecture

It supplies a concrete sequence and a real public-boundary check instead of treating AI output or a reported passing test as evidence by itself.

## What to observe

- Tool clarification happens before edits and points the student toward observable evidence.
- The verification script sends a real request rather than copying server constants.
- Changing the creation status from `201` to `200` makes the focused check fail.
- A passing check and an authorized diff are separate acceptance requirements.

## Run / inspect

Use this sequence when working with an agent:

1. **Inspect:** ask it to locate the documented start command, test command, entry point, and existing checks without editing files.
2. **Clarify tooling:** ask for the exact DevTools panels and `curl` flags that expose the required request and response facts.
3. **State the contract:** name the method, target, expected status, required fields, representation, and at least one failure case.
4. **Request one check:** permit only a small verification file, built-in Node APIs, and no application changes.
5. **Inspect the check:** confirm that it exercises the public HTTP boundary and does not reproduce implementation constants.
6. **Prove sensitivity:** temporarily introduce the defect the check claims to detect and verify that it fails for that reason; then restore the canonical behavior.
7. **Request the repair:** constrain the implementation files and state the focused and regression commands that define completion.
8. **Inspect the implementation diff:** reject unrelated edits, weakened checks, or new dependencies.
9. **Run the focused and regression checks yourself.**
10. **Verify independently:** repeat one important exchange with DevTools or `curl -i`.
11. **Explain acceptance:** identify the diff and runtime evidence that support the decision.

The repository already contains the kind of small script an agent may propose. Run it with:

```bash
node verify-http.mjs
```

## Explanation

`verify-http.mjs` starts the supplied server on an ephemeral loopback port, creates one note through HTTP, and independently checks `201`, `Location`, `Content-Type`, and the JSON representation. It imports only the server startup boundary; it does not read route constants or call the request handler directly.

The corresponding bounded request to an agent could be:

> Inspect `server.mjs` and its documented behavior without editing. Explain how a Node script can start it on an ephemeral port and observe creation through HTTP. Then add only `verify-http.mjs`, using built-in APIs and no dependencies. It must detect a wrong creation status, missing `Location`, incorrect media type, or incorrect JSON representation. Done when the new script passes against the canonical server. Show the diff and explain each assertion.

## Variations

- In `server.mjs`, temporarily change `201` to `200`; confirm that the focused check fails at the status assertion, then restore `201`.
- Ask an agent why importing and directly calling `createNote()` would provide weaker HTTP evidence.
- Propose an unrelated refactor and explain why a correct test does not authorize that additional scope.

## Validation

Validated with `node verify-http.mjs`; the check crosses a live loopback HTTP boundary and verifies the complete creation response contract. Sensitivity was confirmed by running the check against a temporary `200` creation defect and observing the intended status assertion fail before restoring `201`.
