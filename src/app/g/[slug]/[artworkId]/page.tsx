"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheArtwork } from "@/components/themes/GalerieBlanche";
import { MaisonHaussmannArtwork } from "@/components/themes/MaisonHaussmann";
import { useCart } from "@/lib/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ArtworkPublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const artworkId = params.artworkId as string;

  const [artist, setArtist] = useState<any>(null);
  const [artwork, setArtwork] = useState<any>(null);
  const [view3d, setView3d] = useState(false);
  const [buying, setBuying] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { items, addItem } = useCart(slug);
  const inCart = items.some((i) => i.artworkId === artworkId);

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

  async function checkout(items: { artworkId: string; quantity: number }[]) {
    setBuying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistSlug: slug, items }),
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

  function handleBuyNow() {
    checkout([{ artworkId, quantity: 1 }]);
  }

  function handleAddToCart() {
    if (!artwork) return;
    addItem({
      artworkId: artwork.id,
      title: artwork.title,
      priceCents: artwork.priceCents,
      currency: artwork.currency,
      imageUrl: artwork.imageUrl,
    });
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

  const sharedProps = {
    artist,
    artwork,
    slug,
    inCart,
    onAddToCart: handleAddToCart,
    onBuyNow: handleBuyNow,
    buying,
    view3d,
    setView3d,
  };

  switch (artist.theme) {
    case "maison-haussmann":
      return <MaisonHaussmannArtwork {...sharedProps} />;
    case "galerie-blanche":
    default:
      return <GalerieBlancheArtwork {...sharedProps} />;
  }
}
