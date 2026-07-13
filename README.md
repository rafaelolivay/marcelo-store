# marcelo-store

Tienda de ropa online para **Marcelo** (proyecto de cliente / práctica de la
consultora). Catálogo de prendas con carrusel de promociones en la portada y
contacto por WhatsApp. El catálogo lo gestiona el propio cliente vía Google
Sheets, sin panel de administración propio.

> Estado: **andamiaje inicial**. Este repo hoy contiene solo el scaffold de
> Next.js listo para desplegar. El catálogo, el carrusel, la integración con
> Google Sheets y Mercado Pago llegan en tickets siguientes (uno por pieza).

## Stack

- **Next.js** (App Router) + React + **TypeScript**
- Deploy en **Vercel**: cada push genera un Preview automático (para mostrarle
  avances al cliente antes de aprobar), y `main` publica a producción.
- Node 22

## Correr en local

Requisitos: Node 22 y npm.

```bash
npm install        # instala dependencias (una sola vez)
npm run dev        # levanta el server de desarrollo
```

Abrí <http://localhost:3000> en el navegador. El server recarga solo al guardar
cambios.

## Scripts

| Comando         | Qué hace                                             |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Server de desarrollo con hot-reload en `:3000`       |
| `npm run build` | Build de producción (lo mismo que corre Vercel y CI) |
| `npm run start` | Sirve el build de producción localmente              |
| `npm run lint`  | ESLint con la config de Next.js                      |

## Deploy

No requiere configuración adicional: Vercel detecta el proyecto Next.js y usa
`npm run build`. Ver el flujo dev → Preview → producción arriba.

## CI

`.github/workflows/ci.yml` corre **lint + build** en cada push y PR a `main`.
Si cualquiera falla, el check queda en rojo en GitHub.

## Para el cliente

Cómo actualizar el catálogo día a día está en
[USER_MANUAL.md](USER_MANUAL.md) — pensado para cualquiera, sin tecnicismos.
