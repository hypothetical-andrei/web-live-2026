import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
const evidenceHash = "9255df5ffb8eb7ce697e0d3cd94d718dd0684abed0a79755a07716e97b05eae0";
it("dovada generată păstrată rămâne identică octet cu octet", async () => { const source = await readFile("evidence/OversizedWorkshopDashboard.jsx"); expect(createHash("sha256").update(source).digest("hex")).toBe(evidenceHash); });
