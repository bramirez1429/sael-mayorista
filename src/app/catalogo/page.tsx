import Link from "next/link";
import CatalogGallery from "../../components/CatalogGallery";
import { getCatalogProducts as getStoredCatalogProducts } from "../../lib/catalog";
import {
  catalogProductColors,
  type CatalogProduct,
} from "../../data/catalogProducts";

async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const colorsByName = new Map(
    catalogProductColors.map((color) => [color.name.toLowerCase(), color]),
  );
  const products = await getStoredCatalogProducts();
  return products.map((product) => ({
      id: product.id,
      image: product.image,
      title: product.name,
      description: "",
      colors: product.colors
        .map((color) => colorsByName.get(color))
        .filter((color): color is (typeof catalogProductColors)[number] => Boolean(color)),
    }));
}

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const products = await getCatalogProducts();
  return (
    <main className="catalog-page">
      <div className="catalog-page-shell">
        <Link className="back-link" href="/">
          Volver
        </Link>
        <header className="catalog-page-hero">
          <div className="eyebrow">
            <span>SAEL</span> MAYORISTA
          </div>
          <h1>CATÁLOGO</h1>
          <p>Conocé nuestra colección mayorista.</p>
        </header>
        <section aria-label="Precios mayoristas" style={{ marginBottom: 36 }}>
          <h2 style={{ color: "#6b6b6b", fontSize: 12, letterSpacing: "0.16em", margin: "0 0 14px", textTransform: "uppercase" }}>
            Precios mayoristas
          </h2>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <article style={{ background: "#ffffff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "18px 20px" }}>
              <span style={{ color: "#6b6b6b", display: "block", fontSize: 14, marginBottom: 6 }}>Precio por curva</span>
              <strong style={{ color: "#E30613", display: "block", fontSize: 30, letterSpacing: "-0.04em" }}>$7.500</strong>
            </article>
            <article style={{ background: "#ffffff", border: "1px solid #e8e8e8", borderRadius: 16, padding: "18px 20px" }}>
              <span style={{ color: "#6b6b6b", display: "block", fontSize: 14, marginBottom: 6 }}>Precio a elección</span>
              <strong style={{ color: "#E30613", display: "block", fontSize: 30, letterSpacing: "-0.04em" }}>$7.700</strong>
            </article>
          </div>
        </section>
        <section aria-label="Productos del catálogo">
          <CatalogGallery products={products} />
        </section>
      </div>
    </main>
  );
}
