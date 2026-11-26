import { createBrokenServer } from "../evidence/broken-server.js";

export function createProductionApp({ clientDirectory, apiRouter, requestLog = [] }) {
  // This reproduces the production defect while preserving health, API, and
  // real static-file behavior. Implement the narrow SPA delivery policy here.
  return createBrokenServer({
    clientDirectory,
    apiRouter,
    requestLog,
    mode: "static-only"
  });
}
