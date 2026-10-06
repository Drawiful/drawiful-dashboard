"use client";
import Link from "next/link";
import { Box, Lock, ShoppingBag } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { Skin } from "./skins";
import { withAlpha } from "./skins";

export const PAD = "clamp(20px,4vw,56px)";

export function money(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];
export function roman(n: number) {
  let out = "";
  let rest = n;
  for (const [value, symbol] of ROMAN) {
    while (rest >= value) {
      out += symbol;
      rest -= value;
    }
  }
  return out;
}

export function btnStyle(skin: Skin, variant: "primary" | "outline" | "accent" = "primary"): CSSProperties {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 52,
    padding: "0 30px",
    boxSizing: "border-box",
    borderRadius: skin.pill ? 999 : 0,
    fontFamily: skin.body,
    fontWeight: 600,
    fontSize: skin.upper ? 13 : 15,
    letterSpacing: skin.upper ? "0.14em" : "0",
    textTransform: skin.upper ? "uppercase" : "none",
    textDecoration: "none",
    cursor: "pointer",
    lineHeight: 1,
  };
  if (variant === "primary") {
    return { ...base, background: skin.accent, color: skin.onAccent, border: `1px solid ${skin.accent}` };
  }
  if (variant === "accent") {
    return { ...base, background: "transparent", color: skin.link, border: `1px solid ${skin.decor}` };
  }
  return { ...base, background: "transparent", color: skin.ink, border: `1px solid ${skin.ink}` };
}

export function ThemedPage({ skin, children }: { skin: Skin; children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: skin.bg,
        color: skin.ink,
        fontFamily: skin.body,
        fontWeight: skin.bodyWeight,
        fontSize: 16,
        lineHeight: 1.6,
        overflowX: "hidden",
      }}
    >
      <style>{`@import url('${skin.fontsHref}');`}</style>
      {children}
    </div>
  );
}

function DiamondBand({ skin, uid, style }: { skin: Skin; uid: string; style?: CSSProperties }) {
  const id = `diamonds-${uid}`;
  return (
    <svg width="100%" height="20" aria-hidden="true" style={{ display: "block", ...style }}>
      <defs>
        <pattern id={id} width="30" height="20" patternUnits="userSpaceOnUse">
          <path d="M15 3 L26 10 L15 17 L4 10 Z" fill="none" stroke={skin.decor} strokeWidth="1.2" />
          <circle cx="15" cy="10" r="1.4" fill={skin.decor} />
        </pattern>
      </defs>
      <rect width="100%" height="20" fill={`url(#${id})`} />
      <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke={skin.decor} strokeWidth="1" />
      <line x1="0" y1="19.5" x2="100%" y2="19.5" stroke={skin.decor} strokeWidth="1" />
    </svg>
  );
}

