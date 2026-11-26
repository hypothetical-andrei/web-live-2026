import { Router } from "express";

export function createApiRouter(requestLog = []) {
  const router = Router();

  router.use((request, _response, next) => {
    requestLog.push(`api:${request.method} ${request.path}`);
    next();
  });

  router.get("/status", (_request, response) => {
    response.json({ data: { service: "notes", ready: true } });
  });

  router.use((_request, response) => {
    response.status(404).json({ error: { code: "api_not_found", message: "API route not found" } });
  });

  return router;
}
