"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

/*
  Essai gratuit de 14 jours sans carte : bandeau en haut du tableau de bord
  avec le nombre de jours restants et l'accès à la page Abonnement.
  (profile.limits vient du backend : access = trial | active | locked | legacy)
*/
export function formatTrialEnd(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

export default function TrialBanner({ limits }: { limits: any }) {
  const pathname = usePathname();
  if (!limits || limits.access !== "trial") return null;
  const days = limits.trialDaysLeft ?? 0;
  const urgent = days <= 3;

  return (
    <div
      className={`mb-8 rounded-md p-4 flex flex-wrap items-center gap-x-4 gap-y-3 ${
        urgent ? "bg-ocre/15 border border-ocre/50" : "bg-white border border-bordure"
      }`}
    >
      <Sparkles size={18} className="text-argile shrink-0" strokeWidth={1.8} />
      <p className="flex-1 min-w-[220px] text-sm text-encre">
        <strong>
          Essai gratuit : {days <= 1 ? "dernier jour" : `encore ${days} jours`}
        </strong>
        <span className="text-encre/65">
          {" "}
          · jusqu'au {formatTrialEnd(limits.trialEndsAt)}. Tout est inclus, même la vente en ligne.
        </span>
      </p>
      {pathname !== "/subscription" && (
        <Link
          href="/subscription"
          className="text-sm px-4 py-2 rounded-md bg-aubergine text-platre font-medium shrink-0"
        >
          Choisir ma formule
        </Link>
      )}
    </div>
  );
}
