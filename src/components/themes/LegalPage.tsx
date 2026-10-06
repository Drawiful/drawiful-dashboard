"use client";
import { PublicTopBar, PublicFooter, GALERIE_BLANCHE_PALETTE, MAISON_HAUSSMANN_PALETTE } from "@/components/themes/PublicChrome";

// Rendu générique pour les 3 pages légales (Mentions légales, CGV,
// Confidentialité). Le contenu est un modèle générique au nom de la
// galerie — ce n'est PAS encore un champ éditable par artiste en base,
// donc c'est un texte-cadre à affiner, pas une mention juridique garantie
// conforme pour chaque artiste.

export type LegalSection = { heading: string; body: string };

export function GalerieBlancheLegal({
  title,
  sections,
  artist,
  slug,
  cartCount = 0,
}: {
  title: string;
  sections: LegalSection[];
  artist: any;
  slug: string;
  cartCount?: number;
}) {
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

export function MaisonHaussmannLegal({
  title,
  sections,
  artist,
  slug,
  cartCount = 0,
}: {
  title: string;
  sections: LegalSection[];
  artist: any;
  slug: string;
  cartCount?: number;
}) {
  const p = MAISON_HAUSSMANN_PALETTE;
  return (
    <div className="min-h-screen bg-[#F6F1E3]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Instrument+Sans:wght@400;500&display=swap');`}</style>
      <PublicTopBar slug={slug} galleryName={artist.galleryName} cartCount={cartCount} palette={p} />

      <main className="px-8 md:px-16 py-16 max-w-2xl mx-auto">
        <h1 className="text-3xl mb-10" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2B2013" }}>
          {title}
        </h1>
        <div className="flex flex-col gap-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-sm tracking-widest uppercase text-[#B9862F] mb-2">{s.heading}</h2>
              <p className="text-sm leading-relaxed text-[#2B2013] whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter slug={slug} palette={p} />
    </div>
  );
}
