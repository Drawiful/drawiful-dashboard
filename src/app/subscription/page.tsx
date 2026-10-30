"use client";
import { useEffect, useState } from "react";
import { Box, CreditCard } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";

const statusLabels: Record<string, { label: string; color: string }> = {
  TRIALING: { label: "Essai en cours", color: "#C98A3E" },
  ACTIVE: { label: "Actif", color: "#7A8B69" },
  PAST_DUE: { label: "Paiement en retard", color: "#B5533C" },
  CANCELED: { label: "Annulé", color: "#B5533C" },
  INCOMPLETE: { label: "En attente", color: "#7A6B5D" },
};

// Plans qui ouvrent la visite 3D (même règle que has3dAccess côté backend).
const PLANS_WITH_3D = ["artiste", "studio"];

type Plan = {
  key: string;
  name: string;
  amount: number | null;
  currency: string | null;
  interval: string | null;
  onQuote?: boolean; // Gallery : sur devis, pas d'abonnement en ligne
  contact?: string;
};

function formatPrice(plan: Plan) {
  if (plan.amount == null || !plan.currency) return null;
  const price = new Intl.NumberFormat("fr-FR", { style: "currency", currency: plan.currency.toUpperCase() }).format(
    plan.amount / 100
  );
  const per = plan.interval === "year" ? " / an" : plan.interval === "month" ? " / mois" : "";
  return price + per;
}

