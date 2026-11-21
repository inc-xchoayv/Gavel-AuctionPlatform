import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite-ը մեր նախագծի «շարժիչն» է՝ գործարկում է dev սերվերը և հավաքում (build) կայքը:
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true, // Թույլատրում է ngrok, տեղային ցանց (LAN) և ցանկացած թունել
  },
});
