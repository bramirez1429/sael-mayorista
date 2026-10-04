import { randomUUID } from "node:crypto";
import path from "node:path";
import { put } from "@vercel/blob";
import {
  getCatalogProducts,
  parseCatalogColors,
  saveCatalogProducts,
  type CatalogProduct,
} from "../../../../lib/catalog";
import {
  jsonResponse,
  optionsResponse,
  unauthorizedResponse,
} from "../../../../lib/catalogApi";

export const runtime = "nodejs";

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

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

export async function GET() {
  try {
    return jsonResponse(await getCatalogProducts());
  } catch (error) {
    console.error("Error al leer el catálogo:", error);
    return jsonResponse({ error: "No se pudo leer el catálogo." }, 500);
  }
}

export async function POST(request: Request) {
  const unauthorized = unauthorizedResponse(request);
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

    const colors = parseCatalogColors(formData.get("colors"));
    if (!colors.length) return jsonResponse({ error: "Selecciona al menos un color." }, 400);

    const suppliedName = String(formData.get("name") || "").trim();
    const name = suppliedName || titleFromFilename(file.name);
    const id = `${slugify(name)}-${randomUUID().slice(0, 8)}`;
    const pathname = `catalogo/images/${id}${extension}`;
    const blob = await put(pathname, file, { access: "public" });
    const product: CatalogProduct = { id, name, image: blob.url, colors };
    const products = await getCatalogProducts();
    await saveCatalogProducts([...products, product]);
    return jsonResponse(product, 201);
  } catch (error) {
    console.error("Error al guardar la imagen del catálogo:", error);
    return jsonResponse({ error: "No se pudo guardar la imagen." }, 500);
  }
}

export async function PUT(request: Request) {
  const unauthorized = unauthorizedResponse(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as { id?: string; colors?: unknown };
    const colors = parseCatalogColors(body.colors);
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
    return jsonResponse({ error: "No se pudieron actualizar los colores." }, 500);
  }
}

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}
