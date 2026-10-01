"use client";

import { Image } from "antd";
import type { CatalogProduct } from "../data/catalogProducts";

export default function CatalogGallery({ products }: { products: CatalogProduct[] }) {
  return <Image.PreviewGroup><div className="catalog-grid">{products.map((product) => <article className="product-card" key={product.id}><div className="product-image-wrapper"><Image src={product.image} alt={product.title} preview /></div><h2>{product.title}</h2><p>{product.description}</p><div className="product-colors" aria-label="Colores disponibles"><span>Colores:</span><div className="product-color-list">{product.colors.map((color) => <span className="product-color" key={color.name} title={color.name} aria-label={color.name} style={{ backgroundColor: color.hex }} />)}</div></div></article>)}</div></Image.PreviewGroup>;
}
