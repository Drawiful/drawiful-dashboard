"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheArtwork } from "@/components/themes/GalerieBlanche";
import { ThemedArtwork } from "@/components/themes/ThemedArtwork";
import { getSkin } from "@/components/themes/skins";
import { useCart } from "@/lib/cart";
import ShopNotice, { NOT_OPEN_MESSAGE } from "@/components/ShopNotice";

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
  const [notice, setNotice] = useState<string | null>(null);
  const closeNotice = useCallback(() => setNotice(null), []);

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
        setNotice(data.message || "Impossible de lancer le paiement. Réessayez dans un instant.");
        setBuying(false);
      }
    } catch {
      setNotice("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setBuying(false);
    }
  }

  // Absent (ancien backend) = on considère que la boutique est ouverte.
  const canBuy = artist?.acceptsPayments !== false;

  function handleBuyNow() {
    if (!canBuy) {
      setNotice(NOT_OPEN_MESSAGE);
      return;
    }
    checkout([{ artworkId, quantity: 1 }]);
  }

  function handleAddToCart() {
    if (!artwork) return;
    if (!canBuy) {
      setNotice(NOT_OPEN_MESSAGE);
      return;
    }
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
    cartCount: items.length,
  };

  // Les 6 thèmes du sélecteur (Maison Haussmann compris) passent par le
  // système de skins. Un ancien thème ("galerie-blanche") ou inconnu garde
  // son rendu d'origine.
  const skin = getSkin(artist.theme);
  return (
    <>
      {skin ? (
        <ThemedArtwork skin={skin} {...sharedProps} canBuy={canBuy} />
      ) : (
        <GalerieBlancheArtwork {...sharedProps} />
      )}
      <ShopNotice message={notice} onClose={closeNotice} />
    </>
  );
}
