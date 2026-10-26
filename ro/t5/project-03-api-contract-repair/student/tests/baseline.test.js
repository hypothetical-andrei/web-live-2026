import test from "node:test";
import assert from "node:assert/strict";
import { withApi, request } from "./helpers.js";
import { createMeetingStore } from "../src/meeting-store.js";

test("serverul servește health și pagina de inspecție", async () => {
  await withApi(async (base) => {
    assert.deepEqual(await (await request(base, "/health")).json(), { status: "ok" });
    const page = await request(base, "/");
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Meeting API/);
  });
});

test("stocarea furnizată se resetează și returnează copii independente", () => {
  const store = createMeetingStore();
  const records = store.list();
  records[0].title = "Changed copy";
  assert.equal(store.find("m1").title, "Zebra planning");
  assert.equal(store.accept("m1").accepted, true);
  assert.equal(createMeetingStore().find("m1").accepted, false);
});

test("citirea existentă răspunde și acceptarea în așteptare funcționează", async () => {
  await withApi(async (base) => {
    const detail = await request(base, "/api/meetings/m1");
    assert.equal(detail.status, 200);
    assert.match(detail.headers.get("content-type"), /application\/json/);
    const accepted = await request(base, "/api/meetings/m1/accept", { method: "POST" });
    assert.equal(accepted.status, 200);
    assert.equal((await accepted.json()).data.accepted, true);
  });
});
