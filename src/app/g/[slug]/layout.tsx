import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchArtistForMeta, shortText } from "@/lib/galleryMeta";
import GalleryBeacon from "@/components/GalleryBeacon";

// Titre de l'onglet, description Google et aperçu de partage (WhatsApp,
// Instagram, Messenger…) de chaque galerie publique. Les pages de la galerie
// sont des composants client : ce layout serveur leur donne leurs métadonnées.

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = await fetchArtistForMeta(params.slug);
  if (!artist?.galleryName) {
    return { title: "Galerie d'art — Drawiful" };
  }

  const name: string = artist.galleryName;
  const title = `${name} — Œuvres originales`;
  const description =
    shortText(artist.bio) || `Découvrez et acquérez les œuvres originales de ${name}, pièces uniques signées par l'artiste.`;
  const image: string | undefined = artist.artworks?.[0]?.imageUrl || artist.avatarUrl || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: name,
      locale: "fr_FR",
      ...(image ? { images: [{ url: image, alt: name }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      {/* Fréquentation anonyme de la galerie (sans cookie) */}
      <GalleryBeacon />
    </>
  );
}
