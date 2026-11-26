import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const root = fileURLToPath(new URL("./", import.meta.url));
export default defineConfig({ root, plugins: [react()], server: { proxy: { "/api": "http://127.0.0.1:3000", "/health": "http://127.0.0.1:3000" } }, test: { environment: "jsdom", setupFiles: "./tests/setup.js", globals: true } });
