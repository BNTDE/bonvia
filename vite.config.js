import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base ("./") makes the built site work unchanged on any host —
// GitHub Pages project sites (/<repo>/), Cloudflare Pages (/), a custom
// domain, or even opened straight from disk. No host-specific path to keep
// in sync, so switching hosts later needs no rebuild config change.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "dist", sourcemap: false },
});
