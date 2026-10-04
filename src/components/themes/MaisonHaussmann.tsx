"use client";
import Link from "next/link";
import { Box, Lock, ShieldCheck, ArrowLeft, Trash2 } from "lucide-react";
import ModelViewerPremium from "@/components/ModelViewerPremium";
import type { CartItem } from "@/lib/cart";
import { PublicTopBar, PublicFooter, MAISON_HAUSSMANN_PALETTE as PALETTE } from "@/components/themes/PublicChrome";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Instrument+Sans:wght@400;500&display=swap');`;

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

// ---------- Liste des œuvres ----------
export function MaisonHaussmannListing({ artist, slug, cartCount = 0 }: { artist: any; slug: string; cartCount?: number }) {
  return (
    <div className="min-h-screen bg-[#F6F1E3]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`${FONT_IMPORT}`}</style>
      <PublicTopBar slug={slug} galleryName={artist.galleryName} cartCount={cartCount} palette={PALETTE} />

      <header className="flex flex-col items-center text-center px-8 py-20 border-b border-[#D8C9A8]">
        <p className="text-[11px] tracking-[0.25em] uppercase text-[#B9862F] mb-5">✦ ✦ ✦ Galerie</p>
        {artist.avatarUrl && (
          <img src={artist.avatarUrl} alt={artist.galleryName} className="w-16 h-16 rounded-full object-cover mb-6 border border-[#D8C9A8]" />
        )}
        <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: "#2B2013" }}>
          {artist.galleryName}
        </h1>
        {artist.bio && <p className="text-sm text-[#7C5A2E] max-w-md leading-relaxed">{artist.bio}</p>}
      </header>

      <main className="px-8 md:px-16 py-16">
        {artist.artworks?.length === 0 ? (
          <p className="text-center text-sm text-[#7C5A2E]">Cette galerie n'a pas encore d'œuvres publiées.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {artist.artworks?.map((art: any) => (
              <Link key={art.id} href={`/g/${slug}/${art.id}`} className="group block">
                <div className="relative bg-[#EFE6D2] mb-4 overflow-hidden aspect-[4/5] border border-[#D8C9A8]">
                  <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {art.model3dUrl && artist.has3dAccess && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#F6F1E3]/90 backdrop-blur text-[10px] tracking-wide uppercase text-[#2B2013] px-3 py-1.5 rounded-full border border-[#D8C9A8]">
                      <Box size={11} />
                      3D / RA
                    </span>
                  )}
                  {art.model3dUrl && !artist.has3dAccess && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#F6F1E3]/70 backdrop-blur text-[10px] tracking-wide uppercase text-[#B5A68A] px-3 py-1.5 rounded-full cursor-help border border-[#D8C9A8]">
                      <Lock size={11} />
                      3D / RA
                    </span>
                  )}
                </div>
                <p className="text-lg mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2B2013" }}>{art.title}</p>
                <p className="text-xs text-[#7C5A2E]">{money(art.priceCents, art.currency)}</p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <PublicFooter slug={slug} palette={PALETTE} />
    </div>
  );
}

