import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite-ը մեր նախագծի «շարժիչն» է՝ գործարկում է dev սերվերը և հավաքում (build) կայքը:
export default defineConfig({
  plugins: [react()],
});
