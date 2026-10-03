
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Divider, Drawer, Form, Image, Modal } from "antd";
import type { CatalogProduct, ProductColor } from "../data/catalogProducts";
import {
  catalogKidsSizes,
  catalogProductColors,
} from "../data/catalogProducts";
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
import CustomerOrderForm, { type CustomerOrderData } from "./CustomerOrderForm";

const STORAGE_KEY = "sael-selected-products";
type Mode = "curve" | "unit";
type AssortedMode = "quantity" | "curve";
type AssortedColorSelection = ProductColor & { amount: number };

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
                <Button type="default"
                  onClick={() => changeSize(size, selected.quantity - 1)}
                  aria-label={`Disminuir talle ${size}`}
                >
                  -
                </Button>
                <span>{selected.quantity}</span>
                <Button type="default"
                  onClick={() => changeSize(size, selected.quantity + 1)}
                  aria-label={`Aumentar talle ${size}`}
                >
                  +
                </Button>
              </div>
            ) : (
              <Button type="default"
                className="size-add-button"
                onClick={() => changeSize(size, 1)}
              >
                Agregar
              </Button>
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
  const [selected, setSelected] = useState<SelectedProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogProduct | null>(null);
  const [draft, setDraft] = useState<SelectedProduct | null>(null);
  const [mode, setMode] = useState<Mode>("unit");
  const [error, setError] = useState("");
  const [assortedOpen, setAssortedOpen] = useState(false);
  const [assortedMode, setAssortedMode] = useState<AssortedMode>("quantity");
  const [assortedColors, setAssortedColors] = useState<
    AssortedColorSelection[]
  >([]);
  const [assortedError, setAssortedError] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerForm] = Form.useForm<CustomerOrderData>();

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
  const removeProductSelection = (productId: string) => {
    setSelected((current) => current.filter((product) => product.id !== productId));
  };
  const clearAllSelections = () => {
    setSelected([]);
    window.localStorage.removeItem(STORAGE_KEY);
  };
  const sendOrder = async () => {
    if (selected.length === 0) return;
    const customer = await customerForm.validateFields();
    const message = buildWhatsAppMessage(generateOrderTicket(), selected, customer);
    window.open(
      `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSelected([]);
    window.localStorage.removeItem(STORAGE_KEY);
    customerForm.resetFields();
    setCustomerOpen(false);
    setOrderOpen(false);
  };
  const clearOrder = () => {
    if (window.confirm("Queres vaciar el pedido?")) {
      setSelected([]);
      window.localStorage.removeItem(STORAGE_KEY);
      setOrderOpen(false);
    }
  };
  const openAssorted = () => {
    setAssortedColors(
      catalogProductColors.map((color) => ({ ...color, amount: 0 })),
    );
    setAssortedMode("quantity");
    setAssortedError("");
    setAssortedOpen(true);
  };
  const updateAssortedColor = (name: string, amount: number) =>
    setAssortedColors((colors) =>
      colors.map((color) =>
        color.name === name ? { ...color, amount: Math.max(0, amount) } : color,
      ),
    );
  const assortedTotal = assortedColors.reduce(
    (sum, color) => sum + color.amount * (assortedMode === "curve" ? 5 : 1),
    0,
  );
  const sendAssortedOrder = () => {
    const active = assortedColors.filter((color) => color.amount > 0);
    if (!active.length) {
      setAssortedError("Selecciona al menos una cantidad.");
      return;
    }
    const lines = active.map((color) =>
      assortedMode === "curve"
        ? `${color.name}: ${color.amount} ${color.amount === 1 ? "curva" : "curvas"}`
        : `${color.name}: ${color.amount} u.`,
    );
    const message = [
      "PEDIDO SAEL - SURTIDO",
      `Ticket: ${generateOrderTicket()}`,
      "",
      "Surtido de modelos mas vendidos",
      "",
      ...lines,
      "",
      `Total: ${assortedTotal} u.`,
      "",
      "Quiero confirmar disponibilidad.",
    ].join("\n");
    window.open(
      `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setAssortedOpen(false);
  };

  return (
    <>
      <div className="catalog-selection-toolbar">
        <button
          className="catalog-selection-toggle"
          type="button"
          onClick={openAssorted}
        >
          Arma tu pedido surtido
        </button>
      </div>
      <Divider titlePlacement="center" plain>
        Arma tu pedido a eleccion
      </Divider>
      {selected.length > 0 && (
        <div className="catalog-clear-selections">
          <Button type="default" danger onClick={clearAllSelections}>
            Eliminar selecciones
          </Button>
        </div>
      )}
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
                <Button type="default"
                  className="product-select-button"
                  onClick={() => openProduct(product)}
                >
                  {exists ? "Editar seleccion" : "Seleccionar"}
                </Button>
                {exists && (
                  <Button
                    type="link"
                    danger
                    className="product-remove-selection"
                    onClick={() => removeProductSelection(product.id)}
                  >
                    Eliminar selección
                  </Button>
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
          <Button type="default" onClick={() => setOrderOpen(true)}>Ver pedido</Button>
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
                  <Button type="default"
                    className={mode === "curve" ? "active" : ""}
                    onClick={() => changeMode("curve")}
                  >
                    Por curva
                  </Button>
                  <Button type="default"
                    className={mode === "unit" ? "active" : ""}
                    onClick={() => changeMode("unit")}
                  >
                    Por unidad
                  </Button>
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
                      <Button type="default" 
                      style={{padding:'0px 20px 0px 10px'}}
                        className={`modal-color${active ? " modal-color-active" : ""}`}
                        onClick={() => toggleColor(color)}
                      >
                        <span style={{ backgroundColor: color.hex, border:'solid 1px #e4e4e4'}}>
                          {active ? "✔" : ""}
                        </span>
                        {color.name}
                      </Button>
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
                          <Button type="default"
                            onClick={() =>
                              updateVariant(
                                setCurveForColor(variant, count - 1),
                              )
                            }
                          >
                            -
                          </Button>
                          <span>{count}</span>
                          <Button type="default"
                            onClick={() =>
                              updateVariant(
                                setCurveForColor(variant, count + 1),
                              )
                            }
                          >
                            +
                          </Button>
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
              <Button type="default" className="modal-confirm-button" onClick={saveProduct}>
                {selected.some((product) => product.id === draft.id)
                  ? "Actualizar pedido"
                  : "Agregar al pedido"}
              </Button>
            </>
          )}
        </div>
      </Modal>
      <Modal
        open={assortedOpen}
        onCancel={() => setAssortedOpen(false)}
        footer={null}
        title="Opcion mas rapida"
        width={440}
      >
        <div className="assorted-modal-content">
          <p>
            Elegi cantidades y colores. Nosotros armamos el surtido con los
            modelos mas vendidos.
          </p>
          <div className="modal-mode-selector">
            <div>
              <Button type="default"
                className={assortedMode === "quantity" ? "active" : ""}
                onClick={() => setAssortedMode("quantity")}
              >
                Por cantidad
              </Button>
              <Button type="default"
                className={assortedMode === "curve" ? "active" : ""}
                onClick={() => setAssortedMode("curve")}
              >
                Por curva
              </Button>
            </div>
          </div>
          <div className="assorted-color-list">
            {assortedColors.map((color) => (
              <div className="assorted-color-row" key={color.name}>
                <span className="curve-color-name">
                  <i style={{ backgroundColor: color.hex }} />
                  {color.name}
                </span>
                <div className="quantity-control">
                  <Button type="default"
                    onClick={() =>
                      updateAssortedColor(color.name, color.amount - 1)
                    }
                  >
                    -
                  </Button>
                  <span>{color.amount}</span>
                  <Button type="default"
                    onClick={() =>
                      updateAssortedColor(color.name, color.amount + 1)
                    }
                  >
                    +
                  </Button>
                </div>
                {assortedMode === "curve" && (
                  <small>{color.amount * 5} u.</small>
                )}
              </div>
            ))}
          </div>
          <div className="modal-total">Total: {assortedTotal} unidades</div>
          {assortedError && <p className="modal-validation">{assortedError}</p>}
          <Button type="default" className="modal-confirm-button" onClick={sendAssortedOrder}>
            Enviar pedido surtido por WhatsApp
          </Button>
        </div>
      </Modal>
      <Drawer
        title="PEDIDO SAEL"
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        size={420}
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
        <Button
          type="primary"
          block
          className="order-whatsapp-button"
          onClick={() => setCustomerOpen(true)}
        >
          Continuar con datos
        </Button>
        <Button type="link"
          block
          className="order-clear-button"
          onClick={clearOrder}
          danger
        >
          Vaciar pedido
        </Button>
      </Drawer>
      <Modal
        open={customerOpen}
        title="Datos para tu pedido"
        onCancel={() => setCustomerOpen(false)}
        destroyOnHidden
        width={520}
        className="customer-order-modal"
        footer={[
          <Button key="cancel" onClick={() => setCustomerOpen(false)}>Cancelar</Button>,
          <Button key="send" type="primary" className="order-whatsapp-button" onClick={sendOrder}>Enviar pedido por WhatsApp</Button>,
        ]}
      >
        <p className="customer-order-intro">Completa tus datos para coordinar el pedido y el envio.</p>
        <Form form={customerForm} layout="vertical" requiredMark="optional">
          <CustomerOrderForm />
        </Form>
      </Modal>
    </>
  );
}
