import { fileURLToPath } from "node:url";
// `vitest/config` re-exports Vite's own defineConfig plus the `test` key —
// one config file for both `vite build` and `vitest`, instead of two.
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Vitest's transform pipeline doesn't always pick up the JSX runtime
  // @vitejs/plugin-react applies for `vite build` — pinning it here too
  // keeps test files from needing an explicit `import React` just to use JSX.
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setupTests.js"],
  },
});
