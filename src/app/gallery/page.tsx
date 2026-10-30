"use client";
import { useState } from "react";
import { UploadCloud, Check, Lock, ExternalLink, X } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ROOT_DOMAIN, galleryUrl } from "@/lib/domain";

import { THEME_OPTIONS as THEMES, DEFAULT_THEME, normalizeThemeId, getSkin } from "@/components/themes/skins";

import { Section, field, fieldLabel as label, hint } from "@/components/FormSection";

export default function GalleryPage() {
  const [galleryName, setGalleryName] = useState("");
  const [slug, setSlug] = useState("");
  const [savedSlug, setSavedSlug] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [legalMentionsText, setLegalMentionsText] = useState("");
  const [termsOfSaleText, setTermsOfSaleText] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function loadProfile(profile: any) {
    setGalleryName(profile.galleryName ?? "");
    setSlug(profile.slug ?? "");
    setSavedSlug(profile.slug ?? "");
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.avatarUrl ?? "");
    setSignatureUrl(profile.signatureUrl ?? "");
    setWebsiteUrl(profile.websiteUrl ?? "");
    // Ancien thème (retiré) : on présélectionne le thème qui le remplace.
    setTheme(normalizeThemeId(profile.theme));
    setLegalMentionsText(profile.legalMentionsText ?? "");
    setTermsOfSaleText(profile.termsOfSaleText ?? "");
    setPrivacyPolicyText(profile.privacyPolicyText ?? "");
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permet de reprendre le même fichier après « Retirer »
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
    e.target.value = "";
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
      await api.updateMyProfile({
        galleryName,
        slug,
        bio,
        avatarUrl: avatarUrl || null,
        signatureUrl: signatureUrl || null,
        websiteUrl: websiteUrl || null,
        theme,
        legalMentionsText,
        termsOfSaleText,
        privacyPolicyText,
      } as any);

      setSavedSlug(slug);
      setMessage({ ok: true, text: "Vos salles sont à jour." });
    } catch (err: any) {
      setMessage({ ok: false, text: err.message || "L’enregistrement n’a pas abouti. Réessayez dans un instant." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell onProfileLoaded={loadProfile}>
      <PageHeader
        kicker="Scénographie"
        title="Vos salles"
        intro="L'ambiance de votre galerie, son nom, votre portrait et votre signature : tout ce que vos visiteurs découvrent en entrant."
      />

      <form onSubmit={handleSubmit} className="pb-28">
        <Section num="I" title="L'ambiance" intro="Vos œuvres, votre bio et vos prix restent les mêmes : seule la mise en scène change.">
          <div className="grid gap-5 sm:grid-cols-3">
            {THEMES.map((t) => {
              const selected = theme === t.value;
              const room = getSkin(t.value).ambiance3d;
              return (
                <button
                  key={t.value}
                  type="button"
                  disabled={!t.available}
                  onClick={() => setTheme(t.value)}
                  aria-pressed={selected}
                  className={`group text-left rounded-xl overflow-hidden transition-shadow ${
                    selected ? "ring-2 ring-champagne shadow-[0_14px_34px_rgba(22,19,15,0.25)]" : "ring-1 ring-bordure hover:ring-laiton/60"
                  } ${t.available ? "" : "opacity-60 cursor-not-allowed"}`}
                >
                  <span className="relative block aspect-[4/3] bg-nuit overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/salles/${room}.jpg`}
                      alt={`Aperçu de la salle « ${t.label} » en 3D`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {selected && (
                      <span className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full bg-champagne text-nuit">
                        <Check size={14} strokeWidth={2.2} />
                      </span>
                    )}
                    {!t.available && (
                      <span className="absolute top-3 right-3 text-ivoire">
                        <Lock size={14} />
                      </span>
                    )}
                  </span>
                  <span className={`flex items-center justify-between gap-3 px-4 py-3.5 ${selected ? "bg-nuit text-ivoire" : "bg-papier text-encre"}`}>
                    <span className="font-display text-xl leading-tight">{t.label}</span>
                    {selected && <span className="text-[11px] uppercase tracking-[0.18em] text-champagne">Votre salle</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section num="II" title="L'identité" intro="Le nom sur la porte, l'adresse où l'on vous trouve, et quelques mots sur vous.">
          <div>
            <label htmlFor="g-name" className={label}>Nom de la galerie</label>
            <input id="g-name" value={galleryName} onChange={(e) => setGalleryName(e.target.value)} className={field} />
          </div>

          <div>
            <label htmlFor="g-slug" className={label}>Adresse de votre galerie</label>
            <div className="flex items-center rounded-lg border border-bordure bg-papier overflow-hidden focus-within:border-laiton">
              <span className="pl-4 text-[15px] text-pierre">https://</span>
              <input
                id="g-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="min-w-0 flex-1 py-3 text-[15px] bg-transparent outline-none text-right text-encre"
              />
              <span className="pr-4 text-[15px] text-pierre">.{ROOT_DOMAIN}</span>
            </div>
            {slug !== savedSlug && savedSlug ? (
              <p className="text-[13px] mt-2 text-argile">
                Attention : l'ancienne adresse ({savedSlug}.{ROOT_DOMAIN}) ne fonctionnera plus. Pensez à mettre à jour vos
                liens en bio.
              </p>
            ) : (
              savedSlug && (
                <a
                  href={galleryUrl(savedSlug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] mt-2 text-laiton underline underline-offset-4"
                >
                  Visiter votre galerie <ExternalLink size={12} />
                </a>
              )
            )}
          </div>

          <div>
            <label htmlFor="g-bio" className={label}>Votre bio</label>
            <textarea
              id="g-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              placeholder="Votre parcours, votre médium, ce qui vous inspire…"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="g-web" className={label}>Site web <span className="font-normal text-pierre">(facultatif)</span></label>
            <input id="g-web" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className={field} />
          </div>
        </Section>

        <Section num="III" title="Portrait et signature" intro="Votre visage ou votre logo accueille vos visiteurs. Votre signature authentifie vos certificats.">
          <div>
            <p className={label}>Portrait ou logo</p>
            <div className="flex flex-wrap items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Votre portrait" className="w-20 h-20 rounded-full object-cover border border-bordure" />
              ) : (
                <span className="w-20 h-20 rounded-full bg-[#EAE3D6] border border-bordure" aria-hidden="true" />
              )}
              <label className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-encre text-sm text-encre cursor-pointer">
                <UploadCloud size={16} strokeWidth={1.6} />
                {uploading ? "Envoi…" : avatarUrl ? "Changer le portrait" : "Ajouter un portrait"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              {avatarUrl && !uploading && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl("")}
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-2 text-sm text-pierre hover:text-argile"
                >
                  <X size={15} />
                  Retirer
                </button>
              )}
            </div>
          </div>

          <div>
            <p className={label}>Signature manuscrite <span className="font-normal text-pierre">(facultatif)</span></p>
            <p className={`${hint} mb-3`}>
              Apposée sur vos certificats d'authenticité. Sans image, votre nom s'affiche dans une écriture manuscrite.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {signatureUrl && (
                <img src={signatureUrl} alt="Votre signature" className="h-16 object-contain bg-white border border-bordure rounded-lg px-3" />
              )}
              <label className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-encre text-sm text-encre cursor-pointer">
                <UploadCloud size={16} strokeWidth={1.6} />
                {uploadingSignature ? "Envoi…" : signatureUrl ? "Changer la signature" : "Ajouter ma signature"}
                <input type="file" accept="image/*" className="hidden" onChange={handleSignatureChange} />
              </label>
              {signatureUrl && !uploadingSignature && (
                <button
                  type="button"
                  onClick={() => setSignatureUrl("")}
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-2 text-sm text-pierre hover:text-argile"
                >
                  <X size={15} />
                  Retirer
                </button>
              )}
            </div>
          </div>
        </Section>

        <Section
          num="IV"
          title="Pages légales"
          intro="Laissez un champ vide pour afficher le modèle générique sur votre galerie. Renseignez-le pour le remplacer par votre texte."
        >
          <div>
            <label htmlFor="g-legal" className={label}>Mentions légales</label>
            <textarea
              id="g-legal"
              value={legalMentionsText}
              onChange={(e) => setLegalMentionsText(e.target.value)}
              rows={6}
              placeholder="SIRET, raison sociale, adresse, directeur de publication, hébergeur…"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="g-cgv" className={label}>Conditions générales de vente</label>
            <textarea
              id="g-cgv"
              value={termsOfSaleText}
              onChange={(e) => setTermsOfSaleText(e.target.value)}
              rows={6}
              placeholder="Modalités de paiement, livraison, retours, garanties…"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="g-privacy" className={label}>Politique de confidentialité</label>
            <textarea
              id="g-privacy"
              value={privacyPolicyText}
              onChange={(e) => setPrivacyPolicyText(e.target.value)}
              rows={6}
              placeholder="Données collectées, finalités, durée de conservation, droits RGPD…"
              className={field}
            />
          </div>
        </Section>

        {/* Barre d'enregistrement, toujours à portée de main */}
        <div className="fixed bottom-0 left-0 right-0 md:left-[264px] z-30 bg-platre/95 backdrop-blur border-t border-bordure">
          <div className="max-w-[1080px] mx-auto px-5 sm:px-10 md:px-14 py-4 flex flex-wrap items-center justify-end gap-4">
            {message && (
              <p role="status" className={`text-sm mr-auto ${message.ok ? "text-sauge" : "text-argile"}`}>
                {message.text}
              </p>
            )}
            <button
              type="submit"
              disabled={saving || uploading || uploadingSignature}
              className="inline-flex items-center min-h-[48px] px-7 rounded-full bg-nuit text-ivoire text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}
