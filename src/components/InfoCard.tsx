import type { HomeCard } from "../data/homeCards";
import CardIcon from "./CardIcon";
import Link from "next/link";

export default function InfoCard({ card }: { card: HomeCard }) {
  const content = <>
    <div className="home-info-icon"><CardIcon name={card.icon} /></div>
    <h3>{card.title}</h3>
    <div className="home-info-subtitle">{card.subtitle}</div>
    <p>{card.description}</p>
    <span className="home-info-cta">{card.cta}<span aria-hidden="true">→</span></span>
  </>;
  return card.href.startsWith("http") ? <a className="info-card home-info-card" href={card.href} target="_blank" rel="noopener noreferrer">{content}</a> : <Link className="info-card home-info-card" href={card.href}>{content}</Link>;
}
