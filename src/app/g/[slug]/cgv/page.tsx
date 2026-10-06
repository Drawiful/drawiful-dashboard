"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheLegal, MaisonHaussmannLegal } from "@/components/themes/LegalPage";
import { useCart } from "@/lib/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CgvPage() {
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

 const genericSections = [
    { heading: "Objet", body: `Les présentes conditions régissent les ventes d'œuvres réalisées sur la galerie « ${artist.galleryName} ».` },
    {
      heading: "Œuvres et prix",
      body: "Les œuvres présentées sont des pièces originales et uniques. Les prix affichés sont en euros, toutes taxes comprises.",
    },
    {
      heading: "Commande",
      body: "Toute commande passée via le bouton d'achat ou le panier vaut acceptation du prix et des présentes conditions.",
    },
    {
      heading: "Paiement",
      body: "Le paiement est traité de façon sécurisée par Stripe. Aucune donnée bancaire n'est conservée par la galerie.",
    },
    {
      heading: "Certificat d'authenticité",
      body: "Un certificat d'authenticité numéroté et vérifiable est fourni pour chaque œuvre, le cas échéant.",
    },
    {
      heading: "Livraison",
      body: "[Zones de livraison, délais indicatifs et transporteur — à compléter par l'artiste].",
    },
    {
      heading: "Droit de rétractation",
      body:
        "Conformément à la réglementation en vigueur, l'acheteur dispose d'un délai de rétractation pour les " +
        "achats effectués à distance, sous réserve des exceptions applicables aux biens personnalisés ou uniques.",
    },
    {
      heading: "Litiges",
      body: "Tout litige relève des tribunaux compétents du lieu du siège de l'éditeur du site.",
    },
  ];

  const customText = (artist.termsOfSaleText ?? "").trim();
  const sections = customText ? [{ heading: "", body: customText }] : genericSections;

  const sharedProps = { title: "Conditions générales de vente", sections, artist, slug, cartCount: items.length };

  switch (artist.theme) {
    case "maison-haussmann":
      return <MaisonHaussmannLegal {...sharedProps} />;
    case "galerie-blanche":
    default:
      return <GalerieBlancheLegal {...sharedProps} />;
  }
}
