"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FloatingCatalogButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Link
      className={`floating-catalog-button${visible ? " is-visible" : ""}`}
      href="/catalogo"
      aria-label="Ir al catálogo"
    >
      <span>CATÁLOGO</span>
      <span className="floating-catalog-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
