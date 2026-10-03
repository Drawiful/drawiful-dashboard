"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, ExternalLink, Check, Lock } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";

const THEMES = [
  {
    value: "galerie-blanche",
    label: "Blanc Galerie",
    description: "Épuré, lumineux — crème clair, Fraunces.",
    swatch: ["#FEFEFC", "#1A1A18", "#B08D57"],
    available: true,
  },
  {
    value: "maison-haussmann",
    label: "Maison Haussmann",
    description: "Classique, chaleureux — crème, bronze et doré.",
    swatch: ["#F6F1E3", "#2B2013", "#B9862F"],
    available: true,
  },
  {
    value: "atelier-sombre",
    label: "Atelier Sombre",
    description: "Anthracite et bleu cobalt — bientôt disponible.",
    swatch: ["#181B1E", "#4C7CF0", "#C68E4E"],
    available: false,
  },
];

export default function SettingsPage() {
  const [account, setAccount] = useState<any>(null);
  const [connect, setConnect] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeMessage, setThemeMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMessage, setPwdMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    api.getAccount().then(setAccount).catch(() => {});
    api.getConnectStatus().then(setConnect).catch(() => {});
    api.getMyProfile().then(setProfile).catch(() => {});
  }, []);

  async function handleConnectStripe() {
    setRedirecting(true);
    try {
      const { onboardingUrl } = await api.createConnectOnboarding();
      window.location.href = onboardingUrl;
    } catch {
      setRedirecting(false);
    }
  }

  async function handleOpenStripeDashboard() {
    setRedirecting(true);
    try {
      const { dashboardUrl } = await api.createConnectDashboard();
      window.open(dashboardUrl, "_blank");
    } finally {
      setRedirecting(false);
    }
  }

  async function handleThemeSelect(value: string) {
    if (!profile || profile.theme === value || savingTheme) return;
    setSavingTheme(true);
    setThemeMessage(null);
    const previous = profile.theme;
    setProfile({ ...profile, theme: value }); // optimiste
    try {
      await api.updateMyProfile({ theme: value });
      setThemeMessage("Apparence mise à jour ✓");
    } catch (err: any) {
      setProfile({ ...profile, theme: previous }); // on annule si ça échoue
      setThemeMessage(err.message || "Erreur lors de la mise à jour");
    } finally {
      setSavingTheme(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwdMessage(null);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPwdMessage({ text: "Mot de passe mis à jour ✓", ok: true });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwdMessage({ text: err.message || "Erreur", ok: false });
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailMessage(null);
    try {
      await api.changeEmail(newEmail, emailPassword);
      setEmailMessage({ text: "Email mis à jour ✓", ok: true });
      setNewEmail("");
      setEmailPassword("");
      api.getAccount().then(setAccount);
    } catch (err: any) {
      setEmailMessage({ text: err.message || "Erreur", ok: false });
    }
  }

  const connectReady = connect?.chargesEnabled && connect?.detailsSubmitted;

  return (
    <DashboardShell>
      <h2 className="font-display text-4xl text-encre mb-8">Paramètres</h2>

      <section className="max-w-2xl mb-12">
        <h3 className="font-display text-xl text-encre mb-1">Apparence de ma galerie</h3>
        <p className="text-sm text-encre/60 mb-4">
          Choisis l'habillage visuel de ta galerie publique. Le contenu (œuvres, bio, prix) reste
          le même quel que soit le thème choisi.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {THEMES.map((t) => {
            const selected = profile?.theme === t.value;
            return (
              <button
                key={t.value}
                type="button"
                disabled={!t.available || savingTheme}
                onClick={() => handleThemeSelect(t.value)}
                className={`relative text-left rounded-md border p-4 transition-colors ${
                  selected ? "border-aubergine ring-1 ring-aubergine" : "border-bordure"
                } ${t.available ? "bg-white hover:border-aubergine/50" : "bg-white/60 cursor-not-allowed"}`}
              >
                {selected && (
                  <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-aubergine text-platre">
                    <Check size={12} />
                  </span>
                )}
                {!t.available && (
                  <span className="absolute top-3 right-3 text-encre/40">
                    <Lock size={14} />
                  </span>
                )}
                <div className="flex gap-1.5 mb-3">
                  {t.swatch.map((c, i) => (
                    <span key={i} className="w-5 h-5 rounded-full border border-bordure" style={{ background: c }} />
                  ))}
                </div>
                <p className="font-display text-base text-encre mb-1">{t.label}</p>
                <p className="text-xs text-encre/60 leading-relaxed">{t.description}</p>
              </button>
            );
          })}
        </div>

        {themeMessage && (
          <p className={`text-sm mt-3 ${themeMessage.includes("Erreur") ? "text-argile" : "text-sauge"}`}>
            {themeMessage}
          </p>
        )}
      </section>

      <section className="max-w-lg mb-12">
        <h3 className="font-display text-xl text-encre mb-1">Encaisser mes ventes</h3>
        <p className="text-sm text-encre/60 mb-4">
          Connecte ton compte Stripe pour recevoir directement l'argent de tes ventes d'œuvres.
          Drawiful ne prélève aucune commission.
        </p>

        <div className="rounded-md bg-white border border-bordure p-5">
          {connectReady ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-sauge" />
                <p className="text-sm text-encre">Compte Stripe connecté et actif</p>
              </div>
              <button
                onClick={handleOpenStripeDashboard}
                disabled={redirecting}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-bordure text-encre"
              >
                <ExternalLink size={15} />
                Ouvrir mon tableau de bord Stripe
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={18} className="text-argile" />
                <p className="text-sm text-encre">
                  {connect?.connected
                    ? "Configuration Stripe incomplète"
                    : "Aucun compte Stripe connecté"}
                </p>
              </div>
              <button
                onClick={handleConnectStripe}
                disabled={redirecting}
                className="text-sm px-4 py-2 rounded-md bg-aubergine text-platre disabled:opacity-60"
              >
                {redirecting
                  ? "Redirection..."
                  : connect?.connected
                  ? "Terminer la configuration"
                  : "Connecter mon compte Stripe"}
              </button>
            </>
          )}
        </div>
      </section>

      <section className="max-w-lg mb-12">
        <h3 className="font-display text-xl text-encre mb-1">Adresse email</h3>
        <p className="text-sm text-encre/60 mb-4">Actuellement : {account?.email ?? "—"}</p>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Nouvelle adresse email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm bg-white"
          />
          <input
            type="password"
            required
            placeholder="Mot de passe actuel"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm bg-white"
          />
          {emailMessage && (
            <p className={`text-sm ${emailMessage.ok ? "text-sauge" : "text-argile"}`}>
              {emailMessage.text}
            </p>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium"
          >
            Modifier l'email
          </button>
        </form>
      </section>

      <section className="max-w-lg">
        <h3 className="font-display text-xl text-encre mb-4">Mot de passe</h3>

        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <input
            type="password"
            required
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm bg-white"
          />
          <input
            type="password"
            required
            placeholder="Nouveau mot de passe (8 caractères min.)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-md border border-bordure text-sm bg-white"
          />
          {pwdMessage && (
            <p className={`text-sm ${pwdMessage.ok ? "text-sauge" : "text-argile"}`}>
              {pwdMessage.text}
            </p>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium"
          >
            Modifier le mot de passe
          </button>
        </form>
      </section>
    </DashboardShell>
  );
}
