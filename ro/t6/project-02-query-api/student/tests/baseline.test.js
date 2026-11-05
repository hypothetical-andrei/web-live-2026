import assert from "node:assert/strict";
import test from "node:test";
import { withApi } from "./helpers.js";

test("baza, ruta, pagina statică și serializatorul furnizate funcționează cu opțiuni fixe", async () => {
  await withApi(async (baseUrl) => {
    const page = await fetch(`${baseUrl}/`);
    assert.match(await page.text(), /API de interogare a notițelor/);
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    const response = await fetch(`${baseUrl}/api/notes`);
    const body = await response.json();
    assert.deepEqual(body.data.map(({ id }) => id), [1, 2, 3, 4]);
  }, { queryBuilder: () => ({ order: [["id", "ASC"]] }) });
});
