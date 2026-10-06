"use client";
import Link from "next/link";
import { ArrowLeft, Box, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";
import ModelViewerPremium from "@/components/ModelViewerPremium";
import type { Skin } from "./skins";
import { PAD, ThemedPage, ThemedHeader, ThemedFooter, ArtworkMedia, btnStyle, money } from "./ThemedChrome";

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
}: ArtworkPageProps & { skin: Skin }) {
  const can3d = !!artwork.model3dUrl && !!artist.has3dAccess;
  const caps: CSSProperties = {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: skin.link,
  };

  return (
    <ThemedPage skin={skin}>
      <ThemedHeader skin={skin} slug={slug} galleryName={artist.galleryName} cartCount={cartCount} />

      <div style={{ padding: `24px ${PAD} 0` }}>
        <Link
          href={`/g/${slug}`}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: skin.muted, textDecoration: "none" }}
        >
          <ArrowLeft size={14} />
          Retour à la galerie
        </Link>
      </div>

      <section style={{ display: "flex", flexWrap: "wrap", gap: "48px 72px", alignItems: "center", padding: `32px ${PAD} 96px` }}>
        <div style={{ flex: "1 1 380px", minWidth: 0, position: "relative" }}>
          {can3d && view3d ? (
            <div style={{ width: "100%", height: "70vh", background: skin.media, borderRadius: skin.layout === "swiss" || skin.layout === "salon" ? 0 : 24, overflow: "hidden" }}>
              <ModelViewerPremium src={artwork.model3dUrl} poster={artwork.imageUrl} alt={artwork.title} />
            </div>
          ) : (
            <ArtworkMedia skin={skin} src={artwork.imageUrl} alt={artwork.title} height={580} />
          )}

          {can3d && (
            <button
              onClick={() => setView3d(!view3d)}
              style={{ ...btnStyle(skin, "accent"), position: "absolute", top: 16, right: 16, minHeight: 44, padding: "0 18px", fontSize: 12, background: skin.bg }}
            >
              <Box size={14} />
              {view3d ? "Voir en 2D" : "Explorer en 3D"}
            </button>
          )}
        </div>

        <div style={{ flex: "1 1 360px", minWidth: 0, maxWidth: 560, display: "flex", flexDirection: "column", gap: 22 }}>
          <p style={caps}>Œuvre originale</p>
          <h1
            style={{
              margin: 0,
              fontFamily: skin.display,
              fontWeight: skin.displayWeight,
              fontStyle: skin.displayItalic ? "italic" : "normal",
              fontSize: "clamp(40px,5vw,64px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: skin.ink,
            }}
          >
            {artwork.title}
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: skin.muted }}>Par {artist.galleryName}</p>

          {artwork.description && (
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: skin.ink }}>{artwork.description}</p>
          )}

          <div style={{ fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: 40, color: skin.link, letterSpacing: "-0.01em" }}>
            {money(artwork.priceCents, artwork.currency)}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
            <button onClick={onBuyNow} disabled={buying} style={{ ...btnStyle(skin, "primary"), width: "100%", opacity: buying ? 0.6 : 1 }}>
              {buying ? "Redirection..." : "Acheter maintenant"}
            </button>
            <button onClick={onAddToCart} disabled={inCart} style={{ ...btnStyle(skin, "outline"), width: "100%", opacity: inCart ? 0.5 : 1 }}>
              {inCart ? "Déjà dans le panier" : "Ajouter au panier"}
            </button>
            <p style={{ margin: "4px 0 0", fontSize: 13, textAlign: "center", color: skin.muted }}>
              Paiement sécurisé · Livraison incluse
            </p>
          </div>

          {artwork.certificate && (
            <a
              href={`/certificate/${artwork.certificate.serialNumber}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 460, padding: "16px 20px", boxSizing: "border-box", borderRadius: skin.radius ? 20 : 0, border: `1px solid ${skin.border}`, background: skin.surface, color: skin.muted, fontSize: 15, textDecoration: "none" }}
            >
              <ShieldCheck size={24} color={skin.decor} style={{ flex: "none" }} />
              {"Certificat d'authenticité inclus — vérifiable publiquement"}
            </a>
          )}
        </div>
      </section>

      <ThemedFooter skin={skin} slug={slug} />
    </ThemedPage>
  );
}
