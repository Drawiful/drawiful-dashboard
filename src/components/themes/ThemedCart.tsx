"use client";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/cart";
import type { Skin } from "./skins";
import { PAD, ThemedPage, ThemedHeader, ThemedFooter, btnStyle, money } from "./ThemedChrome";

// Mêmes propriétés que l'ancien MaisonHaussmannCart.
export type CartPageProps = {
  artist: any;
  slug: string;
  items: CartItem[];
  removeItem: (id: string) => void;
  totalCents: number;
  onCheckout: () => void;
  checkingOut: boolean;
};

export function ThemedCart({
  skin,
  artist,
  slug,
  items,
  removeItem,
  totalCents,
  onCheckout,
  checkingOut,
}: CartPageProps & { skin: Skin }) {
  const thumbRadius = skin.radius ? 12 : 0;
  return (
    <ThemedPage skin={skin}>
      <ThemedHeader skin={skin} slug={slug} galleryName={artist.galleryName} cartCount={items.length} has3d={!!artist.has3dAccess} />

      <div style={{ padding: `24px ${PAD} 0` }}>
        <Link
          href={`/g/${slug}`}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: skin.muted, textDecoration: "none" }}
        >
          <ArrowLeft size={14} />
          Continuer mes achats
        </Link>
      </div>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: `32px ${PAD} 96px` }}>
        <h1 style={{ margin: "0 0 40px", fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.02em", color: skin.ink }}>
          Votre panier
        </h1>

        {items.length === 0 ? (
          <p style={{ margin: 0, fontSize: 15, color: skin.muted }}>Votre panier est vide.</p>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
              {items.map((item) => (
                <div key={item.artworkId} style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: 24, borderBottom: `1px solid ${skin.border}` }}>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: 80, height: 96, objectFit: "cover", background: skin.media, border: `1px solid ${skin.border}`, borderRadius: thumbRadius, flex: "none" }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontFamily: skin.display, fontSize: 20, color: skin.ink }}>{item.title}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 14, color: skin.muted }}>{money(item.priceCents, item.currency)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.artworkId)}
                    aria-label="Retirer"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, background: "transparent", border: "none", color: skin.muted, cursor: "pointer" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", borderTop: `1px solid ${skin.border}`, marginBottom: 24 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: skin.muted }}>Total</p>
              <p style={{ margin: 0, fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: 36, color: skin.link }}>
                {money(totalCents, items[0]?.currency || "EUR")}
              </p>
            </div>

            <button onClick={onCheckout} disabled={checkingOut} style={{ ...btnStyle(skin, "primary"), width: "100%", opacity: checkingOut ? 0.6 : 1 }}>
              {checkingOut ? "Redirection..." : "Passer au paiement"}
            </button>
            <p style={{ margin: "12px 0 0", fontSize: 13, textAlign: "center", color: skin.muted }}>
              Paiement sécurisé · Livraison incluse
            </p>
          </>
        )}
      </main>

      <ThemedFooter skin={skin} slug={slug} />
    </ThemedPage>
  );
}
