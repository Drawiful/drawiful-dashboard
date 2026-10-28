"use client";
import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

// Bandeau de la vue d'ensemble : tant que l'artiste n'a pas terminé son
// inscription Stripe Connect, sa boutique n'affiche pas de bouton d'achat.
export default function PaymentsSetupBanner({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // À chaque visite de la vue d'ensemble, on interroge Stripe : ça met à jour
  // l'état des paiements et aligne le nom / logo affichés aux acheteurs sur
  // la galerie (le backend ne fait la mise à jour que si quelque chose a changé).
  const accountId = profile?.stripeAccountId;
  useEffect(() => {
    if (accountId) api.getConnectStatus().catch(() => {});
  }, [accountId]);

  if (!profile || profile.stripeOnboardingDone) return null;
  // Formule sans boutique (Aspirant) : rien à configurer pour l'instant
  if (profile.limits && !profile.limits.shop) return null;

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.createConnectOnboarding();
      const url = res?.url ?? res?.onboardingUrl;
      if (url) {
        window.location.href = url;
        return;
      }
      setError("Impossible d'ouvrir Stripe pour le moment. Réessayez dans un instant.");
    } catch {
      setError("Impossible d'ouvrir Stripe pour le moment. Réessayez dans un instant.");
    }
    setLoading(false);
  }

  return (
    <div className="mb-8 rounded-md border border-ocre/40 bg-ocre/10 p-5 flex flex-wrap items-center gap-4">
      <CreditCard size={22} className="text-argile shrink-0" strokeWidth={1.8} />
      <div className="flex-1 min-w-[240px]">
        <p className="text-sm font-medium text-encre">Activez les paiements pour vendre vos œuvres</p>
        <p className="text-xs mt-1 text-encre/60">
          Tant que ce n'est pas fait, vos visiteurs voient « Vente en ligne bientôt disponible » à la place du bouton
          d'achat. Comptez 5 minutes avec Stripe : identité et IBAN pour recevoir vos ventes.
        </p>
        {error && <p className="text-xs mt-2 text-argile">{error}</p>}
      </div>
      <button
        onClick={start}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium disabled:opacity-60"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? "Ouverture de Stripe..." : "Activer les paiements"}
      </button>
    </div>
  );
}
