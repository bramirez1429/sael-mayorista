import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

export const CATALOG_COLORS = ["rosa", "lila", "blanco"] as const;
export type CatalogColor = (typeof CATALOG_COLORS)[number];

export type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  colors: CatalogColor[];
};

const catalogPath = path.join(process.cwd(), "data", "catalog.json");
const localImagePrefix = "/images/catalogo/";
const localImagesPath = path.join(process.cwd(), "public", "images", "catalogo");
const statePrefix = "catalogo/state/";

export function parseCatalogColors(value: unknown): CatalogColor[] {
  let values: unknown[] = [];
  if (Array.isArray(value)) values = value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      values = Array.isArray(parsed) ? parsed : value.split(",");
    } catch {
      values = value.split(",");
    }
  }
  return [...new Set(values.map((color) => String(color).trim()))].filter(
    (color): color is CatalogColor => CATALOG_COLORS.includes(color as CatalogColor),
  );
}

async function filterCatalogProducts(products: CatalogProduct[]): Promise<CatalogProduct[]> {
  const checkedProducts = await Promise.all(
    products.map(async (product) => {
      if (!product.image.startsWith(localImagePrefix)) return product;

      const filename = product.image.slice(localImagePrefix.length);
      if (!filename || filename.includes("/") || filename.includes("\\")) return null;

      try {
        await fs.access(path.join(localImagesPath, filename));
        return product;
      } catch {
        return null;
      }
    }),
  );
  return checkedProducts.filter((product): product is CatalogProduct => product !== null);
}

async function getInitialCatalog(): Promise<CatalogProduct[]> {
  try {
    const content = await fs.readFile(catalogPath, "utf8");
    const products = JSON.parse(content) as CatalogProduct[];
    return Array.isArray(products) ? filterCatalogProducts(products) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function getStateBlobs() {
  try {
    const blobs = [];
    let cursor: string | undefined;
    do {
      const result = cursor
        ? await list({ prefix: statePrefix, cursor })
        : await list({ prefix: statePrefix });
      blobs.push(...result.blobs);
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
    return blobs;
  } catch (error) {
    console.warn("Vercel Blob no disponible, usando catalogo inicial.", error);
    return [];
  }
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const snapshots = await getStateBlobs();
  if (!snapshots.length) return getInitialCatalog();

  const latest = snapshots.sort(
    (first, second) => second.uploadedAt.getTime() - first.uploadedAt.getTime(),
  )[0];
  const response = await fetch(latest.url, { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudo leer el snapshot del catálogo.");
  const products = (await response.json()) as CatalogProduct[];
  return Array.isArray(products) ? filterCatalogProducts(products) : [];
}

export async function saveCatalogProducts(products: CatalogProduct[]) {
  const pathname = `${statePrefix}${Date.now()}-${randomUUID()}.json`;
  await put(pathname, JSON.stringify(products, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}
