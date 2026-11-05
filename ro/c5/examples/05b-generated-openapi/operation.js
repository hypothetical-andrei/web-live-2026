// Înregistrează ruta și descrie comportamentul HTTP din aceleași metadate. Generarea
// schemelor nu deduce statusuri din JavaScript arbitrar.
import { createTaskSchema, createdTaskSchema } from "./schemas.js";

export const operation = {
  method: "post",
  path: "/api/tasks",
  operationId: "createTask",
  summary: "Validează un titlu și întoarce o sarcină demonstrativă; fără stocare.",
  requestSchema: createTaskSchema,
  responseSchema: createdTaskSchema,
  successStatus: 201,
};

export const failures = {
  invalid_json: { status: 400, description: "JSON invalid" },
  validation_failed: { status: 400, description: "Titlu sau câmpuri invalide" },
  payload_too_large: { status: 413, description: "Corpul depășește 4kb" },
  unsupported_media_type: { status: 415, description: "JSON obligatoriu" },
  internal_error: { status: 500, description: "Eroare internă" },
};
