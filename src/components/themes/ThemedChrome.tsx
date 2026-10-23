"use client";
import Link from "next/link";
import { Box, Lock, ShoppingBag } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { Skin } from "./skins";
import { withAlpha } from "./skins";

export const PAD = "clamp(20px,4vw,48px)";
export const MAXW = 1360;

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

// Conteneur centré, même largeur maximale sur toutes les pages des thèmes.
export function wrap(extra: CSSProperties = {}): CSSProperties {
  return { maxWidth: MAXW, margin: "0 auto", paddingLeft: PAD, paddingRight: PAD, boxSizing: "border-box", ...extra };
}

// Petites capitales (menu, étiquettes, boutons) dans la police du thème.
export function capsStyle(skin: Skin, size = 12): CSSProperties {
  return {
    fontFamily: skin.caps,
    fontSize: skin.layout === "salon" ? size + 2 : size,
    fontWeight: 400,
    letterSpacing: skin.capsSpacing,
    textTransform: skin.layout === "salon" ? "none" : "uppercase",
  };
}

export function Eyebrow({ skin, children, color, style }: { skin: Skin; children: ReactNode; color?: string; style?: CSSProperties }) {
  return <p style={{ margin: 0, ...capsStyle(skin, 11), color: color ?? (skin.layout === "swiss" ? skin.muted : skin.link), ...style }}>{children}</p>;
}

export function btnStyle(skin: Skin, variant: "primary" | "outline" | "accent" | "link" = "primary"): CSSProperties {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 52,
    padding: "0 30px",
    boxSizing: "border-box",
    borderRadius: 0,
    ...capsStyle(skin, 12),
    fontWeight: skin.layout === "capsule" ? 500 : 400,
    textDecoration: "none",
    cursor: "pointer",
    lineHeight: 1,
  };
  if (variant === "primary") {
    return { ...base, background: skin.accent, color: skin.onAccent, border: `1px solid ${skin.accent}` };
  }
  if (variant === "accent") {
    return { ...base, background: "transparent", color: skin.link, border: `1px solid ${skin.hairline}` };
  }
  if (variant === "link") {
    return { ...base, minHeight: 44, padding: "0 0 4px", justifyContent: "flex-start", background: "transparent", color: skin.link, border: "none", borderBottom: `1px solid ${skin.hairline}` };
  }
  return { ...base, background: "transparent", color: skin.ink, border: `1px solid ${skin.ink}` };
}

// Décors Maison Haussmann : plâtre du mur, moulures en relief, cadre doré
// sculpté. Des classes CSS plutôt que des styles en ligne, pour les
// dégradés et ombres multiples.
// Sur mobile, les œuvres alignées en bas (Blanc Pur) ne gardent pas la hauteur
// réservée : sinon une œuvre en paysage laisse un grand vide au-dessus d'elle.
const BASE_CSS = `@media (max-width:640px){.dw-media-end{height:auto!important}}`;

const SALON_CSS = `
.dw-mur{background-color:#EFE8DC;background-image:url('/themes/plaster-cream.png');background-repeat:repeat;background-size:360px 360px}
.dw-mur-profond{background-color:#E7DDCB;background-image:linear-gradient(rgba(110,80,40,.08),rgba(110,80,40,.08)),url('/themes/plaster-cream.png');background-repeat:repeat;background-size:auto,360px 360px}
.dw-moulure{box-shadow:inset 1px 1px 0 rgba(255,255,255,.85),inset -1px -1px 0 rgba(120,92,55,.30),1px 1px 0 rgba(120,92,55,.22),-1px -1px 0 rgba(255,255,255,.7),2px 3px 6px rgba(80,60,35,.10)}
.dw-moulure-int{box-shadow:inset 1px 1px 0 rgba(120,92,55,.26),inset -1px -1px 0 rgba(255,255,255,.8),inset 3px 4px 10px rgba(80,60,35,.06)}
.dw-cadre-dore{padding:18px;background:linear-gradient(135deg,#6E4F1F 0%,#D9BC7A 18%,#8E6B2E 34%,#E8CF92 50%,#9A7536 66%,#D9BC7A 82%,#6E4F1F 100%);box-shadow:inset 0 0 0 2px #5B4018,inset 0 0 0 4px #E8CF92,inset 0 0 0 6px #8A6A2F,inset 0 0 0 9px rgba(255,236,190,.55),inset 0 0 0 11px #6E4F1F,0 2px 3px rgba(42,33,27,.35),0 30px 55px rgba(42,33,27,.38)}
.dw-passe{box-shadow:inset 0 0 0 1px rgba(122,90,38,.35),inset 3px 3px 8px rgba(42,33,27,.14)}
.dw-plaque{background:linear-gradient(180deg,#D9BC7A,#A8874A);box-shadow:0 4px 10px rgba(42,33,27,.25)}
@media (max-width:640px){.dw-cadre-dore{padding:12px}}
`;

