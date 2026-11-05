// Convert Joi data shapes, then assemble the operation metadata. joi-to-swagger emits
// OpenAPI 3.0 schemas, so this document declares 3.0.3.
import joiToSwagger from "joi-to-swagger";
import { operation, failures } from "./operation.js";
import { errorSchema } from "./schemas.js";

export function buildOpenApi(definition = operation) {
  const json = (schema) => ({
    "application/json": { schema: joiToSwagger(schema).swagger },
  });
  const responses = {
    [definition.successStatus]: {
      description: "Created",
      headers: { Location: { schema: { type: "string" } } },
      content: json(definition.responseSchema),
    },
  };
  for (const failure of Object.values(failures)) {
    const previous = responses[failure.status];
    responses[failure.status] = {
      description: previous
        ? `${previous.description}; ${failure.description}`
        : failure.description,
      content: json(errorSchema),
    };
  }
  return {
    openapi: "3.0.3",
    info: { title: "Generated task API", version: "1.0.0" },
    servers: [{ url: "/" }],
    paths: {
      [definition.path]: {
        [definition.method]: {
          operationId: definition.operationId,
          summary: definition.summary,
          requestBody: { required: true, content: json(definition.requestSchema) },
          responses,
        },
      },
    },
  };
}
