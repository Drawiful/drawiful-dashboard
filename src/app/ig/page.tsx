import { redirect } from "next/navigation";

// Lien court pour la bio instagram : drawiful.app/ig
// Redirige vers la landing en gardant la source pour les statistiques.
export const dynamic = "force-dynamic";

export default function Page() {
  redirect("/?utm_source=instagram&utm_medium=bio");
}
