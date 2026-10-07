"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setToken, ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  // Arrivée depuis la page « Nouveau mot de passe » après un changement réussi.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("reset") === "success") {
      setResetDone(true);
      window.history.replaceState(null, "", "/login");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { accessToken } = await api.login(email, password);
      setToken(accessToken);
      router.push("/overview");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-platre px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-encre mb-1">Drawiful</h1>
        <p className="text-sm text-encre/60 mb-8">Connecte-toi à ta galerie</p>

        {resetDone && (
          <p role="status" className="text-sm text-sauge mb-6">
            Ton mot de passe a été modifié. Connecte-toi avec le nouveau.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5 text-encre/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-bordure bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ocre/40"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="block text-sm text-encre/80">Mot de passe</label>
              <Link href="/forgot-password" className="text-xs text-encre/60 underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-bordure bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ocre/40"
            />
          </div>

          {error && <p className="text-sm text-argile">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
