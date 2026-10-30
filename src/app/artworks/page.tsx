"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Award, ExternalLink, Box, X } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import ArtworkForm from "@/components/ArtworkForm";
import PageHeader from "@/components/PageHeader";
import { formatDimensions } from "@/lib/dimensions";
import { api } from "@/lib/api";

// Le vocabulaire d'une galerie : aux murs, en réserve, acquise.
const statusLabels: Record<string, string> = {
  DRAFT: "En réserve",
  PUBLISHED: "Aux murs",
  SOLD: "Acquise",
  ARCHIVED: "Décrochée",
};

const FILTERS: { key: string; label: string }[] = [
  { key: "ALL", label: "Toutes" },
  { key: "PUBLISHED", label: "Aux murs" },
  { key: "DRAFT", label: "En réserve" },
  { key: "SOLD", label: "Acquises" },
  { key: "ARCHIVED", label: "Décrochées" },
];

function formatPrice(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: cents % 100 ? 2 : 0 }).format(
    cents / 100
  );
}

function summary(artworks: any[]) {
  const n = (st: string) => artworks.filter((a) => a.status === st).length;
  const parts: string[] = [];
  const walls = n("PUBLISHED");
  const reserve = n("DRAFT");
  const sold = n("SOLD");
  if (walls) parts.push(`${walls} ${walls > 1 ? "œuvres aux murs" : "œuvre aux murs"}`);
  if (reserve) parts.push(`${reserve} en réserve`);
  if (sold) parts.push(`${sold} déjà ${sold > 1 ? "acquises" : "acquise"}`);
  if (!parts.length) return "Votre collection attend sa première œuvre.";
  const last = parts.pop();
  return (parts.length ? `${parts.join(", ")} et ${last}` : last) + ".";
}

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [limits, setLimits] = useState<any>(null); // ce que la formule permet (renvoyé par /me/profile)
  const [notice, setNotice] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");

  const activeCount = artworks.filter((a) => a.status !== "ARCHIVED").length;
  const certCount = artworks.filter((a) => a.certificate).length;
  const atArtworkLimit = limits?.maxArtworks != null && activeCount >= limits.maxArtworks;
  const atCertLimit = limits?.maxCertificates != null && certCount >= limits.maxCertificates;

  function loadArtworks() {
    setLoading(true);
    api
      .getArtworks()
      .then(setArtworks)
      .finally(() => setLoading(false));
  }

  useEffect(loadArtworks, []);

  async function handleDelete(id: string) {
    if (!confirm("Retirer définitivement cette œuvre de votre collection ?")) return;
    await api.deleteArtwork(id);
    loadArtworks();
  }

  async function handleGenerateCertificate(artworkId: string) {
    if (atCertLimit) {
      setNotice(`Votre formule comprend ${limits.maxCertificates} certificat d'authenticité. Passez à la formule Artiste pour en créer d'autres.`);
      return;
    }
    setGeneratingId(artworkId);
    try {
      await api.generateCertificate(artworkId);
      loadArtworks();
    } catch (err: any) {
      alert(err.message || "Impossible de générer le certificat");
    } finally {
      setGeneratingId(null);
    }
  }

  const visible = filter === "ALL" ? artworks : artworks.filter((a) => a.status === filter);
  const counts = (key: string) => (key === "ALL" ? artworks.length : artworks.filter((a) => a.status === key).length);

  function openNew() {
    if (atArtworkLimit) {
      setNotice(`Votre formule permet d'exposer ${limits.maxArtworks} œuvres. Décrochez une œuvre ou passez à la formule Artiste pour en accrocher d'autres.`);
      return;
    }
    setEditing(null);
    setShowForm(true);
  }

  return (
    <DashboardShell onProfileLoaded={(p) => setLimits(p?.limits ?? null)}>
      <PageHeader
        kicker="Catalogue de la galerie"
        title="Votre collection"
        intro={loading ? "\u00a0" : summary(artworks)}
        action={
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2.5 min-h-[48px] px-6 rounded-full bg-nuit text-ivoire text-sm font-medium"
          >
            <Plus size={16} strokeWidth={1.6} />
            Accrocher une œuvre
          </button>
        }
      />

      {limits && limits.maxArtworks != null && (
        <div className="mb-8 rounded-xl border border-laiton/40 bg-papier px-5 py-4 text-sm text-encre flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            {limits.plan === "aspirant" ? "Formule Aspirant" : "Sans formule active"} : {activeCount}/{limits.maxArtworks} œuvres ·{" "}
            {certCount}/{limits.maxCertificates} certificat
          </span>
          <span className="text-pierre">Boutique, visite 3D et nom de domaine avec la formule Artiste.</span>
          <Link href="/subscription" className="font-medium text-laiton underline underline-offset-4">
            Passer à Artiste
          </Link>
        </div>
      )}
      {notice && (
        <div className="mb-8 rounded-xl border border-argile/40 bg-argile/5 px-5 py-4 text-sm text-encre flex items-start justify-between gap-4">
          <span>
            {notice}{" "}
            <Link href="/subscription" className="font-medium text-laiton underline underline-offset-4">
              Voir les formules
            </Link>
          </span>
          <button type="button" onClick={() => setNotice(null)} className="text-pierre -m-2 p-2" aria-label="Fermer">
            <X size={16} />
          </button>
        </div>
      )}

      {!loading && artworks.length > 0 && (
        <nav aria-label="Filtrer la collection" className="mb-9 flex flex-wrap gap-x-7 border-b border-bordure">
          {FILTERS.filter((f) => f.key === "ALL" || counts(f.key) > 0).map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`py-3 -mb-px text-sm border-b-2 ${
                filter === f.key ? "border-encre text-encre font-semibold" : "border-transparent text-pierre hover:text-encre"
              }`}
            >
              {f.label} · {counts(f.key)}
            </button>
          ))}
        </nav>
      )}

      {loading ? (
        <p className="font-display text-lg text-pierre">Ouverture de la réserve…</p>
      ) : (
        <div className="grid gap-x-7 gap-y-10 grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
          {visible.map((art) => {
            const dims = formatDimensions(art);
            const dark = art.status === "PUBLISHED" || art.status === "SOLD";
            return (
              <article key={art.id} className="flex flex-col gap-3.5">
                <div className={`relative aspect-[4/5] rounded-lg overflow-hidden ${dark ? "bg-nuit" : "bg-[#EAE3D6]"}`}>
                  <div className="absolute inset-6 flex items-center justify-center">
                    {art.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className={`max-h-full max-w-full object-contain ${
                          dark ? "shadow-[0_12px_30px_rgba(0,0,0,0.5)]" : "shadow-md"
                        } ${art.status === "ARCHIVED" ? "opacity-60" : ""}`}
                      />
                    ) : (
                      <span className="text-xs text-pierre">Photo de l'œuvre à ajouter</span>
                    )}
                  </div>
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                      art.status === "PUBLISHED"
                        ? "bg-champagne text-nuit"
                        : art.status === "SOLD"
                          ? "bg-ivoire text-nuit"
                          : "bg-nuit text-ivoire"
                    }`}
                  >
                    {statusLabels[art.status] ?? art.status}
                  </span>
                  {art.model3dUrl && (
                    <span className="absolute top-3 right-3 bg-nuit/80 text-champagne text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
                      <Box size={12} /> 3D
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display font-normal text-[22px] leading-snug text-encre min-w-0 break-words">{art.title}</h2>
                    <div className="flex shrink-0 -mr-2">
                      <button
                        type="button"
                        aria-label={`Modifier ${art.title}`}
                        onClick={() => {
                          setEditing(art);
                          setShowForm(true);
                        }}
                        className="w-10 h-10 flex items-center justify-center text-pierre hover:text-encre"
                      >
                        <Pencil size={15} strokeWidth={1.6} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Retirer ${art.title}`}
                        onClick={() => handleDelete(art.id)}
                        className="w-10 h-10 flex items-center justify-center text-pierre hover:text-argile"
                      >
                        <Trash2 size={15} strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>
                  {dims && <p className="text-[13px] text-pierre">{dims}</p>}
                  <p className="text-sm font-medium text-encre mt-1">{formatPrice(art.priceCents, art.currency)}</p>
                  <div className="mt-2">
                    {art.certificate ? (
                      <Link
                        href={`/certificate/${art.certificate.serialNumber}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-[13px] text-laiton"
                      >
                        <Award size={14} strokeWidth={1.6} />
                        Certificat n° {art.certificate.serialNumber}
                        <ExternalLink size={12} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleGenerateCertificate(art.id)}
                        disabled={generatingId === art.id}
                        className="inline-flex items-center gap-1.5 text-[13px] text-laiton underline underline-offset-4 disabled:opacity-50"
                      >
                        <Award size={14} strokeWidth={1.6} />
                        {generatingId === art.id ? "Création du certificat…" : "Créer son certificat d'authenticité"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {filter === "ALL" || filter === "PUBLISHED" ? (
            <button
              type="button"
              onClick={openNew}
              className="aspect-[4/5] rounded-lg border border-dashed border-laiton/60 flex flex-col items-center justify-center gap-3 p-6 text-center hover:bg-papier transition-colors"
            >
              <Plus size={26} strokeWidth={1.2} className="text-laiton" />
              <span className="font-display text-[22px] text-encre">Un mur vous attend</span>
              <span className="text-[13px] text-laiton">
                {artworks.length ? "Accrochez votre prochaine œuvre" : "Accrochez votre première œuvre"}
              </span>
            </button>
          ) : null}
        </div>
      )}

      {showForm && (
        <ArtworkForm
          artwork={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadArtworks();
          }}
        />
      )}
    </DashboardShell>
  );
}
