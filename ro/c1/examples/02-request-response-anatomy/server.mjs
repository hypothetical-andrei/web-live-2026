/**
 * Ghid didactic
 *
 * Obiectiv: expunerea cererii, răspunsului, reprezentării și câmpurilor opționale în DevTools.
 *
 * Motivul structurii: un server local fără dependențe permite clientului vechi să ignore
 * metadatele opționale, iar clientului nou să le citească din aceeași formă de răspuns.
 *
 * Urmăriți dovezile:
 * - metoda și corpul cererii sosesc de la client;
 * - starea, Location, Content-Type și Example-Trace-Id pleacă în răspuns;
 * - ambii clienți pot folosi reprezentarea JSON.
 */

import { createServer as createHttpServer } from "node:http";
import { pathToFileURL } from "node:url";

const page = `<!doctype html>
<html lang="ro">
  <head><meta charset="utf-8"><title>Inspector de schimburi HTTP</title></head>
  <body>
    <h1>Inspector de schimburi HTTP</h1>
    <button id="run" type="button">Rulează schimburile</button>
    <pre id="output">Deschideți DevTools Network, goliți lista, apoi rulați schimburile.</pre>
    <script type="module">
      const button = document.querySelector("#run");
      const output = document.querySelector("#output");

      button.addEventListener("click", async () => {
        const retrieval = await fetch("/api/notes/n-7");
        const bodyOnlyClient = await retrieval.json();

        const creation = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "Citiți diff-ul" }),
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
      sendJson(response, 200, { id: "n-7", text: "Citiți diff-ul" }, {
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
  console.log(`Deschideți http://127.0.0.1:${address.port}`);
}
