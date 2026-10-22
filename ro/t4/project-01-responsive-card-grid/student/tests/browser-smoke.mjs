import assert from "node:assert/strict";
import { createStaticServer, listen } from "../src/static-server.js";
import { openChrome } from "./chrome.mjs";

const server = createStaticServer();
try {
  const url = await listen(server);
  for (const [width, columns, reducedMotion] of [[320, 1, false], [768, 2, false], [1280, 4, false], [768, 2, true]]) {
    const browser = await openChrome({ width, reducedMotion });
    try {
      await browser.navigate(`${url}/?browser-smoke`);
      const state = await browser.evaluate("({ ...document.documentElement.dataset })");
      assert.equal(Number(state.viewport), width, "The test must use the requested CSS viewport width");
      assert.equal(state.browserSmoke, "pass", JSON.stringify(state));
      assert.equal(Number(state.columns), columns);
      assert.equal(state.reducedMotion, String(reducedMotion));
    } finally { await browser.close(); }
  }
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
