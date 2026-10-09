"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api, getToken, setToken } from "@/lib/api";

/*
  Inscription depuis la landing : compte créé (/api/auth/register), puis
  passage direct au paiement Stripe de la formule choisie (14 jours d'essai).
  Remplace le parcours d'inscription Bubble.
*/

const PLANS = [
  { key: "aspirant", name: "Aspirant", price: 19, line: "5 œuvres, galerie publique" },
  { key: "artiste", name: "Artiste", price: 49, line: "Boutique, galerie 3D, certificats illimités" },
  { key: "studio", name: "Gallery", price: 149, line: "Jusqu'à 10 artistes, galeries 3D illimitées" },
];

function InscriptionForm() {
  const params = useSearchParams();
  const initial = PLANS.some((p) => p.key === params.get("plan")) ? (params.get("plan") as string) : "artiste";
  const [plan, setPlan] = useState(initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => setHasAccount(!!getToken()), []);

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
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      const data: any = await api.register(email.trim(), password);
      const token = data?.accessToken || data?.access_token || data?.token;
      if (!token) throw new Error("Compte créé, mais la connexion a échoué. Connecte-toi pour continuer.");
      setToken(token);
      await goToCheckout();
    } catch (err: any) {
      const msg: string = err?.message || "";
      setError(
        err?.status === 409 || /existe|already|utilis/i.test(msg)
          ? "Un compte existe déjà avec cet e-mail. Connecte-toi pour choisir ta formule."
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

  const chosen = PLANS.find((p) => p.key === plan)!;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1A17] grid lg:grid-cols-[1fr_1.1fr]">
      {/* Colonne image : la galerie qui attend l'artiste */}
      <aside className="relative hidden lg:block bg-[#2B1E2F]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing/salle-haussmann.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1E2F] via-[#2B1E2F]/30 to-transparent" />
        <div className="absolute left-10 right-10 bottom-12 text-[#F7F5F0]">
          <p className="font-display text-4xl leading-tight">Votre galerie ouvre dans quelques minutes.</p>
          <p className="mt-4 text-[#F7F5F0]/75 max-w-md">
            14 jours pour tout essayer : la boutique, la visite 3D, les certificats. Sans engagement.
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display text-2xl text-[#2B1E2F]">
            Drawiful
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl mt-8">Créer ma galerie</h1>
          <p className="text-sm text-[#77706A] mt-2">14 jours d'essai gratuit. Rien n'est prélevé avant la fin de l'essai.</p>

          <fieldset className="mt-8">
            <legend className="text-sm font-semibold mb-3">Formule</legend>
            <div className="flex flex-col gap-2">
              {PLANS.map((p) => (
                <label
                  key={p.key}
                  className={`flex items-center gap-4 rounded-md border px-4 py-3 cursor-pointer transition-colors ${
                    plan === p.key ? "border-[#2B1E2F] bg-white" : "border-[#1C1A17]/15 hover:border-[#1C1A17]/35"
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={p.key}
                    checked={plan === p.key}
                    onChange={() => setPlan(p.key)}
                    className="accent-[#2B1E2F]"
                  />
                  <span className="flex-1">
                    <span className="block font-semibold">{p.name}</span>
                    <span className="block text-xs text-[#77706A]">{p.line}</span>
                  </span>
                  <span className="text-sm whitespace-nowrap">
                    <strong>{p.price} €</strong> / mois
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {hasAccount ? (
            <div className="mt-8 rounded-md border border-[#1C1A17]/15 bg-white p-5">
              <p className="text-sm">Tu es déjà connecté à ton compte Drawiful.</p>
              <button
                type="button"
                onClick={continueWithAccount}
                disabled={loading}
                className="mt-4 w-full rounded-full bg-[#2B1E2F] py-3.5 text-[#F7F5F0] font-semibold disabled:opacity-60"
              >
                {loading ? "Redirection vers le paiement…" : `Démarrer l'essai ${chosen.name}`}
              </button>
              <Link href="/overview" className="mt-3 block text-center text-sm text-[#77706A] hover:text-[#1C1A17]">
                Aller à mon espace
              </Link>
              {error && <p className="mt-3 text-sm text-[#7A2E2B]">{error}</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-[#1C1A17]/20 bg-white px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8912F]/50"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-[#1C1A17]/20 bg-white px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B8912F]/50"
                />
                <p className="text-xs text-[#77706A] mt-1.5">8 caractères minimum.</p>
              </div>

              {error && (
                <p className="text-sm text-[#7A2E2B]">
                  {error}{" "}
                  {error.includes("existe déjà") && (
                    <Link href="/login" className="underline">
                      Se connecter
                    </Link>
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#2B1E2F] py-3.5 text-[#F7F5F0] font-semibold disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8912F]"
              >
                {loading ? "Création de ta galerie…" : `Créer ma galerie et démarrer l'essai`}
              </button>
              <p className="text-xs text-[#77706A] text-center">
                Paiement sécurisé par Stripe. Tu peux annuler à tout moment depuis ton espace.
              </p>
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
