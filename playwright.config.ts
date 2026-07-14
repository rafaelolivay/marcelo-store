import { defineConfig, devices } from "@playwright/test";

// Config acotada a la captura de screenshots de evidencia (TICKET-002).
// Levanta dos servidores: el csv-server con el fixture del catálogo y la app
// Next apuntada a ese CSV vía CATALOG_SHEET_URL. Todo local, sin red real.
const CSV_PORT = 8899;
const APP_PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    // Chromium suele necesitar --no-sandbox en entornos containerizados/CI.
    launchOptions: { args: ["--no-sandbox"] },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `node tests/e2e/csv-server.mjs ${CSV_PORT}`,
      port: CSV_PORT,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run dev -- -p ${APP_PORT}`,
      port: APP_PORT,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        CATALOG_SHEET_URL: `http://localhost:${CSV_PORT}/catalog.csv`,
      },
    },
  ],
});
