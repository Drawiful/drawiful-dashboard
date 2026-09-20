"use client";
import { useState } from "react";
import { CreditCard } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";

const statusLabels: Record<string, { label: string; color: string }> = {
  TRIALING: { label: "Essai en cours", color: "#C98A3E" },
  ACTIVE: { label: "Actif", color: "#7A8B69" },
  PAST_DUE: { label: "Paiement en retard", color: "#B5533C" },
  CANCELED: { label: "Annulé", color: "#B5533C" },
  INCOMPLETE: { label: "En attente", color: "#7A6B5D" },
};

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false);

  async function handleManage() {
    setRedirecting(true);
    try {
      const { portalUrl } = await api.createPortalSession();
      window.location.href = portalUrl;
    } catch {
      setRedirecting(false);
    }
  }

  const status = subscription ? statusLabels[subscription.status] : null;

  return (
    <DashboardShell onProfileLoaded={(p) => setSubscription(p.subscription)}>
      <h2 className="font-display text-4xl text-encre mb-8">Abonnement</h2>

      {!subscription ? (
        <div className="rounded-md border border-dashed border-bordure p-10 text-center max-w-lg">
          <p className="text-sm text-encre/60">Aucun abonnement actif pour ce compte.</p>
        </div>
      ) : (
        <div className="max-w-lg rounded-md bg-aubergine p-7">
          <div className="flex items-center justify-between mb-6">
            <CreditCard size={20} className="text-ocre" strokeWidth={1.8} />
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: `${status?.color}22`, color: status?.color }}
            >
              {status?.label ?? subscription.status}
            </span>
          </div>

          {subscription.currentPeriodEnd && (
            <p className="text-sm text-lilas mb-6">
              Prochaine échéance le{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}
            </p>
          )}

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
        </div>
      )}
    </DashboardShell>
  );
}
