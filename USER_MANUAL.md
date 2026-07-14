# Manual de uso — Marcelo Store

Este manual es para vos, Marcelo. Explica, paso a paso y sin tecnicismos, cómo
manejar tu tienda en el día a día. No hace falta saber programar.

---

## Cómo actualizar tu catálogo (precios, stock, destacados)

Tu catálogo sale de una **planilla de Google Sheets** (parecida a un Excel).
Cada fila es una prenda. Editás la planilla y la tienda se actualiza sola: **no
tenés que tocar la página web ni avisarnos**. Los cambios aparecen en la tienda
en **más o menos 1 minuto** (a veces hay que refrescar la página del navegador).

> 📎 **El enlace a tu planilla** te lo pasamos aparte, ya listo y con tus prendas
> cargadas. Guardalo en favoritos. Editá **siempre esa misma planilla** — no
> hagas una copia nueva ni cambies el nombre de las columnas.

### Las columnas (no cambies los títulos ni el orden)

| Columna       | Qué poné                                                        |
| ------------- | -------------------------------------------------------------- |
| `id`          | Un código único e irrepetible por prenda. Ej: `REM-001` (ver abajo) |
| `nombre`      | El nombre de la prenda. Ej: `Remera Blanca Básica`             |
| `categoria`   | El grupo donde se muestra. Ej: `Remeras`, `Pantalones`         |
| `precio`      | Solo el número, sin `$` y sin centavos. Ej: `8500`             |
| `imagen_url`  | El enlace público a la foto (ver abajo)                        |
| `disponible`  | `Sí` si hay stock, `No` si está agotada                        |
| `destacado`   | `Sí` para que aparezca arriba de todo en "Destacados", si no `No` |

### Tareas del día a día

**Cambiar un precio:** buscá la fila de la prenda y escribí el nuevo número en
la columna `precio`. Nada más.

**Marcar una prenda como agotada:** poné `No` en la columna `disponible`. La
prenda **se sigue viendo** en la tienda, pero con un cartelito **"Sin stock"**.
No borres la fila: cuando vuelva a haber stock, poné `Sí` de nuevo.

**Destacar una prenda en la portada:** poné `Sí` en la columna `destacado`.
Aparece en la sección "Destacados" al principio de la página. Para sacarla de
ahí, poné `No`.

**Agregar una prenda nueva:** copiá una fila que ya exista (así no te olvidás de
ninguna columna), pegala abajo de todo y cambiale los datos. **Importante:**
cambiale el `id` por uno nuevo que no hayas usado nunca (por ejemplo, si la
última remera era `REM-004`, la nueva es `REM-005`). Dos prendas no pueden tener
el mismo `id`.

**Sacar una prenda para siempre:** borrá la fila completa.

### Sobre las fotos (`imagen_url`)

En esa columna va un **enlace a la foto**, no la foto en sí. Tiene que ser un
enlace **público** (que se pueda abrir sin pedir permiso). Si no sabés cómo
subir una foto y sacar su enlace, pasanos las fotos y te las dejamos con el
enlace puesto.

### Reglas para que no se rompa nada

- No cambies los **títulos de las columnas** ni el orden.
- Cada `id` es único: no repitas uno ni le cambies el `id` a una prenda que ya
  existe.
- En `disponible` y `destacado` usá solo `Sí` o `No`.
- En `precio` va solo el número (`12500`), sin `$` ni puntos.
- Si algo se ve raro en la tienda después de un cambio, avisanos **antes** de
  seguir tocando, así no se pierde nada.

---

## Cómo consultan o compran tus clientes (por ahora)

Los clientes ven el catálogo y te escriben por **WhatsApp** para consultar o
comprar. El pago con tarjeta desde la web (Mercado Pago) llega en una etapa
posterior; cuando esté, se agrega acá el paso a paso.

---

## ¿Algo no anda o querés un cambio?

Escribinos y lo vemos. No toques la configuración del sitio ni la planilla más
allá de lo que dice este manual: si algo se ve raro, avisá antes de intentar
arreglarlo, así no se pierde información.
