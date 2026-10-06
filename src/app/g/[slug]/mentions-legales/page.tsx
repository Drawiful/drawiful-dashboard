"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GalerieBlancheLegal, MaisonHaussmannLegal } from "@/components/themes/LegalPage";
import { useCart } from "@/lib/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MentionsLegalesPage() {
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
    {
      heading: "Éditeur du site",
      body:
        `Cette galerie, « ${artist.galleryName} », est éditée par son titulaire sur la plateforme Drawiful. ` +
        `[Nom et statut de l'artiste/entreprise, adresse, SIRET le cas échéant — à compléter].`,
    },
    {
      heading: "Hébergement",
      body: "Ce site est hébergé par Vercel Inc. Le backend et les paiements sont opérés par Drawiful SAS.",
    },
    {
      heading: "Propriété intellectuelle",
      body:
        "Les œuvres présentées restent la propriété intellectuelle de leur auteur. Toute reproduction sans " +
        "autorisation est interdite.",
    },
    {
      heading: "Certificats d'authenticité",
      body:
        "Chaque œuvre vendue sur cette galerie peut être accompagnée d'un certificat d'authenticité numéroté, " +
        "vérifiable publiquement depuis sa page dédiée.",
    },
  ];
  const customText = (artist.legalMentionsText ?? "").trim();
  const sections = customText ? [{ heading: "", body: customText }] : genericSections;

  const sharedProps = { title: "Mentions légales", sections, artist, slug, cartCount: items.length };

  switch (artist.theme) {
    case "maison-haussmann":
      return <MaisonHaussmannLegal {...sharedProps} />;
    case "galerie-blanche":
    default:
      return <GalerieBlancheLegal {...sharedProps} />;
  }
}
