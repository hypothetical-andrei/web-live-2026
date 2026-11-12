import { Router } from "express";

// Dovadă de audit intenționat defectă: URL-uri acțiune, POST pentru eliminare, identitate în body.
export function createNaiveActionRouter({ service }) {
  const router = Router();
  router.post("/register", async (req, res) => res.json(await service.put(req.body)));
  router.post("/unregister", async (req, res) => res.json(await service.remove(req.body)));
  return router;
}
