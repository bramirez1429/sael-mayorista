"use client";

import { useEffect, useMemo, useState } from "react";
import { Drawer, Image, Modal } from "antd";
import type { CatalogProduct, ProductColor } from "../data/catalogProducts";
import { catalogKidsSizes } from "../data/catalogProducts";
import { SITE_CONFIG } from "../config/site";
import {
  buildWhatsAppMessage,
  detectCurve,
  generateOrderTicket,
  KIDS_SIZES,
  type KidsSize,
  type SelectedProduct,
  type SelectedVariant,
} from "../lib/order";

const STORAGE_KEY = "sael-selected-products";
type Mode = "curve" | "unit";

function createEmptyProduct(product: CatalogProduct): SelectedProduct {
  return {
    id: product.id,
    name: product.title,
    image: product.image,
    variants: [],
  };
}

function cloneProduct(product: SelectedProduct): SelectedProduct {
  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      sizes: variant.sizes.map((size) => ({ ...size })),
    })),
  };
}

function getProductUnits(product: SelectedProduct) {
  return product.variants.reduce(
    (total, variant) =>
      total + variant.sizes.reduce((sum, size) => sum + size.quantity, 0),
    0,
  );
}

function setCurveForColor(
  variant: SelectedVariant,
  curveCount: number,
): SelectedVariant {
  return {
    ...variant,
    sizes: KIDS_SIZES.map((size) => ({
      size,
      quantity: Math.max(1, curveCount),
    })),
  };
}

