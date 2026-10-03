"use client";
import Link from "next/link";
import { Box, Lock, ShieldCheck, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import ModelViewerPremium from "@/components/ModelViewerPremium";
import type { CartItem } from "@/lib/cart";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap');`;

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

// ---------- Liste des œuvres ----------
export function GalerieBlancheListing({ artist, slug }: { artist: any; slug: string }) {
  return (
    <div className="min-h-screen bg-[#FEFEFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`${FONT_IMPORT}`}</style>

      <header className="flex flex-col items-center text-center px-8 py-20 border-b border-[#ECEAE4]">
        {artist.avatarUrl && (
          <img src={artist.avatarUrl} alt={artist.galleryName} className="w-16 h-16 rounded-full object-cover mb-6" />
        )}
        <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: "#1A1A18" }}>
          {artist.galleryName}
        </h1>
        {artist.bio && <p className="text-sm text-[#8A8578] max-w-md leading-relaxed">{artist.bio}</p>}
        <Link
          href={`/g/${slug}/panier`}
          className="flex items-center gap-2 mt-8 text-xs tracking-widest uppercase text-[#1A1A18] border border-[#ECEAE4] px-4 py-2.5 rounded-full hover:bg-[#1A1A18] hover:text-white transition-colors"
        >
          <ShoppingBag size={13} />
          Mon panier
        </Link>
      </header>

      <main className="px-8 md:px-16 py-16">
        {artist.artworks?.length === 0 ? (
          <p className="text-center text-sm text-[#8A8578]">Cette galerie n'a pas encore d'œuvres publiées.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {artist.artworks?.map((art: any) => (
              <Link key={art.id} href={`/g/${slug}/${art.id}`} className="group block">
                <div className="relative bg-[#FAFAF7] mb-4 overflow-hidden aspect-[4/5]">
                  <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {art.model3dUrl && artist.has3dAccess && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur text-[10px] tracking-wide uppercase text-[#1A1A18] px-3 py-1.5 rounded-full">
                      <Box size={11} />
                      3D / RA
                    </span>
                  )}
                  {art.model3dUrl && !artist.has3dAccess && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/70 backdrop-blur text-[10px] tracking-wide uppercase text-[#B8B4A8] px-3 py-1.5 rounded-full cursor-help">
                      <Lock size={11} />
                      3D / RA
                    </span>
                  )}
                </div>
                <p className="text-lg mb-1" style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>{art.title}</p>
                <p className="text-xs text-[#8A8578]">{money(art.priceCents, art.currency)}</p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-10 border-t border-[#ECEAE4]">
        <p className="text-xs tracking-widest uppercase text-[#8A8578]">Galerie propulsée par Drawiful</p>
      </footer>
    </div>
  );
}

// ---------- Fiche œuvre ----------
export function GalerieBlancheArtwork({
  artist,
  artwork,
  slug,
  inCart,
  onAddToCart,
  onBuyNow,
  buying,
  view3d,
  setView3d,
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
}) {
  return (
    <div className="min-h-screen bg-[#FEFEFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`${FONT_IMPORT}`}</style>

      <header className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-[#ECEAE4]">
        <Link href={`/g/${slug}`} className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#8A8578] hover:text-[#1A1A18] transition-colors">
          <ArrowLeft size={13} />
          Retour à la galerie
        </Link>
        <div className="flex items-center gap-5">
          <p className="text-sm" style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>{artist.galleryName}</p>
          <Link href={`/g/${slug}/panier`} className="text-[#1A1A18]">
            <ShoppingBag size={16} />
          </Link>
        </div>
      </header>

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-73px)]">
        <div className="relative bg-[#FAFAF7] flex items-center justify-center">
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
              className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur text-[#1A1A18] text-xs tracking-wide uppercase px-4 py-2.5 rounded-full border border-[#ECEAE4] hover:bg-white transition-colors"
            >
              <Box size={13} />
              {view3d ? "Voir en 2D" : "Explorer en 3D"}
            </button>
          )}
        </div>

        <div className="flex flex-col justify-center px-8 md:px-16 py-16 max-w-xl">
          <p className="text-xs tracking-widest uppercase text-[#B08D57] mb-4">Œuvre originale</p>
          <h1 className="text-4xl md:text-5xl mb-4 leading-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: "#1A1A18" }}>
            {artwork.title}
          </h1>
          <p className="text-sm text-[#8A8578] mb-8">Par {artist.galleryName}</p>

          {artwork.description && <p className="text-sm leading-relaxed text-[#4A473F] mb-10">{artwork.description}</p>}

          <p className="text-2xl mb-8" style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>
            {money(artwork.priceCents, artwork.currency)}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onBuyNow}
              disabled={buying}
              className="w-full py-4 bg-[#1A1A18] text-white text-xs tracking-widest uppercase hover:bg-[#333] transition-colors disabled:opacity-60"
            >
              {buying ? "Redirection..." : "Acheter maintenant"}
            </button>
            <button
              onClick={onAddToCart}
              disabled={inCart}
              className="w-full py-4 border border-[#1A1A18] text-[#1A1A18] text-xs tracking-widest uppercase hover:bg-[#1A1A18] hover:text-white transition-colors disabled:opacity-50"
            >
              {inCart ? "Déjà dans le panier" : "Ajouter au panier"}
            </button>
          </div>
          <p className="text-xs text-[#8A8578] mt-3 text-center">Paiement sécurisé · Livraison incluse</p>

          {artwork.certificate && (
            <a href={`/certificate/${artwork.certificate.serialNumber}`} target="_blank" className="flex items-center gap-2 mt-8 pt-8 border-t border-[#ECEAE4] text-xs text-[#4A473F]">
              <ShieldCheck size={15} className="text-[#B08D57]" />
              Certificat d'authenticité inclus — vérifiable publiquement
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Panier ----------
export function GalerieBlancheCart({
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
    <div className="min-h-screen bg-[#FEFEFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`${FONT_IMPORT}`}</style>

      <header className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-[#ECEAE4]">
        <Link href={`/g/${slug}`} className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#8A8578] hover:text-[#1A1A18] transition-colors">
          <ArrowLeft size={13} />
          Continuer mes achats
        </Link>
        <p className="text-sm" style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>{artist.galleryName}</p>
      </header>

      <main className="px-8 md:px-16 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl mb-10" style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>Votre panier</h1>

        {items.length === 0 ? (
          <p className="text-sm text-[#8A8578]">Votre panier est vide.</p>
        ) : (
          <>
            <div className="flex flex-col gap-6 mb-10">
              {items.map((item) => (
                <div key={item.artworkId} className="flex items-center gap-5 pb-6 border-b border-[#ECEAE4]">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-20 h-24 object-cover bg-[#FAFAF7]" />}
                  <div className="flex-1">
                    <p style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>{item.title}</p>
                    <p className="text-xs text-[#8A8578] mt-1">{money(item.priceCents, item.currency)}</p>
                  </div>
                  <button onClick={() => removeItem(item.artworkId)} className="text-[#8A8578] hover:text-[#1A1A18]" aria-label="Retirer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-6 border-t border-[#ECEAE4] mb-8">
              <p className="text-sm uppercase tracking-widest text-[#8A8578]">Total</p>
              <p className="text-2xl" style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}>
                {money(totalCents, items[0]?.currency || "EUR")}
              </p>
            </div>

            <button
              onClick={onCheckout}
              disabled={checkingOut}
              className="w-full py-4 bg-[#1A1A18] text-white text-xs tracking-widest uppercase hover:bg-[#333] transition-colors disabled:opacity-60"
            >
              {checkingOut ? "Redirection..." : "Passer au paiement"}
            </button>
            <p className="text-xs text-[#8A8578] mt-3 text-center">Paiement sécurisé · Livraison incluse</p>
          </>
        )}
      </main>
    </div>
  );
}
