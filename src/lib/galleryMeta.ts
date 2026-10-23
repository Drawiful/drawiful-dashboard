// Lecture d'une galerie côté serveur, pour les métadonnées (titre, aperçu de partage).

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchArtistForMeta(slug: string): Promise<any | null> {
  if (!API_BASE_URL) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/artists/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 }, // rafraîchi toutes les 5 minutes au plus
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function shortText(text: unknown, max = 160): string | undefined {
  if (typeof text !== "string") return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}
