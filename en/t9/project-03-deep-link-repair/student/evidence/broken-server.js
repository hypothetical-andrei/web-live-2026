import express from "express";
import { resolve } from "node:path";

export function createBrokenServer({ clientDirectory, mode, apiRouter, requestLog = [] }) {
  const app = express();
  const directory = resolve(clientDirectory);

  app.use((request, _response, next) => {
    requestLog.push(`broken:${mode}:${request.method} ${request.path}`);
    next();
  });
  app.get("/health", (_request, response) => {
    response.json({ data: { status: "ok" } });
  });
  app.use("/api", apiRouter);
  app.use(express.static(directory, { index: "index.html" }));

  if (mode === "universal") {
    app.use((_request, response) => response.status(200).sendFile(resolve(directory, "index.html")));
  } else if (mode !== "static-only") {
    throw new Error(`Unknown broken mode: ${mode}`);
  }

  app.use((_request, response) => response.status(404).type("text/plain").send("Not found"));
  return app;
}
