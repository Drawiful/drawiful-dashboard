"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, ShieldCheck, ArrowLeft, Loader2, Lock } from "lucide-react";
import ModelViewerPremium from "@/components/ModelViewerPremium";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ArtworkPublicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const artworkId = params.artworkId as string;

  const [artist, setArtist] = useState<any>(null);
  const [artwork, setArtwork] = useState<any>(null);
  const [view3d, setView3d] = useState(false);
  const [buying, setBuying] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/artists/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setArtist(data);
        const art = data.artworks?.find((a: any) => a.id === artworkId);
        if (!art) {
          setNotFound(true);
        } else {
          setArtwork(art);
        }
      })
      .catch(() => setNotFound(true));
  }, [slug, artworkId]);

  async function handleBuy() {
    setBuying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistSlug: slug, items: [{ artworkId, quantity: 1 }] }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.message || "Impossible de lancer le paiement");
        setBuying(false);
      }
    } catch {
      setBuying(false);
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFEFC]">
        <p className="text-sm text-[#8A8578]">Œuvre introuvable.</p>
      </div>
    );
  }

  if (!artwork || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFEFC]">
        <Loader2 size={20} className="animate-spin text-[#B08D57]" />
      </div>
    );
  }

  const priceLabel = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: artwork.currency,
  }).format(artwork.priceCents / 100);

  return (
    <div className="min-h-screen bg-[#FEFEFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header minimal */}
      <header className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-[#ECEAE4]">
        <button
          onClick={() => router.push(`/g/${slug}`)}
          className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#8A8578] hover:text-[#1A1A18] transition-colors"
        >
          <ArrowLeft size={13} />
          Retour à la galerie
        </button>
        <p
          className="text-sm"
          style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}
        >
          {artist.galleryName}
        </p>
      </header>

      <div className="grid md:grid-cols-2 min-h-[calc(100vh-73px)]">
        {/* Visuel */}
        <div className="relative bg-[#FAFAF7] flex items-center justify-center">
          {artwork.model3dUrl && artist.has3dAccess && view3d ? (
            <div className="w-full h-[70vh] md:h-full">
              <ModelViewerPremium
                src={artwork.model3dUrl}
                poster={artwork.imageUrl}
                alt={artwork.title}
              />
            </div>
          ) : (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-[70vh] md:h-full object-contain p-8 md:p-16"
            />
          )}

          {artwork.model3dUrl && (
            <>
              {artist.has3dAccess ? (
                <button
                  onClick={() => setView3d(!view3d)}
                  className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur text-[#1A1A18] text-xs tracking-wide uppercase px-4 py-2.5 rounded-full border border-[#ECEAE4] hover:bg-white transition-colors"
                >
                  <Box size={13} />
                  {view3d ? "Voir en 2D" : "Explorer en 3D"}
                </button>
              ) : (
                <div className="absolute top-6 right-6 flex flex-col items-end gap-1.5">
                  <button
                    disabled
                    className="flex items-center gap-2 bg-white/60 backdrop-blur text-[#B8B4A8] text-xs tracking-wide uppercase px-4 py-2.5 rounded-full border border-[#ECEAE4] cursor-not-allowed"
                  >
                    <Lock size={13} />
                    Explorer en 3D
                  </button>
                  <p className="text-[10px] text-[#8A8578] text-right max-w-[180px] leading-tight">
                    Option disponible dans les plans Artiste et Studio
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Infos */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 max-w-xl">
          <p className="text-xs tracking-widest uppercase text-[#B08D57] mb-4">
            Œuvre originale
          </p>
          <h1
            className="text-4xl md:text-5xl mb-4 leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: "#1A1A18" }}
          >
            {artwork.title}
          </h1>
          <p className="text-sm text-[#8A8578] mb-8">Par {artist.galleryName}</p>

          {artwork.description && (
            <p className="text-sm leading-relaxed text-[#4A473F] mb-10">
              {artwork.description}
            </p>
          )}

          <p
            className="text-2xl mb-8"
            style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}
          >
            {priceLabel}
          </p>

          <button
            onClick={handleBuy}
            disabled={buying}
            className="w-full py-4 bg-[#1A1A18] text-white text-xs tracking-widest uppercase hover:bg-[#333] transition-colors disabled:opacity-60"
          >
            {buying ? "Redirection..." : "Acquérir cette œuvre"}
          </button>
          <p className="text-xs text-[#8A8578] mt-3 text-center">
            Paiement sécurisé · Livraison incluse
          </p>

          {artwork.certificate && (
            <a
              href={`/certificate/${artwork.certificate.serialNumber}`}
              target="_blank"
              className="flex items-center gap-2 mt-8 pt-8 border-t border-[#ECEAE4] text-xs text-[#4A473F]"
            >
              <ShieldCheck size={15} className="text-[#B08D57]" />
              Certificat d'authenticité inclus — vérifiable publiquement
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
