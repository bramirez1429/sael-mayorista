import { SITE_CONFIG } from "../config/site";

export type HomeCard = {
  id: string;
  icon: "minimum" | "whatsapp" | "buy" | "about";
  title: string;
  subtitle: string;
  description: string;
  href: string;
  cta: string;
};

export const homeCards: HomeCard[] = [
  { id: "minimum", icon: "minimum", title: "Mínimo de compra", subtitle: "Compra mayorista", description: "Combiná modelos, talles y colores hasta completar el mínimo.", href: "/compra-minima", cta: "Ver condiciones" },
  { id: "whatsapp", icon: "whatsapp", title: "WhatsApp", subtitle: "Estamos para ayudarte", description: "Consultanos por productos, disponibilidad o tu próximo pedido.", href: `https://wa.me/${SITE_CONFIG.whatsappNumber}`, cta: "Escribinos" },
  { id: "buy", icon: "buy", title: "Cómo comprar", subtitle: "Simple y rápido", description: "Conocé cómo realizar tu pedido mayorista paso a paso.", href: "/como-comprar", cta: "Ver cómo comprar" },
  { id: "about", icon: "about", title: "Quiénes somos", subtitle: "Conocé SAEL", description: "Conocé nuestra marca y cómo trabajamos para acompañar tu negocio.", href: "/quienes-somos", cta: "Conocernos" },
];
