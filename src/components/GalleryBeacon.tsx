"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";

// Compte la fréquentation d'une galerie publique, sans cookie ni donnée
// personnelle : une visite par visiteur et par jour (dédoublonnée côté API),
// et « s'est attardé » après 20 secondes sur la fiche d'une œuvre.
// Ne bloque jamais l'affichage : toute erreur est ignorée.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const LINGER_MS = 20_000;

// Segments de la galerie qui ne sont pas des fiches d'œuvre
const NOT_ARTWORK = new Set(["panier", "cart", "visite-3d", "a-propos", "mentions-legales", "confidentialite"]);

function isRealVisitor(): boolean {
  if (typeof navigator === "undefined") return false;
  if ((navigator as any).webdriver) return false; // navigateurs automatisés
  return true;
}

export function track(path: "visit" | "linger", params: Record<string, string>) {
  if (!API_BASE_URL || !isRealVisitor()) return;
  try {
    const qs = new URLSearchParams(params).toString();
    // POST sans corps : pas de pré-requête CORS, et keepalive survit à un changement de page
    fetch(`${API_BASE_URL}/api/analytics/${path}?${qs}`, { method: "POST", keepalive: true, mode: "cors" }).catch(() => {});
  } catch {
    /* jamais bloquant */
  }
}

// Déclenche onLinger après LINGER_MS de présence réelle (onglet visible).
export function startLingerTimer(onLinger: () => void): () => void {
  let elapsed = 0;
  let last = Date.now();
  let done = false;
  const tick = () => {
    const now = Date.now();
    if (document.visibilityState === "visible") elapsed += now - last;
    last = now;
    if (!done && elapsed >= LINGER_MS) {
      done = true;
      onLinger();
    }
  };
  const id = window.setInterval(tick, 1000);
  const onVis = () => {
    last = Date.now();
  };
  document.addEventListener("visibilitychange", onVis);
  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", onVis);
  };
}

export default function GalleryBeacon() {
  const params = useParams() as { slug?: string | string[]; artworkId?: string | string[] } | null;
  const slug = typeof params?.slug === "string" ? params.slug : undefined;
  const artworkId = typeof params?.artworkId === "string" ? params.artworkId : undefined;

  // Une visite par onglet et par galerie (l'API dédoublonne aussi par jour)
  useEffect(() => {
    if (!slug) return;
    try {
      const key = `drawiful_visit_${slug}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* stockage indisponible : l'API dédoublonne */
    }
    track("visit", { slug });
  }, [slug]);

  // Fiche d'une œuvre : « s'est attardé » après 20 secondes
  useEffect(() => {
    if (!slug || !artworkId || NOT_ARTWORK.has(artworkId)) return;
    return startLingerTimer(() => track("linger", { slug, artwork: artworkId }));
  }, [slug, artworkId]);

  return null;
}
