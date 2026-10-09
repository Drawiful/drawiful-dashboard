"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#galerie-3d", label: "La galerie 3D" },
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#questions", label: "Questions" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-[#2B1E2F]/95 backdrop-blur border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="font-display-lp text-2xl text-[#F7F5F0] tracking-tight" aria-label="Drawiful, accueil">
          Drawiful
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-[#F7F5F0]/75 hover:text-[#F7F5F0]">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <Link
              href="/overview"
              className="rounded-full bg-[#B8912F] px-5 py-2.5 text-sm font-semibold text-[#1C1A17] hover:bg-[#C9A24A]"
            >
              Mon espace
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2.5 text-sm text-[#F7F5F0]/85 hover:text-[#F7F5F0]">
                Se connecter
              </Link>
              <Link
                href="/inscription?plan=artiste"
                className="rounded-full bg-[#B8912F] px-5 py-2.5 text-sm font-semibold text-[#1C1A17] hover:bg-[#C9A24A]"
              >
                Essayer 14 jours
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden text-[#F7F5F0] p-2 -mr-2"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="menu-mobile" className="md:hidden px-5 pb-6 flex flex-col gap-1 bg-[#2B1E2F]">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-[#F7F5F0]/85 border-b border-white/10"
            >
              {l.label}
            </a>
          ))}
          {loggedIn ? (
            <Link href="/overview" className="mt-4 rounded-full bg-[#B8912F] py-3 text-center font-semibold text-[#1C1A17]">
              Mon espace
            </Link>
          ) : (
            <>
              <Link href="/login" className="py-3 text-[#F7F5F0]/85">
                Se connecter
              </Link>
              <Link
                href="/inscription?plan=artiste"
                className="mt-2 rounded-full bg-[#B8912F] py-3 text-center font-semibold text-[#1C1A17]"
              >
                Essayer 14 jours
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
