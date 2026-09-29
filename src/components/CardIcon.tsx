export type IconName = "arrow" | "credit-card" | "instagram" | "shopping" | "tiktok" | "whatsapp" | "minimum" | "buy" | "about";

export default function CardIcon({ name }: { name: IconName }) {
  const common = { width: "1em", height: "1em", viewBox: "0 0 34 34", fill: "none", "aria-hidden": true } as const;
  if (name === "arrow" || name === "about") return <svg {...common}><path d="M6 17h21M19 9l8 8-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === "credit-card" || name === "buy") return <svg {...common}><rect x="4" y="7" width="26" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M4 13h26M9 21h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  if (name === "instagram") return <svg {...common}><rect x="6" y="6" width="22" height="22" rx="6" stroke="currentColor" strokeWidth="1.8" /><circle cx="17" cy="17" r="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="24" cy="10" r="1" fill="currentColor" /></svg>;
  if (name === "shopping" || name === "minimum") return <svg {...common}><path d="M6 10.5h22l-2 15H8l-2-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M10 10.5 13 5h8l3 5.5M12 15v6M17 15v6M22 15v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  if (name === "tiktok") return <svg {...common}><path d="M21 7c.6 3 2.3 4.8 5 5.2M21 7v14a5 5 0 1 1-4-4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 7h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
  return <svg {...common}><path d="M28 16.2A11 11 0 0 1 11.6 26L6 28l1.9-5.4A11 11 0 1 1 28 16.2Z" stroke="currentColor" strokeWidth="1.8" /><path d="M12.8 11.9c.4-.4 1-.4 1.3.1l1 1.7c.2.3.1.7-.1 1l-.8.8c.8 1.5 2 2.7 3.5 3.5l.8-.8c.3-.3.7-.3 1-.1l1.7 1c.5.3.5.9.1 1.3l-.6.6c-.5.5-1.2.7-1.9.5-3.8-1.1-6.8-4.1-7.9-7.9-.2-.7 0-1.4.5-1.9l.6-.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
