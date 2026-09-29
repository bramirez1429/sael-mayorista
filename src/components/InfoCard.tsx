import type { HomeCard } from "../data/homeCards";
import CardIcon from "./CardIcon";

export default function InfoCard({ card }: { card: HomeCard }) {
  return <a className="info-card home-info-card" href={card.href} target={card.id === "whatsapp" ? "_blank" : undefined} rel={card.id === "whatsapp" ? "noreferrer" : undefined}>
    <div className="home-info-icon"><CardIcon name={card.icon} /></div>
    <h3>{card.title}</h3>
    <div className="home-info-subtitle">{card.subtitle}</div>
    <p>{card.description}</p>
    <span className="home-info-cta">{card.cta}<span aria-hidden="true">→</span></span>
  </a>;
}
