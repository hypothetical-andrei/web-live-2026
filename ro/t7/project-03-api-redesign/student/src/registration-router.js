import { Router } from "express";
import { InvalidQueryError, JsonRequiredError, RegistrationBodyError } from "./errors.js";

// Păstrează erorile furnizate: ruterul final trebuie să respingă datele invalide
// înaintea apelului serviciului și să lase middleware-ul centralizat să serializeze erorile.
void [InvalidQueryError, JsonRequiredError, RegistrationBodyError];

export function createRegistrationRouter({ service: _service }) {
  const router = Router({ mergeParams: true });
  // TODO: adaugă GET pentru colecția cu interogare închisă și membri PUT/DELETE idempotenți.
  return router;
}
