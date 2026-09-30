import { SITE_CONFIG } from "../../config/site";
import Link from "next/link";
import Image from "next/image";
import { AppIcon, type AppIconName } from "./AppIcon";
import logoSael from "../../images/logo/logo actual 29-09-26 white.png";

const WHATSAPP_LINK = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;

const formattedMinimum = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
}).format(SITE_CONFIG.minimumPurchase);

type LandingCard = {
  id: string;
  className: string;
  icon: AppIconName;
  title: string;
  description: string;
  href?: string;
  value?: string;
  button?: {
    text: string;
    href: string;
    icon?: AppIconName;
  };
  arrow?: boolean;
};

const landingCards: LandingCard[] = [
  {
    id: "minimum",
    className: "info-card minimum-card minimum-card-link",
    icon: "shopping",
    title: "Mínimo de compra",
    value: formattedMinimum,
    description:
      "Podés combinar modelos, talles y colores hasta completar el mínimo.",
    href: "/compra-minima",
    arrow: true,
  },
  
  {
    id: "como-comprar",
    className: "info-card how-card how-card-link",
    icon: "credit-card",
    title: "CÓMO COMPRAR",
    description:
      "Conocé cómo realizar tu pedido mayorista de forma simple y rápida.",
    href: "/como-comprar",
    arrow: true,
  },
  {
    id: "tabla-talles",
    className: "info-card sizes-card",
    icon: "measure",
    title: "Tabla de talles",
    description:
      "Consultá las medidas y encontrá el talle ideal para cada prenda.",
    href: "/tabla-de-talles",
    arrow: true,
  },
  {
    id: "about",
    className: "info-card about-card",
    icon: "team",
    href: "/quienes-somos",
    arrow: true,
    title: "Quiénes somos",
    description:
      "Somos SAEL. Indumentaria para emprendedores y negocios que buscan variedad, calidad y diseño.",
  },
  {
    id: "contacto",
    className: "info-card whatsapp-card",
    icon: "whatsapp",
    title: "WhatsApp",
    description: "¿Tenés una consulta o querés hacer tu pedido?",
    button: {
      text: "Hablar por WhatsApp",
      href: WHATSAPP_LINK,
      icon: "whatsapp",
    },
  },
];

export default function LandingPage() {
  return (
    <main className="site-shell">
      <header className="hero">
        <div className="eyebrow">
          <span>SAEL</span> MAYORISTA
        </div>

        <h1>Indumentaria para tu negocio</h1>

        <p>
          Modelos, talles y diseños pensados para hacer crecer tu negocio.
        </p>
      </header>

      <section className="cards-grid" aria-label="Información mayorista">
        {/* CATÁLOGO: queda separado y exactamente con el mismo diseño */}
        <Link
          className="catalog-card card-link"
          href="/catalogo"
          id="catalogo"
        >
          <div className="catalog-topline">
            <span>COLECCIÓN MAYORISTA</span>
            <span className="red-dot" />
          </div>

          <div className="catalog-content">
            <Image src={logoSael} alt="SAEL" className="catalog-logo" /><h2>
              CATÁLOGO
            </h2>

            <p>Remeras y Buzos · Mujer · Niña</p>

            <small>
              Modelos, talles, colores y precios mayoristas.
            </small>
          </div>

          <span className="catalog-cta">
            Ver catálogo <AppIcon name="arrow" />
          </span>
        </Link>

        {landingCards.map((card) => {
          const content = (
            <>
              <div
                className="card-icon"
              >
                <AppIcon name={card.icon} />
              </div>

              {card.arrow && (
                <div className="subtle-icon card-arrow">
                  <AppIcon name="arrow" />
                </div>
              )}

              <h2>{card.title}</h2>

              {card.value && (
                <div className="minimum-value">{card.value}</div>
              )}

              <p>{card.description}</p>

              {card.button && (
                <a
                  className="whatsapp-button"
                  href={card.button.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {card.button.icon && (
                    <AppIcon name={card.button.icon} />
                  )}

                  {card.button.text}
                </a>
              )}
            </>
          );

          if (card.href) {
            return (
              <Link
                key={card.id}
                id={card.id}
                className={card.className}
                href={card.href}
              >
                {content}
              </Link>
            );
          }

          return (
            <article
              key={card.id}
              id={card.id}
              className={card.className}
            >
              {content}
            </article>
          );
        })}
      </section>

      <hr className="site-divider" />

      <footer className="footer">
        <div>
          <div className="footer-brand">
            SAEL <span>MAYORISTA</span>
          </div>

          <p>Envíos a todo el país</p>
        </div>

        <nav className="social-links" aria-label="Redes sociales">
          <a href={SITE_CONFIG.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram SAEL Tendencia">
            <AppIcon name="instagram" />
          </a>

          <a href={SITE_CONFIG.socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok SAEL Tendencia">
            <AppIcon name="tiktok" />
          </a>

          <a href={SITE_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook SAEL Tendencia">
            <AppIcon name="facebook" />
          </a>
        </nav>

        <small>© 2026 SAEL</small>
      </footer>
    </main>
  );
}
