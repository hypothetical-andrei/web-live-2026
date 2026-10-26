import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("./index.html", import.meta.url), "utf8");

assert.match(html, /<html lang="ro">/);
assert.match(html, /<label for="email">Adresă de e-mail<\/label>/);
assert.match(html, /id="email"[^>]*type="email"[^>]*required[^>]*aria-describedby="email-help"/);
assert.match(html, /<span id="email-help">/);
assert.match(html, /<fieldset>[\s\S]*<legend>Mod de participare<\/legend>/);
assert.match(html, /<button type="submit">Înscrie-te<\/button>/);

console.log("relațiile semantice ale formularului au fost verificate");
