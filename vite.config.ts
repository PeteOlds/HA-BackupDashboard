import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    target: "es2019",
    outDir: "dist",
    lib: {
      entry: "src/backup-card.ts",
      formats: ["es"],
      fileName: () => "backup-card.js",
    },
  },
});
