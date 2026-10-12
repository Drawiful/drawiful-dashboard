import { redirect } from "next/navigation";

// Lien court pour la bio tiktok : drawiful.app/tt
// Redirige vers la landing en gardant la source pour les statistiques.
export const dynamic = "force-dynamic";

export default function Page() {
  redirect("/?utm_source=tiktok&utm_medium=bio");
}
