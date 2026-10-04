"use client";
import { Globe } from "lucide-react";
import { PublicTopBar, PublicFooter, GALERIE_BLANCHE_PALETTE, MAISON_HAUSSMANN_PALETTE } from "@/components/themes/PublicChrome";

// Page "À propos" — construite uniquement à partir des champs réellement
// disponibles sur le profil artiste (bio, avatar, signature, site web).
// Pas de timeline d'expositions : ce champ n'existe pas encore côté backend.

export function GalerieBlancheAPropos({ artist, slug, cartCount = 0 }: { artist: any; slug: string; cartCount?: number }) {
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

export function MaisonHaussmannAPropos({ artist, slug, cartCount = 0 }: { artist: any; slug: string; cartCount?: number }) {
  const p = MAISON_HAUSSMANN_PALETTE;
  return (
    <div className="min-h-screen bg-[#F6F1E3]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Instrument+Sans:wght@400;500&display=swap');`}</style>
      <PublicTopBar slug={slug} galleryName={artist.galleryName} cartCount={cartCount} palette={p} />

      <main className="px-8 md:px-16 py-20 max-w-2xl mx-auto text-center">
        {artist.avatarUrl && (
          <img src={artist.avatarUrl} alt={artist.galleryName} className="w-24 h-24 rounded-full object-cover mx-auto mb-8 border border-[#D8C9A8]" />
        )}
        <p className="text-xs tracking-widest uppercase text-[#B9862F] mb-4">À propos</p>
        <h1 className="text-4xl mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: "#2B2013" }}>
          {artist.galleryName}
        </h1>
        {artist.bio ? (
          <p className="text-base leading-relaxed text-[#2B2013] whitespace-pre-line">{artist.bio}</p>
        ) : (
          <p className="text-sm text-[#7C5A2E]">Cet artiste n'a pas encore ajouté de présentation.</p>
        )}

        {artist.signatureUrl && (
          <img src={artist.signatureUrl} alt="Signature" className="h-14 object-contain mx-auto mt-10" />
        )}

        {artist.websiteUrl && (
          <a
            href={artist.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 text-xs tracking-widest uppercase text-[#2B2013] border border-[#D8C9A8] px-4 py-2.5 rounded-full hover:bg-[#2B2013] hover:text-[#F6F1E3] transition-colors"
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
