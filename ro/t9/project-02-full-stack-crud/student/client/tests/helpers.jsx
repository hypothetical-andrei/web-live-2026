import React from "react";
import { createServer } from "node:http";
import { render } from "@testing-library/react";
import NotesWorkspace from "../src/NotesWorkspace.jsx";
import { listen } from "../../server/server.js";
export function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
export function fakeApi(listResult = [{ id: "1", title: "Unu", body: "Conținut" }]) { return { list: async () => structuredClone(listResult), create: async (input) => ({ id: "2", ...input }), update: async (id, input) => ({ id, ...input }), remove: async () => null }; }
export const renderWorkspace = (api) => render(<NotesWorkspace api={api} />);
export async function withServer(appPromise, run) {
  const app = await appPromise;
  const server = createServer(app);
  try {
    const baseUrl = await listen(server);
    await run(baseUrl);
  } finally {
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeAllConnections();
    try { await closed; } finally { await app.locals.closeDatabase?.(); }
  }
}
