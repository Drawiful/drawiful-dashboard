"use client";
import { useEffect, useRef, useState } from "react";

/*
  Film du premier écran : une toile filmée dans une vraie galerie Drawiful,
  du salon haussmannien à la salle noire (mode cinéma des salles 3D, voir
  public/visite-3d). Boucle muette de 22 s, sans texte incrusté.
  - Téléphone : hero-film-540.mp4 (≈ 1 Mo) ; ordinateur : hero-film-720.mp4.
  - L'image fixe s'affiche tout de suite, la vidéo prend le relais dès qu'elle
    est prête. Si le visiteur demande moins d'animations, on garde l'image fixe.
*/
export default function HeroFilm({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setSrc(window.matchMedia("(min-width: 768px)").matches ? "/landing/hero-film-720.mp4" : "/landing/hero-film-540.mp4");
    } catch {
      setSrc("/landing/hero-film-540.mp4");
    }
  }, []);

  useEffect(() => {
    // Certains navigateurs intégrés (Instagram, Facebook) ignorent l'attribut autoplay
    if (src) ref.current?.play?.().catch(() => undefined);
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster="/landing/hero-film.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload={src ? "auto" : "none"}
      aria-label="Une toile exposée dans une galerie Drawiful en 3D, d'un salon haussmannien à une salle noire éclairée au spot"
    />
  );
}
