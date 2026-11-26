import { expect, it } from "vitest";
import { createNotesStore } from "../src/notes-store.js";
it("depozitul furnizat este imuabil, determinist și capabil de CRUD", () => { const store = createNotesStore(); const listed = store.list(); listed[0].title = "modificat"; expect(store.get("1").title).toBe("Starea URL"); const created = store.create({ title: "Nou", body: "Conținut" }); expect(created.id).toBe("3"); expect(store.update(created.id, { title: "Actualizat", body: "Text" })).toEqual({ id: "3", title: "Actualizat", body: "Text" }); expect(store.get("missing")).toBeNull(); });
