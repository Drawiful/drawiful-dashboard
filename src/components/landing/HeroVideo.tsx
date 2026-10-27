"use client";
import { useEffect, useRef, useState } from "react";

/*
  Boucle muette de 12 s filmée dans une vraie galerie Drawiful (salle Noir & Or), en plan-séquence
  automatique (mode cinéma des salles 3D : ?capture=2&cinema=1&record=1, voir public/visite-3d).
  - Sur téléphone : version recadrée en bandeau (hero-visite-mobile.mp4), qui traverse la salle
    jusqu'à l'œuvre, puis affiche sa fiche et son prix, en haut du premier écran.
  - Sur ordinateur : la vidéo entière, dans un cadre de téléphone, à droite du texte.
  Les deux versions sont dans la page, mais seule celle qui est affichée est téléchargée :
  l'image fixe s'affiche tout de suite, la vidéo prend le relais dès qu'elle est prête.
  Si le visiteur demande moins d'animations, on garde seulement l'image fixe.
*/

export default function HeroVideo({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mobile";
}) {
  const file = variant === "mobile" ? "hero-visite-mobile" : "hero-visite";
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Masquée par le CSS (display: none) : c'est la version de l'autre appareil
    if (v.getClientRects().length === 0) return;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    } catch {
      /* matchMedia indisponible : on lance quand même la vidéo */
    }
    setSrc(`/landing/${file}.mp4`);
  }, [file]);

  useEffect(() => {
    // Certains navigateurs intégrés (Instagram, Facebook) ignorent l'attribut autoplay
    if (src) ref.current?.play?.().catch(() => undefined);
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={`/landing/${file}.jpg`}
      autoPlay
      muted
      loop
      playsInline
      preload={src ? "auto" : "none"}
      aria-label="Visite d'une galerie Drawiful en 3D : la caméra traverse la salle jusqu'à une œuvre, puis sa fiche et son prix s'affichent"
    />
  );
}
