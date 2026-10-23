import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchArtistForMeta, shortText } from "@/lib/galleryMeta";

// Titre et aperçu de partage d'une fiche œuvre : quand un collectionneur
// envoie le lien, on voit l'œuvre, son titre et le nom de l'artiste.
export async function generateMetadata({
  params,
}: {
  params: { slug: string; artworkId: string };
}): Promise<Metadata> {
  const artist = await fetchArtistForMeta(params.slug);
  const artwork = artist?.artworks?.find((a: any) => a.id === params.artworkId);
  if (!artist?.galleryName || !artwork) {
    return {};
  }

  const name: string = artist.galleryName;
  const title = `${artwork.title} — ${name}`;
  const description =
    shortText(artwork.description) || `Œuvre originale de ${name}, pièce unique signée par l'artiste.`;
  const image: string | undefined = artwork.imageUrl || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: name,
      locale: "fr_FR",
      ...(image ? { images: [{ url: image, alt: artwork.title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function ArtworkLayout({ children }: { children: ReactNode }) {
  return children;
}
