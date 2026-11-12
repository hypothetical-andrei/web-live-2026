import { Router } from "express";

// Deliberately flawed audit evidence: action URLs, POST for removal, identity in bodies.
export function createNaiveActionRouter({ service }) {
  const router = Router();
  router.post("/register", async (req, res) => res.json(await service.put(req.body)));
  router.post("/unregister", async (req, res) => res.json(await service.remove(req.body)));
  return router;
}
