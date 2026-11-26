// @vitest-environment node
import { expect, it } from "vitest";
import { createNotesServer } from "../../server/app.js";
import { createNotesApi, NotesApiError } from "../src/notes-api.js";
import { withServer } from "./helpers.jsx";
it("supplied Express API and fetch adapter complete a real CRUD sequence", async () => { await withServer(createNotesServer(), async (baseUrl) => { const api = createNotesApi(baseUrl); expect((await api.list()).map(({ id }) => id)).toEqual(["1"]); const created = await api.create({ title: "New", body: "Body" }); expect(created).toEqual({ id: "2", title: "New", body: "Body" }); expect((await api.update("2", { title: "Changed", body: "Text" })).title).toBe("Changed"); await api.remove("2"); expect(await api.list()).toHaveLength(1); await expect(api.update("99", { title: "X", body: "" })).rejects.toMatchObject({ constructor: NotesApiError, status: 404, code: "note_not_found" }); }); });
