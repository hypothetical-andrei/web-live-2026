// Folosește aceeași operație pentru rută, validare Joi și generarea API. Resursele
// Swagger UI sunt locale, fără CDN.
import express from "express";
import swaggerUiDist from "swagger-ui-dist";
import { fileURLToPath } from "node:url";
import { buildOpenApi } from "./openapi.js";
import { operation, failures } from "./operation.js";

export function createApp() {
  const app = express();
  const generated = (file) =>
    fileURLToPath(new URL(`./generated/${file}`, import.meta.url));
  const sendError = (response, code) =>
    response.status(failures[code].status).json({ error: { code } });
  app.get("/", (_request, response) => response.redirect("/docs/"));
  app.get("/openapi.json", (_request, response) => response.json(buildOpenApi()));
  app.get("/client.js", (_request, response) =>
    response.sendFile(generated("client.js")),
  );
  app.use("/docs/assets", express.static(swaggerUiDist.getAbsoluteFSPath()));
  app.get("/docs/", (_request, response) => response.sendFile(generated("index.html")));

  app[operation.method](
    operation.path,
    (request, response, next) => {
      if (!request.is("application/json"))
        return sendError(response, "unsupported_media_type");
      return next();
    },
    express.json({ limit: "4kb", strict: false }),
    (request, response) => {
      const { error, value } = operation.requestSchema.validate(request.body, {
        convert: false,
        abortEarly: false,
      });
      if (error) return sendError(response, "validation_failed");
      return response
        .status(operation.successStatus)
        .location("/api/tasks/t-1")
        .json({ data: { id: "t-1", title: value.title.trim() } });
    },
  );
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    const code =
      error.type === "entity.parse.failed"
        ? "invalid_json"
        : error.type === "entity.too.large"
          ? "payload_too_large"
          : "internal_error";
    return sendError(response, code);
  });
  return app;
}
