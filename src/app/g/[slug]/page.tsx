"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheListing } from "@/components/themes/GalerieBlanche";
import { MaisonHaussmannListing } from "@/components/themes/MaisonHaussmann";

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

  // artist.theme pilote l'habillage visuel ; même contrat de données,
  // même logique métier (has3dAccess, panier, achat) pour tous les thèmes.
  switch (artist.theme) {
    case "maison-haussmann":
      return <MaisonHaussmannListing artist={artist} slug={slug} />;
    case "galerie-blanche":
    default:
      return <GalerieBlancheListing artist={artist} slug={slug} />;
  }
}
