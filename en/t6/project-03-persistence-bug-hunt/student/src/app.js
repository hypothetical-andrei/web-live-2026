import express from "express";
import { fileURLToPath } from "node:url";
import { createReservation } from "./reservation-store.js";
import { PersistenceConflictError, PersistenceValidationError } from "./errors.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const sendError = (response, status, code, message) =>
  response.status(status).json({ error: { code, message } });

export function createApp({ Reservation, create = createReservation }) {
  const app = express();
  app.use(express.json());
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.use(express.static(publicDirectory));
  app.get("/api/reservations", async (_request, response) => {
    const rows = await Reservation.findAll({ order: [["id", "ASC"]] });
    response.json({ data: rows.map((row) => row.get({ plain: true })) });
  });
  app.post("/api/reservations", async (request, response) => {
    const reservation = await create(Reservation, request.body);
    response
      .status(201)
      .location(`/api/reservations/${reservation.id}`)
      .json({ data: reservation });
  });
  app.use((_request, response) => sendError(response, 404, "not_found", "Resource not found"));
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error instanceof SyntaxError && error.type === "entity.parse.failed") {
      return sendError(response, 400, "invalid_json", "Request body is not valid JSON");
    }
    if (error instanceof PersistenceValidationError) {
      return sendError(response, 400, error.code, error.message);
    }
    if (error instanceof PersistenceConflictError) {
      return sendError(response, 409, error.code, error.message);
    }
    return sendError(response, 500, "internal_error", "Internal server error");
  });
  return app;
}
