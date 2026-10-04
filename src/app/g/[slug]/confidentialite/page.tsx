"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheLegal, MaisonHaussmannLegal } from "@/components/themes/LegalPage";
import { useCart } from "@/lib/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ConfidentialitePage() {
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

  const sections = [
    {
      heading: "Données collectées",
      body: "Lors d'un achat, la galerie collecte le nom, l'adresse email et l'adresse de livraison de l'acheteur.",
    },
    {
      heading: "Utilisation des données",
      body: "Ces données servent uniquement au traitement de la commande, à la livraison et à l'émission du certificat d'authenticité.",
    },
    {
      heading: "Paiement",
      body: "Le paiement est traité par Stripe. Aucune donnée bancaire ne transite ni n'est stockée par cette galerie.",
    },
    {
      heading: "Conservation des données",
      body: "Les données liées à une commande sont conservées pendant la durée nécessaire aux obligations légales et comptables.",
    },
    {
      heading: "Vos droits",
      body: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données en contactant l'éditeur du site.",
    },
    {
      heading: "Cookies",
      body: "Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du panier et de la navigation.",
    },
  ];

  const sharedProps = { title: "Politique de confidentialité", sections, artist, slug, cartCount: items.length };

  switch (artist.theme) {
    case "maison-haussmann":
      return <MaisonHaussmannLegal {...sharedProps} />;
    case "galerie-blanche":
    default:
      return <GalerieBlancheLegal {...sharedProps} />;
  }
}
