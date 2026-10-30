"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lock, Menu, X, ArrowUpRight } from "lucide-react";
import { clearToken } from "@/lib/api";
import { formatTrialEnd } from "./TrialBanner";

// La maison de l'artiste : on parle comme une galerie, pas comme un logiciel.
// Les adresses des pages ne changent pas (liens des e-mails et favoris).
export const navItems = [
  { href: "/overview", num: "I", label: "Votre galerie" },
  { href: "/artworks", num: "II", label: "Votre collection" },
  { href: "/orders", num: "III", label: "Acquisitions" },
  { href: "/gallery", num: "IV", label: "Vos salles" },
  { href: "/domaine", num: "V", label: "Votre adresse" },
  { href: "/subscription", num: "VI", label: "Votre accès" },
  { href: "/settings", num: "VII", label: "Votre maison" },
];

function AccessCard({ limits }: { limits: any }) {
  if (!limits) return null;
  if (limits.access === "trial") {
    const days = limits.trialDaysLeft ?? 0;
    return (
      <div className="rounded-lg border border-champagne/30 p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-champagne">Accès privé</p>
        <p className="font-display text-[19px] leading-snug mt-2 text-ivoire">
          {days <= 1 ? "Dernier jour pour vivre l'expérience" : `Encore ${days} jours pour vivre l'expérience`}
        </p>
        <p className="text-xs text-lilas mt-1.5">Jusqu'au {formatTrialEnd(limits.trialEndsAt)}</p>
        <Link href="/subscription" className="inline-block mt-3 text-[13px] text-champagne underline underline-offset-4">
          Choisir votre formule
        </Link>
      </div>
    );
  }
  if (limits.access === "locked") {
    return (
      <div className="rounded-lg border border-champagne/30 p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-champagne">Accès privé terminé</p>
        <p className="font-display text-[19px] leading-snug mt-2 text-ivoire">Votre galerie vous attend.</p>
        <Link href="/subscription" className="inline-block mt-3 text-[13px] text-champagne underline underline-offset-4">
          Rouvrir votre galerie
        </Link>
      </div>
    );
  }
  return null;
}

export default function Sidebar({
  galleryName,
  galleryUrl,
  limits,
  locked = false,
}: {
  galleryName?: string;
  galleryUrl?: string;
  limits?: any;
  locked?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  const brand = (
    <Link href="/overview" className="flex items-center gap-3.5 min-w-0" onClick={() => setOpen(false)}>
      <img src="/icon.png" alt="" className="w-10 h-10 rounded-full shrink-0" />
      <span className="flex flex-col min-w-0">
        <span className="font-display text-[17px] tracking-[0.3em] text-ivoire">DRAWIFUL</span>
        {galleryName && <span className="text-xs text-champagne truncate">{galleryName}</span>}
      </span>
    </Link>
  );

  return (
    <aside className="md:w-[264px] md:shrink-0 bg-nuit text-ivoire md:sticky md:top-0 md:h-screen md:overflow-y-auto">
      {/* Mobile : barre du haut, le menu s'ouvre au toucher */}
      <div className="md:hidden flex items-center justify-between gap-4 px-5 py-4">
        {brand}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="w-11 h-11 -mr-2 flex items-center justify-center text-ivoire"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      <div
        className={`${open ? "flex" : "hidden"} md:flex flex-col justify-between gap-10 px-5 md:px-7 pb-8 md:py-10 md:min-h-full`}
      >
        <div className="flex flex-col gap-11">
          <div className="hidden md:block">{brand}</div>

          <nav aria-label="Navigation principale" className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              // Accès terminé : seule la page « Votre accès » reste ouverte
              if (locked && item.href !== "/subscription") {
                return (
                  <span
                    key={item.href}
                    title="Choisissez votre formule pour rouvrir cette pièce"
                    className="flex items-baseline gap-3.5 px-3.5 py-3 rounded-md text-sm text-ivoire/40 cursor-not-allowed"
                  >
                    <span className="font-display text-[13px] w-6">{item.num}</span>
                    <span className="flex-1">{item.label}</span>
                    <Lock size={13} strokeWidth={1.6} className="self-center" />
                  </span>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-baseline gap-3.5 px-3.5 py-3 rounded-md text-sm transition-colors ${
                    active ? "bg-champagne/10 text-champagne font-medium" : "text-lilas hover:text-ivoire"
                  }`}
                >
                  <span className="font-display text-[13px] w-6">{item.num}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-5">
          <AccessCard limits={limits} />
          {galleryUrl && !locked && (
            <a
              href={galleryUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[13px] text-lilas hover:text-ivoire"
            >
              Visiter votre galerie <ArrowUpRight size={14} strokeWidth={1.6} />
            </a>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="text-left text-[13px] text-lilas hover:text-ivoire"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
}
