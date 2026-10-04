import fs from "node:fs/promises";
import path from "node:path";

export const CATALOG_COLORS = ["rosa", "lila", "blanco"] as const;
export type CatalogColor = (typeof CATALOG_COLORS)[number];

export type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  colors: CatalogColor[];
};

const catalogPath = path.join(process.cwd(), "data", "catalog.json");

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const content = await fs.readFile(catalogPath, "utf8");
    const products = JSON.parse(content) as CatalogProduct[];
    return Array.isArray(products) ? products : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function saveCatalogProducts(products: CatalogProduct[]) {
  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  await fs.writeFile(catalogPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}
