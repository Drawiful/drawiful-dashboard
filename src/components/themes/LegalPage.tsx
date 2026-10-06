"use client";
import { PublicTopBar, PublicFooter, GALERIE_BLANCHE_PALETTE } from "@/components/themes/PublicChrome";
import { getSkin, SKINS } from "@/components/themes/skins";
import type { Skin } from "@/components/themes/skins";
import { ThemedPage, ThemedHeader, ThemedFooter } from "@/components/themes/ThemedChrome";

// Rendu des 3 pages légales (Mentions légales, CGV, Confidentialité).
// Le texte vient soit du modèle générique, soit de ce que l'artiste a saisi
// dans l'onglet « Ma galerie ». L'habillage suit le thème de l'artiste.

export type LegalSection = { heading: string; body: string };

type LegalProps = {
  title: string;
  sections: LegalSection[];
  artist: any;
  slug: string;
  cartCount?: number;
};

function ThemedLegal({ skin, title, sections, artist, slug, cartCount = 0 }: LegalProps & { skin: Skin }) {
  return (
    <ThemedPage skin={skin}>
      <ThemedHeader skin={skin} slug={slug} galleryName={artist.galleryName} cartCount={cartCount} />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "64px clamp(20px,4vw,56px) 96px" }}>
        <h1
          style={{
            margin: "0 0 40px",
            fontFamily: skin.display,
            fontWeight: skin.displayWeight,
            fontSize: 40,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: skin.ink,
          }}
        >
          {title}
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {sections.map((s, i) => (
            <div key={i}>
              {s.heading && (
                <h2 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: skin.link }}>
                  {s.heading}
                </h2>
              )}
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: skin.ink, whiteSpace: "pre-line" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </main>
      <ThemedFooter skin={skin} slug={slug} />
    </ThemedPage>
  );
}

// Les pages légales importent ces deux noms (comme avant). Le thème réel est
// lu dans artist.theme : un thème connu est rendu par ThemedLegal ; seul
// l'ancien thème « galerie-blanche » garde son rendu d'origine.
export function GalerieBlancheLegal(props: LegalProps) {
  const skin = getSkin(props.artist.theme);
  if (skin) return <ThemedLegal skin={skin} {...props} />;

  const { title, sections, artist, slug, cartCount = 0 } = props;
  const p = GALERIE_BLANCHE_PALETTE;
  return (
    <div className="min-h-screen bg-[#FEFEFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap');`}</style>
      <PublicTopBar slug={slug} galleryName={artist.galleryName} cartCount={cartCount} palette={p} />

      <main className="px-8 md:px-16 py-16 max-w-2xl mx-auto">
        <h1 className="text-3xl mb-10" style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>
          {title}
        </h1>
        <div className="flex flex-col gap-8">
          {sections.map((s, i) => (
            <div key={i}>
              {s.heading && <h2 className="text-sm tracking-widest uppercase text-[#B08D57] mb-2">{s.heading}</h2>}
              <p className="text-sm leading-relaxed text-[#4A473F] whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter slug={slug} palette={p} />
    </div>
  );
}

export function MaisonHaussmannLegal(props: LegalProps) {
  return <ThemedLegal skin={SKINS["maison-haussmann"]} {...props} />;
}
