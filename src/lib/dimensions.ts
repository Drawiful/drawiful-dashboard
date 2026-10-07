// Dimensions réelles d'une œuvre (en cm), saisies par l'artiste.
// Renvoie null si elles ne sont pas renseignées.
export function formatDimensions(art: { widthCm?: number | null; heightCm?: number | null }): string | null {
  if (!art?.widthCm || !art?.heightCm) return null;
  const fmt = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  return `${fmt(art.widthCm)} × ${fmt(art.heightCm)} cm`;
}
