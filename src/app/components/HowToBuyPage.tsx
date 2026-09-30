import { SITE_CONFIG } from "../../config/site";
import { AppIcon, type AppIconName } from "./AppIcon";
import WhatsAppCta from "../../components/WhatsAppCta";
import Link from "next/link";

const formattedMinimum = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
}).format(SITE_CONFIG.minimumPurchase);

const steps: {
  number: string;
  icon: AppIconName;
  title: string;
  text: React.ReactNode;
}[] = [
  {
    number: "01",
    icon: "shopping",
    title: "ELEGÍ TUS PRODUCTOS",
    text: "RECORRÉ NUESTRO CATÁLOGO Y ELEGÍ LOS MODELOS, TALLES Y COLORES QUE QUIERAS PARA TU NEGOCIO.",
  },
  {
    number: "02",
    icon: "check-circle",
    title: "VERIFICÁ LA COMPRA MÍNIMA",
    text: (
      <>
        Recordá que la compra mínima es de <strong>{formattedMinimum}</strong>{" "}
        en productos.
        <br />
        Podés combinar distintos modelos, talles y colores.
      </>
    ),
  },
  {
    number: "03",
    icon: "whatsapp",
    title: "CONFIRMÁ TU PEDIDO",
    text: "Enviános tu selección por WhatsApp y verificamos disponibilidad antes de avanzar.",
  },
  {
    number: "04",
    icon: "credit-card",
    title: "ELEGÍ EL MEDIO DE PAGO",
    text: "Te informamos las opciones de pago disponibles para completar tu compra.",
  },
  {
    number: "05",
    icon: "truck",
    title: "PREPARAMOS Y ENVIAMOS TU PEDIDO",
    text: "Una vez confirmado el pago, preparamos tu pedido y coordinamos el envío a todo el país.",
  },
];

export default function HowToBuyPage() {
  return (
    <main className="how-to-buy-page">
      <div className="how-to-buy-shell">
        <Link className="back-link" href="/">
          <AppIcon name="arrow-left" /> Volver al inicio
        </Link>
        <header className="how-to-buy-hero">
          <div className="eyebrow">
            <span>SAEL</span> MAYORISTA
          </div>
          <h1>¿CÓMO COMPRAR?</h1>
          <p>Comprar en SAEL Mayorista es simple y rápido.</p>
          <p>Seguí estos pasos para realizar tu pedido:</p>
        </header>
        <section className="buy-steps" aria-label="Pasos para comprar">
          {steps.map((step) => (
            <article className="buy-step" key={step.number}>
              <div className="buy-step-number">{step.number}</div>
              <div className="buy-step-content">
                <div className="buy-step-icon">
                  <AppIcon name={step.icon} />
                </div>
                <div className="buy-step-copy">
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
        <WhatsAppCta
          className="buy-cta"
          question="¿Tenés alguna duda?"
          description="Escribinos por WhatsApp y con gusto te ayudamos."
        />
        
      </div>
    </main>
  );
}
