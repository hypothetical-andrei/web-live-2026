import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// CDP sets the page viewport: Chrome's window-size flag clamps narrow windows to 500px.
export async function openChrome({ width, reducedMotion = false }) {
  const profile = await mkdtemp(join(tmpdir(), "card-grid-cdp-"));
  const chrome = spawn(process.env.CHROME_BIN ?? "google-chrome", [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--remote-debugging-pipe",
    `--user-data-dir=${profile}`
  ], { stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"] });
  let sequence = 0;
  let buffer = "";
  let diagnostics = "";
  const pending = new Map();
  chrome.stderr.on("data", (data) => { diagnostics = (diagnostics + data).slice(-4000); });
  function rejectPending(error) {
    for (const slot of pending.values()) { clearTimeout(slot.timer); slot.reject(error); }
    pending.clear();
  }
  chrome.once("error", rejectPending);
  chrome.once("exit", () => rejectPending(new Error(`Chrome closed: ${diagnostics}`)));
  chrome.stdio[4].on("data", (data) => {
    buffer += data.toString();
    let end;
    while ((end = buffer.indexOf("\0")) >= 0) {
      const frame = buffer.slice(0, end); buffer = buffer.slice(end + 1);
      if (!frame) continue;
      const message = JSON.parse(frame);
      const slot = pending.get(message.id);
      if (!slot) continue;
      pending.delete(message.id); clearTimeout(slot.timer);
      if (message.error) slot.reject(new Error(JSON.stringify(message.error)));
      else slot.resolve(message.result);
    }
  });
  function call(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Chrome timeout: ${method}`)); }, 10000);
      pending.set(id, { resolve, reject, timer });
      chrome.stdio[3].write(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }) + "\0");
    });
  }
  async function close() {
    if (chrome.exitCode === null && chrome.signalCode === null) {
      const exited = new Promise((resolve) => chrome.once("exit", resolve));
      const kill = setTimeout(() => chrome.kill("SIGKILL"), 3000);
      chrome.kill("SIGTERM");
      await exited; clearTimeout(kill);
    }
    rejectPending(new Error("Chrome test finished"));
    chrome.stdio[3].destroy(); chrome.stdio[4].destroy();
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
  try {
    const { targetId } = await call("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
    await call("Page.enable", {}, sessionId);
    await call("Emulation.setDeviceMetricsOverride", { width, height: 800, deviceScaleFactor: 1, mobile: false }, sessionId);
    await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "no-preference" }] }, sessionId);
    const evaluate = async (expression) => {
      const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    return { close, evaluate, async navigate(url) {
      await call("Page.navigate", { url }, sessionId);
      const deadline = Date.now() + 5000;
      while (Date.now() < deadline) {
        if (await evaluate("document.documentElement.dataset.browserSmoke")) return;
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      throw new Error("The page did not finish its browser checks");
    } };
  } catch (error) { await close(); throw error; }
}
