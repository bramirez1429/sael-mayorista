
export type KidsSize = "6" | "8" | "10" | "12" | "14";
export type SelectedVariant = {
  colorName: string;
  colorHex: string;
  sizes: { size: KidsSize; quantity: number }[];
};
export type SelectedProduct = {
  id: string;
  name: string;
  image: string;
  variants: SelectedVariant[];
};
export const KIDS_SIZES: KidsSize[] = ["6", "8", "10", "12", "14"];

export function detectCurve(sizes: { size: KidsSize; quantity: number }[]) {
  if (
    sizes.length !== KIDS_SIZES.length ||
    !KIDS_SIZES.every((size) => sizes.some((item) => item.size === size))
  )
    return { isCurve: false as const };
  const quantities = KIDS_SIZES.map(
    (size) => sizes.find((item) => item.size === size)?.quantity ?? 0,
  );
  return quantities.every(
    (quantity) => quantity > 0 && quantity === quantities[0],
  )
    ? { isCurve: true as const, curveCount: quantities[0] }
    : { isCurve: false as const };
}

export function generateOrderTicket() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(new Date())
    .reduce<Record<string, string>>(
      (result, part) => ({ ...result, [part.type]: part.value }),
      {},
    );
  const suffix = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `SAEL-${parts.year}${parts.month}${parts.day}-${parts.hour}${parts.minute}-${suffix}`;
}

export function buildWhatsAppMessage(
  ticket: string,
  products: SelectedProduct[],
  customer?: {
    name: string;
    dni: string;
    locality: string;
    province: string;
    postalCode: string;
    email: string;
    phone: string;
    transport: string;
    deliveryType: string;
  },
) {
  const body = products.flatMap((product, index) => {
    const curves = product.variants
      .map((variant) => ({ ...variant, curve: detectCurve(variant.sizes) }))
      .filter((variant) => variant.curve.isCurve);
    const manual = product.variants.filter(
      (variant) => !detectCurve(variant.sizes).isCurve,
    );
    const curveLines: string[] = [];
    const grouped = new Map<number, string[]>();
    curves.forEach((variant) => {
      const count = variant.curve.isCurve ? variant.curve.curveCount : 0;
      grouped.set(count, [...(grouped.get(count) ?? []), variant.colorName]);
    });
    grouped.forEach((colors, count) =>
      curveLines.push(
        colors.length > 1
          ? `${colors.join(" + ")}\n${count} curvas c/u`
          : `${colors[0]}: ${count} ${count === 1 ? "curva" : "curvas"}`,
      ),
    );
    const manualLines = manual.map(
      (variant) =>
        `${variant.colorName}: ${variant.sizes.map((item) => `T${item.size}x${item.quantity}`).join(", ")}`,
    );
    return [`${index + 1}. ${product.name}`, ...curveLines, ...manualLines, ""];
  });
  const units = products.reduce(
    (sum, product) =>
      sum +
      product.variants.reduce(
        (variantSum, variant) =>
          variantSum +
          variant.sizes.reduce((sizeSum, item) => sizeSum + item.quantity, 0),
        0,
      ),
    0,
  );
  const customerLines = customer
    ? [
        "DATOS DEL CLIENTE",
        "",
        `Nombre: ${customer.name}`,
        `DNI: ${customer.dni}`,
        `Localidad: ${customer.locality}`,
        `Provincia: ${customer.province}`,
        `Codigo postal: ${customer.postalCode}`,
        `Mail: ${customer.email}`,
        `Telefono: ${customer.phone}`,
        `Transporte: ${customer.transport}`,
        `Entrega: ${customer.deliveryType}`,
        "",
      ]
    : [];
  return [
    "PEDIDO SAEL MAYORISTA",
    "",
    `Ticket: ${ticket}`,
    "",
    ...customerLines,
    "PEDIDO",
    "",
    ...body,
    `Total de productos: ${products.length}`,
    `Total de unidades: ${units}`,
    "",
    "Quisiera consultar disponibilidad y finalizar el pedido.",
  ].join("\n");
}

