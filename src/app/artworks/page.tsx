"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Award, ExternalLink, Box } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import ArtworkForm from "@/components/ArtworkForm";
import { api } from "@/lib/api";

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publiée",
  SOLD: "Vendue",
  ARCHIVED: "Archivée",
};

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [limits, setLimits] = useState<any>(null); // ce que la formule permet (renvoyé par /me/profile)
  const [notice, setNotice] = useState<string | null>(null);

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
    if (!confirm("Supprimer cette œuvre ?")) return;
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

  return (
    <DashboardShell onProfileLoaded={(p) => setLimits(p?.limits ?? null)}>
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h2 className="font-display text-4xl text-encre">Mes œuvres</h2>
          <p className="text-sm text-encre/60 mt-1">{artworks.length} œuvre(s)</p>
        </div>
        <button
          onClick={() => {
            if (atArtworkLimit) {
              setNotice(`Votre formule permet d'exposer ${limits.maxArtworks} œuvres. Archivez une œuvre ou passez à la formule Artiste pour en ajouter.`);
              return;
            }
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-md font-medium bg-aubergine text-platre"
        >
          <Plus size={16} />
          Ajouter une œuvre
        </button>
      </div>

      {limits && limits.maxArtworks != null && (
        <div className="mb-6 rounded-md border border-ocre/40 bg-ocre/10 px-4 py-3 text-sm text-encre flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            {limits.plan === "aspirant" ? "Formule Aspirant" : "Sans abonnement actif"} : {activeCount}/{limits.maxArtworks} œuvres ·{" "}
            {certCount}/{limits.maxCertificates} certificat
          </span>
          <span className="text-encre/60">Boutique, visite 3D et nom de domaine avec la formule Artiste.</span>
          <Link href="/subscription" className="font-medium text-aubergine underline underline-offset-2">
            Passer à Artiste
          </Link>
        </div>
      )}
      {notice && (
        <div className="mb-6 rounded-md border border-[#B5533C]/40 bg-[#B5533C]/10 px-4 py-3 text-sm text-encre flex items-start justify-between gap-4">
          <span>
            {notice}{" "}
            <Link href="/subscription" className="font-medium text-aubergine underline underline-offset-2">
              Voir les formules
            </Link>
          </span>
          <button onClick={() => setNotice(null)} className="text-encre/50" aria-label="Fermer">
            ×
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-encre/50">Chargement...</p>
      ) : artworks.length === 0 ? (
        <div className="rounded-md border border-dashed border-bordure p-10 text-center">
          <p className="text-sm text-encre/60">Aucune œuvre pour l'instant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {artworks.map((art) => (
            <div key={art.id} className="rounded-md overflow-hidden bg-white border border-bordure">
              <div
                className="h-40 bg-cover bg-center relative"
                style={{
                  backgroundColor: "#E4D9C8",
                  backgroundImage: art.imageUrl ? `url(${art.imageUrl})` : undefined,
                }}
              >
                {art.model3dUrl && (
                  <span className="absolute top-2 right-2 bg-aubergine text-ocre text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Box size={12} /> 3D/RA
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-base text-encre">{art.title}</p>
                    <p className="text-xs mt-0.5 text-encre/60">
                      {statusLabels[art.status]} · {(art.priceCents / 100).toFixed(2)} {art.currency}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(art);
                        setShowForm(true);
                      }}
                    >
                      <Pencil size={15} className="text-encre/50" />
                    </button>
                    <button onClick={() => handleDelete(art.id)}>
                      <Trash2 size={15} className="text-argile" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-bordure">
                  {art.certificate ? (
                    <Link
                      href={`/certificate/${art.certificate.serialNumber}`}
                      target="_blank"
                      className="flex items-center gap-2 text-xs text-sauge font-medium"
                    >
                      <Award size={14} />
                      Certificat {art.certificate.serialNumber}
                      <ExternalLink size={12} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleGenerateCertificate(art.id)}
                      disabled={generatingId === art.id}
                      className="flex items-center gap-2 text-xs text-argile font-medium disabled:opacity-50"
                    >
                      <Award size={14} />
                      {generatingId === art.id ? "Génération..." : "Générer un certificat"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
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
