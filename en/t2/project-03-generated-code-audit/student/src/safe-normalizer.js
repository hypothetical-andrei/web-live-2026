import { unsafeNormalizeEvents } from './unsafe-generated.js';

export function normalizeEvents(events) {
  /*
   * TODO: replace the unsafe passthrough with the defensive boundary in
   * `spec.md`, while preserving `unsafe-generated.js` as audit evidence.
   *
   * Diagnose before editing. Run the comparison and focused checks, then ask AI
   * for an evidence table containing a concrete input, observed unsafe result,
   * violated JavaScript rule, and distinguishing check for every coercion,
   * inherited-property, mutation, aliasing, and ordering defect. Reproduce each
   * claim yourself; reject generic warnings without runtime evidence.
   *
   * Permit implementation only in this file. Required event data must be own
   * properties with exact types; output records and ordering must not alias or
   * mutate input. Reject changes to the unsafe artifact, fixtures, tests, or
   * dependencies. Inspect the diff and rerun the comparison plus all checks.
   */
  return unsafeNormalizeEvents(events);
}

export function summarizeEvents(events) {
  /*
   * TODO: summarize already-normalized values under the exact numeric/boolean
   * contract. Before editing, ask AI to trace the accumulator type and source
   * collection. After editing, challenge the result with the supplied mixed-type
   * evidence and verify that no conversion hides invalid upstream data.
   */
  void events;
  return { activeCount: 0, totalDurationMs: 0 };
}
