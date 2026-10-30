"use client";
import { useEffect, useState } from "react";
import { Check, Minus } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";

const statusLabels: Record<string, string> = {
  TRIALING: "Accès privé en cours",
  ACTIVE: "Active",
  PAST_DUE: "Paiement en attente",
  CANCELED: "Annulée",
  INCOMPLETE: "En attente",
};

// Ce que chaque formule ouvre (mêmes promesses que la landing).
const PLAN_DETAILS: Record<string, { pitch: string; features: string[]; missing: string[]; featured?: boolean }> = {
  aspirant: {
    pitch: "Pour poser les fondations de votre présence en ligne et exposer vos premières créations.",
    features: ["Une sélection de 5 œuvres", "Galerie publique en ligne", "1 certificat d'authenticité", "Votre adresse dédiée : votrenom.drawiful.art"],
    missing: ["Vente en ligne", "Galerie 3D immersive", "Nom de domaine personnalisé"],
  },
  artiste: {
    pitch: "La formule des artistes qui vendent leurs œuvres.",
    features: [
      "Œuvres et expositions illimitées",
      "Vente en ligne de vos œuvres",
      "Galerie 3D immersive et réalité augmentée",
      "Certificats d'authenticité illimités",
      "Suivi des acquisitions et des envois",
      "Votre propre nom de domaine",
    ],
    missing: [],
    featured: true,
  },
  studio: {
    pitch: "Pour les galeries d'art, les agents et les collectifs multi-artistes.",
    features: ["L'intégralité de la formule Artiste", "De 2 à 10 artistes sous votre enseigne", "Accompagnement dédié"],
    missing: [],
  },
};

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
  const price = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: plan.currency.toUpperCase(),
    minimumFractionDigits: plan.amount % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(plan.amount / 100);
  const per = plan.interval === "year" ? "par an" : plan.interval === "month" ? "par mois" : "";
  return { price, per };
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
  // Accès privé sans carte en cours : la formule démarre à la fin de l'accès privé
  // (Stripe exige au moins 48 h d'écart, sinon le prélèvement est immédiat).
  const trialMsLeft = limits?.trialEndsAt ? new Date(limits.trialEndsAt).getTime() - Date.now() : 0;
  const deferredCharge = access === "trial" && trialMsLeft > 48 * 60 * 60 * 1000;

  let title = "Votre accès à Drawiful";
  let intro = "14 jours d'accès privé, puis prélèvement automatique. Vous pouvez annuler à tout moment.";
  if (subscription && subscription.status !== "CANCELED") {
    title = "Votre galerie vous appartient";
    intro = "Votre formule est active. Vous pouvez la faire évoluer à tout moment.";
  } else if (subscription?.status === "CANCELED") {
    title = "Rouvrez votre galerie";
    intro = "Votre formule est annulée : choisissez-en une pour rouvrir votre galerie.";
  } else if (access === "trial") {
    title = "Prolongez l'expérience";
    intro = deferredCharge
      ? `Votre accès privé court jusqu'au ${trialEnd}. Choisissez votre formule dès maintenant : rien n'est prélevé avant cette date, et tout reste ouvert d'ici là.`
      : `Votre accès privé se termine le ${trialEnd}. Choisissez votre formule pour continuer sans interruption.`;
  } else if (access === "locked") {
    title = "Votre galerie vous attend";
    intro =
      "Choisissez votre formule : votre espace, la vente de vos œuvres et votre visite 3D se rouvrent immédiatement. Vos œuvres, vos certificats et vos réglages sont conservés.";
  }

  return (
    <DashboardShell
      onProfileLoaded={(p) => {
        setSubscription(p.subscription);
        setLimits(p.limits);
      }}
    >
      <PageHeader kicker="Votre accès" title={title} intro={intro} />

      {access === "locked" && !subscription && (
        <div className="max-w-2xl rounded-xl bg-nuit text-ivoire p-8 mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">Accès privé terminé</p>
          <p className="font-display text-[26px] leading-snug mt-2">Votre galerie reste en ligne.</p>
          <p className="text-[15px] text-lilas mt-2 leading-relaxed">
            Vos visiteurs voient toujours vos œuvres. En revanche, la vente et la visite 3D sont en pause, et votre espace
            est en lecture seule.
          </p>
        </div>
      )}

      {subscription && subscription.status !== "CANCELED" && (
        <div className="max-w-xl rounded-xl bg-nuit text-ivoire p-8 mb-12 flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">Votre formule</p>
            <span className="text-xs px-3 py-1 rounded-full bg-champagne/15 text-champagne font-medium">
              {status ?? subscription.status}
            </span>
          </div>
          <p className="font-display text-[40px] leading-none">{planName ?? "Drawiful"}</p>
          {subscription.currentPeriodEnd && (
            <p className="text-sm text-lilas">
              Prochaine échéance le{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          <div>
            <button
              type="button"
              onClick={handleManage}
              disabled={redirecting}
              className="inline-flex items-center min-h-[48px] px-6 rounded-full bg-champagne text-nuit text-sm font-semibold disabled:opacity-60"
            >
              {redirecting ? "Ouverture…" : "Gérer ma formule"}
            </button>
            <p className="text-xs text-lilas mt-3">
              Changez de formule, mettez à jour votre carte ou annulez depuis l'espace sécurisé Stripe.
            </p>
          </div>
        </div>
      )}

      {showPlans && (
        <section>
          {error && <p className="text-sm text-argile mb-6">{error}</p>}

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const amount = formatPrice(plan);
              const d = PLAN_DETAILS[plan.key];
              const highlight = preferred ? preferred === plan.key : !!d?.featured;
              return (
                <div
                  key={plan.key}
                  className={`relative rounded-xl p-8 flex flex-col ${
                    highlight ? "bg-nuit text-ivoire ring-1 ring-champagne/60" : "bg-papier border border-bordure text-encre"
                  }`}
                >
                  {highlight && (
                    <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-champagne text-nuit text-[11px] font-semibold tracking-wide">
                      {preferred === plan.key ? "Votre choix" : "Recommandée"}
                    </span>
                  )}
                  <p className="font-display text-[32px] leading-none">{plan.name}</p>
                  {d?.pitch && (
                    <p className={`text-sm leading-relaxed mt-3 ${highlight ? "text-lilas" : "text-encre/70"}`}>{d.pitch}</p>
                  )}
                  <div className="mt-6 mb-6">
                    {plan.onQuote ? (
                      <p className="font-display text-[34px] leading-tight">Sur devis</p>
                    ) : amount ? (
                      <p className="flex items-baseline gap-2">
                        <span className="font-display text-[44px] leading-none">{amount.price}</span>
                        <span className={`text-sm ${highlight ? "text-lilas" : "text-pierre"}`}>{amount.per}</span>
                      </p>
                    ) : (
                      <p className={`text-sm ${highlight ? "text-lilas" : "text-pierre"}`}>Prix affiché au paiement</p>
                    )}
                  </div>

                  {d && (
                    <ul className="flex flex-col gap-2.5 mb-8 text-sm">
                      {d.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check size={15} strokeWidth={1.8} className={`mt-0.5 shrink-0 ${highlight ? "text-champagne" : "text-laiton"}`} />
                          {f}
                        </li>
                      ))}
                      {d.missing.map((f) => (
                        <li key={f} className={`flex items-start gap-2.5 ${highlight ? "text-ivoire/45" : "text-pierre"}`}>
                          <Minus size={15} strokeWidth={1.8} className="mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {plan.onQuote ? (
                    <a
                      href={`mailto:${plan.contact || "clients@drawiful.app"}?subject=${encodeURIComponent(`Formule ${plan.name} — demande de devis`)}`}
                      className={`mt-auto inline-flex items-center justify-center min-h-[48px] rounded-full text-sm font-medium border ${
                        highlight ? "border-ivoire/50 text-ivoire" : "border-encre text-encre"
                      }`}
                    >
                      Demander un devis
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleChoose(plan.key)}
                      disabled={choosing !== null}
                      className={`mt-auto min-h-[48px] rounded-full text-sm font-semibold disabled:opacity-60 ${
                        highlight ? "bg-champagne text-nuit" : "bg-nuit text-ivoire"
                      }`}
                    >
                      {choosing === plan.key ? "Ouverture du paiement…" : `Choisir ${plan.name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-pierre mt-6">Paiement sécurisé par Stripe. Vous pouvez changer de formule ou l'annuler à tout moment.</p>
        </section>
      )}
    </DashboardShell>
  );
}
