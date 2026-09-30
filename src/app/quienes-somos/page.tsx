import WhatsAppCta from "../../components/WhatsAppCta";
import { AppIcon } from "../components/AppIcon";

export default function QuienesSomosPage() {
  return <main className="about-page"><div className="about-page-shell">
    <a className="back-link" href="/"><AppIcon name="arrow-left" /> Volver al inicio</a>
    <header className="about-page-hero"><div className="eyebrow"><span>SAEL</span> MAYORISTA</div><h1>QUIÉNES SOMOS</h1></header>
    <article className="about-copy">
      <div className="about-copy-icon"><AppIcon name="team" /></div>
      <p className="about-lead">Sael Tendencia nació con un propósito: que cada mujer se sienta linda, segura y empoderada.</p>
      <p>Queremos que nuestras prendas acompañen tu esencia y te ayuden a expresarte tal como sos.</p>
      <p>Este sueño empezó en familia y fue creciendo con nosotros. Inspirados por nuestros hijos, nació también Sael Kids, dando lugar a nuevos comienzos y aprendizajes.</p>
      <p className="about-closing">Somos más que ropa: somos actitud, identidad y amor en cada detalle.</p>
    </article>
  
  </div></main>;
}