// ---------- Barre de navigation ----------
export function ThemedHeader({
  skin,
  slug,
  galleryName,
  cartCount,
}: {
  skin: Skin;
  slug: string;
  galleryName: string;
  cartCount: number;
}) {
  const initial = (galleryName || "G").trim().charAt(0).toUpperCase();
  const navText: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    padding: "0 14px",
    color: skin.muted,
    fontSize: skin.upper ? 13 : 15,
    fontWeight: 600,
    letterSpacing: skin.upper ? "0.16em" : "0",
    textTransform: skin.upper ? "uppercase" : "none",
    textDecoration: "none",
  };
  const cartBase: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    minHeight: 44,
    color: skin.ink,
    fontSize: skin.upper ? 13 : 15,
    fontWeight: 600,
    letterSpacing: skin.upper ? "0.16em" : "0",
    textTransform: skin.upper ? "uppercase" : "none",
    textDecoration: "none",
  };
  let cartStyle: CSSProperties = cartBase;
  if (skin.layout === "capsule") {
    cartStyle = { ...cartBase, padding: "0 22px", borderRadius: 999, border: `1px solid ${skin.decor}` };
  } else if (skin.layout === "bento") {
    cartStyle = { ...cartBase, padding: "0 8px 0 20px", borderRadius: 999, background: skin.surface, border: `1px solid ${skin.border}` };
  } else if (skin.layout === "arch") {
    cartStyle = { ...cartBase, padding: "0 18px", borderRadius: 999, background: skin.surface };
  } else if (skin.layout === "soft") {
    cartStyle = { ...cartBase, padding: "0 20px", borderRadius: 999, background: skin.accent, color: skin.onAccent };
  }

  const links = (
    <>
      <Link href={`/g/${slug}`} style={navText} className="hover:underline">
        Boutique
      </Link>
      <Link href={`/g/${slug}/a-propos`} style={navText} className="hover:underline">
        À propos
      </Link>
    </>
  );
  const cart = (
    <Link href={`/g/${slug}/panier`} style={cartStyle} className="hover:opacity-80">
      <ShoppingBag size={17} />
      Panier
      {cartCount > 0 && skin.layout === "bento" && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 28,
            height: 28,
            borderRadius: "50%",
            background: skin.accent,
            color: skin.onAccent,
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {cartCount}
        </span>
      )}
      {cartCount > 0 && skin.layout !== "bento" ? ` (${cartCount})` : ""}
    </Link>
  );

  // Haussmann : nom centré, navigation de part et d'autre, frise de losanges.
  if (skin.layout === "salon") {
    return (
      <header style={{ padding: `28px ${PAD} 0` }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 24px" }}>
          <nav style={{ flex: "1 1 200px", display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>{links}</nav>
          <Link
            href={`/g/${slug}`}
            style={{
              flex: "0 1 auto",
              textAlign: "center",
              fontFamily: skin.display,
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(30px,3.4vw,42px)",
              lineHeight: 1,
              color: skin.ink,
              textDecoration: "none",
            }}
          >
            {galleryName}
          </Link>
          <nav style={{ flex: "1 1 200px", display: "flex", justifyContent: "flex-end" }}>{cart}</nav>
        </div>
        <DiamondBand skin={skin} uid="header" style={{ marginTop: 18 }} />
      </header>
    );
  }

  // Sauge : barre flottante en pilule.
  if (skin.layout === "soft") {
    return (
      <div style={{ padding: "20px clamp(16px,3vw,40px) 0" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px 24px",
            padding: "8px 12px 8px 26px",
            border: `1px solid ${skin.border}`,
            borderRadius: 999,
            background: skin.surface,
          }}
        >
          <Link href={`/g/${slug}`} style={{ fontFamily: skin.display, fontWeight: 500, fontSize: 23, color: skin.ink, textDecoration: "none" }}>
            {galleryName}
          </Link>
          <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px" }}>
            {links}
            {cart}
          </nav>
        </header>
      </div>
    );
  }

  let name: ReactNode;
  if (skin.layout === "bento") {
    name = (
      <Link href={`/g/${slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: skin.display, fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: skin.ink, textDecoration: "none" }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "50%", background: skin.accent, color: skin.onAccent, fontSize: 19, fontWeight: 800 }}>
          {initial}
        </span>
        {galleryName}
      </Link>
    );
  } else if (skin.layout === "capsule") {
    name = (
      <Link href={`/g/${slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: skin.display, fontSize: 24, color: skin.ink, textDecoration: "none" }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", border: `1px solid ${skin.decor}`, color: skin.decor, fontSize: 21 }}>
          {initial}
        </span>
        {galleryName}
      </Link>
    );
  } else if (skin.layout === "arch") {
    name = (
      <Link href={`/g/${slug}`} style={{ fontFamily: skin.display, fontSize: 24, color: skin.ink, textDecoration: "none" }}>
        {galleryName}
      </Link>
    );
  } else {
    name = (
      <Link href={`/g/${slug}`} style={{ fontWeight: 600, fontSize: 16, color: skin.ink, textDecoration: "none" }}>
        {galleryName}
      </Link>
    );
  }

  const bar: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px 24px",
    padding: `22px ${PAD}`,
  };
  if (skin.layout === "swiss") bar.borderBottom = `1px solid ${skin.ink}`;
  if (skin.layout === "arch") bar.borderBottom = `1px solid ${skin.border}`;
  const navFont: CSSProperties = skin.layout === "swiss" ? { fontFamily: skin.mono, textTransform: "uppercase", letterSpacing: "0.06em" } : {};

  return (
    <header style={bar}>
      {name}
      <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px", ...navFont }}>
        {links}
        {cart}
      </nav>
    </header>
  );
}

// ---------- Pied de page ----------
export function ThemedFooter({ skin, slug }: { skin: Skin; slug: string }) {
  const item: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    color: skin.muted,
    fontSize: skin.upper ? 13 : 14,
    fontWeight: skin.upper ? 600 : 500,
    letterSpacing: skin.upper ? "0.14em" : "0",
    textTransform: skin.upper ? "uppercase" : "none",
    textDecoration: "none",
  };
  return (
    <footer style={{ padding: `0 ${PAD} 36px` }}>
      {skin.layout === "salon" && <DiamondBand skin={skin} uid="footer" style={{ marginBottom: 20 }} />}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px 32px",
          paddingTop: skin.layout === "salon" ? 0 : 28,
          borderTop: skin.layout === "salon" ? "none" : `1px solid ${skin.border}`,
          fontSize: 14,
          color: skin.muted,
        }}
      >
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "4px 28px" }}>
          <Link href={`/g/${slug}/mentions-legales`} style={item} className="hover:underline">
            Mentions légales
          </Link>
          <Link href={`/g/${slug}/cgv`} style={item} className="hover:underline">
            CGV
          </Link>
          <Link href={`/g/${slug}/confidentialite`} style={item} className="hover:underline">
            Confidentialité
          </Link>
        </nav>
        <span>Galerie propulsée par Drawiful</span>
      </div>
    </footer>
  );
}

