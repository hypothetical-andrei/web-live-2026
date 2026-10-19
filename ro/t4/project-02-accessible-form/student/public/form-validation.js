export function validateEnrollment(input) {
  // TODO: normalizează câmpurile și întoarce erori de validare deterministe.
  return { values: { ...input }, errors: {} };
}

export function handleSubmission(input, ui) {
  // TODO: coordonează afișarea erorilor/focusul sau o singură trimitere validă.
  void ui;
  return { ok: false, errors: validateEnrollment(input).errors };
}
