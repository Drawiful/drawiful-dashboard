"use client";
import { useState } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Envoi impossible pour le moment. Vérifie ton adresse et réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-platre px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-encre mb-1">Mot de passe oublié</h1>

        {sent ? (
          <>
            <p className="text-sm text-encre/70 mt-4 mb-2 leading-relaxed">
              Si un compte existe pour <strong className="text-encre">{email.trim()}</strong>, tu vas recevoir un
              e-mail avec un lien pour choisir un nouveau mot de passe. Le lien est valable 1 heure.
            </p>
            <p className="text-sm text-encre/60 mb-8">Pense à regarder dans tes spams.</p>
            <Link href="/login" className="text-sm text-encre underline">
              Retour à la connexion
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-encre/60 mb-8">
              Indique l'e-mail de ton compte : on t'envoie un lien pour choisir un nouveau mot de passe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-1.5 text-encre/80">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md border border-bordure bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ocre/40"
                />
              </div>

              {error && <p className="text-sm text-argile">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium disabled:opacity-60"
              >
                {loading ? "Envoi..." : "Envoyer le lien"}
              </button>
            </form>

            <p className="mt-6 text-center">
              <Link href="/login" className="text-sm text-encre/70 underline">
                Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
