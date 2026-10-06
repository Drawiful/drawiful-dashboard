"use client";
import { SKINS } from "@/components/themes/skins";
import { ThemedListing } from "@/components/themes/ThemedListing";
import { ThemedArtwork } from "@/components/themes/ThemedArtwork";
import type { ArtworkPageProps } from "@/components/themes/ThemedArtwork";
import { ThemedCart } from "@/components/themes/ThemedCart";
import type { CartPageProps } from "@/components/themes/ThemedCart";

// Maison Haussmann utilise désormais le système de thèmes commun
// (voir skins.ts). Les noms exportés restent identiques à l'ancienne version
// pour que les pages qui les importent continuent de fonctionner sans changement.

const skin = SKINS["maison-haussmann"];

export function MaisonHaussmannListing(props: { artist: any; slug: string; cartCount?: number }) {
  return <ThemedListing skin={skin} {...props} />;
}

export function MaisonHaussmannArtwork(props: ArtworkPageProps) {
  return <ThemedArtwork skin={skin} {...props} />;
}

export function MaisonHaussmannCart(props: CartPageProps) {
  return <ThemedCart skin={skin} {...props} />;
}
