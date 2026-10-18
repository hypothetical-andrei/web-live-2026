/**
 * Teaching guide
 *
 * Goal: expose request, response, representation, and optional extension fields in browser DevTools.
 *
 * Why this design: one dependency-free local server lets an older-style client ignore
 * optional metadata while a newer client reads it from the same response shape.
 *
 * Follow the evidence:
 * - method and request body arrive from the client;
 * - status, Location, Content-Type, and Example-Trace-Id leave with the response;
 * - both clients can consume the JSON representation.
 */

import { createServer as createHttpServer } from "node:http";
import { pathToFileURL } from "node:url";

const page = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>HTTP exchange inspector</title></head>
  <body>
    <h1>HTTP exchange inspector</h1>
    <button id="run" type="button">Run exchanges</button>
    <pre id="output">Open DevTools Network, clear it, then run the exchanges.</pre>
    <script type="module">
      const button = document.querySelector("#run");
      const output = document.querySelector("#output");

      button.addEventListener("click", async () => {
        const retrieval = await fetch("/api/notes/n-7");
        const bodyOnlyClient = await retrieval.json();

        const creation = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "Read diff" }),
        });
        const headerAwareClient = {
          traceId: creation.headers.get("Example-Trace-Id"),
          note: await creation.json(),
        };

        output.textContent = JSON.stringify({ bodyOnlyClient, headerAwareClient }, null, 2);
      });
    </script>
  </body>
</html>`;

const sendJson = (response, status, body, fields = {}) => {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...fields,
  });
  response.end(JSON.stringify(body));
};

const readJson = async (request) => {
  let source = "";
  for await (const chunk of request) source += chunk;
  return JSON.parse(source);
};

export const createServer = () =>
  createHttpServer(async (request, response) => {
    const url = new URL(request.url, "http://example.local");

    if (request.method === "GET" && url.pathname === "/") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(page);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/notes/n-7") {
      sendJson(response, 200, { id: "n-7", text: "Read diff" }, {
        "Example-Trace-Id": "trace-read-7",
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/notes") {
      const input = await readJson(request);
      sendJson(response, 201, { id: "n-7", text: input.text }, {
        Location: "/api/notes/n-7",
        "Example-Trace-Id": "trace-create-7",
      });
      return;
    }

    sendJson(response, 404, { error: "not_found" });
  });

export const startServer = (port = 0) =>
  new Promise((resolve) => {
    const server = createServer();
    server.listen(port, "127.0.0.1", () => resolve(server));
  });

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMain) {
  const port = Number(process.env.PORT || 4173);
  const server = await startServer(port);
  const address = server.address();
  console.log(`Open http://127.0.0.1:${address.port}`);
}
