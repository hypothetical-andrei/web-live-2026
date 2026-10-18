/**
 * Teaching guide
 *
 * Goal: provide one small HTTP behavior that an AI-proposed script can verify independently.
 * Why this design: the public server boundary stays visible and requires no dependencies.
 * Follow the evidence: POST creates a note; status, headers, and body agree about that outcome.
 */

import { createServer as createHttpServer } from "node:http";

export const startServer = (port = 0) =>
  new Promise((resolve) => {
    const server = createHttpServer((request, response) => {
      if (request.method === "POST" && request.url === "/api/notes") {
        response.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
          Location: "/api/notes/n-7",
        });
        response.end(JSON.stringify({ id: "n-7", text: "Read diff" }));
        return;
      }

      response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "not_found" }));
    });

    server.listen(port, "127.0.0.1", () => resolve(server));
  });
