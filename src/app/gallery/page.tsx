"use client";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function GalleryPage() {
  const [galleryName, setGalleryName] = useState("");
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function loadProfile(profile: any) {
    setGalleryName(profile.galleryName ?? "");
    setSlug(profile.slug ?? "");
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.avatarUrl ?? "");
    setSignatureUrl(profile.signatureUrl ?? "");
    setWebsiteUrl(profile.websiteUrl ?? "");
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setAvatarUrl(await uploadToCloudinary(file, "image"));
    } finally {
      setUploading(false);
    }
  }

  async function handleSignatureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSignature(true);
    try {
      setSignatureUrl(await uploadToCloudinary(file, "image"));
    } finally {
      setUploadingSignature(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await api.updateMyProfile({ galleryName, slug, bio, avatarUrl, signatureUrl, websiteUrl });
      setMessage("Profil mis à jour ✓");
    } catch (err: any) {
      setMessage(err.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell onProfileLoaded={loadProfile}>
      <h2 className="font-display text-4xl text-encre mb-8">Ma galerie</h2>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        <div>
          <label className="block text-sm mb-1.5 text-encre/80">Nom de la galerie</label>
          <input
            value={galleryName}
            onChange={(e) => setGalleryName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5 text-encre/80">URL publique</label>
          <div className="flex items-center rounded-md border border-bordure bg-white overflow-hidden">
            <span className="px-3 text-sm text-encre/40">drawiful.art/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 py-2.5 pr-3.5 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1.5 text-encre/80">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5 text-encre/80">Photo / avatar</label>
          <div className="flex items-center gap-4">
            {avatarUrl && (
              <img src={avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover" />
            )}
            <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-md border border-dashed border-bordure text-sm cursor-pointer text-encre/60">
              <UploadCloud size={16} />
              {uploading ? "Envoi..." : "Changer la photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1.5 text-encre/80">
            Signature manuscrite (optionnel)
          </label>
          <p className="text-xs text-encre/50 mb-2">
            Affichée sur tes certificats d'authenticité. Sans image, ton nom s'affiche dans une
            police manuscrite à la place.
          </p>
          <div className="flex items-center gap-4">
            {signatureUrl && (
              <img
                src={signatureUrl}
                alt="Signature"
                className="h-14 object-contain bg-white border border-bordure rounded-md px-2"
              />
            )}
            <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-md border border-dashed border-bordure text-sm cursor-pointer text-encre/60">
              <UploadCloud size={16} />
              {uploadingSignature ? "Envoi..." : signatureUrl ? "Changer la signature" : "Uploader une signature"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSignatureChange}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1.5 text-encre/80">Site web (optionnel)</label>
          <input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm bg-white"
          />
        </div>

        {message && <p className="text-sm text-sauge">{message}</p>}

        <button
          type="submit"
          disabled={saving || uploading}
          className="px-5 py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </DashboardShell>
  );
}
