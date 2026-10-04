import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  CATALOG_COLORS,
  getCatalogProducts,
  saveCatalogProducts,
  type CatalogColor,
  type CatalogProduct,
} from "../../../../../lib/catalog";

export const runtime = "nodejs";

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const imagesPath = path.join(process.cwd(), "public", "images", "catalogo");

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "imagen";
}

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function validColors(value: FormDataEntryValue | null): CatalogColor[] {
  const raw = typeof value === "string" ? value.split(",") : [];
  return [...new Set(raw)].filter((color): color is CatalogColor =>
    CATALOG_COLORS.includes(color as CatalogColor),
  );
}

async function uniqueFilename(base: string, extension: string) {
  let filename = `${base}${extension}`;
  let count = 2;
  while (true) {
    try {
      await fs.access(path.join(imagesPath, filename));
      filename = `${base}-${count}${extension}`;
      count += 1;
    } catch {
      return filename;
    }
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Selecciona una imagen." }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.has(extension) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen válida." }, { status: 400 });
  }

  const colors = validColors(formData.get("colors"));
  if (!colors.length) {
    return NextResponse.json({ error: "Selecciona al menos un color." }, { status: 400 });
  }

  const suppliedName = String(formData.get("name") || "").trim();
  const name = suppliedName || titleFromFilename(file.name);
  const base = slugify(name);
  const filename = await uniqueFilename(base, extension);
  await fs.mkdir(imagesPath, { recursive: true });
  await fs.writeFile(path.join(imagesPath, filename), Buffer.from(await file.arrayBuffer()));

  const product: CatalogProduct = {
    id: `${slugify(path.parse(filename).name)}-${randomUUID().slice(0, 8)}`,
    name,
    image: `/images/catalogo/${filename}`,
    colors,
  };
  const products = await getCatalogProducts();
  await saveCatalogProducts([...products, product]);
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { id?: string; colors?: string[] };
  const colors = [...new Set(body.colors || [])].filter((color): color is CatalogColor =>
    CATALOG_COLORS.includes(color as CatalogColor),
  );
  if (!body.id || !colors.length) {
    return NextResponse.json({ error: "Producto y al menos un color son obligatorios." }, { status: 400 });
  }

  const products = await getCatalogProducts();
  const index = products.findIndex((product) => product.id === body.id);
  if (index === -1) return NextResponse.json({ error: "Imagen no encontrada." }, { status: 404 });
  products[index] = { ...products[index], colors };
  await saveCatalogProducts(products);
  return NextResponse.json(products[index]);
}
