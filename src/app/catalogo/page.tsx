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
        <section aria-label="Productos del catálogo">
          <CatalogGallery products={products} />
        </section>
      </div>
    </main>
  );
}
