import assert from "node:assert/strict";
import test from "node:test";
import { css } from "./helpers.js";

// Whitespace and comments are not layout requirements.
const compact = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "");
test("required tokens, sizing and layout primitives exist", () => {
  for (const pattern of [/--canvas:/, /--space:/, /--radius:/, /box-sizing:border-box/, /display:flex/, /display:grid/, /aspect-ratio:16\/9/]) {
    assert.match(compact, pattern);
  }
  assert.ok(/max-width:72rem/.test(compact) || /width:min\([^;{}]*,72rem\)/.test(compact), "Use the required 72rem content limit");
});
test("responsive grid column states exist at the required breakpoints", () => {
  assert.match(compact, /grid-template-columns:minmax\(0,1fr\)/);
  assert.match(compact, /@media\(min-width:40rem\)[\s\S]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(compact, /@media\(min-width:64rem\)[\s\S]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
});
test("focus and reduced motion are explicit", () => {
  assert.match(compact, /:focus-visible/);
  assert.match(compact, /prefers-reduced-motion:reduce/);
  assert.match(compact, /transition:none/);
});
