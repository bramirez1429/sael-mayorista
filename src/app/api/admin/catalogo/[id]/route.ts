import { del } from "@vercel/blob";
import {
  getCatalogProducts,
  parseCatalogColors,
  saveCatalogProducts,
} from "../../../../../lib/catalog";
import {
  jsonResponse,
  optionsResponse,
  unauthorizedResponse,
} from "../../../../../lib/catalogApi";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = unauthorizedResponse(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = (await request.json()) as { colors?: unknown };
    const colors = parseCatalogColors(body.colors);
    if (!colors.length) return jsonResponse({ error: "Selecciona al menos un color." }, 400);

    const products = await getCatalogProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return jsonResponse({ error: "Imagen no encontrada." }, 404);
    products[index] = { ...products[index], colors };
    await saveCatalogProducts(products);
    return jsonResponse(products[index]);
  } catch (error) {
    console.error("Error al actualizar los colores del catálogo:", error);
    return jsonResponse({ error: "No se pudieron actualizar los colores." }, 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = unauthorizedResponse(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const products = await getCatalogProducts();
    const product = products.find((item) => item.id === id);
    if (!product) return jsonResponse({ error: "Imagen no encontrada." }, 404);

    const nextProducts = products.filter((item) => item.id !== id);
    await saveCatalogProducts(nextProducts);

    if (isVercelBlobUrl(product.image)) {
      try {
        await del(product.image);
      } catch (error) {
        console.warn("No se pudo eliminar la imagen de Vercel Blob.", error);
      }
    }

    return jsonResponse({ ok: true, id });
  } catch (error) {
    console.error("Error al eliminar la imagen del catálogo:", error);
    return jsonResponse({ error: "No se pudo eliminar la imagen." }, 500);
  }
}

function isVercelBlobUrl(image: string) {
  try {
    const url = new URL(image);
    return url.protocol === "https:" && url.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}
