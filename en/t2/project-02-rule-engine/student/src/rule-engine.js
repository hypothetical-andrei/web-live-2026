export function compileRule(definition) {
  /*
   * TODO: validate one declarative rule tree and compile it into a reusable
   * predicate, following `spec.md`.
   *
   * Before editing, run the focused checks and draw the supplied definition
   * tree. Ask AI—without authorizing changes—to identify each rule kind,
   * strict operator contracts, the recursive base
   * and composite cases, and what every returned closure must capture. Verify
   * its explanation against the tests.
   *
   * Then permit changes only in this file. Reject proposals that use dynamic
   * code evaluation, coerce values, recompile
   * children during every record evaluation, mutate input, or change tests.
   * Inspect the diff and run the strict-type, composition, and
   * short-circuit checks before accepting the compiled predicate.
   */
  void definition;
  return () => false;
}

export function evaluateRecords(records, definition) {
  /*
   * TODO: validate the record collection, compile the definition once, and
   * partition record IDs in original order without mutation.
   *
   * Ask AI to trace when compilation occurs and how one record reaches exactly
   * one output partition before it edits. Afterward, inspect the diff for
   * repeated compilation, hidden coercion, reordered input, or expanded scope;
   * run the full suite and explain the resulting predicate tree yourself.
   */
  void records;
  void definition;
  return { matchedIds: [], rejectedIds: [] };
}