// ---------- Fiche œuvre ----------
export function MaisonHaussmannArtwork({
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
}: {
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
}) {
  return (
    <div className="min-h-screen bg-[#F6F1E3]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`${FONT_IMPORT}`}</style>
      <PublicTopBar slug={slug} galleryName={artist.galleryName} cartCount={cartCount} palette={PALETTE} />

      <header className="flex items-center justify-between px-8 md:px-16 py-4 border-b border-[#D8C9A8]">
        <Link href={`/g/${slug}`} className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#7C5A2E] hover:text-[#2B2013] transition-colors">
          <ArrowLeft size={13} />
          Retour à la galerie
        </Link>
      </header>

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-73px)]">
        <div className="relative bg-[#EFE6D2] flex items-center justify-center">
          {artwork.model3dUrl && artist.has3dAccess && view3d ? (
            <div className="w-full h-[70vh] md:h-full">
              <ModelViewerPremium src={artwork.model3dUrl} poster={artwork.imageUrl} alt={artwork.title} />
            </div>
          ) : (
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-[70vh] md:h-full object-contain p-8 md:p-16" />
          )}

          {artwork.model3dUrl && artist.has3dAccess && (
            <button
              onClick={() => setView3d(!view3d)}
              className="absolute top-6 right-6 flex items-center gap-2 bg-[#F6F1E3]/90 backdrop-blur text-[#2B2013] text-xs tracking-wide uppercase px-4 py-2.5 rounded-full border border-[#D8C9A8] hover:bg-[#F6F1E3] transition-colors"
            >
              <Box size={13} />
              {view3d ? "Voir en 2D" : "Explorer en 3D"}
            </button>
          )}
        </div>

        <div className="flex flex-col justify-center px-8 md:px-16 py-16 max-w-xl">
          <p className="text-xs tracking-widest uppercase text-[#B9862F] mb-4">Œuvre originale</p>
          <h1 className="text-4xl md:text-5xl mb-4 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: "#2B2013" }}>
            {artwork.title}
          </h1>
          <p className="text-sm text-[#7C5A2E] mb-8">Par {artist.galleryName}</p>

          {artwork.description && <p className="text-sm leading-relaxed text-[#2B2013] mb-10">{artwork.description}</p>}

          <p className="text-2xl mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2B2013" }}>
            {money(artwork.priceCents, artwork.currency)}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onBuyNow}
              disabled={buying}
              className="w-full py-4 bg-[#2B2013] text-[#F6F1E3] text-xs tracking-widest uppercase hover:bg-[#44331F] transition-colors disabled:opacity-60"
            >
              {buying ? "Redirection..." : "Acheter maintenant"}
            </button>
            <button
              onClick={onAddToCart}
              disabled={inCart}
              className="w-full py-4 border border-[#2B2013] text-[#2B2013] text-xs tracking-widest uppercase hover:bg-[#2B2013] hover:text-[#F6F1E3] transition-colors disabled:opacity-50"
            >
              {inCart ? "Déjà dans le panier" : "Ajouter au panier"}
            </button>
          </div>
          <p className="text-xs text-[#7C5A2E] mt-3 text-center">Paiement sécurisé · Livraison incluse</p>

          {artwork.certificate && (
            <a href={`/certificate/${artwork.certificate.serialNumber}`} target="_blank" className="flex items-center gap-2 mt-8 pt-8 border-t border-[#D8C9A8] text-xs text-[#2B2013]">
              <ShieldCheck size={15} className="text-[#B9862F]" />
              Certificat d'authenticité inclus — vérifiable publiquement
            </a>
          )}
        </div>
      </div>
      <PublicFooter slug={slug} palette={PALETTE} />
    </div>
  );
}

// ---------- Panier ----------
export function MaisonHaussmannCart({
  artist,
  slug,
  items,
  removeItem,
  totalCents,
  onCheckout,
  checkingOut,
}: {
  artist: any;
  slug: string;
  items: CartItem[];
  removeItem: (id: string) => void;
  totalCents: number;
  onCheckout: () => void;
  checkingOut: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#F6F1E3]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <style>{`${FONT_IMPORT}`}</style>
      <PublicTopBar slug={slug} galleryName={artist.galleryName} cartCount={items.length} palette={PALETTE} />

      <header className="flex items-center justify-between px-8 md:px-16 py-4 border-b border-[#D8C9A8]">
        <Link href={`/g/${slug}`} className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#7C5A2E] hover:text-[#2B2013] transition-colors">
          <ArrowLeft size={13} />
          Continuer mes achats
        </Link>
      </header>

      <main className="px-8 md:px-16 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl mb-10" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2B2013" }}>Votre panier</h1>

        {items.length === 0 ? (
          <p className="text-sm text-[#7C5A2E]">Votre panier est vide.</p>
        ) : (
          <>
            <div className="flex flex-col gap-6 mb-10">
              {items.map((item) => (
                <div key={item.artworkId} className="flex items-center gap-5 pb-6 border-b border-[#D8C9A8]">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-20 h-24 object-cover bg-[#EFE6D2] border border-[#D8C9A8]" />}
                  <div className="flex-1">
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2B2013" }}>{item.title}</p>
                    <p className="text-xs text-[#7C5A2E] mt-1">{money(item.priceCents, item.currency)}</p>
                  </div>
                  <button onClick={() => removeItem(item.artworkId)} className="text-[#7C5A2E] hover:text-[#2B2013]" aria-label="Retirer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-6 border-t border-[#D8C9A8] mb-8">
              <p className="text-sm uppercase tracking-widest text-[#7C5A2E]">Total</p>
              <p className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2B2013" }}>
                {money(totalCents, items[0]?.currency || "EUR")}
              </p>
            </div>

            <button
              onClick={onCheckout}
              disabled={checkingOut}
              className="w-full py-4 bg-[#2B2013] text-[#F6F1E3] text-xs tracking-widest uppercase hover:bg-[#44331F] transition-colors disabled:opacity-60"
            >
              {checkingOut ? "Redirection..." : "Passer au paiement"}
            </button>
            <p className="text-xs text-[#7C5A2E] mt-3 text-center">Paiement sécurisé · Livraison incluse</p>
          </>
        )}
      </main>
      <PublicFooter slug={slug} palette={PALETTE} />
    </div>
  );
}
