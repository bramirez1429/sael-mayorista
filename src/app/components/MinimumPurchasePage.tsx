import { SITE_CONFIG } from "../../config/site";
import WhatsAppCta from "../../components/WhatsAppCta";
import { AppIcon } from "./AppIcon";
import Link from "next/link";

const formattedMinimum = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
}).format(SITE_CONFIG.minimumPurchase);

export default function MinimumPurchasePage() {
  return (
    <main className="minimum-page">
      <div className="minimum-page-shell">
        <Link className="back-link" href="/">
          <AppIcon name="arrow-left" /> Volver al inicio
        </Link>
        <header className="minimum-hero">
            <div className="eyebrow">
            <span>SAEL</span> MAYORISTA
          </div>
          <h1>COMPRA MÍNIMA</h1>
          <p>Para realizar tu pedido mayorista, la compra mínima es de:</p>
        </header>
        <section className="minimum-main-card" aria-labelledby="minimum-amount">
         
          <div id="minimum-amount" className="minimum-page-value">
            {formattedMinimum}
          </div>
          <div className="minimum-label">EN PRODUCTOS</div>
          <p>
            Podés combinar modelos, talles y colores hasta completar el mínimo.
          </p>
        </section>
        <section className="minimum-important">
          <AppIcon name="info-circle" />
          <div>
            <strong>IMPORTANTE</strong>
            <p>
              El monto mínimo corresponde al total de productos, sin incluir el
              costo del envío.
            </p>
            <p>
              La compra mínima es de 2 curvas de una misma línea: 2 curvas de
              Adulto o 2 curvas de Niña. No se combinan entre sí.
            </p>
          </div>
        </section>
        <section className="minimum-benefits">
          <article>
            <span>01</span>
            <h2>MÁS VARIEDAD</h2>
            <p>
              Podés armar tu pedido combinando modelos, talles y colores según
              tu negocio.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>PEDIDOS MAYORISTAS</h2>
            <p>
              Nuestros precios mayoristas están pensados para acompañar el
              crecimiento de tu negocio.
            </p>
          </article>
        </section>
        <WhatsAppCta />
      </div>
    </main>
  );
}
