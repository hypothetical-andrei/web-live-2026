// @vitest-environment node
import { expect, it } from "vitest";
import { createNotesServer } from "../../server/app.js";
import { createNotesApi, NotesApiError } from "../src/notes-api.js";
import { withServer } from "./helpers.jsx";
it("API-ul Express și adaptorul fetch furnizate finalizează o secvență CRUD reală", async () => { await withServer(createNotesServer(), async (baseUrl) => { const api = createNotesApi(baseUrl); expect((await api.list()).map(({ id }) => id)).toEqual(["1"]); const created = await api.create({ title: "Nou", body: "Conținut" }); expect(created).toEqual({ id: "2", title: "Nou", body: "Conținut" }); expect((await api.update("2", { title: "Schimbat", body: "Text" })).title).toBe("Schimbat"); await api.remove("2"); expect(await api.list()).toHaveLength(1); await expect(api.update("99", { title: "X", body: "" })).rejects.toMatchObject({ constructor: NotesApiError, status: 404, code: "note_not_found" }); }); });
