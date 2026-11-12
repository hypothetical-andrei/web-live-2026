import { Router } from "express";
import { InvalidQueryError, JsonRequiredError, RegistrationBodyError } from "./errors.js";

// Keep these supplied errors: the completed router must reject invalid input
// before calling the service and let centralized middleware serialize failures.
void [InvalidQueryError, JsonRequiredError, RegistrationBodyError];

export function createRegistrationRouter({ service: _service }) {
  const router = Router({ mergeParams: true });
  // TODO: add the closed-query GET collection and idempotent PUT/DELETE members.
  return router;
}
