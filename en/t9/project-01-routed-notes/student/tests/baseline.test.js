import { expect, it } from "vitest";
import { createNotesStore } from "../src/notes-store.js";
it("supplied store is immutable, deterministic, and CRUD-capable", () => { const store = createNotesStore(); const listed = store.list(); listed[0].title = "mutated"; expect(store.get("1").title).toBe("URL state"); const created = store.create({ title: "New", body: "Body" }); expect(created.id).toBe("3"); expect(store.update(created.id, { title: "Updated", body: "Text" })).toEqual({ id: "3", title: "Updated", body: "Text" }); expect(store.get("missing")).toBeNull(); });
