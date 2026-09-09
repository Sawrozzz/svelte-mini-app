import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { createManifest } from "./src/lib/createManifest.ts";

export default defineConfig({
  plugins: [svelte(), tailwindcss(), createManifest()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    target: "chrome89",
    manifest: "manifest.json",
    outDir: "dist",
    cssCodeSplit: true,
    lib: {
      entry: "./src/main.ts",
      name: "SvelteMiniApp",
      formats: ["es"],
      fileName: () => "[name][hash].js",
    },
    rollupOptions: {
      output: {
        format: "es",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  server: {
    host: "0.0.0.0",
    cors: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
});
