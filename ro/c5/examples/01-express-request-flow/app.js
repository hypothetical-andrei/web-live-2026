/**
 * Ghid didactic
 *
 * Obiectiv: O cerere Express traversează middleware-ul și o rută potrivită înaintea
 * finalizării răspunsului, iar resursele statice și API pot aparține aceleiași aplicații.
 *
 * Motivația structurii: Un fișier HTML, o rută API și un observator fac vizibilă ordinea
 * montării fără CRUD sau validare.
 *
 * Urmărește dovezile:
 * - Observatorul rulează înaintea gestionarilor static și API.
 * - Doar ruta `/api/ping` creează răspunsul JSON.
 * - Evenimentul `finish` apare după producerea răspunsului de către rută.
 * - `/` și `/api/ping` sunt resurse diferite servite de aceeași aplicație.
 */

import express from "express";
import { fileURLToPath } from "node:url";

const publicDirectory = fileURLToPath(new URL("./public/", import.meta.url));

export function createApp(events) {
  const app = express();

  app.use((request, response, next) => {
    events.push(`before:${request.path}`);
    response.once("finish", () => events.push(`finish:${request.path}`));
    next();
  });

  app.use(express.static(publicDirectory));
  app.get("/api/ping", (_request, response) => {
    events.push("route:/api/ping");
    response.json({ data: { message: "pong" } });
  });

  return app;
}
