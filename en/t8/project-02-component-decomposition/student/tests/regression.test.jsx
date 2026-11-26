import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
const evidenceHash = "b7a74c42cb5f9e680be2cc6f51bc03ddc44963fba2c149701c879681ecbab07b";
it("preserved generated evidence remains byte-identical", async () => { const source = await readFile("evidence/OversizedWorkshopDashboard.jsx"); expect(createHash("sha256").update(source).digest("hex")).toBe(evidenceHash); });
