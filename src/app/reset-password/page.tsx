"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordPage() {
  const router = useRouter();
  // undefined = lecture du lien en cours ; null = pas de jeton dans l'adresse
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
    // Retire le jeton de la barre d'adresse et de l'historique du navigateur.
    if (t) window.history.replaceState(null, "", "/reset-password");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // 400 : soit un mot de passe refusé (message en français), soit un lien
        // invalide ou expiré (y compris un jeton tronqué en copiant le lien).
        const msg = Array.isArray(data.message)
          ? data.message.find((m: string) => m.includes("mot de passe"))
          : data.message;
        setError(
          res.status === 400
            ? msg || "Ce lien est invalide ou a expiré. Fais une nouvelle demande."
            : "Modification impossible pour le moment. Réessaie dans un instant."
        );
        setLoading(false);
        return;
      }
      router.push("/login?reset=success");
    } catch {
      setError("Modification impossible pour le moment. Réessaie dans un instant.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-platre px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-encre mb-1">Nouveau mot de passe</h1>

        {token === undefined ? null : token === null ? (
          <>
            <p className="text-sm text-encre/70 mt-4 mb-8 leading-relaxed">
              Ce lien est incomplet. Ouvre le lien reçu par e-mail en entier, ou fais une nouvelle demande.
            </p>
            <Link
              href="/forgot-password"
              className="block w-full py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium text-center"
            >
              Faire une nouvelle demande
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-encre/60 mb-8">Choisis un mot de passe d'au moins 8 caractères.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm mb-1.5 text-encre/80">
                  Nouveau mot de passe
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
                  className="w-full px-3.5 py-2.5 rounded-md border border-bordure bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ocre/40"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm mb-1.5 text-encre/80">
                  Confirme le mot de passe
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md border border-bordure bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ocre/40"
                />
              </div>

              {error && (
                <div className="text-sm text-argile">
                  <p>{error}</p>
                  {error.includes("expiré") && (
                    <Link href="/forgot-password" className="underline">
                      Faire une nouvelle demande
                    </Link>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium disabled:opacity-60"
              >
                {loading ? "Enregistrement..." : "Enregistrer le mot de passe"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
