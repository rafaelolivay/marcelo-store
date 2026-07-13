# CLAUDE.md — marcelo-store

@../../ops/docs/CLAUDE-shared.md

## Específico de este repo

Proyecto de cliente (práctica) — NO es housekeeping de tooling interno.
Aplica DEFINITION_OF_DONE.md completo (ver ../../ops/DEFINITION_OF_DONE.md)
en cada ticket de feature, no el cierre liviano que usan ops/traza/posta/ancla.

Stack: Next.js, deploy en Vercel.

Ambientes: dev local → Vercel Preview (link automático por cada push,
usado para mostrarle avances al cliente antes de aprobar) → Vercel
producción. No se usa lab-server en este flujo.

Catálogo de productos gestionado por el cliente vía Google Sheets
(no hay panel de administración propio) — ver spec completa en
mem_context/mem_search (proyecto marcelo-store) antes de tocar
cualquier ticket relacionado a productos/catálogo.