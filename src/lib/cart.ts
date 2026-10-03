"use client";
import { useCallback, useEffect, useState } from "react";

// Panier côté navigateur, isolé par artiste (un acheteur ne mélange pas les
// œuvres de deux galeries différentes dans un même panier). Les œuvres sont
// des pièces uniques : pas de gestion de quantité, un artworkId == une ligne.

export type CartItem = {
  artworkId: string;
  title: string;
  priceCents: number;
  currency: string;
  imageUrl?: string;
};

function storageKey(slug: string) {
  return `drawiful_cart_${slug}`;
}

function readCart(slug: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(slug: string, items: CartItem[]) {
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(items));
    // notifie les autres composants montés (ex: badge panier dans le header)
    window.dispatchEvent(new CustomEvent("drawiful-cart-updated", { detail: { slug } }));
  } catch {
    // stockage indisponible (navigation privée, etc.) — le panier ne persiste
    // simplement pas d'une page à l'autre, le reste continue de fonctionner.
  }
}

export function useCart(slug: string) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart(slug));
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.slug === slug) setItems(readCart(slug));
    };
    window.addEventListener("drawiful-cart-updated", onUpdate);
    return () => window.removeEventListener("drawiful-cart-updated", onUpdate);
  }, [slug]);

  const addItem = useCallback(
    (item: CartItem) => {
      const current = readCart(slug);
      if (current.some((i) => i.artworkId === item.artworkId)) return; // déjà dans le panier
      const next = [...current, item];
      writeCart(slug, next);
      setItems(next);
    },
    [slug]
  );

  const removeItem = useCallback(
    (artworkId: string) => {
      const next = readCart(slug).filter((i) => i.artworkId !== artworkId);
      writeCart(slug, next);
      setItems(next);
    },
    [slug]
  );

  const clear = useCallback(() => {
    writeCart(slug, []);
    setItems([]);
  }, [slug]);

  const totalCents = items.reduce((sum, i) => sum + i.priceCents, 0);

  return { items, addItem, removeItem, clear, totalCents };
}
