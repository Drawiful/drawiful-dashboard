import type { ComponentType } from "react";
import { ROOT_DOMAIN } from "@/lib/domain";
import VendreSansCommission from "@/content/blog/vendre-oeuvres-en-ligne-sans-commission";
import CertificatAuthenticite from "@/content/blog/certificat-authenticite-oeuvre-art";
import PrixOeuvre from "@/content/blog/fixer-prix-oeuvre-art";

/*
  Articles du blog (drawiful.art/blog). Pour en ajouter un :
  1. créer le texte dans src/content/blog/<slug>.tsx (composant React) ;
  2. l'ajouter dans la liste ci-dessous (le plus récent en premier).
  Le sitemap (/sitemap.xml) et la page /blog se mettent à jour tout seuls.
*/

export type BlogPost = {
  slug: string;
  title: string; // titre affiché (h1)
  seoTitle: string; // titre de l'onglet et de Google, ~60 caractères
  description: string; // description Google, ~150 caractères
  excerpt: string; // résumé sur la page /blog
  date: string; // AAAA-MM-JJ
  readingMinutes: number;
  Content: ComponentType;
};

export const SITE_URL = `https://${ROOT_DOMAIN}`;

export const POSTS: BlogPost[] = [
  {
    slug: "vendre-oeuvres-en-ligne-sans-commission",
    title: "Vendre ses œuvres d'art en ligne sans commission : le guide 2026",
    seoTitle: "Vendre ses œuvres d'art en ligne sans commission (guide 2026)",
    description:
      "Galerie, Saatchi, Artmajeur, Etsy ou ta propre galerie : combien tu gardes vraiment sur une vente de 1 000 €, et comment vendre en direct.",
    excerpt:
      "Sur une vente de 1 000 €, tu peux garder 500 € ou presque tout. Comparatif des commissions et méthode pour vendre en direct.",
    date: "2026-10-27",
    readingMinutes: 8,
    Content: VendreSansCommission,
  },
  {
    slug: "certificat-authenticite-oeuvre-art",
    title: "Certificat d'authenticité d'une œuvre d'art : que doit-il contenir ? (modèle)",
    seoTitle: "Certificat d'authenticité œuvre d'art : contenu et modèle",
    description:
      "Les mentions à faire figurer sur un certificat d'authenticité, ce que dit la loi en France, un modèle à recopier et les erreurs à éviter.",
    excerpt:
      "Les informations indispensables, les mots qui engagent juridiquement et un modèle prêt à l'emploi pour tes œuvres.",
    date: "2026-10-27",
    readingMinutes: 7,
    Content: CertificatAuthenticite,
  },
  {
    slug: "fixer-prix-oeuvre-art",
    title: "Comment fixer le prix de ses œuvres d'art : 3 méthodes simples",
    seoTitle: "Fixer le prix de ses tableaux et dessins : 3 méthodes",
    description:
      "Prix au point, matériaux et temps passé, comparaison avec d'autres artistes : trois méthodes concrètes pour fixer le prix de tes œuvres.",
    excerpt:
      "Prix au point, coût et temps passé, comparables : trois méthodes concrètes et les règles pour garder des prix cohérents.",
    date: "2026-10-27",
    readingMinutes: 7,
    Content: PrixOeuvre,
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
}
