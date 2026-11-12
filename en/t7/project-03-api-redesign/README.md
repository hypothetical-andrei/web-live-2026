# Project 03 — Registration API Redesign

## What you need to do

Replace the action-based registration routes with the specified resource URLs. Validate filters and pagination, and make repeated membership requests produce the required stable result.

Work in `student/`. Change only `src/registration-router.js`.

## How to work

Inventory the unmounted naive action routes, then inspect the supplied service outcomes, app mount, errors, and checks. Write a method–URL–input–status table before requesting changes.

Give Codex the task from `spec.md`. Reject action aliases, identity accepted from bodies, arbitrary query passthrough, service-outcome leakage, ORM dependencies, remounting, or edits outside the router.

## Check your result

- All categorized project checks and the dependency audit pass.
- The inventory contains only GET collection, PUT member, and DELETE member.
- Closed filter/page validation rejects invalid input before service calls.
- Created/repeated/updated PUT and repeated DELETE expose exact statuses, location, and envelopes.
- Domain failures are stable and unexpected failures remain sanitized centrally.

## Debugging task

Repeat the same member PUT after treating its first response as lost. Check that only one registration exists and its registeredAt is unchanged. Repeat DELETE and check the absent state. Explain why response statuses may differ while the intended resource state stays the same.

## What you should be able to explain

- Why the path expresses registration identity.
- How PUT and DELETE support retries.
- Why query strings need a closed grammar and deterministic page order.
- When nested scope helps and when a top-level resource might be clearer.
