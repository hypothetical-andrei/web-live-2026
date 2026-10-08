export function normalizeContract(operation, legacyResult) {
  /*
   * TODO: adapt the bounded legacy cases to the public HTTP contract.
   *
   * Investigate before editing:
   * - run the objective tests and inspect the live list, invalid-create, and
   *   missing responses;
   * - compare each observed status, header, and body shape with `spec.md`;
   * - explain which defect is a header problem and which defect is a body/status
   *   normalization problem.
   *
   * Implement the bounded repair in this file plus `src/server.js`:
   * - fix the list response so it keeps the clue data but uses the public JSON
   *   content type;
   * - stop the invalid-create path after it sends the `422` validation error;
   * - normalize the missing clue response to the documented `404` error
   *   descriptor;
   * - preserve the already-correct create-success descriptor;
   * - do not mutate `legacyResult` or edit the legacy producer or tests.
   *
   * You are done when the focused objective tests and the full test suite pass,
   * the diff changes only this file plus the bounded server repair, and
   * `curl -i` confirms the list and missing-resource contracts described in the
   * specification.
   */
  void operation;
  return legacyResult;
}
