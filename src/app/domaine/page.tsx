"use client";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";

type DnsRecord = { type: string; name: string; value: string; reason?: string };
type DomainStatus = {
  slug: string;
  rootDomain: string;
  defaultUrl: string;
  customDomain: string | null;
  verified: boolean;
  records: DnsRecord[];
};

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])$/;

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="ml-2 text-xs text-ocre hover:underline"
    >
      {done ? "Copié" : "Copier"}
    </button>
  );
}

export default function DomainPage() {
  const [status, setStatus] = useState<DomainStatus | null>(null);
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    const s: DomainStatus = await api.getMyDomain();
    setStatus(s);
    setSlug(s.slug);
    setDomain(s.customDomain ?? "");
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function run(key: string, fn: () => Promise<unknown>, ok?: string) {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      await fn();
      await load();
      if (ok) setNotice(ok);
    } catch (e: any) {
      setError(e?.message || "Une erreur est survenue");
    } finally {
      setBusy(null);
    }
  }

  function saveSlug(e: React.FormEvent) {
    e.preventDefault();
    const value = slug.trim().toLowerCase();
    if (!SLUG_RE.test(value)) {
      setError("2 à 63 caractères : lettres minuscules, chiffres et tirets (pas de tiret au début ni à la fin).");
      return;
    }
    run("slug", () => api.updateMyProfile({ slug: value }), "Adresse mise à jour.");
  }

  function saveDomain(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    run("domain", () => api.setMyDomain(domain.trim()), "Domaine enregistré. Crée maintenant les lignes DNS ci-dessous.");
  }

  if (!status) {
    return (
      <DashboardShell>
        <p className="text-sm text-encre/60">{error ?? "Chargement…"}</p>
      </DashboardShell>
    );
  }

  const slugChanged = slug.trim().toLowerCase() !== status.slug;

  return (
    <DashboardShell>
      <div className="max-w-2xl">
        <h2 className="font-display text-4xl text-encre mb-2">Adresse & domaine</h2>
        <p className="text-sm text-encre/60 mb-8">
          Ta galerie a toujours une adresse Drawiful. Tu peux aussi y relier ton propre nom de domaine.
        </p>

        {error && <p className="mb-6 text-sm text-argile">{error}</p>}
        {notice && <p className="mb-6 text-sm text-green-700">{notice}</p>}

        {/* Adresse Drawiful */}
        <section className="bg-white border border-bordure rounded-lg p-6 mb-6">
          <h2 className="font-display text-xl text-encre mb-1">Adresse Drawiful</h2>
          <p className="text-sm text-encre/60 mb-4">
            En ligne maintenant :{" "}
            <a href={status.defaultUrl} target="_blank" rel="noreferrer" className="text-ocre hover:underline">
              {status.defaultUrl.replace("https://", "")}
            </a>
          </p>
          <form onSubmit={saveSlug} className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-1 items-center rounded-md border border-bordure bg-white focus-within:ring-2 focus-within:ring-ocre/40">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                maxLength={63}
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-l-md text-sm focus:outline-none"
                aria-label="Nom de la galerie dans l'adresse"
              />
              <span className="px-3 text-sm text-encre/50 whitespace-nowrap">.{status.rootDomain}</span>
            </div>
            <button
              type="submit"
              disabled={!slugChanged || busy === "slug"}
              className="px-5 py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium disabled:opacity-50"
            >
              {busy === "slug" ? "Enregistrement…" : "Enregistrer"}
            </button>
          </form>
          {slugChanged && (
            <p className="text-xs text-encre/50 mt-3">
              Attention : l'ancienne adresse ne fonctionnera plus. Pense à mettre à jour tes liens (Instagram, cartes de visite…).
            </p>
          )}
        </section>

        {/* Domaine personnalisé */}
        <section className="bg-white border border-bordure rounded-lg p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-xl text-encre">Domaine personnalisé</h2>
            {status.customDomain && (
              <span
                className={`text-xs px-2.5 py-1 rounded-full ${
                  status.verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {status.verified ? "Actif" : "En attente de configuration"}
              </span>
            )}
          </div>
          <p className="text-sm text-encre/60 mb-4">
            Exemple : <span className="text-encre">www.sagalerie.com</span>. Achète ton domaine chez l'hébergeur de ton choix
            (OVH, Namecheap, Gandi…), puis saisis-le ici.
          </p>

          <form onSubmit={saveDomain} className="flex flex-col sm:flex-row gap-3">
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="www.sagalerie.com"
              className="flex-1 px-3.5 py-2.5 rounded-md border border-bordure bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ocre/40"
              aria-label="Domaine personnalisé"
            />
            <button
              type="submit"
              disabled={busy === "domain" || !domain.trim() || domain.trim().toLowerCase() === status.customDomain}
              className="px-5 py-2.5 rounded-md bg-aubergine text-platre text-sm font-medium disabled:opacity-50"
            >
              {busy === "domain" ? "Connexion…" : status.customDomain ? "Changer" : "Connecter"}
            </button>
          </form>

          {status.customDomain && !status.verified && (
            <div className="mt-6">
              <p className="text-sm text-encre mb-3">
                Chez ton hébergeur de domaine, crée {status.records.length > 1 ? "ces lignes" : "cette ligne"} dans la zone DNS
                de <strong>{status.customDomain}</strong> :
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-bordure rounded-md">
                  <thead className="bg-platre text-encre/70">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Type</th>
                      <th className="text-left px-3 py-2 font-medium">Nom / Hôte</th>
                      <th className="text-left px-3 py-2 font-medium">Valeur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.records.map((r, i) => (
                      <tr key={i} className="border-t border-bordure align-top">
                        <td className="px-3 py-2 font-mono">{r.type}</td>
                        <td className="px-3 py-2 font-mono">
                          {r.name}
                          <CopyButton text={r.name} />
                        </td>
                        <td className="px-3 py-2 font-mono break-all">
                          {r.value}
                          <CopyButton text={r.value} />
                          {r.reason && <div className="text-xs text-encre/50 font-sans mt-1">{r.reason}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-encre/50 mt-3">
                La prise en compte prend en général de 10 minutes à quelques heures. Le certificat HTTPS est créé
                automatiquement.
              </p>
            </div>
          )}

          {status.customDomain && status.verified && (
            <p className="text-sm text-encre mt-5">
              Ta galerie est en ligne sur{" "}
              <a
                href={`https://${status.customDomain}`}
                target="_blank"
                rel="noreferrer"
                className="text-ocre hover:underline"
              >
                {status.customDomain}
              </a>
              .
            </p>
          )}

          {status.customDomain && (
            <div className="flex flex-wrap gap-3 mt-5">
              {!status.verified && (
                <button
                  type="button"
                  onClick={() =>
                    run(
                      "verify",
                      async () => {
                        const s: DomainStatus = await api.verifyMyDomain();
                        if (!s.verified) {
                          throw new Error(
                            "Pas encore détecté. Vérifie les lignes DNS ; la propagation peut prendre jusqu'à quelques heures.",
                          );
                        }
                      },
                      "Domaine vérifié : ta galerie est en ligne !",
                    )
                  }
                  disabled={busy === "verify"}
                  className="px-5 py-2.5 rounded-md border border-aubergine text-aubergine text-sm font-medium disabled:opacity-50"
                >
                  {busy === "verify" ? "Vérification…" : "Vérifier"}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Déconnecter ${status.customDomain} de ta galerie ?`)) {
                    run("remove", () => api.removeMyDomain(), "Domaine déconnecté.");
                  }
                }}
                disabled={busy === "remove"}
                className="px-5 py-2.5 rounded-md text-argile text-sm disabled:opacity-50"
              >
                Déconnecter le domaine
              </button>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
