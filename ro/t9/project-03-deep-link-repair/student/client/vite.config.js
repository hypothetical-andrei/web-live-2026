import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: resolve("client"),
  plugins: [react()],
  build: {
    outDir: resolve("client-dist"),
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "assets/app-a1b2c3.js" } }
  }
});
