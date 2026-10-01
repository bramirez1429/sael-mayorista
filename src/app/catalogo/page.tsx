import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import CatalogGallery from "../../components/CatalogGallery";
import {
  catalogProductColors,
  type CatalogProduct,
} from "../../data/catalogProducts";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const catalogDir = path.join(process.cwd(), "public", "images", "catalogo");
  const files = await fs.readdir(catalogDir);
  return files
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
    .map((file) => ({
      id: file,
      image: `/images/catalogo/${encodeURIComponent(file)}`,
      title: titleFromFilename(file),
      description: "",
      colors: catalogProductColors,
    }));
}

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
