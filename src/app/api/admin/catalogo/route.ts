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
} from "../../../../lib/catalog";

export const runtime = "nodejs";

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const imagesPath = path.join(process.cwd(), "public", "images", "catalogo");
const adminDashboardOrigin = process.env.ADMIN_DASHBOARD_ORIGIN?.trim();

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": adminDashboardOrigin || "",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders() });
}

function originError(request: Request) {
  if (!adminDashboardOrigin) {
    return jsonResponse({ error: "Falta configurar ADMIN_DASHBOARD_ORIGIN." }, 500);
  }
  if (request.headers.get("origin") !== adminDashboardOrigin) {
    return jsonResponse({ error: "Origin no autorizado." }, 403);
  }
  return null;
}

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
  const unauthorized = originError(request);
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return jsonResponse({ error: "Selecciona una imagen." }, 400);
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.has(extension) || !file.type.startsWith("image/")) {
      return jsonResponse({ error: "El archivo debe ser una imagen válida." }, 400);
    }

    const colors = validColors(formData.get("colors"));
    if (!colors.length) {
      return jsonResponse({ error: "Selecciona al menos un color." }, 400);
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
    return jsonResponse(product, 201);
  } catch (error) {
    console.error("Error al guardar la imagen del catálogo:", error);
    return jsonResponse({ error: "No se pudo guardar la imagen" }, 500);
  }
}

export async function PUT(request: Request) {
  const unauthorized = originError(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as { id?: string; colors?: string[] };
    const colors = [...new Set(body.colors || [])].filter((color): color is CatalogColor =>
      CATALOG_COLORS.includes(color as CatalogColor),
    );
    if (!body.id || !colors.length) {
      return jsonResponse({ error: "Producto y al menos un color son obligatorios." }, 400);
    }

    const products = await getCatalogProducts();
    const index = products.findIndex((product) => product.id === body.id);
    if (index === -1) return jsonResponse({ error: "Imagen no encontrada." }, 404);
    products[index] = { ...products[index], colors };
    await saveCatalogProducts(products);
    return jsonResponse(products[index]);
  } catch (error) {
    console.error("Error al actualizar los colores del catálogo:", error);
    return jsonResponse({ error: "No se pudieron actualizar los colores" }, 500);
  }
}

export async function OPTIONS(request: Request) {
  const unauthorized = originError(request);
  if (unauthorized) return unauthorized;
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
