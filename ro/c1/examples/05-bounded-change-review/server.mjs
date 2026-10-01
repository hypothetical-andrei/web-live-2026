/**
 * Ghid didactic
 *
 * Obiectiv: furnizarea unui comportament HTTP mic, verificabil independent de un script propus de AI.
 * Motivul structurii: limita publică a serverului rămâne vizibilă și nu cere dependențe.
 * Urmăriți dovezile: POST creează o notiță; starea, headerele și corpul comunică același rezultat.
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
        response.end(JSON.stringify({ id: "n-7", text: "Citiți diff-ul" }));
        return;
      }

      response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "not_found" }));
    });

    server.listen(port, "127.0.0.1", () => resolve(server));
  });
