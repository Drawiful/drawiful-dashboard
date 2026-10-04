"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// Barre de navigation + pied de page communs à toutes les pages publiques
// d'une galerie (grille, fiche œuvre, panier, à propos, pages légales),
// quel que soit le thème — seule la palette change.

export type ThemePalette = {
  bg: string;
  border: string;
  ink: string;
  muted: string;
  accent: string;
  serif: string;
};

export function PublicTopBar({
  slug,
  galleryName,
  cartCount,
  palette,
}: {
  slug: string;
  galleryName: string;
  cartCount: number;
  palette: ThemePalette;
}) {
  return (
    <div
      className="flex items-center justify-between px-8 md:px-16 py-4 border-b"
      style={{ borderColor: palette.border }}
    >
      <Link href={`/g/${slug}`} className="text-sm" style={{ fontFamily: `'${palette.serif}', serif`, color: palette.ink }}>
        {galleryName}
      </Link>
      <nav className="flex items-center gap-6 text-xs tracking-widest uppercase" style={{ color: palette.muted }}>
        <Link href={`/g/${slug}`} className="hover:underline">
          Boutique
        </Link>
        <Link href={`/g/${slug}/a-propos`} className="hover:underline">
          À propos
        </Link>
        <Link href={`/g/${slug}/panier`} className="flex items-center gap-1.5 hover:underline">
          <ShoppingBag size={14} />
          Panier{cartCount > 0 ? ` (${cartCount})` : ""}
        </Link>
      </nav>
    </div>
  );
}

export function PublicFooter({ slug, palette }: { slug: string; palette: ThemePalette }) {
  return (
    <footer className="text-center py-10 border-t" style={{ borderColor: palette.border }}>
      <div className="flex items-center justify-center gap-5 text-[11px] tracking-widest uppercase mb-3" style={{ color: palette.muted }}>
        <Link href={`/g/${slug}/mentions-legales`} className="hover:underline">
          Mentions légales
        </Link>
        <Link href={`/g/${slug}/cgv`} className="hover:underline">
          CGV
        </Link>
        <Link href={`/g/${slug}/confidentialite`} className="hover:underline">
          Confidentialité
        </Link>
      </div>
      <p className="text-xs tracking-widest uppercase" style={{ color: palette.muted }}>
        Galerie propulsée par Drawiful
      </p>
    </footer>
  );
}

export const GALERIE_BLANCHE_PALETTE: ThemePalette = {
  bg: "#FEFEFC",
  border: "#ECEAE4",
  ink: "#1A1A18",
  muted: "#8A8578",
  accent: "#B08D57",
  serif: "Fraunces",
};

export const MAISON_HAUSSMANN_PALETTE: ThemePalette = {
  bg: "#F6F1E3",
  border: "#D8C9A8",
  ink: "#2B2013",
  muted: "#7C5A2E",
  accent: "#B9862F",
  serif: "Cormorant Garamond",
};
