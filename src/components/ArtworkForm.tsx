"use client";
import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { api } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function ArtworkForm({
  artwork,
  onClose,
  onSaved,
}: {
  artwork: any | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(artwork?.title ?? "");
  const [description, setDescription] = useState(artwork?.description ?? "");
  const [price, setPrice] = useState(artwork ? (artwork.priceCents / 100).toString() : "");
  const [imageUrl, setImageUrl] = useState(artwork?.imageUrl ?? "");
  const [model3dUrl, setModel3dUrl] = useState(artwork?.model3dUrl ?? "");
  const [status, setStatus] = useState(artwork?.status ?? "DRAFT");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploading3d, setUploading3d] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      setImageUrl(await uploadToCloudinary(file, "image"));
    } catch {
      setError("Échec de l'upload de l'image");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handle3dChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading3d(true);
    try {
      setModel3dUrl(await uploadToCloudinary(file, "raw"));
    } catch {
      setError("Échec de l'upload du fichier 3D");
    } finally {
      setUploading3d(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      title,
      description,
      priceCents: Math.round(parseFloat(price || "0") * 100),
      imageUrl: imageUrl || undefined,
      model3dUrl: model3dUrl || undefined,
      status,
    };
    try {
      if (artwork) {
        await api.updateArtwork(artwork.id, payload);
      } else {
        await api.createArtwork(payload);
      }
      onSaved();
    } catch {
      setError("Impossible d'enregistrer l'œuvre");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-encre/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-bordure">
          <h3 className="font-display text-xl text-encre">
            {artwork ? "Modifier l'œuvre" : "Nouvelle œuvre"}
          </h3>
          <button onClick={onClose}>
            <X size={18} className="text-encre/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm mb-1.5 text-encre/80">Titre</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-encre/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-encre/80">Prix (€)</label>
            <input
              required
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-encre/80">Image</label>
            <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-md border border-dashed border-bordure text-sm cursor-pointer text-encre/60">
              <UploadCloud size={16} />
              {uploadingImage ? "Envoi en cours..." : imageUrl ? "Image ajoutée ✓" : "Choisir une image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-encre/80">
              Fichier 3D / RA (.glb, .usdz) — optionnel
            </label>
            <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-md border border-dashed border-bordure text-sm cursor-pointer text-encre/60">
              <UploadCloud size={16} />
              {uploading3d ? "Envoi en cours..." : model3dUrl ? "Fichier ajouté ✓" : "Choisir un fichier"}
              <input type="file" accept=".glb,.usdz" className="hidden" onChange={handle3dChange} />
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-encre/80">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm bg-white"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publiée</option>
              <option value="ARCHIVED">Archivée</option>
            </select>
          </div>

          {error && <p className="text-sm text-argile">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploadingImage || uploading3d}
            className="w-full py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
