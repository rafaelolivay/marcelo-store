import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      // Mismo alias @/* → raíz del proyecto que usa tsconfig.json, para que
      // los tests importen igual que la app.
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
