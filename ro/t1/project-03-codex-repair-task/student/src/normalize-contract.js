export function normalizeContract(operation, legacyResult) {
  /*
   * TODO: adaptează rezultatul vechi la contractul HTTP public.
   *
   * Investighează înainte să editezi:
   * - rulează testele de obiectiv și examinează răspunsurile pentru listare,
   *   creare invalidă și resursa inexistentă;
   * - compară fiecare stare, antet și formă a corpului observate cu
   *   `spec.md`;
   * - explică ce defect ține de headere, ce defect ține de controlul fluxului
   *   și ce defect ține de normalizare.
   *
   * Implementează remedierea delimitată în acest fișier plus `src/server.js`:
   * - corectează răspunsul de listare astfel încât să păstreze datele despre
   *   indicii, dar să folosească tipul public de conținut JSON;
   * - oprește calea de creare invalidă după ce trimite eroarea `422` de
   *   validare;
   * - normalizează răspunsul pentru indiciul lipsă la descriptorul `404`
   *   documentat;
   * - păstrează descriptorul deja corect pentru crearea reușită;
   * - nu modifica `legacyResult` și nu edita producătorul vechi sau testele.
   *
   * Ai terminat când testele de obiectiv țintite și întreaga suită trec,
   * diferențele modifică doar acest fișier plus remedierea delimitată din
   * server, iar `curl -i` confirmă contractele descrise în specificație pentru
   * listare și resursa inexistentă.
   */
  void operation;
  return legacyResult;
}
