import { AppIcon } from "../components/AppIcon";
import WhatsAppCta from "../../components/WhatsAppCta";
import SizeChartGallery, { type SizeChart } from "../../components/SizeChartGallery";
import Link from "next/link";
import currentSizeChart from "../../images/talles/TABLA DE TALLES 2026 - 2027.png";
import classicSizeChart from "../../images/talles/Tabla de talles.png";

const sizeCharts: SizeChart[] = [
  { id: "mujer", title: "Remera Mujer", src: currentSizeChart.src, alt: "Tabla de talles Remera Mujer" },
  { id: "nina", title: "Remera Niña", src: classicSizeChart.src, alt: "Tabla de talles Remera Niña" },
];

export default function TablaDeTallesPage() {
  return <main className="sizes-page"><div className="sizes-page-shell">
    <Link className="back-link" href="/"><AppIcon name="arrow-left" /> Volver al inicio</Link>
    <header className="sizes-page-hero"><div className="eyebrow"><span>SAEL</span> MAYORISTA</div><h1>TABLA DE TALLES</h1></header>
    <section className="size-charts" aria-label="Tablas de talles"><SizeChartGallery charts={sizeCharts} /></section>
    <WhatsAppCta />
  </div></main>;
}
