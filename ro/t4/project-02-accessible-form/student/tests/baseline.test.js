import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("semantic markup and supplied accessibility adapter are present", async () => {
  const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
  for (const pattern of [/<label\b/, /<fieldset\b/, /<legend\b/, /type=["']email["']/, /autocomplete=/, /aria-describedby=/, /tabindex=["']-1["']/, /aria-live=/]) {
    assert.match(html, pattern);
  }
  // Quote choice and spacing do not change DOM API behavior.
  for (const pattern of [/aria-invalid/, /summary\s*\.\s*focus\s*\(/, /createElement\s*\(\s*["']a["']\s*\)/]) {
    assert.match(app, pattern);
  }
});
