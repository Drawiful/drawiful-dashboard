"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/*
  En-tête de la landing, volontairement minimal : un seul chemin, l'inscription.
  Pas de menu d'ancres (chaque lien est une sortie possible avant le bouton).
*/
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setLoggedIn(!!localStorage.getItem("drawiful_token"));
    } catch {}
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-[#0E0C0A]/90 backdrop-blur-md border-b border-[#F4EFE6]/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="font-display-lp text-[26px] text-[#F4EFE6] tracking-tight" aria-label="Drawiful, accueil">
          Drawiful
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {loggedIn ? (
            <Link
              href="/overview"
              className="rounded-full border border-[#D9B75C]/60 px-4 sm:px-5 py-2 text-[13px] sm:text-sm text-[#F4EFE6] hover:bg-[#D9B75C] hover:text-[#0E0C0A] transition-colors"
            >
              Mon espace
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-2 sm:px-3 py-2 text-[13px] sm:text-sm text-[#F4EFE6]/75 hover:text-[#F4EFE6]">
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="hidden sm:inline-flex rounded-full bg-[#D9B75C] px-5 py-2.5 text-sm font-semibold text-[#0E0C0A] hover:bg-[#E6C877] transition-colors"
              >
                Accès privé, 14 jours offerts
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
