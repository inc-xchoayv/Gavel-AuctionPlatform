import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite-ը մեր նախագծի «շարժիչն» է՝ գործարկում է dev սերվերը և հավաքում (build) կայքը:
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true, // Թույլատրում է ngrok, տեղային ցանց (LAN) և ցանկացած թունել
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://127.0.0.1:8000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