function longDate(iso?: string | null) {
  return iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "";
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [limits, setLimits] = useState<any>(null);
  const [preferred, setPreferred] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [choosing, setChoosing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPlans()
      .then(setPlans)
      .catch(() => setError("Impossible de charger les formules pour le moment."));
    // Formule repérée sur la landing avant l'inscription
    try {
      setPreferred(localStorage.getItem("drawiful_plan"));
    } catch {}
  }, []);

  async function handleManage() {
    setRedirecting(true);
    try {
      const { portalUrl } = await api.createPortalSession();
      window.location.href = portalUrl;
    } catch {
      setRedirecting(false);
    }
  }

  async function handleChoose(planKey: string) {
    setError(null);
    setChoosing(planKey);
    try {
      const { checkoutUrl } = await api.createSubscriptionCheckout(planKey);
      window.location.href = checkoutUrl;
    } catch (e: any) {
      setError(e?.message || "Impossible de lancer le paiement.");
      setChoosing(null);
    }
  }

  const status = subscription ? statusLabels[subscription.status] : null;
  const planName = subscription?.plan ? plans.find((p) => p.key === subscription.plan)?.name : null;
  // On propose les formules s'il n'y a pas d'abonnement, ou s'il a été annulé.
  const showPlans = !subscription || subscription.status === "CANCELED";
  const access = limits?.access;
  const trialEnd = longDate(limits?.trialEndsAt);
  // Essai sans carte en cours : l'abonnement démarre à la fin de l'essai
  // (Stripe exige au moins 48 h d'écart, sinon le prélèvement est immédiat).
  const trialMsLeft = limits?.trialEndsAt ? new Date(limits.trialEndsAt).getTime() - Date.now() : 0;
  const deferredCharge = access === "trial" && trialMsLeft > 48 * 60 * 60 * 1000;

  let heading = "Choisissez votre formule";
  let intro = "14 jours d'essai gratuit, puis prélèvement automatique. Vous pouvez annuler à tout moment.";
  if (subscription?.status === "CANCELED") {
    heading = "Reprendre un abonnement";
    intro = "Votre abonnement est annulé : choisissez une formule pour réactiver votre galerie.";
  } else if (access === "trial") {
    intro = deferredCharge
      ? `Votre essai gratuit court jusqu'au ${trialEnd}. Choisissez votre formule dès maintenant : rien n'est prélevé avant cette date, et vous gardez tout pendant l'essai.`
      : `Votre essai gratuit se termine le ${trialEnd}. Choisissez votre formule pour continuer sans interruption.`;
  } else if (access === "locked") {
    heading = "Rouvrez votre galerie";
    intro =
      "Choisissez votre formule : votre tableau de bord, votre boutique et votre visite 3D se rouvrent immédiatement. Vos œuvres, vos certificats et vos réglages sont conservés.";
  }

  return (
    <DashboardShell
      onProfileLoaded={(p) => {
        setSubscription(p.subscription);
        setLimits(p.limits);
      }}
    >
      <PageHeader kicker="Votre accès" title="Votre accès à Drawiful" />

      {access === "locked" && !subscription && (
        <div className="max-w-2xl rounded-md border border-ocre/50 bg-ocre/10 p-6 mb-10">
          <p className="font-display text-2xl text-encre">Votre essai gratuit est terminé</p>
          <p className="text-sm text-encre/70 mt-2">
            Votre galerie reste en ligne et vos visiteurs voient toujours vos œuvres. En revanche, la boutique et la
            visite 3D sont en pause, et votre tableau de bord est en lecture seule.
          </p>
        </div>
      )}

      {subscription && (
        <div className="max-w-lg rounded-md bg-aubergine p-7 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-ocre" strokeWidth={1.8} />
              {planName && <span className="text-sm text-lilas">Formule {planName}</span>}
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: `${status?.color}22`, color: status?.color }}
            >
              {status?.label ?? subscription.status}
            </span>
          </div>

          {subscription.currentPeriodEnd && subscription.status !== "CANCELED" && (
            <p className="text-sm text-lilas mb-6">
              Prochaine échéance le {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}
            </p>
          )}

          {subscription.status !== "CANCELED" && (
            <>
              <button
                onClick={handleManage}
                disabled={redirecting}
                className="w-full py-2.5 rounded-md bg-ocre text-aubergine text-sm font-medium disabled:opacity-60"
              >
                {redirecting ? "Redirection..." : "Gérer mon abonnement"}
              </button>
              <p className="text-xs text-lilas/60 mt-3 text-center">
                Changez de formule, mettez à jour votre carte ou annulez directement depuis Stripe.
              </p>
            </>
          )}
        </div>
      )}

      {showPlans && (
        <section className="max-w-4xl">
          <h3 className="font-display text-2xl text-encre mb-2">{heading}</h3>
          <p className="text-sm text-encre/60 mb-6 max-w-2xl">{intro}</p>

          {error && <p className="text-sm text-[#B5533C] mb-4">{error}</p>}

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const price = formatPrice(plan);
              const with3d = PLANS_WITH_3D.includes(plan.key);
              return (
                <div
                  key={plan.key}
                  className={`rounded-md border p-6 flex flex-col ${
                    preferred === plan.key ? "border-ocre ring-1 ring-ocre/50" : "border-bordure"
                  }`}
                >
                  <p className="font-display text-xl text-encre mb-1">{plan.name}</p>
                  <p className="text-sm text-encre/70 mb-5">
                    {plan.onQuote ? "Sur devis, selon le nombre d'artistes" : price ?? "Prix affiché au paiement"}
                  </p>

                  <p className={`flex items-center gap-2 text-sm mb-6 ${with3d ? "text-encre" : "text-encre/50"}`}>
                    <Box size={15} className={with3d ? "text-ocre" : ""} />
                    {with3d ? "Boutique et visite 3D incluses" : "Sans boutique ni visite 3D"}
                  </p>

                  {plan.onQuote ? (
                    <a
                      href={`mailto:${plan.contact || "clients@drawiful.app"}?subject=${encodeURIComponent(`Formule ${plan.name} — demande de devis`)}`}
                      className="mt-auto w-full py-2.5 rounded-md border border-aubergine text-aubergine text-sm font-medium text-center"
                    >
                      Demander un devis
                    </a>
                  ) : (
                    <button
                      onClick={() => handleChoose(plan.key)}
                      disabled={choosing !== null}
                      className="mt-auto w-full py-2.5 rounded-md bg-aubergine text-ocre text-sm font-medium disabled:opacity-60"
                    >
                      {choosing === plan.key ? "Redirection..." : `Choisir ${plan.name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
