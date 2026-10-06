"use client";
import { useEffect, useState } from "react";
import { Box, CreditCard } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
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
};

function formatPrice(plan: Plan) {
  if (plan.amount == null || !plan.currency) return null;
  const price = new Intl.NumberFormat("fr-FR", { style: "currency", currency: plan.currency.toUpperCase() }).format(
    plan.amount / 100
  );
  const per = plan.interval === "year" ? " / an" : plan.interval === "month" ? " / mois" : "";
  return price + per;
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [choosing, setChoosing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPlans()
      .then(setPlans)
      .catch(() => setError("Impossible de charger les plans pour le moment."));
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
  // On propose les plans s'il n'y a pas d'abonnement, ou s'il a été annulé.
  const showPlans = !subscription || subscription.status === "CANCELED";
  const firstSubscription = !subscription;

  return (
    <DashboardShell onProfileLoaded={(p) => setSubscription(p.subscription)}>
      <h2 className="font-display text-4xl text-encre mb-8">Abonnement</h2>

      {subscription && (
        <div className="max-w-lg rounded-md bg-aubergine p-7 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-ocre" strokeWidth={1.8} />
              {planName && <span className="text-sm text-lilas">Plan {planName}</span>}
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
                Change de plan, mets à jour ta carte, ou annule directement depuis Stripe.
              </p>
            </>
          )}
        </div>
      )}

      {showPlans && (
        <section className="max-w-4xl">
          <h3 className="font-display text-2xl text-encre mb-2">
            {firstSubscription ? "Choisis ton plan" : "Reprendre un abonnement"}
          </h3>
          <p className="text-sm text-encre/60 mb-6">
            {firstSubscription
              ? "14 jours d'essai gratuit, puis prélèvement automatique. Tu peux annuler à tout moment."
              : "Ton abonnement est annulé : choisis un plan pour réactiver ta galerie."}
          </p>

          {error && <p className="text-sm text-[#B5533C] mb-4">{error}</p>}

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const price = formatPrice(plan);
              const with3d = PLANS_WITH_3D.includes(plan.key);
              return (
                <div key={plan.key} className="rounded-md border border-bordure p-6 flex flex-col">
                  <p className="font-display text-xl text-encre mb-1">{plan.name}</p>
                  <p className="text-sm text-encre/70 mb-5">{price ?? "Prix affiché au paiement"}</p>

                  <p className={`flex items-center gap-2 text-sm mb-6 ${with3d ? "text-encre" : "text-encre/50"}`}>
                    <Box size={15} className={with3d ? "text-ocre" : ""} />
                    {with3d ? "Visite 3D de ta galerie incluse" : "Sans visite 3D"}
                  </p>

                  <button
                    onClick={() => handleChoose(plan.key)}
                    disabled={choosing !== null}
                    className="mt-auto w-full py-2.5 rounded-md bg-aubergine text-ocre text-sm font-medium disabled:opacity-60"
                  >
                    {choosing === plan.key ? "Redirection..." : `Choisir ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </DashboardShell>
  );
}
