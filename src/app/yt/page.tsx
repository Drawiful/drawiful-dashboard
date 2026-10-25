import { redirect } from "next/navigation";

// Lien court pour la bio youtube : drawiful.art/yt
// Redirige vers la landing en gardant la source pour les statistiques.
export const dynamic = "force-dynamic";

export default function Page() {
  redirect("/?utm_source=youtube&utm_medium=bio");
}
