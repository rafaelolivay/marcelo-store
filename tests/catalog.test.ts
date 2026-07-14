import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import {
  parseCatalog,
  groupByCategoria,
  getDestacados,
  createCatalogLoader,
} from "@/lib/catalog";

// Fixture local: los tests NO tocan la hoja real ni la red (mismo principio
// que traza/posta/ancla).
const FIXTURE = readFileSync(
  join(__dirname, "fixtures", "catalog.csv"),
  "utf8",
);

describe("parseCatalog", () => {
  it("parsea todas las filas con nombre del CSV", () => {
    const products = parseCatalog(FIXTURE);
    expect(products).toHaveLength(6);
    expect(products[0]).toEqual({
      id: "REM-001",
      nombre: "Remera Blanca Básica",
      categoria: "Remeras",
      precio: 8500,
      imagen_url: "https://example.com/remera-blanca.jpg",
      disponible: true,
      destacado: true,
    });
  });

  it("conserva el id del CSV y cae al nombre si falta", () => {
    const products = parseCatalog(FIXTURE);
    expect(products.map((p) => p.id)).toEqual([
      "REM-001",
      "REM-002",
      "PAN-001",
      "PAN-002",
      "BUZ-001",
      "CAM-001",
    ]);

    // Sin columna id, el id cae al nombre (para no quedarnos sin key).
    const sinId =
      "nombre,categoria,precio,imagen_url,disponible,destacado\n" +
      "Solo Nombre,Cat,100,http://x/1.jpg,Sí,No\n";
    expect(parseCatalog(sinId)[0].id).toBe("Solo Nombre");
  });

  it("tipa precio como number", () => {
    const products = parseCatalog(FIXTURE);
    for (const p of products) {
      expect(typeof p.precio).toBe("number");
    }
    expect(products.find((p) => p.nombre === "Campera Inflable")?.precio).toBe(
      45000,
    );
  });

  it("mapea disponible=No a false (producto sigue presente, no se oculta)", () => {
    const products = parseCatalog(FIXTURE);
    const negra = products.find((p) => p.nombre === "Remera Negra Básica");
    expect(negra).toBeDefined();
    expect(negra?.disponible).toBe(false);
    const campera = products.find((p) => p.nombre === "Campera Inflable");
    expect(campera?.disponible).toBe(false);
  });

  it("mapea destacado=Sí a true", () => {
    const products = parseCatalog(FIXTURE);
    const destacados = products.filter((p) => p.destacado).map((p) => p.nombre);
    expect(destacados).toEqual([
      "Remera Blanca Básica",
      "Jean Slim Azul",
      "Campera Inflable",
    ]);
  });

  it("tolera separador de miles y símbolo en precio", () => {
    const csv =
      "nombre,categoria,precio,imagen_url,disponible,destacado\n" +
      "X,Cat,$12.500,http://x/1.jpg,Sí,No\n";
    expect(parseCatalog(csv)[0].precio).toBe(12500);
  });

  it("tolera acentos/mayúsculas/espacios en Sí/No", () => {
    const csv =
      "nombre,categoria,precio,imagen_url,disponible,destacado\n" +
      "A,Cat,100,http://x/1.jpg, SI ,sí\n" +
      "B,Cat,100,http://x/2.jpg,no,NO\n";
    const [a, b] = parseCatalog(csv);
    expect(a.disponible).toBe(true);
    expect(a.destacado).toBe(true);
    expect(b.disponible).toBe(false);
    expect(b.destacado).toBe(false);
  });

  it("descarta filas sin nombre", () => {
    const csv =
      "nombre,categoria,precio,imagen_url,disponible,destacado\n" +
      ",Cat,100,http://x/1.jpg,Sí,No\n" +
      "Real,Cat,100,http://x/2.jpg,Sí,No\n";
    const products = parseCatalog(csv);
    expect(products).toHaveLength(1);
    expect(products[0].nombre).toBe("Real");
  });
});

describe("groupByCategoria", () => {
  it("agrupa por categoría preservando el orden de aparición", () => {
    const grupos = groupByCategoria(parseCatalog(FIXTURE));
    expect(grupos.map((g) => g.categoria)).toEqual([
      "Remeras",
      "Pantalones",
      "Buzos",
      "Camperas",
    ]);
    const remeras = grupos.find((g) => g.categoria === "Remeras");
    expect(remeras?.products).toHaveLength(2);
  });
});

describe("getDestacados", () => {
  it("devuelve solo los destacados", () => {
    const destacados = getDestacados(parseCatalog(FIXTURE));
    expect(destacados).toHaveLength(3);
    expect(destacados.every((p) => p.destacado)).toBe(true);
  });
});

describe("createCatalogLoader (fallback ante fallo de red)", () => {
  it("status ok cuando el fetch anda", async () => {
    const load = createCatalogLoader(async () => FIXTURE);
    const res = await load();
    expect(res.status).toBe("ok");
    expect(res.products).toHaveLength(6);
  });

  it("status error (catálogo vacío, sin pantalla en blanco) si nunca cargó", async () => {
    const load = createCatalogLoader(async () => {
      throw new Error("red caída");
    });
    const res = await load();
    expect(res.status).toBe("error");
    expect(res.products).toEqual([]);
  });

  it("status stale devolviendo el último catálogo bueno tras una caída", async () => {
    let falla = false;
    const load = createCatalogLoader(async () => {
      if (falla) throw new Error("red caída");
      return FIXTURE;
    });

    const ok = await load();
    expect(ok.status).toBe("ok");

    falla = true;
    const stale = await load();
    expect(stale.status).toBe("stale");
    expect(stale.products).toHaveLength(6);
  });
});
