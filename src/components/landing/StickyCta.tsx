"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/*
  Bouton d'essai fixe en bas de l'écran, sur téléphone uniquement.
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
        // Masqué aussi une fois l'appel final dépassé (pied de page)
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
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pt-3 bg-[#2B1E2F]/95 backdrop-blur border-t border-white/10 transition-transform duration-300 motion-reduce:transition-none ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
    >
      <Link
        href="/inscription?plan=artiste"
        tabIndex={show ? 0 : -1}
        className="flex w-full items-center justify-center rounded-full bg-[#B8912F] py-3.5 text-[15px] font-semibold text-[#1C1A17] active:bg-[#C9A24A]"
      >
        Essayer 14 jours gratuits
      </Link>
      <p className="mt-1.5 text-center text-[11px] text-[#F7F5F0]/60">0 % de commission · sans engagement</p>
    </div>
  );
}
