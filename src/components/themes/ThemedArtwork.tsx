"use client";
import Link from "next/link";
import { ArrowLeft, Box, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";
import ModelViewerPremium from "@/components/ModelViewerPremium";
import type { Skin } from "./skins";
import { withAlpha } from "./skins";
import { wrap, capsStyle, Eyebrow, ThemedPage, ThemedHeader, ThemedFooter, ArtworkMedia, btnStyle, money } from "./ThemedChrome";
import { formatDimensions } from "@/lib/dimensions";

// Mêmes propriétés que les anciens composants MaisonHaussmannArtwork /
// GalerieBlancheArtwork : la page de la fiche œuvre n'a pas besoin de changer
// sa logique (panier, achat direct, bascule 2D/3D).
export type ArtworkPageProps = {
  artist: any;
  artwork: any;
  slug: string;
  inCart: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  buying: boolean;
  view3d: boolean;
  setView3d: (v: boolean) => void;
  cartCount?: number;
  // false = l'artiste n'a pas encore activé les paiements : on n'affiche
  // pas les boutons d'achat. Absent = boutique ouverte.
  canBuy?: boolean;
};

export function ThemedArtwork({
  skin,
  artist,
  artwork,
  slug,
  inCart,
  onAddToCart,
  onBuyNow,
  buying,
  view3d,
  setView3d,
  cartCount = 0,
  canBuy = true,
}: ArtworkPageProps & { skin: Skin }) {
  const can3d = !!artwork.model3dUrl && !!artist.has3dAccess;
  const dims = formatDimensions(artwork);
  const dark = skin.layout === "capsule";
  // Blanc Pur : le bordeaux Drawiful n'apparaît que sur le bouton d'achat.
  const buyStyle: CSSProperties =
    skin.layout === "swiss"
      ? { ...btnStyle(skin, "primary"), background: "#230307", borderColor: "#230307", color: "#FAFAF8" }
      : btnStyle(skin, "primary");

  const facts: [string, string][] = [];
  if (dims) facts.push(["Dimensions", dims]);
  facts.push(["Encadrement", artwork.framed ? artwork.frameDescription || "Vendue encadrée par l'artiste" : "Vendue sans cadre"]);
  facts.push(["Édition", "Pièce unique"]);
  if (artwork.certificate) facts.push(["Authenticité", "Certificat numéroté"]);

  return (
    <ThemedPage skin={skin}>
      <ThemedHeader skin={skin} slug={slug} galleryName={artist.galleryName} cartCount={cartCount} has3d={!!artist.has3dAccess} />

      <div style={wrap({ paddingTop: 12 })}>
        <Link href={`/g/${slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, ...capsStyle(skin, 11), color: skin.muted, textDecoration: "none" }}>
          <ArrowLeft size={14} strokeWidth={1.4} />
          Retour à la collection
        </Link>
      </div>

      <section style={wrap({ paddingTop: 28, paddingBottom: 110, display: "flex", flexWrap: "wrap", gap: "48px 80px", alignItems: "flex-start" })}>
        <div style={{ flex: "1.15 1 420px", minWidth: 0, position: "relative", background: skin.layout === "swiss" ? skin.surface : "transparent", padding: skin.layout === "swiss" ? "clamp(28px,5vw,64px)" : 0, boxSizing: "border-box" }}>
          {can3d && view3d ? (
            <div style={{ width: "100%", height: "70vh", background: skin.media, overflow: "hidden" }}>
              <ModelViewerPremium src={artwork.model3dUrl} poster={artwork.imageUrl} alt={artwork.title} />
            </div>
          ) : (
            <ArtworkMedia skin={skin} src={artwork.imageUrl} alt={artwork.title} height={620} />
          )}

          {can3d && (
            <button
              onClick={() => setView3d(!view3d)}
              style={{ ...btnStyle(skin, "accent"), position: "absolute", top: 16, right: 16, minHeight: 44, padding: "0 18px", background: skin.bg }}
            >
              <Box size={14} strokeWidth={1.4} />
              {view3d ? "Voir en 2D" : "Explorer en 3D"}
            </button>
          )}
        </div>

        <div style={{ flex: "1 1 340px", minWidth: 0, maxWidth: 540, display: "flex", flexDirection: "column", gap: 24, paddingTop: 12 }}>
          <Eyebrow skin={skin}>Œuvre originale</Eyebrow>
          <h1
            style={{
              margin: 0,
              fontFamily: skin.display,
              fontWeight: skin.displayWeight,
              fontSize: "clamp(40px,5vw,68px)",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
              color: skin.ink,
            }}
          >
            {artwork.title}
          </h1>
          <p style={{ margin: 0, fontFamily: skin.display, fontStyle: "italic", fontSize: 21, color: skin.muted }}>{artist.galleryName}</p>

          {artwork.description && (
            <p style={{ margin: 0, fontSize: skin.layout === "salon" ? 19 : 16, lineHeight: 1.8, color: dark ? skin.muted : skin.ink, whiteSpace: "pre-line" }}>{artwork.description}</p>
          )}

          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "18px 24px", borderTop: `1px solid ${skin.border}`, borderBottom: `1px solid ${skin.border}`, padding: "22px 0" }}>
            {facts.map(([k, v]) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <dt style={{ ...capsStyle(skin, 10), color: skin.muted }}>{k}</dt>
                <dd style={{ margin: 0, fontSize: skin.layout === "salon" ? 18 : 15, color: skin.ink }}>{v}</dd>
              </div>
            ))}
          </dl>

          <div style={{ fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: 42, lineHeight: 1, color: dark ? skin.link : skin.ink }}>
            {money(artwork.priceCents, artwork.currency)}
          </div>

          {canBuy ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 440 }}>
              <button onClick={onBuyNow} disabled={buying} style={{ ...buyStyle, width: "100%", minHeight: 56, opacity: buying ? 0.6 : 1 }}>
                {buying ? "Redirection..." : "Acquérir cette œuvre"}
              </button>
              <button onClick={onAddToCart} disabled={inCart} style={{ ...btnStyle(skin, dark ? "accent" : "outline"), width: "100%", opacity: inCart ? 0.5 : 1 }}>
                {inCart ? "Déjà dans le panier" : "Ajouter au panier"}
              </button>
              <p style={{ margin: "4px 0 0", fontSize: 13, textAlign: "center", color: skin.muted }}>Paiement sécurisé · Livraison incluse</p>
            </div>
          ) : (
            <div style={{ maxWidth: 440, padding: "18px 20px", boxSizing: "border-box", border: `1px solid ${skin.border}`, background: skin.surface }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: skin.ink }}>Vente en ligne bientôt disponible</p>
              <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: skin.muted }}>
                L'artiste finalise l'ouverture de sa boutique. Revenez très bientôt pour acquérir cette œuvre.
              </p>
            </div>
          )}

          {artwork.certificate && (
            <a
              href={`/certificate/${artwork.certificate.serialNumber}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 460, padding: "16px 20px", boxSizing: "border-box", border: `1px solid ${skin.border}`, background: dark ? withAlpha("#C8AE7D", 0.05) : skin.surface, color: skin.muted, fontSize: 14, lineHeight: 1.5, textDecoration: "none" }}
            >
              <ShieldCheck size={24} strokeWidth={1.3} color={skin.decor} style={{ flex: "none" }} />
              {"Certificat d'authenticité inclus, vérifiable publiquement à tout moment."}
            </a>
          )}
        </div>
      </section>

      <ThemedFooter skin={skin} slug={slug} />
    </ThemedPage>
  );
}
