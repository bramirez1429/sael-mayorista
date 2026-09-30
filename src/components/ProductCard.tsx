import Image from "next/image";
import type { CatalogProduct } from "../data/catalogProducts";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  return <article className="product-card"><div className="product-image-wrapper"><Image src={product.image} alt={product.title} fill sizes="(max-width: 899px) 50vw, 25vw" /></div><h2>{product.title}</h2><p>{product.description}</p></article>;
}
