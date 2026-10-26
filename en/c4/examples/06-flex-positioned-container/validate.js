import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

assert.match(html, /class="toolbar"[\s\S]*class="actions"/);
assert.match(html, /<article class="card">[\s\S]*class="badge"/);
for (const pattern of [/\.toolbar\s*\{[^}]*display:\s*flex/, /justify-content:\s*space-between/, /align-items:\s*center/, /flex-wrap:\s*wrap/, /gap:\s*1rem/]) assert.match(css, pattern);
assert.match(css, /\.card\s*\{[^}]*position:\s*relative/);
assert.match(css, /\.badge\s*\{[^}]*position:\s*absolute/);
assert.match(css, /inset-block-start:/);
assert.match(css, /inset-inline-end:/);

console.log("Flex container and positioned-child contracts are present.");
