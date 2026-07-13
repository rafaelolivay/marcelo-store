---
id: TICKET-001
status: done
project: marcelo-store
---
## Título
Scaffolding inicial — Next.js, listo para Vercel

## Contexto
Antes de escribir código, usá mem_context (proyecto marcelo-store)
para ver la spec completa acordada con el cliente — no está toda
repetida acá, y no debe inventarse nada que no esté en esa memoria
ni en este ticket.

## Alcance
- Proyecto Next.js estándar (App Router), listo para deploy en Vercel
  sin configuración adicional
- README.md: qué es este proyecto (cliente de práctica), stack,
  cómo correr en local
- USER_MANUAL.md: cómo el cliente actualiza su catálogo vía Google
  Sheets (aunque la integración real venga en un ticket posterior,
  dejá la sección con placeholder claro de "pendiente")
- .claude/settings.json + .example.json: mismo patrón de siempre
  (deny git commit/push, sandbox estricto, denyRead de secretos)
- .gitignore correcto desde el commit inicial (node_modules/, .next/,
  .env*, etc.)
- .github/workflows/ci.yml básico: lint + build de Next.js en cada
  push (mismo patrón que ya usamos en traza/posta/ancla, adaptado a
  Node/Next en vez de Python)

## Todavía NO implementar: catálogo, carrusel, integración de Sheets,
Mercado Pago. Esto es solo andamiaje — la funcionalidad real viene
en tickets siguientes, uno por pieza.

## Criterios de aceptación
- [x] npm run dev levanta un Next.js en blanco sin errores
- [x] npm run build pasa limpio
- [x] CLAUDE.md, README, USER_MANUAL.md, settings.json/.example,
      .gitignore como se especifica
- [x] CI corre lint + build en GitHub Actions

## Notas de cierre
Andamiaje implementado con Next.js 15 (App Router) + React 19, Node 22.

Evidencia (local):
- `npm run lint` → "✔ No ESLint warnings or errors"
- `npm run build` → "✓ Compiled successfully"; ruta `/` prerenderizada
  estática (102 kB First Load JS)
- `npm run dev` → Ready, `GET / 200`, `<title>Marcelo Store</title>`

Estructura creada:
- `app/` (layout.js, page.js, globals.css) — landing "en construcción"
- `package.json`, `next.config.mjs`, `jsconfig.json`, `eslint.config.mjs`
  (flat config, `next/core-web-vitals`)
- `README.md`, `USER_MANUAL.md` (sección Google Sheets con placeholder
  "pendiente"), `.env.example`
- `.claude/settings.json` + `.example.json` (deny git commit/push,
  sandbox estricto, denyRead de secretos + `.env*`)
- `.gitignore` (node_modules/, .next/, .env*, .vercel, etc.)
- `.github/workflows/ci.yml` — lint + build en push/PR a main

NO implementado (a propósito, tickets siguientes): catálogo, carrusel,
integración Google Sheets, Mercado Pago.

Pendiente del gerente: commit/push inicial (no lo hace el agente) y
verificar el Preview automático en Vercel. Lighthouse queda para cuando
haya UI real (hoy es una landing placeholder).