export function ThemedPage({ skin, children }: { skin: Skin; children: ReactNode }) {
  return (
    <div
      className={skin.layout === "salon" ? "dw-mur" : undefined}
      style={{
        minHeight: "100vh",
        backgroundColor: skin.bg,
        color: skin.ink,
        fontFamily: skin.body,
        fontWeight: skin.bodyWeight,
        fontSize: skin.layout === "salon" ? 18 : 16,
        lineHeight: 1.65,
        overflowX: "hidden",
      }}
    >
      <style>{`@import url('${skin.fontsHref}');${BASE_CSS}${skin.layout === "salon" ? SALON_CSS : ""}`}</style>
      {children}
    </div>
  );
}

function Diamond({ skin }: { skin: Skin }) {
  return <span aria-hidden="true" style={{ display: "block", width: 6, height: 6, transform: "rotate(45deg)", background: skin.decor, flex: "none" }} />;
}

// Losange entre deux filets (Maison Haussmann).
export function Ornament({ skin, width = 80 }: { skin: Skin; width?: number }) {
  return (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <span style={{ display: "block", width, height: 1, background: skin.decor }} />
      <span style={{ display: "block", width: 8, height: 8, transform: "rotate(45deg)", border: `1px solid ${skin.decor}` }} />
      <span style={{ display: "block", width, height: 1, background: skin.decor }} />
    </div>
  );
}

function initials(name: string) {
  const parts = (name || "G").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "G") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

