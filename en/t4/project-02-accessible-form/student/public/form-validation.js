export function validateEnrollment(input) {
  // TODO: normalize fields and return deterministic validation errors.
  return { values: { ...input }, errors: {} };
}

export function handleSubmission(input, ui) {
  // TODO: coordinate error display/focus or one valid submission.
  void ui;
  return { ok: false, errors: validateEnrollment(input).errors };
}
