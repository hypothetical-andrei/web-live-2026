import { expect, it } from "vitest";
import { createNotesStore } from "../src/notes-store.js";
it("depozitele furnizate păstrează modificările izolate", () => { const first = createNotesStore([{ id: "1", title: "Unu", body: "A" }]); const second = createNotesStore([{ id: "1", title: "Doi", body: "B" }]); first.update("1", { title: "Schimbat", body: "C" }); expect(first.get("1").title).toBe("Schimbat"); expect(second.get("1").title).toBe("Doi"); });
