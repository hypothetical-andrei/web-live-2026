# Tutorial 07 — Teaching-text coherence review

Reviewed English and Romanian on 2026-10-11. Scope: guide, project instructions/specifications, checkpoints, and their agreement with supplied application behavior. This is not a new runtime-validation or full-course audit.

## Findings and corrections

- Projects 2 and 3 listed optional Project 1 as a prerequisite despite being on the required classroom path. Both now require the lecture concepts and supplied code inspection, without completion of Project 1.
- Switching PUT to POST alone would not change the supplied service's idempotent implementation. The investigation now repeats requests and examines state and timestamps.
- Resource identity from a URL was described as trusted context. Text now distinguishes identification from authorization.
- Project 3 did not explain relative router paths, total matching count, differing repeat-response statuses, or absent registrations versus absent parents. These are explicit in both editions.
- Romanian omitted the created PUT data wrapper, mixed third-person and direct address, and used inconsistent idempotency terminology. These passages were aligned.

## Confirmed scope and limits

The three projects are separate applications. Project 2 implementation and Project 3 investigation form the required 95-minute path; Projects 1 and 3 implementation remain follow-up work. SQLite rollback checks are not a claim of production concurrency safety. Nested URLs are an exercise choice, not a universal API requirement. Existing runnable code and tests were not changed.

## Remaining review

Human Romanian language review remains. Existing project validation records describe their prior implementation checks; this text review does not replace them.
