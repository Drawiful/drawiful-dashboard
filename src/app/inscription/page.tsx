"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api, getToken, setToken } from "@/lib/api";
import { trackMeta } from "@/components/MetaPixel";
import { getAttribution } from "@/lib/attribution";

/*
  Inscription : essai gratuit de 14 jours, sans carte bancaire.
  Le compte est créé (/api/auth/register) avec tout ouvert pendant 14 jours,
  puis l'artiste arrive directement dans son tableau de bord. La formule se
  choisit plus tard, depuis la page Abonnement (rien n'est prélevé avant la
  fin de l'essai).

  Pensée pour le téléphone : deux champs, un seul bouton, champs en 16 px
  (sinon l'iPhone zoome sur la page à chaque saisie).
  La formule vue sur la landing (?plan=…) est retenue pour la page Abonnement.
*/

const inputClass =
  "w-full rounded-xl border border-[#1C1A17]/20 bg-white px-4 py-3.5 text-base text-[#1C1A17] placeholder:text-[#77706A]/70 focus:outline-none focus:border-[#2B1E2F] focus:ring-2 focus:ring-[#B8912F]/40";

function trialEndDate() {
  const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function InscriptionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Calculée côté navigateur uniquement, pour éviter un écart serveur / client à minuit
  const [endDate, setEndDate] = useState<string | null>(null);

  useEffect(() => {
    // Déjà connecté : directement au tableau de bord
    if (getToken()) {
      router.replace("/overview");
      return;
    }
    setEndDate(trialEndDate());
    const plan = params.get("plan");
    if (plan === "aspirant" || plan === "artiste") {
      try {
        localStorage.setItem("drawiful_plan", plan);
      } catch {}
    }
  }, [router, params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Votre mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      const data: any = await api.register(email.trim(), password, getAttribution());
      const token = data?.accessToken || data?.access_token || data?.token;
      if (!token) throw new Error("Votre compte est créé, mais la connexion a échoué. Connectez-vous pour continuer.");
      setToken(token);
      // Pixel Meta : inscription réussie (seulement si le visiteur a accepté
      // les cookies). Petite pause pour que l'envoi parte avant la redirection.
      if (trackMeta("CompleteRegistration", { content_name: "essai", status: true })) {
        await new Promise((r) => setTimeout(r, 400));
      }
      router.replace("/overview?bienvenue=1");
    } catch (err: any) {
      const msg: string = err?.message || "";
      setError(
        err?.status === 409 || /existe|already|utilis/i.test(msg)
          ? "Un compte existe déjà avec cette adresse e-mail."
          : msg || "L'inscription n'a pas pu aboutir. Réessayez dans un instant.",
      );
      setLoading(false);
    }
  }

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
          <p className="font-display text-4xl leading-tight">Votre galerie ouvre dans quelques minutes.</p>
          <p className="mt-4 text-[#F7F5F0]/75 max-w-md">
            14 jours pour tout essayer : la galerie 3D, la boutique, les certificats. Vous pouvez vendre dès l'essai,
            sans commission.
          </p>
        </div>
      </aside>

      <main className="flex justify-center px-5 pt-8 pb-12 sm:py-16 lg:items-center">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display text-2xl text-[#2B1E2F]">
            Drawiful
          </Link>
          <h1 className="font-display text-[32px] leading-tight sm:text-4xl mt-6">Créez votre galerie</h1>
          <p className="text-[15px] text-[#4A4540] mt-2">
            14 jours gratuits, sans carte bancaire. 0 % de commission sur vos ventes.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
                Votre e-mail
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
                Choisissez un mot de passe
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
              {loading ? "Création de votre galerie…" : "Créer ma galerie gratuitement"}
            </button>
            <p className="text-[13px] leading-relaxed text-[#77706A] text-center">
              Sans carte bancaire · essai jusqu'au {endDate ?? "14e jour"}
              <br />
              Vous choisirez votre formule plus tard, si Drawiful vous plaît.
            </p>
          </form>

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
