import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("./index.html", import.meta.url), "utf8");

assert.match(html, /<html lang="en">/);
assert.match(html, /<label for="email">Email address<\/label>/);
assert.match(html, /id="email"[^>]*type="email"[^>]*required[^>]*aria-describedby="email-help"/);
assert.match(html, /<span id="email-help">/);
assert.match(html, /<fieldset>[\s\S]*<legend>Attendance mode<\/legend>/);
assert.match(html, /<button type="submit">Register<\/button>/);

console.log("semantic form relationships verified");
