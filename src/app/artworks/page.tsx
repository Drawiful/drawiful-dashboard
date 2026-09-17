"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

  return (
    <DashboardShell>
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h2 className="font-display text-4xl text-encre">Mes œuvres</h2>
          <p className="text-sm text-encre/60 mt-1">{artworks.length} œuvre(s)</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-md font-medium bg-aubergine text-platre"
        >
          <Plus size={16} />
          Ajouter une œuvre
        </button>
      </div>

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
                className="h-40 bg-cover bg-center"
                style={{
                  backgroundColor: "#E4D9C8",
                  backgroundImage: art.imageUrl ? `url(${art.imageUrl})` : undefined,
                }}
              />
              <div className="p-4 flex items-start justify-between">
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
