import { createBrokenServer } from "../evidence/broken-server.js";

export function createProductionApp({ clientDirectory, apiRouter, requestLog = [] }) {
  // Aceasta reproduce defectul din producție, păstrând sănătatea, API-ul și
  // comportamentul fișierelor statice reale. Implementați aici politica restrânsă de livrare SPA.
  return createBrokenServer({
    clientDirectory,
    apiRouter,
    requestLog,
    mode: "static-only"
  });
}
