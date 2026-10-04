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

async function getInitialCatalog(): Promise<CatalogProduct[]> {
  try {
    const content = await fs.readFile(catalogPath, "utf8");
    const products = JSON.parse(content) as CatalogProduct[];
    return Array.isArray(products) ? products : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function getStateBlobs() {
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
  return Array.isArray(products) ? products : [];
}

export async function saveCatalogProducts(products: CatalogProduct[]) {
  const pathname = `${statePrefix}${Date.now()}-${randomUUID()}.json`;
  await put(pathname, JSON.stringify(products, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}
