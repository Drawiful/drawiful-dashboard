import type { ComponentType } from "react";
import { ROOT_DOMAIN } from "@/lib/domain";
import VendreSansCommission from "@/content/blog/vendre-oeuvres-en-ligne-sans-commission";
import CertificatAuthenticite from "@/content/blog/certificat-authenticite-oeuvre-art";
import PrixOeuvre from "@/content/blog/fixer-prix-oeuvre-art";
import CreerSite from "@/content/blog/creer-site-vendre-tableaux";
import Galerie3D from "@/content/blog/galerie-art-virtuelle-3d";
import SeFaireConnaitre from "@/content/blog/se-faire-connaitre-artiste";

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
  // Questions fréquentes : affichées en fin d'article et déclarées à Google (FAQPage)
  faq?: { q: string; a: string }[];
};

export const SITE_URL = `https://${ROOT_DOMAIN}`;

export const POSTS: BlogPost[] = [
  {
    slug: "se-faire-connaitre-artiste",
    title: "Comment se faire connaître en tant qu'artiste : 12 leviers concrets",
    seoTitle: "Se faire connaître en tant qu'artiste : 12 leviers concrets",
    description:
      "Identité, galerie à votre nom, Instagram, Pinterest, expositions, presse et cercle de collectionneurs : 12 leviers et un plan sur 30 jours.",
    excerpt:
      "Préparer votre identité, être trouvable, vous faire découvrir, puis garder vos collectionneurs. Avec la leçon de Van Gogh et un plan sur 30 jours.",
    date: "2026-11-02",
    readingMinutes: 11,
    Content: SeFaireConnaitre,
    faq: [
      {
        q: "Comment se faire connaître quand on est artiste peintre débutant ?",
        a: "Commencez par une série cohérente de 10 à 20 œuvres, un nom d'artiste unique et une galerie en ligne à votre nom où chaque œuvre a sa page. Partagez ensuite cette adresse sur Instagram et Pinterest, exposez localement (salons, ateliers ouverts, lieux de passage) et récupérez les e-mails des personnes intéressées.",
      },
      {
        q: "Instagram suffit-il pour se faire connaître en tant qu'artiste ?",
        a: "Non. Instagram fait découvrir votre travail, mais vous ne maîtrisez ni ses règles ni la portée de vos publications. Il faut le compléter par une adresse qui vous appartient (votre site) et une liste de contacts e-mail, qui reste le meilleur moyen de prévenir vos collectionneurs d'une nouvelle œuvre.",
      },
      {
        q: "Faut-il passer par une galerie pour se faire connaître ?",
        a: "Ce n'est plus obligatoire. Une galerie apporte un réseau et une caution, en échange d'une commission souvent proche de 50 %. Beaucoup d'artistes construisent d'abord leur notoriété seuls, avec leur propre galerie en ligne, des expositions locales et la presse, puis approchent les galeries avec un public déjà constitué.",
      },
      {
        q: "Combien de temps faut-il pour se faire connaître en tant qu'artiste ?",
        a: "Comptez plusieurs mois de régularité avant des premiers résultats visibles, et souvent plusieurs années pour une vraie notoriété. Ce qui compte le plus est la constance : deux publications soignées par semaine, des expositions régulières et un contact suivi avec les personnes qui aiment votre travail.",
      },
      {
        q: "Van Gogh n'a-t-il vraiment vendu qu'un seul tableau ?",
        a: "La seule vente connue avec certitude de son vivant est celle de La Vigne rouge, achetée 400 francs par la peintre Anna Boch après le salon des XX à Bruxelles en 1890. Sa célébrité est venue après sa mort, grâce au travail de Jo van Gogh-Bonger, qui a fait exposer ses œuvres et publié ses lettres en 1914.",
      },
    ],
  },
  {
    slug: "creer-site-vendre-tableaux",
    title: "Créer un site pour vendre ses tableaux, sans compétences techniques",
    seoTitle: "Créer un site pour vendre ses tableaux : le guide simple",
    description:
      "Plateforme, créateur de site, WordPress ou solution pour artistes : comment créer votre site pour vendre vos tableaux, et ce qu'il doit contenir.",
    excerpt:
      "Les 4 options pour avoir votre propre site, ce que chaque page doit contenir et les 7 étapes pour le mettre en ligne cette semaine.",
    date: "2026-10-27",
    readingMinutes: 8,
    Content: CreerSite,
  },
  {
    slug: "galerie-art-virtuelle-3d",
    title: "Galerie d'art virtuelle en 3D : comment exposer ses œuvres en ligne",
    seoTitle: "Galerie d'art virtuelle 3D : exposer ses œuvres en ligne",
    description:
      "Visite 360°, outils d'exposition virtuelle ou galerie 3D reliée à une boutique : comment créer votre exposition en ligne et la faire visiter.",
    excerpt:
      "Les trois façons de créer une exposition virtuelle, les critères pour choisir et les conseils pour qu'elle fasse vendre.",
    date: "2026-10-27",
    readingMinutes: 7,
    Content: Galerie3D,
  },
  {
    slug: "vendre-oeuvres-en-ligne-sans-commission",
    title: "Vendre ses œuvres d'art en ligne sans commission : le guide 2026",
    seoTitle: "Vendre ses œuvres d'art en ligne sans commission (guide 2026)",
    description:
      "Galerie, Saatchi, Artmajeur, Etsy ou votre propre galerie : combien vous gardez vraiment sur une vente de 1 000 €, et comment vendre en direct.",
    excerpt:
      "Sur une vente de 1 000 €, vous pouvez garder 500 € ou presque tout. Comparatif des commissions et méthode pour vendre en direct.",
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
      "Les informations indispensables, les mots qui engagent juridiquement et un modèle prêt à l'emploi pour vos œuvres.",
    date: "2026-10-27",
    readingMinutes: 7,
    Content: CertificatAuthenticite,
  },
  {
    slug: "fixer-prix-oeuvre-art",
    title: "Comment fixer le prix de ses œuvres d'art : 3 méthodes simples",
    seoTitle: "Fixer le prix de ses tableaux et dessins : 3 méthodes",
    description:
      "Prix au point, matériaux et temps passé, comparaison avec d'autres artistes : trois méthodes concrètes pour fixer le prix de vos œuvres.",
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
