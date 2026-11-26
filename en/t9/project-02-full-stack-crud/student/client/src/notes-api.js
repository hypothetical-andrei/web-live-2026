export class NotesApiError extends Error { constructor(status, code) { super("Notes request failed"); this.status = status; this.code = code; } }
export function createNotesApi(baseUrl = "") {
  const request = async (path, options = {}) => { const response = await fetch(`${baseUrl}${path}`, options); if (response.status === 204) return null; const body = await response.json().catch(() => null); if (!response.ok || !body || !("data" in body)) throw new NotesApiError(response.status, body?.error?.code ?? "invalid_response"); return body.data; };
  const json = (method, body) => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { list: ({ signal } = {}) => request("/api/notes", { signal }), create: (input) => request("/api/notes", json("POST", input)), update: (id, input) => request(`/api/notes/${id}`, json("PUT", input)), remove: (id) => request(`/api/notes/${id}`, { method: "DELETE" }) };
}
