"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, Clock, Award, TrendingUp } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import PrintsInterestCard from "@/components/PrintsInterestCard";
import PaymentsSetupBanner from "@/components/PaymentsSetupBanner";
import GettingStarted, { onboardingComplete } from "@/components/GettingStarted";
import { api } from "@/lib/api";

function daysLeft(dateStr?: string) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatMoney(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100);
}

const statusLabels: Record<string, string> = {
  TRIALING: "Essai en cours",
  ACTIVE: "Abonnement actif",
  PAST_DUE: "Paiement en retard",
  CANCELED: "Annulé",
  INCOMPLETE: "En attente",
};

export default function OverviewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    api.getOrderStats().then(setStats).catch(() => {});
    // Arrivée juste après l'inscription (/overview?bienvenue=1)
    if (new URLSearchParams(window.location.search).get("bienvenue") === "1") setWelcome(true);
  }, []);

  const artworks = profile?.artworks ?? [];
  const published = artworks.filter((a: any) => a.status === "PUBLISHED").length;
  const subscription = profile?.subscription;
  const limits = profile?.limits;
  const onFreeTrial = !subscription && limits?.access === "trial";
  const remaining = onFreeTrial ? limits.trialDaysLeft : daysLeft(subscription?.currentPeriodEnd);
  const statusText = subscription
    ? statusLabels[subscription.status] ?? subscription.status
    : onFreeTrial
      ? "Essai gratuit"
      : "—";

  return (
    <DashboardShell onProfileLoaded={setProfile}>
      <header className="mb-10">
        <p className="text-sm text-encre/60">Bonjour,</p>
        <h2 className="font-display text-4xl text-encre mt-1">
          Voici votre galerie aujourd'hui
        </h2>
      </header>

      {welcome && (
        <section className="mb-8 rounded-md bg-aubergine text-platre p-6">
          <p className="text-xs uppercase tracking-widest text-ocre">Bienvenue sur Drawiful</p>
          <h3 className="font-display text-2xl mt-2">Votre galerie est créée.</h3>
          <p className="text-sm text-platre/75 mt-2 max-w-xl">
            Votre essai gratuit de 14 jours commence maintenant, sans carte bancaire. Suivez les étapes ci-dessous :
            en quelques minutes, votre galerie est prête à être partagée.
          </p>
        </section>
      )}

      {/* Premiers pas tant que la galerie n'est pas prête (inclut l'activation
          des paiements) ; ensuite, le bandeau paiements reste en filet de sécurité. */}
      <GettingStarted profile={profile} />
      {profile && (onboardingComplete(profile) || profile.stripeOnboardingDone) && (
        <PaymentsSetupBanner profile={profile} />
      )}

      <div className="grid grid-cols-4 gap-5 mb-8">
        <div className="rounded-md p-5 bg-white border border-bordure">
          <ImageIcon size={18} className="text-argile" strokeWidth={1.8} />
          <p className="font-display text-2xl text-encre mt-3">{published}</p>
          <p className="text-xs mt-1 text-encre/60">Œuvres publiées</p>
        </div>

        <div className="rounded-md p-5 bg-aubergine">
          <TrendingUp size={18} className="text-ocre" strokeWidth={1.8} />
          <p className="font-display text-2xl text-platre mt-3">
            {stats ? formatMoney(stats.revenueCents, stats.currency) : "—"}
          </p>
          <p className="text-xs mt-1 text-lilas">Chiffre d'affaires</p>
        </div>

        <div className="rounded-md p-5 bg-white border border-bordure">
          <Award size={18} className="text-argile" strokeWidth={1.8} />
          <p className="font-display text-2xl text-encre mt-3">
            {statusText}
          </p>
          <p className="text-xs mt-1 text-encre/60">Statut abonnement</p>
        </div>

        <div className="rounded-md p-5 bg-white border border-bordure">
          <Clock size={18} className="text-argile" strokeWidth={1.8} />
          <p className="font-display text-2xl text-encre mt-3">
            {remaining !== null ? `${remaining} j.` : "—"}
          </p>
          <p className="text-xs mt-1 text-encre/60">{onFreeTrial ? "Avant la fin de l'essai" : "Avant prochaine échéance"}</p>
        </div>
      </div>

      <PrintsInterestCard />

      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-display text-2xl text-encre">Œuvres récentes</h3>
        <Link
          href="/artworks"
          className="text-sm px-4 py-2 rounded-md font-medium bg-aubergine text-platre"
        >
          Voir toutes les œuvres
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="rounded-md border border-dashed border-bordure p-10 text-center">
          <p className="text-sm text-encre/60">
            Aucune œuvre pour l'instant. Ajoutez votre première pièce depuis « Mes œuvres ».
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {artworks.slice(0, 4).map((art: any) => (
            <div key={art.id} className="rounded-md overflow-hidden bg-white border border-bordure">
              <div
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundColor: "#E4D9C8",
                  backgroundImage: art.imageUrl ? `url(${art.imageUrl})` : undefined,
                }}
              />
              <div className="p-4">
                <p className="font-display text-base text-encre">{art.title}</p>
                <p className="text-xs mt-0.5 text-encre/60">
                  {art.status} · {(art.priceCents / 100).toFixed(2)} {art.currency}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
