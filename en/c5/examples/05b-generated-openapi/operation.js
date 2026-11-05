// Register the route and describe its HTTP behavior from the same metadata. Generating
// schemas does not infer statuses from arbitrary JavaScript.
import { createTaskSchema, createdTaskSchema } from "./schemas.js";

export const operation = {
  method: "post",
  path: "/api/tasks",
  operationId: "createTask",
  summary: "Validate a title and return a demonstration task; no storage.",
  requestSchema: createTaskSchema,
  responseSchema: createdTaskSchema,
  successStatus: 201,
};

export const failures = {
  invalid_json: { status: 400, description: "Invalid JSON" },
  validation_failed: { status: 400, description: "Invalid title or fields" },
  payload_too_large: { status: 413, description: "Body exceeds 4kb" },
  unsupported_media_type: { status: 415, description: "JSON required" },
  internal_error: { status: 500, description: "Internal error" },
};
