import express from "express";
import { fileURLToPath } from "node:url";
import { ValidationError } from "sequelize";
import {
  listSessionsWithRegistrations,
  registerAttendee,
} from "./conference-model.js";
import {
  ConferenceEntityNotFoundError,
  RegistrationExistsError,
} from "./errors.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const sendError = (response, status, code, message) =>
  response.status(status).json({ error: { code, message } });
const plain = (instance) => instance.get({ plain: true });

// Păstrăm aici preocupările HTTP și delegăm regulile de relaționare către helper-ele de model.
export function createApp({
  models,
  listSessions = listSessionsWithRegistrations,
  register = registerAttendee,
}) {
  const app = express();
  app.use(express.json());
  app.get("/health", (_request, response) => response.json({ status: "ok" }));
  app.use(express.static(publicDirectory));
  app.get("/api/conferences/:conferenceId/sessions", async (request, response) => {
    const sessions = await listSessions(models, { conferenceId: request.params.conferenceId });
    response.json({ data: sessions.map(plain) });
  });
  app.post("/api/sessions/:sessionId/registrations", async (request, response) => {
    if (!request.is("application/json")) {
      return sendError(response, 415, "json_required", "Content-Type trebuie să fie application/json");
    }
    const body = request.body;
    if (
      body === null || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).length !== 2 ||
      !Number.isInteger(body.attendeeId) ||
      !["standard", "student", "speaker"].includes(body.ticketType)
    ) {
      return sendError(response, 400, "validation_failed", "Body de înscriere invalid");
    }
    const registration = await register(models, {
      sessionId: request.params.sessionId,
      attendeeId: body.attendeeId,
      ticketType: body.ticketType,
    });
    return response
      .status(201)
      .location(`/api/sessions/${request.params.sessionId}/registrations/${body.attendeeId}`)
      .json({ data: registration });
  });
  app.use((_request, response) => sendError(response, 404, "not_found", "Resursa nu a fost găsită"));
  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error instanceof SyntaxError && error.type === "entity.parse.failed") {
      return sendError(response, 400, "invalid_json", "Body-ul cererii nu este JSON valid");
    }
    if (error instanceof ConferenceEntityNotFoundError) {
      return sendError(response, 404, error.code, error.message);
    }
    if (error instanceof RegistrationExistsError) {
      return sendError(response, 409, error.code, error.message);
    }
    if (error instanceof ValidationError) {
      return sendError(response, 400, "registration_invalid", "Înscrierea încalcă restricțiile");
    }
    return sendError(response, 500, "internal_error", "Eroare internă a serverului");
  });
  return app;
}
