"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getSkin } from "@/components/themes/skins";
import type { Skin } from "@/components/themes/skins";
import { PAD, ThemedPage, ThemedHeader, ThemedFooter, btnStyle, money } from "@/components/themes/ThemedChrome";
import { useCart } from "@/lib/cart";
import { getToken } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Les 3 salles sont des pages statiques dans public/visite-3d/.
// Ambiance : Atelier Sombre + Noir & Or -> sombre ; Blanc Pur + Terre & Argile
// + Sauge Botanique -> blanche ; Maison Haussmann -> haussmann (voir skins.ts).
const ROOMS = {
  haussmann: "/visite-3d/haussmann.html",
  blanche: "/visite-3d/blanche.html",
  sombre: "/visite-3d/sombre.html",
} as const;

type Art3d = {
  id: string;
  title: string;
  artist: string;
  price: string;
  meta: string;
  imageUrl: string;
  widthCm: number;
  heightCm: number;
};

type Status = "loading" | "notfound" | "locked" | "empty" | "ready";

// L'artiste connecté au dashboard (même domaine) est-il le propriétaire de
// cette galerie ? Si oui, il peut prévisualiser sa salle même sans plan 3D.
// Pas de redirection vers /login ici : un visiteur doit pouvoir arriver sans compte.
async function isOwner(slug: string): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) return false;
    const r = await fetch(`${API_BASE_URL}/api/artists/me/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return false;
    const me = await r.json();
    return me?.slug === slug;
  } catch {
    return false;
  }
}

// Lit les proportions de l'image (pas besoin de CORS pour ça).
function imageRatio(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(null), 6000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : null);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = url;
  });
}

// Le backend ne stocke pas encore les dimensions réelles : on accroche chaque
// œuvre au format d'un grand tableau de galerie (grand côté = 160 cm, proche
// du format 100 F de 162 × 130 cm) en gardant ses proportions. Ces valeurs
// servent uniquement au rendu, jamais affichées. La salle s'agrandit d'elle-même.
function displaySize(ratio: number | null) {
  const r = ratio && isFinite(ratio) ? Math.min(Math.max(ratio, 0.4), 2.5) : 0.8;
  const LONG = 160;
  return r <= 1
    ? { widthCm: Math.round(LONG * r), heightCm: LONG }
    : { widthCm: LONG, heightCm: Math.round(LONG / r) };
}

export default function Visite3DPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { items } = useCart(slug);

  const [status, setStatus] = useState<Status>("loading");
  const [artist, setArtist] = useState<any>(null);
  const [works, setWorks] = useState<Art3d[]>([]);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/api/artists/${slug}`);
        if (!r.ok) throw new Error();
        const data = await r.json();
        if (cancelled) return;
        setArtist(data);

        if (!data.has3dAccess) {
          const owner = await isOwner(slug);
          if (cancelled) return;
          if (!owner) {
            setStatus("locked");
            return;
          }
          setPreview(true);
        }
        const arts = (data.artworks || []).filter((a: any) => a.imageUrl);
        if (arts.length === 0) {
          setStatus("empty");
          return;
        }
        const ratios = await Promise.all(arts.map((a: any) => imageRatio(a.imageUrl)));
        if (cancelled) return;
        setWorks(
          arts.map((a: any, i: number) => ({
            id: a.id,
            title: a.title,
            artist: data.galleryName || "",
            price: money(a.priceCents, a.currency || "EUR"),
            meta: "Œuvre originale",
            imageUrl: a.imageUrl,
            ...displaySize(ratios[i]),
          }))
        );
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("notfound");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Dialogue avec la salle : elle annonce qu'elle est prête, on lui envoie
  // les œuvres ; au clic sur "Voir la fiche", on ouvre la fiche de l'œuvre.
  useEffect(() => {
    if (status !== "ready") return;
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.source !== iframeRef.current?.contentWindow) return;
      const data = e.data || {};
      if (data.type === "GALLERY_READY") {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "GALLERY_SET_ARTWORKS",
            artworks: works,
            galleryName: artist?.galleryName,
            // Pas de réalité augmentée tant que les dimensions réelles ne sont
            // pas renseignées : l'œuvre serait posée à une taille inexacte.
            allowAR: false,
          },
          window.location.origin
        );
      } else if (data.type === "GALLERY_ARTWORK_CLICK" && typeof data.id === "string") {
        router.push(`/g/${slug}/${data.id}`);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [status, works, artist, slug, router]);

  const skin = getSkin(artist?.theme);

  if (status === "loading") {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0b0a" }}>
        <Loader2 size={22} className="animate-spin" color="#d4b45c" />
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFEFC]">
        <p className="text-sm text-[#8A8578]">Galerie introuvable.</p>
      </div>
    );
  }

  if (status === "locked") {
    return (
      <InfoScreen
        skin={skin}
        artist={artist}
        slug={slug}
        cartCount={items.length}
        title="Visite 3D indisponible"
        text="Cette galerie ne propose pas encore de visite en 3D. Vous pouvez découvrir toutes ses œuvres dans la boutique."
      />
    );
  }

  if (status === "empty") {
    return (
      <InfoScreen
        skin={skin}
        artist={artist}
        slug={slug}
        cartCount={items.length}
        title="La salle est encore vide"
        text="Aucune œuvre n'est exposée pour le moment. Revenez bientôt pour la visite."
      />
    );
  }

  const room = ROOMS[skin?.ambiance3d ?? "blanche"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0c0b0a" }}>
      <iframe
        ref={iframeRef}
        src={room}
        title={`Visite 3D — ${artist.galleryName}`}
        allow="fullscreen; xr-spatial-tracking"
        allowFullScreen
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
      <Link
        href={`/g/${slug}`}
        style={{
          position: "absolute",
          top: "calc(16px + env(safe-area-inset-top, 0px))",
          right: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          minHeight: 40,
          padding: "0 16px",
          borderRadius: 999,
          background: "rgba(15,13,11,0.72)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: "#f5f1e8",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={15} />
        Retour à la boutique
      </Link>

      {preview && (
        <div
          style={{
            position: "absolute",
            top: "calc(72px + env(safe-area-inset-top, 0px))",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: "calc(100% - 32px)",
            boxSizing: "border-box",
            padding: "12px 18px",
            borderRadius: 14,
            background: "rgba(15,13,11,0.82)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(212,180,92,0.45)",
            color: "#f5f1e8",
            fontSize: 13,
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          Aperçu visible par vous seul. Vos visiteurs verront cette salle avec le plan Artiste ou Gallery.{" "}
          <Link href="/subscription" style={{ color: "#d4b45c", fontWeight: 600 }}>
            Voir les plans
          </Link>
        </div>
      )}
    </div>
  );
}

// Écran d'information habillé selon le thème (accès 3D absent, salle vide).
function InfoScreen({
  skin,
  artist,
  slug,
  title,
  text,
  cartCount,
}: {
  skin: Skin | null;
  artist: any;
  slug: string;
  title: string;
  text: string;
  cartCount: number;
}) {
  if (!skin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FEFEFC] px-8 text-center">
        <p className="text-lg text-[#1A1A18]">{title}</p>
        <p className="text-sm text-[#8A8578] max-w-md">{text}</p>
        <Link href={`/g/${slug}`} className="text-sm underline text-[#1A1A18]">
          Retour à la boutique
        </Link>
      </div>
    );
  }
  return (
    <ThemedPage skin={skin}>
      <ThemedHeader skin={skin} slug={slug} galleryName={artist.galleryName} cartCount={cartCount} has3d={!!artist.has3dAccess} />
      <main style={{ maxWidth: 560, margin: "0 auto", padding: `96px ${PAD} 120px`, textAlign: "center" }}>
        <h1 style={{ margin: "0 0 18px", fontFamily: skin.display, fontWeight: skin.displayWeight, fontSize: "clamp(32px,4vw,44px)", lineHeight: 1.1, color: skin.ink }}>
          {title}
        </h1>
        <p style={{ margin: "0 0 40px", fontSize: 16, lineHeight: 1.7, color: skin.muted }}>{text}</p>
        <Link href={`/g/${slug}`} style={btnStyle(skin, "primary")}>
          Voir la boutique
        </Link>
      </main>
      <ThemedFooter skin={skin} slug={slug} />
    </ThemedPage>
  );
}
