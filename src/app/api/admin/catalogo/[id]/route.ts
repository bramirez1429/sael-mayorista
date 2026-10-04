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

export async function OPTIONS(request: Request) {
  return optionsResponse(request);
}
