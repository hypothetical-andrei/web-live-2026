# Project 02 — Transactional Booking

## What you need to do

Book seats in one database transaction. Update availability, create the booking, and record the audit entry together; undo all three if any step fails.

Work in `student/`. Change only `src/book-seats.js`.

## How to work

Run baseline evidence and record the unsafe state after its injected late failure. State the invariant, mark every read/write that participates, and distinguish pre-transaction validation from transactional work.

Give Codex the task from `spec.md`. Reject manual SQL, compensating writes, nested transactions, missing transaction options, broad error replacement, or edits outside the objective file.

## Check your result

- All categorized project checks and the dependency audit pass.
- Invalid, missing, sold-out, duplicate, callback-failure, and audit-failure paths preserve exact state.
- Every database operation receives the same managed transaction.
- Success returns detached data only after commit and later calls observe committed availability.
- Only unique races are translated; unexpected errors preserve identity.

## Debugging task

Remove the transaction option from audit creation and inject an audit failure. Compare state with the invariant, identify the escaped operation, and restore the shared boundary.

## What you should be able to explain

- Why sequential `await` is not atomicity.
- What belongs inside and outside the consistency boundary.
- How managed commit/rollback follows callback settlement.
- Why constraint races and unexpected failures need different handling.
