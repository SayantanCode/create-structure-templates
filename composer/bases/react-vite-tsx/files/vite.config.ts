import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Keeps deep imports (e.g. `realtime/RealtimeContext.tsx` reaching into
    // `auth/AuthContext.tsx`) from turning into `../../../` chains as this
    // starter grows — matches `paths` in tsconfig.json below.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
