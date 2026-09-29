"use client";

import {
  ArrowRightOutlined,
  CreditCardOutlined,
  InstagramOutlined,
  ShoppingOutlined,
  TikTokOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { SITE_CONFIG } from "../../config/site";

const WHATSAPP_LINK = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;

export default function LandingPage() {
  return (
    <main className="site-shell">
      <header className="hero">
        <div className="eyebrow"><span>SAEL</span> MAYORISTA</div>
        <h1>Indumentaria para tu emprendimiento</h1>
        <p>Modelos, talles y diseños pensados para hacer crecer tu negocio.</p>
      </header>

      <section className="cards-grid" aria-label="Información mayorista">
        <a className="catalog-card card-link" href="/catalogo" id="catalogo">
          <div className="catalog-topline"><span>COLECCIÓN MAYORISTA</span><span className="red-dot" /></div>
          <div className="catalog-content">
            <h2>CATÁLOGO<br /><span>SAEL</span></h2>
            <p>Remeras · Mujer · Kids</p>
            <small>Modelos, talles, colores y precios mayoristas.</small>
          </div>
          <span className="catalog-cta">Ver catálogo <ArrowRightOutlined /></span>
        </a>

        <a className="info-card minimum-card minimum-card-link" href="/compra-minima">
          <div className="card-icon"><ShoppingOutlined /></div>
          <h3>Mínimo de compra</h3>
          <div className="minimum-value">{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(SITE_CONFIG.minimumPurchase)}</div>
          <p>Podés combinar modelos, talles y colores hasta completar el mínimo.</p>
        </a>

        <article className="info-card whatsapp-card" id="contacto">
          <div className="card-icon"><WhatsAppOutlined /></div>
          <h3>WhatsApp</h3>
          <p>¿Tenés una consulta o querés hacer tu pedido?</p>
          <a className="whatsapp-button" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
            <WhatsAppOutlined /> Hablar por WhatsApp
          </a>
        </article>

        <a className="info-card how-card how-card-link" href="/como-comprar">
          <div className="card-icon"><CreditCardOutlined /></div>
          <div className="subtle-icon"><ArrowRightOutlined /></div>
          <h3>CÓMO COMPRAR</h3>
          <p>Conocé cómo realizar tu pedido mayorista de forma simple y rápida.</p>
        </a>

        <article className="info-card about-card">
          <div className="card-icon subtle-icon"><ArrowRightOutlined /></div>
          <h3>Quiénes somos</h3>
          <p>Somos SAEL. Trabajamos para ofrecer indumentaria pensada para emprendedores y comercios que buscan variedad, diseño y calidad.</p>
        </article>
      </section>

      <hr className="site-divider" />
      <footer className="footer">
        <div><div className="footer-brand">SAEL <span>MAYORISTA</span></div><p>Envíos a todo el país</p></div>
        <nav className="social-links" aria-label="Redes sociales">
          <a href="#instagram" aria-label="Instagram"><InstagramOutlined /></a>
          <a href="#tiktok" aria-label="TikTok"><TikTokOutlined /></a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppOutlined /></a>
        </nav>
        <small>© 2026 SAEL</small>
      </footer>
    </main>
  );
}
