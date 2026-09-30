import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import { catalogProducts } from "../../data/catalogProducts";

export default function CatalogoPage() {
  return <main className="catalog-page"><div className="catalog-page-shell">
    <Link className="back-link" href="/">Volver</Link>
    <header className="catalog-page-hero"><div className="eyebrow"><span>SAEL</span> MAYORISTA</div><h1>CATÁLOGO</h1><p>Conocé nuestra colección mayorista.</p></header>
    <section className="catalog-grid" aria-label="Productos del catálogo">
      {catalogProducts.map((product) => <ProductCard key={product.id} product={product} />)}
    </section>
  </div></main>;
}
