import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

// Captura del catálogo en 3 anchos. Solo screenshots de evidencia: sin asserts
// visuales ni comparación de baseline. Los PNG se guardan versionados en
// docs/backlog/evidence/ticket-002/ y se referencian en las notas de cierre.
const VIEWPORTS = [
  { width: 375, height: 812 }, // mobile
  { width: 768, height: 1024 }, // tablet
  { width: 1280, height: 900 }, // desktop
];

const OUT_DIR = join("docs", "backlog", "evidence", "ticket-002");

for (const vp of VIEWPORTS) {
  test(`screenshot del catálogo @ ${vp.width}px`, async ({ page }) => {
    mkdirSync(OUT_DIR, { recursive: true });
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    // Esperamos a que el catálogo esté renderizado antes de capturar.
    await page.getByRole("heading", { name: "Destacados" }).waitFor();
    await page.screenshot({
      path: join(OUT_DIR, `catalogo-${vp.width}.png`),
      fullPage: true,
    });
  });
}