// ---------- Pastille 3D ----------
export function ThreeDBadge({ skin, locked }: { skin: Skin; locked: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: withAlpha(skin.bg.startsWith("#") ? skin.bg : "#000000", 0.9),
        color: locked ? skin.muted : skin.ink,
        border: `1px solid ${skin.border}`,
      }}
    >
      {locked ? <Lock size={11} /> : <Box size={11} />}
      3D
    </span>
  );
}

// ---------- Cadre d'une œuvre, selon la mise en page du thème ----------
export function ArtworkMedia({
  skin,
  src,
  alt,
  height,
  badge,
}: {
  skin: Skin;
  src: string;
  alt: string;
  height: number;
  badge?: ReactNode;
}) {
  const img: CSSProperties = {
    maxWidth: "100%",
    maxHeight: "100%",
    display: "block",
    objectFit: "contain",
    boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
  };
  const center: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    overflow: "hidden",
  };

  let frame: ReactNode;
  switch (skin.layout) {
    case "bento":
      frame = (
        <div style={{ ...center, height, borderRadius: 18, background: skin.media, border: `1px solid ${skin.border}`, padding: 18 }}>
          <img src={src} alt={alt} style={img} />
        </div>
      );
      break;
    case "capsule":
      frame = (
        <div style={{ ...center, height, borderRadius: 999, background: skin.media, border: `1px solid ${withAlpha(skin.decor, 0.45)}`, padding: `${Math.round(height * 0.2)}px 26px` }}>
          <img src={src} alt={alt} style={img} />
        </div>
      );
      break;
    case "arch":
      frame = (
        <div style={{ ...center, height, alignItems: "flex-end", borderRadius: "999px 999px 0 0", background: skin.media, padding: `${Math.round(height * 0.12)}px 22px 22px` }}>
          <img src={src} alt={alt} style={img} />
        </div>
      );
      break;
    case "swiss":
      frame = (
        <div style={{ ...center, height, border: `1px solid ${skin.border}`, background: skin.media, padding: 24 }}>
          <img src={src} alt={alt} style={{ ...img, boxShadow: "none" }} />
        </div>
      );
      break;
    case "soft":
      frame = (
        <div style={{ ...center, height, borderRadius: 18, background: skin.media, padding: 18 }}>
          <img src={src} alt={alt} style={{ ...img, borderRadius: 6 }} />
        </div>
      );
      break;
    case "salon":
    default:
      frame = (
        <div style={{ border: `1px solid ${skin.decor}`, padding: 12, background: skin.bg, boxSizing: "border-box" }}>
          <div style={{ ...center, height: height - 26, background: skin.media, border: `1px solid ${skin.border}`, padding: 20 }}>
            <img src={src} alt={alt} style={img} />
          </div>
        </div>
      );
  }

  return (
    <div style={{ position: "relative" }}>
      {frame}
      {badge && <div style={{ position: "absolute", top: 12, right: 12 }}>{badge}</div>}
    </div>
  );
}
