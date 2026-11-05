// Generează artefacte exportabile din documentul OpenAPI asamblat. Șablonul mic de client
// suportă acest POST JSON, nu orice OpenAPI.
import { mkdir, writeFile } from "node:fs/promises";
import { buildOpenApi } from "./openapi.js";

const description = buildOpenApi();
const output = new URL("./generated/", import.meta.url);
await mkdir(output, { recursive: true });
await writeFile(
  new URL("openapi.json", output),
  JSON.stringify(description, null, 2) + "\n",
);

const [path, methods] = Object.entries(description.paths)[0];
const [method, operation] = Object.entries(methods)[0];
if (method !== "post" || !/^[A-Za-z_$][\w$]*$/.test(operation.operationId)) {
  throw new Error("This teaching generator supports one named JSON POST operation.");
}
const client = `// Generat prin npm run generate. Editează schemele/metadatele operației.
export async function ${operation.operationId}(body, baseUrl = "") {
  const response = await fetch(baseUrl + ${JSON.stringify(path)}, {
    method: ${JSON.stringify(method.toUpperCase())},
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw Object.assign(new Error(result.error.code), { status: response.status });
  }
  return result;
}
`;
await writeFile(new URL("client.js", output), client);

await writeFile(
  new URL("index.html", output),
  `<!doctype html>
<html lang="ro">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Interfața API generată</title>
    <link rel="stylesheet" href="/docs/assets/swagger-ui.css" />
  </head>
  <body>
    <h1>Interfața API generată</h1>
    <p><a href="/openapi.json">Specificație OpenAPI</a> · <a href="/client.js">Client JavaScript generat</a></p>
    <div id="swagger-ui"></div>
    <script src="/docs/assets/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: "#swagger-ui",
        validatorUrl: null,
      });
    </script>
  </body>
</html>
`,
);
console.log("Au fost generate OpenAPI, client.js și pagina Swagger UI.");
