import {
  loadCatalog,
  groupByCategoria,
  getDestacados,
} from "@/lib/catalog";
import ProductGrid from "./components/ProductGrid";

// ISR: la página se regenera como máximo cada 60s. Marcelo ve sus cambios de
// precio/stock en ~1 minuto sin esperar un nuevo deploy, y no pagamos un
// render por request (innecesario para este volumen).
export const revalidate = 60;

export default async function Home() {
  const { products, status } = await loadCatalog();

  // Fetch fallido y sin catálogo previo: mensaje claro, nunca pantalla en
  // blanco ni error crudo.
  if (status === "error") {
    return (
      <main className="main">
        <header className="hero">
          <h1>Marcelo Store</h1>
        </header>
        <p className="aviso">
          El catálogo está temporalmente no disponible. Volvé a intentar en unos
          minutos.
        </p>
      </main>
    );
  }

  const destacados = getDestacados(products);
  const categorias = groupByCategoria(products);

  return (
    <main className="main">
      <header className="hero">
        <h1>Marcelo Store</h1>
      </header>

      {destacados.length > 0 && (
        <section className="seccion" aria-labelledby="destacados">
          <h2 id="destacados" className="seccion__titulo">
            Destacados
          </h2>
          <ProductGrid products={destacados} />
        </section>
      )}

      {categorias.map(({ categoria, products: items }) => (
        <section
          key={categoria}
          className="seccion"
          aria-labelledby={`cat-${categoria}`}
        >
          <h2 id={`cat-${categoria}`} className="seccion__titulo">
            {categoria}
          </h2>
          <ProductGrid products={items} />
        </section>
      ))}

      {products.length === 0 && (
        <p className="aviso">Todavía no hay productos cargados.</p>
      )}
    </main>
  );
}
