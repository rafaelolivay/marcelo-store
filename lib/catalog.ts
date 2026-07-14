import Papa from "papaparse";

/**
 * Capa de datos del catálogo. La fuente es una hoja de Google Sheets
 * publicada como CSV (sin API de Google, sin credenciales): solo un fetch
 * de una URL pública configurada en CATALOG_SHEET_URL.
 *
 * Esquema de columnas FIJO (no inventar otras):
 *   id, nombre, categoria, precio, imagen_url, disponible (Sí/No), destacado (Sí/No)
 */

export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  imagen_url: string;
  disponible: boolean;
  destacado: boolean;
}

/** Fila cruda del CSV, tal como la entrega papaparse con header:true. */
type RawRow = Record<string, string>;

/** Estado del catálogo devuelto al Server Component. */
export type CatalogStatus = "ok" | "stale" | "error";

export interface CatalogResult {
  products: Product[];
  status: CatalogStatus;
}

/**
 * Normaliza un "Sí"/"No" del cliente a boolean. Tolera mayúsculas, espacios y
 * acentos ("Sí", "si", "SI", " No "). Cualquier otro valor cae al `fallback`.
 */
function parseSiNo(value: string | undefined, fallback: boolean): boolean {
  const s = String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // saca acentos: "sí" -> "si"
  if (s === "si") return true;
  if (s === "no") return false;
  return fallback;
}

/**
 * Precio como entero de pesos. Descarta cualquier caracter no numérico, así
 * tolera separador de miles ("12.000" -> 12000) y símbolo ("$12.000" -> 12000).
 * El cliente carga números enteros (sin centavos) — ver USER_MANUAL.md.
 */
function parsePrecio(value: string | undefined): number {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

/** Convierte una fila cruda en Product, o null si no tiene nombre (fila vacía). */
function rowToProduct(row: RawRow): Product | null {
  const nombre = String(row.nombre ?? "").trim();
  if (!nombre) return null;

  const id = String(row.id ?? "").trim();

  return {
    // id es el identificador estable de la prenda (columna del CSV). Si faltara,
    // caemos al nombre para no quedarnos sin key de React.
    id: id || nombre,
    nombre,
    categoria: String(row.categoria ?? "").trim() || "Sin categoría",
    precio: parsePrecio(row.precio),
    imagen_url: String(row.imagen_url ?? "").trim(),
    disponible: parseSiNo(row.disponible, true), // sin dato => se asume disponible
    destacado: parseSiNo(row.destacado, false), // sin dato => no destacado
  };
}

/**
 * Parsea el CSV completo a Product[]. Función pura (sin red, sin estado) —
 * es la unidad principal cubierta por los tests con fixture local.
 */
export function parseCatalog(csv: string): Product[] {
  const { data } = Papa.parse<RawRow>(csv.trim(), {
    header: true,
    skipEmptyLines: true,
  });
  return data.map(rowToProduct).filter((p): p is Product => p !== null);
}

/** Agrupa productos por categoría, preservando el orden de aparición. */
export function groupByCategoria(
  products: Product[],
): Array<{ categoria: string; products: Product[] }> {
  const orden: string[] = [];
  const mapa = new Map<string, Product[]>();
  for (const p of products) {
    if (!mapa.has(p.categoria)) {
      mapa.set(p.categoria, []);
      orden.push(p.categoria);
    }
    mapa.get(p.categoria)!.push(p);
  }
  return orden.map((categoria) => ({ categoria, products: mapa.get(categoria)! }));
}

/** Productos con destacado=Sí (para la sección de portada). */
export function getDestacados(products: Product[]): Product[] {
  return products.filter((p) => p.destacado);
}

/**
 * Trae el CSV desde CATALOG_SHEET_URL. Usa el Data Cache de Next con
 * revalidate=60 (ISR): Marcelo ve sus cambios de precio/stock en ~1 minuto
 * sin necesidad de un nuevo deploy. Lanza si falta la env o el fetch falla.
 */
export async function fetchCatalogCsv(): Promise<string> {
  const url = process.env.CATALOG_SHEET_URL;
  if (!url) {
    throw new Error("CATALOG_SHEET_URL no está definida");
  }
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Fetch del CSV falló con status ${res.status}`);
  }
  return res.text();
}

/**
 * Crea un cargador de catálogo con memoria del último catálogo bueno.
 *
 * Si el fetch/parseo falla pero antes hubo una carga exitosa, devuelve ese
 * último catálogo con status "stale" (así una caída puntual de la hoja no deja
 * la tienda vacía). Si nunca hubo una carga buena, devuelve status "error" para
 * que la UI muestre el mensaje de "temporalmente no disponible" — nunca una
 * pantalla en blanco ni un error crudo.
 *
 * Se expone como factory para poder crear instancias aisladas en los tests.
 */
export function createCatalogLoader(
  fetcher: () => Promise<string> = fetchCatalogCsv,
) {
  let lastGood: Product[] | null = null;

  return async function loadCatalog(): Promise<CatalogResult> {
    try {
      const products = parseCatalog(await fetcher());
      lastGood = products;
      return { products, status: "ok" };
    } catch {
      if (lastGood) {
        return { products: lastGood, status: "stale" };
      }
      return { products: [], status: "error" };
    }
  };
}

/** Instancia usada por la app. */
export const loadCatalog = createCatalogLoader();
