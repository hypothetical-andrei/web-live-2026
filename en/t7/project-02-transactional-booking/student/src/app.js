import express from "express";
import { fileURLToPath } from "node:url";
import { bookSeats } from "./book-seats.js";
import { BookingExistsError, BookingValidationError, EventNotFoundError, SoldOutError } from "./errors.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const sendError = (res, status, code, message) => res.status(status).json({ error: { code, message } });

export function createApp({ database, book = bookSeats }) {
  const app = express();
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use(express.static(publicDirectory));
  app.post("/api/events/:eventId/bookings", async (req, res) => {
    const result = await book(database, {
      eventId: Number(req.params.eventId),
      attendeeId: req.body?.attendeeId,
      seats: req.body?.seats,
    });
    res.status(201).location(`/api/bookings/${result.booking.id}`).json({ data: result });
  });
  app.use((_req, res) => sendError(res, 404, "not_found", "Resource not found"));
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof SyntaxError && error.type === "entity.parse.failed") return sendError(res, 400, "invalid_json", "Request body is not valid JSON");
    if (error instanceof BookingValidationError) return sendError(res, 400, error.code, error.message);
    if (error instanceof EventNotFoundError) return sendError(res, 404, error.code, error.message);
    if (error instanceof SoldOutError || error instanceof BookingExistsError) return sendError(res, 409, error.code, error.message);
    return sendError(res, 500, "internal_error", "Internal server error");
  });
  return app;
}
