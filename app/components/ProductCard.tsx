import Image from "next/image";
import type { Product } from "@/lib/catalog";

const precioFmt = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }: { product: Product }) {
  const { nombre, precio, imagen_url, disponible } = product;

  return (
    <article className={`card${disponible ? "" : " card--agotado"}`}>
      <div className="card__img">
        {imagen_url ? (
          <Image
            src={imagen_url}
            alt={nombre}
            fill
            sizes="(max-width: 600px) 50vw, 240px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="card__img-placeholder" aria-hidden="true" />
        )}
        {!disponible && <span className="badge">Sin stock</span>}
      </div>
      <h3 className="card__nombre">{nombre}</h3>
      <p className="card__precio">{precioFmt.format(precio)}</p>
    </article>
  );
}
