"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheCart } from "@/components/themes/GalerieBlanche";
import { ThemedCart } from "@/components/themes/ThemedCart";
import { getSkin } from "@/components/themes/skins";
import { useCart } from "@/lib/cart";
import ShopNotice, { NOT_OPEN_MESSAGE } from "@/components/ShopNotice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CartPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [artist, setArtist] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const closeNotice = useCallback(() => setNotice(null), []);

  const { items, removeItem, totalCents } = useCart(slug);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/artists/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setArtist)
      .catch(() => setNotFound(true));
  }, [slug]);

  async function handleCheckout() {
    // Absent (ancien backend) = on considère que la boutique est ouverte.
    if (artist?.acceptsPayments === false) {
      setNotice(NOT_OPEN_MESSAGE);
      return;
    }
    setCheckingOut(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistSlug: slug,
          items: items.map((i) => ({ artworkId: i.artworkId, quantity: 1 })),
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setNotice(data.message || "Impossible de lancer le paiement. Réessayez dans un instant.");
        setCheckingOut(false);
      }
    } catch {
      setNotice("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setCheckingOut(false);
    }
  }

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

  const sharedProps = {
    artist,
    slug,
    items,
    removeItem,
    totalCents,
    onCheckout: handleCheckout,
    checkingOut,
  };

  // Les 6 thèmes du sélecteur passent par le système de skins ;
  // l'ancien "galerie-blanche" garde son rendu d'origine.
  const skin = getSkin(artist.theme);
  return (
    <>
      {skin ? <ThemedCart skin={skin} {...sharedProps} /> : <GalerieBlancheCart {...sharedProps} />}
      <ShopNotice message={notice} onClose={closeNotice} />
    </>
  );
}
