import { expect, it } from "vitest";
import { createNotesStore } from "../src/notes-store.js";
it("supplied stores keep mutations isolated", () => { const first = createNotesStore([{ id: "1", title: "One", body: "A" }]); const second = createNotesStore([{ id: "1", title: "Two", body: "B" }]); first.update("1", { title: "Changed", body: "C" }); expect(first.get("1").title).toBe("Changed"); expect(second.get("1").title).toBe("Two"); });
