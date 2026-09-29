"use client";

import { ArrowLeftOutlined, CheckCircleOutlined, CreditCardOutlined, ShoppingOutlined, TruckOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { SITE_CONFIG } from "../../config/site";

const formattedMinimum = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(SITE_CONFIG.minimumPurchase);
const WHATSAPP_LINK = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;

const steps = [
  { number: "01", icon: <ShoppingOutlined />, title: "ELEGÍ TUS PRODUCTOS", text: "Recorré nuestro catálogo y elegí los modelos, talles y colores que quieras para tu negocio." },
  { number: "02", icon: <CheckCircleOutlined />, title: "VERIFICÁ LA COMPRA MÍNIMA", text: <>Recordá que la compra mínima es de <strong>{formattedMinimum}</strong> en productos.<br />Podés combinar distintos modelos, talles y colores.</> },
  { number: "03", icon: <WhatsAppOutlined />, title: "CONFIRMÁ TU PEDIDO", text: "Enviános tu selección por WhatsApp y verificamos disponibilidad antes de avanzar." },
  { number: "04", icon: <CreditCardOutlined />, title: "ELEGÍ EL MEDIO DE PAGO", text: "Te informamos las opciones de pago disponibles para completar tu compra." },
  { number: "05", icon: <TruckOutlined />, title: "PREPARAMOS Y ENVIAMOS TU PEDIDO", text: "Una vez confirmado el pago, preparamos tu pedido y coordinamos el envío a todo el país." },
];

export default function HowToBuyPage() {
  return <main className="how-to-buy-page"><div className="how-to-buy-shell">
    <a className="back-link" href="/"><ArrowLeftOutlined /> Volver a SAEL</a>
    <header className="how-to-buy-hero"><div className="eyebrow"><span>SAEL</span> MAYORISTA</div><h1>¿CÓMO COMPRAR?</h1><p>Comprar en SAEL Mayorista es simple y rápido.</p><p>Seguí estos pasos para realizar tu pedido:</p></header>
    <section className="buy-steps" aria-label="Pasos para comprar">
      {steps.map((step) => <article className="buy-step" key={step.number}><div className="buy-step-number">{step.number}</div><div className="buy-step-content"><div className="buy-step-icon">{step.icon}</div><div className="buy-step-copy"><h2>{step.title}</h2><p>{step.text}</p></div></div></article>)}
    </section>
    <section className="buy-cta"><div><p className="buy-cta-question">¿Tenés alguna duda?</p><p>Escribinos por WhatsApp y con gusto te ayudamos.</p></div><a className="whatsapp-button" href={WHATSAPP_LINK} target="_blank" rel="noreferrer"><WhatsAppOutlined /> Hablar por WhatsApp</a><small>Gracias por elegir SAEL para tu negocio.</small></section>
  </div></main>;
}