// ---------- Barre de navigation ----------
export function ThemedHeader({
  skin,
  slug,
  galleryName,
  cartCount,
  has3d = false,
}: {
  skin: Skin;
  slug: string;
  galleryName: string;
  cartCount: number;
  // Affiche le lien "Visite 3D" (artistes avec accès 3D uniquement).
  has3d?: boolean;
}) {
  const navItem: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    ...capsStyle(skin, 12),
    color: skin.layout === "capsule" ? skin.muted : skin.ink,
    textDecoration: "none",
  };
  const cartLabel = `Panier${cartCount > 0 ? ` (${cartCount})` : ""}`;
  const cart = (
    <Link href={`/g/${slug}/panier`} style={{ ...navItem, color: skin.layout === "capsule" ? skin.link : skin.ink }} className="hover:opacity-70">
      <ShoppingBag size={15} strokeWidth={1.4} />
      {cartLabel}
    </Link>
  );
  const links = (
    <>
      <Link href={`/g/${slug}`} style={navItem} className="hover:opacity-70">
        Boutique
      </Link>
      {has3d && (
        <Link href={`/g/${slug}/visite-3d`} style={navItem} className="hover:opacity-70">
          <Box size={14} strokeWidth={1.4} />
          Visite 3D
        </Link>
      )}
      <Link href={`/g/${slug}/a-propos`} style={navItem} className="hover:opacity-70">
        L'artiste
      </Link>
    </>
  );

  // Maison Haussmann : monogramme, nom gravé, menu centré entre deux filets.
  if (skin.layout === "salon") {
    return (
      <header style={wrap({ paddingTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 })}>
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ ...capsStyle(skin, 12), color: skin.muted }}>Galerie d'art</span>
          {cart}
        </div>
        <Link href={`/g/${slug}`} style={{ textDecoration: "none", color: skin.ink, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
          <span
            aria-hidden="true"
            style={{ width: 72, height: 72, borderRadius: "50%", border: `1px solid ${skin.decor}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${skin.bg}, 0 0 0 5px ${withAlpha("#C9B27E", 1)}` }}
          >
            <span style={{ fontFamily: skin.display, fontStyle: "italic", fontSize: 28, color: skin.link }}>{initials(galleryName)}</span>
          </span>
          <span style={{ fontFamily: skin.caps, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "0.2em", paddingLeft: "0.2em" }}>{galleryName}</span>
        </Link>
        <nav style={{ width: "100%", borderTop: `1px solid ${skin.border}`, borderBottom: `1px solid ${skin.border}`, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0 28px" }}>
          <Link href={`/g/${slug}`} style={navItem} className="hover:opacity-70">
            La collection
          </Link>
          {has3d && (
            <>
              <Diamond skin={skin} />
              <Link href={`/g/${slug}/visite-3d`} style={navItem} className="hover:opacity-70">
                Le salon en 3D
              </Link>
            </>
          )}
          <Diamond skin={skin} />
          <Link href={`/g/${slug}/a-propos`} style={navItem} className="hover:opacity-70">
            L'artiste
          </Link>
        </nav>
      </header>
    );
  }

  // Blanc Pur et Noir & Or : nom à gauche, menu en petites capitales.
  return (
    <header style={wrap({ paddingTop: 26, paddingBottom: 26, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 24px" })}>
      <Link
        href={`/g/${slug}`}
        style={{ fontFamily: skin.display, fontWeight: skin.layout === "capsule" ? 500 : 400, fontSize: 28, lineHeight: 1.1, letterSpacing: "0.01em", color: skin.ink, textDecoration: "none" }}
      >
        {galleryName}
      </Link>
      <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0 32px" }}>
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
    fontSize: 13,
    textDecoration: "none",
  };
  return (
    <footer style={wrap({ paddingBottom: 40 })}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px 32px",
          paddingTop: 20,
          borderTop: `1px solid ${skin.border}`,
          fontSize: 13,
          color: skin.muted,
        }}
      >
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "0 24px" }}>
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
        <span>
          Galerie propulsée par{" "}
          <span style={{ fontFamily: skin.display, fontStyle: skin.layout === "salon" ? "italic" : "normal", fontSize: 17, color: skin.ink }}>Drawiful</span>
        </span>
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
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.12em",
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

// ---------- Une œuvre « accrochée », selon le thème ----------
// Blanc Pur : passe-partout blanc et ombre douce sur le mur.
// Noir & Or : passe-partout ivoire sous un halo de lumière.
// Maison Haussmann : cadre doré sculpté et passe-partout creusé.
export function ArtworkMedia({
  skin,
  src,
  alt,
  height,
  badge,
  align = "center",
}: {
  skin: Skin;
  src: string;
  alt: string;
  height: number;
  badge?: ReactNode;
  // Alignement vertical dans la hauteur réservée (Blanc Pur : œuvres posées sur une même ligne).
  align?: "center" | "end";
}) {
  const box: CSSProperties = {
    display: "flex",
    alignItems: align === "end" ? "flex-end" : "center",
    justifyContent: "center",
    height,
    boxSizing: "border-box",
  };

  const boxClass = align === "end" ? "dw-media-end" : undefined;
  let frame: ReactNode;
  if (skin.layout === "salon") {
    frame = (
      <div style={box}>
        <span className="dw-cadre-dore" style={{ display: "block", maxWidth: "100%", boxSizing: "border-box" }}>
          <span className="dw-passe" style={{ display: "block", background: skin.mat, padding: 20 }}>
            <img src={src} alt={alt} style={{ display: "block", maxWidth: "100%", maxHeight: height - 80, objectFit: "contain" }} />
          </span>
        </span>
      </div>
    );
  } else if (skin.layout === "capsule") {
    frame = (
      <div
        style={{
          ...box,
          padding: "48px 24px",
          background: `radial-gradient(ellipse 42% 40% at 50% 40%, ${withAlpha("#E8D6B0", 0.13)}, ${withAlpha("#E8D6B0", 0)} 100%), radial-gradient(ellipse 55% 45% at 50% 55%, #1A1012, ${skin.bg} 100%)`,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            background: skin.mat,
            padding: 14,
            boxSizing: "border-box",
            boxShadow: `0 0 0 1px ${withAlpha("#C8AE7D", 0.3)}, 0 50px 90px rgba(0,0,0,0.8)`,
          }}
        />
      </div>
    );
  } else {
    frame = (
      <div className={boxClass} style={box}>
        <img
          src={src}
          alt={alt}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            background: skin.mat,
            padding: 16,
            boxSizing: "border-box",
            boxShadow: "0 2px 4px rgba(20,18,17,0.06), 0 22px 40px rgba(20,18,17,0.11)",
          }}
        />
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

// ---------- Cartel de musée sous une œuvre ----------
export function Cartel({
  skin,
  title,
  lines,
  price,
  kicker,
  center = false,
}: {
  skin: Skin;
  title: string;
  lines: (string | null | undefined)[];
  price?: string;
  kicker?: string;
  center?: boolean;
}) {
  const meta = lines.filter(Boolean) as string[];
  if (skin.layout === "salon") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "12px 26px", border: `1px solid ${skin.decor}`, background: "#F3ECDF", textAlign: "center", minWidth: 200, maxWidth: "100%", boxSizing: "border-box" }}>
        {kicker && <span style={{ ...capsStyle(skin, 10), color: skin.link }}>{kicker}</span>}
        <span style={{ fontFamily: skin.display, fontStyle: "italic", fontSize: 21, lineHeight: 1.25 }}>{title}</span>
        {meta.map((m) => (
          <span key={m} style={{ fontSize: 16, color: skin.muted }}>
            {m}
          </span>
        ))}
        {price && <span style={{ ...capsStyle(skin, 13), color: skin.ink, paddingTop: 4 }}>{price}</span>}
      </div>
    );
  }
  const dark = skin.layout === "capsule";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", textAlign: center ? "center" : "left" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingLeft: 14, borderLeft: `1px solid ${dark ? skin.hairline : skin.ink}`, minWidth: 0 }}>
        {kicker && <span style={{ ...capsStyle(skin, 10), color: dark ? skin.link : skin.muted }}>{kicker}</span>}
        <span style={{ fontFamily: skin.display, fontStyle: "italic", fontSize: 22, lineHeight: 1.2, color: skin.ink }}>{title}</span>
        {meta.map((m) => (
          <span key={m} style={{ fontSize: 14, color: skin.muted }}>
            {m}
          </span>
        ))}
      </div>
      {price && <span style={{ fontSize: 15, fontWeight: 400, whiteSpace: "nowrap", color: skin.ink }}>{price}</span>}
    </div>
  );
}
