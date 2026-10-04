import Link from "next/link";
import CatalogAdmin from "../../../components/CatalogAdmin";
import { getCatalogProducts } from "../../../lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminCatalogoPage() {
  const products = await getCatalogProducts();
  return (
    <main className="admin-catalog-page">
      <div className="admin-catalog-shell">
        <Link className="back-link" href="/">Volver</Link>
        <header className="admin-catalog-hero">
          <div className="eyebrow"><span>SAEL</span> ADMINISTRACIÓN</div>
          <h1>CATÁLOGO</h1>
          <p>Subí imágenes y definí los colores disponibles para cada producto.</p>
        </header>
        <CatalogAdmin initialProducts={products} />
      </div>
    </main>
  );
}
