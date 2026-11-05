/**
 * Teaching guide
 *
 * Goal: An Express request traverses middleware and one matching route before response
 * completion, while static resources and API resources can share the same application.
 *
 * Why this design: One HTML file, one API route, and one observer make mounting order
 * visible without introducing CRUD or validation.
 *
 * Follow the evidence:
 * - The observer runs before both static and API handlers.
 * - Only the `/api/ping` route creates the JSON response.
 * - The `finish` event occurs after the route has produced its response.
 * - `/` and `/api/ping` are different resources served by one app.
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
