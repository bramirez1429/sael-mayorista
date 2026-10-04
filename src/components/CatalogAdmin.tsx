"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button, Checkbox, Input, message } from "antd";
import type { CatalogColor, CatalogProduct } from "../lib/catalog";

const colors: { value: CatalogColor; label: string }[] = [
  { value: "rosa", label: "Rosa" },
  { value: "lila", label: "Lila" },
  { value: "blanco", label: "Blanco" },
];

export default function CatalogAdmin({ initialProducts }: { initialProducts: CatalogProduct[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [name, setName] = useState("");
  const [selectedColors, setSelectedColors] = useState<CatalogColor[]>([]);
  const [draftColors, setDraftColors] = useState<Record<string, CatalogColor[]>>({});
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const upload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file || !selectedColors.length) return message.error("Selecciona una imagen y al menos un color.");
    setSaving(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name);
    formData.append("colors", selectedColors.join(","));
    const response = await fetch("/api/admin/catalogo", { method: "POST", body: formData });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) return message.error(result.error || "No se pudo guardar la imagen.");
    setProducts((current) => [...current, result]);
    setName("");
    setSelectedColors([]);
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
    message.success("Imagen guardada.");
  };

  const updateColors = async (product: CatalogProduct) => {
    const nextColors = draftColors[product.id] || product.colors;
    if (!nextColors.length) return message.error("Cada imagen debe tener al menos un color.");
    const response = await fetch("/api/admin/catalogo", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, colors: nextColors }),
    });
    const result = await response.json();
    if (!response.ok) return message.error(result.error || "No se pudieron guardar los colores.");
    setProducts((current) => current.map((item) => item.id === result.id ? result : item));
    setDraftColors((current) => ({ ...current, [product.id]: result.colors }));
    message.success("Colores actualizados.");
  };

  return <>
    <form className="admin-upload-card" onSubmit={upload}>
      <h2>Nueva imagen</h2>
      <label>Imagen<input ref={fileInput} type="file" accept=".jpg,.jpeg,.png,.webp,.avif" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label>
      <label>Nombre<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Remera Mariposa" /></label>
      <ColorChecks value={selectedColors} onChange={setSelectedColors} />
      <Button htmlType="submit" type="primary" loading={saving}>Guardar imagen</Button>
    </form>
    <section className="admin-catalog-grid" aria-label="Imágenes del catálogo">
      {products.map((product) => <article className="admin-product-card" key={product.id}>
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <ColorChecks value={draftColors[product.id] || product.colors} onChange={(next) => setDraftColors((current) => ({ ...current, [product.id]: next }))} />
        <Button className="admin-save-button" onClick={() => updateColors(product)}>Guardar</Button>
      </article>)}
    </section>
  </>;
}

function ColorChecks({ value, onChange }: { value: CatalogColor[]; onChange: (value: CatalogColor[]) => void }) {
  return <fieldset className="admin-color-checks"><legend>Colores disponibles</legend>{colors.map((color) => <Checkbox key={color.value} checked={value.includes(color.value)} onChange={() => {
    const next = value.includes(color.value) ? value.filter((item) => item !== color.value) : [...value, color.value];
    onChange(next);
  }}>{color.label}</Checkbox>)}</fieldset>;
}
