import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
const evidenceHash = "56d252d24ef7120415f8833de3fe7784769c971797e1df38503779b66146fdc7";
it("dovada generată păstrată rămâne identică octet cu octet", async () => { const source = await readFile("evidence/GeneratedSearchPanel.jsx"); expect(createHash("sha256").update(source).digest("hex")).toBe(evidenceHash); });
