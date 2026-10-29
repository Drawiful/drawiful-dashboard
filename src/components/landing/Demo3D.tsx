"use client";
import { useEffect, useRef, useState } from "react";

/*
  Visite 3D en direct dans la landing : la vraie salle (public/visite-3d/*.html)
  chargée dans une iframe, avec les vraies œuvres d'une galerie de démonstration.
  Rien n'est chargé tant que le visiteur ne clique pas (la page reste légère).
*/

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEMO_SLUG = process.env.NEXT_PUBLIC_DEMO_GALLERY_SLUG || "dashtest2";

const ROOMS = [
  { key: "haussmann", label: "Le Salon Haussmannien", poster: "/landing/salle-haussmann.jpg" },
  { key: "blanche", label: "Le White Cube", poster: "/landing/salle-blanche.jpg" },
  { key: "sombre", label: "La Salle Noire", poster: "/landing/salle-sombre.jpg" },
] as const;

type RoomKey = (typeof ROOMS)[number]["key"];

function formatPrice(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    cents / 100,
  );
}

function formatDims(w?: number | null, h?: number | null) {
  if (!w || !h) return null;
  const f = (n: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(n);
  return `${f(w)} × ${f(h)} cm`;
}

export default function Demo3D() {
  const [room, setRoom] = useState<RoomKey>("haussmann");
  const [started, setStarted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const artworksRef = useRef<any[] | null>(null);
  const galleryRef = useRef<string>("Galerie de démonstration");

  // Charge une fois les œuvres de la galerie de démonstration
  useEffect(() => {
    if (!started || artworksRef.current) return;
    fetch(`${API_BASE_URL}/api/artists/${DEMO_SLUG}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((artist) => {
        if (!artist) return;
        galleryRef.current = artist.galleryName || galleryRef.current;
        artworksRef.current = (artist.artworks || [])
          .filter((a: any) => a.imageUrl)
          .map((a: any) => {
            // Sans dimensions réelles : grand côté de 80 cm, format portrait par défaut
            const w = a.widthCm || 60;
            const h = a.heightCm || 80;
            return {
              id: a.id,
              title: a.title,
              artist: artist.galleryName,
              price: formatPrice(a.priceCents, a.currency),
              meta: formatDims(a.widthCm, a.heightCm) ?? "Œuvre originale",
              imageUrl: a.imageUrl,
              widthCm: w,
              heightCm: h,
            };
          });
        sendArtworks();
      })
      .catch(() => undefined);
  }, [started]);

  function sendArtworks() {
    const win = iframeRef.current?.contentWindow;
    if (!win || !artworksRef.current) return;
    win.postMessage(
      {
        type: "GALLERY_SET_ARTWORKS",
        artworks: artworksRef.current,
        galleryName: galleryRef.current,
        allowAR: false,
      },
      window.location.origin,
    );
  }

  // La salle signale qu'elle est prête -> on lui envoie les œuvres
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "GALLERY_READY") sendArtworks();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const current = ROOMS.find((r) => r.key === room)!;

  return (
    <div>
      <div role="tablist" aria-label="Choisir une atmosphère" className="flex flex-wrap gap-2 mb-5">
        {ROOMS.map((r) => (
          <button
            key={r.key}
            role="tab"
            aria-selected={room === r.key}
            onClick={() => setRoom(r.key)}
            className={`px-4 py-2 rounded-full text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9B75C] ${
              room === r.key
                ? "bg-[#D9B75C] text-[#0E0C0A]"
                : "border border-white/20 text-white/75 hover:text-white hover:border-white/40"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[6px] bg-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        {started ? (
          <iframe
            key={room}
            ref={iframeRef}
            src={`/visite-3d/${room}.html`}
            title={`Visite 3D — ${current.label}`}
            className="absolute inset-0 h-full w-full border-0"
            allow="fullscreen; xr-spatial-tracking"
            // Le clavier va directement à la salle (flèches pour marcher)
            onLoad={() => iframeRef.current?.contentWindow?.focus()}
          />
        ) : (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="group absolute inset-0 h-full w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9B75C]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute left-5 right-5 bottom-5 sm:left-8 sm:bottom-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <span className="text-white/85 text-sm max-w-sm leading-relaxed">
                Une véritable galerie Drawiful, avec de véritables œuvres. Parcourez les salles, approchez-vous des toiles.
              </span>
              <span className="inline-flex items-center gap-3 self-start sm:self-auto rounded-full bg-[#F4EFE6] text-[#0E0C0A] pl-5 pr-2 py-2 text-sm font-semibold">
                Entrer dans la galerie
                <span className="grid place-items-center h-8 w-8 rounded-full bg-[#0E0C0A] text-[#D9B75C]">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
                    <path d="M0 0l12 7-12 7z" />
                  </svg>
                </span>
              </span>
            </span>
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-white/60 md:hidden">Glissez pour orienter votre regard, effleurez le sol pour avancer à votre rythme.</p>
      <p className="mt-3 text-xs text-white/50 hidden md:block">
        Cliquez dans la salle, puis avancez à votre rythme avec les flèches du clavier (ou ZQSD).
      </p>
    </div>
  );
}
