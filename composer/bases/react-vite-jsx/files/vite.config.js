import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Keeps deep imports (e.g. `realtime/RealtimeContext.jsx` reaching into
    // `auth/AuthContext.jsx`) from turning into `../../../` chains as this
    // starter grows — matches `paths` in jsconfig.json below.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
