export function transformTasks(tasks, options = {}) {
  /*
   * TODO: build the defensive transformation described in `spec.md`.
   *
   * Before asking AI to edit:
   * 1. Run the baseline, objective, and regression checks separately.
   * 2. Inspect the in-memory sample, app call site, and focused failures.
   * 3. Ask AI for a no-edit table of accepted input types, required own
   *    properties, stage shapes, mutation risks, and completion evidence.
   * 4. Verify that table against the specification and tests yourself.
   *
   * Constrain the implementation request to this file. It must transform the
   * supplied task array into fresh projected records, preserve caller-owned
   * inputs, order deterministically, and derive the summary from the correct
   * stage. Do not permit app, test, or
   * dependency changes.
   *
   * After AI proposes a change, inspect every diff hunk for shallow aliases,
   * in-place sorting, incorrect ordering, and edits
   * outside scope. Run all checks, compare app output with a hand calculation, and explain
   * every pipeline stage before accepting the result.
   */
  void tasks;
  void options;
  return { tasks: [], count: 0, totalEstimate: 0, owners: [] };
}
