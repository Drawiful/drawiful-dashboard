"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheAPropos, ThemedAPropos } from "@/components/themes/APropos";
import { getSkin } from "@/components/themes/skins";
import { useCart } from "@/lib/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AProposPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [artist, setArtist] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const { items } = useCart(slug);

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

  // Les 6 thèmes du sélecteur passent par le système de skins ;
  // l'ancien "galerie-blanche" garde son rendu d'origine.
  const skin = getSkin(artist.theme);
  if (skin) {
    return <ThemedAPropos skin={skin} artist={artist} slug={slug} cartCount={items.length} />;
  }
  return <GalerieBlancheAPropos artist={artist} slug={slug} cartCount={items.length} />;
}
