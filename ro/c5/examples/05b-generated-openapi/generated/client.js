// Generat prin npm run generate. Editează schemele/metadatele operației.
export async function createTask(body, baseUrl = "") {
  const response = await fetch(baseUrl + "/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    throw Object.assign(new Error(result.error.code), { status: response.status });
  }
  return result;
}
