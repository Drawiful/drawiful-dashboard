"use client";
import { useEffect, useState } from "react";
import { endMaisonVisit, getMaisonVisit, type MaisonVisit } from "@/lib/api";

/*
  Bandeau affiché pendant un accès maison : rappelle dans quelle galerie on se
  trouve, ce qui reste réservé à l'artiste, et permet de revenir à la maison.
*/
export default function MaisonBanner() {
  const [visit, setVisit] = useState<MaisonVisit | null>(null);

  useEffect(() => {
    setVisit(getMaisonVisit());
  }, []);

  if (!visit) return null;

  function leave() {
    endMaisonVisit();
    window.location.href = "/maison";
  }

  return (
    <div role="status" className="sticky top-0 z-50 bg-champagne text-nuit">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-2.5 sm:px-8">
        <p className="text-[13px] leading-snug">
          <span className="font-semibold uppercase tracking-[0.16em] text-[11px] mr-2">Accès maison</span>
          Vous êtes dans la galerie <strong className="font-semibold">{visit.galleryName}</strong>. Mot de passe, e-mail,
          encaissements, formule et envois au Cercle restent réservés à l'artiste.
        </p>
        <button
          type="button"
          onClick={leave}
          className="shrink-0 inline-flex items-center min-h-[36px] px-4 rounded-full bg-nuit text-champagne text-[13px] font-semibold"
        >
          Revenir à la maison
        </button>
      </div>
    </div>
  );
}
