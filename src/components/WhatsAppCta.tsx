import { SITE_CONFIG } from "../config/site";
import { AppIcon } from "../app/components/AppIcon";

type WhatsAppCtaProps = { className?: string; question?: string; description?: string };

export default function WhatsAppCta({ className = "minimum-cta", question = "¿Tenés alguna duda?", description }: WhatsAppCtaProps) {
  const WHATSAPP_LINK = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
  return <section className={className}><div><p className="buy-cta-question">{question}</p>{description && <p>{description}</p>}</div><a className="whatsapp-button" href={WHATSAPP_LINK} target="_blank" rel="noreferrer"><AppIcon name="whatsapp" /> Hablar por WhatsApp</a></section>;
}
