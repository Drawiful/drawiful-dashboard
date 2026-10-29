"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/*
  Bouton d'inscription fixe en bas de l'écran, sur téléphone uniquement.
  Il apparaît une fois le bouton du premier écran sorti de la vue,
  et disparaît à partir de l'appel final, qui a déjà son bouton.
*/
export default function StickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [finalVisible, setFinalVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const hero = document.getElementById("hero-cta");
    const final = document.getElementById("appel-final");
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting);
        if (e.target === final) setFinalVisible(e.isIntersecting || e.boundingClientRect.top < 0);
      }
    });
    if (hero) obs.observe(hero);
    if (final) obs.observe(final);
    return () => obs.disconnect();
  }, []);

  const show = !heroVisible && !finalVisible;

  return (
    <div
      aria-hidden={!show}
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pt-3 bg-[#0E0C0A]/95 backdrop-blur-md border-t border-[#F4EFE6]/10 transition-transform duration-300 motion-reduce:transition-none ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
    >
      <Link
        href="/inscription"
        tabIndex={show ? 0 : -1}
        className="flex w-full items-center justify-center rounded-full bg-[#D9B75C] py-3.5 text-[15px] font-semibold text-[#0E0C0A] active:bg-[#E6C877]"
      >
        Initier mon accès privé
      </Link>
      <p className="mt-1.5 text-center text-[11px] text-[#F4EFE6]/60">14 jours offerts · sans carte bancaire</p>
    </div>
  );
}
