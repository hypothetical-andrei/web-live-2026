import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { bookSeats } from "../src/book-seats.js";
import { postJson, state, withApi, withDatabase } from "./helpers.js";

test("HTTP parser, unknown route, health, static resource, and safe error remain healthy", async () => {
  await withApi({}, async (baseUrl) => {
    const malformed = await fetch(`${baseUrl}/api/events/1/bookings`, { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
    assert.equal(malformed.status, 400); assert.equal((await fetch(`${baseUrl}/missing`)).status, 404);
    assert.equal((await fetch(`${baseUrl}/health`)).status, 200); assert.equal((await fetch(`${baseUrl}/`)).status, 200);
    const failed = await fetch(`${baseUrl}/api/events/1/bookings`, postJson({ attendeeId: 1, seats: 1 }));
    assert.equal(failed.status, 500); assert.doesNotMatch(await failed.text(), /secret/i);
  }, { book: async () => { throw new Error("secret database path"); } });
});

test("objective module stays persistence-only without raw transaction SQL", async () => {
  const source = await readFile(new URL("../src/book-seats.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from ["']express["']|\.status\(|\.json\(|BEGIN|COMMIT|ROLLBACK|SELECT\s/i);
});
