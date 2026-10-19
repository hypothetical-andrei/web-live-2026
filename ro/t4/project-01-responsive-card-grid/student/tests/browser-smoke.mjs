import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { createStaticServer, listen } from "../src/static-server.js";
const execute = promisify(execFile); const server = createStaticServer();
try {
  const url = await listen(server);
  for (const [width, columns] of [[320, 1], [768, 2], [1280, 4]]) {
    const profile = await mkdtemp(join(tmpdir(), `card-grid-${width}-`));
    try { const { stdout } = await execute(process.env.CHROME_BIN ?? "google-chrome", ["--headless=new", "--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1", `--window-size=${width},800`, `--user-data-dir=${profile}`, "--virtual-time-budget=500", "--dump-dom", `${url}/?browser-smoke`]); assert.match(stdout, /data-browser-smoke="pass"/); assert.match(stdout, new RegExp(`data-columns="${columns}"`)); }
    finally { await rm(profile, { recursive: true, force: true }); }
  }
} finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
