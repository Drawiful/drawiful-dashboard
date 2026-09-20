"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Box, Loader2, Lock } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function GalleryPublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [artist, setArtist] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/artists/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setArtist)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFEFC]">
        <p className="text-sm text-[#8A8578]">Galerie introuvable.</p>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFEFC]">
        <Loader2 size={20} className="animate-spin text-[#B08D57]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFEFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <header className="flex flex-col items-center text-center px-8 py-20 border-b border-[#ECEAE4]">
        {artist.avatarUrl && (
          <img
            src={artist.avatarUrl}
            alt={artist.galleryName}
            className="w-16 h-16 rounded-full object-cover mb-6"
          />
        )}
        <h1
          className="text-4xl md:text-5xl mb-3"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: "#1A1A18" }}
        >
          {artist.galleryName}
        </h1>
        {artist.bio && (
          <p className="text-sm text-[#8A8578] max-w-md leading-relaxed">{artist.bio}</p>
        )}
      </header>

      {/* Grille d'œuvres */}
      <main className="px-8 md:px-16 py-16">
        {artist.artworks?.length === 0 ? (
          <p className="text-center text-sm text-[#8A8578]">
            Cette galerie n'a pas encore d'œuvres publiées.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {artist.artworks?.map((art: any) => {
              const priceLabel = new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: art.currency,
              }).format(art.priceCents / 100);

              return (
                <Link
                  key={art.id}
                  href={`/g/${slug}/${art.id}`}
                  className="group block"
                >
                  <div className="relative bg-[#FAFAF7] mb-4 overflow-hidden aspect-[4/5]">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {art.model3dUrl && artist.has3dAccess && (
                      <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur text-[10px] tracking-wide uppercase text-[#1A1A18] px-3 py-1.5 rounded-full">
                        <Box size={11} />
                        3D / RA
                      </span>
                    )}
                    {art.model3dUrl && !artist.has3dAccess && (
                      <span
                        title="Option disponible dans les plans Artiste et Studio"
                        className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/70 backdrop-blur text-[10px] tracking-wide uppercase text-[#B8B4A8] px-3 py-1.5 rounded-full cursor-help"
                      >
                        <Lock size={11} />
                        3D / RA
                      </span>
                    )}
                  </div>
                  <p
                    className="text-lg mb-1"
                    style={{ fontFamily: "'Fraunces', serif", color: "#1A1A18" }}
                  >
                    {art.title}
                  </p>
                  <p className="text-xs text-[#8A8578]">{priceLabel}</p>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer className="text-center py-10 border-t border-[#ECEAE4]">
        <p className="text-xs tracking-widest uppercase text-[#8A8578]">
          Galerie propulsée par Drawiful
        </p>
      </footer>
    </div>
  );
}
