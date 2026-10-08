import { unsafeNormalizeEvents } from './unsafe-generated.js';

export function normalizeEvents(events) {
  /*
   * TODO: înlocuiește delegarea nesigură cu limita defensivă din `spec.md`,
   * păstrând `unsafe-generated.js` drept dovadă pentru audit.
   *
   * Diagnostichează înainte să editezi. Rulează comparația și verificările țintite,
   * apoi cere IA un tabel de dovezi cu o intrare concretă, rezultatul nesigur
   * observat, regula JavaScript încălcată și o verificare distinctivă pentru fiecare
   * defect de conversie, proprietate moștenită, mutație, alias sau ordonare.
   * Reproduce singur afirmațiile; respinge avertismentele fără dovezi din execuție.
   *
   * Permite implementarea doar în acest fișier. Datele obligatorii trebuie să fie
   * proprietăți proprii cu tipuri exacte; înregistrările și ordonarea ieșirii nu
   * trebuie să păstreze aliasuri sau să modifice intrarea. Respinge schimbările
   * artefactului nesigur, datelor, testelor sau dependențelor. Examinează diferența
   * și rerulează comparația și toate verificările.
   */
  return unsafeNormalizeEvents(events);
}

export function summarizeEvents(events) {
  /*
   * TODO: sumarizează valorile deja normalizate conform contractului numeric/boolean
   * exact. Înainte să editezi, cere IA să urmărească tipul acumulatorului și colecția
   * sursă. După editare, contestă rezultatul cu dovezile de tipuri mixte furnizate
   * și verifică faptul că nicio conversie nu ascunde date invalide din amonte.
   */
  void events;
  return { activeCount: 0, totalDurationMs: 0 };
}
