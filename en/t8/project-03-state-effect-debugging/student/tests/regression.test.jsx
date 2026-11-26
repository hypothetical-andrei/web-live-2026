import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
const evidenceHash = "3a6db9023b1151511f928c7ce49fd920f7dacb6c51b9c06997fb09adb6152b7a";
it("preserved generated evidence remains byte-identical", async () => { const source = await readFile("evidence/GeneratedSearchPanel.jsx"); expect(createHash("sha256").update(source).digest("hex")).toBe(evidenceHash); });
