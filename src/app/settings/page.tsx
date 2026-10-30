"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { Section, FormMessage, field, fieldLabel, btnPrimary, btnOutline } from "@/components/FormSection";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [account, setAccount] = useState<any>(null);
  const [connect, setConnect] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMessage, setPwdMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    api.getAccount().then(setAccount).catch(() => {});
    api.getConnectStatus().then(setConnect).catch(() => {});
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

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwdMessage(null);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPwdMessage({ text: "Votre nouveau mot de passe est enregistré.", ok: true });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPwdMessage({ text: err.message || "La modification n’a pas abouti.", ok: false });
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailMessage(null);
    try {
      await api.changeEmail(newEmail, emailPassword);
      setEmailMessage({ text: "Votre nouvelle adresse est enregistrée.", ok: true });
      setNewEmail("");
      setEmailPassword("");
      api.getAccount().then(setAccount);
    } catch (err: any) {
      setEmailMessage({ text: err.message || "La modification n’a pas abouti.", ok: false });
    }
  }

  const connectReady = connect?.chargesEnabled && connect?.detailsSubmitted;

  return (
    <DashboardShell>
      <PageHeader
        kicker="Votre maison"
        title="Votre maison"
        intro="Ce qui reste en coulisses : l'encaissement de vos ventes, votre adresse e-mail et votre mot de passe."
      />

      <Section
        num="I"
        title="Encaisser vos ventes"
        intro="Le produit de vos ventes arrive directement sur votre compte. Drawiful ne prélève aucune commission."
      >
        <div className={`rounded-xl p-7 ${connectReady ? "bg-papier border border-bordure" : "bg-nuit text-ivoire"}`}>
          {connectReady ? (
            <div className="flex flex-col gap-4">
              <p className="flex items-center gap-2.5 text-[15px] text-encre">
                <CheckCircle2 size={18} strokeWidth={1.6} className="text-sauge" />
                Vos ventes sont ouvertes : votre compte Stripe est actif.
              </p>
              <div>
                <button type="button" onClick={handleOpenStripeDashboard} disabled={redirecting} className={btnOutline}>
                  <ExternalLink size={15} strokeWidth={1.6} />
                  Ouvrir mon espace Stripe
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">
                {connect?.connected ? "Presque terminé" : "À faire"}
              </p>
              <p className="font-display text-[24px] leading-snug">
                {connect?.connected ? "Terminez l'ouverture de vos ventes." : "Ouvrez la vente de vos œuvres."}
              </p>
              <p className="text-sm text-lilas leading-relaxed">
                Comptez 5 minutes avec Stripe : votre identité et votre IBAN pour recevoir vos ventes. Tant que ce n'est pas
                fait, vos visiteurs voient « Vente en ligne bientôt disponible » à la place du bouton d'achat.
              </p>
              <div>
                <button
                  type="button"
                  onClick={handleConnectStripe}
                  disabled={redirecting}
                  className="inline-flex items-center min-h-[48px] px-6 rounded-full bg-champagne text-nuit text-sm font-semibold disabled:opacity-60"
                >
                  {redirecting ? "Ouverture de Stripe…" : connect?.connected ? "Terminer avec Stripe" : "Ouvrir mes ventes avec Stripe"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section num="II" title="Adresse e-mail" intro={<>Actuellement : <span className="text-encre">{account?.email ?? "—"}</span></>}>
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 max-w-md">
          <div>
            <label htmlFor="s-email" className={fieldLabel}>Nouvelle adresse e-mail</label>
            <input id="s-email" type="email" required autoComplete="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="s-email-pwd" className={fieldLabel}>Mot de passe actuel</label>
            <input
              id="s-email-pwd"
              type="password"
              required
              autoComplete="current-password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              className={field}
            />
          </div>
          <FormMessage message={emailMessage} />
          <div>
            <button type="submit" className={btnPrimary}>Changer d'adresse</button>
          </div>
        </form>
      </Section>

      <Section num="III" title="Mot de passe" intro="Au moins 8 caractères.">
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 max-w-md">
          <div>
            <label htmlFor="s-cur" className={fieldLabel}>Mot de passe actuel</label>
            <input
              id="s-cur"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="s-new" className={fieldLabel}>Nouveau mot de passe</label>
            <input
              id="s-new"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={field}
            />
          </div>
          <FormMessage message={pwdMessage} />
          <div>
            <button type="submit" className={btnPrimary}>Changer de mot de passe</button>
          </div>
        </form>
      </Section>
    </DashboardShell>
  );
}
