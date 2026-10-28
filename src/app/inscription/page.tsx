"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api, getToken, setToken } from "@/lib/api";
import { trackMeta } from "@/components/MetaPixel";
import { getAttribution } from "@/lib/attribution";

/*
  Inscription depuis la landing : compte créé (/api/auth/register), puis
  passage direct au paiement Stripe de la formule choisie (14 jours d'essai).

  Version du 21 oct. 2026, pensée pour le téléphone (97 % du trafic) :
  - l'e-mail et le mot de passe d'abord, puis un seul gros bouton ;
  - la formule est déjà choisie (celle de la landing, Artiste par défaut) et
    tient sur une ligne, avec « Changer » pour ouvrir les 3 formules ;
  - la date du premier prélèvement est écrite en clair ;
  - champs en 16 px, sinon l'iPhone zoome sur la page à chaque saisie.
*/

const PLANS = [
  { key: "aspirant", name: "Aspirant", price: 19, line: "5 œuvres, galerie publique" },
  { key: "artiste", name: "Artiste", price: 49, line: "Boutique, galerie 3D, certificats illimités" },
];

function firstChargeDate() {
  const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

const inputClass =
  "w-full rounded-xl border border-[#1C1A17]/20 bg-white px-4 py-3.5 text-base text-[#1C1A17] placeholder:text-[#77706A]/70 focus:outline-none focus:border-[#2B1E2F] focus:ring-2 focus:ring-[#B8912F]/40";

function InscriptionForm() {
  const params = useSearchParams();
  const initial = PLANS.some((p) => p.key === params.get("plan")) ? (params.get("plan") as string) : "artiste";
  const [plan, setPlan] = useState(initial);
  const [showPlans, setShowPlans] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccount, setHasAccount] = useState(false);
  // Calculée côté navigateur uniquement, pour éviter un écart serveur / client à minuit
  const [chargeDate, setChargeDate] = useState<string | null>(null);

  useEffect(() => {
    setHasAccount(!!getToken());
    setChargeDate(firstChargeDate());
  }, []);

  const chosen = useMemo(() => PLANS.find((p) => p.key === plan)!, [plan]);

  async function goToCheckout() {
    const res: any = await api.createSubscriptionCheckout(plan);
    const url = res?.url || res?.checkoutUrl;
    if (!url) throw new Error("Le paiement n'a pas pu démarrer. Réessaie dans un instant.");
    window.location.href = url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Ton mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      const data: any = await api.register(email.trim(), password, getAttribution());
      const token = data?.accessToken || data?.access_token || data?.token;
      if (!token) throw new Error("Compte créé, mais la connexion a échoué. Connecte-toi pour continuer.");
      setToken(token);
      // Pixel Meta : inscription réussie (seulement si le visiteur a accepté
      // les cookies). Petite pause pour que l'envoi parte avant la redirection.
      if (trackMeta("CompleteRegistration", { content_name: plan, status: true })) {
        await new Promise((r) => setTimeout(r, 400));
      }
      await goToCheckout();
    } catch (err: any) {
      const msg: string = err?.message || "";
      setError(
        err?.status === 409 || /existe|already|utilis/i.test(msg)
          ? "Un compte existe déjà avec cet e-mail. Connecte-toi pour démarrer ton essai."
          : msg || "L'inscription n'a pas pu aboutir. Réessaie dans un instant.",
      );
      setLoading(false);
    }
  }

  async function continueWithAccount() {
    setLoading(true);
    setError(null);
    try {
      await goToCheckout();
    } catch (err: any) {
      setError(err?.message || "Le paiement n'a pas pu démarrer.");
      setLoading(false);
    }
  }

  const reassurance = (
    <p className="text-[13px] leading-relaxed text-[#77706A] text-center">
      Carte demandée à l'étape suivante, sur la page sécurisée Stripe.
      <br />
      Aucun débit avant le {chargeDate ?? "14e jour"} · annulable en 1 clic.
    </p>
  );

  // Formule : une ligne, « Changer » ouvre les choix (Gallery est sur devis, hors inscription)
  const planPicker = (
    <div className="rounded-xl border border-[#1C1A17]/12 bg-white/70">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm leading-snug">
          Formule <strong>{chosen.name}</strong>
          <span className="text-[#77706A]"> · {chosen.price} €/mois après l'essai</span>
        </p>
        <button
          type="button"
          onClick={() => setShowPlans((v) => !v)}
          aria-expanded={showPlans}
          aria-controls="choix-formule"
          className="shrink-0 text-sm font-semibold text-[#2B1E2F] underline underline-offset-4 py-1"
        >
          {showPlans ? "Fermer" : "Changer"}
        </button>
      </div>
      {showPlans && (
        <fieldset id="choix-formule" className="border-t border-[#1C1A17]/10 px-2 py-2">
          <legend className="sr-only">Choisir ta formule</legend>
          {PLANS.map((p) => (
            <label
              key={p.key}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 cursor-pointer ${
                plan === p.key ? "bg-[#F7F5F0]" : "hover:bg-[#F7F5F0]/60"
              }`}
            >
              <input
                type="radio"
                name="plan"
                value={p.key}
                checked={plan === p.key}
                onChange={() => {
                  setPlan(p.key);
                  setShowPlans(false);
                }}
                className="h-4 w-4 accent-[#2B1E2F]"
              />
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-sm">{p.name}</span>
                <span className="block text-xs text-[#77706A]">{p.line}</span>
              </span>
              <span className="text-sm whitespace-nowrap">
                <strong>{p.price} €</strong>/mois
              </span>
            </label>
          ))}
          <p className="px-3 pt-2 pb-1 text-xs text-[#77706A]">
            Une galerie ou un collectif ? La formule Gallery est sur devis :{" "}
            <a href="mailto:clients@drawiful.app?subject=Formule%20Gallery%20%E2%80%94%20demande%20de%20devis" className="underline underline-offset-2">
              clients@drawiful.app
            </a>
          </p>
        </fieldset>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1A17] grid lg:grid-cols-[1fr_1.1fr]">
      {/* Colonne image (ordinateur) : la galerie qui attend l'artiste */}
      <aside className="relative hidden lg:block bg-[#2B1E2F]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing/salle-haussmann.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1E2F] via-[#2B1E2F]/30 to-transparent" />
        <div className="absolute left-10 right-10 bottom-12 text-[#F7F5F0]">
          <p className="font-display text-4xl leading-tight">Ta galerie ouvre dans quelques minutes.</p>
          <p className="mt-4 text-[#F7F5F0]/75 max-w-md">
            14 jours pour tout essayer : la boutique, la visite 3D, les certificats. 0 % de commission sur tes ventes.
          </p>
        </div>
      </aside>

      <main className="flex justify-center px-5 pt-8 pb-12 sm:py-16 lg:items-center">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display text-2xl text-[#2B1E2F]">
            Drawiful
          </Link>
          <h1 className="font-display text-[32px] leading-tight sm:text-4xl mt-6">Crée ta galerie</h1>
          <p className="text-[15px] text-[#4A4540] mt-2">
            14 jours gratuits, sans engagement. 0 % de commission sur tes ventes.
          </p>

          {hasAccount ? (
            <div className="mt-7 space-y-4">
              <div className="rounded-xl border border-[#1C1A17]/15 bg-white p-4 text-sm">
                Tu es déjà connecté à ton compte Drawiful.
              </div>
              {planPicker}
              <button
                type="button"
                onClick={continueWithAccount}
                disabled={loading}
                className="w-full rounded-full bg-[#B8912F] py-4 text-[17px] font-semibold text-[#1C1A17] active:bg-[#C9A24A] hover:bg-[#C9A24A] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B1E2F]"
              >
                {loading ? "Ouverture du paiement sécurisé…" : "Démarrer mes 14 jours gratuits"}
              </button>
              {reassurance}
              {error && <p className="text-sm text-[#7A2E2B]" role="alert">{error}</p>}
              <Link href="/overview" className="block text-center text-sm text-[#77706A] hover:text-[#1C1A17]">
                Aller à mon espace
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
                  Ton e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  required
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="prenom@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
                  Choisis un mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    placeholder="8 caractères minimum"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-24`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-sm font-semibold text-[#2B1E2F]"
                  >
                    {showPassword ? "Masquer" : "Afficher"}
                  </button>
                </div>
              </div>

              {planPicker}

              {error && (
                <p className="text-sm text-[#7A2E2B]" role="alert">
                  {error}{" "}
                  {error.includes("existe déjà") && (
                    <Link href="/login" className="underline font-semibold">
                      Se connecter
                    </Link>
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#B8912F] py-4 text-[17px] font-semibold text-[#1C1A17] active:bg-[#C9A24A] hover:bg-[#C9A24A] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B1E2F]"
              >
                {loading ? "Création de ta galerie…" : "Démarrer mes 14 jours gratuits"}
              </button>
              {reassurance}
            </form>
          )}

          <p className="mt-8 text-sm text-center text-[#77706A]">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-[#2B1E2F] font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={null}>
      <InscriptionForm />
    </Suspense>
  );
}
