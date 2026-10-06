"use client";
import { Globe } from "lucide-react";
import type { CSSProperties } from "react";
import { PublicTopBar, PublicFooter, GALERIE_BLANCHE_PALETTE } from "@/components/themes/PublicChrome";
import { SKINS } from "@/components/themes/skins";
import type { Skin } from "@/components/themes/skins";
import { PAD, ThemedPage, ThemedHeader, ThemedFooter, btnStyle } from "@/components/themes/ThemedChrome";

// Page "À propos" — construite uniquement à partir des champs réellement
// disponibles sur le profil artiste (bio, avatar, signature, site web).
// Pas de timeline d'expositions : ce champ n'existe pas encore côté backend.

type AProposProps = { artist: any; slug: string; cartCount?: number };

// ---------- Ancien thème "galerie-blanche" : rendu d'origine, inchangé ----------
export function GalerieBlancheAPropos({ artist, slug, cartCount = 0 }: AProposProps) {
  const p = GALERIE_BLANCHE_PALETTE;
  return (
    <div className="min-h-screen bg-[#FEFEFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap');`}</style>
      <PublicTopBar slug={slug} galleryName={artist.galleryName} cartCount={cartCount} palette={p} />

      <main className="px-8 md:px-16 py-20 max-w-2xl mx-auto text-center">
        {artist.avatarUrl && (
          <img src={artist.avatarUrl} alt={artist.galleryName} className="w-24 h-24 rounded-full object-cover mx-auto mb-8" />
        )}
        <p className="text-xs tracking-widest uppercase text-[#B08D57] mb-4">À propos</p>
        <h1 className="text-4xl mb-8" style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>
          {artist.galleryName}
        </h1>
        {artist.bio ? (
          <p className="text-base leading-relaxed text-[#4A473F] whitespace-pre-line">{artist.bio}</p>
        ) : (
          <p className="text-sm text-[#8A8578]">Cet artiste n'a pas encore ajouté de présentation.</p>
        )}

        {artist.signatureUrl && (
          <img src={artist.signatureUrl} alt="Signature" className="h-14 object-contain mx-auto mt-10" />
        )}

        {artist.websiteUrl && (
          <a
            href={artist.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 text-xs tracking-widest uppercase text-[#1A1A18] border border-[#ECEAE4] px-4 py-2.5 rounded-full hover:bg-[#1A1A18] hover:text-white transition-colors"
          >
            <Globe size={13} />
            Site personnel
          </a>
        )}
      </main>

      <PublicFooter slug={slug} palette={p} />
    </div>
  );
}

// Fond sombre ? (sert à garder la signature lisible sur Atelier Sombre / Noir & Or)
function isDark(color: string) {
  if (!color.startsWith("#")) return false;
  const h = color.slice(1);
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}

// ---------- Version pilotée par skins.ts (les 6 thèmes du sélecteur) ----------
export function ThemedAPropos({ skin, artist, slug, cartCount = 0 }: AProposProps & { skin: Skin }) {
  const dark = isDark(skin.bg);

  // Le portrait reprend la forme des cadres du thème.
  let avatar: CSSProperties = { width: 120, height: 120, borderRadius: "50%" };
  if (skin.layout === "swiss") avatar = { width: 120, height: 120, borderRadius: 0 };
  if (skin.layout === "arch") avatar = { width: 120, height: 150, borderRadius: "999px 999px 0 0" };
  if (skin.layout === "capsule") avatar = { width: 110, height: 150, borderRadius: 999 };

  return (
    <ThemedPage skin={skin}>
      <ThemedHeader skin={skin} slug={slug} galleryName={artist.galleryName} cartCount={cartCount} has3d={!!artist.has3dAccess} />

      <main style={{ maxWidth: 680, margin: "0 auto", padding: `72px ${PAD} 96px`, textAlign: "center" }}>
        {artist.avatarUrl && (
          <img
            src={artist.avatarUrl}
            alt={artist.galleryName}
            style={{
              ...avatar,
              display: "block",
              margin: "0 auto 36px",
              objectFit: "cover",
              padding: 4,
              boxSizing: "border-box",
              background: skin.bg,
              border: `1px solid ${skin.decor}`,
            }}
          />
        )}

        <p
          style={{
            margin: "0 0 14px",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: skin.upper ? "0.2em" : "0.04em",
            textTransform: skin.upper ? "uppercase" : "none",
            color: skin.link,
          }}
        >
          À propos
        </p>

        <h1
          style={{
            margin: 0,
            fontFamily: skin.display,
            fontWeight: skin.displayWeight,
            fontStyle: skin.displayItalic ? "italic" : "normal",
            fontSize: "clamp(40px,5vw,60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: skin.ink,
          }}
        >
          {artist.galleryName}
        </h1>

        <div aria-hidden="true" style={{ width: 56, height: 1, background: skin.decor, margin: "32px auto" }} />

        {artist.bio ? (
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.75, color: skin.ink, whiteSpace: "pre-line" }}>{artist.bio}</p>
        ) : (
          <p style={{ margin: 0, fontSize: 15, color: skin.muted }}>Cet artiste n'a pas encore ajouté de présentation.</p>
        )}

        {artist.signatureUrl && (
          <div style={{ marginTop: 48 }}>
            {/* Les signatures sont en général à l'encre foncée : sur un thème
                sombre, on les pose sur un cartouche clair pour qu'elles restent lisibles. */}
            <div
              style={{
                display: "inline-block",
                padding: dark ? "14px 26px" : 0,
                background: dark ? skin.ink : "transparent",
                borderRadius: dark && skin.radius ? 16 : 0,
              }}
            >
              <img src={artist.signatureUrl} alt="Signature" style={{ display: "block", height: 56, objectFit: "contain" }} />
            </div>
          </div>
        )}

        {artist.websiteUrl && (
          <div style={{ marginTop: 48 }}>
            <a href={artist.websiteUrl} target="_blank" rel="noopener noreferrer" style={btnStyle(skin, "outline")} className="hover:opacity-80">
              <Globe size={16} />
              Site personnel
            </a>
          </div>
        )}
      </main>

      <ThemedFooter skin={skin} slug={slug} />
    </ThemedPage>
  );
}

// Conservé pour compatibilité : Maison Haussmann passe désormais par le
// système de skins, comme sa page d'accueil, sa fiche œuvre et son panier.
export function MaisonHaussmannAPropos(props: AProposProps) {
  return <ThemedAPropos skin={SKINS["maison-haussmann"]} {...props} />;
}
