"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*
  Accès privé de 14 jours sans carte. Sur ordinateur, la carte « Accès privé »
  vit dans la barre latérale ; ce bandeau n'apparaît que dans les 3 derniers
  jours. Sur mobile (menu replié), il reste toujours visible.
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
      className={`${urgent ? "flex" : "flex md:hidden"} mb-8 rounded-lg bg-nuit text-ivoire px-5 py-4 flex-wrap items-center gap-x-5 gap-y-3`}
    >
      <p className="flex-1 min-w-[200px]">
        <span className="block text-[11px] uppercase tracking-[0.18em] text-champagne">Accès privé</span>
        <span className="font-display text-lg leading-snug">
          {days <= 1 ? "Dernier jour pour vivre l'expérience" : `Encore ${days} jours pour vivre l'expérience`}
        </span>
        <span className="block text-xs text-lilas mt-0.5">
          Jusqu'au {formatTrialEnd(limits.trialEndsAt)}. Tout est ouvert, même la vente de vos œuvres.
        </span>
      </p>
      {pathname !== "/subscription" && (
        <Link
          href="/subscription"
          className="inline-flex items-center min-h-[44px] px-5 rounded-full bg-champagne text-nuit text-sm font-semibold shrink-0"
        >
          Choisir votre formule
        </Link>
      )}
    </div>
  );
}
