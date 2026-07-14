# marcelo-store

Tienda de ropa online para **Marcelo** (proyecto de cliente / práctica de la
consultora). Catálogo de prendas con carrusel de promociones en la portada y
contacto por WhatsApp. El catálogo lo gestiona el propio cliente vía Google
Sheets, sin panel de administración propio.

> Estado: **en desarrollo**. Ya está el catálogo de productos leído desde
> Google Sheets (CSV publicado). El carrusel de promociones, el botón de
> WhatsApp y Mercado Pago llegan en tickets siguientes (uno por pieza).

## Catálogo (datos)

El catálogo se alimenta de una hoja de **Google Sheets publicada como CSV** —
sin API de Google ni credenciales, solo un `fetch` a una URL pública. La lógica
vive en [lib/catalog.ts](lib/catalog.ts) y la página usa **ISR** (`revalidate =
60`): los cambios de precio/stock del cliente se ven en ~1 minuto sin redeploy.
Si el fetch falla, se muestra el último catálogo bueno o un aviso claro, nunca
una pantalla en blanco. Esquema de columnas fijo: `id, nombre, categoria,
precio, imagen_url, disponible (Sí/No), destacado (Sí/No)`.

## Stack

- **Next.js** (App Router) + React + **TypeScript**
- Deploy en **Vercel**: cada push genera un Preview automático (para mostrarle
  avances al cliente antes de aprobar), y `main` publica a producción.
- Node 22

## Correr en local

Requisitos: Node 22 y npm.

```bash
npm install        # instala dependencias (una sola vez)
cp .env.example .env.local   # y completá CATALOG_SHEET_URL con el link CSV
npm run dev        # levanta el server de desarrollo
```

Abrí <http://localhost:3000> en el navegador. El server recarga solo al guardar
cambios. Sin `CATALOG_SHEET_URL` la app no rompe: muestra el aviso de "catálogo
temporalmente no disponible".

## Scripts

| Comando         | Qué hace                                             |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Server de desarrollo con hot-reload en `:3000`       |
| `npm run build` | Build de producción (lo mismo que corre Vercel y CI) |
| `npm run start` | Sirve el build de producción localmente              |
| `npm run lint`  | ESLint con la config de Next.js                      |
| `npm test`      | Tests con Vitest (fixture local, sin red)            |

## Deploy

No requiere configuración adicional: Vercel detecta el proyecto Next.js y usa
`npm run build`. Ver el flujo dev → Preview → producción arriba.

## CI

`.github/workflows/ci.yml` corre **lint + tests + build** en cada push y PR a
`main`. Si cualquiera falla, el check queda en rojo en GitHub.

## Para el cliente

Cómo actualizar el catálogo día a día está en
[USER_MANUAL.md](USER_MANUAL.md) — pensado para cualquiera, sin tecnicismos.
