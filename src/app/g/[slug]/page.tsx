"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheListing } from "@/components/themes/GalerieBlanche";
import { ThemedListing } from "@/components/themes/ThemedListing";
import { getSkin } from "@/components/themes/skins";
import { useCart } from "@/lib/cart";
import ShopNotice from "@/components/ShopNotice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function GalleryPublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [artist, setArtist] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const { items, removeItem } = useCart(slug);

  // Retour depuis Stripe : ?order=success ou ?order=canceled
  const [orderResult, setOrderResult] = useState<"success" | "canceled" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const closeNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    const order = new URLSearchParams(window.location.search).get("order");
    if (order !== "success" && order !== "canceled") return;
    setOrderResult(order);
    setNotice(
      order === "success"
        ? "Merci pour votre achat ! Un email de confirmation vient de vous être envoyé. L'artiste vous préviendra dès l'expédition de votre œuvre."
        : "Paiement annulé : rien n'a été débité. Votre panier vous attend si vous changez d'avis."
    );
    // On retire le paramètre de l'adresse pour ne pas réafficher le message
    // si le visiteur recharge la page ou la partage.
    const url = new URL(window.location.href);
    url.searchParams.delete("order");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  // Après un achat réussi, on vide le panier (une œuvre par rendu, quelle que
  // soit l'implémentation de removeItem).
  useEffect(() => {
    if (orderResult === "success" && items.length > 0) {
      removeItem(items[0].artworkId);
    }
  }, [orderResult, items, removeItem]);

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
  // Les 6 thèmes actuels sont décrits dans components/themes/skins.ts.
  const skin = getSkin(artist.theme);

  return (
    <>
      {skin ? (
        <ThemedListing skin={skin} artist={artist} slug={slug} cartCount={items.length} />
      ) : (
        // Ancien thème (« galerie-blanche ») : rendu d'origine conservé.
        <GalerieBlancheListing artist={artist} slug={slug} cartCount={items.length} />
      )}
      <ShopNotice message={notice} onClose={closeNotice} duration={12000} />
    </>
  );
}