function SizeControls({
  variant,
  onChange,
}: {
  variant: SelectedVariant;
  onChange: (variant: SelectedVariant) => void;
}) {
  const changeSize = (size: KidsSize, quantity: number) =>
    onChange({
      ...variant,
      sizes: [
        ...variant.sizes.filter((item) => item.size !== size),
        ...(quantity > 0 ? [{ size, quantity }] : []),
      ].sort((a, b) => Number(a.size) - Number(b.size)),
    });
  return (
    <div className="variant-size-list">
      {catalogKidsSizes.map((size) => {
        const selected = variant.sizes.find((item) => item.size === size);
        return (
          <div className="variant-size-row" key={size}>
            <span>Talle {size}</span>
            {selected ? (
              <div className="quantity-control">
                <button
                  type="button"
                  onClick={() => changeSize(size, selected.quantity - 1)}
                  aria-label={`Disminuir talle ${size}`}
                >
                  -
                </button>
                <span>{selected.quantity}</span>
                <button
                  type="button"
                  onClick={() => changeSize(size, selected.quantity + 1)}
                  aria-label={`Aumentar talle ${size}`}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="size-add-button"
                type="button"
                onClick={() => changeSize(size, 1)}
              >
                Agregar
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CatalogGallery({
  products,
}: {
  products: CatalogProduct[];
}) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<SelectedProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogProduct | null>(null);
  const [draft, setDraft] = useState<SelectedProduct | null>(null);
  const [mode, setMode] = useState<Mode>("unit");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSelected(JSON.parse(stored) as SelectedProduct[]);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [loaded, selected]);

  const totalUnits = useMemo(
    () => selected.reduce((sum, product) => sum + getProductUnits(product), 0),
    [selected],
  );
  const updateDraft = (fn: (product: SelectedProduct) => SelectedProduct) =>
    setDraft((current) => (current ? fn(current) : current));
  const openProduct = (product: CatalogProduct) => {
    const saved = selected.find((item) => item.id === product.id);
    const next = saved ? cloneProduct(saved) : createEmptyProduct(product);
    const curve =
      next.variants.length > 0 &&
      next.variants.every((variant) => detectCurve(variant.sizes).isCurve);
    setEditing(product);
    setDraft(next);
    setMode(curve ? "curve" : "unit");
    setError("");
  };
  const closeProduct = () => {
    setEditing(null);
    setDraft(null);
    setError("");
  };
  const toggleColor = (color: ProductColor) =>
    updateDraft((product) =>
      product.variants.some((variant) => variant.colorName === color.name)
        ? {
            ...product,
            variants: product.variants.filter(
              (variant) => variant.colorName !== color.name,
            ),
          }
        : {
            ...product,
            variants: [
              ...product.variants,
              {
                colorName: color.name,
                colorHex: color.hex,
                sizes:
                  mode === "curve"
                    ? KIDS_SIZES.map((size) => ({ size, quantity: 1 }))
                    : [],
              },
            ],
          },
    );
  const updateVariant = (next: SelectedVariant) =>
    updateDraft((product) => ({
      ...product,
      variants: product.variants.map((variant) =>
        variant.colorName === next.colorName ? next : variant,
      ),
    }));
  const changeMode = (next: Mode) => {
    if (!draft || next === mode) return;
    if (
      getProductUnits(draft) > 0 &&
      !window.confirm(
        "Cambiar de modalidad puede reemplazar las cantidades cargadas. Queres continuar?",
      )
    )
      return;
    setMode(next);
    if (next === "curve")
      updateDraft((product) => ({
        ...product,
        variants: product.variants.map((variant) =>
          setCurveForColor(variant, 1),
        ),
      }));
  };
  const saveProduct = () => {
    if (
      !draft ||
      !draft.variants.length ||
      !draft.variants.some((variant) => variant.sizes.length)
    ) {
      setError("Selecciona al menos un color y un talle con cantidad.");
      return;
    }
    setSelected((current) => [
      ...current.filter((product) => product.id !== draft.id),
      {
        ...draft,
        variants: draft.variants.filter((variant) => variant.sizes.length),
      },
    ]);
    closeProduct();
  };
  const sendOrder = () => {
    const message = buildWhatsAppMessage(generateOrderTicket(), selected);
    window.open(
      `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const clearOrder = () => {
    if (window.confirm("Queres vaciar el pedido?")) setSelected([]);
  };

  return (
    <>
      <div className="catalog-selection-toolbar">
        <button
          className="catalog-selection-toggle"
          type="button"
          onClick={() => setSelectionMode((value) => !value)}
        >
          {selectionMode ? "Cancelar seleccion" : "Seleccionar productos"}
        </button>
      </div>
      <Image.PreviewGroup>
        <div className="catalog-grid">
          {products.map((product) => {
            const exists = selected.some((item) => item.id === product.id);
            return (
              <article
                className={`product-card${exists ? " product-card-selected" : ""}`}
                key={product.id}
              >
                <div className="product-image-wrapper">
                  <Image src={product.image} alt={product.title} preview />
                </div>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <div
                  className="product-colors"
                  aria-label="Colores disponibles"
                >
                  <span>Colores:</span>
                  <div className="product-color-list">
                    {product.colors.map((color) => (
                      <span
                        className="product-color"
                        key={color.name}
                        title={color.name}
                        aria-label={color.name}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
                {selectionMode && (
                  <button
                    className="product-select-button"
                    type="button"
                    onClick={() => openProduct(product)}
                  >
                    {exists ? "Editar seleccion" : "Seleccionar"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </Image.PreviewGroup>
      {selected.length > 0 && (
        <div className="selected-products-bar">
          <span>
            {selected.length} productos seleccionados - {totalUnits} unidades
          </span>
          <button type="button" onClick={() => setOrderOpen(true)}>
            Ver pedido
          </button>
        </div>
      )}
      <Modal
        open={Boolean(editing && draft)}
        onCancel={closeProduct}
        footer={null}
        title={editing?.title}
        width={520}
        className="product-config-modal"
      >
        <div className="product-modal-content">
          {editing && draft && (
            <>
              <img
                className="product-modal-image"
                src={editing.image}
                alt={editing.title}
              />
              <div className="modal-mode-selector">
                <strong>Como queres agregar este producto?</strong>
                <div>
                  <button
                    className={mode === "curve" ? "active" : ""}
                    type="button"
                    onClick={() => changeMode("curve")}
                  >
                    Por curva
                  </button>
                  <button
                    className={mode === "unit" ? "active" : ""}
                    type="button"
                    onClick={() => changeMode("unit")}
                  >
                    Por unidad
                  </button>
                </div>
              </div>
              <div className="modal-section">
                <strong>Colores</strong>
                <div className="modal-colors">
                  {editing.colors.map((color) => {
                    const active = draft.variants.some(
                      (variant) => variant.colorName === color.name,
                    );
                    return (
                      <button
                        className={`modal-color${active ? " modal-color-active" : ""}`}
                        type="button"
                        key={color.name}
                        onClick={() => toggleColor(color)}
                      >
                        <span style={{ backgroundColor: color.hex }}>
                          {active ? "✓" : ""}
                        </span>
                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              {mode === "curve" ? (
                <div className="curve-panel">
                  <strong>Curvas por color</strong>
                  {draft.variants.map((variant) => {
                    const detected = detectCurve(variant.sizes);
                    const count = detected.isCurve ? detected.curveCount : 1;
                    return (
                      <div className="curve-color-row" key={variant.colorName}>
                        <span className="curve-color-name">
                          <i style={{ backgroundColor: variant.colorHex }} />
                          {variant.colorName}
                        </span>
                        <div className="curve-control">
                          <button
                            type="button"
                            onClick={() =>
                              updateVariant(
                                setCurveForColor(variant, count - 1),
                              )
                            }
                          >
                            -
                          </button>
                          <span>{count}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateVariant(
                                setCurveForColor(variant, count + 1),
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <span className="curve-units">{count * 5} u.</span>
                      </div>
                    );
                  })}
                  <div className="modal-total">
                    Total: {getProductUnits(draft)} unidades
                  </div>
                </div>
              ) : (
                <div className="modal-unit-sections">
                  {draft.variants.map((variant) => (
                    <div
                      className="modal-section modal-variant"
                      key={variant.colorName}
                    >
                      <strong>{variant.colorName}</strong>
                      <SizeControls
                        variant={variant}
                        onChange={updateVariant}
                      />
                    </div>
                  ))}
                </div>
              )}
              {error && <p className="modal-validation">{error}</p>}
              <button
                className="modal-confirm-button"
                type="button"
                onClick={saveProduct}
              >
                {selected.some((product) => product.id === draft.id)
                  ? "Actualizar pedido"
                  : "Agregar al pedido"}
              </button>
            </>
          )}
        </div>
      </Modal>
      <Drawer
        title="PEDIDO SAEL"
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        width={420}
      >
        <div className="order-items">
          {selected.map((product) => (
            <div className="order-item" key={product.id}>
              <img src={product.image} alt="" />
              <div>
                <strong>{product.name}</strong>
                {product.variants.map((variant) => (
                  <div className="order-variant" key={variant.colorName}>
                    <span>{variant.colorName}</span>
                    <span>
                      {detectCurve(variant.sizes).isCurve
                        ? `${detectCurve(variant.sizes).curveCount} curvas`
                        : variant.sizes
                            .map((item) => `T${item.size}x${item.quantity}`)
                            .join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <span>Productos seleccionados: {selected.length}</span>
          <span>Total de unidades: {totalUnits}</span>
        </div>
        <button
          className="order-whatsapp-button"
          type="button"
          onClick={sendOrder}
        >
          Enviar pedido por WhatsApp
        </button>
        <button
          className="order-clear-button"
          type="button"
          onClick={clearOrder}
        >
          Vaciar pedido
        </button>
      </Drawer>
    </>
  );
}
