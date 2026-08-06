import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite';
import { createManifest } from './src/utils/createManifest.ts';

export default defineConfig({
  plugins: [svelte(), tailwindcss(), createManifest()],
  build: {
    target: 'chrome89',
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
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  },
  server: {
    host: "0.0.0.0",
    cors: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
});
