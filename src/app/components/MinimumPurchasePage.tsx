"use client";

import { ArrowLeftOutlined, InfoCircleOutlined, ShoppingOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { SITE_CONFIG } from "../../config/site";

const formattedMinimum = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(SITE_CONFIG.minimumPurchase);
const WHATSAPP_LINK = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;

export default function MinimumPurchasePage() {
  return <main className="minimum-page"><div className="minimum-page-shell">
    <a className="back-link" href="/"><ArrowLeftOutlined /> Volver a SAEL</a>
    <header className="minimum-hero"><div className="eyebrow"><span>SAEL</span> MAYORISTA</div><h1>COMPRA MÍNIMA</h1><p>Para realizar tu pedido mayorista, la compra mínima es de:</p></header>
    <section className="minimum-main-card" aria-labelledby="minimum-amount"><div className="minimum-main-icon"><ShoppingOutlined /></div><div id="minimum-amount" className="minimum-page-value">{formattedMinimum}</div><div className="minimum-label">EN PRODUCTOS</div><p>Podés combinar modelos, talles y colores hasta completar el mínimo.</p></section>
    <section className="minimum-whatsapp"><WhatsAppOutlined /><div><span>WhatsApp</span><a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">{SITE_CONFIG.whatsappDisplay}</a></div></section>
    <section className="minimum-important"><InfoCircleOutlined /><div><strong>IMPORTANTE</strong><p>El monto mínimo corresponde al total de productos, sin incluir el costo del envío.</p></div></section>
    <section className="minimum-benefits"><article><span>01</span><h2>MÁS VARIEDAD</h2><p>Podés armar tu pedido combinando modelos, talles y colores según tu negocio.</p></article><article><span>02</span><h2>PEDIDOS MAYORISTAS</h2><p>Nuestros precios mayoristas están pensados para acompañar el crecimiento de tu emprendimiento.</p></article></section>
    <section className="minimum-cta"><p>¿Tenés alguna duda?</p><a className="whatsapp-button" href={WHATSAPP_LINK} target="_blank" rel="noreferrer"><WhatsAppOutlined /> Hablar por WhatsApp</a></section>
  </div></main>;
}
